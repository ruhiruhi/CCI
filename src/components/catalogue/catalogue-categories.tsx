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
import type { CatalogueCategory } from "@/lib/catalogue";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "children-education": Baby,
  "truck-drivers-livelihoods": Briefcase,
  "police-justice-society": Scale,
  "healthcare-empathy": Stethoscope,
  "economy-development": TrendingUp,
  "gender-society": Users,
  "indian-parallel-cinema": Clapperboard,
  "international-documentary": Globe2,
};

type CatalogueCategoriesProps = {
  categories: CatalogueCategory[];
  onSelect?: (slug: string) => void;
  activeSlug?: string;
};

export function CatalogueCategories({
  categories,
  onSelect,
  activeSlug,
}: CatalogueCategoriesProps) {
  return (
    <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" stagger={0.06}>
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.slug] ?? HeartHandshake;
        const isActive = activeSlug === category.slug;

        return (
          <StaggerItem key={category.slug}>
            <button
              type="button"
              onClick={() => onSelect?.(category.slug)}
              data-cursor="hover"
              className={cn(
                "card-modern group flex h-full w-full flex-col rounded-[1.5rem] p-6 text-left transition duration-500 hover:border-gold/25 hover:shadow-[var(--shadow-medium)] md:p-7",
                isActive && "border-gold/35 bg-warm/8 shadow-[var(--shadow-soft)]",
              )}
            >
              <span className="mb-5 grid h-12 w-12 place-items-center rounded-full border border-gold/30 text-gold transition-transform duration-500 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-xl font-light leading-tight text-warm md:text-2xl">
                {category.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-cloud/80">
                {category.description}
              </p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
                {category.filmCount > 0
                  ? `${category.filmCount} films`
                  : "Curated titles coming soon"}
              </p>
            </button>
          </StaggerItem>
        );
      })}
    </StaggerGroup>
  );
}
