import { LOCAL_IMAGES } from "@/lib/data";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal, TextReveal } from "@/components/motion/reveal";
import { SectionLayout } from "@/components/sections/section-layout";

const POINTS = [
  { word: "Awareness", body: "Curated documentary and social-impact films paired with facilitated conversations." },
  { word: "Education", body: "Learning experiences that help young people watch critically and create responsibly." },
  { word: "Dialogue", body: "We value thoughtful participation more than passive consumption." },
  { word: "Empowerment", body: "Mentoring, equipment access, and production support for emerging filmmakers." },
];

export function WhyCinema() {
  return (
    <section className="section-pad relative">
      <div className="shell">
        <SectionLayout
          media={
            <ParallaxImage
              src={LOCAL_IMAGES.classroomScreening}
              alt="Children watching a film, faces lit by the screen"
              className="section-layout-image aspect-[4/5] vignette"
              amount={40}
              sizes="(max-width: 1023px) 90vw, 42vw"
            />
          }
        >
          <Reveal>
            <p className="kicker mb-4">Scene 01 — Why conscious cinema</p>
          </Reveal>
          <TextReveal
            lines={["Stories help us understand one another."]}
            className="font-display text-[clamp(1.85rem,4.5vw,3.5rem)] font-light leading-[1.08] tracking-tight text-warm"
            lineClassName=""
          />
          <Reveal>
            <p className="mt-5 max-w-md text-base leading-relaxed text-cloud/85 md:mt-6 md:text-lg">
              We use cinema as a public learning practice: a way to encounter
              lived realities, examine difficult questions, and imagine more
              humane possibilities together.
            </p>
          </Reveal>
        </SectionLayout>

        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-warm/10 bg-warm/5 sm:mt-10 sm:grid-cols-2 lg:mt-12">
          {POINTS.map((p, i) => (
            <Reveal
              key={p.word}
              delay={i * 0.08}
              className="bg-ink/60 p-5 transition-colors duration-500 hover:bg-charcoal md:p-6"
            >
              <span className="font-display text-xl font-light text-gold md:text-2xl">
                {p.word}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-cloud/70">
                {p.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
