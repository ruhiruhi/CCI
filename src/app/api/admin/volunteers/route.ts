import { NextResponse } from "next/server";
import { requireVolunteerManager } from "@/lib/admin-api";
import { volunteerQuerySchema } from "@/lib/volunteer-validation";
import { listVolunteers } from "@/lib/volunteer-service";
import { dbUnavailableResponse } from "@/lib/admin-content";

export async function GET(request: Request) {
  const authResult = await requireVolunteerManager();
  if ("error" in authResult) return authResult.error;

  const { searchParams } = new URL(request.url);
  const parsed = volunteerQuerySchema.safeParse(
    Object.fromEntries(searchParams.entries()),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid query." },
      { status: 400 },
    );
  }

  try {
    const result = await listVolunteers(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}
