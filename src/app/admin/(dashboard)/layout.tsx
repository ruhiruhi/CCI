export const dynamic = "force-dynamic";

import { AdminSidebar } from "@/components/admin/sidebar";
import { DbOfflineBanner } from "@/components/admin/db-offline-banner";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DbOfflineBanner />
        {children}
      </div>
    </div>
  );
}
