import { Projector, Users, Sprout } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";

const STEPS = [
  {
    icon: Projector,
    title: "Awareness through screenings",
    body: "Curated documentary and social-impact films paired with facilitated conversations.",
  },
  {
    icon: Users,
    title: "Education through film literacy",
    body: "Learning experiences that help young people watch critically and create responsibly.",
  },
  {
    icon: Sprout,
    title: "Empowerment through making",
    body: "Mentoring, equipment access, and production support for emerging filmmakers.",
  },
];

export function HowChange() {
  return (
    <section className="section-pad relative">
      <div className="shell">
        <SectionHeading
          kicker="Scene 03 — How CCI creates change"
          titleLines={["From watching together", "to making with purpose."]}
          goldLineIndex={1}
          align="center"
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-warm/10 bg-charcoal/40 p-7 transition-colors duration-500 hover:bg-charcoal">
                <span className="absolute right-6 top-6 font-display text-6xl font-light text-warm/5 transition-colors duration-500 group-hover:text-gold/10">
                  0{i + 1}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 text-gold transition-transform duration-500 group-hover:scale-110">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-xl font-medium text-warm md:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-3 leading-relaxed text-cloud/75">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
