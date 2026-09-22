// Document evidence for a submission: what was extracted, from which page,
// and at what confidence.
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ExtractionTag } from "@/components/verifai/method-tag";
import { Pill } from "@/components/verifai/result-badge";
import { EmptyState } from "@/components/verifai/empty-state";
import { docTypeLabel, formatConfidence } from "@/lib/verifai/format";
import type { DocumentRecord } from "@/lib/verifai/types";

function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) return `${value.length} entr${value.length === 1 ? "y" : "ies"}`;
  if (typeof value === "object") return "—";
  return String(value);
}

export function DocumentList({ documents }: { documents: DocumentRecord[] }) {
  if (documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No documents on record for this bid"
        description="Upload a document record to add evidence to this submission, then re-run verification."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {documents.map((document) => {
        const fields = Object.entries(document.extracted_fields ?? {}).filter(
          ([key]) => key !== "projects",
        );
        const projects = Array.isArray((document.extracted_fields ?? {})["projects"])
          ? ((document.extracted_fields ?? {})["projects"] as Record<string, unknown>[])
          : [];

        return (
          <li key={document.id} className="rounded-md border border-border bg-card p-3.5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  <span className="truncate">{document.name}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {docTypeLabel(document.doc_type)}
                  {document.source_page ? ` · Page ${document.source_page}` : ""} · confidence{" "}
                  {formatConfidence(document.confidence)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ExtractionTag />
                <Pill tone={document.status === "EXTRACTED" ? "pass" : "neutral"}>{document.status}</Pill>
              </div>
            </div>

            {fields.length > 0 ? (
              <dl className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {fields.map(([key, value]) => (
                  <div key={key} className="flex items-baseline justify-between gap-3 border-b border-dashed border-border pb-1">
                    <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="truncate text-sm text-foreground">{formatFieldValue(value)}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {projects.length > 0 ? (
              <div className="mt-3">
                <p className="label-mono text-muted-foreground">Projects listed ({projects.length})</p>
                <ul className="mt-1.5 space-y-1">
                  {projects.map((project, index) => (
                    <li key={index} className="flex items-baseline justify-between gap-3 text-xs">
                      <span className="truncate text-foreground">{String(project["name"] ?? "Unnamed project")}</span>
                      <span className="shrink-0 text-muted-foreground">
                        {String(project["category"] ?? "")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
