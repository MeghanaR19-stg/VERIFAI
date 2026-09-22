// Bid detail: bidder profile, document evidence and the simulated government
// source checks for that bidder.
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, FileStack, RefreshCw, ShieldCheck, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/verifai/empty-state";
import { PageHeader } from "@/components/verifai/page-header";
import { Pill, ResultBadge, RiskBadge } from "@/components/verifai/result-badge";
import { PrototypeNotice, SyntheticNotice } from "@/components/verifai/synthetic-notice";
import { useRunVerification } from "@/hooks/use-verifai";
import { fetchBidder, fetchDocuments, fetchSubmission, fetchTender, fetchVerifications } from "@/lib/verifai/api";
import { formatCr, formatDateTime } from "@/lib/verifai/format";
import { DocumentList } from "./document-list";
import { UploadDocumentDialog } from "./upload-document-dialog";

const VERIFICATION_TONE = (status: string): "pass" | "review" | "neutral" => {
  if (["ACTIVE", "REGISTERED", "VALID", "COMPLIANT", "NO_RECORD_FOUND"].includes(status)) return "pass";
  if (status === "NOT_EXERCISED") return "neutral";
  return "review";
};

const BidDetailPage = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const queryClient = useQueryClient();
  const runVerification = useRunVerification();

  const submission = useQuery({
    queryKey: ["verifai", "submission", submissionId],
    queryFn: () => fetchSubmission(submissionId as string),
    enabled: Boolean(submissionId),
  });

  const tenderId = submission.data?.tender_id;
  const bidderId = submission.data?.bidder_id;

  const tender = useQuery({
    queryKey: ["verifai", "tender", tenderId],
    queryFn: () => fetchTender(tenderId as string),
    enabled: Boolean(tenderId),
  });
  const bidder = useQuery({
    queryKey: ["verifai", "bidder", bidderId],
    queryFn: () => fetchBidder(bidderId as string),
    enabled: Boolean(bidderId),
  });
  const documents = useQuery({
    queryKey: ["verifai", "documents", submissionId],
    queryFn: () => fetchDocuments(submissionId as string),
    enabled: Boolean(submissionId),
  });
  const verifications = useQuery({
    queryKey: ["verifai", "verifications", bidderId],
    queryFn: () => fetchVerifications(bidderId as string),
    enabled: Boolean(bidderId),
  });

  const isLoading = submission.isLoading || bidder.isLoading || documents.isLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (submission.isError || !submission.data || !bidder.data) {
    return (
      <Card className="border-border shadow-panel">
        <CardContent className="p-6">
          <EmptyState
            icon={TriangleAlert}
            title="Bid record not found"
            description={`No submission exists with the identifier ${submissionId ?? "provided"}.`}
            action={
              <Button size="sm" variant="outline" asChild>
                <Link to="/bids">
                  <ArrowLeft aria-hidden />
                  Back to bids
                </Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  const current = submission.data;
  const bidderRow = bidder.data;
  const documentRows = documents.data ?? [];

  const handleRerun = () => {
    runVerification.mutate(
      { submission_id: current.id },
      {
        onSuccess: () => {
          toast.success("Verification re-run", {
            description: "The evidence records for this bid were regenerated.",
          });
          void queryClient.invalidateQueries({ queryKey: ["verifai"] });
        },
        onError: (error: Error) => toast.error("Verification failed", { description: error.message }),
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Bid ${current.id}`}
        title={bidderRow.name}
        description={`${tender.data?.name ?? "Tender"} · submitted ${formatDateTime(current.submitted_at)}`}
        actions={
          <>
            <Button size="sm" variant="outline" asChild>
              <Link to="/bids">
                <ArrowLeft aria-hidden />
                All bids
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to={`/review/${current.id}`}>
                Compliance review
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </>
        }
      />

      <SyntheticNotice />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-panel">
          <CardContent className="p-4">
            <p className="label-mono text-muted-foreground">Result</p>
            <div className="mt-2">
              {current.overall_status ? (
                <ResultBadge result={current.overall_status} />
              ) : (
                <Pill tone="neutral">PENDING</Pill>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-panel">
          <CardContent className="p-4">
            <p className="label-mono text-muted-foreground">Compliance score</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
              {current.compliance_score === null ? "—" : `${current.compliance_score}%`}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-panel">
          <CardContent className="p-4">
            <p className="label-mono text-muted-foreground">Risk</p>
            <div className="mt-2">
              {current.risk_level ? <RiskBadge risk={current.risk_level} /> : <Pill tone="neutral">—</Pill>}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-panel">
          <CardContent className="p-4">
            <p className="label-mono text-muted-foreground">Verified</p>
            <p className="mt-2 text-sm text-foreground">{formatDateTime(current.verified_at)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-panel">
        <CardHeader className="gap-1.5 pb-3">
          <CardTitle className="text-base">Bidder profile</CardTitle>
          <CardDescription className="text-xs">Declared values from the synthetic bidder record.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Registered entity", value: bidderRow.registered_name },
              { label: "Declared turnover", value: formatCr(bidderRow.turnover_cr) },
              { label: "Similar projects", value: `${bidderRow.similar_projects} completed` },
              { label: "Experience", value: `${bidderRow.experience_years} years` },
              { label: "GST status", value: `${bidderRow.gst_status}${bidderRow.gstin ? ` · ${bidderRow.gstin}` : ""}` },
              { label: "OEM authorization", value: bidderRow.oem_authorization ? "On record" : "Not on record" },
              { label: "ISO 13485", value: bidderRow.iso_13485 ? "On record" : "Not on record" },
              { label: "Udyam", value: bidderRow.udyam_number ?? "—" },
              { label: "PAN", value: bidderRow.pan ?? "—" },
            ].map((row) => (
              <div key={row.label} className="border-b border-dashed border-border pb-2">
                <dt className="label-mono text-muted-foreground">{row.label}</dt>
                <dd className="mt-1 text-sm text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card className="border-border shadow-panel">
        <CardHeader className="flex-row items-start justify-between gap-3 pb-3">
          <div className="space-y-1.5">
            <CardTitle className="text-base">Document evidence</CardTitle>
            <CardDescription className="text-xs">
              {documentRows.length} document record{documentRows.length === 1 ? "" : "s"} with prototype extraction.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleRerun} disabled={runVerification.isPending}>
              <RefreshCw className={runVerification.isPending ? "animate-spin" : undefined} aria-hidden />
              {runVerification.isPending ? "Verifying…" : "Re-run verification"}
            </Button>
            <UploadDocumentDialog
              submissionId={current.id}
              bidder={bidderRow}
              onUploaded={() => {
                void queryClient.invalidateQueries({ queryKey: ["verifai", "documents", submissionId] });
                void queryClient.invalidateQueries({ queryKey: ["verifai", "audit"] });
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <DocumentList documents={documentRows} />
        </CardContent>
      </Card>

      <Card className="border-border shadow-panel">
        <CardHeader className="gap-1.5 pb-3">
          <CardTitle className="text-base">Simulated government source checks</CardTitle>
          <CardDescription className="text-xs">
            Prototype adapters only. No live government database is queried.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verifications.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (verifications.data ?? []).length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No verification records for this bidder"
              description="Simulated source checks have not been recorded yet."
            />
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {(verifications.data ?? []).map((check) => (
                <li
                  key={check.id}
                  className="flex items-start justify-between gap-3 rounded-md border border-border bg-muted/40 p-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {check.check_type.replace(/_/g, " / ")}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{check.source_adapter}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{check.identifier ?? "No identifier"}</p>
                  </div>
                  <Pill tone={VERIFICATION_TONE(check.status)}>{check.status.replace(/_/g, " ")}</Pill>
                </li>
              ))}
            </ul>
          )}
          <PrototypeNotice />
        </CardContent>
      </Card>

      <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <FileStack className="h-3.5 w-3.5" aria-hidden />
        Submission {current.id} · tender {current.tender_id} · bidder {current.bidder_id}
      </p>
    </div>
  );
};

export default BidDetailPage;
