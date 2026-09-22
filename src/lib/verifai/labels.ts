// The credibility labels the prototype must show consistently, plus the
// wording used for each result state. Keep these in one place so no screen
// drifts from the required terminology.
import type { AiMode, ComplianceResult, DecisionType, RiskLevel } from "./types";

export const LABELS = {
  prototypeSource: "[PROTOTYPE SOURCE]",
  prototypeExtraction: "[PROTOTYPE EXTRACTION]",
  ruleVerified: "[RULE VERIFIED]",
  aiAssisted: "[AI ASSISTED]",
  documentEvidence: "[DOCUMENT EVIDENCE]",
  syntheticDemoData: "[SYNTHETIC DEMO DATA]",
} as const;

export const METHOD_LABELS: Record<string, string> = {
  "RULE VERIFIED": LABELS.ruleVerified,
  "AI ASSISTED": LABELS.aiAssisted,
  "DOCUMENT EVIDENCE": LABELS.documentEvidence,
  "PROTOTYPE SOURCE": LABELS.prototypeSource,
};

export function methodLabel(method: string | null | undefined): string {
  if (!method) return "[UNCLASSIFIED]";
  return METHOD_LABELS[method] ?? `[${method}]`;
}

export const RESULT_COPY: Record<ComplianceResult, string> = {
  PASS: "Evidence clearly satisfies this requirement.",
  FAIL: "Evidence clearly does not satisfy this requirement.",
  REVIEW: "Evidence is ambiguous, incomplete or inconsistent and requires officer judgement.",
};

export const RESULT_ORDER: ComplianceResult[] = ["PASS", "REVIEW", "FAIL"];

export const RISK_COPY: Record<RiskLevel, string> = {
  LOW: "No adverse evidence identified by the automated checks.",
  MEDIUM: "Ambiguous or incomplete evidence requires officer judgement.",
  HIGH: "A mandatory requirement failed or verification could not be established.",
};

export const RISK_ORDER: RiskLevel[] = ["LOW", "MEDIUM", "HIGH"];

export const DECISION_LABELS: Record<DecisionType, string> = {
  QUALIFY: "Qualify",
  DISQUALIFY: "Disqualify",
  REQUEST_CLARIFICATION: "Request clarification",
};

export const DECISION_HELP: Record<DecisionType, string> = {
  QUALIFY: "The bidder meets the tender requirements as evidenced.",
  DISQUALIFY: "The bidder does not meet the mandatory tender requirements.",
  REQUEST_CLARIFICATION: "Ask the bidder for additional or clearer evidence.",
};

export const AI_MODE_LABELS: Record<AiMode, string> = {
  live: "Live AI reasoning",
  demo_reasoning: "Demo reasoning mode",
};

export const AI_MODE_DETAIL: Record<AiMode, string> = {
  live: "Semantic checks were produced by the configured language model on the server.",
  demo_reasoning:
    "The language model was unavailable, so the semantic checks used deterministic demo reasoning. The workflow is unaffected.",
};

export const SYNTHETIC_NOTICE =
  "Synthetic demonstration data — not a live government record.";

export const PROTOTYPE_NOTICE =
  "Prototype demonstration only. No live GST, Udyam, PAN, MCA, Startup, NSIC, EPFO/ESIC or debarment integration is present.";

export const OFFICER_DECISION_NOTICE =
  "AI provides assessment support only. The final procurement decision rests with the Procurement Officer.";

export const SCORE_NOTICE = "Decision requires Procurement Officer review.";

export const EXPECTED_IMPACT_NOTICE =
  "Expected impact based on problem statement.";

export const SCORE_DISCLAIMER =
  "The compliance score is decision support only. A failed mandatory requirement stays visible regardless of the score, and a score never means the bidder is eligible.";
