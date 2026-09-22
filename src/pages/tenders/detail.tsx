// Tender detail: the requirement set and the bids received against it.
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, FolderOpen, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { PageHeader } from "@/components/verifai/page-header";
import { Pill, ResultBadge, RiskBadge } from "@/components/verifai/result-badge";
import { SyntheticNotice } from "@/components/verifai/synthetic-notice";
import { fetchBidders, fetchRequirements, fetchSubmissions, fetchTender } from "@/lib/verifai/api";
import { formatDateTime } from "@/lib/verifai/format";

const REQUIREMENT_TYPE_LABELS: Record<string, string> = {
  turnover: "Financial turnover",
  similar_projects: "Similar projects",
  experience: "Experience",
  gst: "GST registration",
  oem: "OEM authorization",
  iso: "ISO certification",
};

const TenderDetailPage = () => {
  const { tenderId } = useParams<{ tenderId: string }>();

  const tender = useQuery({
    queryKey: ["verifai", "tender", tenderId],
    queryFn: () => fetchTender(tenderId as string),
    enabled: Boolean(tenderId),
  });
  const requirements = useQuery({
    queryKey: ["verifai", "tender", tenderId, "requirements"],
    queryFn: () => fetchRequirements(tenderId as string),
    enabled: Boolean(tenderId),
  });
  const submissions = useQuery({
    queryKey: ["verifai", "tender", tenderId, "submissions"],
    queryFn: fetchSubmissions,
    enabled: Boolean(tenderId),
  });
  const bidders = useQuery({ queryKey: ["verifai", "bidders"], queryFn: fetchBidders });

  const isLoading = tender.isLoading || requirements.isLoading || submissions.isLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (tender.isError || !tender.data) {
    return (
      <Card className="border-border shadow-panel">
        <CardContent className="p-6">
          <EmptyState
            icon={TriangleAlert}
            title="Tender record not found"
            description={`No tender exists with the identifier ${tenderId ?? "provided"}.`}
            action={
              <Button size="sm" variant="outline" asChild>
                <Link to="/tenders">
                  <ArrowLeft aria-hidden />
                  Back to tenders
                </Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  const tenderRow = tender.data;
  const requirementRows = requirements.data ?? [];
  const tenderSubmissions = (submissions.data ?? []).filter((submission) => submission.tender_id === tenderRow.id);
  const bidderById = new Map((bidders.data ?? []).map((bidder) => [bidder.id, bidder]));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Tender ${tenderRow.id}`}
        title={tenderRow.name}
        description={`${tenderRow.department} · Updated ${formatDateTime(tenderRow.updated_at)}`}
        actions={
          <Button size="sm" variant="outline" asChild>
            <Link to="/tenders">
              <ArrowLeft aria-hidden />
              All tenders
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-panel">
          <CardContent className="p-4">
            <p className="label-mono text-muted-foreground">Status</p>
            <div className="mt-2">
              <Pill tone={tenderRow.status === "ACTIVE" ? "pass" : "neutral"}>{tenderRow.status}</Pill>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-panel">
          <CardContent className="p-4">
            <p className="label-mono text-muted-foreground">Requirements</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{requirementRows.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-panel">
          <CardContent className="p-4">
            <p className="label-mono text-muted-foreground">Bids received</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{tenderSubmissions.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-panel">
          <CardContent className="p-4">
            <p className="label-mono text-muted-foreground">Created</p>
            <p className="mt-2 text-sm text-foreground">{formatDateTime(tenderRow.created_at)}</p>
          </CardContent>
        </Card>
      </div>

      <SyntheticNotice />

      <Card className="border-border shadow-panel">
        <CardHeader className="gap-1.5 pb-3">
          <CardTitle className="text-base">Tender requirements</CardTitle>
          <CardDescription className="text-xs">
            Every bid against this tender is verified against these requirements.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {requirementRows.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={FolderOpen} title="No requirements published for this tender" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Requirement</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Mandatory</TableHead>
                  <TableHead>Verification method</TableHead>
                  <TableHead className="pr-5">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirementRows.map((requirement) => (
                  <TableRow key={requirement.id}>
                    <TableCell className="pl-5">
                      <p className="font-medium text-foreground">{requirement.label}</p>
                      <p className="text-xs text-muted-foreground">{requirement.display_value}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {REQUIREMENT_TYPE_LABELS[requirement.requirement_type] ?? requirement.requirement_type}
                    </TableCell>
                    <TableCell>
                      <Pill tone={requirement.mandatory ? "review" : "neutral"}>
                        {requirement.mandatory ? "Mandatory" : "Advisory"}
                      </Pill>
                    </TableCell>
                    <TableCell>
                      <MethodTag method={requirement.verification_method} />
                    </TableCell>
                    <TableCell className="pr-5">
                      <Pill tone={tenderSubmissions.length > 0 ? "info" : "neutral"}>
                        {tenderSubmissions.length > 0
                          ? `Applied to ${tenderSubmissions.length} bid${tenderSubmissions.length === 1 ? "" : "s"}`
                          : "Awaiting bids"}
                      </Pill>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border-border shadow-panel">
        <CardHeader className="gap-1.5 pb-3">
          <CardTitle className="text-base">Bids received</CardTitle>
          <CardDescription className="text-xs">
            Open a bid to review its compliance result and evidence.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {tenderSubmissions.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={FolderOpen}
                title="No bids received for this tender"
                description="Bidder submissions will appear here once they are recorded."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Bid</TableHead>
                  <TableHead>Bidder</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="pr-5 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenderSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="pl-5 font-medium text-foreground">{submission.id}</TableCell>
                    <TableCell className="max-w-[260px]">
                      <p className="truncate text-sm text-foreground">
                        {bidderById.get(submission.bidder_id)?.name ?? "—"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-foreground">
                      {submission.compliance_score === null ? "—" : `${submission.compliance_score}%`}
                    </TableCell>
                    <TableCell>
                      {submission.risk_level ? <RiskBadge risk={submission.risk_level} /> : <Pill tone="neutral">—</Pill>}
                    </TableCell>
                    <TableCell>
                      {submission.overall_status ? (
                        <ResultBadge result={submission.overall_status} />
                      ) : (
                        <Pill tone="neutral">PENDING</Pill>
                      )}
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/review/${submission.id}`}>
                          Compliance review
                          <ArrowRight aria-hidden />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TenderDetailPage;
