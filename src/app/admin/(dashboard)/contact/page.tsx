import { AdminHeader } from "@/components/admin/header";
import { AdminDataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

export default async function ContactAdminPage() {
  let contacts: Awaited<ReturnType<typeof prisma.contactSubmission.findMany>> =
    [];
  try {
    contacts = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    /* DB not ready */
  }

  return (
    <>
      <AdminHeader title="Contact Requests" />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminDataTable
          rows={contacts}
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            {
              key: "message",
              label: "Message",
              render: (c) => (
                <span className="line-clamp-2 max-w-xs">{c.message}</span>
              ),
            },
            {
              key: "read",
              label: "Status",
              render: (c) =>
                c.read ? (
                  <Badge>Read</Badge>
                ) : (
                  <Badge variant="gold">New</Badge>
                ),
            },
            {
              key: "createdAt",
              label: "Received",
              render: (c) =>
                formatDistanceToNow(c.createdAt, { addSuffix: true }),
            },
          ]}
        />
      </div>
    </>
  );
}
