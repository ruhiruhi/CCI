import { AdminHeader } from "@/components/admin/header";
import { AdminDataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

export default async function NewsletterAdminPage() {
  let subscribers: Awaited<
    ReturnType<typeof prisma.newsletterSubscriber.findMany>
  > = [];
  try {
    subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="Newsletter Subscribers" />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminDataTable
          rows={subscribers}
          columns={[
            { key: "email", label: "Email" },
            { key: "name", label: "Name", render: (s) => s.name ?? "—" },
            {
              key: "active",
              label: "Status",
              render: (s) =>
                s.active ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="danger">Unsubscribed</Badge>
                ),
            },
            {
              key: "createdAt",
              label: "Subscribed",
              render: (s) =>
                formatDistanceToNow(s.createdAt, { addSuffix: true }),
            },
          ]}
        />
      </div>
    </>
  );
}
