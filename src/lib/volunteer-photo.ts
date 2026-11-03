import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

export const VOLUNTEER_PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export const VOLUNTEER_PHOTO_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "volunteers");

export class VolunteerPhotoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VolunteerPhotoError";
  }
}

/** Build public URL path stored in DB, e.g. /uploads/volunteers/CCI_2026_0001.jpg */
export function volunteerPhotoPublicPath(filename: string): string {
  return `/uploads/volunteers/${filename}`;
}

function fileStemFromVolunteerId(volunteerId: string): string {
  return volunteerId.replace(/-/g, "_");
}

export async function saveVolunteerProfilePhoto(
  file: File,
  volunteerId: string,
): Promise<string> {
  const mime = file.type.toLowerCase();
  const ext = VOLUNTEER_PHOTO_MIME[mime];
  if (!ext) {
    throw new VolunteerPhotoError(
      "Only JPG, JPEG, PNG, or WEBP images are allowed.",
    );
  }

  if (file.size > VOLUNTEER_PHOTO_MAX_BYTES) {
    throw new VolunteerPhotoError("Profile photo must be 5 MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Magic-byte sniff (reject renamed non-images)
  if (!looksLikeImage(buffer, ext)) {
    throw new VolunteerPhotoError("Invalid image file.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const stem = fileStemFromVolunteerId(volunteerId);
  let filename = `${stem}.${ext}`;
  let absolute = path.join(UPLOAD_DIR, filename);

  // Avoid overwriting — append short suffix if needed
  try {
    const { access } = await import("fs/promises");
    await access(absolute);
    filename = `${stem}_${randomBytes(3).toString("hex")}.${ext}`;
    absolute = path.join(UPLOAD_DIR, filename);
  } catch {
    // file does not exist — good
  }

  let output = buffer;

  await writeFile(absolute, output);
  return volunteerPhotoPublicPath(filename);
}

function looksLikeImage(buf: Buffer, ext: string): boolean {
  if (buf.length < 12) return false;
  if (ext === "jpg") {
    return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  }
  if (ext === "png") {
    return (
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47
    );
  }
  if (ext === "webp") {
    return (
      buf.toString("ascii", 0, 4) === "RIFF" &&
      buf.toString("ascii", 8, 12) === "WEBP"
    );
  }
  return false;
}

export async function deleteVolunteerPhotoFile(
  publicPath: string | null | undefined,
): Promise<void> {
  if (!publicPath?.startsWith("/uploads/volunteers/")) return;
  const name = path.basename(publicPath);
  if (!name || name.includes("..")) return;
  try {
    await unlink(path.join(UPLOAD_DIR, name));
  } catch {
    /* ignore missing */
  }
}
