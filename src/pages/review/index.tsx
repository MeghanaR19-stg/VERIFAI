// Compliance Review — the primary VERIFAI screen.
// Shows the decision-support picture, the requirement-by-requirement results,
// the AI assessment, the officer decision, and the Evidence Trace behind every row.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/verifai/empty-state";
import { EvidenceTraceDialog } from "@/components/verifai/evidence-trace-dialog";
import { SyntheticNotice } from "@/components/verifai/synthetic-notice";
import { useReviewBundle, useRunVerification } from "@/hooks/use-verifai";
import { recordAuditEvent } from "@/lib/verifai/api";
import type { EvidenceRecord, Requirement } from "@/lib/verifai/types";
import { ReviewHeader } from "./review-header";
import { RequirementTable, type RequirementRowView } from "./requirement-table";
import { AiAssessmentCard } from "./ai-assessment-card";
import { OfficerDecisionCard } from "./officer-decision-card";

const ReviewPage = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const queryClient = useQueryClient();
  const bundle = useReviewBundle(submissionId);
  const runVerification = useRunVerification();
  const requestedRef = useRef<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [trace, setTrace] = useState<{ requirement: Requirement; evidence: EvidenceRecord } | null>(null);

  const submission = bundle.data?.submission;
  const hasEvidence = Boolean(bundle.data && bundle.data.evidence.length > 0);

  // A submission that has never been verified produces its evidence on first view.
  useEffect(() => {
    if (!submission || hasEvidence) return;
    if (requestedRef.current === submission.id) return;
    requestedRef.current = submission.id;
    runVerification.mutate({ submission_id: submission.id });
  }, [submission, hasEvidence, runVerification]);

  const rows: RequirementRowView[] = useMemo(() => {
    if (!bundle.data) return [];
    return bundle.data.requirements.map((requirement) => ({
      requirement,
      evidence: bundle.data?.evidence.find((row) => row.requirement_id === requirement.id),
    }));
  }, [bundle.data]);

  const handleRerun = () => {
    if (!submission) return;
    runVerification.mutate(
      { submission_id: submission.id },
      {
        onSuccess: (result) => {
          const summary = result.verified[0];
          toast.success("Verification complete", {
            description: summary
              ? `${summary.overall_status} · compliance score ${summary.compliance_score}% · ${summary.risk_level} risk`
              : "Evidence records refreshed.",
          });
        },
        onError: (error: Error) => {
          toast.error("Verification could not be completed", { description: error.message });
        },
      },
    );
  };

  const handleOpenTrace = useCallback(
    (requirement: Requirement, evidence: EvidenceRecord) => {
      setTrace({ requirement, evidence });
      recordAuditEvent({
        action: "Officer viewed evidence",
        entity_type: "EVIDENCE",
        entity_id: evidence.id,
        entity_label: `${evidence.source_document ?? requirement.label}${
          evidence.source_page ? ` — Page ${evidence.source_page}` : ""
        }`,
        status: evidence.result,
        detail: `${bundle.data?.bidder.name ?? "Bidder"} / ${requirement.label}`,
      })
        .then(() => queryClient.invalidateQueries({ queryKey: ["verifai", "audit"] }))
        .catch(() => undefined);
    },
    [bundle.data?.bidder.name, queryClient],
  );

  const handleCloseTrace = () => {
    setTrace(null);
    if (searchParams.has("evidence")) {
      const next = new URLSearchParams(searchParams);
      next.delete("evidence");
      setSearchParams(next, { replace: true });
    }
  };

  // Evidence traces are deep-linkable: /review/S004?evidence=R-T002-01
  useEffect(() => {
    const target = searchParams.get("evidence");
    if (!target || trace || !bundle.data) return;
    const row = rows.find((item) => item.requirement.id === target);
    if (row?.evidence) handleOpenTrace(row.requirement, row.evidence);
  }, [searchParams, trace, bundle.data, rows, handleOpenTrace]);

  if (bundle.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-72 w-full" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (bundle.isError || !bundle.data) {
    return (
      <Card className="border-border shadow-panel">
        <CardContent className="p-6">
          <EmptyState
            icon={AlertTriangle}
            title="This bid review could not be loaded"
            description={
              bundle.error instanceof Error
                ? bundle.error.message
                : "The submission record could not be retrieved from the backend."
            }
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button size="sm" onClick={() => bundle.refetch()}>
                  <RefreshCw aria-hidden />
                  Retry
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/bids">
                    <ArrowLeft aria-hidden />
                    Back to bids
                  </Link>
                </Button>
              </div>
            }
          />
        </CardContent>
      </Card>
    );
  }

  const { submission: current, tender, bidder, documents, decision } = bundle.data;

  return (
    <div className="space-y-6">
      <ReviewHeader bundle={bundle.data} onRerun={handleRerun} rerunning={runVerification.isPending} />

      <SyntheticNotice />

      <RequirementTable
        rows={rows}
        onOpenTrace={handleOpenTrace}
        onRunVerification={handleRerun}
        running={runVerification.isPending}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AiAssessmentCard submission={current} />
        <div className="lg:sticky lg:top-20 lg:self-start">
          <OfficerDecisionCard
            submissionId={current.id}
            bidderName={bidder.name}
            decision={decision}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["verifai"] })}
          />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground">
        {bidder.name} · {tender.name} · {documents.length} document record(s) on file · submission {current.id}
      </p>

      <EvidenceTraceDialog
        open={Boolean(trace)}
        onOpenChange={(open) => (open ? undefined : handleCloseTrace())}
        requirement={trace?.requirement ?? null}
        evidence={trace?.evidence ?? null}
        documents={documents}
      />
    </div>
  );
};

export default ReviewPage;
