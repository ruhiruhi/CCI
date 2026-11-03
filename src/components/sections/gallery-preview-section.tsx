import { getPublishedGallery } from "@/lib/cms";
import { GalleryPreview } from "@/components/sections/gallery-preview";

export async function GalleryPreviewSection() {
  const items = await getPublishedGallery();
  return <GalleryPreview items={items} />;
}
