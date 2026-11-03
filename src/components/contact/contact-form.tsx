"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { VolunteerPhotoUpload } from "@/components/volunteer/volunteer-photo-upload";
import {
  LEAD_INTERESTS,
  parseInterestParam,
  type LeadInterest,
} from "@/lib/leads";

const field =
  "form-control w-full rounded-xl border border-warm/15 bg-ink/50 px-5 py-4 text-base leading-normal text-warm caret-[#FDBA3B] placeholder:text-mist/45 outline-none transition-[border-color,box-shadow,background-color] duration-300 hover:border-warm/25 focus:border-gold focus:bg-ink/70 focus:ring-2 focus:ring-gold/35 disabled:opacity-60";

type ContactFormProps = {
  initialInterest?: string;
  /** When true, posts Join CCI membership applications instead of generic leads. */
  mode?: "contact" | "join";
};

export function ContactForm({
  initialInterest,
  mode = "contact",
}: ContactFormProps) {
  const [sent, setSent] = useState(false);
  const [interest, setInterest] = useState<LeadInterest>(() =>
    parseInterestParam(initialInterest),
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showInstitution = interest !== "Volunteer";
  const sourcePage = mode === "join" ? "/join" : "/contact";

  useEffect(() => {
    setInterest(parseInterestParam(initialInterest));
  }, [initialInterest]);

  useEffect(() => {
    if (interest !== "Volunteer") setPhotoFile(null);
  }, [interest]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const message = String(formData.get("message") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const city = String(formData.get("city") ?? "");
    const organization = String(formData.get("organization") ?? "");
    const selectedInterest = String(formData.get("interest") ?? interest);

    setLoading(true);

    try {
      if (mode === "join" || selectedInterest === "Volunteer") {
        const payload = new FormData();
        payload.set("name", name);
        payload.set("email", email);
        payload.set("phone", phone);
        payload.set("city", city);
        payload.set("interest", selectedInterest === "Volunteer" ? "Volunteer" : selectedInterest);
        payload.set("message", message);
        if (organization && selectedInterest !== "Volunteer") {
          payload.set("organization", organization);
        }
        if (photoFile) payload.set("profilePhoto", photoFile);

        // Join CCI / volunteer applications go through volunteer register for approval workflow
        const endpoint =
          mode === "join" && selectedInterest !== "Volunteer"
            ? "/api/memberships/register"
            : "/api/volunteers/register";

        const res = await fetch(endpoint, {
          method: "POST",
          body: payload,
        });

        const data = (await res.json()) as {
          error?: string;
          redirectTo?: string;
          id?: string;
          message?: string;
        };

        if (!res.ok) {
          setError(data.error ?? "Something went wrong. Please try again.");
          return;
        }

        if (data.redirectTo) {
          window.location.assign(data.redirectTo);
          return;
        }

        form.reset();
        setInterest(parseInterestParam(initialInterest));
        setPhotoFile(null);
        setSent(true);
        setToast(data.message ?? "Application received — thank you.");
        setTimeout(() => setToast(null), 3500);
        return;
      }

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          city,
          organization: showInstitution ? organization : "",
          interest: selectedInterest,
          message,
          sourcePage,
          buttonName: selectedInterest,
          pageUrl:
            typeof window !== "undefined" ? window.location.href : sourcePage,
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      form.reset();
      setInterest(parseInterestParam(initialInterest));
      setPhotoFile(null);
      setSent(true);
      setToast("Message received — thank you.");
      setTimeout(() => setToast(null), 3500);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative rounded-3xl border border-warm/10 bg-charcoal/40 p-6 md:p-8">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-[280px] flex-col items-center justify-center text-center"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/40 text-gold">
              <Check className="h-7 w-7" />
            </span>
            <h3 className="mt-6 font-display text-3xl font-light text-warm">
              {mode === "join" ? "Application received." : "Message received."}
            </h3>
            <p className="mt-3 max-w-sm text-cloud/75">
              {mode === "join"
                ? "Thank you for applying to join CCI. Our team will review your application and follow up by email."
                : "Thank you for reaching out. A member of our team will be in touch soon — the movement just grew by one."}
            </p>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setError("");
              }}
              className="mt-8 text-sm text-gold link-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
              data-cursor="hover"
            >
              {mode === "join" ? "Submit another application" : "Send another message"}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={onSubmit}
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2.5 block text-sm text-mist">
                  Full Name <span className="text-gold">*</span>
                </span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  placeholder="Meera Sharma"
                  className={field}
                  disabled={loading}
                  aria-required="true"
                />
              </label>
              <label className="block">
                <span className="mb-2.5 block text-sm text-mist">
                  Email <span className="text-gold">*</span>
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  className={field}
                  disabled={loading}
                  aria-required="true"
                />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2.5 block text-sm text-mist">
                  Mobile Number <span className="text-gold">*</span>
                </span>
                <input
                  required
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  className={field}
                  disabled={loading}
                  aria-required="true"
                />
              </label>
              <label className="block">
                <span className="mb-2.5 block text-sm text-mist">
                  City <span className="text-gold">*</span>
                </span>
                <input
                  required
                  name="city"
                  autoComplete="address-level2"
                  placeholder="Delhi"
                  className={field}
                  disabled={loading}
                  aria-required="true"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2.5 block text-sm text-mist">
                I&apos;m interested in <span className="text-gold">*</span>
              </span>
              <select
                name="interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value as LeadInterest)}
                className={field}
                disabled={loading}
                aria-required="true"
              >
                {LEAD_INTERESTS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>

            {showInstitution ? (
              <label className="block">
                <span className="mb-2.5 block text-sm text-mist">
                  Institution / Company <span className="text-gold">*</span>
                </span>
                <input
                  required
                  name="organization"
                  autoComplete="organization"
                  placeholder="School, college, NGO, or company"
                  className={field}
                  disabled={loading}
                  aria-required="true"
                />
              </label>
            ) : null}

            {interest === "Volunteer" ? (
              <VolunteerPhotoUpload
                file={photoFile}
                onChange={setPhotoFile}
                disabled={loading}
              />
            ) : null}

            <label className="block">
              <span className="mb-2.5 block text-sm text-mist">Message</span>
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us a little about yourself and how you'd like to take part…"
                className={`${field} resize-y`}
                disabled={loading}
              />
            </label>

            {error ? (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}

            <Magnetic>
              <button
                type="submit"
                disabled={loading}
                className="btn-cci-primary group inline-flex h-14 w-full items-center justify-center gap-2 px-8 sm:w-auto"
                data-cursor="hover"
              >
                {loading
                  ? "Sending…"
                  : mode === "join"
                    ? "Submit Join CCI application"
                    : "Send message"}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </Magnetic>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-gold/30 bg-ink/90 px-5 py-2 text-xs text-warm backdrop-blur"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
