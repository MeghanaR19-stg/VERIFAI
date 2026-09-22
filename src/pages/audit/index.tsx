// Audit trail: every system and officer action, newest first.
import { useState } from "react";
import { RefreshCw, ScrollText, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Pill, ResultBadge } from "@/components/verifai/result-badge";
import { useAuditEvents } from "@/hooks/use-verifai";
import { formatDateTime } from "@/lib/verifai/format";

const ENTITY_LABELS: Record<string, string> = {
  TENDER: "Tender",
  SUBMISSION: "Submission",
  REQUIREMENT: "Requirement",
  EVIDENCE: "Evidence",
  VERIFICATION: "Verification",
};

function isResult(value: string | null): value is "PASS" | "FAIL" | "REVIEW" {
  return value === "PASS" || value === "FAIL" || value === "REVIEW";
}

const AuditPage = () => {
  const audit = useAuditEvents();
  const [entity, setEntity] = useState("ALL");

  const events = audit.data ?? [];
  const entityTypes = Array.from(new Set(events.map((event) => event.entity_type)));
  const filtered = entity === "ALL" ? events : events.filter((event) => event.entity_type === entity);

  if (audit.isError) {
    return (
      <Card className="border-border shadow-panel">
        <CardContent className="p-6">
          <EmptyState
            icon={TriangleAlert}
            title="The audit trail could not be loaded"
            description={(audit.error as Error | null)?.message}
            action={
              <Button size="sm" onClick={() => void audit.refetch()}>
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
        eyebrow="Audit trail"
        title="Audit"
        description="Chronological record of system verification steps and officer actions. Nothing in this console changes a bid without an entry here."
        actions={
          <div className="flex items-center gap-2">
            <Select value={entity} onValueChange={setEntity}>
              <SelectTrigger className="h-9 w-[190px]">
                <SelectValue placeholder="Filter by entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All entities</SelectItem>
                {entityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {ENTITY_LABELS[type] ?? type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={() => void audit.refetch()}>
              <RefreshCw aria-hidden />
              Refresh
            </Button>
          </div>
        }
      />

      <Card className="border-border shadow-panel">
        <CardHeader className="gap-1.5 pb-3">
          <CardTitle className="text-base">Events</CardTitle>
          <CardDescription className="text-xs">
            Showing the {filtered.length} most recent of {events.length} loaded event{events.length === 1 ? "" : "s"}
            {entity === "ALL" ? "" : ` for ${ENTITY_LABELS[entity] ?? entity}`}. Older entries stay stored in the
            backend.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {audit.isLoading ? (
            <div className="space-y-2 p-5">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={ScrollText}
                title="No audit events to show"
                description={
                  events.length === 0
                    ? "Events appear here as tenders, bids, evidence records and decisions are recorded."
                    : "No events match the selected entity filter."
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Timestamp</TableHead>
                  <TableHead>User / system</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead className="pr-5">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="whitespace-nowrap pl-5 text-xs text-muted-foreground">
                      {formatDateTime(event.occurred_at)}
                    </TableCell>
                    <TableCell>
                      <Pill tone={event.actor === "OFFICER" ? "info" : "neutral"}>{event.actor}</Pill>
                      <p className="mt-1 text-[11px] text-muted-foreground">{event.actor_name}</p>
                    </TableCell>
                    <TableCell className="max-w-[320px]">
                      <p className="text-sm text-foreground">{event.action}</p>
                      {event.entity_label ? (
                        <p className="truncate text-xs text-muted-foreground">{event.entity_label}</p>
                      ) : null}
                      {event.detail ? (
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{event.detail}</p>
                      ) : null}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {ENTITY_LABELS[event.entity_type] ?? event.entity_type}
                      {event.entity_id && event.entity_id.length <= 12 ? ` · ${event.entity_id}` : ""}
                    </TableCell>
                    <TableCell className="pr-5">
                      {isResult(event.status) ? (
                        <ResultBadge result={event.status} />
                      ) : (
                        <Pill tone="neutral" className="max-w-[150px] overflow-hidden">
                          <span className="truncate" title={event.status ?? undefined}>
                            {event.status ?? "—"}
                          </span>
                        </Pill>
                      )}
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

export default AuditPage;
