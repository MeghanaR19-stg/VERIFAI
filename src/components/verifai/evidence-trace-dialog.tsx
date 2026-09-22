// The Evidence Trace: the chain from tender requirement to compliance result.
// This is the interaction the whole product rests on, so every step is shown
// explicitly rather than summarised.
import { BadgeCheck, FileText, Gavel, ScanText, ShieldQuestion } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { MethodTag, ExtractionTag } from "@/components/verifai/method-tag";
import { ResultBadge } from "@/components/verifai/result-badge";
import { SYNTHETIC_NOTICE } from "@/lib/verifai/labels";
import { RESULT_COPY, SCORE_NOTICE } from "@/lib/verifai/labels";
import { docTypeLabel, formatConfidence } from "@/lib/verifai/format";
import type { DocumentRecord, EvidenceRecord, Requirement } from "@/lib/verifai/types";

function TraceStep({
  step,
  title,
  last,
  children,
}: {
  step: number;
  title: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="relative flex gap-4">
      {!last ? <span className="absolute bottom-0 left-[13px] top-8 w-px bg-border" aria-hidden /> : null}
      <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[11px] font-semibold tabular-nums text-muted-foreground">
        {step}
      </span>
      <div className="min-w-0 flex-1 pb-4">
        <p className="label-mono text-muted-foreground">{title}</p>
        <div className="mt-1.5 space-y-1.5 text-sm text-foreground">{children}</div>
      </div>
    </li>
  );
}

export function EvidenceTraceDialog({
  open,
  onOpenChange,
  requirement,
  evidence,
  documents,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requirement: Requirement | null;
  evidence: EvidenceRecord | null;
  documents: DocumentRecord[];
}) {
  if (!requirement || !evidence) return null;

  const document = documents.find((doc) => doc.name === evidence.source_document);
  const isDocumentEvidence = Boolean(evidence.source_document);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-full max-w-2xl overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 gap-2 border-b border-border bg-card px-5 py-4 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <ResultBadge result={evidence.result} />
            <MethodTag method={evidence.method} />
          </div>
          <DialogTitle className="text-base font-semibold text-foreground">
            Evidence Trace — {requirement.label}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {requirement.display_value} · {requirement.mandatory ? "Mandatory" : "Advisory"} requirement
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 py-4">
          <ol>
            <TraceStep step={1} title="Requirement">
              <p className="font-medium">{requirement.label}</p>
              <p className="text-xs text-muted-foreground">
                {requirement.display_value} · {requirement.mandatory ? "Mandatory" : "Advisory"} · declared in{" "}
                {requirement.tender_id}
              </p>
            </TraceStep>

            <TraceStep step={2} title="Evidence">
              <p className="flex items-center gap-2 font-medium">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                {document ? docTypeLabel(document.doc_type) : "Simulated government source"}
              </p>
              {document ? <ExtractionTag /> : null}
            </TraceStep>

            <TraceStep step={3} title="Source document and page">
              <p className="font-medium">{evidence.source_document ?? "Prototype verification adapter"}</p>
              <p className="text-xs text-muted-foreground">
                {evidence.source_page ? `Page ${evidence.source_page}` : "No page reference"}
                {document ? ` · ${document.extraction_method}` : ""}
              </p>
            </TraceStep>

            <TraceStep step={4} title="Extracted value">
              <p className="flex items-center gap-2 text-lg font-semibold tabular-nums">
                <ScanText className="h-4 w-4 text-muted-foreground" aria-hidden />
                {evidence.extracted_value ?? "Not available"}
              </p>
              <p className="text-xs text-muted-foreground">
                Evidence confidence: {formatConfidence(evidence.confidence)}
              </p>
            </TraceStep>

            <TraceStep step={5} title="Rule and reasoning">
              {evidence.rule_expression ? (
                <p className="rounded border border-border bg-muted/60 px-2.5 py-1.5 font-mono text-xs text-foreground">
                  {evidence.rule_expression}
                </p>
              ) : null}
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <ShieldQuestion className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {evidence.reasoning}
              </p>
              <MethodTag method={evidence.method} />
            </TraceStep>

            <TraceStep step={6} title="Result" last>
              <div className="flex flex-wrap items-center gap-2">
                <ResultBadge result={evidence.result} />
                <span className="text-xs text-muted-foreground">{RESULT_COPY[evidence.result]}</span>
              </div>
              <p className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Gavel className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                {SCORE_NOTICE}
              </p>
            </TraceStep>
          </ol>

          <Separator className="my-4" />

          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            {SYNTHETIC_NOTICE} Document text is simulated for the prototype; the stored values shown here are the
            values the compliance engine actually used.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
