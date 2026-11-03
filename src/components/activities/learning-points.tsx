import { CheckCircle2 } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";

type LearningPointsProps = {
  morals: string[];
};

/** Key Learning / Moral of the Movie — checklist-style cards. */
export function LearningPoints({ morals }: LearningPointsProps) {
  if (!morals?.length) return null;

  return (
    <section className="section-pad bg-section-warm">
      <div className="shell">
        <SectionHeading
          kicker="Key Learning / Moral of the Movie"
          titleLines={["What participants", "learned."]}
          goldLineIndex={1}
          intro="Takeaways from the post-screening conversation with children and the community."
        />

        <StaggerGroup
          className="mt-12 grid gap-3 sm:grid-cols-2"
          stagger={0.07}
        >
          {morals.map((point) => (
            <StaggerItem key={point}>
              <article className="card-modern group flex h-full items-start gap-4 rounded-2xl border border-warm/10 bg-charcoal/40 p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm transition-colors duration-500 hover:border-gold/25 hover:bg-charcoal/60 md:p-6">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/30 text-gold">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                </span>
                <p className="text-base leading-relaxed text-warm md:text-lg">
                  {point}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
