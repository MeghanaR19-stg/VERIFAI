// Presentation helpers for the VERIFAI console.
import { format, parseISO } from "date-fns";
import type { ComplianceResult, RiskLevel } from "./types";

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  try {
    return format(parseISO(value), "dd MMM yyyy, HH:mm");
  } catch {
    return "—";
  }
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  try {
    return format(parseISO(value), "dd MMM yyyy");
  } catch {
    return "—";
  }
}

export function formatRelative(value: string | null | undefined): string {
  if (!value) return "—";
  try {
    return format(parseISO(value), "dd MMM, HH:mm");
  } catch {
    return "—";
  }
}

export function formatCr(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `₹${value.toFixed(2)} Cr`;
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${value}%`;
}

export function formatConfidence(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value <= 1 ? `${Math.round(value * 100)}%` : `${Math.round(value)}%`;
}

export function resultTone(result: ComplianceResult | null | undefined): "pass" | "review" | "fail" | "neutral" {
  if (result === "PASS") return "pass";
  if (result === "FAIL") return "fail";
  if (result === "REVIEW") return "review";
  return "neutral";
}

export function riskTone(risk: RiskLevel | null | undefined): "pass" | "review" | "fail" | "neutral" {
  if (risk === "LOW") return "pass";
  if (risk === "MEDIUM") return "review";
  if (risk === "HIGH") return "fail";
  return "neutral";
}

/** Short human label for a document type code. */
export const DOC_TYPE_LABELS: Record<string, string> = {
  AUDITED_FINANCIAL_STATEMENT: "Audited financial statement",
  EXPERIENCE_CERTIFICATE: "Experience certificate",
  GST_CERTIFICATE: "GST certificate",
  OEM_AUTHORIZATION: "OEM authorization",
  COMPANY_REGISTRATION: "Company registration",
  ISO_CERTIFICATE: "ISO certificate",
};

export function docTypeLabel(docType: string): string {
  return DOC_TYPE_LABELS[docType] ?? docType.replace(/_/g, " ").toLowerCase();
}
