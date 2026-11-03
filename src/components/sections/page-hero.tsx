import Image from "next/image";
import { img } from "@/lib/data";
import { Reveal, TextReveal } from "@/components/motion/reveal";

type PageHeroProps = {
  kicker: string;
  titleLines: string[];
  intro?: string;
  image: string;
  goldLineIndex?: number;
};

export function PageHero({
  kicker,
  titleLines,
  intro,
  image,
  goldLineIndex,
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[42svh] items-end overflow-hidden grain md:min-h-[48svh]">
      <Image
        src={img(image, 2000, 80)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="animate-ambient object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/45 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_10%,transparent_40%,var(--color-ink)_100%)]" />

      <div className="shell relative z-10 pb-10 pt-24 md:pb-12 md:pt-28">
        <Reveal>
          <p className="kicker mb-4">{kicker}</p>
        </Reveal>
        <h1 className="max-w-5xl font-display text-[clamp(2.2rem,6.5vw,5.25rem)] font-light leading-[0.98] tracking-tight text-warm">
          {titleLines.map((line, i) => (
            <TextReveal
              key={i}
              lines={[line]}
              delay={0.1 + i * 0.1}
              lineClassName={goldLineIndex === i ? "text-gold-gradient italic" : undefined}
            />
          ))}
        </h1>
        {intro && (
          <Reveal delay={0.4}>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-cloud/85 md:mt-5">
              {intro}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
