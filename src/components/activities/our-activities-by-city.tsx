"use client";

import { useMemo, useState } from "react";
import type { ActivityLocation } from "@/lib/activities";
import { ActivityCard } from "@/components/activities/activity-card";
import { CitySelect } from "@/components/activities/activities-by-city";
import { SectionHeading } from "@/components/sections/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";

const ALL_CITIES = "all";

function cityKey(location: ActivityLocation): string {
  return location.location || location.title;
}

export function OurActivitiesByCity({
  locations,
}: {
  locations: ActivityLocation[];
}) {
  const [city, setCity] = useState(ALL_CITIES);

  const cities = useMemo(
    () =>
      Array.from(new Set(locations.map(cityKey).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [locations],
  );

  const filtered = useMemo(
    () =>
      city === ALL_CITIES
        ? locations
        : locations.filter((location) => cityKey(location) === city),
    [city, locations],
  );

  return (
    <section className="section-pad">
      <div className="shell">
        <SectionHeading
          kicker="Locations"
          titleLines={["Where the work", "takes root."]}
          goldLineIndex={1}
          intro="Select a city to open its full activity report."
          align="center"
        />

        <div className="content-after-heading mx-auto max-w-sm">
          <CitySelect cities={cities} value={city} onChange={setCity} />
        </div>

        <StaggerGroup
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.1}
        >
          {filtered.map((location) => (
            <StaggerItem key={location.id}>
              <ActivityCard location={location} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-mist">
            No activity reports for this city yet.
          </p>
        )}
      </div>
    </section>
  );
}
