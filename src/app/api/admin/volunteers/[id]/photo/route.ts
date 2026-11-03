import { NextResponse } from "next/server";
import { requireVolunteerManager } from "@/lib/admin-api";
import { logActivity } from "@/lib/cms";
import { dbUnavailableResponse } from "@/lib/admin-content";
import {
  getVolunteerById,
  setVolunteerProfilePhoto,
  VolunteerNotFoundError,
} from "@/lib/volunteer-service";
import {
  deleteVolunteerPhotoFile,
  saveVolunteerProfilePhoto,
  VolunteerPhotoError,
} from "@/lib/volunteer-photo";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const authResult = await requireVolunteerManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await ctx.params;
    const existing = await getVolunteerById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const form = await request.formData();
    const raw = form.get("profilePhoto");
    if (!(raw instanceof File) || raw.size === 0) {
      return NextResponse.json(
        { error: "Please choose an image file." },
        { status: 400 },
      );
    }

    const photoPath = await saveVolunteerProfilePhoto(
      raw,
      existing.volunteerId,
    );

    if (existing.profilePhoto && existing.profilePhoto !== photoPath) {
      await deleteVolunteerPhotoFile(existing.profilePhoto);
    }

    const item = await setVolunteerProfilePhoto(id, photoPath);

    await logActivity(
      authResult.session.user.id,
      "updated",
      "volunteer-photo",
      id,
      { profilePhoto: photoPath },
    );

    return NextResponse.json({ ok: true, item });
  } catch (e) {
    if (e instanceof VolunteerPhotoError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    if (e instanceof VolunteerNotFoundError) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}
