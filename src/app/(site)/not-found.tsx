import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden grain">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,color-mix(in_oklab,var(--color-gold)_8%,transparent),transparent)]" />
      <div className="shell relative z-10 text-center">
        <p className="kicker mb-6">Scene not found</p>
        <h1 className="font-display text-[clamp(4rem,18vw,12rem)] font-light leading-none text-warm">
          4<span className="text-gold-gradient">0</span>4
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-cloud/80">
          This frame seems to have been left on the cutting-room floor. Let&apos;s
          get you back to the story.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex h-14 items-center gap-2 rounded-full bg-gold px-8 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to the beginning
        </Link>
      </div>
    </section>
  );
}
