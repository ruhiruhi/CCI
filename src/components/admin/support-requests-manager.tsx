"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { AdminDataTable, StatusBadge } from "@/components/admin/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SUPPORT_REQUEST_STATUS_LABELS,
  type SupportRequestStatusValue,
} from "@/lib/support";

type RequestRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  quantityToDonate: number;
  status: string;
  createdAt: string | Date;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  message: string | null;
  supportItem: {
    id: string;
    title: string;
    image: string | null;
    unit: string;
  };
};

export function SupportRequestsManager({ items }: { items: RequestRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(items);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<RequestRow | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (status && r.status !== status) return false;
      if (!q.trim()) return true;
      const needle = q.toLowerCase();
      return (
        r.fullName.toLowerCase().includes(needle) ||
        r.email.toLowerCase().includes(needle) ||
        r.phone.toLowerCase().includes(needle) ||
        r.supportItem.title.toLowerCase().includes(needle)
      );
    });
  }, [rows, q, status]);

  async function setRequestStatus(
    id: string,
    next: SupportRequestStatusValue,
  ) {
    setBusyId(id);
    setError("");
    const res = await fetch(`/api/admin/support-requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    const data = (await res.json()) as {
      error?: string;
      item?: RequestRow;
    };
    setBusyId(null);
    if (!res.ok) {
      setError(data.error ?? "Update failed.");
      return;
    }
    if (data.item) {
      setRows((list) => list.map((r) => (r.id === id ? { ...r, ...data.item! } : r)));
    } else {
      setRows((list) =>
        list.map((r) => (r.id === id ? { ...r, status: next } : r)),
      );
    }
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this support request?")) return;
    setError("");
    const res = await fetch(`/api/admin/support-requests/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Delete failed.");
      return;
    }
    setRows((r) => r.filter((x) => x.id !== id));
    if (viewing?.id === id) setViewing(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
          <Input
            className="pl-9"
            placeholder="Search requests…"
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
          {Object.entries(SUPPORT_REQUEST_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <AdminDataTable
        rows={filtered}
        onDelete={onDelete}
        emptyMessage="No support requests yet."
        columns={[
          {
            key: "item",
            label: "Item",
            render: (r) => (
              <Link
                href={`/admin/support/items/${r.supportItem.id}`}
                className="text-gold hover:underline"
              >
                {r.supportItem.title}
              </Link>
            ),
          },
          { key: "fullName", label: "Donor" },
          { key: "phone", label: "Phone" },
          { key: "email", label: "Email" },
          {
            key: "qty",
            label: "Qty",
            render: (r) =>
              `${r.quantityToDonate} ${r.supportItem.unit}`,
          },
          {
            key: "createdAt",
            label: "Date",
            render: (r) => format(new Date(r.createdAt), "MMM d, yyyy"),
          },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <StatusBadge
                status={
                  SUPPORT_REQUEST_STATUS_LABELS[
                    r.status as SupportRequestStatusValue
                  ] ?? r.status
                }
              />
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (r) => (
              <div className="flex flex-wrap gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busyId === r.id}
                  onClick={() => setViewing(r)}
                >
                  View
                </Button>
                {r.status !== "APPROVED" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busyId === r.id}
                    onClick={() => setRequestStatus(r.id, "APPROVED")}
                  >
                    Approve
                  </Button>
                ) : null}
                {r.status !== "REJECTED" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busyId === r.id}
                    onClick={() => setRequestStatus(r.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                ) : null}
                {r.status !== "COMPLETED" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="gold"
                    disabled={busyId === r.id}
                    onClick={() => setRequestStatus(r.id, "COMPLETED")}
                  >
                    Complete
                  </Button>
                ) : null}
              </div>
            ),
          },
        ]}
      />

      {viewing ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-md"
          onClick={() => setViewing(null)}
        >
          <div
            className="max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-2xl border border-warm/12 bg-charcoal p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl font-light text-warm">
              {viewing.fullName}
            </h3>
            <p className="mt-1 text-sm text-gold">{viewing.supportItem.title}</p>
            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Email", viewing.email],
                ["Phone", viewing.phone],
                [
                  "Quantity",
                  `${viewing.quantityToDonate} ${viewing.supportItem.unit}`,
                ],
                ["Address", viewing.address],
                ["City", viewing.city],
                ["State", viewing.state],
                ["Country", viewing.country],
                ["Pincode", viewing.pincode],
                ["Message", viewing.message || "—"],
                [
                  "Status",
                  SUPPORT_REQUEST_STATUS_LABELS[
                    viewing.status as SupportRequestStatusValue
                  ] ?? viewing.status,
                ],
                [
                  "Submitted",
                  format(new Date(viewing.createdAt), "PPpp"),
                ],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7rem_1fr] gap-2">
                  <dt className="text-mist">{k}</dt>
                  <dd className="text-cloud">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex justify-end">
              <Button type="button" variant="outline" onClick={() => setViewing(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
