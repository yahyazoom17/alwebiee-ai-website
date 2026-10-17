"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger in milliseconds, applied as a transition delay. */
  delay?: number;
};

/**
 * Fades a block in as it enters the viewport — progressive enhancement only.
 *
 * The server renders the final, visible state, so the page is complete without
 * JavaScript. After mount, and only for elements still below the fold, the
 * inline `pending` state is applied and an observer flips it to `shown`. Because
 * nothing on screen is ever hidden, this cannot flash.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already visible: leave the default state alone rather than hiding it.
    if (node.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    node.dataset.reveal = "pending";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          node.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
