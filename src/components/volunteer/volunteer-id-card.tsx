"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import {
  VOLUNTEER_STATUS_LABELS,
  type VolunteerStatusFilter,
} from "@/lib/volunteer";

export type VolunteerIdCardData = {
  id: string;
  volunteerId: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  joinedAt: string | Date;
  profilePhoto?: string | null;
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
}

const RGB = {
  ink: hexToRgb("#1a1008"),
  charcoal: hexToRgb("#3a2114"),
  gold: hexToRgb("#f5b942"),
  warm: hexToRgb("#fff8ea"),
  mist: hexToRgb("#a89484"),
};

/** Convert any loaded <img> (or URL) into a JPEG data URL for jsPDF. */
async function toJpegDataUrl(
  source: HTMLImageElement | string | null | undefined,
): Promise<string | null> {
  try {
    let img: HTMLImageElement;

    if (typeof source === "string") {
      img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new window.Image();
        el.crossOrigin = "anonymous";
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error(`Failed to load ${source}`));
        el.src = source;
      });
    } else if (source instanceof HTMLImageElement && source.complete && source.naturalWidth > 0) {
      img = source;
    } else {
      return null;
    }

    const max = 600;
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight, 1));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#1a1008";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.9);
  } catch {
    return null;
  }
}

export function VolunteerIdCard({ volunteer }: { volunteer: VolunteerIdCardData }) {
  const logoRef = useRef<HTMLImageElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);

  const statusLabel =
    VOLUNTEER_STATUS_LABELS[volunteer.status as VolunteerStatusFilter] ??
    volunteer.status;

  const joinedLabel = format(
    typeof volunteer.joinedAt === "string"
      ? new Date(volunteer.joinedAt)
      : volunteer.joinedAt,
    "dd MMM yyyy",
  );

  const showPhoto = Boolean(volunteer.profilePhoto) && !photoFailed;

  async function downloadPdf() {
    if (downloading) return;
    setDownloading(true);

    try {
      const doc = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      const pageW = doc.internal.pageSize.getWidth();
      const cardX = 18;
      const cardY = 24;
      const cardW = pageW - 36;
      const cardH = 175;

      doc.setFillColor(...RGB.charcoal);
      doc.rect(cardX, cardY, cardW, cardH, "F");
      doc.setDrawColor(...RGB.gold);
      doc.setLineWidth(0.5);
      doc.rect(cardX, cardY, cardW, cardH, "S");

      const logoJpeg =
        (await toJpegDataUrl(logoRef.current)) ||
        (await toJpegDataUrl("/logo.jpeg"));

      if (logoJpeg) {
        try {
          doc.addImage(logoJpeg, "JPEG", cardX + 10, cardY + 10, 14, 14);
        } catch {
          /* skip logo */
        }
      }

      doc.setTextColor(...RGB.gold);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("CONSCIOUS CINEMA INITIATIVE", cardX + 28, cardY + 15);

      doc.setTextColor(...RGB.warm);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Digital Volunteer ID", cardX + 28, cardY + 23);

      doc.setDrawColor(90, 70, 55);
      doc.setLineWidth(0.2);
      doc.line(cardX + 10, cardY + 30, cardX + cardW - 10, cardY + 30);

      const photoX = cardX + 12;
      const photoY = cardY + 40;
      const photoSize = 36;

      doc.setFillColor(...RGB.ink);
      doc.rect(photoX, photoY, photoSize, photoSize, "F");

      const photoJpeg = showPhoto
        ? (await toJpegDataUrl(photoRef.current)) ||
          (await toJpegDataUrl(volunteer.profilePhoto))
        : logoJpeg;

      if (photoJpeg) {
        try {
          doc.addImage(
            photoJpeg,
            "JPEG",
            photoX + 1,
            photoY + 1,
            photoSize - 2,
            photoSize - 2,
          );
        } catch {
          /* skip photo */
        }
      }

      doc.setDrawColor(...RGB.gold);
      doc.rect(photoX, photoY, photoSize, photoSize, "S");

      const textX = photoX + photoSize + 10;
      let ty = photoY + 6;

      doc.setTextColor(...RGB.warm);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(17);
      const nameLines = doc.splitTextToSize(volunteer.name, cardW - 70);
      doc.text(nameLines, textX, ty);
      ty += nameLines.length * 7 + 2;

      doc.setTextColor(...RGB.gold);
      doc.setFont("courier", "normal");
      doc.setFontSize(11);
      doc.text(volunteer.volunteerId, textX, ty);
      ty += 12;

      const rows: [string, string][] = [
        ["Email", volunteer.email],
        ["Mobile", volunteer.phone],
        ["Joined", joinedLabel],
        ["Status", statusLabel],
      ];

      for (const [label, value] of rows) {
        doc.setTextColor(...RGB.mist);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(label, textX, ty);
        doc.setTextColor(...RGB.warm);
        doc.setFontSize(11);
        const valueLines = doc.splitTextToSize(value, cardW - 70);
        doc.text(valueLines, textX, ty + 5);
        ty += 5 + valueLines.length * 5 + 4;
      }

      const footerY = cardY + cardH - 28;
      doc.setDrawColor(90, 70, 55);
      doc.line(cardX + 10, footerY, cardX + cardW - 10, footerY);

      doc.setTextColor(...RGB.mist);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      doc.text("Every screening begins a conversation.", pageW / 2, footerY + 10, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Conscious Cinema Initiative", pageW / 2, footerY + 17, {
        align: "center",
      });
      doc.setTextColor(...RGB.gold);
      doc.text("consciouscine.org", pageW / 2, footerY + 22, {
        align: "center",
      });

      const filename = `CCI-Volunteer-ID-${volunteer.volunteerId}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("[volunteer-pdf]", err);
      const message =
        err instanceof Error ? err.message : "Could not generate PDF.";
      alert(`PDF download failed: ${message}`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div
        className="overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-b from-charcoal via-ink to-[#140e0a] p-6 shadow-[var(--shadow-medium)] sm:p-8"
        style={{
          backgroundColor: "#3a2114",
          color: "#fff8ea",
          borderColor: "rgba(245, 185, 66, 0.35)",
        }}
      >
        <div className="flex items-center gap-3 border-b border-warm/10 pb-5">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={logoRef}
              src="/logo.jpeg"
              alt="Conscious Cinema Initiative"
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
          </span>
          <div>
            <p
              className="text-xs uppercase tracking-[0.2em]"
              style={{ color: "#f5b942" }}
            >
              Conscious Cinema Initiative
            </p>
            <h1
              className="font-display text-xl font-light sm:text-2xl"
              style={{ color: "#fff8ea" }}
            >
              Digital Volunteer ID
            </h1>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div
            className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl"
            style={{
              border: "1px solid rgba(245, 185, 66, 0.4)",
              backgroundColor: "#1a1008",
            }}
          >
            {showPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={photoRef}
                src={volunteer.profilePhoto!}
                alt={volunteer.name}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
                onError={() => setPhotoFailed(true)}
              />
            ) : (
              <div className="grid h-full w-full place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpeg"
                  alt=""
                  className="h-14 w-14 rounded-full object-cover ring-1 ring-gold/40"
                />
                <span className="sr-only">Default volunteer avatar</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
            <h2
              className="font-display text-2xl font-medium"
              style={{ color: "#fff8ea" }}
            >
              {volunteer.name}
            </h2>
            <p className="font-mono text-sm" style={{ color: "#f5b942" }}>
              {volunteer.volunteerId}
            </p>
            <dl className="space-y-2 text-sm">
              <div>
                <dt style={{ color: "#a89484" }}>Email</dt>
                <dd className="break-all" style={{ color: "#fff8ea" }}>
                  {volunteer.email}
                </dd>
              </div>
              <div>
                <dt style={{ color: "#a89484" }}>Mobile</dt>
                <dd style={{ color: "#fff8ea" }}>{volunteer.phone}</dd>
              </div>
              <div className="flex flex-wrap justify-center gap-6 sm:justify-start">
                <div>
                  <dt style={{ color: "#a89484" }}>Joined</dt>
                  <dd style={{ color: "#fff8ea" }}>{joinedLabel}</dd>
                </div>
                <div>
                  <dt style={{ color: "#a89484" }}>Status</dt>
                  <dd style={{ color: "#f5b942" }}>{statusLabel}</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 border-t border-warm/10 pt-6">
          <p
            className="max-w-xs text-center font-display text-base italic"
            style={{ color: "#a89484" }}
          >
            Every screening begins a conversation.
          </p>
          <footer className="text-center text-xs" style={{ color: "#a89484" }}>
            <p>Conscious Cinema Initiative</p>
            <p style={{ color: "#f5b942" }}>consciouscine.org</p>
          </footer>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={downloadPdf}
          disabled={downloading}
          className="btn-cci-primary inline-flex h-12 items-center justify-center gap-2 px-6 disabled:opacity-60"
          data-cursor="hover"
        >
          <Download className="h-4 w-4" />
          {downloading ? "Preparing PDF…" : "Download PDF"}
        </button>
        <Link
          href="/"
          className="btn-cci-secondary inline-flex h-12 items-center justify-center gap-2 px-6"
          data-cursor="hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back Home
        </Link>
      </div>
    </div>
  );
}
