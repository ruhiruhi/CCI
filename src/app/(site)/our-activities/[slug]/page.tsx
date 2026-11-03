import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { img } from "@/lib/data";
import {
  getAllActivitySlugs,
  getActivityLocationBySlug,
  getGallery,
} from "@/lib/activities";
import {
  getPublishedActivityLocation,
  getPublishedActivityLocations,
} from "@/lib/cms";
import { Reveal, TextReveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { MovieInfoCard } from "@/components/activities/movie-info-card";
import { LearningPoints } from "@/components/activities/learning-points";
import { DiscussionSection } from "@/components/activities/discussion-section";
import { ImpactCard } from "@/components/activities/impact-card";
import { ActivityGallery } from "@/components/activities/activity-gallery";
import { RelatedLocations } from "@/components/activities/related-locations";
import { CtaBand } from "@/components/sections/cta-band";

export function generateStaticParams() {
  return getAllActivitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity =
    (await getPublishedActivityLocation(slug)) ??
    getActivityLocationBySlug(slug);
  if (!activity) return { title: "Location not found" };

  const title = `Activities in ${activity.title}`;
  const description =
    activity.description ||
    `${activity.movie.name} screening in ${activity.location} with Conscious Cinema Initiative.`;
  const ogImage = img(activity.thumbnail, 1200);

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Conscious Cinema Initiative`,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: activity.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ActivityLocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity =
    (await getPublishedActivityLocation(slug)) ??
    getActivityLocationBySlug(slug);
  if (!activity) notFound();

  const gallery = getGallery(activity);
  const all = await getPublishedActivityLocations();
  const related = all.filter((l) => l.slug !== activity.slug).slice(0, 3);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://consciouscine.org/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Activities & Events",
        item: "https://consciouscine.org/our-activities",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: activity.title,
        item: `https://consciouscine.org/our-activities/${activity.slug}`,
      },
    ],
  };

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${activity.movie.name} screening — ${activity.location}`,
    description: activity.description,
    image: img(activity.thumbnail, 1200),
    startDate: activity.movie.screeningDate,
    location: {
      "@type": "Place",
      name: activity.location,
      address: activity.location,
    },
    organizer: activity.ngo
      ? { "@type": "Organization", name: activity.ngo }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      {/* Hero — unchanged structure */}
      <section className="relative flex min-h-[42svh] items-end overflow-hidden grain md:min-h-[48svh]">
        <Image
          src={img(activity.thumbnail, 2000, 80)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-ambient object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_10%,transparent_40%,var(--color-ink)_100%)]" />

        <div className="shell relative z-10 pb-10 pt-24 md:pb-12 md:pt-28">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-cloud">
                <li>
                  <Link
                    href="/our-activities"
                    className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Activities & Events
                  </Link>
                </li>
                <li aria-hidden className="text-mist">
                  /
                </li>
                <li className="text-warm" aria-current="page">
                  {activity.title}
                </li>
              </ol>
            </nav>
          </Reveal>
          <Reveal>
            <p className="kicker mb-6">Activity report</p>
          </Reveal>
          <h1 className="max-w-4xl font-display text-[clamp(2.6rem,8vw,5.5rem)] font-light leading-[0.98] tracking-tight text-warm">
            <TextReveal lines={[activity.title]} delay={0.1} />
          </h1>
          {activity.description && (
            <Reveal delay={0.25}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-cloud/85">
                {activity.description}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.35}>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm uppercase tracking-[0.18em] text-mist">
              <span>
                {gallery.length} {gallery.length === 1 ? "image" : "images"}
              </span>
              {activity.movie.screeningDate && (
                <>
                  <span aria-hidden className="text-gold/50">
                    ·
                  </span>
                  <span>{activity.movie.screeningDate}</span>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Below hero, above gallery */}
      <MovieInfoCard activity={activity} />
      <LearningPoints morals={activity.movie.morals} />
      <DiscussionSection discussion={activity.movie.discussion} />
      <ImpactCard activity={activity} />

      {/* Gallery — existing layout preserved */}
      <section className="section-pad bg-section-warm">
        <div className="shell">
          <SectionHeading
            kicker="Gallery"
            titleLines={["Moments from", "the field."]}
            goldLineIndex={1}
            intro="Tap any image to open the lightbox. Use arrow keys to navigate."
          />
          <div className="mt-8">
            <ActivityGallery images={gallery} />
          </div>
        </div>
      </section>

      <RelatedLocations locations={related} />

      <CtaBand
        kicker="Join the movement"
        titleLines={["Invite CCI to your", "city next."]}
        body="Host a screening or workshop and add your community to the activity map."
        image={activity.thumbnail}
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "All locations", href: "/our-activities" }}
      />
    </>
  );
}
