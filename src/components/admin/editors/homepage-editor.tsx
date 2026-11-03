"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HeroSection, Stat } from "@prisma/client";

type HeroForm = {
  kicker: string;
  headline: string;
  subheading: string;
  backgroundImage: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
};

type StatForm = {
  id?: string;
  value: number;
  suffix: string;
  prefix: string;
  label: string;
  detail: string;
};

export function HomepageEditor({
  initialHero,
  initialStats,
}: {
  initialHero: HeroSection | null;
  initialStats: Stat[];
}) {
  const router = useRouter();
  const defaultHeadline = Array.isArray(initialHero?.headline)
    ? (initialHero.headline as string[]).join("\n")
    : "Every story\nhas the power\nto change a life.";

  const ctaPrimary = initialHero?.ctaPrimary as { label?: string; href?: string } | null;
  const ctaSecondary = initialHero?.ctaSecondary as { label?: string; href?: string } | null;

  const [hero, setHero] = useState<HeroForm>({
    kicker: initialHero?.kicker ?? "Conscious Cinema Initiative",
    headline: defaultHeadline,
    subheading:
      initialHero?.subheading ??
      "Cinema is more than entertainment. It creates awareness, builds empathy, starts conversations, and transforms communities.",
    backgroundImage: initialHero?.backgroundImage ?? "",
    ctaPrimaryLabel: ctaPrimary?.label ?? "Join the Movement",
    ctaPrimaryHref: ctaPrimary?.href ?? "/support",
    ctaSecondaryLabel: ctaSecondary?.label ?? "Discover Our Story",
    ctaSecondaryHref: ctaSecondary?.href ?? "/about",
  });

  const [stats, setStats] = useState<StatForm[]>(
    initialStats.length > 0
      ? initialStats.map((s) => ({
          id: s.id,
          value: s.value,
          suffix: s.suffix ?? "",
          prefix: s.prefix ?? "",
          label: s.label,
          detail: s.detail,
        }))
      : [
          { value: 248, suffix: "+", prefix: "", label: "Screenings held", detail: "From rooftops to riverbanks" },
          { value: 67, suffix: "", prefix: "", label: "Cities & villages", detail: "Across rural and urban India" },
          { value: 92000, suffix: "+", prefix: "", label: "Students reached", detail: "Young minds, new perspectives" },
          { value: 1400, suffix: "+", prefix: "", label: "Volunteers", detail: "Carrying the movement forward" },
        ],
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hero: {
          ...hero,
          headline: hero.headline.split("\n").filter(Boolean),
          ctaPrimary: { label: hero.ctaPrimaryLabel, href: hero.ctaPrimaryHref },
          ctaSecondary: { label: hero.ctaSecondaryLabel, href: hero.ctaSecondaryHref },
        },
        stats,
      }),
    });

    setSaving(false);

    if (res.ok) {
      setMessage("Saved successfully.");
      router.refresh();
    } else {
      const data = await res.json();
      setMessage(data.error ?? "Failed to save.");
    }
  }

  function updateStat(index: number, field: keyof StatForm, value: string | number) {
    setStats((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {message && (
        <div className="rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold-soft">
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Kicker</Label>
            <Input
              value={hero.kicker}
              onChange={(e) => setHero({ ...hero, kicker: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Headline (one line per row)</Label>
            <Textarea
              value={hero.headline}
              onChange={(e) => setHero({ ...hero, headline: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Subheading</Label>
            <Textarea
              value={hero.subheading}
              onChange={(e) => setHero({ ...hero, subheading: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Background Image URL</Label>
            <Input
              value={hero.backgroundImage}
              onChange={(e) => setHero({ ...hero, backgroundImage: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Primary CTA Label</Label>
              <Input
                value={hero.ctaPrimaryLabel}
                onChange={(e) => setHero({ ...hero, ctaPrimaryLabel: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Primary CTA Link</Label>
              <Input
                value={hero.ctaPrimaryHref}
                onChange={(e) => setHero({ ...hero, ctaPrimaryHref: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA Label</Label>
              <Input
                value={hero.ctaSecondaryLabel}
                onChange={(e) => setHero({ ...hero, ctaSecondaryLabel: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA Link</Label>
              <Input
                value={hero.ctaSecondaryHref}
                onChange={(e) => setHero({ ...hero, ctaSecondaryHref: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics Strip</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, i) => (
            <div
              key={stat.id ?? i}
              className="grid gap-3 rounded-lg border border-warm/6 bg-ink-soft/50 p-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div className="space-y-1">
                <Label>Value</Label>
                <Input
                  type="number"
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label>Suffix</Label>
                <Input
                  value={stat.suffix}
                  onChange={(e) => updateStat(i, "suffix", e.target.value)}
                  placeholder="+"
                />
              </div>
              <div className="space-y-1">
                <Label>Label</Label>
                <Input
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Detail</Label>
                <Input
                  value={stat.detail}
                  onChange={(e) => updateStat(i, "detail", e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save & Publish
        </Button>
      </div>
    </div>
  );
}
