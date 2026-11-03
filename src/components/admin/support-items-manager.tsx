"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, Search } from "lucide-react";
import { AdminDataTable, StatusBadge } from "@/components/admin/data-table";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  SUPPORT_ITEM_STATUS_LABELS,
  SUPPORT_PRIORITY_LABELS,
  remainingQuantity,
  type SupportItemStatusValue,
  type SupportPriorityValue,
} from "@/lib/support";

type ItemRow = {
  id: string;
  title: string;
  category: string;
  quantityNeeded: number;
  quantityReceived: number;
  unit: string;
  priority: string;
  status: string;
  createdAt: string | Date;
  image: string | null;
};

export function SupportItemsManager({ items }: { items: ItemRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(items);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (status && r.status !== status) return false;
      if (!q.trim()) return true;
      const needle = q.toLowerCase();
      return (
        r.title.toLowerCase().includes(needle) ||
        r.category.toLowerCase().includes(needle)
      );
    });
  }, [rows, q, status]);

  async function onDelete(id: string) {
    if (!confirm("Delete this support item and its requests?")) return;
    setError("");
    const res = await fetch(`/api/admin/support-items/${id}`, {
      method: "DELETE",
    });
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
            <Input
              className="pl-9"
              placeholder="Search items…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select
            className="h-10 rounded-lg border border-warm/12 bg-ink-soft px-3 text-sm text-warm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <Link
          href="/admin/support/items/new"
          className={cn(buttonVariants({ variant: "gold", size: "sm" }))}
        >
          <Plus className="h-4 w-4" /> Add item
        </Link>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <AdminDataTable
        rows={filtered}
        editHref={(r) => `/admin/support/items/${r.id}`}
        onDelete={onDelete}
        emptyMessage="No support items yet. Add your first need."
        columns={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          {
            key: "quantity",
            label: "Progress",
            render: (r) =>
              `${r.quantityReceived}/${r.quantityNeeded} ${r.unit} (rem ${remainingQuantity(r.quantityNeeded, r.quantityReceived)})`,
          },
          {
            key: "priority",
            label: "Priority",
            render: (r) =>
              SUPPORT_PRIORITY_LABELS[r.priority as SupportPriorityValue] ??
              r.priority,
          },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <StatusBadge
                status={
                  SUPPORT_ITEM_STATUS_LABELS[
                    r.status as SupportItemStatusValue
                  ] ?? r.status
                }
              />
            ),
          },
          {
            key: "createdAt",
            label: "Created",
            render: (r) => format(new Date(r.createdAt), "MMM d, yyyy"),
          },
        ]}
      />
    </div>
  );
}
