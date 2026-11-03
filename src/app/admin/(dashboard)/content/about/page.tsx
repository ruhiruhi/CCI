import { AdminHeader } from "@/components/admin/header";
import { AboutEditor } from "@/components/admin/editors/about-editor";
import { prisma } from "@/lib/prisma";

export default async function AboutAdminPage() {
  let timeline: Awaited<ReturnType<typeof prisma.timelineItem.findMany>> = [];
  let pillars: Awaited<ReturnType<typeof prisma.pillar.findMany>> = [];

  try {
    [timeline, pillars] = await Promise.all([
      prisma.timelineItem.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.pillar.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="About Page" />
      <div className="flex-1 overflow-y-auto p-6">
        <p className="mb-6 max-w-2xl text-sm text-mist">
          Edit timeline and pillars used on the homepage and the About journey
          section. Changes publish immediately when saved.
        </p>
        <AboutEditor initialTimeline={timeline} initialPillars={pillars} />
      </div>
    </>
  );
}
