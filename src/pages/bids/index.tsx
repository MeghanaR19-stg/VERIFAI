// Bids register: every bidder submission with its current compliance result.
import { Link } from "react-router-dom";
import { ArrowRight, FileStack, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/verifai/empty-state";
import { PageHeader } from "@/components/verifai/page-header";
import { Pill, ResultBadge, RiskBadge } from "@/components/verifai/result-badge";
import { SyntheticNotice } from "@/components/verifai/synthetic-notice";
import { useBidders, useSubmissions, useTenders } from "@/hooks/use-verifai";
import { formatRelative } from "@/lib/verifai/format";

const BidsPage = () => {
  const submissions = useSubmissions();
  const tenders = useTenders();
  const bidders = useBidders();

  const isLoading = submissions.isLoading || tenders.isLoading || bidders.isLoading;

  if (submissions.isError) {
    return (
      <Card className="border-border shadow-panel">
        <CardContent className="p-6">
          <EmptyState
            icon={TriangleAlert}
            title="Bid submissions could not be loaded"
            description={(submissions.error as Error | null)?.message}
            action={
              <Button size="sm" onClick={() => void submissions.refetch()}>
                <RefreshCw aria-hidden />
                Retry
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  const tenderById = new Map((tenders.data ?? []).map((tender) => [tender.id, tender]));
  const bidderById = new Map((bidders.data ?? []).map((bidder) => [bidder.id, bidder]));
  const rows = submissions.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Bidder submissions"
        title="Bids"
        description="Six synthetic submissions across three tenders, covering PASS, REVIEW and FAIL outcomes."
      />

      <SyntheticNotice />

      <Card className="border-border shadow-panel">
        <CardContent className="p-0">
          {!isLoading && rows.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={FileStack}
                title="No bids on record"
                description="Bidder submissions will appear here once they are received."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Bid</TableHead>
                  <TableHead>Tender</TableHead>
                  <TableHead>Bidder</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Last updated</TableHead>
                  <TableHead className="pr-5 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="pl-5 font-medium text-foreground">{submission.id}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <p className="truncate text-sm text-foreground">
                        {tenderById.get(submission.tender_id)?.name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">{submission.tender_id}</p>
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <p className="truncate text-sm text-foreground">
                        {bidderById.get(submission.bidder_id)?.name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">{submission.bidder_id}</p>
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
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatRelative(submission.verified_at ?? submission.submitted_at)}
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/bids/${submission.id}`}>Documents</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/review/${submission.id}`}>
                            Review
                            <ArrowRight aria-hidden />
                          </Link>
                        </Button>
                      </div>
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

export default BidsPage;
