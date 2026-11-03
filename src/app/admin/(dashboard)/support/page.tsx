import { AdminHeader } from "@/components/admin/header";
import { StatCard } from "@/components/admin/stat-card";
import { getSupportStats } from "@/lib/support-service";
import { Package, PackageOpen, PackageCheck, Clock } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function SupportAdminHomePage() {
  let stats = {
    totalItems: 0,
    openItems: 0,
    closedItems: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    completedRequests: 0,
  };
  try {
    stats = await getSupportStats();
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="Support Management" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/admin/support/items/new"
            className={cn(buttonVariants({ variant: "gold", size: "sm" }))}
          >
            Add Support Item
          </Link>
          <Link
            href="/admin/support/items"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Manage Items
          </Link>
          <Link
            href="/admin/support/requests"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Support Requests
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Items"
            value={stats.totalItems}
            icon={Package}
            detail="All support needs"
          />
          <StatCard
            label="Open Needs"
            value={stats.openItems}
            icon={PackageOpen}
            detail="Accepting pledges"
          />
          <StatCard
            label="Closed Needs"
            value={stats.closedItems}
            icon={PackageCheck}
            detail="Goals achieved"
          />
          <StatCard
            label="Pending Requests"
            value={stats.pendingRequests}
            icon={Clock}
            detail="Awaiting review"
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Approved"
            value={stats.approvedRequests}
            icon={Package}
            detail="Approved pledges"
          />
          <StatCard
            label="Completed"
            value={stats.completedRequests}
            icon={PackageCheck}
            detail="Counted toward goals"
          />
        </div>
      </div>
    </>
  );
}
