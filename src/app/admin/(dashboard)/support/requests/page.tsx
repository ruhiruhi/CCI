import { AdminHeader } from "@/components/admin/header";
import { SupportRequestsManager } from "@/components/admin/support-requests-manager";
import { prisma } from "@/lib/prisma";

export default async function SupportRequestsAdminPage() {
  let items: Awaited<
    ReturnType<
      typeof prisma.supportRequest.findMany<{
        include: { supportItem: true };
      }>
    >
  > = [];

  try {
    items = await prisma.supportRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { supportItem: true },
    });
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="Support Requests" />
      <div className="flex-1 overflow-y-auto p-6">
        <SupportRequestsManager items={items} />
      </div>
    </>
  );
}
