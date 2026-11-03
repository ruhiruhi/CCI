"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/data";
import { EventsCarousel } from "@/components/sections/events-carousel";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const ALL_CITIES = "all";

function uniqueCities(events: EventItem[]): string[] {
  return Array.from(new Set(events.map((e) => e.city).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function ActivitiesByCity({ events }: { events: EventItem[] }) {
  const [city, setCity] = useState(ALL_CITIES);
  const cities = useMemo(() => uniqueCities(events), [events]);

  const filtered = useMemo(
    () => (city === ALL_CITIES ? events : events.filter((e) => e.city === city)),
    [city, events],
  );

  return (
    <>
      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            kicker="Featured"
            titleLines={["What's coming up", "next."]}
          />
          <div className="content-after-heading mx-auto max-w-sm">
            <CitySelect cities={cities} value={city} onChange={setCity} />
          </div>
        </div>
        <div className="mt-8">
          {filtered.length > 0 ? (
            <EventsCarousel events={filtered} />
          ) : (
            <p className="shell text-center text-sm text-mist">
              No events in this city yet.
            </p>
          )}
        </div>
      </section>

      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="The full schedule"
            titleLines={["Mark your", "calendar."]}
            goldLineIndex={1}
          />
          <StaggerGroup
            className="content-after-heading divide-y divide-warm/10 border-y border-warm/10"
            stagger={0.08}
          >
            {filtered.map((e) => (
              <StaggerItem key={`${e.title}-${e.date}`}>
                <div className="group grid items-center gap-4 py-7 md:grid-cols-12 md:gap-6">
                  <div className="md:col-span-2">
                    <span className="flex items-center gap-2 text-sm text-gold">
                      <Calendar className="h-4 w-4" />
                      {e.date}
                    </span>
                  </div>
                  <div className="md:col-span-5">
                    <h3 className="text-xl font-medium text-warm transition-colors group-hover:text-gold">
                      {e.title}
                    </h3>
                    <p className="mt-1 text-sm text-cloud/70">{e.blurb}</p>
                  </div>
                  <div className="md:col-span-3">
                    <span className="flex items-center gap-2 text-sm text-mist">
                      <MapPin className="h-4 w-4 text-gold" />
                      {e.city}
                    </span>
                  </div>
                  <div className="md:col-span-2 md:text-right">
                    <span className="inline-block rounded-full border border-warm/15 px-4 py-1.5 text-xs text-cloud">
                      {e.type}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          {filtered.length === 0 && (
            <p className="mt-8 text-center text-sm text-mist">
              No scheduled activities for this city.
            </p>
          )}

          <Reveal className="mt-8">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-sm font-medium text-warm link-underline"
            >
              Don&apos;t see your city? Invite us
              <ArrowUpRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export function CitySelect({
  cities,
  value,
  onChange,
  label = "PAN India — City",
}: {
  cities: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-mist">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-12 w-full rounded-full border border-warm/15 bg-warm/5 px-4 text-sm text-warm",
          "focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30",
        )}
      >
        <option value={ALL_CITIES} className="bg-ink text-warm">
          All cities
        </option>
        {cities.map((city) => (
          <option key={city} value={city} className="bg-ink text-warm">
            {city}
          </option>
        ))}
      </select>
    </label>
  );
}
