import { AdminHeader } from "@/components/admin/header";
import { CatalogueEditor } from "@/components/admin/editors/catalogue-editor";
import { prisma } from "@/lib/prisma";
import { CATALOGUE_CONTENT, type CatalogueContent } from "@/lib/catalogue";

export default async function CatalogueAdminPage() {
  let content: CatalogueContent = CATALOGUE_CONTENT;
  let status = "PUBLISHED";

  try {
    const row = await prisma.pageContent.findFirst({
      where: { page: "catalogue" },
      orderBy: { updatedAt: "desc" },
    });
    if (row?.sections) {
      content = row.sections as CatalogueContent;
      status = row.status;
    }
  } catch {
    /* DB not ready — fall back to seed content */
  }

  return (
    <>
      <AdminHeader title="Catalogue" />
      <div className="flex-1 overflow-y-auto p-6">
        <p className="mb-6 max-w-2xl text-sm text-mist">
          Manage the public /catalogue page: hero, categories, films, tracks, and
          programme timeline.
        </p>
        <CatalogueEditor initial={content} initialStatus={status} />
      </div>
    </>
  );
}
