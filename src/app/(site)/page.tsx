import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
import { WhyCinema } from "@/components/home/why-cinema";
import { Communities } from "@/components/home/communities";
import { HowChange } from "@/components/home/how-change";
import { PillarsSection } from "@/components/sections/pillars-section";
import { Pathways } from "@/components/sections/pathways";
import { StatsStrip } from "@/components/sections/stats-strip";
import { TimelineSection } from "@/components/sections/timeline-section";
import { StoriesSection } from "@/components/sections/stories-section";
import { GalleryPreviewSection } from "@/components/sections/gallery-preview-section";
import { EventsCarouselSection } from "@/components/sections/events-carousel-section";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaBand } from "@/components/sections/cta-band";
import { PartnersMarquee } from "@/components/sections/partners-marquee";
import { InstagramFeed } from "@/components/sections/instagram-feed";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";

export default function Home() {
  return (
    <>
      <HeroSection />

      <WhyCinema />

      <Communities />

      <HowChange />

      {/* Scene 04 — Our three pillars */}
      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="Scene 04 — Our three pillars"
            titleLines={["Screen. Teach.", "Transform."]}
            goldLineIndex={1}
            intro="Awareness through screenings, education through film literacy, and empowerment through making."
            align="center"
          />
          <div className="content-after-heading">
            <PillarsSection />
          </div>
        </div>
      </section>

      {/* Scene 05 — Impact timeline */}
      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            kicker="Scene 05 — The impact, in motion"
            titleLines={["Measured in participation,", "learning, and new voices."]}
            intro="Foundation-stage impact across screenings, institutions, and young filmmakers."
            align="center"
          />
          <StatsStrip className="mt-10" />
          <TimelineSection />
        </div>
      </section>

      {/* Scene 06 — Stories from communities (Scene 09 removed per client) */}
      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="Scene 06 — Stories from communities"
            titleLines={["What stays after", "the credits."]}
            goldLineIndex={1}
            align="center"
          />
          <div className="content-after-heading">
            <StoriesSection />
          </div>
        </div>
      </section>

      {/* Scene 07 — Film gallery */}
      <section className="section-pad">
        <div className="shell">
          <div className="flex flex-col items-center gap-6 text-center">
            <SectionHeading
              kicker="Scene 07 — From the field"
              titleLines={["Cinema that moves", "beyond the screen."]}
              align="center"
            />
            <Reveal>
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-2 text-sm font-medium text-warm link-underline"
              >
                Enter the gallery
                <ArrowUpRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          </div>
          <div className="content-after-heading">
            <GalleryPreviewSection />
          </div>
        </div>
      </section>

      {/* Scene 08 — Upcoming events */}
      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="Scene 08 — Upcoming screenings & events"
            titleLines={["Meet around films", "that ask something of us."]}
            align="center"
          />
        </div>
        <div className="content-after-heading">
          <EventsCarouselSection />
        </div>
      </section>

      {/* Scene 09 — Institutions (formerly Partners) */}
      <section className="border-y border-warm/10 bg-section-warm py-12 md:py-14">
        <div className="shell mb-8">
          <p className="kicker text-center">Scene 09 — Institutions</p>
          <h2 className="mt-3 text-center font-display text-2xl font-light text-warm md:text-3xl">
            Institutions advancing conscious cinema with us
          </h2>
        </div>
        <PartnersMarquee />
      </section>

      {/* Scene 10 — Testimonials */}
      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            kicker="Scene 10 — In their words"
            titleLines={["Reflections from educators,", "students, and partners."]}
            align="center"
            className="mb-10"
          />
          <Testimonials />
        </div>
      </section>

      <InstagramFeed />

      {/* Scene 11 — Become part of the movement */}
      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="Scene 11 — Become part of the movement"
            titleLines={["Bring a meaningful film", "conversation to your community."]}
            goldLineIndex={1}
            intro="Host a screening, volunteer your skills, support a student filmmaker, or partner with us to expand access."
            align="center"
          />
          <div className="content-after-heading">
            <Pathways />
          </div>
        </div>
      </section>

      <CtaBand
        primary={{ label: "Join the Movement", href: "/join" }}
        secondary={{ label: "Start a conversation", href: "/contact" }}
      />
    </>
  );
}
