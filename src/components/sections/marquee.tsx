import { cn } from "@/lib/utils";

/** Seamless horizontal marquee. Pass items; they render twice for the loop. */
export function Marquee({
  items,
  className,
  itemClassName,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div className="flex min-w-full shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span
            key={i}
            className={cn(
              "mx-10 whitespace-nowrap text-lg text-mist transition-colors hover:text-warm",
              itemClassName,
            )}
          >
            {item}
            <span className="ml-10 text-gold/50">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
