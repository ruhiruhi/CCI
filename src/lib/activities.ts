/* ------------------------------------------------------------------ */
/*  Our Activities — CMS-ready location + movie screening content       */
/*  UI reads ActivityLocation only; swap via getPublishedActivity*().   */
/* ------------------------------------------------------------------ */

import { DAY1_IMAGES, DAY2_IMAGES, IMAGES } from "@/lib/data";

export type ActivityImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  span?: "tall" | "wide" | "regular";
};

export type ActivityMovieImpact = {
  participants: number;
  response: string;
  discussionHeld: boolean;
};

export type ActivityMovie = {
  name: string;
  poster?: string;
  synopsis: string;
  duration?: string;
  screeningDate?: string;
  targetAudience?: string;
  morals: string[];
  discussion?: string;
  impact?: ActivityMovieImpact;
  /** Optional extended credits */
  director?: string;
  runtime?: string;
  language?: string;
  category?: string;
};

export type ActivityLocation = {
  id: string;
  slug: string;
  title: string;
  location: string;
  thumbnail: string;
  description: string;
  /** Primary gallery field */
  gallery: ActivityImage[];
  /**
   * Optional CMS alias for gallery (`images` in payloads).
   * Prefer `gallery` in seed data; helpers fall back to this.
   */
  images?: ActivityImage[];
  movie: ActivityMovie;
  ngo?: string;
};

/** Resolve gallery images from either `gallery` or CMS `images`. */
export function getGallery(location: ActivityLocation): ActivityImage[] {
  if (location.gallery?.length) return location.gallery;
  if (location.images?.length) return location.images;
  return [];
}

export function getMovieName(movie: ActivityMovie): string {
  return movie.name;
}

/** Seed activity reports — replace via CMS PageContent "our-activities". */
export const ACTIVITY_LOCATIONS: ActivityLocation[] = [
  {
    id: "loc-delhi",
    slug: "delhi",
    title: "Delhi",
    location: "Delhi",
    thumbnail: DAY1_IMAGES.heroScreening,
    description:
      "An open-air neighbourhood screening that brought children, parents, and volunteers together for a shared film conversation.",
    ngo: "ABC Foundation",
    movie: {
      name: "The Price of Free",
      poster: DAY1_IMAGES.screenFilmScene,
      synopsis:
        "A documentary about Nobel Peace Prize winner Kailash Satyarthi and his mission to rescue children from child labour while promoting education and human rights.",
      duration: "2 hours",
      screeningDate: "12 Jan 2026",
      targetAudience: "Children & families",
      director: "Derek Doneen",
      runtime: "92 min",
      language: "Hindi / English",
      category: "Documentary · Child Rights",
      morals: [
        "Every child deserves education.",
        "Child labour is harmful.",
        "Courage can change society.",
        "Education builds a better future.",
        "We should help children stay in school.",
        "Human rights belong to everyone.",
      ],
      discussion:
        "After the screening, volunteers discussed the movie with children and parents. Participants shared their thoughts, asked questions, and reflected on how the film related to their own lives.",
      impact: {
        participants: 120,
        response: "Excellent",
        discussionHeld: true,
      },
    },
    gallery: [
      {
        id: "delhi-1",
        src: DAY1_IMAGES.heroScreening,
        alt: "Outdoor community screening in Delhi",
        caption: "Portable projector lighting up a Delhi evening",
        span: "tall",
      },
      {
        id: "delhi-2",
        src: DAY1_IMAGES.communityWide,
        alt: "Children and neighbours gathered for a film evening",
        caption: "Neighbours arriving for a shared screening",
        span: "regular",
      },
      {
        id: "delhi-3",
        src: DAY1_IMAGES.screenOnGate,
        alt: "Film projected onto a screen at a community gate",
        caption: "Cinema at the community gate",
        span: "wide",
      },
      {
        id: "delhi-4",
        src: DAY1_IMAGES.audienceAttentive,
        alt: "Young viewers watching attentively",
        caption: "Young viewers in the front rows",
        span: "regular",
      },
      {
        id: "delhi-5",
        src: DAY1_IMAGES.projectorNight,
        alt: "Portable projector at a neighbourhood screening",
        caption: "Behind the scenes — projection setup",
        span: "wide",
      },
      {
        id: "delhi-6",
        src: DAY1_IMAGES.familyJoy,
        alt: "Joyful faces at a grassroots cinema event",
        caption: "Joy after the credits",
        span: "regular",
      },
      {
        id: "delhi-7",
        src: DAY1_IMAGES.youthGroupDusk,
        alt: "Local youth at a community film evening",
        caption: "Youth celebrating a film evening at dusk",
        span: "regular",
      },
      {
        id: "delhi-8",
        src: DAY1_IMAGES.audienceGathered,
        alt: "Families seated together for open-air cinema",
        caption: "Families sharing an open-air cinema night",
        span: "tall",
      },
    ],
  },
  {
    id: "loc-mumbai",
    slug: "mumbai",
    title: "Mumbai",
    location: "Mumbai",
    thumbnail: DAY2_IMAGES.screeningNightWide,
    description:
      "A night screening that turned a Mumbai neighbourhood street into a shared cinema for children and families.",
    ngo: "Hope Collective",
    movie: {
      name: "I Am Kalam",
      poster: DAY2_IMAGES.screenOnTripod,
      synopsis:
        "A warm story of a boy who dreams beyond his circumstances — and finds dignity through education and friendship.",
      duration: "2.5 hours",
      screeningDate: "28 Feb 2026",
      targetAudience: "Youth & community",
      director: "Nila Madhab Panda",
      runtime: "87 min",
      language: "Hindi",
      category: "Narrative · Education",
      morals: [
        "Dreams deserve encouragement.",
        "Education opens new doors.",
        "Kindness builds community.",
        "Every child has a unique story.",
        "Friendship can change a life.",
        "Dignity belongs to everyone.",
      ],
      discussion:
        "After the film, volunteers sat with children in a circle. They talked about dreams, school, and the friends who help us stay hopeful.",
      impact: {
        participants: 95,
        response: "Very positive",
        discussionHeld: true,
      },
    },
    gallery: [
      {
        id: "mumbai-1",
        src: DAY2_IMAGES.screeningNightWide,
        alt: "Night-time open-air screening in Mumbai",
        caption: "A neighbourhood gathers as night falls",
        span: "wide",
      },
      {
        id: "mumbai-2",
        src: DAY2_IMAGES.communityGathering,
        alt: "Families arriving for a shared screening",
        caption: "Families and neighbours arriving",
        span: "regular",
      },
      {
        id: "mumbai-3",
        src: DAY2_IMAGES.crowdWatching,
        alt: "Crowd focused on the story on screen",
        caption: "Focused on the story unfolding",
        span: "tall",
      },
      {
        id: "mumbai-4",
        src: DAY2_IMAGES.projectorCrowd,
        alt: "Portable projector lighting faces in the crowd",
        caption: "Projector glow across the crowd",
        span: "wide",
      },
      {
        id: "mumbai-5",
        src: DAY2_IMAGES.childrenFront,
        alt: "Young viewers in the front row",
        caption: "Front-row young viewers",
        span: "regular",
      },
      {
        id: "mumbai-6",
        src: DAY2_IMAGES.familiesWatching,
        alt: "Families watching together",
        caption: "Watching together",
        span: "wide",
      },
      {
        id: "mumbai-7",
        src: DAY2_IMAGES.neighborhoodNight,
        alt: "Quiet street transformed into a cinema",
        caption: "A street becomes a cinema",
        span: "regular",
      },
    ],
  },
  {
    id: "loc-jaipur",
    slug: "jaipur",
    title: "Jaipur",
    location: "Jaipur",
    thumbnail: DAY2_IMAGES.screeningDayWide,
    description:
      "An afternoon-to-evening community screening in Jaipur with facilitated dialogue for children and parents.",
    ngo: "Desert Bloom Trust",
    movie: {
      name: "Chillar Party",
      poster: DAY2_IMAGES.screenGlow,
      synopsis:
        "A spirited story of children standing up for dignity, friendship, and the right to belong in their neighbourhood.",
      duration: "2 hours",
      screeningDate: "15 Mar 2026",
      targetAudience: "School children",
      director: "Nitesh Tiwari & Vikas Bahl",
      runtime: "135 min",
      language: "Hindi",
      category: "Narrative · Childhood",
      morals: [
        "Standing together creates change.",
        "Every child deserves respect.",
        "Friendship is a strength.",
        "Speaking up can protect others.",
        "Community begins with care.",
        "Courage can be shared.",
      ],
      discussion:
        "Children led parts of the reflection. Parents and teachers joined a short dialogue on belonging, fairness, and standing up for one another.",
      impact: {
        participants: 140,
        response: "Excellent",
        discussionHeld: true,
      },
    },
    gallery: [
      {
        id: "jaipur-1",
        src: DAY2_IMAGES.screeningDayWide,
        alt: "Setting up the screen before an afternoon film event",
        caption: "Afternoon setup before the screening",
        span: "regular",
      },
      {
        id: "jaipur-2",
        src: DAY2_IMAGES.audienceSeated,
        alt: "Children seated together waiting for the film",
        caption: "Waiting for the film to begin",
        span: "regular",
      },
      {
        id: "jaipur-3",
        src: DAY2_IMAGES.eveningAssembly,
        alt: "Evening assembly before the screening",
        caption: "Evening assembly",
        span: "wide",
      },
      {
        id: "jaipur-4",
        src: DAY2_IMAGES.screeningCircle,
        alt: "Community forming a circle around the outdoor screen",
        caption: "Circle around the outdoor screen",
        span: "regular",
      },
      {
        id: "jaipur-5",
        src: DAY2_IMAGES.openAirSetup,
        alt: "Volunteers preparing open-air cinema equipment",
        caption: "Volunteers preparing the open-air cinema",
        span: "regular",
      },
      {
        id: "jaipur-6",
        src: DAY2_IMAGES.screenOnTripod,
        alt: "Film on a portable screen under the trees",
        caption: "Portable screen under the trees",
        span: "tall",
      },
      {
        id: "jaipur-7",
        src: DAY2_IMAGES.screenGlow,
        alt: "Glow of the screen against the night sky",
        caption: "Screen glow against the night",
        span: "regular",
      },
      {
        id: "jaipur-8",
        src: DAY2_IMAGES.communityPortrait,
        alt: "Neighbours at a shared film evening",
        caption: "Neighbours who came out for the film",
        span: "regular",
      },
      {
        id: "jaipur-9",
        src: DAY2_IMAGES.youthWatching,
        alt: "Youth watching during a neighbourhood film night",
        caption: "Youth watching attentively",
        span: "regular",
      },
    ],
  },
  {
    id: "loc-pune",
    slug: "pune",
    title: "Pune",
    location: "Pune",
    thumbnail: DAY1_IMAGES.screenFilmScene,
    description:
      "A campus-linked community screening in Pune connecting students, children, and local organisers.",
    ngo: "Learning Light Society",
    movie: {
      name: "Stanley Ka Dabba",
      poster: DAY1_IMAGES.screenCloseUp,
      synopsis:
        "A tender classroom story about empathy, belonging, and the quiet courage of a child navigating everyday injustice.",
      duration: "2 hours",
      screeningDate: "05 Apr 2026",
      targetAudience: "Students & children",
      director: "Amole Gupte",
      runtime: "96 min",
      language: "Hindi",
      category: "Narrative · Empathy",
      morals: [
        "Empathy makes classrooms kinder.",
        "Every child deserves belonging.",
        "Small acts of care matter.",
        "Listening is a form of respect.",
        "Courage can be quiet and steady.",
        "No one should eat alone.",
      ],
      discussion:
        "Student volunteers facilitated a classroom-style reflection. Children spoke about kindness, sharing, and looking out for classmates who feel left out.",
      impact: {
        participants: 110,
        response: "Excellent",
        discussionHeld: true,
      },
    },
    gallery: [
      {
        id: "pune-1",
        src: DAY1_IMAGES.screenFilmScene,
        alt: "A story unfolds on the outdoor screen",
        caption: "A story unfolds outdoors",
        span: "regular",
      },
      {
        id: "pune-2",
        src: DAY1_IMAGES.screenCloseUp,
        alt: "Close-up of a film moment shared with the community",
        caption: "A shared film moment",
        span: "regular",
      },
      {
        id: "pune-3",
        src: DAY1_IMAGES.communityPair,
        alt: "A mother and child at a community gathering",
        caption: "Mother and child at the gathering",
        span: "regular",
      },
      {
        id: "pune-4",
        src: DAY1_IMAGES.familyEvening,
        alt: "A family sharing a warm moment after the screening",
        caption: "Warm moments after the screening",
        span: "tall",
      },
      {
        id: "pune-5",
        src: DAY1_IMAGES.youthGroupNight,
        alt: "Children and young people at an outdoor screening",
        caption: "Young people who joined the screening",
        span: "regular",
      },
      {
        id: "pune-6",
        src: DAY2_IMAGES.youthWatching,
        alt: "Youth watching during a film night",
        caption: "Attentive youth viewers",
        span: "regular",
      },
    ],
  },
  {
    id: "loc-lucknow",
    slug: "lucknow",
    title: "Lucknow",
    location: "Lucknow",
    thumbnail: DAY1_IMAGES.audienceGathered,
    description:
      "A community evening in Lucknow focused on childhood, dignity, and the right to learn.",
    ngo: "Ganga Path Foundation",
    movie: {
      name: "Nil Battey Sannata",
      poster: IMAGES.classroom,
      synopsis:
        "A moving story of a mother and daughter navigating aspiration, education, and the belief that learning can rewrite a future.",
      duration: "2 hours",
      screeningDate: "22 Apr 2026",
      targetAudience: "Children & parents",
      director: "Ashwiny Iyer Tiwari",
      runtime: "100 min",
      language: "Hindi",
      category: "Narrative · Education",
      morals: [
        "Education can change a family's path.",
        "Mothers and children can dream together.",
        "Hard work deserves support.",
        "Belief is the first step to learning.",
        "No dream is too small.",
        "School is worth fighting for.",
      ],
      discussion:
        "Parents and children reflected together on school, hope, and the everyday effort it takes to keep learning alive at home.",
      impact: {
        participants: 130,
        response: "Excellent",
        discussionHeld: true,
      },
    },
    gallery: [
      {
        id: "lucknow-1",
        src: DAY1_IMAGES.audienceGathered,
        alt: "Families seated for open-air cinema in Lucknow",
        caption: "Families gathering for the screening",
        span: "wide",
      },
      {
        id: "lucknow-2",
        src: DAY1_IMAGES.familyEvening,
        alt: "Family sharing a warm moment",
        caption: "Warm moments after the film",
        span: "regular",
      },
      {
        id: "lucknow-3",
        src: DAY1_IMAGES.youthGroupDusk,
        alt: "Youth at a community film evening",
        caption: "Youth celebrating at dusk",
        span: "regular",
      },
      {
        id: "lucknow-4",
        src: DAY1_IMAGES.projectorNight,
        alt: "Projector setup at night",
        caption: "Projection under the night sky",
        span: "tall",
      },
      {
        id: "lucknow-5",
        src: DAY2_IMAGES.childrenFront,
        alt: "Children in the front row",
        caption: "Front-row viewers",
        span: "regular",
      },
      {
        id: "lucknow-6",
        src: DAY2_IMAGES.communityPortrait,
        alt: "Community portrait after screening",
        caption: "Neighbours who came for the film",
        span: "regular",
      },
    ],
  },
];

export function getActivityLocationBySlug(
  slug: string,
): ActivityLocation | undefined {
  return ACTIVITY_LOCATIONS.find((l) => l.slug === slug);
}

export function getAllActivitySlugs(): string[] {
  return ACTIVITY_LOCATIONS.map((l) => l.slug);
}
