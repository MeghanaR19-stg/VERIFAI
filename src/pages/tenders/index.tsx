// Tenders register.
import { Link } from "react-router-dom";
import { ArrowRight, FolderOpen, RefreshCw, TriangleAlert } from "lucide-react";
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
import { Pill } from "@/components/verifai/result-badge";
import { SyntheticNotice } from "@/components/verifai/synthetic-notice";
import { useAllRequirements, useSubmissions, useTenders } from "@/hooks/use-verifai";
import { formatDateTime } from "@/lib/verifai/format";

const TendersPage = () => {
  const tenders = useTenders();
  const requirements = useAllRequirements();
  const submissions = useSubmissions();

  const isLoading = tenders.isLoading || requirements.isLoading || submissions.isLoading;

  if (tenders.isError) {
    return (
      <Card className="border-border shadow-panel">
        <CardContent className="p-6">
          <EmptyState
            icon={TriangleAlert}
            title="Tender records could not be loaded"
            description={(tenders.error as Error | null)?.message}
            action={
              <Button size="sm" onClick={() => void tenders.refetch()}>
                <RefreshCw aria-hidden />
                Retry
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tender management"
        title="Tenders"
        description="Each tender carries the requirement set that bidder submissions are verified against."
      />

      <SyntheticNotice />

      <Card className="border-border shadow-panel">
        <CardContent className="p-0">
          {!isLoading && (tenders.data ?? []).length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={FolderOpen}
                title="No tenders on record"
                description="Tender records will appear here once they are published."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Tender ID</TableHead>
                  <TableHead>Tender name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Requirements</TableHead>
                  <TableHead className="text-right">Bids</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last updated</TableHead>
                  <TableHead className="pr-5 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(tenders.data ?? []).map((tender) => (
                  <TableRow key={tender.id}>
                    <TableCell className="pl-5 font-medium text-foreground">{tender.id}</TableCell>
                    <TableCell className="max-w-[280px]">
                      <p className="truncate text-sm font-medium text-foreground">{tender.name}</p>
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <p className="truncate text-sm text-muted-foreground">{tender.department}</p>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-foreground">
                      {(requirements.data ?? []).filter((requirement) => requirement.tender_id === tender.id).length}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-foreground">
                      {(submissions.data ?? []).filter((submission) => submission.tender_id === tender.id).length}
                    </TableCell>
                    <TableCell>
                      <Pill tone={tender.status === "ACTIVE" ? "pass" : "neutral"}>{tender.status}</Pill>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatDateTime(tender.updated_at)}
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/tenders/${tender.id}`}>
                          Open
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

export default TendersPage;
