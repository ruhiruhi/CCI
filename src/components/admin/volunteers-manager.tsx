"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Download, Eye, Search, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/admin/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  VOLUNTEER_STATUSES,
  VOLUNTEER_STATUS_LABELS,
  type VolunteerStatusFilter,
} from "@/lib/volunteer";

export type VolunteerRow = {
  id: string;
  volunteerId: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string | null;
  profilePhoto: string | null;
  status: string;
  joinedAt: string | Date;
  createdAt: string | Date;
  notes: string | null;
};

type Stats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

export function VolunteersManager({
  initialItems,
  initialStats,
}: {
  initialItems: VolunteerRow[];
  initialStats: Stats;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialItems);
  const [stats, setStats] = useState(initialStats);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (status && r.status !== status) return false;
      if (!q.trim()) return true;
      const needle = q.toLowerCase();
      return (
        r.name.toLowerCase().includes(needle) ||
        r.email.toLowerCase().includes(needle) ||
        r.phone.toLowerCase().includes(needle) ||
        r.volunteerId.toLowerCase().includes(needle)
      );
    });
  }, [rows, q, status]);

  async function setStatusFor(id: string, next: VolunteerStatusFilter) {
    setBusyId(id);
    setError("");
    const res = await fetch(`/api/admin/volunteers/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    const data = (await res.json()) as { error?: string; item?: VolunteerRow };
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
    setStats((s) => {
      const prev = rows.find((r) => r.id === id)?.status;
      const nextStats = { ...s };
      if (prev === "PENDING") nextStats.pending = Math.max(0, nextStats.pending - 1);
      if (prev === "APPROVED") nextStats.approved = Math.max(0, nextStats.approved - 1);
      if (prev === "REJECTED") nextStats.rejected = Math.max(0, nextStats.rejected - 1);
      if (next === "PENDING") nextStats.pending += 1;
      if (next === "APPROVED") nextStats.approved += 1;
      if (next === "REJECTED") nextStats.rejected += 1;
      return nextStats;
    });
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this volunteer registration?")) return;
    setError("");
    const res = await fetch(`/api/admin/volunteers/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Delete failed.");
      return;
    }
    const removed = rows.find((r) => r.id === id);
    setRows((r) => r.filter((x) => x.id !== id));
    if (removed) {
      setStats((s) => {
        const next = { ...s, total: Math.max(0, s.total - 1) };
        if (removed.status === "PENDING") next.pending = Math.max(0, next.pending - 1);
        if (removed.status === "APPROVED") next.approved = Math.max(0, next.approved - 1);
        if (removed.status === "REJECTED") next.rejected = Math.max(0, next.rejected - 1);
        return next;
      });
    }
    router.refresh();
  }

  const cards = [
    { label: "Total Volunteers", value: stats.total },
    { label: "Pending", value: stats.pending },
    { label: "Approved", value: stats.approved },
    { label: "Rejected", value: stats.rejected },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-warm/10 bg-ink-soft/60 px-5 py-4"
          >
            <p className="text-xs uppercase tracking-wider text-mist">{c.label}</p>
            <p className="mt-2 font-display text-3xl text-warm">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
          <Input
            className="pl-9"
            placeholder="Search name, ID, email, phone…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-lg border border-warm/12 bg-ink-soft px-3 text-sm text-warm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {VOLUNTEER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {VOLUNTEER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-warm/10">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-warm/10 bg-ink/40 text-mist">
            <tr>
              <th className="px-4 py-3 font-medium">Photo</th>
              <th className="px-4 py-3 font-medium">Volunteer ID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Interest</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-mist">
                  No volunteer registrations yet.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="border-b border-warm/8 text-cloud">
                  <td className="px-4 py-3">
                    <span className="relative inline-flex h-9 w-9 overflow-hidden rounded-full ring-1 ring-gold/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={row.profilePhoto || "/logo.jpeg"}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gold">
                    {row.volunteerId}
                  </td>
                  <td className="px-4 py-3 text-warm">{row.name}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.phone}</td>
                  <td className="px-4 py-3">{row.interest}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    {format(
                      typeof row.joinedAt === "string"
                        ? new Date(row.joinedAt)
                        : row.joinedAt,
                      "dd MMM yyyy",
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Link href={`/admin/volunteers/${row.id}`}>
                        <Button type="button" variant="outline" size="sm">
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </Link>
                      {row.status !== "APPROVED" ? (
                        <Button
                          type="button"
                          size="sm"
                          disabled={busyId === row.id}
                          onClick={() => setStatusFor(row.id, "APPROVED")}
                        >
                          Approve
                        </Button>
                      ) : null}
                      {row.status !== "REJECTED" ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={busyId === row.id}
                          onClick={() => setStatusFor(row.id, "REJECTED")}
                        >
                          Reject
                        </Button>
                      ) : null}
                      <Link
                        href={`/volunteer/id-card/${row.id}`}
                        target="_blank"
                      >
                        <Button type="button" variant="outline" size="sm">
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(row.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
