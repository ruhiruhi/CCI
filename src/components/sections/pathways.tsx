import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, HandHeart, Projector, Handshake, Sprout } from "lucide-react";
import { img, PATHWAYS, type Pathway } from "@/lib/data";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";

const ICONS: Record<Pathway["icon"], typeof HandHeart> = {
  volunteer: HandHeart,
  screening: Projector,
  partner: Handshake,
  support: Sprout,
};

export function Pathways() {
  return (
    <StaggerGroup className="grid gap-5 md:grid-cols-2" stagger={0.1}>
      {PATHWAYS.map((p) => {
        const Icon = ICONS[p.icon];
        return (
          <StaggerItem key={p.title}>
            <Link
              href={p.href}
              data-cursor="hover"
              className="group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-warm/15 p-6 shadow-[var(--shadow-soft)] transition duration-500 hover:border-gold/30 hover:shadow-[var(--shadow-medium)] md:min-h-[300px] md:p-8"
            >
              <Image
                src={img(p.image, 1100)}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="cci-image object-cover opacity-50 transition-all duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20 transition-opacity duration-500 group-hover:from-ink/95" />

              <div className="relative z-10">
                <span className="mb-5 grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-3xl font-light text-warm md:text-4xl">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-sm text-cloud/80">{p.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold">
                  {p.cta}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </StaggerItem>
        );
      })}
    </StaggerGroup>
  );
}
