import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_POST_URLS,
  INSTAGRAM_PROFILE_URL,
  isReelUrl,
} from "@/lib/instagram";
import { cn } from "@/lib/utils";

type InstagramFeedProps = {
  /** Instagram reel/post URLs. Prefer /reel/ links. Max 6 shown. */
  postUrls?: string[];
  className?: string;
};

function embedUrl(postUrl: string): string {
  const base = postUrl.split("?")[0].replace(/\/$/, "");
  return `${base}/embed`;
}

export function InstagramFeed({
  postUrls = INSTAGRAM_POST_URLS,
  className,
}: InstagramFeedProps) {
  // Prefer reels; fall back to any curated post URLs. Never embed the full profile page.
  const curated = postUrls.filter(Boolean);
  const reels = curated.filter(isReelUrl);
  const posts = (reels.length > 0 ? reels : curated).slice(0, 6);
  const hasPosts = posts.length > 0;

  return (
    <section className={cn("section-pad", className)}>
      <div className="shell">
        <SectionHeading
          kicker="Social"
          titleLines={["Latest from Instagram"]}
          intro="Selected reels from the movement — not the full Instagram feed."
          align="center"
        />

        {hasPosts ? (
          <StaggerGroup
            className="content-after-heading grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.08}
          >
            {posts.map((url) => (
              <StaggerItem key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open Instagram reel from ${INSTAGRAM_HANDLE}`}
                  className="group relative block aspect-[9/16] overflow-hidden rounded-2xl border border-warm/10 bg-charcoal/40 shadow-[var(--shadow-soft)] transition duration-500 hover:-translate-y-0.5 hover:border-gold/25 hover:shadow-[var(--shadow-medium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
                  data-cursor="hover"
                >
                  <iframe
                    src={embedUrl(url)}
                    title={`Instagram reel from ${INSTAGRAM_HANDLE}`}
                    loading="lazy"
                    scrolling="no"
                    className="pointer-events-none absolute inset-0 h-full w-full border-0"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-ink/0 transition group-hover:bg-ink/25" />
                </a>
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <Reveal delay={0.1} className="content-after-heading">
            <div className="mx-auto max-w-2xl rounded-2xl border border-warm/10 bg-charcoal/40 p-8 text-center shadow-[var(--shadow-soft)] md:p-10">
              <p className="text-sm text-cloud">
                Selected Instagram reels will appear here once curated links are
                added in admin or{" "}
                <code className="text-gold">INSTAGRAM_POST_URLS</code>.
              </p>
              <p className="mt-3 text-xs text-mist">
                {/* TODO: Connect Instagram Graph API with INSTAGRAM_ACCESS_TOKEN */}
                Full profile embeds are intentionally disabled per client request.
              </p>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.25} className="mt-10 flex justify-center md:mt-12">
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="group inline-flex items-center gap-2 text-sm font-medium text-warm link-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
            aria-label={`Follow Us ${INSTAGRAM_HANDLE} on Instagram`}
          >
            Follow Us {INSTAGRAM_HANDLE}
            <ArrowUpRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
