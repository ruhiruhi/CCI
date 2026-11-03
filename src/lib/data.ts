/* ------------------------------------------------------------------ */
/*  Conscious Cinema Initiative — Content Layer                        */
/* ------------------------------------------------------------------ */

/** Build an optimized Unsplash URL from a verified photo id, or pass through local paths. */
export function img(id: string, w = 1600, q = 80): string {
  if (id.startsWith("/")) return id;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

/** Day 1 field photography — optimized WebP in /public/images/day1 */
export const DAY1_IMAGES = {
  heroScreening:
    "/images/day1/1fbb616b-b89e-4dfd-8d36-be8c72959a9c.webp",
  communityWide: "/images/day1/img_0131.webp",
  screenOnGate: "/images/day1/img_0128.webp",
  screenFilmScene: "/images/day1/img_0129.webp",
  screenCloseUp: "/images/day1/img_0130.webp",
  audienceAttentive: "/images/day1/img_0134.webp",
  audienceGathered: "/images/day1/img_0135.webp",
  projectorNight: "/images/day1/img_0136.webp",
  communityPair: "/images/day1/img_0137.webp",
  familyEvening: "/images/day1/img_0140.webp",
  familyJoy: "/images/day1/img_0141.webp",
  youthGroupDusk: "/images/day1/img_0147.webp",
  youthGroupNight: "/images/day1/img_0148.webp",
} as const;

/** Day 2 field photography — optimized WebP in /public/images/day2 */
export const DAY2_IMAGES = {
  screeningNightWide: "/images/day2/img_0204.webp",
  screeningDayWide: "/images/day2/img_0205.webp",
  communityGathering: "/images/day2/img_0206.webp",
  audienceSeated: "/images/day2/img_0207.webp",
  crowdWatching: "/images/day2/img_0208.webp",
  eveningAssembly: "/images/day2/img_0209.webp",
  projectorCrowd: "/images/day2/img_0210.webp",
  childrenFront: "/images/day2/img_0211.webp",
  screeningCircle: "/images/day2/img_0212.webp",
  openAirSetup: "/images/day2/img_0213.webp",
  youthWatching: "/images/day2/img_0214.webp",
  neighborhoodNight: "/images/day2/img_0215.webp",
  screenOnTripod: "/images/day2/img_0219.webp",
  screenGlow: "/images/day2/img_0220.webp",
  familiesWatching: "/images/day2/img_0221.webp",
  communityPortrait: "/images/day2/img_0222.webp",
} as const;

/** All on-site field photography (Day 1 + Day 2) */
export const FIELD_IMAGES = [...Object.values(DAY1_IMAGES), ...Object.values(DAY2_IMAGES)] as const;

/** Back-compat aliases used across sections */
export const LOCAL_IMAGES = {
  heroScreening: DAY2_IMAGES.screenOnTripod,
  classroomScreening: DAY2_IMAGES.screeningDayWide,
  studentFilmmakers: DAY2_IMAGES.projectorCrowd,
  editingSession: DAY2_IMAGES.youthWatching,
} as const;

/* Verified, documentary-leaning imagery ---------------------------- */
export const IMAGES = {
  heroAudience: "1485846234645-a62644f84728",
  cinemaSeats: "1489599849927-2ee91cede3ba",
  emptyCinema: "1536440136628-849c177e76a1",
  womanCinema: "1517604931442-7e0c8ed2963c",
  hallway: "1574267432553-4b4628081c31",
  clapper: "1542204165-65bf26472b9b",
  filmStrip: "1478720568477-152d9b164e26",
  openField: "1440404653325-ab127d49abc1",
  filmmaker: "1503454537195-1dcabb73ffb9",
  vintageCam: "1492691527719-9d1e07e534b4",
  classroom: "1503676260728-1c00da094a0b",
  community: "1488521787991-ed7bbaae773c",
  children: "1509099836639-18ba1795216d",
  workshop: "1542810634-71277d95dcbb",
  crowdHands: "1524178232363-1fb2b075b655",
  concert: "1517486808906-6ca8b3f04846",
  portraitMan: "1531058020387-3be344556be6",
  portraitWoman: "1497486751825-1233686d5d80",
  projector: "1598899134739-24c46f58b8c0",
  cameraRig: "1581905764498-f1b60bae941a",
  editing: "1559070169-a3077159ee16",
  teamFilm: "1571019613454-1cb2f99b2d8b",
  villageKid: "1517457373958-b7bdd4587205",
  studyGroup: "1529070538774-1843cb3265df",
  reading: "1511632765486-a01980e01a18",
  audienceDark: "1523240795612-9a054b0db644",
  meeting: "1581092160562-40aa08e78837",
  lecture: "1526041092449-209d556f7a32",
  mountainNight: "1460723237483-7a6dc9d0b212",
  cameramanField: "1581349485608-9469926a8e5e",
  starsField: "1469474968028-56623f02e42e",
  forestLight: "1500530855697-b586d89ba3ee",
  popcorn: "1516542076529-1ea3854896f2",
  oldTheatre: "1505373877841-8d25f7d46678",
  stage: "1517245386807-bb43f82c33c4",
  road: "1454165804606-c3d57bc86b40",
  portraitElder: "1524995997946-a1c2e315a42f",
  portraitYoung: "1591115765373-5207764f72e7",
  portraitGirl: "1543269865-cbf427effbad",
  hands: "1530021232320-687d8e3dba54",
} as const;

/* Navigation ------------------------------------------------------- */
export type NavChildLink = {
  label: string;
  href: string;
};

export type NavLinkItem = {
  label: string;
  href: string;
  /** Optional dropdown / accordion children (e.g. Why Cinema group). */
  children?: readonly NavChildLink[];
};

export const NAV_LINKS: readonly NavLinkItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Why Cinema",
    href: "/why-cinema",
    children: [
      { label: "Why Cinema", href: "/why-cinema" },
      { label: "Impact", href: "/impact" },
      { label: "Film Literacy", href: "/film-literacy-hub" },
      { label: "Transparency Report", href: "/transparency" },
    ],
  },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Gallery", href: "/gallery" },
  { label: "Activities & Events", href: "/our-activities" },
  { label: "Community", href: "/community" },
  { label: "Support", href: "/support" },
];

/** Flatten nested nav for footer / sitemap-style lists. */
export function flattenNavLinks(
  links: readonly NavLinkItem[] = NAV_LINKS,
): NavChildLink[] {
  return links.flatMap((l) =>
    l.children && l.children.length > 0 ? [...l.children] : [{ label: l.label, href: l.href }],
  );
}

/* Secondary links (footer / mobile) -------------------------------- */
export const SECONDARY_LINKS = [
  { label: "Activities", href: "/activities" },
  { label: "Contact Us", href: "/contact" },
  { label: "Join CCI", href: "/join" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Transparency Report", href: "/transparency" },
] as const;

/** Official social profiles */
export const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/consciouscinemaa",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/conscious-cinema-initiative",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@consciouscinemaa",
  },
] as const;

/** Contact mailboxes */
export const CONTACT_EMAILS = {
  general: "hello@consciouscine.org",
  media: "media@consciouscine.org",
  programs: "programs@consciouscine.org",
  partners: "partners@consciouscine.org",
  community: "community@consciouscine.org",
} as const;

/* Impact statistics ------------------------------------------------ */
export type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  detail: string;
};

export const STATS: Stat[] = [
  { value: 12400, suffix: "+", label: "People reached", detail: "Through screenings and discussions" },
  { value: 86, suffix: "+", label: "Screenings", detail: "Across learning and community spaces" },
  { value: 34, suffix: "+", label: "Institutions", detail: "Schools, colleges, and community partners" },
  { value: 210, suffix: "+", label: "Young filmmakers", detail: "Learning, making, and sharing stories" },
  { value: 26, label: "Student films", detail: "Supported through youth production" },
  { value: 72, label: "Creators mentored", detail: "Through editing labs and production support" },
];

/* Three pillars ---------------------------------------------------- */
export type Pillar = {
  index: string;
  title: string;
  tagline: string;
  body: string;
  points: string[];
  image: string;
};

export const PILLARS: Pillar[] = [
  {
    index: "01",
    title: "Screen",
    tagline: "Awareness through screenings",
    body: "Curated documentary and social-impact films paired with facilitated conversations in classrooms, campuses, villages, and public spaces.",
    points: ["Curated social-impact films", "Facilitated post-screening dialogue", "Community and campus gatherings"],
    image: DAY2_IMAGES.screeningDayWide,
  },
  {
    index: "02",
    title: "Teach",
    tagline: "Education through film literacy",
    body: "Learning experiences that help young people watch critically, understand the language of cinema, and create responsibly.",
    points: ["Film-literacy workshops", "Critical viewing for students", "Educator-led learning experiences"],
    image: DAY2_IMAGES.projectorCrowd,
  },
  {
    index: "03",
    title: "Transform",
    tagline: "Empowerment through making",
    body: "Mentoring, equipment access, and production support for emerging documentary voices to turn stories into reflection and action.",
    points: ["Youth production mentoring", "Editing labs and peer feedback", "Exhibition and community dialogue"],
    image: DAY2_IMAGES.youthWatching,
  },
];

/* Communities reached --------------------------------------------- */
export const COMMUNITIES = [
  {
    title: "Community Screenings",
    image: DAY2_IMAGES.screenOnTripod,
    copy: "Curated films in classrooms, campuses, villages, and public spaces, followed by facilitated discussion.",
  },
  {
    title: "Collaborative Productions",
    image: DAY2_IMAGES.screeningDayWide,
    copy: "Documentaries and short films developed with communities and mission-aligned partners.",
  },
  {
    title: "Young Filmmakers",
    image: DAY2_IMAGES.childrenFront,
    copy: "Mentoring, editing feedback, equipment access, and exhibition opportunities for emerging creators.",
  },
  {
    title: "Community Dialogue",
    image: DAY2_IMAGES.screeningNightWide,
    copy: "Gatherings designed for active participation — where a screening becomes a conversation that stays.",
  },
];

/* Impact timeline -------------------------------------------------- */
export type TimelineItem = {
  year: string;
  title: string;
  body: string;
  image: string;
};

export const TIMELINE: TimelineItem[] = [
  {
    year: "2024",
    title: "The first community screenings",
    body: "Small screenings tested a discussion-led model with students and educators.",
    image: DAY2_IMAGES.screeningNightWide,
  },
  {
    year: "2025",
    title: "Film education pilots",
    body: "Workshops connected critical viewing with practical filmmaking exercises.",
    image: DAY2_IMAGES.screeningDayWide,
  },
  {
    year: "2026",
    title: "CCI public launch",
    body: "A shared platform begins connecting screenings, partners, volunteers, and filmmakers.",
    image: DAY2_IMAGES.projectorCrowd,
  },
  {
    year: "Next",
    title: "National chapter development",
    body: "Local coordinators will adapt the model while protecting shared values and standards.",
    image: DAY2_IMAGES.screenOnTripod,
  },
];

/* Community stories ------------------------------------------------ */
export type Story = {
  name: string;
  role: string;
  location: string;
  quote: string;
  image: string;
};

export const STORIES: Story[] = [
  {
    name: "Sana Patil",
    role: "Student participant",
    location: "India",
    quote:
      "I entered the workshop wanting to operate a camera. I left understanding why consent changes the whole film.",
    image: DAY2_IMAGES.childrenFront,
  },
  {
    name: "Dev Arora",
    role: "College coordinator",
    location: "India",
    quote:
      "Our campus screening brought students from departments that rarely speak to each other into one room.",
    image: DAY2_IMAGES.communityPortrait,
  },
  {
    name: "Meera Joseph",
    role: "Community organizer",
    location: "India",
    quote:
      "The screening did not end with the credits. It became a community discussion that stayed with us.",
    image: DAY2_IMAGES.familiesWatching,
  },
];

/* Gallery ---------------------------------------------------------- */
export type GalleryItem = {
  id: string;
  src: string;
  category: "Screenings" | "Workshops" | "Communities" | "Behind the Scenes";
  caption: string;
  span: "tall" | "wide" | "regular";
  /** ISO date (YYYY-MM-DD) for chronological gallery sorting */
  eventDate?: string;
};

export const GALLERY: GalleryItem[] = [
  { id: "g1", src: DAY1_IMAGES.heroScreening, category: "Screenings", caption: "An outdoor community screening with a portable projector in Vikas Puri", span: "tall", eventDate: "2025-11-08" },
  { id: "g2", src: DAY1_IMAGES.communityWide, category: "Communities", caption: "Children and neighbors gathered for a neighborhood film evening", span: "regular", eventDate: "2025-11-08" },
  { id: "g3", src: DAY1_IMAGES.screenOnGate, category: "Screenings", caption: "A film projected onto a screen at a community gate", span: "wide", eventDate: "2025-11-08" },
  { id: "g4", src: DAY1_IMAGES.screenFilmScene, category: "Screenings", caption: "A story unfolds on the outdoor screen during a local screening", span: "regular", eventDate: "2025-11-08" },
  { id: "g5", src: DAY1_IMAGES.screenCloseUp, category: "Screenings", caption: "Close-up of a film moment shared with the community", span: "regular", eventDate: "2025-11-08" },
  { id: "g6", src: DAY1_IMAGES.audienceAttentive, category: "Communities", caption: "Young viewers watching attentively from the ground", span: "regular", eventDate: "2025-11-08" },
  { id: "g7", src: DAY1_IMAGES.audienceGathered, category: "Communities", caption: "Families seated together for an open-air cinema night", span: "regular", eventDate: "2025-11-08" },
  { id: "g8", src: DAY1_IMAGES.projectorNight, category: "Behind the Scenes", caption: "A portable projector bringing cinema into the neighborhood", span: "wide", eventDate: "2025-11-08" },
  { id: "g9", src: DAY1_IMAGES.communityPair, category: "Communities", caption: "A mother and child at a community gathering", span: "regular", eventDate: "2025-11-08" },
  { id: "g10", src: DAY1_IMAGES.familyEvening, category: "Communities", caption: "A family sharing a warm moment after the screening", span: "tall", eventDate: "2025-11-08" },
  { id: "g11", src: DAY1_IMAGES.familyJoy, category: "Communities", caption: "Joyful faces at a grassroots cinema event", span: "regular", eventDate: "2025-11-08" },
  { id: "g12", src: DAY1_IMAGES.youthGroupDusk, category: "Communities", caption: "Local youth celebrating a community film evening at dusk", span: "regular", eventDate: "2025-11-08" },
  { id: "g13", src: DAY1_IMAGES.youthGroupNight, category: "Communities", caption: "Children and young people who joined the outdoor screening", span: "regular", eventDate: "2025-11-08" },
  { id: "g14", src: DAY2_IMAGES.screeningNightWide, category: "Screenings", caption: "A neighborhood gathers as night falls for an open-air screening", span: "wide", eventDate: "2025-11-09" },
  { id: "g15", src: DAY2_IMAGES.screeningDayWide, category: "Screenings", caption: "Setting up the screen before an afternoon community film event", span: "regular", eventDate: "2025-11-09" },
  { id: "g16", src: DAY2_IMAGES.communityGathering, category: "Communities", caption: "Families and neighbors arriving for a shared screening", span: "regular", eventDate: "2025-11-09" },
  { id: "g17", src: DAY2_IMAGES.audienceSeated, category: "Communities", caption: "Children seated together, waiting for the film to begin", span: "regular", eventDate: "2025-11-09" },
  { id: "g18", src: DAY2_IMAGES.crowdWatching, category: "Screenings", caption: "A crowd focused on the story unfolding on screen", span: "tall", eventDate: "2025-11-09" },
  { id: "g19", src: DAY2_IMAGES.eveningAssembly, category: "Communities", caption: "An evening assembly before the screening starts", span: "regular", eventDate: "2025-11-09" },
  { id: "g20", src: DAY2_IMAGES.projectorCrowd, category: "Behind the Scenes", caption: "A portable projector lights up faces in the crowd", span: "wide", eventDate: "2025-11-09" },
  { id: "g21", src: DAY2_IMAGES.childrenFront, category: "Communities", caption: "Young viewers in the front row at a grassroots screening", span: "regular", eventDate: "2025-11-09" },
  { id: "g22", src: DAY2_IMAGES.screeningCircle, category: "Screenings", caption: "The community forms a circle around the outdoor screen", span: "regular", eventDate: "2025-11-09" },
  { id: "g23", src: DAY2_IMAGES.openAirSetup, category: "Behind the Scenes", caption: "Equipment and volunteers preparing an open-air cinema", span: "regular", eventDate: "2025-11-09" },
  { id: "g24", src: DAY2_IMAGES.youthWatching, category: "Communities", caption: "Youth watching attentively during a neighborhood film night", span: "regular", eventDate: "2025-11-09" },
  { id: "g25", src: DAY2_IMAGES.neighborhoodNight, category: "Screenings", caption: "A quiet neighborhood street transformed into a cinema", span: "regular", eventDate: "2025-11-09" },
  { id: "g26", src: DAY2_IMAGES.screenOnTripod, category: "Screenings", caption: "A film projected on a portable screen under the trees", span: "tall", eventDate: "2025-11-09" },
  { id: "g27", src: DAY2_IMAGES.screenGlow, category: "Screenings", caption: "The glow of the screen against the night sky", span: "regular", eventDate: "2025-11-09" },
  { id: "g28", src: DAY2_IMAGES.familiesWatching, category: "Communities", caption: "Families watching together at a community screening", span: "wide", eventDate: "2025-11-09" },
  { id: "g29", src: DAY2_IMAGES.communityPortrait, category: "Communities", caption: "Neighbors who came out for a shared film evening", span: "regular", eventDate: "2025-11-09" },
];

/* Events ----------------------------------------------------------- */
export type EventItem = {
  title: string;
  date: string;
  city: string;
  type: string;
  image: string;
  blurb: string;
};

export const EVENTS: EventItem[] = [
  {
    title: "Campus Screening: The Cost of Silence",
    date: "Jul 18, 2026",
    city: "Pune, Maharashtra",
    type: "Campus Screening",
    image: DAY2_IMAGES.communityGathering,
    blurb: "A curated campus screening followed by facilitated dialogue for students and educators.",
  },
  {
    title: "Documentary Storytelling Workshop",
    date: "Aug 02, 2026",
    city: "Bengaluru, Karnataka",
    type: "Workshop",
    image: DAY2_IMAGES.projectorCrowd,
    blurb: "A film-literacy and storytelling workshop for students learning to document with care and context.",
  },
  {
    title: "Outdoor Cinema and Community Dialogue",
    date: "Aug 16, 2026",
    city: "Nashik, Maharashtra",
    type: "Community Screening",
    image: DAY2_IMAGES.screenOnTripod,
    blurb: "An outdoor cinema evening designed for active participation and community conversation.",
  },
  {
    title: "Educator Film-Literacy Lab",
    date: "Sep 06, 2026",
    city: "Delhi",
    type: "Workshop",
    image: DAY2_IMAGES.openAirSetup,
    blurb: "A film-literacy workshop for students and educators exploring critical viewing together.",
  },
  {
    title: "Youth Documentary Lab",
    date: "May 22, 2026",
    city: "Mumbai, Maharashtra",
    type: "Completed",
    image: DAY2_IMAGES.familiesWatching,
    blurb: "A documentary lab supporting emerging nonfiction storytellers.",
  },
  {
    title: "Water, Work and the City",
    date: "Apr 11, 2026",
    city: "Ahmedabad, Gujarat",
    type: "Completed",
    image: DAY2_IMAGES.screenGlow,
    blurb: "A community screening and dialogue on urban work and water.",
  },
  {
    title: "Film Literacy for Educators",
    date: "Mar 16, 2026",
    city: "Online",
    type: "Completed",
    image: DAY2_IMAGES.childrenFront,
    blurb: "An online film-literacy workshop for educators.",
  },
  {
    title: "Neighborhood Night Screening",
    date: "Feb 08, 2026",
    city: "Delhi",
    type: "Completed",
    image: DAY2_IMAGES.screeningNightWide,
    blurb: "An open-air screening that brought neighbors together under the night sky.",
  },
  {
    title: "Community Film Circle",
    date: "Jan 25, 2026",
    city: "Pune, Maharashtra",
    type: "Completed",
    image: DAY2_IMAGES.screeningCircle,
    blurb: "A grassroots screening where the community gathered in a circle around the outdoor screen.",
  },
  {
    title: "Youth Assembly Screening",
    date: "Jan 12, 2026",
    city: "Nashik, Maharashtra",
    type: "Completed",
    image: DAY2_IMAGES.youthWatching,
    blurb: "Young viewers watching attentively during a neighborhood film night.",
  },
  {
    title: "Evening Assembly and Dialogue",
    date: "Dec 20, 2025",
    city: "Bengaluru, Karnataka",
    type: "Completed",
    image: DAY2_IMAGES.eveningAssembly,
    blurb: "An evening assembly before the screening sparked conversation that continued long after.",
  },
];

/* Partners --------------------------------------------------------- */
export const PARTNERS = [
  "Learning Spaces Network",
  "People's Film Collective",
  "Youth Media Forum",
  "Community Arts Trust",
  "Open Classroom Alliance",
  "Founding Circle",
  "Screening Partners",
  "Education Allies",
  "Equipment Contributors",
] as const;

/* Volunteer journey ------------------------------------------------ */
export type JourneyStep = {
  step: string;
  title: string;
  body: string;
};

export const VOLUNTEER_JOURNEY: JourneyStep[] = [
  { step: "01", title: "Reach out", body: "Contact community@consciouscine.org about volunteer interest and future chapter coordination." },
  { step: "02", title: "Train", body: "Join film-literacy workshops on watching with attention, documentary ethics, and editing for meaning." },
  { step: "03", title: "Participate", body: "Support screenings, education programs, or student production initiatives with partner institutions." },
  { step: "04", title: "Lead", body: "Help expand meaningful access as local coordinators adapt the model while protecting shared standards." },
];

export const VOLUNTEER_SPOTLIGHTS: Story[] = [
  {
    name: "Sana Patil",
    role: "Student participant",
    location: "India",
    quote: "I entered the workshop wanting to operate a camera. I left understanding why consent changes the whole film.",
    image: DAY2_IMAGES.audienceSeated,
  },
  {
    name: "Dev Arora",
    role: "College coordinator",
    location: "India",
    quote: "Our campus screening brought students from departments that rarely speak to each other into one room.",
    image: DAY2_IMAGES.crowdWatching,
  },
  {
    name: "Meera Joseph",
    role: "Community organizer",
    location: "India",
    quote: "The screening did not end with the credits. It became a community discussion that stayed with us.",
    image: DAY2_IMAGES.neighborhoodNight,
  },
];

/* Testimonials ----------------------------------------------------- */
export const TESTIMONIALS = [
  {
    quote:
      "The film gave our students a language for a conversation they had wanted to begin for months.",
    name: "Ananya Rao",
    role: "Teacher, Pune",
    image: DAY2_IMAGES.screenGlow,
  },
  {
    quote:
      "CCI treated our story with dignity. We learned that filmmaking begins with listening.",
    name: "Kabir Sheikh",
    role: "Student filmmaker",
    image: DAY2_IMAGES.communityPortrait,
  },
  {
    quote:
      "The screening did not end with the credits. It became a community discussion that stayed with us.",
    name: "Meera Joseph",
    role: "Community organizer",
    image: DAY2_IMAGES.familiesWatching,
  },
  {
    quote:
      "Hosting a CCI screening helped our campus move from passive viewing to active civic dialogue.",
    name: "Rohit Nair",
    role: "College coordinator, Bengaluru",
    image: DAY2_IMAGES.youthWatching,
  },
  {
    quote:
      "As a partner institution, we saw students leave with sharper questions and a clearer sense of purpose.",
    name: "Dr. Priya Menon",
    role: "Academic partner",
    image: DAY2_IMAGES.audienceSeated,
  },
  {
    quote:
      "The volunteer journey gave me practical skills and a community that believes cinema can still change minds.",
    name: "Fatima Siddiqui",
    role: "Volunteer, Delhi",
    image: DAY2_IMAGES.eveningAssembly,
  },
] as const;

/* Projects (Our Work) --------------------------------------------- */
export type Project = {
  slug: string;
  title: string;
  episode: string;
  location: string;
  year: string;
  cover: string;
  summary: string;
  stats: { value: string; label: string }[];
  gallery: string[];
  /** Long-form documentary detail */
  story: string[];
  challenge: string;
  outcome: string;
  videoPoster: string;
  testimonial: { quote: string; name: string; role: string; image: string };
  related: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "cinema-in-the-classroom",
    title: "Cinema in the Classroom",
    episode: "Film Education",
    location: "India",
    year: "2026",
    cover: DAY2_IMAGES.communityGathering,
    summary:
      "Curated films and guided conversations that help students engage with society through stories.",
    stats: [
      { value: "4,800", label: "Students reached" },
      { value: "34", label: "Institutions" },
      { value: "86", label: "Screenings" },
    ],
    gallery: [DAY2_IMAGES.communityGathering, DAY2_IMAGES.screenOnTripod, DAY2_IMAGES.screeningDayWide],
    story: [
      "Curated documentary and social-impact films paired with facilitated conversations in learning spaces.",
      "Students encounter lived realities, examine difficult questions, and imagine more humane possibilities together.",
      "Each screening is designed to move beyond passive viewing into reflection, dialogue, and learning.",
    ],
    challenge:
      "Meaningful film experiences are often limited by geography, privilege, and the absence of guided conversation.",
    outcome:
      "4,800 students reached through sustained film education and discussion-led screenings.",
    videoPoster: DAY2_IMAGES.screenGlow,
    testimonial: {
      quote:
        "The film gave our students a language for a conversation they had wanted to begin for months.",
      name: "Ananya Rao",
      role: "Teacher, Pune",
      image: DAY2_IMAGES.screenGlow,
    },
    related: ["stories-from-where-we-stand", "the-community-cut"],
  },
  {
    slug: "stories-from-where-we-stand",
    title: "Stories From Where We Stand",
    episode: "Youth Production",
    location: "India",
    year: "2026",
    cover: DAY2_IMAGES.projectorCrowd,
    summary:
      "A mentoring program supporting students to document their communities with care and context.",
    stats: [
      { value: "26", label: "Student films" },
      { value: "210", label: "Young filmmakers" },
      { value: "72", label: "Creators mentored" },
    ],
    gallery: [DAY2_IMAGES.projectorCrowd, DAY2_IMAGES.childrenFront, DAY2_IMAGES.youthWatching],
    story: [
      "Students learn to document their communities with attention, consent, and context.",
      "Mentoring connects practical filmmaking with ethical nonfiction practice.",
      "Finished films are shared back with the communities that made them possible.",
    ],
    challenge:
      "Young people are fluent in consuming media but rarely invited to create it responsibly.",
    outcome:
      "26 student films supported through mentoring, feedback, and exhibition opportunities.",
    videoPoster: DAY2_IMAGES.familiesWatching,
    testimonial: {
      quote:
        "CCI treated our story with dignity. We learned that filmmaking begins with listening.",
      name: "Kabir Sheikh",
      role: "Student filmmaker",
      image: DAY2_IMAGES.communityPortrait,
    },
    related: ["cinema-in-the-classroom", "the-community-cut"],
  },
  {
    slug: "the-community-cut",
    title: "The Community Cut",
    episode: "Filmmaker Empowerment",
    location: "India",
    year: "2026",
    cover: DAY2_IMAGES.openAirSetup,
    summary:
      "Editing labs, peer feedback, and practical production support for emerging documentary voices.",
    stats: [
      { value: "72", label: "Creators mentored" },
      { value: "26", label: "Student films" },
      { value: "210", label: "Young filmmakers" },
    ],
    gallery: [DAY2_IMAGES.openAirSetup, DAY2_IMAGES.screeningCircle, DAY2_IMAGES.neighborhoodNight],
    story: [
      "Editing labs help emerging filmmakers shape structure, rhythm, and meaning in their work.",
      "Peer feedback and practical production support build confidence and craft.",
      "The program connects viewing, making, and sharing into one practical pathway for social impact.",
    ],
    challenge:
      "Emerging documentary voices often lack access to mentoring, equipment, and post-production support.",
    outcome:
      "72 creators mentored through editing labs and production support cycles.",
    videoPoster: DAY2_IMAGES.screenOnTripod,
    testimonial: {
      quote:
        "I entered the workshop wanting to operate a camera. I left understanding why consent changes the whole film.",
      name: "Sana Patil",
      role: "Student participant",
      image: DAY2_IMAGES.childrenFront,
    },
    related: ["cinema-in-the-classroom", "stories-from-where-we-stand"],
  },
];

/* Support tiers ---------------------------------------------------- */
export type SupportTier = {
  title: string;
  amount: string;
  cadence: string;
  body: string;
  outcome: string;
  image: string;
  featured?: boolean;
};

export const SUPPORT_TIERS: SupportTier[] = [
  {
    title: "Fund a screening",
    amount: "₹5,000",
    cadence: "one event",
    body: "Help cover licensing, projection, facilitation, access, and local coordination for a community event.",
    outcome: "Contributes to facilitation and projection for a community screening",
    image: DAY2_IMAGES.screenOnTripod,
  },
  {
    title: "Support a filmmaker",
    amount: "₹25,000",
    cadence: "one mentorship",
    body: "Contribute to mentoring, travel, editing, production, and exhibition support for emerging voices.",
    outcome: "Supports a student production lab or editing mentorship cycle",
    image: DAY2_IMAGES.openAirSetup,
    featured: true,
  },
  {
    title: "Build film-literacy access",
    amount: "₹1,000",
    cadence: "classroom support",
    body: "Help schools and colleges host sustained learning experiences, not one-off events.",
    outcome: "Supports learning material for a classroom screening",
    image: DAY2_IMAGES.communityGathering,
  },
  {
    title: "Donate equipment",
    amount: "In kind",
    cadence: "equipment gift",
    body: "Offer cameras, lenses, audio, lighting, projection, or editing systems in working condition.",
    outcome: "Gear used across screenings and student productions",
    image: DAY2_IMAGES.familiesWatching,
  },
  {
    title: "Lend equipment",
    amount: "In kind",
    cadence: "project period",
    body: "Make equipment available for a defined project period while retaining ownership.",
    outcome: "Enables student and community productions to move forward",
    image: DAY2_IMAGES.screeningCircle,
  },
];

/* Values, mission, leadership (About) ------------------------------ */
export const VALUES = [
  { title: "Listen before telling", body: "Responsible cinema begins with attention, consent, and context." },
  { title: "Access matters", body: "Meaningful film experiences should not be limited by geography or privilege." },
  { title: "Dialogue over spectacle", body: "We value thoughtful participation more than passive consumption." },
  { title: "Trust through transparency", body: "Our decisions, partnerships, and use of resources must remain clear." },
];

export const LEADERSHIP = [
  { name: "Aarav Menon", role: "Founder and Program Director — Documentary practitioner focused on public learning and community media.", image: DAY2_IMAGES.projectorCrowd },
  { name: "Nisha Verma", role: "Education Lead — Educator designing film-literacy experiences for schools and colleges.", image: DAY2_IMAGES.screeningDayWide },
  { name: "Rohan Das", role: "Filmmaker Development Lead — Editor and mentor supporting emerging nonfiction storytellers.", image: DAY2_IMAGES.childrenFront },
  { name: "Dr. Leela Iyer", role: "Advisor — Education and Youth Development", image: DAY2_IMAGES.neighborhoodNight },
  { name: "Sameer Kulkarni", role: "Advisor — Documentary Film Practice", image: DAY2_IMAGES.screenGlow },
  { name: "Farah Khan", role: "Advisor — Community Partnerships", image: DAY2_IMAGES.communityPortrait },
];

export const FAQS = [
  {
    question: "Is CCI a film festival?",
    answer:
      "No. CCI is an ongoing movement combining screenings, discussion, education, production support, and community participation.",
  },
  {
    question: "Does CCI produce films?",
    answer:
      "CCI supports selected student and community-led productions while also helping existing social-impact films reach new audiences.",
  },
  {
    question: "Can schools and colleges participate?",
    answer:
      "Yes. Institutions can host screenings, workshops, film-literacy programs, and student production initiatives.",
  },
  {
    question: "How will CCI grow nationally?",
    answer:
      "Future chapters will work through shared program standards, safeguarding policies, transparent reporting, and local partnerships.",
  },
] as const;

export const GOVERNANCE = [
  "Documented program approvals and partner due diligence",
  "Role-based financial and operational oversight",
  "Consent and safeguarding standards for students and communities",
  "Published annual reports and conflict-of-interest declarations",
] as const;

export const TRANSPARENCY_REPORTS = [
  { title: "Phase 1 Foundation Report", year: "2026", type: "Transparency Report", status: "Available at launch" },
  { title: "Screening and Learning Summary", year: "2026", type: "Impact Report", status: "Publishing December 2026" },
  { title: "Annual Financial Summary", year: "2026", type: "Annual Report", status: "Publishing March 2027" },
] as const;

/* Film Literacy Hub ------------------------------------------------ */
export const CURRICULUM = [
  { module: "Module 01", title: "Watching with attention", body: "A film-literacy workshop for students and educators." },
  { module: "Module 02", title: "Documentary ethics", body: "Consent, representation, context, and accountability in nonfiction work." },
  { module: "Module 03", title: "Editing for meaning", body: "How structure, rhythm, and omission shape what a film communicates." },
  { module: "Module 04", title: "Screenings", body: "Curated films in classrooms, campuses, villages, and public spaces, followed by facilitated discussion." },
  { module: "Module 05", title: "Student projects", body: "Mentoring, editing feedback, equipment access, and exhibition opportunities for emerging filmmakers." },
];

/* Homepage — The Reality (Scene 03) -------------------------------- */
export const REALITY_STATS: { value: number; suffix?: string; label: string }[] = [
  { value: 12400, suffix: "+", label: "People reached through screenings and discussions" },
  { value: 86, suffix: "+", label: "Screenings across learning and community spaces" },
  { value: 34, suffix: "+", label: "Institutions partnering with CCI" },
];

export const REALITY_POINTS = [
  "Powerful films often reach festivals and platforms, but not the classrooms and communities where they can begin the most important conversations.",
  "Meaningful film experiences should not be limited by geography or privilege.",
  "CCI brings films, facilitation, education, and production support into one connected movement.",
];

/* Homepage — Become Part of the Movement (Scene 10) ---------------- */
export type Pathway = {
  title: string;
  body: string;
  icon: "volunteer" | "screening" | "partner" | "support";
  image: string;
  href: string;
  cta: string;
};

export const PATHWAYS: Pathway[] = [
  {
    title: "Host a screening",
    body: "Bring a meaningful film conversation to your school, college, campus, or community.",
    icon: "screening",
    image: DAY2_IMAGES.screenOnTripod,
    href: "/join?interest=Screening%20Request",
    cta: "Request a screening",
  },
  {
    title: "Volunteer",
    body: "Volunteer your skills, join a screening crew, or help expand access to meaningful cinema.",
    icon: "volunteer",
    image: DAY2_IMAGES.screeningNightWide,
    href: "/join?interest=Volunteer",
    cta: "Join the movement",
  },
  {
    title: "Partner with us",
    body: "Schools, colleges, NGOs, CSR teams, and institutions can co-create lasting film programmes.",
    icon: "partner",
    image: DAY2_IMAGES.youthWatching,
    href: "/join?interest=Partnership",
    cta: "Become a partner",
  },
  {
    title: "Support CCI",
    body: "Fund a screening, support a filmmaker, or help build film-literacy access through transparent giving.",
    icon: "support",
    image: DAY2_IMAGES.projectorCrowd,
    href: "/support",
    cta: "Support the work",
  },
];

/* Why Cinema page -------------------------------------------------- */
export const CINEMA_QUOTES = [
  { quote: "The film gave our students a language for a conversation they had wanted to begin for months.", author: "Ananya Rao, Teacher" },
  { quote: "CCI treated our story with dignity. We learned that filmmaking begins with listening.", author: "Kabir Sheikh, Student filmmaker" },
  { quote: "The screening did not end with the credits. It became a community discussion that stayed with us.", author: "Meera Joseph, Community organizer" },
];

export const WHY_CINEMA_REASONS = [
  {
    title: "Awareness through screenings",
    body: "Curated documentary and social-impact films paired with facilitated conversations.",
    image: DAY2_IMAGES.screenOnTripod,
  },
  {
    title: "Education through film literacy",
    body: "Learning experiences that help young people watch critically and create responsibly.",
    image: DAY2_IMAGES.projectorCrowd,
  },
  {
    title: "Empowerment through making",
    body: "Mentoring, equipment access, and production support for emerging filmmakers.",
    image: DAY2_IMAGES.youthWatching,
  },
  {
    title: "Community dialogue",
    body: "Curated films in classrooms, campuses, villages, and public spaces, followed by facilitated discussion.",
    image: DAY2_IMAGES.communityPortrait,
  },
];

/* Impact Dashboard ------------------------------------------------- */
export type YearPoint = { year: string; screenings: number; students: number };

export const IMPACT_BY_YEAR: YearPoint[] = [
  { year: "2024", screenings: 12, students: 1800 },
  { year: "2025", screenings: 38, students: 4800 },
  { year: "2026", screenings: 86, students: 12400 },
];

export const IMPACT_BREAKDOWN = [
  { label: "Programs and screenings", value: 58, total: 100 },
  { label: "Education and filmmaker support", value: 24, total: 100 },
  { label: "Technology and operations", value: 12, total: 100 },
  { label: "Contingency and compliance", value: 6, total: 100 },
];

export const REGIONS = [
  { region: "Maharashtra", cities: 3, share: 38 },
  { region: "Karnataka", cities: 1, share: 18 },
  { region: "Delhi NCR", cities: 1, share: 14 },
  { region: "Gujarat", cities: 1, share: 14 },
  { region: "Online programs", cities: 1, share: 16 },
];

/* Film Literacy Magazine ------------------------------------------- */
export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Craft" | "Impact" | "Voices" | "Guides";
  readingTime: number;
  date: string;
  author: string;
  image: string;
  featured?: boolean;
};

export const ARTICLES: Article[] = [
  {
    slug: "cinema-in-the-classroom",
    title: "Cinema in the Classroom",
    excerpt:
      "Curated films and guided conversations that help students engage with society through stories. 4,800 students reached.",
    category: "Impact",
    readingTime: 6,
    date: "Jul 2026",
    author: "Nisha Verma",
    image: DAY2_IMAGES.communityGathering,
    featured: true,
  },
  {
    slug: "stories-from-where-we-stand",
    title: "Stories From Where We Stand",
    excerpt:
      "A mentoring program supporting students to document their communities with care and context. 26 student films supported.",
    category: "Voices",
    readingTime: 7,
    date: "Jul 2026",
    author: "Aarav Menon",
    image: DAY2_IMAGES.projectorCrowd,
  },
  {
    slug: "the-community-cut",
    title: "The Community Cut",
    excerpt:
      "Editing labs, peer feedback, and practical production support for emerging documentary voices. 72 creators mentored.",
    category: "Craft",
    readingTime: 6,
    date: "Jun 2026",
    author: "Rohan Das",
    image: DAY2_IMAGES.screenGlow,
  },
  {
    slug: "is-cci-a-film-festival",
    title: "Is CCI a film festival?",
    excerpt:
      "No. CCI is an ongoing movement combining screenings, discussion, education, production support, and community participation.",
    category: "Guides",
    readingTime: 4,
    date: "Jun 2026",
    author: "CCI Team",
    image: DAY2_IMAGES.screenOnTripod,
  },
  {
    slug: "does-cci-produce-films",
    title: "Does CCI produce films?",
    excerpt:
      "CCI supports selected student and community-led productions while helping existing social-impact films reach new audiences.",
    category: "Guides",
    readingTime: 4,
    date: "May 2026",
    author: "CCI Team",
    image: DAY2_IMAGES.audienceSeated,
  },
  {
    slug: "documentary-ethics",
    title: "Documentary ethics",
    excerpt: "Consent, representation, context, and accountability in nonfiction work.",
    category: "Craft",
    readingTime: 5,
    date: "May 2026",
    author: "Rohan Das",
    image: DAY2_IMAGES.communityPortrait,
  },
  {
    slug: "phase-1-foundation-report",
    title: "Phase 1 Foundation Report",
    excerpt: "Transparency report summarizing funding, program activity, governance, and learning at launch.",
    category: "Impact",
    readingTime: 8,
    date: "2026",
    author: "CCI Team",
    image: DAY2_IMAGES.openAirSetup,
  },
  {
    slug: "screening-learning-summary",
    title: "Screening and Learning Summary",
    excerpt: "Impact report on screenings, participation, and learning across foundation-stage programs. Publishing December 2026.",
    category: "Impact",
    readingTime: 7,
    date: "2026",
    author: "CCI Team",
    image: DAY2_IMAGES.crowdWatching,
  },
  {
    slug: "can-schools-participate",
    title: "Can schools and colleges participate?",
    excerpt:
      "Yes. Institutions can host screenings, workshops, film-literacy programs, and student production initiatives.",
    category: "Guides",
    readingTime: 4,
    date: "May 2026",
    author: "CCI Team",
    image: DAY2_IMAGES.eveningAssembly,
  },
  {
    slug: "how-cci-grows-nationally",
    title: "How will CCI grow nationally?",
    excerpt:
      "Future chapters will work through shared program standards, safeguarding policies, transparent reporting, and local partnerships.",
    category: "Guides",
    readingTime: 5,
    date: "2026",
    author: "CCI Team",
    image: DAY2_IMAGES.youthWatching,
  },
  {
    slug: "watching-with-attention",
    title: "Watching with attention",
    excerpt: "A film-literacy workshop for students and educators.",
    category: "Craft",
    readingTime: 5,
    date: "May 2026",
    author: "Nisha Verma",
    image: DAY2_IMAGES.familiesWatching,
  },
  {
    slug: "annual-financial-summary",
    title: "Annual Financial Summary",
    excerpt: "Annual report on funding, allocations, and compliance. Publishing March 2027.",
    category: "Impact",
    readingTime: 8,
    date: "2026",
    author: "CCI Team",
    image: DAY2_IMAGES.screeningCircle,
  },
];
