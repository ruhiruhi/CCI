import type { Metadata } from "next";
import { LOCAL_IMAGES } from "@/lib/data";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { OurActivitiesByCity } from "@/components/activities/our-activities-by-city";
import { getPublishedActivityLocations } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Activities & Events",
  description:
    "Explore CCI activity galleries by location — community screenings, workshops, and field moments across India.",
  openGraph: {
    title: "Activities & Events",
    description:
      "Explore CCI activity galleries by location — community screenings, workshops, and field moments across India.",
  },
};

export default async function OurActivitiesPage() {
  const locations = await getPublishedActivityLocations();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://consciouscine.org/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Activities & Events",
        item: "https://consciouscine.org/our-activities",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <PageHero
        kicker="Activities & Events"
        titleLines={["Stories from the", "field, city by city."]}
        goldLineIndex={1}
        intro="Browse activity reports from communities where CCI brings cinema, dialogue, and shared moments."
        image={LOCAL_IMAGES.classroomScreening}
      />

      <OurActivitiesByCity locations={locations} />

      <CtaBand
        kicker="Join the movement"
        titleLines={["Bring a meaningful film", "conversation to your", "community."]}
        body="Host a screening, volunteer your skills, or invite us — and become part of the next gallery."
        image={LOCAL_IMAGES.heroScreening}
        primary={{ label: "Request a screening", href: "/contact" }}
        secondary={{ label: "See the full gallery", href: "/gallery" }}
      />
    </>
  );
}
