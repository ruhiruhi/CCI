import type { Metadata } from "next";
import { Heart, Handshake, Megaphone } from "lucide-react";
import { LOCAL_IMAGES } from "@/lib/data";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { StatsStrip } from "@/components/sections/stats-strip";
import { StoriesShowcase } from "@/components/sections/stories-showcase";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import {
  SupportNeedsSection,
  type PublicSupportItem,
} from "@/components/support/support-needs-section";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Support screenings, film education, equipment access, and student filmmakers through transparent giving. Sponsor items the initiative needs.",
};

const OTHER_WAYS = [
  {
    icon: Heart,
    title: "Fund a screening",
    body: "Help cover licensing, projection, facilitation, access, and local coordination.",
  },
  {
    icon: Handshake,
    title: "Empower an Emerging Filmmaker",
    body: "Contribute to mentoring, travel, editing, production, and exhibition support.",
  },
  {
    icon: Megaphone,
    title: "Create Future Changemakers",
    body: "Join CCI as a mentor, trainer, industry expert, or volunteer, and help young minds discover the power of storytelling and conscious cinema.",
  },
];

export default async function SupportPage() {
  let supportItems: PublicSupportItem[] = [];
  try {
    const rows = await prisma.supportItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    supportItems = rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      description: r.description,
      quantityNeeded: r.quantityNeeded,
      quantityReceived: r.quantityReceived,
      unit: r.unit,
      image: r.image,
      priority: r.priority,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch {
    /* DB not ready — show empty needs section */
  }

  return (
    <>
      <PageHero
        kicker="Support CCI"
        titleLines={["Help meaningful cinema", "reach the people", "it can move."]}
        goldLineIndex={2}
        intro="Support screenings, film education, equipment access, and mentoring through calm, transparent, purpose-linked giving — or sponsor a specific need below."
        image={LOCAL_IMAGES.heroScreening}
      />

      <SupportNeedsSection initialItems={supportItems} />

      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="Why it matters"
            titleLines={["This is what", "you make possible."]}
          />
          <div className="mt-8">
            <StoriesShowcase />
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            kicker="The impact so far"
            titleLines={["Every rupee", "becomes a moment."]}
            align="center"
            className="mb-10"
          />
          <StatsStrip />
        </div>
      </section>

      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="Beyond giving"
            titleLines={["Money is one", "way. There are", "many others."]}
          />
          <StaggerGroup className="content-after-heading grid gap-5 md:grid-cols-3" stagger={0.1}>
            {OTHER_WAYS.map((w) => (
              <StaggerItem key={w.title}>
                <div className="h-full rounded-2xl border border-warm/10 bg-charcoal/30 p-8 transition-colors duration-500 hover:bg-charcoal">
                  <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold">
                    <w.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-medium text-warm">{w.title}</h3>
                  <p className="mt-2 text-cloud/75">{w.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="content-after-heading rounded-3xl border border-warm/10 bg-charcoal/40 p-10 text-center md:p-14">
            <p className="kicker mb-4">Open books</p>
            <p className="font-display text-2xl font-light leading-snug text-warm md:text-3xl">
              CCI publishes clear summaries of funding, program activity, governance,
              and learning as the movement grows. Every contribution is documented
              with role-based oversight and transparent reporting.
            </p>
            <a
              href="/transparency"
              className="btn-cci-primary mt-8 inline-flex h-12 items-center px-7 text-sm"
              data-cursor="hover"
            >
              Transparency Report
            </a>
          </Reveal>
        </div>
      </section>

      <CtaBand
        kicker="Support CCI"
        titleLines={["Help the work", "reach further."]}
        body="Fund a screening, support a filmmaker, or join the movement — tell us how you’d like to help."
        image={LOCAL_IMAGES.editingSession}
        primary={{ label: "Join the Movement", href: "/join" }}
        secondary={{ label: "Start a conversation", href: "/contact?interest=Support" }}
      />
    </>
  );
}
