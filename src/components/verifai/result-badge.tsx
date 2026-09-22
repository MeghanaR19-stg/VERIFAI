// Result, risk and status pills. One place so PASS/REVIEW/FAIL always look the
// same green/amber/red everywhere in the console.
import { AlertTriangle, Check, CircleDot, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ComplianceResult, RiskLevel } from "@/lib/verifai/types";

type Tone = "pass" | "review" | "fail" | "info" | "neutral";

const TONE_CLASS: Record<Tone, string> = {
  pass: "border-pass-border bg-pass-subtle text-pass",
  review: "border-review-border bg-review-subtle text-review",
  fail: "border-fail-border bg-fail-subtle text-fail",
  info: "border-info-border bg-info-subtle text-info",
  neutral: "border-border bg-muted text-muted-foreground",
};

const RESULT_TONE: Record<ComplianceResult, Tone> = {
  PASS: "pass",
  REVIEW: "review",
  FAIL: "fail",
};

const RISK_TONE: Record<RiskLevel, Tone> = {
  LOW: "pass",
  MEDIUM: "review",
  HIGH: "fail",
};

function Glyph({ tone }: { tone: Tone }) {
  if (tone === "pass") return <Check className="h-3 w-3" aria-hidden />;
  if (tone === "fail") return <X className="h-3 w-3" aria-hidden />;
  if (tone === "review") return <AlertTriangle className="h-3 w-3" aria-hidden />;
  return <CircleDot className="h-3 w-3" aria-hidden />;
}

export function Pill({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ResultBadge({ result, className }: { result: ComplianceResult; className?: string }) {
  const tone = RESULT_TONE[result];
  return (
    <Pill tone={tone} className={className}>
      <Glyph tone={tone} />
      {result}
    </Pill>
  );
}

export function RiskBadge({ risk, className }: { risk: RiskLevel; className?: string }) {
  const tone = RISK_TONE[risk];
  return (
    <Pill tone={tone} className={className}>
      <Glyph tone={tone} />
      {risk} RISK
    </Pill>
  );
}

export function ToneBadge({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn(TONE_CLASS[tone], "font-semibold", className)}>
      {children}
    </Badge>
  );
}
