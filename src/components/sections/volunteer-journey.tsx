import Image from "next/image";
import { img, VOLUNTEER_JOURNEY, VOLUNTEER_SPOTLIGHTS } from "@/lib/data";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";

export function VolunteerJourney() {
  return (
    <div className="section-layout">
      {/* Spotlights */}
      <StaggerGroup className="section-layout__content space-y-5" stagger={0.12}>
        {VOLUNTEER_SPOTLIGHTS.map((v) => (
          <StaggerItem key={v.name}>
            <figure className="group flex items-center gap-5 rounded-2xl border border-warm/10 bg-charcoal/40 p-5 transition-colors duration-500 hover:bg-charcoal">
              <span className="cine-frame relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={img(v.image, 240)}
                  alt={v.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </span>
              <figcaption>
                <p className="text-sm italic leading-snug text-cloud/85">
                  “{v.quote}”
                </p>
                <p className="mt-2 text-sm font-medium text-warm">
                  {v.name}
                  <span className="font-normal text-mist">
                    {" "}
                    — {v.role}, {v.location}
                  </span>
                </p>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Steps */}
      <div className="section-layout__content">
        <div className="relative space-y-8 before:absolute before:left-[27px] before:top-3 before:h-[calc(100%-3rem)] before:w-px before:bg-warm/10">
          {VOLUNTEER_JOURNEY.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.1}>
              <div className="relative flex gap-6">
                <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-gold/40 bg-ink font-display text-lg text-gold">
                  {step.step}
                </span>
                <div className="pt-1.5">
                  <h3 className="text-xl font-medium text-warm">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-md text-cloud/75">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
