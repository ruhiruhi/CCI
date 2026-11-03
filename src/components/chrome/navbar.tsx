"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SECONDARY_LINKS } from "@/lib/data";
import { Magnetic } from "@/components/motion/magnetic";
import { LeadCta } from "@/components/leads/lead-cta";
import { NavAccordion, NavDropdown } from "@/components/chrome/nav-dropdown";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar({ siteName = "Conscious Cinema Initiative" }: { siteName?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close menu on route change
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={cn(
          "fixed inset-x-0 top-0 z-[120] transition-all duration-500",
          scrolled
            ? "border-b border-warm/12 bg-charcoal/75 shadow-[var(--shadow-soft)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav className="shell flex h-[68px] items-center justify-between md:h-20" aria-label="Primary">
          <Link
            href="/"
            aria-label={`${siteName} — home`}
            className="group flex items-center gap-3"
          >
            <span className="navbar-logo ring-1 ring-gold/30 transition-all duration-500 group-hover:ring-gold/50 group-hover:scale-110">
              <Image
                src="/logo.jpeg"
                alt=""
                width={64}
                height={64}
                sizes="(max-width: 767px) 42px, (max-width: 1279px) 44px, 46px"
                className="object-cover"
                priority
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="max-w-[11rem] text-[0.95rem] font-semibold tracking-tight text-warm line-clamp-2">
                {siteName}
              </span>
            </span>
          </Link>

          {/* Desktop — flat links + Why Cinema dropdown */}
          <div className="hidden items-center gap-7 xl:flex">
            {NAV_LINKS.map((l) =>
              l.children && l.children.length > 0 ? (
                <NavDropdown key={l.href} item={l} />
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "link-underline text-sm transition-colors duration-300",
                    isActivePath(pathname, l.href)
                      ? "text-gold"
                      : "text-cloud hover:text-warm",
                  )}
                >
                  {l.label}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-3">
            <Magnetic className="hidden sm:inline-block">
              <LeadCta
                href="/join"
                label="Join the Movement"
                className="btn-cci-primary h-11 px-6 text-sm"
              />
            </Magnetic>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center rounded-full border border-warm/15 text-warm xl:hidden"
              data-cursor="hover"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[140] bg-ink/95 backdrop-blur-2xl grain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="shell flex h-[68px] items-center justify-between md:h-20">
              <span className="font-display text-lg text-warm">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-warm/15 text-warm"
                data-cursor="hover"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="shell mt-8 flex flex-col" aria-label="Mobile">
              {NAV_LINKS.map((l, i) =>
                l.children && l.children.length > 0 ? (
                  <NavAccordion key={l.href} item={l} index={i} />
                ) : (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 + i * 0.06,
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-warm/10"
                  >
                    <Link
                      href={l.href}
                      className={cn(
                        "block py-5 font-display text-4xl font-light tracking-tight transition-colors hover:text-gold sm:text-5xl",
                        isActivePath(pathname, l.href) ? "text-gold" : "text-warm",
                      )}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ),
              )}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {SECONDARY_LINKS.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.5 + i * 0.05,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={l.href}
                      className="text-sm uppercase tracking-[0.2em] text-mist transition-colors hover:text-warm"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <LeadCta
                href="/join"
                label="Join the Movement"
                className="btn-cci-primary mt-8 h-14 w-full text-base"
              />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
