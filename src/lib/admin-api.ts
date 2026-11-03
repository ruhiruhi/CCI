import { NextResponse } from "next/server";
import { auth, canManageContent, canManageVolunteers } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

export async function requireContentManager() {
  const result = await requireAdmin();
  if ("error" in result) return result;
  if (!canManageContent(result.session.user.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}

export async function requireVolunteerManager() {
  const result = await requireAdmin();
  if ("error" in result) return result;
  if (!canManageVolunteers(result.session.user.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}

export function parseJsonBody<T>(body: unknown): T | null {
  if (!body || typeof body !== "object") return null;
  return body as T;
}

export { ROLE_LABELS } from "@/lib/admin-roles";
