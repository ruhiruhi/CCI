/* ------------------------------------------------------------------ */
/*  Documentary & Parallel Cinema Catalogue — content layer            */
/*  Static seed data; replace via CMS PageContent (page: "catalogue")   */
/* ------------------------------------------------------------------ */

export type CatalogueStat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  detail: string;
};

export type CatalogueCategory = {
  slug: string;
  title: string;
  description: string;
  filmCount: number;
};

export type CatalogueFilm = {
  slug: string;
  title: string;
  synopsis: string;
  audience: string;
  impact: string;
  categorySlug: string;
  trackSlugs: string[];
  language: string;
  poster?: string;
};

export type ScreeningTrack = {
  slug: string;
  title: string;
  description: string;
  icon:
    | "children"
    | "empathy"
    | "police"
    | "health"
    | "labour"
    | "democracy"
    | "economy"
    | "gender"
    | "parallel"
    | "international";
};

export type CatalogueTimelinePhase = {
  label: string;
  title: string;
  body: string;
  weeks: string;
};

export type CatalogueContent = {
  hero: {
    kicker: string;
    titleLines: string[];
    subtitle: string;
    image: string;
  };
  stats: CatalogueStat[];
  categories: CatalogueCategory[];
  films: CatalogueFilm[];
  tracks: ScreeningTrack[];
  timeline: CatalogueTimelinePhase[];
};

export const CATALOGUE_CATEGORIES: CatalogueCategory[] = [
  {
    slug: "children-education",
    title: "Children, Education & School Dropouts",
    description:
      "Films that inspire belief in education, child rights, and pathways out of exclusion.",
    filmCount: 5,
  },
  {
    slug: "truck-drivers-livelihoods",
    title: "Truck Drivers, Workers & Livelihoods",
    description:
      "Stories that humanise transport workers and raise dignity-of-labour awareness.",
    filmCount: 4,
  },
  {
    slug: "police-justice-society",
    title: "Police, Justice & Society",
    description:
      "Documentaries on caste, democracy, identity, and institutional understanding.",
    filmCount: 4,
  },
  {
    slug: "healthcare-empathy",
    title: "Healthcare, Empathy & Human Care",
    description:
      "Patient-centred stories for hospitals, medical students, and care teams.",
    filmCount: 3,
  },
  {
    slug: "economy-development",
    title: "Economy, Development & Social Change",
    description:
      "Critical perspectives on inequality, displacement, and social conditioning.",
    filmCount: 3,
  },
  {
    slug: "gender-society",
    title: "Gender & Society",
    description:
      "Films for dialogue on gender equity, identity, and social norms.",
    filmCount: 0,
  },
  {
    slug: "indian-parallel-cinema",
    title: "Indian Parallel Cinema",
    description:
      "Landmark Indian films for classrooms, film societies, and cultural programmes.",
    filmCount: 0,
  },
  {
    slug: "international-documentary",
    title: "International Documentary Classics",
    description:
      "Global documentary cinema for comparative study and cross-cultural empathy.",
    filmCount: 0,
  },
];

export const CATALOGUE_FILMS: CatalogueFilm[] = [
  {
    slug: "the-price-of-free",
    title: "The Price of Free",
    synopsis:
      "Child labour and the rescue movement led by Kailash Satyarthi.",
    audience: "Children 14+, teachers, NGOs, parents",
    impact: "Inspires belief in education and child rights.",
    categorySlug: "children-education",
    trackSlugs: ["inspire-children", "build-empathy"],
    language: "English",
  },
  {
    slug: "caged-childhood",
    title: "Caged Childhood",
    synopsis: "Children trapped in labour instead of school.",
    audience: "Slum communities, parents",
    impact: "Promotes school enrolment and awareness.",
    categorySlug: "children-education",
    trackSlugs: ["inspire-children"],
    language: "Hindi",
  },
  {
    slug: "indias-migrant-children",
    title: "India's Migrant Children Growing Up Without School",
    synopsis: "Impact of migration on children's education.",
    audience: "Migrant families, NGOs",
    impact: "Highlights educational exclusion.",
    categorySlug: "children-education",
    trackSlugs: ["inspire-children", "economy-development"],
    language: "Hindi",
  },
  {
    slug: "children-of-the-pyre",
    title: "Children of the Pyre",
    synopsis: "Children surviving around Varanasi cremation ghats.",
    audience: "Senior students, social workers",
    impact: "Creates empathy and discussion on rehabilitation.",
    categorySlug: "children-education",
    trackSlugs: ["inspire-children", "build-empathy"],
    language: "Hindi",
  },
  {
    slug: "born-into-brothels",
    title: "Born into Brothels",
    synopsis:
      "Children from Kolkata's red-light district discover photography and learning.",
    audience: "Youth, NGOs, teachers",
    impact: "Shows how creativity can transform lives.",
    categorySlug: "children-education",
    trackSlugs: ["inspire-children", "build-empathy", "gender-society"],
    language: "English",
  },
  {
    slug: "life-on-wheels",
    title: "Life on Wheels",
    synopsis: "Daily struggles and sacrifices of truck drivers.",
    audience: "Truck drivers, police, logistics sector",
    impact: "Builds respect for transport workers.",
    categorySlug: "truck-drivers-livelihoods",
    trackSlugs: ["labour-livelihood"],
    language: "Hindi",
  },
  {
    slug: "fuelling-india",
    title: "Fuelling India",
    synopsis: "The trucking community that keeps India moving.",
    audience: "Students, transport workers",
    impact: "Dignity of labour.",
    categorySlug: "truck-drivers-livelihoods",
    trackSlugs: ["labour-livelihood", "economy-development"],
    language: "Hindi",
  },
  {
    slug: "truck-drivers-in-india",
    title: "Truck Drivers in India",
    synopsis: "Road documentary on long-haul truckers.",
    audience: "General audiences",
    impact: "Humanises invisible workers.",
    categorySlug: "truck-drivers-livelihoods",
    trackSlugs: ["labour-livelihood"],
    language: "Hindi",
  },
  {
    slug: "machines",
    title: "Machines",
    synopsis: "Factory workers inside industrial production systems.",
    audience: "Students, labour groups",
    impact: "Raises labour-rights awareness.",
    categorySlug: "truck-drivers-livelihoods",
    trackSlugs: ["labour-livelihood", "economy-development"],
    language: "Multilingual",
  },
  {
    slug: "jai-bhim-comrade",
    title: "Jai Bhim Comrade",
    synopsis: "Caste, justice and state institutions.",
    audience: "Police, civil servants, universities",
    impact: "Improves understanding of marginalised communities.",
    categorySlug: "police-justice-society",
    trackSlugs: ["police-public", "democracy-constitution"],
    language: "Marathi",
  },
  {
    slug: "reason",
    title: "Reason",
    synopsis: "Democracy, dissent and constitutional values.",
    audience: "Police, lawyers, students",
    impact: "Promotes critical thinking.",
    categorySlug: "police-justice-society",
    trackSlugs: ["police-public", "democracy-constitution"],
    language: "Multilingual",
  },
  {
    slug: "ram-ke-naam",
    title: "Ram Ke Naam",
    synopsis: "Identity politics and mass mobilisation.",
    audience: "Police, colleges",
    impact: "Understanding social conflict.",
    categorySlug: "police-justice-society",
    trackSlugs: ["police-public", "democracy-constitution"],
    language: "Hindi",
  },
  {
    slug: "india-untouched",
    title: "India Untouched",
    synopsis: "Continuing realities of caste discrimination.",
    audience: "Teachers, police, students",
    impact: "Challenges prejudice and stereotypes.",
    categorySlug: "police-justice-society",
    trackSlugs: ["police-public", "build-empathy"],
    language: "Multilingual",
  },
  {
    slug: "empathy-patient-care",
    title: "Empathy: The Human Connection to Patient Care",
    synopsis: "Patient experiences and healthcare empathy.",
    audience: "Doctors, nurses, hospitals",
    impact: "Improves patient-centred care.",
    categorySlug: "healthcare-empathy",
    trackSlugs: ["health-human-care", "build-empathy"],
    language: "English",
  },
  {
    slug: "extremis",
    title: "Extremis",
    synopsis: "Difficult end-of-life decisions in hospitals.",
    audience: "ICU staff, medical students",
    impact: "Deepens emotional understanding.",
    categorySlug: "healthcare-empathy",
    trackSlugs: ["health-human-care", "build-empathy"],
    language: "English",
  },
  {
    slug: "unrest",
    title: "Unrest",
    synopsis: "Life through the eyes of a chronically ill patient.",
    audience: "Healthcare professionals",
    impact: "Strengthens compassion.",
    categorySlug: "healthcare-empathy",
    trackSlugs: ["health-human-care"],
    language: "English",
  },
  {
    slug: "neros-guests",
    title: "Nero's Guests",
    synopsis: "Farmer suicides and agrarian distress.",
    audience: "Policy makers, students",
    impact: "Discussion on inequality and development.",
    categorySlug: "economy-development",
    trackSlugs: ["economy-development", "democracy-constitution"],
    language: "Marathi",
  },
  {
    slug: "a-narmada-diary",
    title: "A Narmada Diary",
    synopsis: "Development versus displacement.",
    audience: "Universities, administrators",
    impact: "Balanced view of development.",
    categorySlug: "economy-development",
    trackSlugs: ["economy-development"],
    language: "Gujarati",
  },
  {
    slug: "father-son-holy-war",
    title: "Father, Son and Holy War",
    synopsis: "Masculinity, violence and society.",
    audience: "Youth, universities",
    impact: "Critical reflection on social conditioning.",
    categorySlug: "economy-development",
    trackSlugs: ["gender-society", "democracy-constitution"],
    language: "Marathi",
  },
];

export const SCREENING_TRACKS: ScreeningTrack[] = [
  {
    slug: "inspire-children",
    title: "Inspire Children",
    description: "Education, child rights, and belief in learning.",
    icon: "children",
  },
  {
    slug: "build-empathy",
    title: "Build Empathy",
    description: "Stories that deepen human connection and care.",
    icon: "empathy",
  },
  {
    slug: "police-public",
    title: "Police & Public Understanding",
    description: "Justice, institutions, and community trust.",
    icon: "police",
  },
  {
    slug: "health-human-care",
    title: "Health & Human Care",
    description: "Compassion in hospitals and healing spaces.",
    icon: "health",
  },
  {
    slug: "labour-livelihood",
    title: "Labour & Livelihood",
    description: "Dignity of work and invisible labourers.",
    icon: "labour",
  },
  {
    slug: "democracy-constitution",
    title: "Democracy & Constitution",
    description: "Dissent, rights, and civic responsibility.",
    icon: "democracy",
  },
  {
    slug: "economy-development",
    title: "Economy & Development",
    description: "Inequality, displacement, and policy dialogue.",
    icon: "economy",
  },
  {
    slug: "gender-society",
    title: "Gender & Society",
    description: "Identity, equity, and social norms.",
    icon: "gender",
  },
  {
    slug: "indian-parallel-cinema",
    title: "Indian Parallel Cinema",
    description: "Landmark Indian films for study and discussion.",
    icon: "parallel",
  },
  {
    slug: "international-documentary",
    title: "International Documentary Classics",
    description: "Global documentaries for comparative learning.",
    icon: "international",
  },
];

export const CATALOGUE_TIMELINE: CatalogueTimelinePhase[] = [
  {
    label: "Phase 01",
    title: "Foundation & orientation",
    weeks: "Weeks 1–26",
    body: "Begin with child rights, empathy, and labour dignity — building trust and discussion habits across partner institutions.",
  },
  {
    label: "Phase 02",
    title: "Institutions & justice",
    weeks: "Weeks 27–52",
    body: "Move into police, healthcare, and constitutional themes — deepening critical thinking with civic and professional audiences.",
  },
  {
    label: "Phase 03",
    title: "Development & society",
    weeks: "Weeks 53–78",
    body: "Explore economy, gender, and social change — connecting local realities to national policy conversations.",
  },
  {
    label: "Phase 04",
    title: "Cinema & global perspectives",
    weeks: "Weeks 79–104",
    body: "Conclude with parallel cinema and international documentaries — celebrating film as art, inquiry, and transformation.",
  },
];

export const CATALOGUE_STATS: CatalogueStat[] = [
  {
    value: 19,
    suffix: "+",
    label: "Films",
    detail: "Curated documentaries and parallel cinema titles",
  },
  {
    value: 8,
    label: "Themes",
    detail: "Thematic categories for education and dialogue",
  },
  {
    value: 104,
    label: "Weekly Screenings",
    detail: "Approximately two years of programming",
  },
  {
    value: 40,
    suffix: "+",
    label: "Communities Reached",
    detail: "Schools, campuses, and partner institutions",
  },
];

export const CATALOGUE_CONTENT: CatalogueContent = {
  hero: {
    kicker: "Documentary & Parallel Cinema",
    titleLines: ["Documentary & Parallel", "Cinema Catalogue"],
    subtitle:
      "A thematic catalogue for education, empathy, critical thinking, and social transformation.",
    image: "/images/day1/img_0134.webp",
  },
  stats: CATALOGUE_STATS,
  categories: CATALOGUE_CATEGORIES,
  films: CATALOGUE_FILMS,
  tracks: SCREENING_TRACKS,
  timeline: CATALOGUE_TIMELINE,
};

export function getCategoryTitle(slug: string, categories = CATALOGUE_CATEGORIES) {
  return categories.find((c) => c.slug === slug)?.title ?? slug;
}

export function getTrackTitle(slug: string, tracks = SCREENING_TRACKS) {
  return tracks.find((t) => t.slug === slug)?.title ?? slug;
}
