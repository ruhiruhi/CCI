import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, Users, Clapperboard } from "lucide-react";
import { LOCAL_IMAGES } from "@/lib/data";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { Curriculum } from "@/components/film-hub/curriculum";
import { Magazine } from "@/components/film-hub/magazine";
import { ReadingProgress } from "@/components/film-hub/reading-progress";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { CtaBand } from "@/components/sections/cta-band";
import { SectionLayout } from "@/components/sections/section-layout";

export const metadata: Metadata = {
  title: "Film Literacy Hub",
  description:
    "Film-literacy workshops, curriculum modules, and learning resources from the Conscious Cinema Initiative.",
};

const AUDIENCE = [
  {
    icon: GraduationCap,
    title: "Students and educators",
    body: "Schools and colleges hosting screenings, workshops, and film-literacy programs.",
  },
  {
    icon: Users,
    title: "Community partners",
    body: "Institutional, NGO, CSR, and strategic partners expanding access to meaningful cinema.",
  },
  {
    icon: Clapperboard,
    title: "Emerging filmmakers",
    body: "Young creators learning to document their communities with care, consent, and context.",
  },
];

export default function FilmLiteracyPage() {
  return (
    <>
      <ReadingProgress />
      <PageHero
        kicker="Film Literacy Hub"
        titleLines={["Education through", "film literacy."]}
        goldLineIndex={1}
        intro="Learning experiences that help young people watch critically, understand the language of cinema, and create responsibly."
        image={LOCAL_IMAGES.studentFilmmakers}
      />

      {/* Manifesto + image */}
      <section className="section-pad">
        <div className="shell">
          <SectionLayout
            media={
              <ParallaxImage
                src={LOCAL_IMAGES.editingSession}
                alt="Students learning to read film"
                className="section-layout-image aspect-[4/3]"
                amount={36}
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            }
          >
            <Reveal>
              <p className="font-display text-3xl font-light leading-snug tracking-tight text-warm md:text-4xl">
                Learning experiences help young people watch critically and create
                responsibly —{" "}
                <span className="text-gold-gradient">
                  from watching with attention to editing for meaning.
                </span>
              </p>
            </Reveal>
          </SectionLayout>
        </div>
      </section>

      {/* The magazine */}
      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="The reading room"
            titleLines={["Field notes,", "guides & voices."]}
            goldLineIndex={1}
            intro="Workshops, guides, and field notes on film literacy, documentary ethics, and community storytelling."
          />
          <div className="content-after-heading">
            <Magazine />
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            kicker="Who it's for"
            titleLines={["Built for the curious,", "not the credentialed."]}
          />
          <StaggerGroup className="content-after-heading grid gap-5 md:grid-cols-3" stagger={0.1}>
            {AUDIENCE.map((a) => (
              <StaggerItem key={a.title}>
                <div className="h-full rounded-2xl border border-warm/10 bg-charcoal/30 p-8 transition-colors duration-500 hover:bg-charcoal">
                  <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold">
                    <a.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-medium text-warm">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-cloud/75">{a.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Curriculum */}
      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="The curriculum"
            titleLines={["Five modules.", "One finished film."]}
            goldLineIndex={1}
            intro="Workshops on watching with attention, documentary ethics, and editing for meaning — plus screenings and student production pathways."
          />
          <div className="content-after-heading">
            <Curriculum />
          </div>
        </div>
      </section>

      {/* Apply band */}
      <section className="section-pad">
        <div className="shell flex flex-col items-start justify-between gap-8 rounded-3xl border border-warm/10 bg-charcoal/40 p-10 md:flex-row md:items-center md:p-14">
          <div>
            <p className="kicker mb-4">Join the movement</p>
            <h3 className="font-display text-3xl font-light text-warm md:text-4xl">
              Ready to host a workshop or screening?
            </h3>
          </div>
          <Magnetic>
            <Link
              href="/contact"
              className="group inline-flex h-14 items-center gap-2 rounded-full bg-gold px-8 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
            >
              Apply to participate
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Magnetic>
        </div>
      </section>

      <CtaBand
        kicker="Support CCI"
        titleLines={["Help meaningful cinema", "reach the people", "it can move."]}
        body="Support screenings, film education, equipment access, and mentoring through transparent giving."
        image={LOCAL_IMAGES.classroomScreening}
        primary={{ label: "Support film literacy", href: "/support" }}
        secondary={{ label: "See the gallery", href: "/gallery" }}
      />
    </>
  );
}
