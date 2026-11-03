"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";

const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";
const MAX_BYTES = 5 * 1024 * 1024;

type Props = {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  error?: string;
};

export function VolunteerPhotoUpload({
  file,
  onChange,
  disabled,
  error,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function validateAndSet(next: File | null) {
    setLocalError("");
    if (!next) {
      onChange(null);
      return;
    }
    const type = next.type.toLowerCase();
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(type)) {
      setLocalError("Only JPG, JPEG, PNG, or WEBP images are allowed.");
      return;
    }
    if (next.size > MAX_BYTES) {
      setLocalError("Profile photo must be 5 MB or smaller.");
      return;
    }
    onChange(next);
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    validateAndSet(f);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const f = e.dataTransfer.files?.[0] ?? null;
    validateAndSet(f);
  }

  const displayError = error || localError;

  return (
    <div className="block">
      <span className="mb-2.5 block text-sm text-mist">
        Profile Photo{" "}
        <span className="text-mist/70">(Optional)</span>
      </span>
      <p className="mb-3 text-xs text-cloud/65">
        Upload your photo for your Volunteer Digital ID Card (Optional). JPG,
        JPEG, PNG, or WEBP — max 5 MB.
      </p>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={onFileInput}
      />

      {preview ? (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-warm/15 bg-ink/40 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Profile preview"
            className="h-24 w-24 rounded-2xl object-cover ring-1 ring-gold/30"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-warm/20 px-4 text-sm text-warm transition hover:border-gold hover:text-gold"
            >
              <Upload className="h-4 w-4" />
              Change
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => validateAndSet(null)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-warm/20 px-4 text-sm text-warm transition hover:border-red-400/50 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={[
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center transition",
            dragOver
              ? "border-gold bg-gold/10"
              : "border-warm/20 bg-ink/40 hover:border-gold/40 hover:bg-ink/55",
            disabled ? "pointer-events-none opacity-60" : "",
          ].join(" ")}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/30 text-gold">
            <ImagePlus className="h-6 w-6" />
          </span>
          <span className="text-sm text-warm">Click or Drag & Drop</span>
          <span className="text-xs text-mist">JPG, PNG, WEBP · up to 5 MB</span>
        </label>
      )}

      {displayError ? (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {displayError}
        </p>
      ) : null}
    </div>
  );
}
