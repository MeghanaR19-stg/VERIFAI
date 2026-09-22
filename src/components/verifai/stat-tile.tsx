// Metric tile for the Command Center.
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "pass" | "review" | "fail" | "info" | "neutral";

const TONE_CLASS: Record<Tone, string> = {
  pass: "bg-pass-subtle text-pass",
  review: "bg-review-subtle text-review",
  fail: "bg-fail-subtle text-fail",
  info: "bg-info-subtle text-info",
  neutral: "bg-muted text-muted-foreground",
};

export function StatTile({
  label,
  value,
  hint,
  tone = "neutral",
  icon: Icon,
  loading,
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: Tone;
  icon?: LucideIcon;
  loading?: boolean;
}) {
  return (
    <Card className="border-border shadow-panel">
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums leading-none text-foreground">
            {loading ? "—" : value}
          </p>
          {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", TONE_CLASS[tone])}>
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}
