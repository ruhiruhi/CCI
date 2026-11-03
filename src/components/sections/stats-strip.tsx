import { getPublishedStats } from "@/lib/cms";
import type { Stat } from "@/lib/data";
import { Counter } from "@/components/motion/counter";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

function StatsGrid({
  stats,
  className,
}: {
  stats: Stat[];
  className?: string;
}) {
  return (
    <StaggerGroup
      className={cn(
        "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3",
        className,
      )}
    >
      {stats.map((s) => (
        <StaggerItem key={s.label}>
          <div className="card-modern group h-full p-7 md:p-8">
            <div className="stat-value font-display text-4xl tracking-tight md:text-5xl">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <p className="mt-4 text-sm font-medium text-warm">{s.label}</p>
            <p className="mt-1 text-sm text-mist">{s.detail}</p>
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}

export async function StatsStrip({ className }: { className?: string }) {
  const stats = await getPublishedStats();
  return <StatsGrid stats={stats} className={className} />;
}
