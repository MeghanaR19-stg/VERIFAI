// Lightweight stacked distribution bar. Deliberately not a chart library:
// the counts are the point, not the decoration.
import { cn } from "@/lib/utils";

type Tone = "pass" | "review" | "fail";

export interface Segment {
  label: string;
  count: number;
  tone: Tone;
}

const BAR_CLASS: Record<Tone, string> = {
  pass: "bg-pass",
  review: "bg-review",
  fail: "bg-fail",
};

const DOT_CLASS: Record<Tone, string> = {
  pass: "bg-pass",
  review: "bg-review",
  fail: "bg-fail",
};

export function DistributionBar({
  segments,
  emptyLabel,
  title,
}: {
  segments: Segment[];
  emptyLabel: string;
  title?: string;
}) {
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);

  return (
    <div className="space-y-3">
      {title ? <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p> : null}
      {total === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
            {segments.map((segment) =>
              segment.count > 0 ? (
                <div
                  key={segment.label}
                  className={cn(BAR_CLASS[segment.tone], "h-full")}
                  style={{ width: `${(segment.count / total) * 100}%` }}
                  title={`${segment.label}: ${segment.count}`}
                />
              ) : null,
            )}
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {segments.map((segment) => (
              <li key={segment.label} className="flex items-center gap-2 text-sm">
                <span className={cn("h-2 w-2 rounded-full", DOT_CLASS[segment.tone])} aria-hidden />
                <span className="text-muted-foreground">{segment.label}</span>
                <span className="font-semibold tabular-nums text-foreground">{segment.count}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
