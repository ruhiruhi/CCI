"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminDataTable, StatusBadge } from "@/components/admin/data-table";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type GalleryRow = {
  id: string;
  caption: string;
  category: string;
  span: string;
  featured: boolean;
  status: string;
};

export function GalleryManager({ items }: { items: GalleryRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(items);
  const [error, setError] = useState("");

  async function onDelete(id: string) {
    if (!confirm("Delete this gallery item?")) return;
    setError("");
    const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
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
          href="/admin/content/gallery/new"
          className={cn(buttonVariants({ variant: "gold", size: "sm" }))}
        >
          <Plus className="h-4 w-4" /> New item
        </Link>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <AdminDataTable
        rows={rows}
        editHref={(g) => `/admin/content/gallery/${g.id}`}
        onDelete={onDelete}
        columns={[
          { key: "caption", label: "Caption" },
          { key: "category", label: "Category" },
          { key: "span", label: "Layout" },
          {
            key: "featured",
            label: "Featured",
            render: (g) => (g.featured ? "Yes" : "No"),
          },
          {
            key: "status",
            label: "Status",
            render: (g) => <StatusBadge status={g.status} />,
          },
        ]}
      />
    </div>
  );
}
