"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {
  COMMUNITY_CATEGORIES,
  formatScreeningDate,
  loadCommunityLocations,
  type CityLocation,
  type CommunityCategory,
  type CommunityLocationsData,
  type ScreeningLocation,
  type VolunteerLocation,
} from "@/lib/community-locations";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Input } from "@/components/ui/input";
import { DAY2_IMAGES } from "@/lib/data";
import { cn } from "@/lib/utils";

const INDIA_CENTER: [number, number] = [22.5, 79.0];
const DEFAULT_ZOOM = 5;
const PLACEHOLDER_AVATAR = DAY2_IMAGES.communityPortrait;

type LocationCard = {
  id: string;
  name: string;
  membershipType: string;
  city: string;
  year: string;
  image?: string;
  detail?: string;
};

function goldPinIcon() {
  return L.divIcon({
    className: "cci-map-pin",
    html: `<span class="cci-map-pin__dot"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

function volunteerPopup(v: VolunteerLocation): string {
  const img = v.image
    ? `<img src="${v.image}" alt="" class="cci-popup__img" loading="lazy" />`
    : "";
  return `
    <div class="cci-popup">
      ${img}
      <p class="cci-popup__title">${v.name}</p>
      <p class="cci-popup__meta">${v.city}</p>
      <p class="cci-popup__body">${v.role}</p>
    </div>
  `;
}

function screeningPopup(s: ScreeningLocation): string {
  const img = s.photo
    ? `<img src="${s.photo}" alt="" class="cci-popup__img" loading="lazy" />`
    : "";
  return `
    <div class="cci-popup">
      ${img}
      <p class="cci-popup__title">${s.venue}</p>
      <p class="cci-popup__meta">${s.address}</p>
      <p class="cci-popup__body"><strong>${s.title}</strong><br/>${s.upcoming}</p>
      <p class="cci-popup__meta">${formatScreeningDate(s.date)}</p>
    </div>
  `;
}

function cityPopup(c: CityLocation): string {
  return `
    <div class="cci-popup">
      <p class="cci-popup__title">${c.city}</p>
      <p class="cci-popup__body">
        ${c.volunteers} volunteers<br/>
        ${c.screenings} screenings<br/>
        ${c.partners} partner institutions
      </p>
    </div>
  `;
}

function yearFromIso(iso: string): string {
  try {
    const y = new Date(iso).getFullYear();
    return Number.isFinite(y) ? String(y) : "";
  } catch {
    return "";
  }
}

function cardsForCategory(
  category: CommunityCategory,
  data: CommunityLocationsData,
): LocationCard[] {
  if (category === "volunteers") {
    return data.volunteers.map((v) => ({
      id: v.id,
      name: v.name,
      membershipType: v.role,
      city: v.city,
      year: "",
      image: v.image,
    }));
  }
  if (category === "screenings") {
    return data.screenings.map((s) => ({
      id: s.id,
      name: s.venue,
      membershipType: "Screening",
      city: s.city,
      year: yearFromIso(s.date),
      image: s.photo,
      detail: formatScreeningDate(s.date),
    }));
  }
  return data.cities.map((c) => ({
    id: c.id,
    name: c.city,
    membershipType: "Partners / City",
    city: c.city,
    year: "",
    detail: `${c.volunteers} volunteers · ${c.screenings} screenings`,
  }));
}

function ClusterLayer({
  category,
  data,
}: {
  category: CommunityCategory;
  data: CommunityLocationsData;
}) {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
      clusterRef.current = null;
    }

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 48,
      spiderfyOnMaxZoom: true,
      animate: true,
      iconCreateFunction(cl) {
        const count = cl.getChildCount();
        return L.divIcon({
          html: `<span class="cci-cluster">${count}</span>`,
          className: "cci-cluster-wrap",
          iconSize: L.point(40, 40),
        });
      },
    });

    const icon = goldPinIcon();
    const bounds: L.LatLngExpression[] = [];

    if (category === "volunteers") {
      data.volunteers.forEach((v) => {
        const marker = L.marker([v.lat, v.lng], { icon }).bindPopup(
          volunteerPopup(v),
          { maxWidth: 260, className: "cci-leaflet-popup" },
        );
        cluster.addLayer(marker);
        bounds.push([v.lat, v.lng]);
      });
    } else if (category === "screenings") {
      data.screenings.forEach((s) => {
        const marker = L.marker([s.lat, s.lng], { icon }).bindPopup(
          screeningPopup(s),
          { maxWidth: 280, className: "cci-leaflet-popup" },
        );
        cluster.addLayer(marker);
        bounds.push([s.lat, s.lng]);
      });
    } else {
      data.cities.forEach((c) => {
        const marker = L.marker([c.lat, c.lng], { icon }).bindPopup(
          cityPopup(c),
          { maxWidth: 240, className: "cci-leaflet-popup" },
        );
        cluster.addLayer(marker);
        bounds.push([c.lat, c.lng]);
      });
    }

    map.addLayer(cluster);
    clusterRef.current = cluster;

    if (bounds.length > 1) {
      map.flyToBounds(L.latLngBounds(bounds), {
        padding: [48, 48],
        duration: 0.85,
        maxZoom: 7,
      });
    } else if (bounds.length === 1) {
      map.flyTo(bounds[0], 7, { duration: 0.85 });
    }

    return () => {
      map.removeLayer(cluster);
      clusterRef.current = null;
    };
  }, [category, data, map]);

  return null;
}

function LocationList({
  category,
  data,
}: {
  category: CommunityCategory;
  data: CommunityLocationsData;
}) {
  const [nameQuery, setNameQuery] = useState("");
  const [membershipType, setMembershipType] = useState("all");
  const [city, setCity] = useState("all");
  const [year, setYear] = useState("all");

  const cards = useMemo(() => cardsForCategory(category, data), [category, data]);

  useEffect(() => {
    setNameQuery("");
    setMembershipType("all");
    setCity("all");
    setYear("all");
  }, [category]);

  const membershipOptions = useMemo(
    () =>
      Array.from(new Set(cards.map((c) => c.membershipType).filter(Boolean))).sort(),
    [cards],
  );

  const cityOptions = useMemo(
    () => Array.from(new Set(cards.map((c) => c.city).filter(Boolean))).sort(),
    [cards],
  );

  const yearOptions = useMemo(
    () => Array.from(new Set(cards.map((c) => c.year).filter(Boolean))).sort().reverse(),
    [cards],
  );

  const filtered = useMemo(() => {
    const q = nameQuery.trim().toLowerCase();
    return cards.filter((card) => {
      const matchesName = !q || card.name.toLowerCase().includes(q);
      const matchesType =
        membershipType === "all" || card.membershipType === membershipType;
      const matchesCity = city === "all" || card.city === city;
      const matchesYear = year === "all" || card.year === year;
      return matchesName && matchesType && matchesCity && matchesYear;
    });
  }, [cards, city, membershipType, nameQuery, year]);

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-mist">
            Name
          </span>
          <Input
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            placeholder="Search by name"
            className="h-12 rounded-full border-warm/15 bg-warm/5"
          />
        </label>

        <FilterSelect
          label="Membership Type"
          value={membershipType}
          onChange={setMembershipType}
          options={[
            { value: "all", label: "All types" },
            ...membershipOptions.map((item) => ({ value: item, label: item })),
          ]}
        />

        <FilterSelect
          label="City"
          value={city}
          onChange={setCity}
          options={[
            { value: "all", label: "All cities" },
            ...cityOptions.map((item) => ({ value: item, label: item })),
          ]}
        />

        <FilterSelect
          label="Year"
          value={year}
          onChange={setYear}
          options={[
            { value: "all", label: "All years" },
            ...yearOptions.map((item) => ({ value: item, label: item })),
          ]}
        />
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((card) => (
          <li
            key={card.id}
            className="overflow-hidden rounded-2xl border border-warm/10 bg-charcoal/40 transition-colors hover:border-gold/30 hover:bg-charcoal"
          >
            <div className="relative aspect-[4/3] bg-ink/40">
              <Image
                src={card.image || PLACEHOLDER_AVATAR}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-warm">{card.name}</p>
              <p className="mt-1 text-xs text-gold-soft">{card.membershipType}</p>
              <p className="mt-1 text-xs text-mist">
                {card.city}
                {card.year ? ` · ${card.year}` : ""}
              </p>
              {card.detail ? (
                <p className="mt-2 text-xs text-cloud/70">{card.detail}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-mist">
          No locations match your filters.
        </p>
      )}
    </div>
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

export function FindOurCommunity() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [category, setCategory] = useState<CommunityCategory>("volunteers");
  const [data, setData] = useState<CommunityLocationsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    loadCommunityLocations()
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load community locations.");
      });
    return () => {
      cancelled = true;
    };
  }, [inView]);

  return (
    <section ref={sectionRef} className="section-pad">
      <div className="shell">
        <SectionHeading
          kicker="Across India"
          titleLines={["Stories connecting communities", "across India."]}
          intro="Discover CCI chapters, volunteers, screening locations, bringing the power of cinema to communities nationwide."
          align="center"
        />

        <Reveal delay={0.1}>
          <div className="content-after-heading mx-auto flex max-w-full justify-center">
            <div
              role="tablist"
              aria-label="Community map categories"
              className="flex max-w-full gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {COMMUNITY_CATEGORIES.map((c) => {
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    data-cursor="hover"
                    onClick={() => setCategory(c.id)}
                    className={cn(
                      "shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300",
                      active
                        ? "border-gold bg-gold text-warm shadow-[var(--shadow-gold)]"
                        : "border-warm/20 bg-transparent text-cloud hover:border-gold/40 hover:text-warm",
                    )}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-8">
            <div className="cci-community-map relative h-[500px] cursor-pointer overflow-hidden rounded-[20px] border border-warm/10 bg-charcoal/50 shadow-[var(--shadow-soft)] md:h-[600px] lg:h-[700px]">
              {!inView || !data ? (
                <div className="absolute inset-0 grid place-items-center text-sm text-mist">
                  {error || "Loading map…"}
                </div>
              ) : (
                <MapContainer
                  center={INDIA_CENTER}
                  zoom={DEFAULT_ZOOM}
                  scrollWheelZoom
                  className="h-full w-full cursor-pointer"
                  style={{ background: "#1a1008", cursor: "pointer" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    subdomains="abcd"
                    maxZoom={18}
                  />
                  <ClusterLayer category={category} data={data} />
                </MapContainer>
              )}

              <div className="pointer-events-none absolute left-4 top-4 z-[1000] rounded-2xl border border-warm/15 bg-ink/55 px-4 py-2 text-xs text-cloud backdrop-blur-md md:left-5 md:top-5">
                {category === "volunteers" && "Volunteer locations"}
                {category === "screenings" && "Screening venues"}
                {category === "cities" && "Partner cities"}
              </div>
            </div>

            {data ? <LocationList category={category} data={data} /> : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
