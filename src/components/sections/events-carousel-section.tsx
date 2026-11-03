import { getPublishedEvents } from "@/lib/cms";
import { EventsCarousel } from "@/components/sections/events-carousel";

export async function EventsCarouselSection() {
  const events = await getPublishedEvents();
  return <EventsCarousel events={events} />;
}
