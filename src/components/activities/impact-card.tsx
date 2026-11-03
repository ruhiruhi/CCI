import {
  Users,
  Clapperboard,
  MapPin,
  MessageSquare,
  Heart,
} from "lucide-react";
import type { ActivityLocation } from "@/lib/activities";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";

type ImpactCardProps = {
  activity: ActivityLocation;
};

/** Community Impact summary card driven by movie.impact. */
export function ImpactCard({ activity }: ImpactCardProps) {
  const impact = activity.movie.impact;
  if (!impact) return null;

  const items = [
    {
      label: "Participants",
      value: String(impact.participants),
      icon: Users,
    },
    {
      label: "Movie Screened",
      value: activity.movie.name,
      icon: Clapperboard,
    },
    {
      label: "Location",
      value: activity.location,
      icon: MapPin,
    },
    {
      label: "Discussion Conducted",
      value: impact.discussionHeld ? "Yes" : "No",
      icon: MessageSquare,
    },
    {
      label: "Overall Response",
      value: impact.response,
      icon: Heart,
    },
  ];

  return (
    <section className="section-pad bg-section-warm">
      <div className="shell">
        <SectionHeading
          kicker="Community Impact"
          titleLines={["The day,", "in numbers."]}
          goldLineIndex={1}
        />

        <StaggerGroup
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.label}>
                <article className="card-modern group h-full rounded-2xl border border-warm/10 bg-charcoal/40 p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[var(--shadow-medium)] md:p-7">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-warm/15 text-gold transition-transform duration-500 group-hover:scale-110">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="mt-5 text-xs uppercase tracking-[0.2em] text-mist">
                    {item.label}
                  </p>
                  <p className="mt-2 font-display text-2xl font-light tracking-tight text-warm md:text-3xl">
                    {item.value}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
