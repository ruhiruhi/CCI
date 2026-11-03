import type { CatalogueStat } from "@/lib/catalogue";
import { Counter } from "@/components/motion/counter";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function CatalogueStats({ stats }: { stats: CatalogueStat[] }) {
  return (
    <StaggerGroup className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <StaggerItem key={stat.label}>
          <div
            className={cn(
              "card-modern group h-full rounded-[1.25rem] p-6 transition duration-300 hover:border-gold/20 md:p-8",
            )}
          >
            <div className="stat-value font-display text-4xl tracking-tight md:text-5xl">
              <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </div>
            <p className="mt-4 text-sm font-medium text-warm">{stat.label}</p>
            <p className="mt-1 text-sm text-mist">{stat.detail}</p>
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
