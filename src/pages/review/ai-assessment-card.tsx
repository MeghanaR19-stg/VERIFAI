// AI Assessment card: the semantic reasoning that supports (never replaces)
// the officer's judgement.
import { AlertTriangle, Sparkles, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MethodTag } from "@/components/verifai/method-tag";
import { Pill } from "@/components/verifai/result-badge";
import { EmptyState } from "@/components/verifai/empty-state";
import { AI_MODE_DETAIL, AI_MODE_LABELS, OFFICER_DECISION_NOTICE } from "@/lib/verifai/labels";
import { formatCr } from "@/lib/verifai/format";
import type { Submission } from "@/lib/verifai/types";

const MATCH_TONE = {
  strong: "pass",
  partial: "review",
  weak: "fail",
} as const;

const MATCH_LABEL = {
  strong: "Strong match",
  partial: "Partial match",
  weak: "No correspondence",
} as const;

export function AiAssessmentCard({ submission }: { submission: Submission }) {
  const findings = submission.ai_findings;
  const mode = submission.ai_mode;
  const projects = findings?.projects ?? [];
  const notes = findings?.review_notes ?? [];
  const entity = findings?.entity;

  return (
    <Card className="border-border shadow-panel">
      <CardHeader className="gap-2 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">AI Assessment</CardTitle>
          <MethodTag method="AI ASSISTED" />
        </div>
        <CardDescription className="text-xs">
          {mode ? `${AI_MODE_LABELS[mode]} — ${AI_MODE_DETAIL[mode]}` : "Assessment not generated yet."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {!submission.ai_summary ? (
          <EmptyState
            icon={Sparkles}
            title="AI assessment unavailable"
            description="No assessment has been generated for this submission. Re-run verification to produce one."
          />
        ) : (
          <p className="text-sm leading-relaxed text-foreground">{submission.ai_summary}</p>
        )}

        {entity?.detected ? (
          <div className="rounded-md border border-review-border bg-review-subtle p-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-review">
              <AlertTriangle className="h-4 w-4" aria-hidden />
              Potential entity mismatch · confidence {entity.confidence}%
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-review">{entity.explanation}</p>
          </div>
        ) : null}

        {projects.length > 0 ? (
          <div className="space-y-2">
            <p className="label-mono text-muted-foreground">Similar project analysis</p>
            <ul className="space-y-2">
              {projects.map((project, index) => (
                <li key={`${project.name}-${index}`} className="rounded-md border border-border bg-muted/40 p-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      Project {index + 1} — {project.name}
                    </p>
                    <Pill tone={MATCH_TONE[project.match]}>{MATCH_LABEL[project.match]}</Pill>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {project.category}
                    {project.value_cr !== null ? ` · ${formatCr(project.value_cr)}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{project.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {notes.length > 0 ? (
          <div className="space-y-2">
            <p className="label-mono text-muted-foreground">Items requiring officer attention</p>
            <ul className="space-y-1.5">
              {notes.map((note, index) => (
                <li key={index} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" aria-hidden />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="flex items-start gap-2 border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground">
          <UserCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          {OFFICER_DECISION_NOTICE}
        </p>
      </CardContent>
    </Card>
  );
}
