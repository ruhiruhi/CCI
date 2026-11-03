import type { Metadata } from "next";
import { CINEMA_QUOTES, LOCAL_IMAGES, img, WHY_CINEMA_REASONS } from "@/lib/data";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { StatsStrip } from "@/components/sections/stats-strip";
import { StoriesShowcase } from "@/components/sections/stories-showcase";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal, TextReveal } from "@/components/motion/reveal";
import { SectionLayout } from "@/components/sections/section-layout";
import { QuotesCarousel } from "@/components/why-cinema/quotes-carousel";

export const metadata: Metadata = {
  title: "Why Cinema",
  description:
    "Why cinema matters — how film builds awareness, sparks dialogue, and supports filmmaker empowerment through the Conscious Cinema Initiative.",
};

export default function WhyCinemaPage() {
  return (
    <>
      <PageHero
        kicker="Why conscious cinema"
        titleLines={["Stories help us understand", "one another."]}
        goldLineIndex={1}
        intro="We use cinema as a public learning practice: a way to encounter lived realities, examine difficult questions, and imagine more humane possibilities together."
        image={LOCAL_IMAGES.classroomScreening}
      />

      {/* Opening statement */}
      <section className="section-pad">
        <div className="shell">
          <TextReveal
            lines={[
              "We use cinema as a",
              "public learning practice:",
              "encounter lived realities,",
              "examine difficult questions,",
              "imagine humane possibilities.",
            ]}
            className="mx-auto max-w-5xl text-center font-display text-[clamp(1.9rem,5.5vw,4.2rem)] font-light leading-[1.06] tracking-tight text-warm"
          />
        </div>
      </section>

      {/* Reasons — alternating editorial */}
      <section className="section-pad bg-section-warm pt-0">
        <div className="shell space-y-10 md:space-y-14">
          {WHY_CINEMA_REASONS.map((r, i) => {
            const flip = i % 2 === 1;
            return (
              <SectionLayout
                key={r.title}
                flip={flip}
                media={
                  <ParallaxImage
                    src={img(r.image, 1200)}
                    alt={r.title}
                    className="section-layout-image aspect-[5/4]"
                    amount={36}
                    sizes="(max-width: 1024px) 90vw, 42vw"
                  />
                }
              >
                <Reveal>
                  <span className="font-display text-6xl font-light text-warm/10 md:text-7xl">
                    0{i + 1}
                  </span>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="-mt-4 font-display text-3xl font-light tracking-tight text-warm md:text-4xl">
                    {r.title}
                  </h2>
                </Reveal>
                <Reveal delay={0.15}>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-cloud/80">
                    {r.body}
                  </p>
                </Reveal>
              </SectionLayout>
            );
          })}
        </div>
      </section>

      {/* Interactive stats */}
      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            kicker="The proof"
            titleLines={["Feeling, turned", "into change."]}
            align="center"
            className="mb-10"
          />
          <StatsStrip />
        </div>
      </section>

      {/* Quotes */}
      <section className="section-pad bg-section-warm">
        <div className="shell">
          <QuotesCarousel quotes={CINEMA_QUOTES} />
        </div>
      </section>

      {/* Real community stories */}
      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            kicker="It is not theory"
            titleLines={["Cinema changed", "these lives. Really."]}
            goldLineIndex={1}
          />
          <div className="content-after-heading">
            <StoriesShowcase />
          </div>
        </div>
      </section>
    </>
  );
}
