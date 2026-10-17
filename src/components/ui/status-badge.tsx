import { cn } from "@/lib/cn";

type Status = "Concept" | "In Development" | "Available";

/**
 * Honesty rule made visible: nothing on this site is labelled "Available" unless
 * it actually ships. Today every lab item is a Concept, so the badge reads as a
 * neutral, non-celebratory marker rather than a success state.
 */
const styles: Record<Status, string> = {
  Concept: "border-line-strong text-muted",
  "In Development": "border-brand-ink text-brand-ink",
  Available: "bg-brand text-on-brand border-transparent",
};

type StatusBadgeProps = {
  status: Status;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "label inline-flex items-center rounded-chip border px-2.5 py-1 leading-none",
        styles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
