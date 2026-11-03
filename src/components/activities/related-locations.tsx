import { ActivityCard } from "@/components/activities/activity-card";
import type { ActivityLocation } from "@/lib/activities";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";

type RelatedLocationsProps = {
  locations: ActivityLocation[];
};

/** Next activity locations as full cards. */
export function RelatedLocations({ locations }: RelatedLocationsProps) {
  if (!locations.length) return null;

  return (
    <section className="section-pad border-t border-warm/10 bg-section-warm">
      <div className="shell">
        <SectionHeading
          kicker="Next activity"
          titleLines={["Other activity", "locations."]}
          goldLineIndex={1}
          intro="Continue exploring screenings across communities."
        />

        <StaggerGroup
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.1}
        >
          {locations.map((location) => (
            <StaggerItem key={location.id}>
              <ActivityCard location={location} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal className="sr-only">Related activity locations</Reveal>
      </div>
    </section>
  );
}
