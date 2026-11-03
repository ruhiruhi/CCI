"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

export function Subscribe() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Could not subscribe. Please try again.");
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold">
              <Check className="h-6 w-6" />
            </span>
            <p className="mt-5 font-display text-2xl font-light text-warm">
              You&apos;re on the list.
            </p>
            <p className="mt-2 text-cloud/75">
              Watch your inbox for the next dispatch from the field.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={onSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              required
              name="email"
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
              disabled={loading}
              className="h-14 flex-1 rounded-full border border-warm/15 bg-ink/60 px-6 text-warm placeholder:text-ash outline-none transition-colors focus:border-gold/60 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading}
              data-cursor="hover"
              className="btn-cci-primary group h-14 px-8 disabled:opacity-60"
            >
              {loading ? "Subscribing…" : "Subscribe"}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {error && (
        <p className="mt-3 text-center text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <p className="mt-4 text-center text-xs text-ash">
        One thoughtful email a month. No spam, ever. Unsubscribe anytime.
      </p>
    </div>
  );
}
