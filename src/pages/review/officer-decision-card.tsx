// Officer decision: the only place a procurement outcome is recorded, and it
// is always attributable to a person.
import { useEffect, useState } from "react";
import { Gavel, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { DECISION_HELP, DECISION_LABELS, OFFICER_DECISION_NOTICE } from "@/lib/verifai/labels";
import { formatDateTime } from "@/lib/verifai/format";
import { recordAuditEvent } from "@/lib/verifai/api";
import { useSaveDecision } from "@/hooks/use-verifai";
import type { DecisionType, OfficerDecision } from "@/lib/verifai/types";

const OPTIONS: DecisionType[] = ["QUALIFY", "DISQUALIFY", "REQUEST_CLARIFICATION"];

export function OfficerDecisionCard({
  submissionId,
  bidderName,
  decision,
  onSaved,
}: {
  submissionId: string;
  bidderName: string;
  decision: OfficerDecision | null;
  onSaved: () => void;
}) {
  const [selected, setSelected] = useState<DecisionType | null>(decision?.decision ?? null);
  const [comment, setComment] = useState(decision?.comment ?? "");
  const save = useSaveDecision();

  useEffect(() => {
    setSelected(decision?.decision ?? null);
    setComment(decision?.comment ?? "");
  }, [decision]);

  const handleSave = () => {
    if (!selected) return;
    save.mutate(
      { submissionId, decision: selected, comment },
      {
        onSuccess: async () => {
          toast.success("Decision recorded", {
            description: `${DECISION_LABELS[selected]} saved for ${bidderName}.`,
          });
          try {
            await recordAuditEvent({
              action: "Decision recorded",
              entity_type: "SUBMISSION",
              entity_id: submissionId,
              entity_label: `${bidderName} / ${DECISION_LABELS[selected]}`,
              status: selected,
              detail: comment.trim() ? comment.trim() : "No comment provided.",
            });
          } catch {
            toast.error("The decision saved, but the audit entry could not be written.");
          }
          onSaved();
        },
        onError: (error: Error) => {
          toast.error("The decision could not be saved", { description: error.message });
        },
      },
    );
  };

  return (
    <Card className="border-border shadow-panel">
      <CardHeader className="gap-1.5 pb-3">
        <CardTitle className="text-base">Officer decision</CardTitle>
        <CardDescription className="text-xs">
          Recorded by the Procurement Officer. AI never records this decision.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {decision ? (
          <div className="rounded-md border border-border bg-muted/50 p-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Gavel className="h-4 w-4 text-muted-foreground" aria-hidden />
              {DECISION_LABELS[decision.decision]}
            </p>
            {decision.comment ? (
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">“{decision.comment}”</p>
            ) : null}
            <p className="mt-2 text-[11px] text-muted-foreground">
              Decision made by: {decision.decided_by} · {formatDateTime(decision.decided_at)}
            </p>
          </div>
        ) : null}

        <RadioGroup
          value={selected ?? ""}
          onValueChange={(value) => setSelected(value as DecisionType)}
          className="gap-2"
        >
          {OPTIONS.map((option) => (
            <label
              key={option}
              htmlFor={`decision-${option}`}
              className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 transition-colors hover:bg-muted/60"
            >
              <RadioGroupItem value={option} id={`decision-${option}`} className="mt-0.5" />
              <span className="min-w-0">
                <Label htmlFor={`decision-${option}`} className="cursor-pointer text-sm font-medium text-foreground">
                  {DECISION_LABELS[option]}
                </Label>
                <span className="mt-0.5 block text-xs text-muted-foreground">{DECISION_HELP[option]}</span>
              </span>
            </label>
          ))}
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="decision-comment" className="text-xs text-muted-foreground">
            Comment (optional)
          </Label>
          <Textarea
            id="decision-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={3}
            placeholder="For example: Please provide supporting evidence for the third similar project."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleSave} disabled={!selected || save.isPending}>
            {save.isPending ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />}
            {save.isPending ? "Saving…" : decision ? "Update decision" : "Save decision"}
          </Button>
          <span className="text-[11px] text-muted-foreground">Saved to the tender record and the audit trail.</span>
        </div>

        <p className="border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground">
          {OFFICER_DECISION_NOTICE}
        </p>
      </CardContent>
    </Card>
  );
}
