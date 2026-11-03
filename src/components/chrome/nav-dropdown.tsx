"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ChevronDown } from "lucide-react";
import type { NavLinkItem } from "@/lib/data";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupIsActive(pathname: string, item: NavLinkItem) {
  if (isActivePath(pathname, item.href)) return true;
  return Boolean(item.children?.some((c) => isActivePath(pathname, c.href)));
}

/**
 * Desktop nav dropdown — opens on hover / focus, closes on Escape or outside click.
 */
export function NavDropdown({ item }: { item: NavLinkItem }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const children = item.children ?? [];
  const active = groupIsActive(pathname, item);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        rootRef.current?.querySelector<HTMLElement>("button")?.focus();
      }
    };

    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open, close]);

  function onTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => {
        rootRef.current
          ?.querySelector<HTMLElement>('[role="menuitem"]')
          ?.focus();
      });
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "link-underline inline-flex items-center gap-1 text-sm transition-colors duration-300",
          active ? "text-gold" : "text-cloud hover:text-warm",
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        data-cursor="hover"
      >
        {item.label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-250",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label={item.label}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-full z-[130] mt-3 min-w-[13.5rem] -translate-x-1/2 rounded-xl border border-warm/12 bg-charcoal/90 p-2 shadow-[var(--shadow-medium)] backdrop-blur-xl"
          >
            {/* Hover bridge so mouse can move into the menu without closing */}
            <div className="absolute inset-x-0 -top-3 h-3" aria-hidden />
            {children.map((child) => {
              const childActive = isActivePath(pathname, child.href);
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  role="menuitem"
                  tabIndex={0}
                  onClick={close}
                  className={cn(
                    "block rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-200",
                    childActive
                      ? "bg-gold/15 text-gold"
                      : "text-warm hover:bg-warm/8 hover:text-gold",
                  )}
                  data-cursor="hover"
                >
                  {child.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Mobile accordion for a nav group (tap to expand children).
 */
export function NavAccordion({
  item,
  index,
}: {
  item: NavLinkItem;
  index: number;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(() =>
    groupIsActive(pathname, item),
  );
  const panelId = useId();
  const children = item.children ?? [];
  const active = groupIsActive(pathname, item);

  useEffect(() => {
    setExpanded(groupIsActive(pathname, item));
  }, [pathname, item]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.1 + index * 0.06,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="border-b border-warm/10"
    >
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between py-5 text-left font-display text-4xl font-light tracking-tight transition-colors sm:text-5xl",
          active ? "text-gold" : "text-warm hover:text-gold",
        )}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((v) => !v)}
        data-cursor="hover"
      >
        {item.label}
        <ChevronDown
          className={cn(
            "h-7 w-7 shrink-0 text-gold transition-transform duration-300",
            expanded && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={panelId}
            role="region"
            aria-label={`${item.label} submenu`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <ul className="space-y-1 pb-5 pl-1">
              {children.map((child) => {
                const childActive = isActivePath(pathname, child.href);
                return (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className={cn(
                        "block rounded-xl px-3 py-3 text-lg transition-colors sm:text-xl",
                        childActive
                          ? "bg-gold/12 text-gold"
                          : "text-cloud hover:bg-warm/5 hover:text-gold",
                      )}
                      data-cursor="hover"
                    >
                      {child.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
