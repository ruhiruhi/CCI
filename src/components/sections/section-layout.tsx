import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionLayoutProps = {
  /** Text column: kicker, heading, description, CTAs */
  children: ReactNode;
  /** Image / media column */
  media: ReactNode;
  /** Image on the left, text on the right */
  flip?: boolean;
  className?: string;
  contentClassName?: string;
  mediaClassName?: string;
};

/**
 * Shared text + image row used across the site.
 * Desktop: side-by-side, vertically centered.
 * Mobile: stacked (text above image), centered.
 */
export function SectionLayout({
  children,
  media,
  flip = false,
  className,
  contentClassName,
  mediaClassName,
}: SectionLayoutProps) {
  return (
    <div
      className={cn("section-layout", flip && "section-layout--flip", className)}
    >
      <div className={cn("section-layout__content", contentClassName)}>
        {children}
      </div>
      <div className={cn("section-layout__media", mediaClassName)}>{media}</div>
    </div>
  );
}
