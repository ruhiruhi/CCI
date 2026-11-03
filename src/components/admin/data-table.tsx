import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

export function AdminDataTable<T extends { id: string }>({
  columns,
  rows,
  editHref,
  onDelete,
  emptyMessage = "No items found.",
}: {
  columns: Column<T>[];
  rows: T[];
  editHref?: (row: T) => string;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-mist">{emptyMessage}</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-warm/8">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-warm/8 bg-charcoal/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-mist"
              >
                {col.label}
              </th>
            ))}
            {(editHref || onDelete) && (
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-mist">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-warm/6 transition-colors hover:bg-charcoal/30"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-cloud">
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
              {(editHref || onDelete) && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {editHref && (
                      <Link
                        href={editHref(row)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-warm/10 text-mist transition-colors hover:border-gold/30 hover:text-gold"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(row.id)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-warm/10 text-mist transition-colors hover:border-red-500/30 hover:text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "PUBLISHED" || status === "APPROVED" || status === "ACTIVE"
      ? "success"
      : status === "PENDING" || status === "DRAFT"
        ? "warning"
        : status === "REJECTED" || status === "TRASH"
          ? "danger"
          : "default";
  return <Badge variant={variant}>{status}</Badge>;
}
