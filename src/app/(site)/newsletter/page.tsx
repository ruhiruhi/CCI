import type { Metadata } from "next";
import Image from "next/image";
import { Film, Mail, Users } from "lucide-react";
import { LOCAL_IMAGES } from "@/lib/data";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { Subscribe } from "@/components/newsletter/subscribe";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Receive updates on screenings, workshops, reports, and ways to participate with the Conscious Cinema Initiative.",
};

const PERKS = [
  { icon: Film, title: "Screenings and workshops", body: "Updates on screenings, workshops, and community conversations near you." },
  { icon: Users, title: "Ways to participate", body: "Volunteer calls, partnership opportunities, and ways to support student filmmakers." },
  { icon: Mail, title: "Reports and learning", body: "Receive updates on reports, film-literacy resources, and foundation-stage impact." },
];

export default function NewsletterPage() {
  return (
    <>
      <PageHero
        kicker="Stay close to the work"
        titleLines={["Updates on screenings,", "workshops, and ways", "to participate."]}
        goldLineIndex={2}
        intro="Receive updates on screenings, workshops, reports, and ways to participate with the Conscious Cinema Initiative."
        image={LOCAL_IMAGES.classroomScreening}
      />

      <section className="section-pad">
        <div className="shell">
          <div className="relative overflow-hidden rounded-3xl border border-warm/10">
            <Image
              src={LOCAL_IMAGES.heroScreening}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-ink/85" />
            <div className="relative z-10 px-6 py-14 text-center md:py-16">
              <SectionHeading
                kicker="Join the movement"
                titleLines={["Stay close to", "the work."]}
                goldLineIndex={1}
                align="center"
                className="mb-8"
              />
              <Subscribe />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="shell">
          <StaggerGroup className="grid gap-5 md:grid-cols-3" stagger={0.1}>
            {PERKS.map((p) => (
              <StaggerItem key={p.title}>
                <div className="h-full rounded-2xl border border-warm/10 bg-charcoal/30 p-8 transition-colors duration-500 hover:bg-charcoal">
                  <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-medium text-warm">{p.title}</h3>
                  <p className="mt-2 text-cloud/75">{p.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="mt-10 text-center">
            <p className="mx-auto max-w-2xl font-display text-2xl font-light leading-snug text-warm md:text-3xl">
              “The screening did not end with the credits. It became a community
              discussion that stayed with us.”
            </p>
            <p className="mt-5 text-mist">— Meera Joseph, Community organizer</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
