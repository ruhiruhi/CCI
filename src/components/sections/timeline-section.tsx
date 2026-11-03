import { getPublishedTimeline } from "@/lib/cms";
import { Timeline } from "@/components/sections/timeline";

export async function TimelineSection() {
  const items = await getPublishedTimeline();
  return <Timeline items={items} />;
}
