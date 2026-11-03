import { isDatabaseAvailable } from "@/lib/db-status";

export async function DbOfflineBanner() {
  if (process.env.NODE_ENV !== "development") return null;
  if (await isDatabaseAvailable()) return null;

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-6 py-3 text-sm text-amber-100">
      <strong>Local database offline.</strong> You can browse the admin panel, but
      saving changes needs MySQL running. Use{" "}
      <code className="rounded bg-black/20 px-1">npm run db:setup</code> after
      starting MySQL, or manage content on the live VPS admin.
    </div>
  );
}
