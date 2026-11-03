"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import type { Event } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTENT_STATUSES, slugify } from "@/lib/admin-content";

function toDateInput(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function EventEditor({ initial }: { initial: Event | null }) {
  const router = useRouter();
  const isNew = !initial;
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    date: toDateInput(initial?.date),
    endDate: toDateInput(initial?.endDate),
    city: initial?.city ?? "",
    type: initial?.type ?? "Screening",
    image: initial?.image ?? "",
    blurb: initial?.blurb ?? "",
    description: initial?.description ?? "",
    isPast: initial?.isPast ?? false,
    registration: initial?.registration ?? false,
    status: initial?.status ?? "PUBLISHED",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
    };
    const url = isNew ? "/api/admin/events" : `/api/admin/events/${initial.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { error?: string; item?: { id: string } };
    setSaving(false);
    if (!res.ok) {
      setMessage(data.error ?? "Save failed.");
      return;
    }
    setMessage("Saved.");
    router.refresh();
    if (isNew && data.item?.id) {
      router.push(`/admin/content/events/${data.item.id}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/content/events"
          className="inline-flex items-center gap-2 text-sm text-mist hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to events
        </Link>
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>

      {message ? (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            message === "Saved."
              ? "border-gold/30 bg-gold/10 text-gold"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {message}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{isNew ? "New event" : "Edit event"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({
                  ...f,
                  title,
                  slug: isNew && !f.slug ? slugify(title) : f.slug,
                }));
              }}
            />
          </label>
          <label className="space-y-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} />
          </label>
          <label className="space-y-2">
            <Label>Type *</Label>
            <Input value={form.type} onChange={(e) => set("type", e.target.value)} />
          </label>
          <label className="space-y-2">
            <Label>Date *</Label>
            <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </label>
          <label className="space-y-2">
            <Label>End date</Label>
            <Input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
          </label>
          <label className="space-y-2">
            <Label>City *</Label>
            <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
          </label>
          <label className="space-y-2">
            <Label>Status</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-warm/12 bg-ink-soft px-3 text-sm text-warm"
              value={form.status}
              onChange={(e) => set("status", e.target.value as typeof form.status)}
            >
              {CONTENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 sm:col-span-2">
            <Label>Image URL</Label>
            <Input value={form.image} onChange={(e) => set("image", e.target.value)} />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <Label>Blurb *</Label>
            <Textarea value={form.blurb} onChange={(e) => set("blurb", e.target.value)} rows={3} />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
            />
          </label>
          <label className="flex items-center gap-3 text-sm text-cloud">
            <input
              type="checkbox"
              checked={form.isPast}
              onChange={(e) => set("isPast", e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            Mark as past event
          </label>
          <label className="flex items-center gap-3 text-sm text-cloud">
            <input
              type="checkbox"
              checked={form.registration}
              onChange={(e) => set("registration", e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            Registration open
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
