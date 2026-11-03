import type { Metadata } from "next";
import { LOCAL_IMAGES } from "@/lib/data";
import { getPublishedEvents } from "@/lib/cms";
import { PageHero } from "@/components/sections/page-hero";
import { ActivitiesByCity } from "@/components/activities/activities-by-city";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Activities & Events",
  description:
    "Find upcoming CCI screenings, workshops, community dialogues, and past activity highlights.",
};

export default async function ActivitiesPage() {
  const events = await getPublishedEvents();

  return (
    <>
      <PageHero
        kicker="Activities and events"
        titleLines={["Gather around a story.", "Leave with a new question."]}
        goldLineIndex={1}
        intro="Join screenings, workshops, and community conversations designed for active participation."
        image={LOCAL_IMAGES.classroomScreening}
      />

      <ActivitiesByCity events={events} />

      <CtaBand
        kicker="Join the movement"
        titleLines={["Bring a meaningful film", "conversation to your", "community."]}
        body="Host a screening, volunteer your skills, support a student filmmaker, or partner with us to expand access."
        image={LOCAL_IMAGES.heroScreening}
        primary={{ label: "Request a screening", href: "/contact" }}
        secondary={{ label: "Join the movement", href: "/community" }}
      />
    </>
  );
}
