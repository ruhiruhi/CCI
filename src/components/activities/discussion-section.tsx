import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";

type DiscussionSectionProps = {
  discussion?: string;
};

/** Optional post-screening discussion narrative. */
export function DiscussionSection({ discussion }: DiscussionSectionProps) {
  if (!discussion) return null;

  return (
    <section className="section-pad">
      <div className="shell">
        <SectionHeading
          kicker="Discussion After Screening"
          titleLines={["What happened", "after the credits."]}
          goldLineIndex={1}
        />

        <Reveal className="mt-12">
          <article className="card-modern relative overflow-hidden rounded-3xl border border-warm/10 bg-charcoal/40 p-8 shadow-[var(--shadow-soft)] backdrop-blur-sm md:p-12">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-warm/15 text-gold">
              <MessageCircle className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-cloud/90 md:text-xl md:leading-relaxed">
              {discussion}
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
