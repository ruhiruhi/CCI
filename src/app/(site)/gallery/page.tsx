import type { Metadata } from "next";
import { LOCAL_IMAGES } from "@/lib/data";
import { PageHero } from "@/components/sections/page-hero";
import { GalleryClient } from "@/components/gallery/gallery-client";
import { CtaBand } from "@/components/sections/cta-band";
import { getPublishedGallery } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "An immersive visual journey through CCI screenings, workshops, productions, and community dialogue.",
};

export default async function GalleryPage() {
  const items = await getPublishedGallery();

  return (
    <>
      <PageHero
        kicker="The gallery"
        titleLines={["Screenings, classrooms,", "and production", "in the field."]}
        goldLineIndex={1}
        intro="A visual archive of community screenings, classroom gatherings, student filmmakers, and editing sessions across the initiative."
        image={LOCAL_IMAGES.heroScreening}
      />

      <section className="section-pad">
        <div className="shell">
          <GalleryClient items={items} />
        </div>
      </section>

      <CtaBand
        kicker="Join the movement"
        titleLines={["Bring a meaningful film", "conversation to your", "community."]}
        body="Host a screening, volunteer your skills, or invite us to your community — and become part of the story."
        image={LOCAL_IMAGES.classroomScreening}
      />
    </>
  );
}
