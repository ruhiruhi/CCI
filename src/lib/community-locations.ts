export type CommunityCategory = "volunteers" | "screenings" | "cities";

export type VolunteerLocation = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  role: string;
  image?: string;
  contact?: string;
};

export type ScreeningLocation = {
  id: string;
  title: string;
  venue: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  date: string;
  upcoming: string;
  photo?: string;
};

export type CityLocation = {
  id: string;
  city: string;
  lat: number;
  lng: number;
  volunteers: number;
  screenings: number;
  partners: number;
};

export type CommunityLocationsData = {
  volunteers: VolunteerLocation[];
  screenings: ScreeningLocation[];
  cities: CityLocation[];
};

export const COMMUNITY_CATEGORIES: {
  id: CommunityCategory;
  label: string;
}[] = [
  { id: "volunteers", label: "Volunteer" },
  { id: "screenings", label: "Screening" },
  { id: "cities", label: "Cities" },
];

export async function loadCommunityLocations(): Promise<CommunityLocationsData> {
  const res = await fetch("/data/locations.json", { cache: "force-cache" });
  if (!res.ok) {
    throw new Error("Could not load community locations.");
  }
  return res.json() as Promise<CommunityLocationsData>;
}

export function formatScreeningDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
