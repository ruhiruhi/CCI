"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import type { CatalogueContent, CatalogueFilm, CatalogueCategory } from "@/lib/catalogue";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTENT_STATUSES } from "@/lib/admin-content";

export function CatalogueEditor({
  initial,
  initialStatus = "PUBLISHED",
}: {
  initial: CatalogueContent;
  initialStatus?: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState<CatalogueContent>(initial);
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<"hero" | "categories" | "films" | "tracks" | "timeline">(
    "hero",
  );

  const filmCount = useMemo(() => content.films.length, [content.films.length]);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/page-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: "catalogue",
        sections: content,
        status,
      }),
    });
    const data = (await res.json()) as { error?: string };
    setSaving(false);
    if (!res.ok) {
      setMessage(data.error ?? "Save failed.");
      return;
    }
    setMessage("Catalogue saved. Live /catalogue updates on next load.");
    router.refresh();
  }

  function updateCategory(i: number, patch: Partial<CatalogueCategory>) {
    setContent((c) => ({
      ...c,
      categories: c.categories.map((row, idx) =>
        idx === i ? { ...row, ...patch } : row,
      ),
    }));
  }

  function updateFilm(i: number, patch: Partial<CatalogueFilm>) {
    setContent((c) => ({
      ...c,
      films: c.films.map((row, idx) => (idx === i ? { ...row, ...patch } : row)),
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["hero", "Hero"],
              ["categories", "Categories"],
              ["films", `Films (${filmCount})`],
              ["tracks", "Tracks"],
              ["timeline", "Timeline"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                tab === key
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-warm/15 text-cloud hover:border-warm/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
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
            {saving ? "Saving…" : "Save catalogue"}
          </Button>
        </div>
      </div>

      {message ? (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.startsWith("Catalogue")
              ? "border-gold/30 bg-gold/10 text-gold"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {message}
        </p>
      ) : null}

      {tab === "hero" ? (
        <Card>
          <CardHeader>
            <CardTitle>Hero</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <label className="space-y-2">
              <Label>Kicker</Label>
              <Input
                value={content.hero.kicker}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    hero: { ...c.hero, kicker: e.target.value },
                  }))
                }
              />
            </label>
            <label className="space-y-2">
              <Label>Title lines (one per line)</Label>
              <Textarea
                rows={3}
                value={content.hero.titleLines.join("\n")}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    hero: {
                      ...c.hero,
                      titleLines: e.target.value.split("\n").filter(Boolean),
                    },
                  }))
                }
              />
            </label>
            <label className="space-y-2">
              <Label>Subtitle</Label>
              <Textarea
                rows={3}
                value={content.hero.subtitle}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    hero: { ...c.hero, subtitle: e.target.value },
                  }))
                }
              />
            </label>
            <label className="space-y-2">
              <Label>Hero image URL</Label>
              <Input
                value={content.hero.image}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    hero: { ...c.hero, image: e.target.value },
                  }))
                }
              />
            </label>
          </CardContent>
        </Card>
      ) : null}

      {tab === "categories" ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categories</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setContent((c) => ({
                  ...c,
                  categories: [
                    ...c.categories,
                    {
                      slug: `category-${c.categories.length + 1}`,
                      title: "New category",
                      description: "",
                      filmCount: 0,
                    },
                  ],
                }))
              }
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.categories.map((cat, i) => (
              <div key={`${cat.slug}-${i}`} className="space-y-3 rounded-xl border border-warm/10 p-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-mist hover:text-red-400"
                    onClick={() =>
                      setContent((c) => ({
                        ...c,
                        categories: c.categories.filter((_, idx) => idx !== i),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <Label>Slug</Label>
                    <Input value={cat.slug} onChange={(e) => updateCategory(i, { slug: e.target.value })} />
                  </label>
                  <label className="space-y-1.5">
                    <Label>Film count</Label>
                    <Input
                      type="number"
                      value={cat.filmCount}
                      onChange={(e) =>
                        updateCategory(i, { filmCount: Number(e.target.value) || 0 })
                      }
                    />
                  </label>
                  <label className="space-y-1.5 sm:col-span-2">
                    <Label>Title</Label>
                    <Input value={cat.title} onChange={(e) => updateCategory(i, { title: e.target.value })} />
                  </label>
                  <label className="space-y-1.5 sm:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={2}
                      value={cat.description}
                      onChange={(e) => updateCategory(i, { description: e.target.value })}
                    />
                  </label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {tab === "films" ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Films</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setContent((c) => ({
                  ...c,
                  films: [
                    ...c.films,
                    {
                      slug: `film-${c.films.length + 1}`,
                      title: "New film",
                      synopsis: "",
                      audience: "",
                      impact: "",
                      categorySlug: c.categories[0]?.slug ?? "",
                      trackSlugs: [],
                      language: "Hindi / English",
                      poster: "",
                    },
                  ],
                }))
              }
            >
              <Plus className="h-4 w-4" /> Add film
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.films.map((film, i) => (
              <div key={`${film.slug}-${i}`} className="space-y-3 rounded-xl border border-warm/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gold">{film.title || `Film ${i + 1}`}</p>
                  <button
                    type="button"
                    className="text-mist hover:text-red-400"
                    onClick={() =>
                      setContent((c) => ({
                        ...c,
                        films: c.films.filter((_, idx) => idx !== i),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <Label>Title</Label>
                    <Input value={film.title} onChange={(e) => updateFilm(i, { title: e.target.value })} />
                  </label>
                  <label className="space-y-1.5">
                    <Label>Slug</Label>
                    <Input value={film.slug} onChange={(e) => updateFilm(i, { slug: e.target.value })} />
                  </label>
                  <label className="space-y-1.5">
                    <Label>Category slug</Label>
                    <Input
                      value={film.categorySlug}
                      onChange={(e) => updateFilm(i, { categorySlug: e.target.value })}
                    />
                  </label>
                  <label className="space-y-1.5">
                    <Label>Language</Label>
                    <Input
                      value={film.language}
                      onChange={(e) => updateFilm(i, { language: e.target.value })}
                    />
                  </label>
                  <label className="space-y-1.5 sm:col-span-2">
                    <Label>Synopsis</Label>
                    <Textarea
                      rows={2}
                      value={film.synopsis}
                      onChange={(e) => updateFilm(i, { synopsis: e.target.value })}
                    />
                  </label>
                  <label className="space-y-1.5">
                    <Label>Audience</Label>
                    <Input
                      value={film.audience}
                      onChange={(e) => updateFilm(i, { audience: e.target.value })}
                    />
                  </label>
                  <label className="space-y-1.5">
                    <Label>Poster URL</Label>
                    <Input
                      value={film.poster ?? ""}
                      onChange={(e) => updateFilm(i, { poster: e.target.value })}
                    />
                  </label>
                  <label className="space-y-1.5 sm:col-span-2">
                    <Label>Impact</Label>
                    <Textarea
                      rows={2}
                      value={film.impact}
                      onChange={(e) => updateFilm(i, { impact: e.target.value })}
                    />
                  </label>
                  <label className="space-y-1.5 sm:col-span-2">
                    <Label>Track slugs (comma-separated)</Label>
                    <Input
                      value={film.trackSlugs.join(", ")}
                      onChange={(e) =>
                        updateFilm(i, {
                          trackSlugs: e.target.value
                            .split(",")
                            .map((x) => x.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {tab === "tracks" ? (
        <Card>
          <CardHeader>
            <CardTitle>Screening tracks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.tracks.map((track, i) => (
              <div key={`${track.slug}-${i}`} className="grid gap-3 rounded-xl border border-warm/10 p-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <Label>Title</Label>
                  <Input
                    value={track.title}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        tracks: c.tracks.map((t, idx) =>
                          idx === i ? { ...t, title: e.target.value } : t,
                        ),
                      }))
                    }
                  />
                </label>
                <label className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input
                    value={track.slug}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        tracks: c.tracks.map((t, idx) =>
                          idx === i ? { ...t, slug: e.target.value } : t,
                        ),
                      }))
                    }
                  />
                </label>
                <label className="space-y-1.5 sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={2}
                    value={track.description}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        tracks: c.tracks.map((t, idx) =>
                          idx === i ? { ...t, description: e.target.value } : t,
                        ),
                      }))
                    }
                  />
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {tab === "timeline" ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Programme timeline</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setContent((c) => ({
                  ...c,
                  timeline: [
                    ...c.timeline,
                    { label: "Phase", title: "", body: "", weeks: "" },
                  ],
                }))
              }
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.timeline.map((phase, i) => (
              <div key={`phase-${i}`} className="space-y-3 rounded-xl border border-warm/10 p-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-mist hover:text-red-400"
                    onClick={() =>
                      setContent((c) => ({
                        ...c,
                        timeline: c.timeline.filter((_, idx) => idx !== i),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <Label>Label</Label>
                    <Input
                      value={phase.label}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          timeline: c.timeline.map((t, idx) =>
                            idx === i ? { ...t, label: e.target.value } : t,
                          ),
                        }))
                      }
                    />
                  </label>
                  <label className="space-y-1.5">
                    <Label>Weeks</Label>
                    <Input
                      value={phase.weeks}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          timeline: c.timeline.map((t, idx) =>
                            idx === i ? { ...t, weeks: e.target.value } : t,
                          ),
                        }))
                      }
                    />
                  </label>
                  <label className="space-y-1.5 sm:col-span-2">
                    <Label>Title</Label>
                    <Input
                      value={phase.title}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          timeline: c.timeline.map((t, idx) =>
                            idx === i ? { ...t, title: e.target.value } : t,
                          ),
                        }))
                      }
                    />
                  </label>
                  <label className="space-y-1.5 sm:col-span-2">
                    <Label>Body</Label>
                    <Textarea
                      rows={2}
                      value={phase.body}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          timeline: c.timeline.map((t, idx) =>
                            idx === i ? { ...t, body: e.target.value } : t,
                          ),
                        }))
                      }
                    />
                  </label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
