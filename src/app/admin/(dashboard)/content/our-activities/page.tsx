import { AdminHeader } from "@/components/admin/header";
import { ActivitiesEditor } from "@/components/admin/editors/activities-editor";
import { prisma } from "@/lib/prisma";
import {
  ACTIVITY_LOCATIONS,
  type ActivityLocation,
} from "@/lib/activities";

export default async function OurActivitiesAdminPage() {
  let locations: ActivityLocation[] = ACTIVITY_LOCATIONS;
  let status = "PUBLISHED";

  try {
    const row = await prisma.pageContent.findFirst({
      where: { page: "our-activities" },
      orderBy: { updatedAt: "desc" },
    });
    if (row?.sections) {
      const sections = row.sections as { locations?: ActivityLocation[] };
      if (Array.isArray(sections.locations) && sections.locations.length > 0) {
        locations = sections.locations;
      }
      status = row.status;
    }
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="Our Activities" />
      <div className="flex-1 overflow-y-auto p-6">
        <p className="mb-6 max-w-2xl text-sm text-mist">
          Manage screening locations and movie reports shown on /our-activities.
        </p>
        <ActivitiesEditor
          initialLocations={locations}
          initialStatus={status}
        />
      </div>
    </>
  );
}
