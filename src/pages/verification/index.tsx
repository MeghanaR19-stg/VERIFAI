// Simulated government source verification. Every value here is prototype
// data from a mock adapter — the page says so repeatedly and deliberately.
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, ShieldCheck, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
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
import { PageHeader } from "@/components/verifai/page-header";
import { Pill } from "@/components/verifai/result-badge";
import { PrototypeNotice } from "@/components/verifai/synthetic-notice";
import { useBidders, useVerifications } from "@/hooks/use-verifai";
import { recordAuditEvent, refreshSimulatedVerification } from "@/lib/verifai/api";
import { formatDateTime } from "@/lib/verifai/format";
import type { VerificationRecord } from "@/lib/verifai/types";

const CHECK_ORDER = [
  "GST",
  "Udyam",
  "PAN",
  "MCA",
  "Startup",
  "NSIC",
  "EPFO_ESIC",
  "Blacklisting",
];

const CHECK_LABELS: Record<string, string> = {
  GST: "GST",
  Udyam: "Udyam",
  PAN: "PAN",
  MCA: "MCA",
  Startup: "Startup India",
  NSIC: "NSIC",
  EPFO_ESIC: "EPFO / ESIC",
  Blacklisting: "Debarment",
};

function statusTone(status: string): "pass" | "review" | "neutral" {
  if (["ACTIVE", "REGISTERED", "VALID", "COMPLIANT", "NO_RECORD_FOUND"].includes(status)) return "pass";
  if (status === "NOT_EXERCISED") return "neutral";
  return "review";
}

const VerificationPage = () => {
  const queryClient = useQueryClient();
  const verifications = useVerifications();
  const bidders = useBidders();
  const [rerunning, setRerunning] = useState(false);

  const records = verifications.data ?? [];
  const bidderList = bidders.data ?? [];
  const isLoading = verifications.isLoading || bidders.isLoading;

  const handleRerun = async () => {
    setRerunning(true);
    try {
      await refreshSimulatedVerification();
      await recordAuditEvent({
        action: "Simulated verification re-run",
        entity_type: "VERIFICATION",
        entity_label: "All prototype adapters",
        status: "COMPLETED",
        detail: `${records.length} prototype adapter records re-stamped. No live government lookup was performed.`,
        actor: "OFFICER",
      });
      await queryClient.invalidateQueries({ queryKey: ["verifai"] });
      toast.success("Simulated verification re-run", {
        description: "Prototype adapter results re-stamped. No live government lookup was performed.",
      });
    } catch (error) {
      toast.error("The simulated verification could not be re-run", {
        description: error instanceof Error ? error.message : "Unexpected error",
      });
    } finally {
      setRerunning(false);
    }
  };

  if (verifications.isError) {
    return (
      <Card className="border-border shadow-panel">
        <CardContent className="p-6">
          <EmptyState
            icon={TriangleAlert}
            title="Verification records could not be loaded"
            description={(verifications.error as Error | null)?.message}
            action={
              <Button size="sm" onClick={() => void verifications.refetch()}>
                <RefreshCw aria-hidden />
                Retry
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  const matrixFor = (bidderId: string, checkType: string): VerificationRecord | undefined =>
    records.find((record) => record.bidder_id === bidderId && record.check_type === checkType);

  const adapters = CHECK_ORDER.map((checkType) => {
    const rows = records.filter((record) => record.check_type === checkType);
    return {
      checkType,
      label: CHECK_LABELS[checkType] ?? checkType,
      sourceAdapter: rows[0]?.source_adapter ?? "Prototype adapter",
      detail: rows[0]?.detail ?? "Adapter present but not exercised in this prototype demonstration.",
      exercised: rows.some((row) => row.status !== "NOT_EXERCISED"),
      lastChecked: rows.map((row) => row.checked_at).sort().at(-1) ?? null,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Government verification"
        title="Verification"
        description="Simulated source checks for each bidder. These adapters stand in for GST, Udyam, PAN, MCA, Startup India, NSIC, EPFO/ESIC and debarment sources."
        actions={
          <Button size="sm" variant="outline" onClick={handleRerun} disabled={rerunning}>
            <RefreshCw className={rerunning ? "animate-spin" : undefined} aria-hidden />
            {rerunning ? "Re-running…" : "Re-run simulated verification"}
          </Button>
        }
      />

      <PrototypeNotice />

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : records.length === 0 ? (
        <Card className="border-border shadow-panel">
          <CardContent className="p-6">
            <EmptyState
              icon={ShieldCheck}
              title="No verification records"
              description="Simulated source checks have not been recorded for any bidder yet."
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-border shadow-panel">
            <CardHeader className="gap-1.5 pb-3">
              <CardTitle className="text-base">Verification matrix</CardTitle>
              <CardDescription className="text-xs">
                One row per adapter, one column per bidder.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table dense>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5">Adapter</TableHead>
                    {bidderList.map((bidder) => (
                      <TableHead key={bidder.id} className="whitespace-nowrap">
                        {bidder.name.replace(/ Pvt\. Ltd\.| Private Limited| Technologies/g, "")}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CHECK_ORDER.map((checkType) => (
                    <TableRow key={checkType}>
                      <TableCell className="pl-5">
                        <p className="text-sm font-medium text-foreground">
                          {CHECK_LABELS[checkType] ?? checkType}
                        </p>
                        <p className="text-xs text-muted-foreground">{checkType}</p>
                      </TableCell>
                      {bidderList.map((bidder) => {
                        const record = matrixFor(bidder.id, checkType);
                        return (
                          <TableCell key={bidder.id}>
                            {record ? (
                              <Pill tone={statusTone(record.status)}>{record.status.replace(/_/g, " ")}</Pill>
                            ) : (
                              <Pill tone="neutral">NOT RECORDED</Pill>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border shadow-panel">
            <CardHeader className="gap-1.5 pb-3">
              <CardTitle className="text-base">Adapters</CardTitle>
              <CardDescription className="text-xs">
                Each adapter is a mock implementation. No adapter calls a live government service.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 lg:grid-cols-2">
              {adapters.map((adapter) => (
                <div key={adapter.checkType} className="rounded-md border border-border bg-card p-3.5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{adapter.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{adapter.sourceAdapter}</p>
                    </div>
                    <span className="label-mono rounded border border-review-border bg-review-subtle px-1.5 py-0.5 text-review">
                      [PROTOTYPE SOURCE]
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{adapter.detail}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {adapter.exercised
                      ? `Last checked ${formatDateTime(adapter.lastChecked)}`
                      : "Not exercised in this prototype demonstration"}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default VerificationPage;
