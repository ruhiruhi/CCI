"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Bookmark, Clock, Search } from "lucide-react";
import { ARTICLES, img, type Article } from "@/lib/data";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Craft", "Impact", "Voices", "Guides", "Bookmarked"] as const;
type Category = (typeof CATEGORIES)[number];

const STORAGE_KEY = "cci-bookmarks";

export function Magazine() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate saved bookmarks once on mount
      if (raw) setBookmarks(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks, hydrated]);

  const toggleBookmark = (slug: string) =>
    setBookmarks((b) =>
      b.includes(slug) ? b.filter((s) => s !== slug) : [...b, slug],
    );

  const featured = ARTICLES.find((a) => a.featured) ?? ARTICLES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter((a) => a.slug !== featured.slug).filter((a) => {
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      const matchesCat =
        category === "All"
          ? true
          : category === "Bookmarked"
            ? bookmarks.includes(a.slug)
            : a.category === category;
      return matchesQuery && matchesCat;
    });
  }, [query, category, bookmarks, featured.slug]);

  return (
    <div>
      {/* Featured article */}
      <article className="group relative grid overflow-hidden rounded-3xl border border-warm/10 lg:grid-cols-2">
        <div className="cine-frame relative aspect-[16/11] overflow-hidden lg:aspect-auto">
          <Image
            src={img(featured.image, 1400)}
            alt={featured.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-medium text-ink">
              Featured
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-gold">
              {featured.category}
            </span>
          </div>
          <h3 className="font-display text-3xl font-light leading-tight tracking-tight text-warm md:text-4xl">
            {featured.title}
          </h3>
          <p className="max-w-md text-cloud/80">{featured.excerpt}</p>
          <div className="flex items-center gap-5 text-sm text-mist">
            <span>{featured.author}</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {featured.readingTime} min read
            </span>
            <span>{featured.date}</span>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-warm">
              Read the story
              <ArrowUpRight className="h-4 w-4 text-gold" />
            </span>
            <BookmarkButton
              active={bookmarks.includes(featured.slug)}
              onClick={() => toggleBookmark(featured.slug)}
            />
          </div>
        </div>
      </article>

      {/* Controls */}
      <div className="mt-12 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              data-cursor="hover"
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-all duration-300",
                category === c
                  ? "border-gold bg-gold text-ink"
                  : "border-warm/15 text-cloud hover:border-warm/40 hover:text-warm",
              )}
            >
              {c}
              {c === "Bookmarked" && bookmarks.length > 0 && (
                <span className="ml-1.5 text-xs opacity-70">
                  {bookmarks.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <label className="relative w-full lg:w-72">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="h-12 w-full rounded-full border border-warm/15 bg-ink/60 pl-11 pr-4 text-sm text-warm placeholder:text-ash outline-none transition-colors focus:border-gold/60"
          />
        </label>
      </div>

      {/* Grid */}
      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((a) => (
            <ArticleCard
              key={a.slug}
              article={a}
              bookmarked={bookmarks.includes(a.slug)}
              onBookmark={() => toggleBookmark(a.slug)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-mist">
          No articles match your search yet — try another keyword or category.
        </p>
      )}
    </div>
  );
}

function ArticleCard({
  article,
  bookmarked,
  onBookmark,
}: {
  article: Article;
  bookmarked: boolean;
  onBookmark: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-warm/10 bg-charcoal/30 transition-colors duration-500 hover:bg-charcoal"
    >
      <div className="cine-frame relative aspect-[16/10] overflow-hidden">
        <Image
          src={img(article.image, 800)}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <button
          onClick={onBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark article"}
          data-cursor="hover"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-ink/70 backdrop-blur-sm transition-colors hover:bg-ink"
        >
          <Bookmark
            className={cn(
              "h-4 w-4 transition-colors",
              bookmarked ? "fill-gold text-gold" : "text-warm",
            )}
          />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs uppercase tracking-[0.2em] text-gold">
          {article.category}
        </span>
        <h3 className="mt-3 text-xl font-medium leading-snug text-warm">
          {article.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-cloud/70">{article.excerpt}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-mist">
          <span>{article.author}</span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {article.readingTime} min
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function BookmarkButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={active ? "Remove bookmark" : "Bookmark article"}
      data-cursor="hover"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
        active
          ? "border-gold/50 text-gold"
          : "border-warm/15 text-cloud hover:border-warm/40",
      )}
    >
      <Bookmark className={cn("h-4 w-4", active && "fill-gold")} />
      {active ? "Saved" : "Save"}
    </button>
  );
}
