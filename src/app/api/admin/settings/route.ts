import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-api";
import { logActivity } from "@/lib/cms";

export async function PUT(request: Request) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const body = await request.json();

  await prisma.siteSetting.upsert({
    where: { key: "site" },
    update: { value: body },
    create: { key: "site", value: body },
  });

  await logActivity(authResult.session.user.id, "updated", "settings");

  return NextResponse.json({ ok: true });
}
