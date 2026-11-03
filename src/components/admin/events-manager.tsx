"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { AdminDataTable, StatusBadge } from "@/components/admin/data-table";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type EventRow = {
  id: string;
  title: string;
  date: string | Date;
  city: string;
  type: string;
  status: string;
};

export function EventsManager({ items }: { items: EventRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(items);
  const [error, setError] = useState("");

  async function onDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    setError("");
    const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Delete failed.");
      return;
    }
    setRows((r) => r.filter((x) => x.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/admin/content/events/new"
          className={cn(buttonVariants({ variant: "gold", size: "sm" }))}
        >
          <Plus className="h-4 w-4" /> New event
        </Link>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <AdminDataTable
        rows={rows}
        editHref={(e) => `/admin/content/events/${e.id}`}
        onDelete={onDelete}
        columns={[
          { key: "title", label: "Title" },
          {
            key: "date",
            label: "Date",
            render: (e) => format(new Date(e.date), "MMM d, yyyy"),
          },
          { key: "city", label: "City" },
          { key: "type", label: "Type" },
          {
            key: "status",
            label: "Status",
            render: (e) => <StatusBadge status={e.status} />,
          },
        ]}
      />
    </div>
  );
}
