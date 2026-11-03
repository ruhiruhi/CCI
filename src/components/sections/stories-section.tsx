import { getPublishedStories } from "@/lib/cms";
import { StoriesShowcase } from "@/components/sections/stories-showcase";

export async function StoriesSection() {
  const stories = await getPublishedStories();
  return <StoriesShowcase stories={stories} />;
}
