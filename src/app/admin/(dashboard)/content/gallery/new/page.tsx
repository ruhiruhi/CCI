import { AdminHeader } from "@/components/admin/header";
import { GalleryEditor } from "@/components/admin/editors/gallery-editor";

export default function GalleryNewPage() {
  return (
    <>
      <AdminHeader title="New gallery item" />
      <div className="flex-1 overflow-y-auto p-6">
        <GalleryEditor initial={null} />
      </div>
    </>
  );
}
