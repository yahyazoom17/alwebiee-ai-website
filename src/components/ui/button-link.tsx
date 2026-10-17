import Link from "next/link";
import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  icon?: IconName;
  className?: string;
};

const base =
  "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-control px-6 text-sm font-medium transition-colors duration-200";

const variants = {
  primary:
    "bg-brand text-on-brand hover:bg-brand-hover outline-offset-2 font-semibold",
  secondary:
    "border-control-line text-fg hover:border-brand hover:text-brand-ink border bg-transparent",
  quiet: "text-muted hover:text-fg px-0",
} as const;

/**
 * One CTA component for every destination. Internal routes go through next/link
 * so navigation stays client-side; mailto:, http(s): and bare #anchors render as
 * plain anchors.
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon,
  className,
}: ButtonLinkProps) {
  const isInternal = href.startsWith("/");

  const content = (
    <>
      {children}
      {icon ? (
        <Icon
          name={icon}
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      ) : null}
    </>
  );

  const classes = cn(base, variants[variant], className);

  if (isInternal) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}
