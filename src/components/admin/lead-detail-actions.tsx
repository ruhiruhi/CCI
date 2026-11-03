"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUSES,
  type LeadStatusValue,
} from "@/lib/leads";

export function LeadDetailActions({
  id,
  status,
  remarks: initialRemarks,
}: {
  id: string;
  status: LeadStatusValue;
  remarks: string;
}) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [remarks, setRemarks] = useState(initialRemarks);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus, remarks }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error ?? "Update failed");
        return;
      }
      setMessage("Saved");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this lead permanently?")) return;
    const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      setMessage(json.error ?? "Delete failed");
      return;
    }
    router.push("/admin/leads");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-warm/10 bg-charcoal/40 p-6">
      <p className="text-sm font-medium text-warm">Manage lead</p>
      <label className="mt-4 block">
        <span className="mb-1 block text-xs text-mist">Status</span>
        <select
          value={currentStatus}
          onChange={(e) => setCurrentStatus(e.target.value as LeadStatusValue)}
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
        <span className="mb-1 block text-xs text-mist">Internal notes</span>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-warm/10 bg-ink/50 px-3 py-2 text-sm text-warm"
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="btn-cci-primary h-11 px-5 text-sm disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => void remove()}
          className="rounded-full border border-red-500/30 px-5 text-sm text-red-300 hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>
      {message ? <p className="mt-3 text-sm text-mist">{message}</p> : null}
    </div>
  );
}
