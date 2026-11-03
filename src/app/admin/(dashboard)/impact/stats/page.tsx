import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { prisma } from "@/lib/prisma";

export default async function ImpactStatsAdminPage() {
  let stats: Awaited<ReturnType<typeof prisma.stat.findMany>> = [];
  try {
    stats = await prisma.stat.findMany({ orderBy: { sortOrder: "asc" } });
  } catch { /* DB not ready */ }

  return (
    <>
      <AdminHeader title="Impact Statistics" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex justify-end">
          <Link href="/admin/content/homepage" className={buttonVariants({ variant: "gold" })}>
            Edit on Homepage
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle className="font-display text-3xl font-light">
                  {s.prefix}{s.value.toLocaleString()}{s.suffix}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-warm">{s.label}</p>
                <p className="text-sm text-mist">{s.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
