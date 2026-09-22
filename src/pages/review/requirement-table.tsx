// The requirement-by-requirement verification table. Every row opens the
// Evidence Trace, which is the point of the whole screen.
import { ChevronRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/verifai/empty-state";
import { MethodTag } from "@/components/verifai/method-tag";
import { Pill, ResultBadge } from "@/components/verifai/result-badge";
import type { EvidenceRecord, Requirement } from "@/lib/verifai/types";

export interface RequirementRowView {
  requirement: Requirement;
  evidence: EvidenceRecord | undefined;
}

export function RequirementTable({
  rows,
  onOpenTrace,
  onRunVerification,
  running,
}: {
  rows: RequirementRowView[];
  onOpenTrace: (requirement: Requirement, evidence: EvidenceRecord) => void;
  onRunVerification: () => void;
  running: boolean;
}) {
  const hasEvidence = rows.some((row) => Boolean(row.evidence));

  return (
    <Card className="border-border shadow-panel">
      <CardHeader className="gap-1.5 pb-3">
        <CardTitle className="text-base">Requirement verification</CardTitle>
        <CardDescription className="text-xs">
          Select any requirement to inspect the evidence behind its result.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {!hasEvidence ? (
          <div className="p-5">
            <EmptyState
              icon={PlayCircle}
              title="Verification pending for this submission"
              description="The compliance engine has not produced evidence records for this bid yet. Run the verification to generate them."
              action={
                <Button size="sm" onClick={onRunVerification} disabled={running}>
                  {running ? "Running verification…" : "Run verification"}
                </Button>
              }
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Requirement</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="pr-5 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ requirement, evidence }) => (
                <TableRow
                  key={requirement.id}
                  className={evidence ? "cursor-pointer" : undefined}
                  onClick={() => (evidence ? onOpenTrace(requirement, evidence) : undefined)}
                >
                  <TableCell className="max-w-[260px] pl-5">
                    <p className="font-medium text-foreground">{requirement.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {requirement.display_value} · {requirement.mandatory ? "Mandatory" : "Advisory"}
                    </p>
                  </TableCell>
                  <TableCell className="max-w-[240px]">
                    <p className="truncate text-sm text-foreground">{evidence?.extracted_value ?? "Pending"}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {evidence?.source_document ?? "No source record"}
                      {evidence?.source_page ? ` · p.${evidence.source_page}` : ""}
                    </p>
                  </TableCell>
                  <TableCell>
                    {evidence ? (
                      <ResultBadge result={evidence.result} />
                    ) : (
                      <Pill tone="neutral">PENDING</Pill>
                    )}
                  </TableCell>
                  <TableCell>
                    <MethodTag method={evidence?.method ?? requirement.verification_method} />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    {evidence ? (
                      <Button variant="ghost" size="sm" onClick={() => onOpenTrace(requirement, evidence)}>
                        View evidence
                        <ChevronRight aria-hidden />
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
