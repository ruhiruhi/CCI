import Image from "next/image";
import { LOCAL_IMAGES, REALITY_POINTS, REALITY_STATS } from "@/lib/data";
import { Counter } from "@/components/motion/counter";
import { Reveal, StaggerGroup, StaggerItem, TextReveal } from "@/components/motion/reveal";

export function TheReality() {
  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed dim imagery */}
      <div className="absolute inset-0">
        <Image
          src={LOCAL_IMAGES.heroScreening}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />
      </div>

      {/* Brand watermark — fills the open space beside the headline */}
      <div
        className="pointer-events-none absolute -right-8 top-1/2 z-[1] hidden w-[min(46vw,28rem)] -translate-y-[42%] select-none md:block lg:-right-4 lg:w-[min(42vw,32rem)] xl:right-[4%] xl:w-[36rem]"
        aria-hidden
      >
        <div className="relative aspect-square overflow-hidden rounded-full opacity-[0.22] mix-blend-soft-light shadow-[0_0_80px_rgba(245,185,66,0.08)]">
          <Image
            src="/logo.jpeg"
            alt=""
            fill
            sizes="(min-width: 1280px) 36rem, 42vw"
            className="object-cover"
            priority={false}
          />
        </div>
      </div>

      <div className="shell relative z-10 section-pad">
        <Reveal>
          <p className="kicker mb-8">Scene 02 — The reality</p>
        </Reveal>
        <TextReveal
          lines={["Powerful films often", "reach festivals,", "but not the classrooms", "where conversations begin."]}
          className="max-w-4xl font-display text-[clamp(2rem,6vw,4.7rem)] font-light leading-[1.02] tracking-tight text-warm"
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <StaggerGroup className="space-y-5" stagger={0.12}>
            {REALITY_POINTS.map((p) => (
              <StaggerItem key={p}>
                <div className="flex items-start gap-4 border-l border-gold/40 pl-5">
                  <p className="text-lg leading-relaxed text-cloud/85">{p}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-warm/10 bg-warm/5">
            {REALITY_STATS.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 0.1}
                className="bg-ink/70 p-7 md:p-8"
              >
                <div className="font-display text-4xl font-light text-gold md:text-5xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <p className="mt-3 text-cloud/80">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
