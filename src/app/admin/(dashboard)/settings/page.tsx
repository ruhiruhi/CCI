import { AdminHeader } from "@/components/admin/header";
import { SettingsEditor } from "@/components/admin/editors/settings-editor";
import { prisma } from "@/lib/prisma";

export default async function SettingsAdminPage() {
  let siteSettings: Record<string, unknown> = {};

  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: "site" } });
    if (row) siteSettings = row.value as Record<string, unknown>;
  } catch { /* DB not ready */ }

  return (
    <>
      <AdminHeader title="Settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <SettingsEditor initial={siteSettings} />
      </div>
    </>
  );
}
