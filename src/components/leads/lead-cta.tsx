import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import {
  contactPathForInterest,
  interestFromCta,
  isLeadCtaHref,
  joinPathForInterest,
} from "@/lib/leads";
import { cn } from "@/lib/utils";

type LeadCtaProps = {
  href: string;
  label: string;
  className?: string;
  children?: ReactNode;
  /** Route to Contact with interest even for non-lead hrefs */
  forceLead?: boolean;
  interest?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "className" | "children" | "href">;

/**
 * Join-the-movement CTAs open the Join CCI form (/join).
 * Contact / conversation CTAs open /contact with interest pre-selected.
 */
export function LeadCta({
  href,
  label,
  className,
  children,
  forceLead,
  interest,
  ...rest
}: LeadCtaProps) {
  const resolvedInterest = interest ?? interestFromCta(label, href);
  const isJoin =
    resolvedInterest === "Join the Movement" ||
    href.startsWith("/join") ||
    /join/i.test(label);

  let destination = href;
  if (isJoin && !href.startsWith("/contact")) {
    destination = joinPathForInterest(resolvedInterest);
  } else if (forceLead || isLeadCtaHref(href) || Boolean(interest)) {
    destination = contactPathForInterest(resolvedInterest);
  }

  return (
    <Link href={destination} className={cn(className)} data-cursor="hover" {...rest}>
      {children ?? label}
    </Link>
  );
}
