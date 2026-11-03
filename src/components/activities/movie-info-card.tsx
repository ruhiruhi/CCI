import Image from "next/image";
import {
  Calendar,
  Clock,
  Clapperboard,
  MapPin,
  Target,
} from "lucide-react";
import { img } from "@/lib/data";
import type { ActivityLocation } from "@/lib/activities";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";

type MovieInfoCardProps = {
  activity: ActivityLocation;
};

/** Movie Screening Details — poster + key facts + synopsis. */
export function MovieInfoCard({ activity }: MovieInfoCardProps) {
  const { movie, location } = activity;
  const facts = [
    movie.screeningDate
      ? { label: "Screening Date", value: movie.screeningDate, icon: Calendar }
      : null,
    { label: "Location", value: location, icon: MapPin },
    movie.targetAudience
      ? {
          label: "Target Audience",
          value: movie.targetAudience,
          icon: Target,
        }
      : null,
    movie.duration
      ? { label: "Duration", value: movie.duration, icon: Clock }
      : null,
  ].filter(Boolean) as {
    label: string;
    value: string;
    icon: typeof MapPin;
  }[];

  return (
    <section className="section-pad">
      <div className="shell">
        <SectionHeading
          kicker="Movie Screening Details"
          titleLines={["The film we", "watched together."]}
          goldLineIndex={1}
        />

        <Reveal className="mt-12">
          <article className="card-modern overflow-hidden rounded-3xl border border-warm/10 bg-charcoal/40 shadow-[var(--shadow-soft)] backdrop-blur-sm">
            <div className="grid gap-0 lg:grid-cols-12">
              {movie.poster && (
                <div className="relative aspect-[3/4] overflow-hidden lg:col-span-4 lg:aspect-auto lg:min-h-[420px]">
                  <Image
                    src={img(movie.poster, 900)}
                    alt={`Poster for ${movie.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}

              <div
                className={
                  movie.poster
                    ? "flex flex-col justify-center p-8 md:p-10 lg:col-span-8 lg:p-12"
                    : "flex flex-col justify-center p-8 md:p-10 lg:col-span-12 lg:p-12"
                }
              >
                <span className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
                  <Clapperboard className="h-3.5 w-3.5" aria-hidden />
                  Movie
                </span>
                <h3 className="mt-4 font-display text-3xl font-light tracking-tight text-warm md:text-4xl lg:text-5xl">
                  {movie.name}
                </h3>

                <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                  {facts.map((fact) => {
                    const Icon = fact.icon;
                    return (
                      <div
                        key={fact.label}
                        className="rounded-xl border border-warm/10 bg-ink/30 px-4 py-3"
                      >
                        <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-mist">
                          <Icon className="h-3.5 w-3.5 text-gold" aria-hidden />
                          {fact.label}
                        </dt>
                        <dd className="mt-1.5 text-warm">{fact.value}</dd>
                      </div>
                    );
                  })}
                </dl>

                <p className="mt-8 max-w-2xl text-base leading-relaxed text-cloud/85 md:text-lg">
                  {movie.synopsis}
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
