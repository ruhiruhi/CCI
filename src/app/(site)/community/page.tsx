import type { Metadata } from "next";
import Image from "next/image";
import { LOCAL_IMAGES, img, LEADERSHIP, PARTNERS } from "@/lib/data";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { VolunteerJourney } from "@/components/sections/volunteer-journey";
import { Marquee } from "@/components/sections/marquee";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { InstagramFeed } from "@/components/sections/instagram-feed";
import { FindOurCommunitySection } from "@/components/community/find-our-community-section";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Volunteers, partner NGOs, schools, colleges and mentors — meet the people who carry the Conscious Cinema Initiative forward.",
};

export default function CommunityPage() {
  return (
    <>
      <PageHero
        kicker="The community"
        titleLines={["Built through patient", "collaboration."]}
        goldLineIndex={1}
        intro="Volunteers, educators, filmmakers, NGOs, and partner institutions working nationally to expand meaningful access to cinema."
        image={LOCAL_IMAGES.heroScreening}
      />

      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="Become a volunteer"
            titleLines={["Four steps to join", "the movement."]}
            align="center"
          />
          <div className="content-after-heading">
            <VolunteerJourney />
          </div>
        </div>
      </section>

      <FindOurCommunitySection />

      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            kicker="Mentors & contributors"
            titleLines={["Founding team", "and advisors."]}
            goldLineIndex={1}
          />
          <StaggerGroup
            className="content-after-heading grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            stagger={0.08}
          >
            {LEADERSHIP.map((p) => (
              <StaggerItem key={p.name}>
                <figure className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                    <Image
                      src={img(p.image, 700)}
                      alt={p.name}
                      fill
                      sizes="(max-width: 1024px) 33vw, 20vw"
                      className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  </div>
                  <figcaption className="mt-3">
                    <p className="text-sm font-medium text-warm">{p.name}</p>
                    <p className="text-xs text-mist">{p.role}</p>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="border-y border-warm/10 bg-section-warm py-12 md:py-14">
        <div className="shell mb-10">
          <p className="kicker text-center">Institutions</p>
        </div>
        <Marquee items={[...PARTNERS]} />
      </section>

      <InstagramFeed />

      <CtaBand
        kicker="Join the movement"
        titleLines={["Bring a meaningful film", "conversation to your", "community."]}
        body="Volunteer for a screening, mentor a young filmmaker, or bring your organisation into the movement."
        image={LOCAL_IMAGES.classroomScreening}
        primary={{ label: "Join CCI", href: "/join" }}
        secondary={{ label: "Partner with us", href: "/join?interest=Partnership" }}
      />
    </>
  );
}
