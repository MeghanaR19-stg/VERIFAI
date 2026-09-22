// Domain types for the VERIFAI console. These mirror the backend tables and
// the payload the compliance engine returns.

export type ComplianceResult = "PASS" | "FAIL" | "REVIEW";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type DecisionType = "QUALIFY" | "DISQUALIFY" | "REQUEST_CLARIFICATION";
export type AiMode = "live" | "demo_reasoning";

export interface Tender {
  id: string;
  name: string;
  department: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Requirement {
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

export interface Bidder {
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

export interface Submission {
  id: string;
  tender_id: string;
  bidder_id: string;
  submitted_at: string;
  status: string;
  compliance_score: number | null;
  risk_level: RiskLevel | null;
  overall_status: ComplianceResult | null;
  ai_summary: string | null;
  ai_mode: AiMode | null;
  ai_findings: AiFindings | null;
  verified_at: string | null;
}

export interface DocumentRecord {
  id: string;
  submission_id: string;
  name: string;
  doc_type: string;
  status: string;
  source_page: number | null;
  extraction_method: string;
  confidence: number | null;
  extracted_fields: Record<string, unknown> | null;
  uploaded_by: string;
  created_at: string;
}

export interface EvidenceRecord {
  id: string;
  submission_id: string;
  requirement_id: string;
  result: ComplianceResult;
  method: string;
  extracted_value: string | null;
  source_document: string | null;
  source_page: number | null;
  rule_expression: string | null;
  reasoning: string | null;
  confidence: number | null;
  created_at: string;
}

export interface VerificationRecord {
  id: string;
  bidder_id: string;
  check_type: string;
  identifier: string | null;
  status: string;
  source_adapter: string;
  detail: string | null;
  checked_at: string;
}

export interface AuditEvent {
  id: string;
  occurred_at: string;
  actor: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_label: string | null;
  status: string | null;
  detail: string | null;
}

export interface OfficerDecision {
  id: string;
  submission_id: string;
  decision: DecisionType;
  comment: string | null;
  decided_by: string;
  decided_at: string;
}

export interface ProjectJudgement {
  name: string;
  value_cr: number | null;
  category: string;
  hint?: string;
  match: "strong" | "partial" | "weak";
  reason: string;
}

export interface AiFindings {
  projects?: ProjectJudgement[];
  entity?: { detected: boolean; confidence: number; explanation: string };
  review_notes?: string[];
  model?: string | null;
  risk_drivers?: string[];
}

/** Everything the Compliance Review screen needs, resolved in one place. */
export interface ReviewBundle {
  submission: Submission;
  tender: Tender;
  bidder: Bidder;
  requirements: Requirement[];
  evidence: EvidenceRecord[];
  documents: DocumentRecord[];
  decision: OfficerDecision | null;
}

export interface VerifiedSummary {
  submission_id: string;
  compliance_score: number;
  risk_level: RiskLevel;
  overall_status: ComplianceResult;
  ai_mode: AiMode;
  evidence_count: number;
  risk_drivers: string[];
}

export interface RunVerificationResponse {
  ok: boolean;
  verified: VerifiedSummary[];
  ai_mode: AiMode;
}

export interface DemoCase {
  submission_id: string;
  title: string;
  expected: string;
}

export interface DemoConfig {
  primary: string;
  cases: DemoCase[];
}
