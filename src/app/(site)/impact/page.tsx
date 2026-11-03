import type { Metadata } from "next";
import { LOCAL_IMAGES, GOVERNANCE } from "@/lib/data";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { StatsStrip } from "@/components/sections/stats-strip";
import { Testimonials } from "@/components/sections/testimonials";
import {
  GrowthChart,
  BreakdownBars,
  RegionBars,
} from "@/components/impact/charts";
import { CtaBand } from "@/components/sections/cta-band";
import { FindOurCommunitySection } from "@/components/community/find-our-community-section";

export const metadata: Metadata = {
  title: "Impact Dashboard",
  description:
    "Review CCI impact metrics, participation data, and the measurable reach of screenings, education, and filmmaker support.",
};

export default function ImpactPage() {
  return (
    <>
      <PageHero
        kicker="Impact dashboard"
        titleLines={["Measured in participation,", "learning, and new voices."]}
        goldLineIndex={1}
        intro="Foundation-stage impact across screenings, institutions, and young filmmakers participating in the work."
        image={LOCAL_IMAGES.editingSession}
      />

      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            kicker="At a glance"
            titleLines={["The story so far,", "by the numbers."]}
          />
          <StatsStrip className="content-after-heading" />
        </div>
      </section>

      <section className="section-pad bg-section-warm pt-0">
        <div className="shell">
          <SectionHeading
            kicker="Growth over time"
            titleLines={["Trust grows when", "the work remains visible."]}
            goldLineIndex={1}
            intro={GOVERNANCE.join(" ")}
          />
          <div className="content-after-heading grid gap-5 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <GrowthChart />
            </div>
            <BreakdownBars />
            <RegionBars />
          </div>
        </div>
      </section>

      {/* Community map (same as Community page) */}
      <FindOurCommunitySection />

      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="In their words"
            titleLines={["Reflections from educators,", "students, and partners."]}
            align="center"
            className="mb-10"
          />
          <Testimonials />
        </div>
      </section>

      <CtaBand
        kicker="Join the movement"
        titleLines={["Help meaningful cinema", "reach the people", "it can move."]}
        body="Volunteer, host a screening, or fund a project — and help expand meaningful access to cinema."
        image={LOCAL_IMAGES.heroScreening}
        primary={{ label: "Join the Movement", href: "/join" }}
        secondary={{ label: "Transparency Report", href: "/transparency" }}
      />
    </>
  );
}
