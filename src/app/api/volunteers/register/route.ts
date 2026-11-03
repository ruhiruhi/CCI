import { NextResponse } from "next/server";
import { registerVolunteerSchema } from "@/lib/volunteer-validation";
import {
  registerVolunteer,
  setVolunteerProfilePhoto,
  VolunteerConflictError,
} from "@/lib/volunteer-service";
import { sendVolunteerWelcomeEmail } from "@/lib/volunteer-email";
import {
  saveVolunteerProfilePhoto,
  VolunteerPhotoError,
} from "@/lib/volunteer-photo";
import {
  assertSameOrigin,
  clientIp,
  rateLimit,
} from "@/lib/lead-security";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const ip = clientIp(request);
  const limited = rateLimit(`volunteer:${ip}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  let fields: Record<string, string> = {};
  let photoFile: File | null = null;

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      fields = {
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        interest: String(form.get("interest") ?? "Volunteer"),
        message: String(form.get("message") ?? ""),
      };
      const raw = form.get("profilePhoto");
      if (raw instanceof File && raw.size > 0) {
        photoFile = raw;
      }
    } else {
      const body = (await request.json()) as Record<string, string>;
      fields = {
        name: String(body.name ?? ""),
        email: String(body.email ?? ""),
        phone: String(body.phone ?? ""),
        interest: String(body.interest ?? "Volunteer"),
        message: String(body.message ?? ""),
      };
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = registerVolunteerSchema.safeParse(fields);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Please check the form fields.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    let volunteer = await registerVolunteer(parsed.data);

    if (photoFile) {
      try {
        const photoPath = await saveVolunteerProfilePhoto(
          photoFile,
          volunteer.volunteerId,
        );
        volunteer = await setVolunteerProfilePhoto(volunteer.id, photoPath);
      } catch (photoErr) {
        if (photoErr instanceof VolunteerPhotoError) {
          return NextResponse.json({ error: photoErr.message }, { status: 400 });
        }
        console.error("[volunteer-photo] save failed", photoErr);
        return NextResponse.json(
          { error: "Could not save profile photo. Please try again." },
          { status: 500 },
        );
      }
    }

    void sendVolunteerWelcomeEmail(volunteer).catch((err) =>
      console.error("[volunteer-email] failed", err),
    );

    return NextResponse.json(
      {
        ok: true,
        id: volunteer.id,
        volunteerId: volunteer.volunteerId,
        profilePhoto: volunteer.profilePhoto,
        redirectTo: `/volunteer/id-card/${volunteer.id}`,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof VolunteerConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Volunteer register failed:", error);
    return NextResponse.json(
      { error: "Could not save your registration. Please try again later." },
      { status: 500 },
    );
  }
}
