"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function VolunteerDetailActions({
  id,
  status,
  profilePhoto,
}: {
  id: string;
  status: string;
  profilePhoto?: string | null;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function setStatus(next: "APPROVED" | "REJECTED" | "PENDING") {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/volunteers/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Update failed.");
      return;
    }
    router.refresh();
  }

  async function onDelete() {
    if (!confirm("Delete this volunteer registration permanently?")) return;
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/volunteers/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Delete failed.");
      return;
    }
    router.push("/admin/volunteers");
    router.refresh();
  }

  async function onReplacePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.set("profilePhoto", file);
    const res = await fetch(`/api/admin/volunteers/${id}/photo`, {
      method: "POST",
      body: fd,
    });
    setBusy(false);
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Photo upload failed.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="sr-only"
        onChange={onReplacePhoto}
      />
      <div className="flex flex-wrap gap-2">
        {status !== "APPROVED" ? (
          <Button type="button" disabled={busy} onClick={() => setStatus("APPROVED")}>
            Approve
          </Button>
        ) : null}
        {status !== "REJECTED" ? (
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => setStatus("REJECTED")}
          >
            Reject
          </Button>
        ) : null}
        {status !== "PENDING" ? (
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => setStatus("PENDING")}
          >
            Mark Pending
          </Button>
        ) : null}
        <Link href={`/volunteer/id-card/${id}`} target="_blank">
          <Button type="button" variant="outline">
            Download ID Card
          </Button>
        </Link>
        {profilePhoto ? (
          <a href={profilePhoto} download target="_blank" rel="noreferrer">
            <Button type="button" variant="outline">
              Download Photo
            </Button>
          </a>
        ) : null}
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          {profilePhoto ? "Replace Photo" : "Upload Photo"}
        </Button>
        <Button type="button" variant="outline" disabled={busy} onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
