import { AdminHeader } from "@/components/admin/header";
import { StatCard } from "@/components/admin/stat-card";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { Eye, Mail, Users, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AnalyticsAdminPage() {
  let visitors = 0;
  let subscribers = 0;

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    [visitors, subscribers] = await Promise.all([
      prisma.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
    ]);
  } catch { /* DB not ready */ }

  return (
    <>
      <AdminHeader title="Analytics" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Visitors (30d)" value={visitors.toLocaleString()} icon={Eye} />
          <StatCard label="Subscribers" value={subscribers} icon={Mail} />
          <StatCard label="Volunteers" value="—" icon={Users} detail="From volunteer module" />
          <StatCard label="Downloads" value="—" icon={Download} detail="Track PDF & resource downloads" />
        </div>
        <AnalyticsCharts />
      </div>
    </>
  );
}
