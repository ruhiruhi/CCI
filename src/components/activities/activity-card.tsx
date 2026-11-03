import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { img } from "@/lib/data";
import { getGallery, type ActivityLocation } from "@/lib/activities";

type ActivityCardProps = {
  location: ActivityLocation;
};

/** Location thumbnail card linking to `/our-activities/[slug]`. */
export function ActivityCard({ location }: ActivityCardProps) {
  const count = getGallery(location).length;

  return (
    <Link
      href={`/our-activities/${location.slug}`}
      data-cursor="hover"
      className="cine-frame group relative block overflow-hidden rounded-2xl"
      aria-label={`View activity report for ${location.title}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/4]">
        <Image
          src={img(location.thumbnail, 900)}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <h3 className="font-display text-3xl font-light tracking-tight text-warm transition-colors duration-300 group-hover:text-gold sm:text-4xl">
          {location.title}
        </h3>
        {location.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-cloud/75 opacity-0 transition-all duration-500 group-hover:opacity-100">
            {location.description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-warm link-underline">
            View Report
            <ArrowUpRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          {count > 0 && (
            <span className="text-xs uppercase tracking-[0.18em] text-mist">
              {count} {count === 1 ? "image" : "images"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
