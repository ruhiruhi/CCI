import { AdminHeader } from "@/components/admin/header";
import { LeadsManager } from "@/components/admin/leads-manager";

export default function AdminLeadsPage() {
  return (
    <>
      <AdminHeader title="Lead Management" />
      <div className="flex-1 overflow-y-auto p-6">
        <LeadsManager />
      </div>
    </>
  );
}
