import { getPublishedHero } from "@/lib/cms";
import { Hero, type HeroContent } from "@/components/home/hero";

function normalizeHero(
  hero: Awaited<ReturnType<typeof getPublishedHero>>,
): HeroContent {
  const headline = Array.isArray(hero.headline)
    ? (hero.headline as string[])
    : ["Every screening begins", "a conversation."];

  const ctaPrimary =
    hero.ctaPrimary &&
    typeof hero.ctaPrimary === "object" &&
    "label" in (hero.ctaPrimary as object)
      ? (hero.ctaPrimary as { label: string; href: string })
      : { label: "Join the Movement", href: "/support" };

  const ctaSecondary =
    hero.ctaSecondary &&
    typeof hero.ctaSecondary === "object" &&
    "label" in (hero.ctaSecondary as object)
      ? (hero.ctaSecondary as { label: string; href: string })
      : { label: "Discover Our Story", href: "/about" };

  return {
    kicker: "kicker" in hero ? String(hero.kicker) : "Conscious Cinema Initiative",
    headline,
    subheading: String(hero.subheading),
    backgroundImage:
      "backgroundImage" in hero && hero.backgroundImage
        ? String(hero.backgroundImage)
        : undefined,
    ctaPrimary,
    ctaSecondary,
  };
}

export async function HeroSection() {
  const hero = normalizeHero(await getPublishedHero());
  return <Hero {...hero} />;
}
