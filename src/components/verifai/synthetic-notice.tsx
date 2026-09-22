// Standing notices that keep the prototype honest on every screen.
import { Info, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROTOTYPE_NOTICE, SYNTHETIC_NOTICE } from "@/lib/verifai/labels";

export function SyntheticNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-info-border bg-info-subtle px-3 py-2 text-xs text-info",
        className,
      )}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      <p>
        <span className="label-mono mr-1">[SYNTHETIC DEMO DATA]</span>
        {SYNTHETIC_NOTICE}
      </p>
    </div>
  );
}

export function PrototypeNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-review-border bg-review-subtle px-3 py-2 text-xs text-review",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      <p>
        <span className="label-mono mr-1">[PROTOTYPE SOURCE]</span>
        {PROTOTYPE_NOTICE}
      </p>
    </div>
  );
}
