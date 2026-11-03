import { img, STORIES, type Story } from "@/lib/data";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { SectionLayout } from "@/components/sections/section-layout";

export function StoriesShowcase({ stories = STORIES }: { stories?: Story[] }) {
  return (
    <div className="space-y-10 md:space-y-14">
      {stories.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <SectionLayout
            key={s.name}
            flip={flip}
            media={
              <ParallaxImage
                src={img(s.image, 1000)}
                alt={s.name}
                className="section-layout-image aspect-[4/5]"
                amount={36}
                sizes="(max-width: 768px) 90vw, 42vw"
              />
            }
          >
            <Reveal>
              <span className="font-display text-6xl font-light leading-none text-gold/30">
                “
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <blockquote className="-mt-6 font-display text-2xl font-light leading-snug tracking-tight text-warm sm:text-3xl md:text-[2.2rem]">
                {s.quote}
              </blockquote>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-7 flex items-center gap-4">
                <span className="h-px w-10 bg-gold" />
                <div>
                  <p className="font-medium text-warm">{s.name}</p>
                  <p className="text-sm text-mist">
                    {s.role} · {s.location}
                  </p>
                </div>
              </div>
            </Reveal>
          </SectionLayout>
        );
      })}
    </div>
  );
}
