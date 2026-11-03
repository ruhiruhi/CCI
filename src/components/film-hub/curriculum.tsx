"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { CURRICULUM, img, IMAGES } from "@/lib/data";

const MODULE_IMAGES = [
  IMAGES.womanCinema,
  IMAGES.reading,
  IMAGES.cameraRig,
  IMAGES.editing,
  IMAGES.audienceDark,
];

export function Curriculum() {
  const [open, setOpen] = useState(0);

  return (
    <div className="section-layout">
      <div className="section-layout__content divide-y divide-warm/10 border-y border-warm/10">
        {CURRICULUM.map((m, i) => {
          const active = open === i;
          return (
            <div key={m.title}>
              <button
                onClick={() => setOpen(active ? -1 : i)}
                data-cursor="hover"
                className="flex w-full items-center gap-6 py-6 text-left"
                aria-expanded={active}
              >
                <span className="font-display text-sm text-gold">
                  {m.module.replace("Module ", "")}
                </span>
                <span className="flex-1 font-display text-2xl font-light text-warm transition-colors md:text-3xl">
                  {m.title}
                </span>
                <motion.span
                  animate={{ rotate: active ? 45 : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-warm/20 text-warm"
                >
                  <Plus className="h-4 w-4" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {active && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-lg pb-7 pl-12 text-cloud/80">{m.body}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="section-layout__media relative hidden lg:flex">
        <div className="section-layout-image relative aspect-[4/5] overflow-hidden rounded-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={img(MODULE_IMAGES[open === -1 ? 0 : open], 900)}
                alt=""
                fill
                sizes="40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
