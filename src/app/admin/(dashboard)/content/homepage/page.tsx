import { AdminHeader } from "@/components/admin/header";
import { HomepageEditor } from "@/components/admin/editors/homepage-editor";
import { prisma } from "@/lib/prisma";

export default async function HomepageAdminPage() {
  let hero = null;
  let stats: Awaited<ReturnType<typeof prisma.stat.findMany>> = [];

  try {
    hero = await prisma.heroSection.findFirst({
      orderBy: { updatedAt: "desc" },
    });
    stats = await prisma.stat.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="Homepage" />
      <div className="flex-1 overflow-y-auto p-6">
        <HomepageEditor initialHero={hero} initialStats={stats} />
      </div>
    </>
  );
}
