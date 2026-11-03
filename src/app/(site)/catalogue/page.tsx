import type { Metadata } from "next";
import { getPublishedCatalogue } from "@/lib/cms";
import { LOCAL_IMAGES } from "@/lib/data";
import { CatalogueHero } from "@/components/catalogue/catalogue-hero";
import { CatalogueStats } from "@/components/catalogue/catalogue-stats";
import { CatalogueExplorer } from "@/components/catalogue/catalogue-explorer";
import { CatalogueTracks } from "@/components/catalogue/catalogue-tracks";
import { CatalogueTimeline } from "@/components/catalogue/catalogue-timeline";
import { SectionHeading } from "@/components/sections/section-heading";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Documentary Catalogue",
  description:
    "Explore CCI's documentary and parallel cinema catalogue for education, empathy, critical thinking, and social transformation.",
};

export default async function CataloguePage() {
  const catalogue = await getPublishedCatalogue();

  return (
    <>
      <CatalogueHero hero={catalogue.hero} />

      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="Catalogue at a glance"
            titleLines={["Films, themes, and", "weekly programming."]}
            goldLineIndex={1}
            intro="A curated library designed for classrooms, campuses, police training, hospitals, and community institutions."
          />
          <div className="content-after-heading">
            <CatalogueStats stats={catalogue.stats} />
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="shell space-y-12">
          <SectionHeading
            kicker="Browse by theme"
            titleLines={["Find films by", "social purpose."]}
            goldLineIndex={1}
            intro="Select a theme to filter the catalogue, or explore the full collection below."
          />

          <CatalogueExplorer
            films={catalogue.films}
            categories={catalogue.categories}
            tracks={catalogue.tracks}
          />
        </div>
      </section>

      <section id="tracks" className="section-pad bg-section-warm scroll-mt-28">
        <div className="shell">
          <SectionHeading
            kicker="Suggested screening tracks"
            titleLines={["Curated pathways", "for dialogue."]}
            goldLineIndex={1}
            intro="Ten programming tracks to guide weekly screenings and post-film discussions across institutions."
          />
          <div className="content-after-heading">
            <CatalogueTracks tracks={catalogue.tracks} />
          </div>
        </div>
      </section>

      <section id="timeline" className="section-pad scroll-mt-28">
        <div className="shell">
          <SectionHeading
            kicker="Weekly screening timeline"
            titleLines={["Approximately two years", "of programming."]}
            goldLineIndex={1}
            intro="This catalogue structure can support around 104 weekly screenings and discussions under the Conscious Cinema Initiative."
          />
          <CatalogueTimeline phases={catalogue.timeline} />
        </div>
      </section>

      <CtaBand
        kicker="Bring conscious cinema"
        titleLines={["Bring Conscious Cinema", "to Your Institution"]}
        body="Host a screening, request a curated programme, or partner with us to expand meaningful film conversations across your community."
        image={LOCAL_IMAGES.classroomScreening}
        primary={{ label: "Request Screening", href: "/contact?interest=Screening%20Request" }}
        secondary={{ label: "Become a Partner", href: "/contact?interest=Partnership" }}
      />
    </>
  );
}
