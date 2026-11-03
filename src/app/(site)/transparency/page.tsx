import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { LOCAL_IMAGES, TRANSPARENCY_REPORTS } from "@/lib/data";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Transparency Report",
  description:
    "CCI transparency reports, governance summaries, and published accountability documents.",
};

export default function TransparencyPage() {
  return (
    <>
      <PageHero
        kicker="Accountability"
        titleLines={["Transparency", "Report."]}
        goldLineIndex={0}
        intro="We publish clear reports so partners, supporters, and communities can follow how CCI grows and how resources are used."
        image={LOCAL_IMAGES.editingSession}
      />

      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            kicker="Published reports"
            titleLines={["Open books.", "Open practice."]}
            intro="Foundation-phase reports and upcoming publications."
            align="center"
          />

          <StaggerGroup
            className="content-after-heading grid gap-5 md:grid-cols-3"
            stagger={0.08}
          >
            {TRANSPARENCY_REPORTS.map((report) => (
              <StaggerItem key={report.title}>
                <article className="card-modern h-full p-6 md:p-7">
                  <FileText className="h-6 w-6 text-gold" aria-hidden />
                  <p className="mt-5 text-xs uppercase tracking-[0.2em] text-mist">
                    {report.type} · {report.year}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-light text-warm">
                    {report.title}
                  </h3>
                  <p className="mt-3 text-sm text-cloud">{report.status}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal delay={0.2} className="mt-12 flex justify-center">
            <Link
              href="/support"
              className="group inline-flex items-center gap-2 text-sm font-medium text-warm link-underline"
            >
              Support the mission
              <ArrowUpRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand
        kicker="Stay with the work"
        titleLines={["Transparency builds", "trust for every", "screening ahead."]}
        primary={{ label: "Join CCI", href: "/join" }}
        secondary={{ label: "Contact us", href: "/contact" }}
        image={LOCAL_IMAGES.heroScreening}
      />
    </>
  );
}
