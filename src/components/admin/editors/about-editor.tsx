"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import type { Pillar, TimelineItem } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TimelineForm = {
  id?: string;
  year: string;
  title: string;
  body: string;
  image: string;
};

type PillarForm = {
  id?: string;
  index: string;
  title: string;
  tagline: string;
  body: string;
  pointsText: string;
  image: string;
};

function mapTimeline(rows: TimelineItem[]): TimelineForm[] {
  return rows.map((t) => ({
    id: t.id,
    year: t.year,
    title: t.title,
    body: t.body,
    image: t.image,
  }));
}

function mapPillars(rows: Pillar[]): PillarForm[] {
  return rows.map((p) => ({
    id: p.id,
    index: p.index,
    title: p.title,
    tagline: p.tagline,
    body: p.body,
    pointsText: Array.isArray(p.points)
      ? (p.points as string[]).join("\n")
      : "",
    image: p.image,
  }));
}

export function AboutEditor({
  initialTimeline,
  initialPillars,
}: {
  initialTimeline: TimelineItem[];
  initialPillars: Pillar[];
}) {
  const router = useRouter();
  const [timeline, setTimeline] = useState<TimelineForm[]>(
    mapTimeline(initialTimeline),
  );
  const [pillars, setPillars] = useState<PillarForm[]>(mapPillars(initialPillars));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timeline,
        pillars: pillars.map((p) => ({
          id: p.id,
          index: p.index,
          title: p.title,
          tagline: p.tagline,
          body: p.body,
          image: p.image,
          points: p.pointsText
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean),
        })),
        status: "PUBLISHED",
      }),
    });
    const data = (await res.json()) as { error?: string };
    setSaving(false);
    if (!res.ok) {
      setMessage(data.error ?? "Save failed.");
      return;
    }
    setMessage("Saved. Homepage timeline/pillars and About journey update on next load.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save About content"}
        </Button>
      </div>

      {message ? (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.startsWith("Saved")
              ? "border-gold/30 bg-gold/10 text-gold"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {message}
        </p>
      ) : null}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Timeline</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setTimeline((rows) => [
                ...rows,
                { year: "", title: "", body: "", image: "" },
              ])
            }
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {timeline.length === 0 ? (
            <p className="text-sm text-mist">No timeline items yet.</p>
          ) : null}
          {timeline.map((item, i) => (
            <div
              key={item.id ?? `t-${i}`}
              className="space-y-3 rounded-xl border border-warm/10 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-mist">
                  Item {i + 1}
                </p>
                <button
                  type="button"
                  className="text-mist hover:text-red-400"
                  onClick={() =>
                    setTimeline((rows) => rows.filter((_, idx) => idx !== i))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <Label>Year</Label>
                  <Input
                    value={item.year}
                    onChange={(e) =>
                      setTimeline((rows) =>
                        rows.map((r, idx) =>
                          idx === i ? { ...r, year: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </label>
                <label className="space-y-1.5">
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) =>
                      setTimeline((rows) =>
                        rows.map((r, idx) =>
                          idx === i ? { ...r, title: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </label>
                <label className="space-y-1.5 sm:col-span-2">
                  <Label>Body</Label>
                  <Textarea
                    rows={3}
                    value={item.body}
                    onChange={(e) =>
                      setTimeline((rows) =>
                        rows.map((r, idx) =>
                          idx === i ? { ...r, body: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </label>
                <label className="space-y-1.5 sm:col-span-2">
                  <Label>Image URL</Label>
                  <Input
                    value={item.image}
                    onChange={(e) =>
                      setTimeline((rows) =>
                        rows.map((r, idx) =>
                          idx === i ? { ...r, image: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pillars</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setPillars((rows) => [
                ...rows,
                {
                  index: String(rows.length + 1).padStart(2, "0"),
                  title: "",
                  tagline: "",
                  body: "",
                  pointsText: "",
                  image: "",
                },
              ])
            }
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {pillars.map((item, i) => (
            <div
              key={item.id ?? `p-${i}`}
              className="space-y-3 rounded-xl border border-warm/10 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-mist">
                  Pillar {i + 1}
                </p>
                <button
                  type="button"
                  className="text-mist hover:text-red-400"
                  onClick={() =>
                    setPillars((rows) => rows.filter((_, idx) => idx !== i))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <Label>Index</Label>
                  <Input
                    value={item.index}
                    onChange={(e) =>
                      setPillars((rows) =>
                        rows.map((r, idx) =>
                          idx === i ? { ...r, index: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </label>
                <label className="space-y-1.5">
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) =>
                      setPillars((rows) =>
                        rows.map((r, idx) =>
                          idx === i ? { ...r, title: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </label>
                <label className="space-y-1.5 sm:col-span-2">
                  <Label>Tagline</Label>
                  <Input
                    value={item.tagline}
                    onChange={(e) =>
                      setPillars((rows) =>
                        rows.map((r, idx) =>
                          idx === i ? { ...r, tagline: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </label>
                <label className="space-y-1.5 sm:col-span-2">
                  <Label>Body</Label>
                  <Textarea
                    rows={3}
                    value={item.body}
                    onChange={(e) =>
                      setPillars((rows) =>
                        rows.map((r, idx) =>
                          idx === i ? { ...r, body: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </label>
                <label className="space-y-1.5 sm:col-span-2">
                  <Label>Points (one per line)</Label>
                  <Textarea
                    rows={4}
                    value={item.pointsText}
                    onChange={(e) =>
                      setPillars((rows) =>
                        rows.map((r, idx) =>
                          idx === i ? { ...r, pointsText: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </label>
                <label className="space-y-1.5 sm:col-span-2">
                  <Label>Image URL</Label>
                  <Input
                    value={item.image}
                    onChange={(e) =>
                      setPillars((rows) =>
                        rows.map((r, idx) =>
                          idx === i ? { ...r, image: e.target.value } : r,
                        ),
                      )
                    }
                  />
                </label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
