"use client";

import {
  Baby,
  Briefcase,
  Clapperboard,
  Globe2,
  HeartHandshake,
  Landmark,
  Scale,
  Stethoscope,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ScreeningTrack } from "@/lib/catalogue";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";

const TRACK_ICONS: Record<ScreeningTrack["icon"], LucideIcon> = {
  children: Baby,
  empathy: HeartHandshake,
  police: Scale,
  health: Stethoscope,
  labour: Briefcase,
  democracy: Landmark,
  economy: TrendingUp,
  gender: Users,
  parallel: Clapperboard,
  international: Globe2,
};

export function CatalogueTracks({ tracks }: { tracks: ScreeningTrack[] }) {
  return (
    <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" stagger={0.05}>
      {tracks.map((track, index) => {
        const Icon = TRACK_ICONS[track.icon];
        return (
          <StaggerItem key={track.slug}>
            <article className="card-modern group h-full rounded-[1.35rem] p-5 transition duration-500 hover:border-gold/25 hover:shadow-[var(--shadow-soft)] md:p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 text-gold transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-soft">
                    Track {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-light leading-tight text-warm">
                    {track.title}
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-cloud/80">{track.description}</p>
            </article>
          </StaggerItem>
        );
      })}
    </StaggerGroup>
  );
}
