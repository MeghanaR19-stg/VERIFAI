// VERIFAI compliance engine (single-file backend function).
//
// POST { submission_id }      -> verify one submission
// POST { scope: "pending" }   -> verify every submission that has no evidence yet
// POST { scope: "all" }       -> re-run verification for every submission
//
// The engine owns the deterministic rules, the server-side AI semantic pass,
// the persisted evidence records and the audit trail. The browser only reads
// what this function stored. The AI token stays on the server.
//
// Sections: 1 types and helpers | 2 deterministic rules | 3 semantic reasoning | 4 HTTP entry
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// ---------------------------------------------------------------------------
// 1. Types and shared helpers
// ---------------------------------------------------------------------------

type Result = "PASS" | "FAIL" | "REVIEW";

interface RequirementRow {
  id: string;
  tender_id: string;
  label: string;
  requirement_type: string;
  threshold_value: number | null;
  threshold_unit: string | null;
  display_value: string;
  mandatory: boolean;
  verification_method: string;
  project_characteristics: string | null;
  sort_order: number;
}

interface BidderRow {
  id: string;
  name: string;
  registered_name: string;
  turnover_cr: number;
  similar_projects: number;
  experience_years: number;
  gst_status: string;
  gstin: string | null;
  oem_authorization: boolean;
  iso_13485: boolean;
  city: string | null;
  data_notice: string;
}

interface DocumentRow {
  id: string;
  submission_id: string;
  name: string;
  doc_type: string;
  status: string;
  source_page: number | null;
  extraction_method: string;
  confidence: number | null;
  extracted_fields: Record<string, unknown> | null;
}

interface VerificationRow {
  bidder_id: string;
  check_type: string;
  identifier: string | null;
  status: string;
  source_adapter: string;
  detail: string | null;
  checked_at: string;
}

interface SubmissionRow {
  id: string;
  tender_id: string;
  bidder_id: string;
  submitted_at: string;
  status: string;
}

interface TenderRow {
  id: string;
  name: string;
  department: string;
}

interface EvidenceDraft {
  requirement_id: string;
  result: Result;
  method: string;
  extracted_value: string;
  source_document: string | null;
  source_page: number | null;
  rule_expression: string | null;
  reasoning: string;
  confidence: number | null;
}

interface SubmittedProject {
  name: string;
  value_cr: number | null;
  category: string;
  hint: string;
}

interface ProjectJudgement extends SubmittedProject {
  match: "strong" | "partial" | "weak";
  reason: string;
}

interface EntityFinding {
  detected: boolean;
  confidence: number;
  explanation: string;
}

interface SemanticResult {
  mode: "live" | "demo_reasoning";
  model: string | null;
  projects: ProjectJudgement[];
  entity: EntityFinding;
  assessment: string;
  reviewNotes: string[];
}

function inr(value: number): string {
  return `\u20b9${value.toFixed(2)} Cr`;
}

function numberOrNull(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(n) ? n : null;
}

function fieldsOf(doc: DocumentRow | undefined): Record<string, unknown> {
  return (doc?.extracted_fields ?? {}) as Record<string, unknown>;
}

function findDoc(docs: DocumentRow[], docType: string): DocumentRow | undefined {
  return docs.find((d) => d.doc_type === docType);
}

function projectListOf(doc: DocumentRow | undefined): SubmittedProject[] {
  const raw = fieldsOf(doc)["projects"];
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
    .map((p) => ({
      name: String(p["name"] ?? "Unnamed project"),
      value_cr: numberOrNull(p["value_cr"]),
      category: String(p["category"] ?? ""),
      hint: String(p["match"] ?? "strong"),
    }));
}

const STOP_WORDS = new Set([
  "and", "the", "for", "with", "from", "completed", "similar", "project", "projects",
  "supply", "installation", "deployment", "work", "works", "of", "a", "an", "in", "at",
]);

function tokens(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

/**
 * Deterministic guard: does a submitted project's category relate to the
 * tender's required project characteristics? Semantic reasoning can never
 * promote an unrelated project to a strong match.
 */
function relatesTo(category: string, characteristics: string): boolean {
  if (!characteristics.trim()) return true;
  const required = tokens(characteristics);
  const submitted = tokens(category);
  return submitted.some((t) => required.includes(t));
}

const LEGAL_SUFFIXES = new Set([
  "pvt", "private", "ltd", "limited", "llp", "inc", "co", "company", "corporation", "corp",
]);

/** Normalises a legal entity name for comparison: case, punctuation and legal suffixes only. */
function normalizeEntity(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !LEGAL_SUFFIXES.has(t))
    .join(" ");
}

/** True when the OEM letter names a different legal entity than the registered bidder. */
function entityMismatch(registeredName: string, oemEntityName: string | null): boolean {
  if (!oemEntityName) return false;
  const a = normalizeEntity(registeredName);
  const b = normalizeEntity(oemEntityName);
  return a.length > 0 && b.length > 0 && a !== b;
}

// ---------------------------------------------------------------------------
// 2. Deterministic compliance rules
// ---------------------------------------------------------------------------

interface RuleContext {
  requirement: RequirementRow;
  bidder: BidderRow;
  documents: DocumentRow[];
  verifications: VerificationRow[];
  semantic: SemanticResult;
}

const TURNOVER_DOC = "AUDITED_FINANCIAL_STATEMENT";
const EXPERIENCE_DOC = "EXPERIENCE_CERTIFICATE";
const GST_DOC = "GST_CERTIFICATE";
const OEM_DOC = "OEM_AUTHORIZATION";
const ISO_DOC = "ISO_CERTIFICATE";

function evidence(requirement: RequirementRow, patch: Partial<EvidenceDraft>): EvidenceDraft {
  return {
    requirement_id: requirement.id,
    result: "REVIEW",
    method: "RULE VERIFIED",
    extracted_value: "Not available",
    source_document: null,
    source_page: null,
    rule_expression: null,
    reasoning: "",
    confidence: null,
    ...patch,
  };
}

function evalTurnover(ctx: RuleContext): EvidenceDraft {
  const { requirement, bidder, documents } = ctx;
  const required = numberOrNull(requirement.threshold_value) ?? 0;
  const doc = findDoc(documents, TURNOVER_DOC);
  if (!doc) {
    return evidence(requirement, {
      result: "FAIL",
      reasoning: `No audited financial statement is on record, so turnover against the ${inr(required)} minimum could not be established.`,
      rule_expression: `${required.toFixed(2)} required (no financial evidence)`,
    });
  }
  const actual = numberOrNull(fieldsOf(doc)["turnover_cr"]);
  if (actual === null) {
    return evidence(requirement, {
      result: "REVIEW",
      method: "DOCUMENT EVIDENCE",
      extracted_value: "Unreadable",
      source_document: doc.name,
      source_page: doc.source_page,
      confidence: doc.confidence,
      reasoning: "The audited financial statement is on record but the turnover figure could not be extracted from it.",
      rule_expression: `${required.toFixed(2)} required (value not extracted)`,
    });
  }
  const passes = actual >= required;
  const marginal = passes && actual < required * 1.02;
  return evidence(requirement, {
    result: passes ? (marginal ? "REVIEW" : "PASS") : "FAIL",
    extracted_value: inr(actual),
    source_document: doc.name,
    source_page: doc.source_page,
    confidence: doc.confidence,
    rule_expression: `${actual.toFixed(2)} ${passes ? ">=" : "<"} ${required.toFixed(2)}`,
    reasoning: passes
      ? marginal
        ? `Audited turnover of ${inr(actual)} clears the ${inr(required)} minimum only marginally, so officer confirmation of the financial evidence is advised.`
        : `Audited turnover of ${inr(actual)} meets the ${inr(required)} minimum declared in the tender for ${bidder.name}.`
      : `Audited turnover of ${inr(actual)} is below the ${inr(required)} minimum declared in the tender.`,
  });
}

function evalExperience(ctx: RuleContext): EvidenceDraft {
  const { requirement, documents } = ctx;
  const required = numberOrNull(requirement.threshold_value) ?? 0;
  const doc = findDoc(documents, EXPERIENCE_DOC);
  if (!doc) {
    return evidence(requirement, {
      result: "FAIL",
      reasoning: `No experience certificate is on record, so the ${required} year experience requirement could not be established.`,
      rule_expression: `${required} years required (no experience evidence)`,
    });
  }
  const actual = numberOrNull(fieldsOf(doc)["experience_years"]);
  if (actual === null) {
    return evidence(requirement, {
      result: "REVIEW",
      method: "DOCUMENT EVIDENCE",
      extracted_value: "Unreadable",
      source_document: doc.name,
      source_page: doc.source_page,
      confidence: doc.confidence,
      reasoning: "The experience certificate is on record but the years of experience could not be extracted from it.",
      rule_expression: `${required} years required (value not extracted)`,
    });
  }
  const passes = actual >= required;
  return evidence(requirement, {
    result: passes ? "PASS" : "FAIL",
    extracted_value: `${actual} years`,
    source_document: doc.name,
    source_page: doc.source_page,
    confidence: doc.confidence,
    rule_expression: `${actual} >= ${required}`,
    reasoning: passes
      ? `Documented experience of ${actual} years meets the ${required} year minimum.`
      : `Documented experience of ${actual} years is below the ${required} year minimum.`,
  });
}

function evalProjects(ctx: RuleContext): EvidenceDraft {
  const { requirement, documents, semantic } = ctx;
  const required = numberOrNull(requirement.threshold_value) ?? 0;
  const characteristics = requirement.project_characteristics ?? "";
  const doc = findDoc(documents, EXPERIENCE_DOC);
  if (!doc) {
    return evidence(requirement, {
      result: "FAIL",
      method: "AI ASSISTED",
      reasoning: "No experience certificate is on record, so completed project evidence could not be established.",
      rule_expression: `${required} similar projects required (no project evidence)`,
    });
  }

  const submitted = projectListOf(doc);
  if (submitted.length === 0) {
    return evidence(requirement, {
      result: "REVIEW",
      method: "AI ASSISTED",
      extracted_value: "No projects listed",
      source_document: doc.name,
      source_page: doc.source_page,
      confidence: doc.confidence,
      reasoning: "The experience certificate does not list any completed projects in a readable form.",
      rule_expression: `${required} similar projects required (none readable)`,
    });
  }

  const judged: ProjectJudgement[] = submitted.map((project) => {
    const fromSemantic = semantic.projects.find((p) => p.name === project.name);
    const related = relatesTo(project.category, characteristics);
    const match: ProjectJudgement["match"] = !related
      ? "weak"
      : fromSemantic?.match === "partial" || project.hint === "partial"
        ? "partial"
        : "strong";
    return {
      ...project,
      match,
      reason:
        fromSemantic?.reason ??
        (match === "weak"
          ? `Category "${project.category}" does not correspond to the required characteristics (${characteristics}).`
          : `Category "${project.category}" corresponds to the required characteristics.`),
    };
  });

  const strong = judged.filter((p) => p.match === "strong").length;
  const partial = judged.filter((p) => p.match === "partial").length;
  const summary = `${strong} strong${partial > 0 ? ` + ${partial} partial` : ""} (of ${judged.length} submitted)`;

  let result: Result = "REVIEW";
  let reasoning: string;
  if (strong >= required && partial === 0) {
    result = "PASS";
    reasoning = `All ${judged.length} submitted projects correspond to the tender's required project characteristics, with ${strong} strong matches against ${required} required.`;
  } else if (strong >= required && partial > 0) {
    reasoning = `The submitted evidence partially matches the tender's required project characteristics and requires officer review. ${strong} projects match strongly and ${partial} matches only partially.`;
  } else if (strong > 0) {
    reasoning = `Only ${strong} of ${judged.length} submitted projects correspond to the tender's required project characteristics (${required} required). The remaining evidence is a potential mismatch and requires officer review.`;
  } else {
    reasoning = `None of the ${judged.length} submitted projects correspond to the tender's required project characteristics (${characteristics}). This is an evidence mismatch that requires officer review before determination.`;
  }

  return evidence(requirement, {
    result,
    method: "AI ASSISTED",
    extracted_value: summary,
    source_document: doc.name,
    source_page: doc.source_page,
    confidence: doc.confidence,
    rule_expression: `${strong} strong ${strong >= required ? ">=" : "<"} ${required} required`,
    reasoning,
  });
}

function evalGst(ctx: RuleContext): EvidenceDraft {
  const { requirement, bidder, documents, verifications } = ctx;
  const doc = findDoc(documents, GST_DOC);
  const check = verifications.find((v) => v.check_type === "GST");
  const status = check?.status ?? "UNKNOWN";
  const passes = status === "ACTIVE";
  return evidence(requirement, {
    result: passes ? "PASS" : "REVIEW",
    method: "PROTOTYPE SOURCE",
    extracted_value: `${status}${bidder.gstin ? ` (${bidder.gstin})` : ""}`,
    source_document: doc?.name ?? null,
    source_page: doc?.source_page ?? null,
    confidence: doc?.confidence ?? null,
    rule_expression: `status = ${status}`,
    reasoning: passes
      ? `The simulated ${check?.source_adapter ?? "GST verification adapter"} reports GSTIN ${bidder.gstin ?? "on record"} as ACTIVE. Prototype adapter result, not a live government lookup.`
      : `The simulated ${check?.source_adapter ?? "GST verification adapter"} does not report an active registration, so officer verification is required. Prototype adapter result, not a live government lookup.`,
  });
}

function evalOem(ctx: RuleContext): EvidenceDraft {
  const { requirement, bidder, documents, semantic } = ctx;
  const doc = findDoc(documents, OEM_DOC);
  if (!doc) {
    return evidence(requirement, {
      result: "FAIL",
      method: "DOCUMENT EVIDENCE",
      reasoning: "No OEM authorization letter is on record for this submission.",
      rule_expression: "authorization document required (not found)",
    });
  }
  const oemEntity = String(fieldsOf(doc)["entity_name"] ?? "");
  const mismatch = entityMismatch(bidder.registered_name, oemEntity || null);
  if (mismatch) {
    return evidence(requirement, {
      result: "REVIEW",
      method: "AI ASSISTED",
      extracted_value: `Issued to ${oemEntity}`,
      source_document: doc.name,
      source_page: doc.source_page,
      confidence: semantic.entity.confidence,
      rule_expression: `"${oemEntity}" != "${bidder.registered_name}"`,
      reasoning: semantic.entity.explanation,
    });
  }
  return evidence(requirement, {
    result: "PASS",
    method: "DOCUMENT EVIDENCE",
    extracted_value: `Authorized to ${oemEntity || bidder.name}`,
    source_document: doc.name,
    source_page: doc.source_page,
    confidence: doc.confidence,
    rule_expression: `authorization present for "${bidder.registered_name}"`,
    reasoning: `An OEM authorization letter is on record and is issued to the registered bidding entity. Reference: ${String(fieldsOf(doc)["reference"] ?? "not stated")}.`,
  });
}

function evalIso(ctx: RuleContext): EvidenceDraft {
  const { requirement, documents } = ctx;
  const doc = findDoc(documents, ISO_DOC);
  if (!doc) {
    return evidence(requirement, {
      result: "FAIL",
      method: "DOCUMENT EVIDENCE",
      reasoning: "No ISO 13485 certificate is on record for this submission.",
      rule_expression: "ISO 13485 certificate required (not found)",
    });
  }
  const standard = String(fieldsOf(doc)["standard"] ?? "");
  const confirmed = /13485/.test(standard);
  return evidence(requirement, {
    result: confirmed ? "PASS" : "REVIEW",
    method: "DOCUMENT EVIDENCE",
    extracted_value: standard || "Standard not stated",
    source_document: doc.name,
    source_page: doc.source_page,
    confidence: doc.confidence,
    rule_expression: `standard = "${standard || "unknown"}"`,
    reasoning: confirmed
      ? `A valid ${standard} certificate is on record for the bidding entity.`
      : "A certificate is on record but the standard could not be confirmed as ISO 13485, so officer review is required.",
  });
}

const EVALUATORS: Record<string, (ctx: RuleContext) => EvidenceDraft> = {
  turnover: evalTurnover,
  experience: evalExperience,
  similar_projects: evalProjects,
  gst: evalGst,
  oem: evalOem,
  iso: evalIso,
};

function evaluateRequirements(
  ctx: Omit<RuleContext, "requirement">,
  requirements: RequirementRow[],
): EvidenceDraft[] {
  return requirements.map((requirement) => {
    const evaluator = EVALUATORS[requirement.requirement_type];
    if (!evaluator) {
      return evidence(requirement, {
        result: "REVIEW",
        reasoning: "This requirement has no automated check in the prototype and requires officer assessment.",
        rule_expression: "no automated check",
      });
    }
    return evaluator({ ...ctx, requirement });
  });
}

function complianceScore(evidenceRows: EvidenceDraft[]): number {
  if (evidenceRows.length === 0) return 0;
  const passed = evidenceRows.filter((e) => e.result === "PASS").length;
  return Math.round((passed / evidenceRows.length) * 100);
}

function overallStatus(evidenceRows: EvidenceDraft[]): Result {
  if (evidenceRows.some((e) => e.result === "FAIL")) return "FAIL";
  if (evidenceRows.some((e) => e.result === "REVIEW")) return "REVIEW";
  return "PASS";
}

interface RiskAssessment {
  level: "LOW" | "MEDIUM" | "HIGH";
  drivers: string[];
}

function assessRisk(
  evidenceRows: EvidenceDraft[],
  requirements: RequirementRow[],
  verifications: VerificationRow[],
): RiskAssessment {
  const byId = new Map(requirements.map((r) => [r.id, r]));
  const drivers: string[] = [];
  const push = (text: string) => {
    if (!drivers.includes(text)) drivers.push(text);
  };

  let mandatoryFailure = false;

  for (const row of evidenceRows) {
    const requirement = byId.get(row.requirement_id);
    const label = requirement?.label ?? "Requirement";
    const lower = label.toLowerCase();
    if (row.result === "FAIL") {
      if (requirement?.mandatory) mandatoryFailure = true;
      push(requirement?.mandatory ? `Mandatory ${lower} requirement failed` : `${label} requirement failed`);
      if (requirement?.requirement_type === "turnover") push("Financial evidence below threshold");
      if (row.rule_expression?.includes("not found")) push(`Missing evidence: ${label}`);
    } else if (row.result === "REVIEW") {
      if (row.rule_expression?.includes("!=")) push(`Potential entity mismatch on ${lower}`);
      else if (requirement?.requirement_type === "similar_projects") push(`Ambiguous project evidence: ${label}`);
      else push(`Evidence requires officer review: ${label}`);
    }
  }

  for (const check of verifications) {
    const clean = ["ACTIVE", "REGISTERED", "VALID", "COMPLIANT", "NO_RECORD_FOUND", "NOT_EXERCISED"];
    if (!clean.includes(check.status)) push(`Verification issue: ${check.source_adapter}`);
  }

  const hasReview = evidenceRows.some((e) => e.result === "REVIEW");
  const level = mandatoryFailure ? "HIGH" : hasReview || drivers.length > 0 ? "MEDIUM" : "LOW";
  if (drivers.length === 0) push("No adverse evidence identified by the automated checks");
  return { level, drivers };
}

// ---------------------------------------------------------------------------
// 3. Semantic reasoning (live AI with deterministic fallback)
// ---------------------------------------------------------------------------

const AI_BASE_URL = "https://api.enter.pro";
const AI_TOKEN_SECRET = "AI_API_TOKEN_5b8170d98116";
const AI_PROJECT_ID = "5b8170d981164d1a9dd7de7d3962812c";
const AI_MODEL = "google/gemini-3.6-flash";

const SYSTEM_INSTRUCTION = [
  "You are an evidence-analysis assistant supporting a government procurement officer.",
  "You analyse synthetic prototype bid documents and describe evidence only.",
  "Never state an eligibility, qualification, award or rejection decision - the officer decides.",
  "Never use the words fraud, fraudulent, cheating or scam. Use 'potential inconsistency',",
  "'verification issue' or 'evidence mismatch' instead.",
  "Judge each submitted project against the tender's required project characteristics and label it",
  "strong, partial or weak. Explain name differences between the registered bidder and an OEM",
  "authorization letter as a potential entity mismatch requiring officer verification.",
  "A difference in legal suffix only (for example 'Pvt. Ltd.' against 'Private Limited') is NOT an",
  "entity mismatch and must never be reported as one; report a mismatch only when the distinguishing",
  "words of the entity name differ.",
  "Reply with JSON only, matching the requested schema.",
].join(" ");

/** Wording the prototype must not attribute to the model when no mismatch was detected. */
const ENTITY_CLAIM =
  /entity\s+(mismatch|discrepanc)|naming\s+consistenc|name\s+listed\s+on\s+the\s+OEM|corporate\s+suffix|legal\s+suffix/i;

/** Drops sentences that claim an entity mismatch the deterministic check did not find. */
const ABBREVIATION = /\b(Pvt|Ltd|Co|Corp|Inc|No|Nos|Sr|Jr|St|vs|etc|approx|Cr|INR|Govt|Dept)\./gi;
const SENTINEL = "\u0001";

function stripEntityClaims(text: string): string {
  const kept = text
    .replace(ABBREVIATION, `$1${SENTINEL}`)
    .split(/(?<=\.)\s+/)
    .map((sentence) => sentence.replaceAll(SENTINEL, ".").trim())
    .filter((sentence) => sentence.length > 0 && !ENTITY_CLAIM.test(sentence))
    .join(" ")
    .trim();
  return kept.length >= 60 && !ENTITY_CLAIM.test(kept) ? kept : "";
}

interface SemanticParams {
  submissionId: string;
  tenderName: string;
  department: string;
  requirement: RequirementRow | undefined;
  bidder: BidderRow;
  documents: DocumentRow[];
}

/** Removes language the prototype must never use in officer-facing text. */
function sanitize(text: string): string {
  return text
    .replace(/fraudulent(ly)?/gi, "potentially inconsistent")
    .replace(/fraud/gi, "potential inconsistency")
    .replace(/\bcheating\b/gi, "an evidence mismatch")
    .replace(/\bscam\b/gi, "an evidence mismatch");
}

function fallbackProjectJudgement(
  projects: SubmittedProject[],
  characteristics: string,
): ProjectJudgement[] {
  return projects.map((project) => {
    const related = relatesTo(project.category, characteristics);
    const match: ProjectJudgement["match"] = !related
      ? "weak"
      : project.hint === "partial"
        ? "partial"
        : "strong";
    const reason = !related
      ? `Category "${project.category}" does not correspond to the required project characteristics (${characteristics}).`
      : match === "partial"
        ? `Category "${project.category}" corresponds to the requirement only partially, so the submitted evidence needs officer review.`
        : `Category "${project.category}" corresponds to the required project characteristics.`;
    return { ...project, match, reason };
  });
}

function fallbackEntity(bidder: BidderRow, oemEntityName: string | null, detected: boolean): EntityFinding {
  if (!detected) {
    return {
      detected: false,
      confidence: 96,
      explanation: `The OEM authorization letter names the registered bidding entity (${bidder.registered_name}). No entity discrepancy was identified in the submitted evidence.`,
    };
  }
  return {
    detected: true,
    confidence: 82,
    explanation: `The OEM authorization letter is issued to "${oemEntityName}" while the registered bidding entity is "${bidder.registered_name}". Names differ from the registered bidder entity. Verify whether the entities are legally related or whether the authorization applies to the bidding entity.`,
  };
}

function demoReasoning(params: SemanticParams, reason: string | null): SemanticResult {
  const { bidder, documents, requirement } = params;
  const characteristics = requirement?.project_characteristics ?? "";
  const experienceDoc = findDoc(documents, EXPERIENCE_DOC);
  const oemDoc = findDoc(documents, OEM_DOC);
  const submitted = projectListOf(experienceDoc);
  const projects = fallbackProjectJudgement(submitted, characteristics);
  const oemEntityName = oemDoc ? String(fieldsOf(oemDoc)["entity_name"] ?? "") || null : null;
  const detected = entityMismatch(bidder.registered_name, oemEntityName);
  const entity = fallbackEntity(bidder, oemEntityName, detected);

  const reviewNotes: string[] = [];
  const weak = projects.filter((p) => p.match === "weak").length;
  if (weak > 0) {
    reviewNotes.push(`${weak} submitted project(s) do not correspond to the tender's required project characteristics.`);
  }
  if (projects.some((p) => p.match === "partial")) {
    reviewNotes.push("At least one submitted project matches the requirement only partially.");
  }
  if (detected) reviewNotes.push("Potential entity mismatch between the registered bidder and the OEM authorization letter.");

  const turnoverDoc = findDoc(documents, TURNOVER_DOC);
  const turnover = numberOrNull(fieldsOf(turnoverDoc)["turnover_cr"]);
  const experience = numberOrNull(fieldsOf(experienceDoc)["experience_years"]);

  const assessment = sanitize(
    [
      `${bidder.name} declares an audited turnover of ${turnover === null ? "an unreadable value" : inr(turnover)} with ${experience === null ? "an unreadable duration of" : `${experience} years of`} documented experience and ${submitted.length} completed project(s) on record.`,
      `The submission carries ${documents.length} document record(s) processed with prototype extraction, and the entity's registration details are on record.`,
      reviewNotes.length > 0
        ? `Items requiring officer attention: ${reviewNotes.join(" ")}`
        : "No adverse item was identified by the automated checks; the officer remains the deciding authority.",
    ].join(" "),
  );

  return { mode: "demo_reasoning", model: reason, projects, entity, assessment, reviewNotes };
}

/** Returns the first balanced JSON object in the text, or null when it is truncated. */
function firstJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

function extractJson(text: string): Record<string, unknown> {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const object = firstJsonObject(raw);
  if (!object) throw new Error("model returned no complete JSON object");
  return JSON.parse(object) as Record<string, unknown>;
}

/** Salvages the assessment sentence from a truncated model response. */
function salvageAssessment(text: string): string | null {
  const match = text.match(/"assessment"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (!match) return null;
  try {
    return JSON.parse(`"${match[1]}"`) as string;
  } catch {
    return null;
  }
}

/** Consumes the Gemini SSE stream and returns the concatenated text. */
async function readStreamText(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("model returned no stream body");
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  const consume = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return;
    const raw = trimmed.slice(5).trim();
    if (!raw || raw === "[DONE]") return;
    let chunk: Record<string, unknown>;
    try {
      chunk = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return;
    }
    const error = chunk["error"] as { message?: string } | undefined;
    if (error) throw new Error(error.message ?? "AI service error");
    const candidates = chunk["candidates"] as { content?: { parts?: { text?: string }[] } }[] | undefined;
    const parts = candidates?.[0]?.content?.parts ?? [];
    text += parts.map((p) => p.text ?? "").join("");
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) consume(line);
  }
  // Flush whatever is left: a short response can arrive without a trailing newline.
  buffer += decoder.decode();
  for (const line of buffer.split("\n")) consume(line);
  return text;
}

async function analyzeSemantics(params: SemanticParams): Promise<SemanticResult> {
  const { bidder, documents, requirement, tenderName, department, submissionId } = params;
  const experienceDoc = findDoc(documents, EXPERIENCE_DOC);
  const oemDoc = findDoc(documents, OEM_DOC);
  const submitted = projectListOf(experienceDoc);
  const oemEntityName = oemDoc ? String(fieldsOf(oemDoc)["entity_name"] ?? "") || null : null;
  const detected = entityMismatch(bidder.registered_name, oemEntityName);
  const characteristics = requirement?.project_characteristics ?? "";

  const token = Deno.env.get(AI_TOKEN_SECRET);
  if (!token) {
    console.error("run-verification: AI token secret missing, using demo reasoning mode");
    return demoReasoning(params, "AI token not configured");
  }

  try {
    const request = {
      tender: { name: tenderName, department },
      requiredProjectCharacteristics: characteristics,
      registeredBidder: bidder.registered_name,
      bidderDisplayName: bidder.name,
      oemAuthorizationEntity: oemEntityName,
      deterministicEntityMismatch: detected,
      submittedProjects: submitted,
      documents: documents.map((d) => {
        const fields = fieldsOf(d);
        return {
          name: d.name,
          type: d.doc_type,
          turnover_cr: fields["turnover_cr"] ?? null,
          experience_years: fields["experience_years"] ?? null,
          entity_name: fields["entity_name"] ?? null,
          gstin: fields["gstin"] ?? null,
          standard: fields["standard"] ?? null,
          projects: projectListOf(d),
        };
      }),
      instructions: {
        projects: "Return one entry per submitted project, with match as strong, partial or weak, and a one sentence reason.",
        entity: "Explain the difference between the registered bidder and the OEM authorization entity, without deciding the outcome.",
        assessment: "Write a three to four sentence officer-facing assessment of the evidence. Do not state any final decision.",
        reviewNotes: "List short items the officer should review.",
      },
      schema: {
        projects: [{ name: "string", match: "strong|partial|weak", reason: "string" }],
        entity: { explanation: "string" },
        assessment: "string",
        reviewNotes: ["string"],
      },
    };

    const response = await fetch(
      `${AI_BASE_URL}/code/api/ai/v1beta/models/${AI_MODEL}:streamGenerateContent`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": token,
          "Content-Type": "application/json",
          "X-Session-ID": `verifai-${submissionId}`,
          "X-Enter-Project-ID": AI_PROJECT_ID,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ role: "user", parts: [{ text: JSON.stringify(request) }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`AI gateway ${response.status}: ${body.slice(0, 200)}`);
    }

    const streamText = await readStreamText(response);
    const base = demoReasoning(params, null);

    let parsed: Record<string, unknown>;
    try {
      parsed = extractJson(streamText);
    } catch (parseError) {
      // A truncated response still carries a usable assessment sentence.
      const salvaged = salvageAssessment(streamText);
      if (!salvaged) throw parseError;
      console.error(`run-verification: partial AI response for ${submissionId}, using the assessment sentence only`);
      return {
        mode: "live",
        model: AI_MODEL,
        projects: base.projects,
        entity: base.entity,
        assessment: sanitize(salvaged),
        reviewNotes: base.reviewNotes,
      };
    }

    const projects: ProjectJudgement[] = base.projects.map((project) => {
      const match = Array.isArray(parsed["projects"])
        ? (parsed["projects"] as Record<string, unknown>[]).find((p) => String(p?.["name"]) === project.name)
        : undefined;
      const label = String(match?.["match"] ?? "");
      const reason = String(match?.["reason"] ?? "");
      return {
        ...project,
        match: label === "strong" || label === "partial" || label === "weak" ? label : project.match,
        reason: reason ? sanitize(reason) : project.reason,
      };
    });

    const rawEntity = (parsed["entity"] ?? {}) as Record<string, unknown>;
    const explanation = String(rawEntity["explanation"] ?? "").trim();
    const confidence = numberOrNull(rawEntity["confidence"]);
    // The deterministic entity comparison is authoritative: a suffix-only
    // difference is not a mismatch, so the model cannot introduce one.
    const entity: EntityFinding = {
      detected,
      confidence: detected ? (confidence ?? 82) : 96,
      explanation: detected
        ? explanation
          ? sanitize(explanation)
          : base.entity.explanation
        : base.entity.explanation,
    };

    const assessment = String(parsed["assessment"] ?? "").trim();
    const rawNotes = parsed["reviewNotes"];
    const modelNotes = Array.isArray(rawNotes)
      ? rawNotes.map((n) => sanitize(String(n))).filter((n) => n.length > 0)
      : [];
    const reviewNotes = (modelNotes.length > 0 ? modelNotes : base.reviewNotes).filter(
      (note) => detected || !ENTITY_CLAIM.test(note),
    );

    const cleanAssessment = assessment ? sanitize(assessment) : base.assessment;
    const finalAssessment = detected ? cleanAssessment : stripEntityClaims(cleanAssessment) || base.assessment;

    return {
      mode: "live",
      model: AI_MODEL,
      projects,
      entity,
      assessment: finalAssessment,
      reviewNotes: reviewNotes.length > 0 ? reviewNotes : base.reviewNotes,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`run-verification: live AI unavailable for ${submissionId}, using demo reasoning mode. ${message}`);
    return demoReasoning(params, message);
  }
}

// ---------------------------------------------------------------------------
// 4. HTTP entry, persistence and audit trail
// ---------------------------------------------------------------------------

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function admin() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("backend environment is not configured");
  return createClient(url, key);
}

type Client = ReturnType<typeof admin>;

interface Bundle {
  submission: SubmissionRow;
  tender: TenderRow;
  requirements: RequirementRow[];
  bidder: BidderRow;
  documents: DocumentRow[];
  verifications: VerificationRow[];
}

async function loadBundle(client: Client, submissionId: string): Promise<Bundle> {
  const submission = await client
    .from("verifai_submissions")
    .select("id, tender_id, bidder_id, submitted_at, status")
    .eq("id", submissionId)
    .maybeSingle();
  if (submission.error) throw new Error(`submission lookup failed: ${submission.error.message}`);
  if (!submission.data) throw new Error(`unknown submission ${submissionId}`);

  const row = submission.data as SubmissionRow;
  const [tender, requirements, bidder, documents, verifications] = await Promise.all([
    client.from("verifai_tenders").select("id, name, department").eq("id", row.tender_id).maybeSingle(),
    client.from("verifai_requirements").select("*").eq("tender_id", row.tender_id).order("sort_order"),
    client.from("verifai_bidders").select("*").eq("id", row.bidder_id).maybeSingle(),
    client.from("verifai_documents").select("*").eq("submission_id", row.id),
    client.from("verifai_verifications").select("*").eq("bidder_id", row.bidder_id),
  ]);

  const failure = [tender, requirements, bidder, documents, verifications].find((r) => r.error);
  if (failure?.error) throw new Error(`bundle lookup failed: ${failure.error.message}`);
  if (!tender.data || !bidder.data) throw new Error(`incomplete data for submission ${submissionId}`);

  return {
    submission: row,
    tender: tender.data as TenderRow,
    requirements: (requirements.data ?? []) as RequirementRow[],
    bidder: bidder.data as BidderRow,
    documents: (documents.data ?? []) as DocumentRow[],
    verifications: (verifications.data ?? []) as VerificationRow[],
  };
}

interface VerifiedSummary {
  submission_id: string;
  compliance_score: number;
  risk_level: string;
  overall_status: string;
  ai_mode: string;
  evidence_count: number;
  risk_drivers: string[];
}

async function verifySubmission(client: Client, submissionId: string): Promise<VerifiedSummary> {
  const { tender, requirements, bidder, documents, verifications } = await loadBundle(client, submissionId);
  const projectRequirement = requirements.find((r) => r.requirement_type === "similar_projects");

  const semantic = await analyzeSemantics({
    submissionId,
    tenderName: tender.name,
    department: tender.department,
    requirement: projectRequirement,
    bidder,
    documents,
  });

  const evidenceRows = evaluateRequirements({ bidder, documents, verifications, semantic }, requirements);
  const score = complianceScore(evidenceRows);
  const status = overallStatus(evidenceRows);
  const risk = assessRisk(evidenceRows, requirements, verifications);

  const cleared = await client.from("verifai_evidence").delete().eq("submission_id", submissionId);
  if (cleared.error) throw new Error(`evidence reset failed: ${cleared.error.message}`);

  const inserted = await client
    .from("verifai_evidence")
    .insert(evidenceRows.map((row) => ({ submission_id: submissionId, ...row })));
  if (inserted.error) throw new Error(`evidence write failed: ${inserted.error.message}`);

  const updated = await client
    .from("verifai_submissions")
    .update({
      compliance_score: score,
      risk_level: risk.level,
      overall_status: status,
      ai_summary: semantic.assessment,
      ai_mode: semantic.mode,
      ai_findings: {
        projects: semantic.projects,
        entity: semantic.entity,
        review_notes: semantic.reviewNotes,
        model: semantic.model,
        risk_drivers: risk.drivers,
      },
      verified_at: new Date().toISOString(),
    })
    .eq("id", submissionId);
  if (updated.error) throw new Error(`submission update failed: ${updated.error.message}`);

  const events: Record<string, unknown>[] = [
    {
      actor: "SYSTEM",
      actor_name: "VERIFAI Engine",
      action: "Evidence extracted",
      entity_type: "SUBMISSION",
      entity_id: submissionId,
      entity_label: `${bidder.name} / ${tender.name}`,
      status: `${evidenceRows.length} evidence records`,
      detail: `${documents.length} document records processed with prototype extraction.`,
    },
  ];

  for (const row of evidenceRows) {
    const requirement = requirements.find((r) => r.id === row.requirement_id);
    events.push({
      actor: "SYSTEM",
      actor_name: "VERIFAI Engine",
      action: `Verified ${(requirement?.label ?? "requirement").toLowerCase()} requirement`,
      entity_type: "REQUIREMENT",
      entity_id: row.requirement_id,
      entity_label: `${bidder.name} / ${requirement?.label ?? "Requirement"}`,
      status: row.result,
      detail: row.rule_expression ?? row.reasoning.slice(0, 140),
    });
  }

  events.push({
    actor: "SYSTEM",
    actor_name: "VERIFAI Engine",
    action: "AI assessment generated",
    entity_type: "SUBMISSION",
    entity_id: submissionId,
    entity_label: semantic.mode === "live" ? `Live model: ${semantic.model}` : "Demo reasoning mode",
    status: semantic.mode === "live" ? "LIVE AI" : "DEMO REASONING",
    detail: semantic.assessment.slice(0, 240),
  });

  const audited = await client.from("verifai_audit_events").insert(events);
  if (audited.error) throw new Error(`audit write failed: ${audited.error.message}`);

  return {
    submission_id: submissionId,
    compliance_score: score,
    risk_level: risk.level,
    overall_status: status,
    ai_mode: semantic.mode,
    evidence_count: evidenceRows.length,
    risk_drivers: risk.drivers,
  };
}

async function resolveTargets(client: Client, payload: Record<string, unknown>): Promise<string[]> {
  const submissionId = payload["submission_id"];
  if (typeof submissionId === "string" && submissionId.trim().length > 0) {
    return [submissionId.trim()];
  }

  const submissions = await client
    .from("verifai_submissions")
    .select("id, submitted_at")
    .order("submitted_at");
  if (submissions.error) throw new Error(`submission list failed: ${submissions.error.message}`);
  const ids = ((submissions.data ?? []) as { id: string }[]).map((s) => s.id);

  if (payload["scope"] === "all") return ids;

  const evidence = await client.from("verifai_evidence").select("submission_id");
  if (evidence.error) throw new Error(`evidence lookup failed: ${evidence.error.message}`);
  const verified = new Set(((evidence.data ?? []) as { submission_id: string }[]).map((e) => e.submission_id));
  return ids.filter((id) => !verified.has(id));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const client = admin();
    const targets = await resolveTargets(client, payload);

    const verified: VerifiedSummary[] = [];
    for (const id of targets) {
      verified.push(await verifySubmission(client, id));
    }

    console.log(`run-verification: verified ${verified.length} submission(s): ${targets.join(", ") || "none"}`);
    return json({ ok: true, verified, ai_mode: verified[0]?.ai_mode ?? "demo_reasoning" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`run-verification failed: ${message}`);
    return json({ ok: false, error: message }, 500);
  }
});
