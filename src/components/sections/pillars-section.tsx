import { getPublishedPillars } from "@/lib/cms";
import { Pillars } from "@/components/sections/pillars";

export async function PillarsSection() {
  const pillars = await getPublishedPillars();
  return <Pillars pillars={pillars} />;
}
