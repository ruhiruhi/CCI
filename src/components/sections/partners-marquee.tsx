import { getPublishedPartners } from "@/lib/cms";
import { Marquee } from "@/components/sections/marquee";

export async function PartnersMarquee() {
  const partners = await getPublishedPartners();
  return <Marquee items={partners} />;
}
