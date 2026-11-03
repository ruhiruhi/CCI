"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import type { ActivityLocation } from "@/lib/activities";
import { slugify } from "@/lib/admin-content";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTENT_STATUSES } from "@/lib/admin-content";

function emptyLocation(): ActivityLocation {
  const id = `loc-${Date.now()}`;
  return {
    id,
    slug: "new-location",
    title: "New location",
    location: "",
    thumbnail: "",
    description: "",
    gallery: [],
    movie: {
      name: "",
      synopsis: "",
      morals: [],
      discussion: "",
      impact: {
        participants: 0,
        response: "",
        discussionHeld: true,
      },
    },
    ngo: "",
  };
}

export function ActivitiesEditor({
  initialLocations,
  initialStatus = "PUBLISHED",
}: {
  initialLocations: ActivityLocation[];
  initialStatus?: string;
}) {
  const router = useRouter();
  const [locations, setLocations] = useState<ActivityLocation[]>(initialLocations);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const current = locations[active];

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/page-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: "our-activities",
        sections: { locations },
        status,
      }),
    });
    const data = (await res.json()) as { error?: string };
    setSaving(false);
    if (!res.ok) {
      setMessage(data.error ?? "Save failed.");
      return;
    }
    setMessage("Our Activities saved. Live pages update on next load.");
    router.refresh();
  }

  function patchLocation(patch: Partial<ActivityLocation>) {
    setLocations((rows) =>
      rows.map((row, i) => (i === active ? { ...row, ...patch } : row)),
    );
  }

  function patchMovie(patch: Partial<ActivityLocation["movie"]>) {
    if (!current) return;
    patchLocation({ movie: { ...current.movie, ...patch } });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mist">
          Edit screening locations shown on /our-activities
        </p>
        <div className="flex items-center gap-3">
          <select
            className="h-10 rounded-lg border border-warm/12 bg-ink-soft px-3 text-sm text-warm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {CONTENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save activities"}
          </Button>
        </div>
      </div>

      {message ? (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.startsWith("Our Activities")
              ? "border-gold/30 bg-gold/10 text-gold"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {message}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Locations</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setLocations((rows) => [...rows, emptyLocation()]);
                setActive(locations.length);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {locations.map((loc, i) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setActive(i)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  i === active
                    ? "bg-gold/15 text-gold"
                    : "text-cloud hover:bg-charcoal"
                }`}
              >
                <span className="truncate">{loc.title || loc.slug}</span>
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-2 text-mist hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocations((rows) => rows.filter((_, idx) => idx !== i));
                    setActive((a) => Math.max(0, a === i ? a - 1 : a > i ? a - 1 : a));
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        {current ? (
          <Card>
            <CardHeader>
              <CardTitle>{current.title || "Location details"}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={current.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    patchLocation({
                      title,
                      slug: current.slug || slugify(title),
                    });
                  }}
                />
              </label>
              <label className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={current.slug}
                  onChange={(e) => patchLocation({ slug: e.target.value })}
                />
              </label>
              <label className="space-y-2">
                <Label>Location / city</Label>
                <Input
                  value={current.location}
                  onChange={(e) => patchLocation({ location: e.target.value })}
                />
              </label>
              <label className="space-y-2">
                <Label>NGO partner</Label>
                <Input
                  value={current.ngo ?? ""}
                  onChange={(e) => patchLocation({ ngo: e.target.value })}
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <Label>Thumbnail URL</Label>
                <Input
                  value={current.thumbnail}
                  onChange={(e) => patchLocation({ thumbnail: e.target.value })}
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={current.description}
                  onChange={(e) => patchLocation({ description: e.target.value })}
                />
              </label>

              <div className="sm:col-span-2 border-t border-warm/10 pt-4">
                <p className="mb-3 text-sm font-medium text-warm">Movie report</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <Label>Movie name</Label>
                    <Input
                      value={current.movie.name}
                      onChange={(e) => patchMovie({ name: e.target.value })}
                    />
                  </label>
                  <label className="space-y-2">
                    <Label>Screening date</Label>
                    <Input
                      value={current.movie.screeningDate ?? ""}
                      onChange={(e) => patchMovie({ screeningDate: e.target.value })}
                    />
                  </label>
                  <label className="space-y-2 sm:col-span-2">
                    <Label>Synopsis</Label>
                    <Textarea
                      rows={3}
                      value={current.movie.synopsis}
                      onChange={(e) => patchMovie({ synopsis: e.target.value })}
                    />
                  </label>
                  <label className="space-y-2 sm:col-span-2">
                    <Label>Morals (one per line)</Label>
                    <Textarea
                      rows={4}
                      value={current.movie.morals.join("\n")}
                      onChange={(e) =>
                        patchMovie({
                          morals: e.target.value
                            .split("\n")
                            .map((x) => x.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </label>
                  <label className="space-y-2 sm:col-span-2">
                    <Label>Discussion notes</Label>
                    <Textarea
                      rows={3}
                      value={current.movie.discussion ?? ""}
                      onChange={(e) => patchMovie({ discussion: e.target.value })}
                    />
                  </label>
                  <label className="space-y-2">
                    <Label>Participants</Label>
                    <Input
                      type="number"
                      value={current.movie.impact?.participants ?? 0}
                      onChange={(e) =>
                        patchMovie({
                          impact: {
                            participants: Number(e.target.value) || 0,
                            response: current.movie.impact?.response ?? "",
                            discussionHeld:
                              current.movie.impact?.discussionHeld ?? true,
                          },
                        })
                      }
                    />
                  </label>
                  <label className="space-y-2">
                    <Label>Impact response</Label>
                    <Input
                      value={current.movie.impact?.response ?? ""}
                      onChange={(e) =>
                        patchMovie({
                          impact: {
                            participants:
                              current.movie.impact?.participants ?? 0,
                            response: e.target.value,
                            discussionHeld:
                              current.movie.impact?.discussionHeld ?? true,
                          },
                        })
                      }
                    />
                  </label>
                  <label className="space-y-2 sm:col-span-2">
                    <Label>Poster URL</Label>
                    <Input
                      value={current.movie.poster ?? ""}
                      onChange={(e) => patchMovie({ poster: e.target.value })}
                    />
                  </label>
                </div>
              </div>

              <label className="space-y-2 sm:col-span-2">
                <Label>
                  Gallery images (one per line: src | alt | caption)
                </Label>
                <Textarea
                  rows={6}
                  value={(current.gallery ?? [])
                    .map(
                      (g) =>
                        `${g.src}${g.alt ? ` | ${g.alt}` : ""}${
                          g.caption ? ` | ${g.caption}` : ""
                        }`,
                    )
                    .join("\n")}
                  onChange={(e) => {
                    const gallery = e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line, idx) => {
                        const [src, alt, caption] = line
                          .split("|")
                          .map((x) => x.trim());
                        return {
                          id: `img-${current.id}-${idx}`,
                          src,
                          alt: alt || current.title,
                          caption: caption || undefined,
                          span: "regular" as const,
                        };
                      });
                    patchLocation({ gallery });
                  }}
                />
              </label>
            </CardContent>
          </Card>
        ) : (
          <p className="text-sm text-mist">Add a location to begin.</p>
        )}
      </div>
    </div>
  );
}
