import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { leadQuerySchema } from "@/lib/lead-validation";
import { getLeadStats, leadsToCsv, listLeads } from "@/lib/lead-service";
import type { LeadStatus } from "@prisma/client";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const exportFormat = searchParams.get("export");

  const parsed = leadQuerySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    page: searchParams.get("page") ?? 1,
    pageSize: searchParams.get("pageSize") ?? (exportFormat ? 5000 : 20),
    sort: searchParams.get("sort") ?? "createdAt",
    order: searchParams.get("order") ?? "desc",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query." }, { status: 400 });
  }

  try {
    const data = await listLeads({
      ...parsed.data,
      status: parsed.data.status as LeadStatus | undefined,
    });

    if (exportFormat === "csv" || exportFormat === "excel") {
      const csv = leadsToCsv(data.rows);
      const filename =
        exportFormat === "excel"
          ? `cci-leads-${Date.now()}.xls`
          : `cci-leads-${Date.now()}.csv`;
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type":
            exportFormat === "excel"
              ? "application/vnd.ms-excel; charset=utf-8"
              : "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    const stats = await getLeadStats();
    return NextResponse.json({ ...data, stats });
  } catch (error) {
    console.error("List leads failed:", error);
    return NextResponse.json(
      { error: "Could not load leads." },
      { status: 500 },
    );
  }
}
