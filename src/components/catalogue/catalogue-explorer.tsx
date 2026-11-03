"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowUpRight, Film, Search, X } from "lucide-react";
import { CatalogueCategories } from "@/components/catalogue/catalogue-categories";
import {
  getCategoryTitle,
  getTrackTitle,
  type CatalogueCategory,
  type CatalogueFilm,
  type ScreeningTrack,
} from "@/lib/catalogue";
import { DAY1_IMAGES, LOCAL_IMAGES, img } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const POSTER_PLACEHOLDERS = [
  DAY1_IMAGES.audienceAttentive,
  LOCAL_IMAGES.classroomScreening,
  LOCAL_IMAGES.studentFilmmakers,
  LOCAL_IMAGES.heroScreening,
] as const;

const ALL = "all";
const INITIAL_VISIBLE = 6;

type CatalogueExplorerProps = {
  films: CatalogueFilm[];
  categories: CatalogueCategory[];
  tracks: ScreeningTrack[];
};

type FilmWithSortMeta = CatalogueFilm & {
  year?: number | string;
  createdAt?: string | Date;
};

function posterForFilm(slug: string) {
  const hash = slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return POSTER_PLACEHOLDERS[hash % POSTER_PLACEHOLDERS.length];
}

function filmSortKey(film: FilmWithSortMeta, indexFromEnd: number): number {
  if (typeof film.year === "number" && Number.isFinite(film.year)) {
    return film.year;
  }
  if (typeof film.year === "string" && film.year.trim()) {
    const parsed = Number.parseInt(film.year, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  if (film.createdAt) {
    const ts = new Date(film.createdAt).getTime();
    if (Number.isFinite(ts)) return ts;
  }
  // No date fields — preserve reverse catalogue order via index from end.
  return indexFromEnd;
}

function sortFilmsNewestFirst(films: CatalogueFilm[]): CatalogueFilm[] {
  const withIndex = films.map((film, index) => ({
    film,
    indexFromEnd: films.length - index,
  }));

  return withIndex
    .sort((a, b) => {
      const keyA = filmSortKey(a.film as FilmWithSortMeta, a.indexFromEnd);
      const keyB = filmSortKey(b.film as FilmWithSortMeta, b.indexFromEnd);
      if (keyB !== keyA) return keyB - keyA;
      return b.indexFromEnd - a.indexFromEnd;
    })
    .map((item) => item.film);
}

export function CatalogueExplorer({ films, categories, tracks }: CatalogueExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [audience, setAudience] = useState(ALL);
  const [language, setLanguage] = useState(ALL);
  const [theme, setTheme] = useState(ALL);
  const [activeFilm, setActiveFilm] = useState<CatalogueFilm | null>(null);

  const audiences = useMemo(
    () =>
      Array.from(
        new Set(
          films.flatMap((film) =>
            film.audience.split(",").map((item) => item.trim()),
          ),
        ),
      ).sort(),
    [films],
  );

  const languages = useMemo(
    () => Array.from(new Set(films.map((film) => film.language))).sort(),
    [films],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const matches = films.filter((film) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          film.title,
          film.synopsis,
          film.audience,
          film.impact,
          getCategoryTitle(film.categorySlug, categories),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesCategory = category === ALL || film.categorySlug === category;
      const matchesAudience =
        audience === ALL || film.audience.toLowerCase().includes(audience.toLowerCase());
      const matchesLanguage = language === ALL || film.language === language;
      const matchesTheme = theme === ALL || film.trackSlugs.includes(theme);

      return matchesQuery && matchesCategory && matchesAudience && matchesLanguage && matchesTheme;
    });

    return sortFilmsNewestFirst(matches);
  }, [audience, categories, category, films, language, query, theme]);

  const filtersAreDefault =
    !query.trim() &&
    category === ALL &&
    audience === ALL &&
    language === ALL &&
    theme === ALL;

  const visibleFilms = filtersAreDefault
    ? filtered.slice(0, INITIAL_VISIBLE)
    : filtered;

  function handleCategorySelect(slug: string) {
    setCategory((current) => (current === slug ? ALL : slug));
    document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <div id="categories" className="scroll-mt-28">
        <CatalogueCategories
          categories={categories}
          activeSlug={category === ALL ? undefined : category}
          onSelect={handleCategorySelect}
        />
      </div>

      <div id="catalogue" className="mt-8 scroll-mt-28">
        <div className="card-modern rounded-[1.75rem] p-5 md:p-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-mist">
                Search Films
              </span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="By Name"
                  className="h-12 rounded-full border-warm/15 bg-warm/5 pl-11"
                />
              </div>
            </label>

            <FilterSelect
              label="Category"
              value={category}
              onChange={setCategory}
              options={[
                { value: ALL, label: "All categories" },
                ...categories.map((item) => ({ value: item.slug, label: item.title })),
              ]}
            />
            <FilterSelect
              label="Audience"
              value={audience}
              onChange={setAudience}
              options={[
                { value: ALL, label: "All audiences" },
                ...audiences.map((item) => ({ value: item, label: item })),
              ]}
            />
            <FilterSelect
              label="Language"
              value={language}
              onChange={setLanguage}
              options={[
                { value: ALL, label: "All languages" },
                ...languages.map((item) => ({ value: item, label: item })),
              ]}
            />
            <FilterSelect
              label="Theme"
              value={theme}
              onChange={setTheme}
              options={[
                { value: ALL, label: "All themes" },
                ...tracks.map((item) => ({ value: item.slug, label: item.title })),
              ]}
            />
          </div>

          <p className="mt-5 text-sm text-mist">
            Showing {visibleFilms.length} of {films.length} films
            {filtersAreDefault && filtered.length > INITIAL_VISIBLE
              ? ` (first ${INITIAL_VISIBLE} — search or filter to see all)`
              : ""}
          </p>
        </div>

        <StaggerGroup className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3" stagger={0.05}>
          {visibleFilms.map((film) => (
            <StaggerItem key={film.slug}>
              <article className="card-modern group flex h-full flex-col overflow-hidden rounded-[1.5rem] transition duration-500 hover:border-gold/25 hover:shadow-[var(--shadow-medium)]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={img(film.poster ?? posterForFilm(film.slug), 900)}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="cci-image object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-gold/30 bg-ink/60 text-gold backdrop-blur-sm">
                    <Film className="h-4 w-4" />
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
                    {getCategoryTitle(film.categorySlug, categories)}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-light leading-tight text-warm">
                    {film.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cloud/85">{film.synopsis}</p>

                  <div className="mt-5 space-y-3 text-sm">
                    <p>
                      <span className="font-medium text-warm">Target audience:</span>{" "}
                      <span className="text-cloud/80">{film.audience}</span>
                    </p>
                    <p>
                      <span className="font-medium text-warm">Expected impact:</span>{" "}
                      <span className="text-cloud/80">{film.impact}</span>
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveFilm(film)}
                      data-cursor="hover"
                      className="btn-cci-secondary h-11 px-5 text-sm"
                    >
                      View Details
                    </button>
                    <Link
                      href={`/contact?interest=Screening%20Request&film=${film.slug}`}
                      className="btn-cci-primary group/btn inline-flex h-11 items-center gap-2 px-5 text-sm"
                    >
                      Request Screening
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {visibleFilms.length === 0 && (
          <div className="card-modern mt-10 rounded-[1.5rem] p-10 text-center">
            <p className="font-display text-2xl text-warm">No films match your filters.</p>
            <p className="mt-3 text-cloud/80">
              Try clearing a filter or searching with a broader term.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeFilm && (
          <motion.div
            className="fixed inset-0 z-[160] flex items-end justify-center bg-ink/80 p-4 backdrop-blur-md sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveFilm(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="catalogue-film-title"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="card-modern relative max-h-[88svh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] p-6 md:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close details"
                onClick={() => setActiveFilm(null)}
                className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-warm/15 text-warm"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
                {getCategoryTitle(activeFilm.categorySlug, categories)}
              </p>
              <h3 id="catalogue-film-title" className="mt-2 font-display text-3xl font-light text-warm">
                {activeFilm.title}
              </h3>
              <p className="mt-4 text-cloud/85">{activeFilm.synopsis}</p>

              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-medium text-warm">Target audience</dt>
                  <dd className="mt-1 text-cloud/80">{activeFilm.audience}</dd>
                </div>
                <div>
                  <dt className="font-medium text-warm">Expected impact</dt>
                  <dd className="mt-1 text-cloud/80">{activeFilm.impact}</dd>
                </div>
                <div>
                  <dt className="font-medium text-warm">Language</dt>
                  <dd className="mt-1 text-cloud/80">{activeFilm.language}</dd>
                </div>
                <div>
                  <dt className="font-medium text-warm">Suggested tracks</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {activeFilm.trackSlugs.map((trackSlug) => (
                      <span
                        key={trackSlug}
                        className="rounded-full border border-warm/15 bg-warm/5 px-3 py-1 text-xs text-cloud/85"
                      >
                        {getTrackTitle(trackSlug, tracks)}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/contact?interest=Screening%20Request&film=${activeFilm.slug}`}
                  className="btn-cci-primary group h-12 px-6"
                >
                  Request Screening
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-mist">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-12 w-full rounded-full border border-warm/15 bg-warm/5 px-4 text-sm text-warm",
          "focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30",
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-ink text-warm">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
