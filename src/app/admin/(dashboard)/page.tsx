import Link from "next/link";
import {
  Users,
  Film,
  Calendar,
  Image,
  Handshake,
  Mail,
  MessageSquare,
  Eye,
  Plus,
  Clock,
  Heart,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats } from "@/lib/cms";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

export default async function AdminDashboardPage() {
  let stats = {
    visitors: 0,
    projects: 0,
    events: 0,
    galleryImages: 0,
    volunteers: 0,
    partners: 0,
    subscribers: 0,
    contacts: 0,
    pendingApprovals: 0,
    unreadContacts: 0,
    supportOpen: 0,
    supportPending: 0,
  };

  let recentContacts: Awaited<
    ReturnType<typeof prisma.contactSubmission.findMany>
  > = [];
  let recentActivity: Awaited<
    ReturnType<
      typeof prisma.activityLog.findMany<{
        include: { user: { select: { name: true; email: true } } };
      }>
    >
  > = [];

  try {
    stats = await getDashboardStats();
    recentContacts = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    recentActivity = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true, email: true } } },
    });
  } catch {
    /* DB not configured yet */
  }

  const quickActions = [
    { label: "Add Support Need", href: "/admin/support/items/new", icon: Plus },
    { label: "Support Requests", href: "/admin/support/requests", icon: Heart },
    { label: "Add Event", href: "/admin/content/events", icon: Calendar },
    { label: "View Analytics", href: "/admin/analytics", icon: Eye },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Visitors (30d)"
            value={stats.visitors.toLocaleString()}
            icon={Eye}
            detail="Page views last 30 days"
          />
          <StatCard
            label="Projects"
            value={stats.projects}
            icon={Film}
            detail="Published projects"
          />
          <StatCard
            label="Events"
            value={stats.events}
            icon={Calendar}
            detail="Upcoming & past events"
          />
          <StatCard
            label="Gallery"
            value={stats.galleryImages}
            icon={Image}
            detail="Published images"
          />
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Volunteers"
            value={stats.volunteers}
            icon={Users}
            detail={`${stats.pendingApprovals} pending approval`}
          />
          <StatCard
            label="Partners"
            value={stats.partners}
            icon={Handshake}
          />
          <StatCard
            label="Subscribers"
            value={stats.subscribers}
            icon={Mail}
          />
          <StatCard
            label="Contact Requests"
            value={stats.contacts}
            icon={MessageSquare}
            detail={`${stats.unreadContacts} unread`}
          />
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Open Support Needs"
            value={stats.supportOpen}
            icon={Heart}
            detail="Items accepting pledges"
          />
          <StatCard
            label="Pending Support Pledges"
            value={stats.supportPending}
            icon={Clock}
            detail="Awaiting admin review"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Latest Contact Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {recentContacts.length === 0 ? (
                <p className="py-8 text-center text-sm text-mist">
                  No contact requests yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentContacts.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-start justify-between gap-4 rounded-lg border border-warm/6 bg-ink-soft/50 p-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-warm">{c.name}</p>
                          {!c.read && <Badge variant="gold">New</Badge>}
                        </div>
                        <p className="text-xs text-mist">{c.email}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-cloud">
                          {c.message}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-ash">
                        {formatDistanceToNow(c.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Link
                href="/admin/contact"
                className="mt-4 inline-block text-sm text-gold hover:text-gold-soft"
              >
                View all requests →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 rounded-lg border border-warm/6 bg-ink-soft/50 px-4 py-3 text-sm text-cloud transition-colors hover:border-gold/20 hover:text-gold"
                  >
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="py-6 text-center text-sm text-mist">
                Activity will appear here as you manage content.
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between gap-4 border-b border-warm/6 pb-3 last:border-0"
                  >
                    <div>
                      <p className="text-sm text-warm">
                        <span className="text-gold">{log.action}</span>{" "}
                        {log.entity}
                      </p>
                      <p className="text-xs text-mist">
                        {log.user?.name ?? log.user?.email ?? "System"}
                      </p>
                    </div>
                    <span className="text-xs text-ash">
                      {formatDistanceToNow(log.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
