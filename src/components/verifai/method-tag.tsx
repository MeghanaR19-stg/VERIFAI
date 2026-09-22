// The method tag every evidence record carries: [RULE VERIFIED], [AI ASSISTED],
// [DOCUMENT EVIDENCE] or [PROTOTYPE SOURCE].
import { cn } from "@/lib/utils";
import { methodLabel } from "@/lib/verifai/labels";

export function MethodTag({ method, className }: { method: string | null | undefined; className?: string }) {
  const isAi = method === "AI ASSISTED";
  const isPrototype = method === "PROTOTYPE SOURCE";
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center rounded border px-1.5 py-0.5",
        isAi
          ? "border-info-border bg-info-subtle text-info"
          : isPrototype
            ? "border-review-border bg-review-subtle text-review"
            : "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      {methodLabel(method)}
    </span>
  );
}

export function PrototypeTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center rounded border border-review-border bg-review-subtle px-1.5 py-0.5 text-review",
        className,
      )}
    >
      [PROTOTYPE SOURCE]
    </span>
  );
}

export function ExtractionTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center rounded border border-info-border bg-info-subtle px-1.5 py-0.5 text-info",
        className,
      )}
    >
      [PROTOTYPE EXTRACTION]
    </span>
  );
}
