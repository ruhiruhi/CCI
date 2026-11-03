"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Search } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import {
  SUPPORT_CATEGORIES,
  SUPPORT_PRIORITIES,
  SUPPORT_PRIORITY_LABELS,
  progressPercent,
  remainingQuantity,
  type SupportPriorityValue,
} from "@/lib/support";

export type PublicSupportItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  quantityNeeded: number;
  quantityReceived: number;
  unit: string;
  image: string | null;
  priority: string;
  status: string;
  createdAt: string;
};

const field =
  "form-control w-full rounded-xl border border-warm/15 bg-ink/50 px-4 py-3 text-sm text-warm caret-[#FDBA3B] placeholder:text-mist/45 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 disabled:opacity-60";

function priorityClass(p: string) {
  switch (p) {
    case "URGENT":
      return "border-red-400/40 bg-red-500/15 text-red-300";
    case "HIGH":
      return "border-orange-400/40 bg-orange-500/15 text-orange-200";
    case "MEDIUM":
      return "border-gold/40 bg-gold/15 text-gold";
    default:
      return "border-warm/20 bg-warm/10 text-mist";
  }
}

export function SupportNeedsSection({
  initialItems,
}: {
  initialItems: PublicSupportItem[];
}) {
  const [items] = useState(initialItems);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [active, setActive] = useState<PublicSupportItem | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return items
      .filter((item) => {
        if (status && item.status !== status) return false;
        if (category && item.category !== category) return false;
        if (priority && item.priority !== priority) return false;
        if (!q.trim()) return true;
        const needle = q.toLowerCase();
        return (
          item.title.toLowerCase().includes(needle) ||
          item.description.toLowerCase().includes(needle) ||
          item.category.toLowerCase().includes(needle)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [items, q, category, priority, status]);

  useEffect(() => {
    if (!active) return;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active?.id]);

  function selectItem(item: PublicSupportItem) {
    setActive(item);
    setSent(false);
    setError("");
  }

  function clearSelection() {
    setActive(null);
    setSent(false);
    setError("");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!active) return;
    setError("");
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supportItemId: active.id,
          fullName: fd.get("fullName"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          address: fd.get("address"),
          city: fd.get("city"),
          state: fd.get("state"),
          country: fd.get("country") || "India",
          pincode: fd.get("pincode"),
          message: fd.get("message") || "",
          quantityToDonate: Number(fd.get("quantityToDonate")),
          agreeContact: fd.get("agreeContact") === "on",
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Submission failed.");
        return;
      }
      setSent(true);
      e.currentTarget.reset();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-pad">
      <div className="shell">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker mb-3">Support needed</p>
            <h2 className="font-display text-3xl font-light text-warm md:text-4xl">
              Sponsor an item in need.
            </h2>
            <p className="mt-3 max-w-xl text-cloud/75">
              Choose a need below and fill the form on this page. Our team will
              coordinate delivery with you.
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
            <input
              className={`${field} pl-10`}
              placeholder="Search needs…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select
            className={field}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {SUPPORT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className={field}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">All priorities</option>
            {SUPPORT_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {SUPPORT_PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
          <select
            className={field}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Open & Closed</option>
            <option value="OPEN">Open only</option>
            <option value="CLOSED">Closed only</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-warm/10 bg-charcoal/30 px-6 py-12 text-center text-cloud/70">
            No support needs match your filters right now.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const remaining = remainingQuantity(
                item.quantityNeeded,
                item.quantityReceived,
              );
              const pct = progressPercent(
                item.quantityNeeded,
                item.quantityReceived,
              );
              const isOpen = item.status === "OPEN" && remaining > 0;
              const selected = active?.id === item.id;

              return (
                <article
                  key={item.id}
                  className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-charcoal/40 transition duration-500 hover:shadow-[var(--shadow-medium)] ${
                    selected
                      ? "border-gold/50 ring-1 ring-gold/30"
                      : "border-warm/10 hover:border-gold/30"
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-ink" />
                    )}
                    <span
                      className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-xs ${priorityClass(item.priority)}`}
                    >
                      {SUPPORT_PRIORITY_LABELS[
                        item.priority as SupportPriorityValue
                      ] ?? item.priority}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-mist">
                      {item.category}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-light text-warm">
                      {item.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm text-cloud/75">
                      {item.description}
                    </p>
                    <div className="mt-5 space-y-2 text-sm text-cloud/85">
                      <p>
                        Needed:{" "}
                        <span className="text-warm">
                          {item.quantityNeeded} {item.unit}
                        </span>
                      </p>
                      <p>
                        Received:{" "}
                        <span className="text-warm">
                          {item.quantityReceived} {item.unit}
                        </span>
                      </p>
                      <p>
                        Remaining:{" "}
                        <span className="text-gold">
                          {remaining} {item.unit}
                        </span>
                      </p>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink/80">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-mist">{pct}% funded</p>
                    <div className="mt-auto pt-6">
                      {isOpen ? (
                        <Magnetic className="w-full">
                          <button
                            type="button"
                            className={`h-12 w-full text-sm ${
                              selected
                                ? "btn-cci-secondary"
                                : "btn-cci-primary"
                            }`}
                            data-cursor="hover"
                            onClick={() => selectItem(item)}
                          >
                            {selected ? "Selected — fill form below" : "Support"}
                          </button>
                        </Magnetic>
                      ) : (
                        <p className="rounded-full border border-gold/30 bg-gold/10 px-4 py-3 text-center text-sm text-gold">
                          Support Goal Achieved
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Inline pledge form — on the page, not a popup */}
        <div
          ref={formRef}
          id="support-pledge-form"
          className="mt-10 scroll-mt-28 rounded-3xl border border-warm/10 bg-charcoal/40 p-6 md:p-10"
        >
          {!active ? (
            <div className="py-6 text-center md:py-10">
              <p className="kicker mb-3">Pledge support</p>
              <h3 className="font-display text-2xl font-light text-warm md:text-3xl">
                Support a cause above to begin.
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-cloud/70">
                Tap <span className="text-gold">Support</span> on any
                open need. The pledge form will appear here on this page.
              </p>
            </div>
          ) : sent ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold">
                <Check className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-light text-warm md:text-3xl">
                Thank you.
              </h3>
              <p className="mt-2 max-w-sm text-sm text-cloud/75">
                Your pledge for{" "}
                <span className="text-gold">{active.title}</span> is received.
                We&apos;ll contact you soon to coordinate.
              </p>
              <button
                type="button"
                onClick={clearSelection}
                className="btn-cci-primary mt-8 h-12 px-6 text-sm"
                data-cursor="hover"
              >
                Support another cause
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="kicker mb-2">Pledge support</p>
                  <h3 className="font-display text-2xl font-light text-warm md:text-3xl">
                    {active.title}
                  </h3>
                  <p className="mt-2 text-sm text-cloud/70">
                    Remaining:{" "}
                    <span className="text-gold">
                      {remainingQuantity(
                        active.quantityNeeded,
                        active.quantityReceived,
                      )}{" "}
                      {active.unit}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-sm text-mist underline-offset-4 hover:text-gold hover:underline"
                  data-cursor="hover"
                >
                  Change selection
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm text-mist">
                    Full Name *
                  </span>
                  <input
                    required
                    name="fullName"
                    autoComplete="name"
                    className={field}
                    disabled={loading}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm text-mist">Email *</span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    className={field}
                    disabled={loading}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm text-mist">Phone *</span>
                  <input
                    required
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    className={field}
                    disabled={loading}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm text-mist">
                    Address *
                  </span>
                  <input
                    required
                    name="address"
                    autoComplete="street-address"
                    className={field}
                    disabled={loading}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm text-mist">City *</span>
                  <input
                    required
                    name="city"
                    autoComplete="address-level2"
                    className={field}
                    disabled={loading}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm text-mist">State *</span>
                  <input
                    required
                    name="state"
                    autoComplete="address-level1"
                    className={field}
                    disabled={loading}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm text-mist">
                    Country *
                  </span>
                  <input
                    required
                    name="country"
                    defaultValue="India"
                    autoComplete="country-name"
                    className={field}
                    disabled={loading}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm text-mist">
                    Pincode *
                  </span>
                  <input
                    required
                    name="pincode"
                    autoComplete="postal-code"
                    className={field}
                    disabled={loading}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm text-mist">
                    Quantity to donate *
                  </span>
                  <input
                    required
                    type="number"
                    min={1}
                    max={
                      remainingQuantity(
                        active.quantityNeeded,
                        active.quantityReceived,
                      ) || undefined
                    }
                    name="quantityToDonate"
                    defaultValue={1}
                    className={field}
                    disabled={loading}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm text-mist">Message</span>
                  <textarea
                    name="message"
                    rows={4}
                    className={`${field} resize-none`}
                    disabled={loading}
                  />
                </label>
              </div>

              <label className="flex items-start gap-3 text-sm text-cloud">
                <input
                  required
                  type="checkbox"
                  name="agreeContact"
                  className="mt-1 h-4 w-4 accent-gold"
                  disabled={loading}
                />
                <span>I agree to be contacted about this pledge. *</span>
              </label>

              {error ? (
                <p className="text-sm text-red-400" role="alert">
                  {error}
                </p>
              ) : null}

              <Magnetic className="w-full max-w-md">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cci-primary h-12 w-full disabled:opacity-70"
                  data-cursor="hover"
                >
                  {loading ? "Submitting…" : "Submit pledge"}
                </button>
              </Magnetic>
            </form>
          )}
        </div>

        <div className="mt-10 rounded-3xl border border-gold/20 bg-charcoal/50 p-8 text-center md:p-10">
          <h3 className="font-display text-2xl font-light text-warm md:text-3xl">
            Support the mission beyond a single cause
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cloud/80 md:text-base">
            If you&apos;d prefer a general financial contribution helps sustain every
            initiative that advances CCI&apos;s vision of a more conscious society
            through cinema.
          </p>
          <a
            href="/donate"
            className="btn-cci-primary mt-7 inline-flex h-12 items-center px-7 text-sm"
            data-cursor="hover"
          >
            Direct Contribution
          </a>
        </div>
      </div>
    </section>
  );
}
