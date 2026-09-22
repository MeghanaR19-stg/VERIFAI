// All reads and writes against the VERIFAI backend live here, so pages never
// touch the client directly and every screen sees the same data shapes.
import { supabase } from "@/integrations/supabase/client";
import type {
  AuditEvent,
  Bidder,
  DecisionType,
  DemoConfig,
  DocumentRecord,
  EvidenceRecord,
  OfficerDecision,
  Requirement,
  ReviewBundle,
  RunVerificationResponse,
  Submission,
  Tender,
  VerificationRecord,
} from "./types";

interface QueryResult {
  data: unknown;
  error: { message: string } | null;
}

function unwrap<T>(result: QueryResult): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

export async function fetchTenders(): Promise<Tender[]> {
  return unwrap<Tender[]>(
    await supabase.from("verifai_tenders").select("*").order("updated_at", { ascending: false }),
  );
}

export async function fetchTender(tenderId: string): Promise<Tender | null> {
  return unwrap<Tender | null>(
    await supabase.from("verifai_tenders").select("*").eq("id", tenderId).maybeSingle(),
  );
}

export async function fetchRequirements(tenderId: string): Promise<Requirement[]> {
  return unwrap<Requirement[]>(
    await supabase.from("verifai_requirements").select("*").eq("tender_id", tenderId).order("sort_order"),
  );
}

export async function fetchBidders(): Promise<Bidder[]> {
  return unwrap<Bidder[]>(await supabase.from("verifai_bidders").select("*").order("id"));
}

export async function fetchAllRequirements(): Promise<Requirement[]> {
  return unwrap<Requirement[]>(
    await supabase.from("verifai_requirements").select("*").order("sort_order"),
  );
}

export async function fetchBidder(bidderId: string): Promise<Bidder | null> {
  return unwrap<Bidder | null>(
    await supabase.from("verifai_bidders").select("*").eq("id", bidderId).maybeSingle(),
  );
}

export async function fetchSubmissions(): Promise<Submission[]> {
  return unwrap<Submission[]>(
    await supabase.from("verifai_submissions").select("*").order("submitted_at", { ascending: false }),
  );
}

export async function fetchSubmission(submissionId: string): Promise<Submission | null> {
  return unwrap<Submission | null>(
    await supabase.from("verifai_submissions").select("*").eq("id", submissionId).maybeSingle(),
  );
}

export async function fetchEvidence(submissionId: string): Promise<EvidenceRecord[]> {
  return unwrap<EvidenceRecord[]>(
    await supabase.from("verifai_evidence").select("*").eq("submission_id", submissionId),
  );
}

export async function fetchDocuments(submissionId: string): Promise<DocumentRecord[]> {
  return unwrap<DocumentRecord[]>(
    await supabase.from("verifai_documents").select("*").eq("submission_id", submissionId).order("created_at"),
  );
}

export async function fetchAllDocuments(): Promise<DocumentRecord[]> {
  return unwrap<DocumentRecord[]>(await supabase.from("verifai_documents").select("*"));
}

export async function fetchAllEvidence(): Promise<EvidenceRecord[]> {
  return unwrap<EvidenceRecord[]>(await supabase.from("verifai_evidence").select("*"));
}

export async function fetchVerifications(bidderId?: string): Promise<VerificationRecord[]> {
  const query = supabase.from("verifai_verifications").select("*").order("check_type");
  const result = bidderId ? await query.eq("bidder_id", bidderId) : await query;
  return unwrap<VerificationRecord[]>(result);
}

export async function fetchDecisions(): Promise<OfficerDecision[]> {
  return unwrap<OfficerDecision[]>(await supabase.from("verifai_decisions").select("*"));
}

export async function fetchDecision(submissionId: string): Promise<OfficerDecision | null> {
  return unwrap<OfficerDecision | null>(
    await supabase.from("verifai_decisions").select("*").eq("submission_id", submissionId).maybeSingle(),
  );
}

export async function fetchAuditEvents(limit = 100): Promise<AuditEvent[]> {
  return unwrap<AuditEvent[]>(
    await supabase.from("verifai_audit_events").select("*").order("occurred_at", { ascending: false }).limit(limit),
  );
}

export async function fetchDemoConfig(): Promise<DemoConfig | null> {
  const row = unwrap<{ value: DemoConfig } | null>(
    await supabase.from("verifai_app_state").select("value").eq("key", "demo_cases").maybeSingle(),
  );
  return row?.value ?? null;
}

export async function fetchDemoMode(): Promise<boolean> {
  const row = unwrap<{ value: { enabled?: boolean } } | null>(
    await supabase.from("verifai_app_state").select("value").eq("key", "demo_mode").maybeSingle(),
  );
  return row?.value?.enabled ?? false;
}

export async function setDemoMode(enabled: boolean): Promise<void> {
  const { error } = await supabase
    .from("verifai_app_state")
    .upsert(
      { key: "demo_mode", value: { enabled }, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );
  if (error) throw new Error(error.message);
}

/** Everything the Compliance Review screen needs. */
export async function fetchReviewBundle(submissionId: string): Promise<ReviewBundle> {
  const submission = await fetchSubmission(submissionId);
  if (!submission) throw new Error(`Submission ${submissionId} was not found.`);

  const [tender, bidder, requirements, evidence, documents, decision] = await Promise.all([
    fetchTender(submission.tender_id),
    fetchBidder(submission.bidder_id),
    fetchRequirements(submission.tender_id),
    fetchEvidence(submissionId),
    fetchDocuments(submissionId),
    fetchDecision(submissionId),
  ]);

  if (!tender || !bidder) throw new Error("The tender or bidder record for this submission is missing.");

  return { submission, tender, bidder, requirements, evidence, documents, decision };
}

/** Invokes the compliance engine on the server. */
export async function runVerification(payload: {
  submission_id?: string;
  scope?: "pending" | "all";
}): Promise<RunVerificationResponse> {
  const { data, error } = await supabase.functions.invoke<RunVerificationResponse>("run-verification", {
    body: payload,
  });

  if (error) {
    let message = error.message || "The compliance engine could not be reached.";
    const context = (error as { context?: Response }).context;
    if (context && typeof context.json === "function") {
      try {
        const body = (await context.json()) as { error?: string };
        if (body?.error) message = body.error;
      } catch {
        // keep the original message
      }
    }
    throw new Error(message);
  }

  if (!data) throw new Error("The compliance engine returned no data.");
  if (!data.ok) throw new Error("The compliance engine reported a failure.");
  return data;
}

export async function saveOfficerDecision(
  submissionId: string,
  decision: DecisionType,
  comment: string,
): Promise<OfficerDecision> {
  return unwrap<OfficerDecision>(
    await supabase
      .from("verifai_decisions")
      .upsert(
        {
          submission_id: submissionId,
          decision,
          comment: comment.trim() ? comment.trim() : null,
          decided_by: "Procurement Officer",
          decided_at: new Date().toISOString(),
        },
        { onConflict: "submission_id" },
      )
      .select()
      .maybeSingle(),
  );
}

export interface AuditEventInput {
  action: string;
  entity_type: string;
  entity_id?: string | null;
  entity_label?: string | null;
  status?: string | null;
  detail?: string | null;
  actor?: "SYSTEM" | "OFFICER";
  actor_name?: string;
}

export async function recordAuditEvent(event: AuditEventInput): Promise<void> {
  const { error } = await supabase.from("verifai_audit_events").insert({
    actor: event.actor ?? "OFFICER",
    actor_name: event.actor_name ?? "Procurement Officer",
    action: event.action,
    entity_type: event.entity_type,
    entity_id: event.entity_id ?? null,
    entity_label: event.entity_label ?? null,
    status: event.status ?? null,
    detail: event.detail ?? null,
  });
  if (error) throw new Error(error.message);
}

export interface NewDocument {
  submission_id: string;
  name: string;
  doc_type: string;
  status: string;
  source_page: number | null;
  extraction_method: string;
  confidence: number | null;
  extracted_fields: Record<string, unknown>;
  uploaded_by: string;
}

export async function insertDocument(record: NewDocument): Promise<DocumentRecord> {
  return unwrap<DocumentRecord>(
    await supabase.from("verifai_documents").insert(record).select().maybeSingle(),
  );
}

/** Re-stamps every simulated verification record, for the prototype "re-run" action. */
export async function refreshSimulatedVerification(): Promise<void> {
  const { error } = await supabase
    .from("verifai_verifications")
    .update({ checked_at: new Date().toISOString() })
    .not("id", "is", null);
  if (error) throw new Error(error.message);
}
