import { AdminHeader } from "@/components/admin/header";
import { SupportItemsManager } from "@/components/admin/support-items-manager";
import { prisma } from "@/lib/prisma";

export default async function SupportItemsAdminPage() {
  let items: Awaited<ReturnType<typeof prisma.supportItem.findMany>> = [];
  try {
    items = await prisma.supportItem.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="Manage Support Items" />
      <div className="flex-1 overflow-y-auto p-6">
        <SupportItemsManager items={items} />
      </div>
    </>
  );
}
