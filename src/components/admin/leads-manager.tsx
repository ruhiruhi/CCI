"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Download,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUSES,
  type LeadStatusValue,
} from "@/lib/leads";

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string | null;
  organization: string | null;
  interest: string;
  message: string | null;
  sourcePage: string | null;
  buttonName: string | null;
  pageUrl: string | null;
  status: LeadStatusValue;
  remarks: string | null;
  createdAt: string;
};

type Stats = {
  total: number;
  today: number;
  new: number;
  contacted: number;
  inProgress: number;
  converted: number;
  closed: number;
};

type ListResponse = {
  rows: LeadRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: Stats;
};

const emptyStats: Stats = {
  total: 0,
  today: 0,
  new: 0,
  contacted: 0,
  inProgress: 0,
  converted: 0,
  closed: 0,
};

function statusVariant(status: LeadStatusValue) {
  if (status === "NEW") return "gold" as const;
  if (status === "CONVERTED") return "default" as const;
  return "default" as const;
}

export function LeadsManager() {
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (status) p.set("status", status);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    p.set("page", String(page));
    p.set("pageSize", "20");
    p.set("sort", sort);
    p.set("order", order);
    return p.toString();
  }, [q, status, from, to, page, sort, order]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads?${queryString}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to load leads");
        return;
      }
      setData(json as ListResponse);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (selected) setRemarks(selected.remarks ?? "");
  }, [selected]);

  async function updateSelected(patch: {
    status?: LeadStatusValue;
    remarks?: string;
  }) {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error ?? "Update failed");
        return;
      }
      setSelected(json.lead);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function removeLead(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error ?? "Delete failed");
      return;
    }
    if (selected?.id === id) setSelected(null);
    await load();
  }

  function exportFile(format: "csv" | "excel") {
    const p = new URLSearchParams(queryString);
    p.set("export", format);
    p.set("pageSize", "5000");
    window.location.href = `/api/admin/leads?${p.toString()}`;
  }

  const stats = data?.stats ?? emptyStats;
  const rows = data?.rows ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Leads", value: stats.total },
          { label: "Today's Leads", value: stats.today },
          { label: "New", value: stats.new },
          { label: "Contacted", value: stats.contacted },
          { label: "Converted", value: stats.converted },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-warm/10 bg-charcoal/40 p-4"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-mist">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl font-light text-gold">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-warm/10 bg-charcoal/30 p-4">
        <label className="min-w-[12rem] flex-1">
          <span className="mb-1 block text-xs text-mist">Search</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
            <input
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
              placeholder="Name, email, phone…"
              className="h-10 w-full rounded-lg border border-warm/10 bg-ink/50 pl-9 pr-3 text-sm text-warm outline-none focus:border-gold/40"
            />
          </div>
        </label>
        <label>
          <span className="mb-1 block text-xs text-mist">Status</span>
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="h-10 rounded-lg border border-warm/10 bg-ink/50 px-3 text-sm text-warm outline-none"
          >
            <option value="">All</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-xs text-mist">From</span>
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setPage(1);
              setFrom(e.target.value);
            }}
            className="h-10 rounded-lg border border-warm/10 bg-ink/50 px-3 text-sm text-warm outline-none"
          />
        </label>
        <label>
          <span className="mb-1 block text-xs text-mist">To</span>
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setPage(1);
              setTo(e.target.value);
            }}
            className="h-10 rounded-lg border border-warm/10 bg-ink/50 px-3 text-sm text-warm outline-none"
          />
        </label>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-warm/15 px-3 text-sm text-cloud hover:border-gold/40 hover:text-warm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
        <button
          type="button"
          onClick={() => exportFile("csv")}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-warm/15 px-3 text-sm text-cloud hover:border-gold/40 hover:text-warm"
        >
          <Download className="h-3.5 w-3.5" />
          CSV
        </button>
        <button
          type="button"
          onClick={() => exportFile("excel")}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-warm/15 px-3 text-sm text-cloud hover:border-gold/40 hover:text-warm"
        >
          <Download className="h-3.5 w-3.5" />
          Excel
        </button>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-warm/8">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-warm/8 bg-charcoal/50">
              {[
                ["name", "Name"],
                ["interest", "Interest"],
                ["status", "Status"],
                ["createdAt", "Date"],
              ].map(([key, label]) => (
                <th key={key} className="px-4 py-3 text-xs uppercase tracking-wider text-mist">
                  <button
                    type="button"
                    className="hover:text-gold"
                    onClick={() => {
                      if (sort === key) setOrder(order === "asc" ? "desc" : "asc");
                      else {
                        setSort(key);
                        setOrder("desc");
                      }
                    }}
                  >
                    {label}
                    {sort === key ? (order === "asc" ? " ↑" : " ↓") : ""}
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 text-xs uppercase tracking-wider text-mist">
                Phone
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-wider text-mist">
                Email
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-wider text-mist">
                Button
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-wider text-mist">
                Source
              </th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-mist">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-mist">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-mist">
                  No leads found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-warm/6 hover:bg-charcoal/30"
                >
                  <td className="px-4 py-3 text-warm">{row.name}</td>
                  <td className="px-4 py-3 text-cloud">{row.interest}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(row.status)}>
                      {LEAD_STATUS_LABELS[row.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-cloud">
                    {format(new Date(row.createdAt), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3 text-cloud">{row.phone}</td>
                  <td className="px-4 py-3 text-cloud">{row.email}</td>
                  <td className="px-4 py-3 text-cloud">{row.buttonName ?? "—"}</td>
                  <td className="px-4 py-3 text-cloud">{row.sourcePage ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-warm/10 text-mist hover:border-gold/30 hover:text-gold"
                        aria-label="View"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeLead(row.id)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-warm/10 text-mist hover:border-red-500/30 hover:text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-mist">
          <span>
            Page {data.page} of {data.totalPages} · {data.total} leads
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-warm/15 px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-warm/15 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90svh] w-full max-w-xl overflow-y-auto rounded-2xl border border-warm/12 bg-charcoal p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="kicker mb-1">Lead details</p>
                <h3 className="font-display text-2xl font-light text-warm">
                  {selected.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-sm text-mist hover:text-warm"
              >
                Close
              </button>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["City", selected.city ?? "—"],
                ["Organization", selected.organization ?? "—"],
                ["Interest", selected.interest],
                ["Button", selected.buttonName ?? "—"],
                ["Source", selected.sourcePage ?? "—"],
                ["URL", selected.pageUrl ?? "—"],
                ["Message", selected.message ?? "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-[0.16em] text-mist">
                    {k}
                  </dt>
                  <dd className="mt-1 text-cloud">{v}</dd>
                </div>
              ))}
            </dl>

            <label className="mt-6 block">
              <span className="mb-1 block text-xs text-mist">Status</span>
              <select
                value={selected.status}
                disabled={saving}
                onChange={(e) =>
                  void updateSelected({
                    status: e.target.value as LeadStatusValue,
                  })
                }
                className="h-10 w-full rounded-lg border border-warm/10 bg-ink/50 px-3 text-sm text-warm"
              >
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {LEAD_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block">
              <span className="mb-1 block text-xs text-mist">
                Internal notes
              </span>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-warm/10 bg-ink/50 px-3 py-2 text-sm text-warm"
              />
            </label>

            <button
              type="button"
              disabled={saving}
              onClick={() => void updateSelected({ remarks })}
              className="btn-cci-primary mt-4 h-11 px-5 text-sm disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save notes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
