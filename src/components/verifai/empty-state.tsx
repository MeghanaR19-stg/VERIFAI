// Clean state for any screen with nothing to show yet.
import type { LucideIcon } from "lucide-react";
import { FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = FileSearch,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-6 py-10 text-center",
        className,
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-background text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? <p className="max-w-md text-xs text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
