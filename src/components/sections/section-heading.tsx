import { Reveal, TextReveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  kicker?: string;
  titleLines: string[];
  intro?: string;
  align?: "left" | "center";
  className?: string;
  goldLineIndex?: number;
};

export function SectionHeading({
  kicker,
  titleLines,
  intro,
  align = "left",
  className,
  goldLineIndex,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {kicker && (
        <Reveal>
          <p className="kicker mb-4">{kicker}</p>
        </Reveal>
      )}
      <h2 className="font-display text-4xl font-light leading-[1.04] tracking-tight text-warm sm:text-5xl md:text-6xl">
        {titleLines.map((line, i) => (
          <TextReveal
            key={i}
            lines={[line]}
            delay={i * 0.08}
            lineClassName={
              goldLineIndex === i ? "text-gold-gradient" : undefined
            }
          />
        ))}
      </h2>
      {intro && (
        <Reveal delay={0.2}>
          <p
            className={cn(
              "mt-5 max-w-xl text-lg leading-relaxed text-cloud/85",
              align === "center" && "mx-auto",
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
