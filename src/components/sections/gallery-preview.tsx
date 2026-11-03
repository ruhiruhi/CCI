import Image from "next/image";
import Link from "next/link";
import { GALLERY, img, type GalleryItem } from "@/lib/data";
import {
  formatGalleryEventDate,
  sortGalleryByEventDate,
} from "@/lib/gallery-sort";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function GalleryPreview({ items }: { items?: GalleryItem[] }) {
  const preview = sortGalleryByEventDate(items ?? GALLERY).slice(0, 12);
  return (
    <StaggerGroup
      className="grid auto-rows-[200px] grid-cols-2 gap-4 md:auto-rows-[240px] md:grid-cols-4"
      stagger={0.08}
    >
      {preview.map((g, i) => (
        <StaggerItem
          key={g.id}
          className={cn(
            "min-h-0",
            i === 0 && "md:row-span-2",
            i === 3 && "md:col-span-2",
            i === 6 && "md:col-span-2",
          )}
        >
          <Link
            href="/gallery"
            data-cursor="hover"
            className="cine-frame card-modern group relative block h-full w-full overflow-hidden rounded-2xl p-0"
          >
            <Image
              src={img(g.src, 900)}
              alt={g.caption}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="cci-image object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
            <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-xs uppercase tracking-[0.2em] text-gold">
                  {g.category}
                </span>
                {formatGalleryEventDate(g.eventDate) && (
                  <time
                    dateTime={g.eventDate}
                    className="text-xs uppercase tracking-[0.18em] text-mist"
                  >
                    {formatGalleryEventDate(g.eventDate)}
                  </time>
                )}
              </div>
              <p className="mt-1 text-sm text-warm">{g.caption}</p>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
