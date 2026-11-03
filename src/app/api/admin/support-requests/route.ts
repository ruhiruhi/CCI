import { NextResponse } from "next/server";
import { requireContentManager } from "@/lib/admin-api";
import { dbUnavailableResponse } from "@/lib/admin-content";
import { listSupportRequests } from "@/lib/support-service";

export async function GET(request: Request) {
  const authResult = await requireContentManager();
  if ("error" in authResult) return authResult.error;

  try {
    const { searchParams } = new URL(request.url);
    const result = await listSupportRequests({
      q: searchParams.get("q") ?? undefined,
      status: (searchParams.get("status") as never) || undefined,
      page: Number(searchParams.get("page") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 20),
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(dbUnavailableResponse(), { status: 503 });
  }
}
