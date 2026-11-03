import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  trend,
  className,
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-warm/8 bg-charcoal/50 p-5 transition-colors hover:border-gold/20",
        className,
      )}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gold/5 transition-transform group-hover:scale-110" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-mist">{label}</p>
          <p className="mt-2 font-display text-3xl font-light text-warm">
            {value}
          </p>
          {detail && (
            <p className="mt-1 text-xs text-ash">{detail}</p>
          )}
          {trend && (
            <p className="mt-2 text-xs text-emerald-400">{trend}</p>
          )}
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-gold/10 text-gold">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
