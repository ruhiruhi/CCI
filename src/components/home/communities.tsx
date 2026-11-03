import Image from "next/image";
import { COMMUNITIES, img } from "@/lib/data";
import { SectionHeading } from "@/components/sections/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";

export function Communities() {
  return (
    <section className="section-pad relative bg-section-warm">
      <div className="shell">
        <SectionHeading
          kicker="Scene 02 — How we create impact"
          titleLines={["From watching stories", "to creating change."]}
          intro="Each CCI programme is designed to inspire dialogue, assist the young creators, and enable communities to tell important stories. Every initiative is rooted in the belief that meaningful stories can strengthen communities and shape a more conscious society."
          align="center"
        />

        <StaggerGroup
          className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          stagger={0.1}
        >
          {COMMUNITIES.map((c, i) => (
            <StaggerItem key={c.title}>
              <article
                className="cine-frame card-modern group relative h-[280px] overflow-hidden p-0 md:h-[320px]"
                data-cursor="hover"
                style={{ marginTop: i % 2 === 1 ? "1.5rem" : 0 }}
              >
                <Image
                  src={img(c.image, 800)}
                  alt={c.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="cci-image object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl font-medium text-warm">{c.title}</h3>
                  <p className="mt-2 max-h-0 overflow-hidden text-sm text-cloud/80 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                    {c.copy}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
