"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import type { GalleryItem } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTENT_STATUSES } from "@/lib/admin-content";

function toDateInput(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function GalleryEditor({
  initial,
}: {
  initial: GalleryItem | null;
}) {
  const router = useRouter();
  const isNew = !initial;
  const [form, setForm] = useState({
    src: initial?.src ?? "",
    alt: initial?.alt ?? "",
    category: initial?.category ?? "Screenings",
    caption: initial?.caption ?? "",
    span: initial?.span ?? "regular",
    eventDate: toDateInput(initial?.eventDate),
    featured: initial?.featured ?? false,
    sortOrder: initial?.sortOrder ?? 0,
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
    const url = isNew
      ? "/api/admin/gallery"
      : `/api/admin/gallery/${initial.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
      router.push(`/admin/content/gallery/${data.item.id}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/content/gallery"
          className="inline-flex items-center gap-2 text-sm text-mist hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to gallery
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
          <CardTitle>{isNew ? "New gallery item" : "Edit gallery item"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2">
            <Label>Image URL *</Label>
            <Input value={form.src} onChange={(e) => set("src", e.target.value)} placeholder="/images/..." />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <Label>Caption *</Label>
            <Textarea value={form.caption} onChange={(e) => set("caption", e.target.value)} rows={2} />
          </label>
          <label className="space-y-2">
            <Label>Alt text</Label>
            <Input value={form.alt} onChange={(e) => set("alt", e.target.value)} />
          </label>
          <label className="space-y-2">
            <Label>Category *</Label>
            <Input value={form.category} onChange={(e) => set("category", e.target.value)} />
          </label>
          <label className="space-y-2">
            <Label>Layout span</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-warm/12 bg-ink-soft px-3 text-sm text-warm"
              value={form.span}
              onChange={(e) => set("span", e.target.value)}
            >
              <option value="regular">regular</option>
              <option value="wide">wide</option>
              <option value="tall">tall</option>
            </select>
          </label>
          <label className="space-y-2">
            <Label>Event date</Label>
            <Input
              type="date"
              value={form.eventDate}
              onChange={(e) => set("eventDate", e.target.value)}
            />
          </label>
          <label className="space-y-2">
            <Label>Sort order</Label>
            <Input
              type="number"
              value={form.sortOrder}
              onChange={(e) => set("sortOrder", Number(e.target.value) || 0)}
            />
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
          <label className="flex items-center gap-3 pt-6 text-sm text-cloud">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            Featured
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
