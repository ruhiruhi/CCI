import { AdminHeader } from "@/components/admin/header";
import { SupportItemEditor } from "@/components/admin/editors/support-item-editor";

export default function NewSupportItemPage() {
  return (
    <>
      <AdminHeader title="Add Support Item" />
      <div className="flex-1 overflow-y-auto p-6">
        <SupportItemEditor initial={null} />
      </div>
    </>
  );
}
