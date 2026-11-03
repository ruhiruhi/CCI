import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { CONTACT_EMAILS, LOCAL_IMAGES } from "@/lib/data";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { SectionLayout } from "@/components/sections/section-layout";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact CCI about screenings, schools, colleges, partnerships, volunteering, media, or support.",
};

const DETAILS = [
  { icon: Mail, label: "Screenings and education", value: CONTACT_EMAILS.programs },
  { icon: Mail, label: "Partnerships and CSR", value: CONTACT_EMAILS.partners },
  { icon: Mail, label: "Volunteers and chapters", value: CONTACT_EMAILS.community },
  { icon: Mail, label: "General inquiries", value: CONTACT_EMAILS.general },
  { icon: Mail, label: "Media", value: CONTACT_EMAILS.media },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string | string[] }>;
}) {
  const params = await searchParams;
  const interest =
    typeof params.interest === "string"
      ? params.interest
      : Array.isArray(params.interest)
        ? params.interest[0]
        : undefined;

  return (
    <>
      <PageHero
        kicker="Contact Us"
        titleLines={["Begin with a", "conversation."]}
        goldLineIndex={1}
        intro="Tell us what you are hoping to build, host, support, or learn. We will connect you with the right part of the initiative."
        image={LOCAL_IMAGES.classroomScreening}
      />

      <section className="section-pad">
        <div className="shell">
          <SectionLayout
            media={<ContactForm initialInterest={interest} mode="contact" />}
            mediaClassName="!justify-start lg:!justify-end"
          >
            <Reveal>
              <h2 className="font-display text-3xl font-light text-warm md:text-4xl">
                Let&apos;s build something meaningful together.
              </h2>
              <p className="mt-5 max-w-md text-cloud/80">
                CCI is a distributed initiative in its foundation phase. Programs are
                coordinated through partner institutions and local collaborators across
                India. We aim to acknowledge genuine inquiries within three working days.
              </p>
            </Reveal>

            <div className="mt-8 space-y-6">
              {DETAILS.map((d, i) => (
                <Reveal key={d.label} delay={i * 0.08}>
                  <div className="flex items-start gap-4 text-left">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 text-gold">
                      <d.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm text-mist">{d.label}</p>
                      <a
                        href={`mailto:${d.value}`}
                        className="text-warm link-underline"
                      >
                        {d.value}
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </SectionLayout>
        </div>
      </section>
    </>
  );
}
