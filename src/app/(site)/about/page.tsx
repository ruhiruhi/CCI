import type { Metadata } from "next";
import Image from "next/image";
import { LOCAL_IMAGES, LEADERSHIP, VALUES } from "@/lib/data";
import { getPublishedTimeline } from "@/lib/cms";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { Timeline } from "@/components/sections/timeline";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal, StaggerGroup, StaggerItem, TextReveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { SectionLayout } from "@/components/sections/section-layout";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about CCI's mission, vision, values, journey, founding team, and advisory community.",
};

export default async function AboutPage() {
  const timeline = await getPublishedTimeline();

  return (
    <>
      <PageHero
        kicker="About CCI"
        titleLines={["A movement built around", "the shared experience", "of cinema."]}
        goldLineIndex={2}
        intro="CCI exists to make meaningful cinema more accessible and to help communities turn stories into reflection, dialogue, and action."
        image={LOCAL_IMAGES.heroScreening}
      />

      {/* Mission & Vision */}
      <section className="section-pad">
        <div className="shell grid gap-8 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <div className="rounded-2xl border border-warm/10 bg-charcoal/40 p-7 md:p-8">
              <p className="kicker mb-4">Our mission</p>
              <p className="font-display text-2xl font-light leading-snug text-warm md:text-3xl">
                To harness the power of cinema to inspire awareness, educate minds,
                strengthen communities, empower filmmakers, and drive meaningful
                social change.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-warm/10 bg-charcoal/40 p-7 md:p-8">
              <p className="kicker mb-4">Our vision</p>
              <p className="font-display text-2xl font-light leading-snug text-warm md:text-3xl">
                A society where every young person can access meaningful films,
                understand the language of cinema, and use storytelling to
                participate in public life.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Big quote + image */}
      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionLayout
            media={
              <ParallaxImage
                src={LOCAL_IMAGES.classroomScreening}
                alt="An audience watching intently in the dark"
                className="section-layout-image aspect-[4/5] vignette"
                amount={40}
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            }
          >
            <TextReveal
              lines={[
                "CCI began with a simple observation: powerful films often reach festivals, but not the classrooms where conversations begin.",
              ]}
              className="font-display text-3xl font-light leading-[1.12] tracking-tight text-warm sm:text-4xl md:text-[2.5rem]"
            />
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-xl text-cloud/80 md:mt-6">
                The initiative brings films, facilitation, education, and production support into one connected movement.
              </p>
            </Reveal>
          </SectionLayout>
        </div>
      </section>

      {/* Core values */}
      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            kicker="What we stand for"
            titleLines={["Four convictions", "we never compromise."]}
          />
          <StaggerGroup className="content-after-heading grid gap-5 md:grid-cols-2" stagger={0.1}>
            {VALUES.map((v, i) => (
              <StaggerItem key={v.title}>
                <div className="group flex h-full gap-6 rounded-2xl border border-warm/10 bg-charcoal/30 p-8 transition-colors duration-500 hover:bg-charcoal">
                  <span className="font-display text-3xl font-light text-gold/70">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-medium text-warm">{v.title}</h3>
                    <p className="mt-2 text-cloud/75">{v.body}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Journey */}
      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="Our journey"
            titleLines={["From first screenings", "to a national movement."]}
            goldLineIndex={1}
          />
          <Timeline items={timeline} />
        </div>
      </section>

      {/* Leadership */}
      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            kicker="The people behind it"
            titleLines={["Founding team", "and advisory community."]}
          />
          <StaggerGroup
            className="content-after-heading grid grid-cols-2 gap-5 lg:grid-cols-4"
            stagger={0.1}
          >
            {LEADERSHIP.map((p) => (
              <StaggerItem key={p.name}>
                <figure className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover grayscale transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  </div>
                  <figcaption className="mt-4">
                    <p className="font-medium text-warm">{p.name}</p>
                    <p className="text-sm text-mist">{p.role}</p>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <CtaBand
        kicker="Join the movement"
        titleLines={["Bring a meaningful film", "conversation to your", "community."]}
        body="Host a screening, volunteer your skills, support a student filmmaker, or partner with us to expand access."
        image={LOCAL_IMAGES.heroScreening}
      />
    </>
  );
}
