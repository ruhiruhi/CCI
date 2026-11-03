"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import type { SupportItem } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SUPPORT_CATEGORIES,
  SUPPORT_ITEM_STATUSES,
  SUPPORT_PRIORITIES,
  SUPPORT_PRIORITY_LABELS,
  SUPPORT_ITEM_STATUS_LABELS,
} from "@/lib/support";

export function SupportItemEditor({
  initial,
}: {
  initial: SupportItem | null;
}) {
  const router = useRouter();
  const isNew = !initial;
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    category: initial?.category ?? "Production",
    description: initial?.description ?? "",
    quantityNeeded: initial?.quantityNeeded ?? 10,
    unit: initial?.unit ?? "items",
    image: initial?.image ?? "",
    priority: initial?.priority ?? "MEDIUM",
    status: initial?.status ?? "OPEN",
    sortOrder: initial?.sortOrder ?? 0,
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
      ? "/api/admin/support-items"
      : `/api/admin/support-items/${initial.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        image: form.image || null,
      }),
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
      router.push(`/admin/support/items/${data.item.id}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/support/items"
          className="inline-flex items-center gap-2 text-sm text-mist hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to items
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
          <CardTitle>{isNew ? "Add support item" : "Edit support item"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Need School Bags"
            />
          </label>
          <label className="space-y-2">
            <Label>Category *</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-warm/12 bg-ink-soft px-3 text-sm text-warm"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {SUPPORT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              {!SUPPORT_CATEGORIES.includes(
                form.category as (typeof SUPPORT_CATEGORIES)[number],
              ) && form.category ? (
                <option value={form.category}>{form.category}</option>
              ) : null}
            </select>
          </label>
          <label className="space-y-2">
            <Label>Custom category</Label>
            <Input
              value={
                SUPPORT_CATEGORIES.includes(
                  form.category as (typeof SUPPORT_CATEGORIES)[number],
                )
                  ? ""
                  : form.category
              }
              onChange={(e) => {
                if (e.target.value.trim()) set("category", e.target.value);
              }}
              placeholder="Or type a custom category"
            />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <Label>Description *</Label>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
          <label className="space-y-2">
            <Label>Quantity needed *</Label>
            <Input
              type="number"
              min={1}
              value={form.quantityNeeded}
              onChange={(e) =>
                set("quantityNeeded", Number(e.target.value) || 1)
              }
            />
          </label>
          <label className="space-y-2">
            <Label>Unit</Label>
            <Input
              value={form.unit}
              onChange={(e) => set("unit", e.target.value)}
              placeholder="bags, pairs, kits…"
            />
          </label>
          {!isNew && initial ? (
            <div className="rounded-lg border border-warm/10 bg-ink/40 px-4 py-3 text-sm text-cloud sm:col-span-2">
              Received: <span className="text-gold">{initial.quantityReceived}</span>{" "}
              {initial.unit} · Remaining:{" "}
              <span className="text-gold">
                {Math.max(0, initial.quantityNeeded - initial.quantityReceived)}
              </span>
            </div>
          ) : null}
          <label className="space-y-2 sm:col-span-2">
            <Label>Image URL</Label>
            <Input
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="/images/..."
            />
            {form.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image}
                alt=""
                className="mt-3 h-40 w-full rounded-xl object-cover"
              />
            ) : null}
          </label>
          <label className="space-y-2">
            <Label>Priority</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-warm/12 bg-ink-soft px-3 text-sm text-warm"
              value={form.priority}
              onChange={(e) =>
                set("priority", e.target.value as typeof form.priority)
              }
            >
              {SUPPORT_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {SUPPORT_PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <Label>Status</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-warm/12 bg-ink-soft px-3 text-sm text-warm"
              value={form.status}
              onChange={(e) =>
                set("status", e.target.value as typeof form.status)
              }
            >
              {SUPPORT_ITEM_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {SUPPORT_ITEM_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
