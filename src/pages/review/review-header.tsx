// Review header: who bid, on what tender, and the decision-support picture.
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowUpRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResultBadge, RiskBadge, ToneBadge } from "@/components/verifai/result-badge";
import { MethodTag } from "@/components/verifai/method-tag";
import { AI_MODE_LABELS, SCORE_NOTICE, SCORE_DISCLAIMER } from "@/lib/verifai/labels";
import { formatDateTime } from "@/lib/verifai/format";
import type { ReviewBundle } from "@/lib/verifai/types";

export function ReviewHeader({
  bundle,
  onRerun,
  rerunning,
}: {
  bundle: ReviewBundle;
  onRerun: () => void;
  rerunning: boolean;
}) {
  const { submission, tender, bidder, evidence } = bundle;
  const mandatoryFailures = evidence.filter((row) => row.result === "FAIL");
  const score = submission.compliance_score;

  return (
    <Card className="border-border shadow-panel">
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-1.5">
            <p className="label-mono text-muted-foreground">
              Bid compliance review · {submission.id}
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{bidder.name}</h1>
            <p className="text-sm text-muted-foreground">
              {tender.name} · {tender.department}
            </p>
            <p className="text-xs text-muted-foreground">
              Submitted {formatDateTime(submission.submitted_at)} · Verified {formatDateTime(submission.verified_at)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={onRerun} disabled={rerunning}>
              <RefreshCw className={rerunning ? "animate-spin" : undefined} aria-hidden />
              {rerunning ? "Verifying…" : "Re-run verification"}
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/bids/${submission.id}`}>
                Bid documents
                <ArrowUpRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="label-mono text-muted-foreground">Compliance score</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
              {score === null ? "—" : `${score}%`}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {evidence.filter((row) => row.result === "PASS").length} of {evidence.length} applicable requirements
              passed
            </p>
          </div>
          <div className="space-y-2">
            <p className="label-mono text-muted-foreground">Risk</p>
            {submission.risk_level ? <RiskBadge risk={submission.risk_level} /> : <ToneBadge tone="neutral">Not assessed</ToneBadge>}
          </div>
          <div className="space-y-2">
            <p className="label-mono text-muted-foreground">Overall status</p>
            {submission.overall_status ? (
              <ResultBadge result={submission.overall_status} />
            ) : (
              <ToneBadge tone="neutral">Pending</ToneBadge>
            )}
          </div>
          <div className="space-y-2">
            <p className="label-mono text-muted-foreground">Assessment source</p>
            <ToneBadge tone={submission.ai_mode === "live" ? "info" : "review"}>
              {submission.ai_mode ? AI_MODE_LABELS[submission.ai_mode] : "Pending"}
            </ToneBadge>
            <div>
              <MethodTag method="AI ASSISTED" />
            </div>
          </div>
        </div>

        {mandatoryFailures.length > 0 ? (
          <div className="flex items-start gap-2 rounded-md border border-fail-border bg-fail-subtle px-3 py-2 text-sm text-fail">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">
                {mandatoryFailures.length === 1
                  ? "Mandatory requirement failed."
                  : `${mandatoryFailures.length} mandatory requirements failed.`}
              </p>
              <p className="text-xs">
                {mandatoryFailures
                  .map((row) => bundle.requirements.find((r) => r.id === row.requirement_id)?.label ?? "Requirement")
                  .join(" · ")}
                . {SCORE_NOTICE}
              </p>
            </div>
          </div>
        ) : null}

        <p className="border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground">
          {SCORE_DISCLAIMER}
        </p>
      </CardContent>
    </Card>
  );
}
