import type { Lead, LeadStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/leads";
import type { CreateLeadInput, UpdateLeadInput } from "@/lib/lead-validation";

export type CreateLeadPayload = CreateLeadInput & {
  ipAddress?: string | null;
};

export async function createLead(payload: CreateLeadPayload): Promise<Lead> {
  return prisma.lead.create({
    data: {
      name: sanitizeText(payload.name, 120),
      email: sanitizeText(payload.email, 255).toLowerCase(),
      phone: sanitizeText(payload.phone, 20),
      city: payload.city ? sanitizeText(payload.city, 120) : null,
      organization: payload.organization
        ? sanitizeText(payload.organization, 160)
        : null,
      interest: sanitizeText(payload.interest, 80),
      message: payload.message ? sanitizeText(payload.message, 5000) : null,
      sourcePage: payload.sourcePage
        ? sanitizeText(payload.sourcePage, 200)
        : null,
      buttonName: payload.buttonName
        ? sanitizeText(payload.buttonName, 120)
        : null,
      pageUrl: payload.pageUrl ? sanitizeText(payload.pageUrl, 500) : null,
      ipAddress: payload.ipAddress
        ? sanitizeText(payload.ipAddress, 64)
        : null,
      status: "NEW",
    },
  });
}

export async function getLeadById(id: string): Promise<Lead | null> {
  return prisma.lead.findUnique({ where: { id } });
}

export async function updateLead(
  id: string,
  data: UpdateLeadInput,
): Promise<Lead> {
  const patch: Prisma.LeadUpdateInput = {};
  if (data.status) patch.status = data.status as LeadStatus;
  if (data.remarks !== undefined) {
    patch.remarks =
      data.remarks === null || data.remarks === ""
        ? null
        : sanitizeText(data.remarks, 5000);
  }
  if (data.interest) patch.interest = sanitizeText(data.interest, 80);

  return prisma.lead.update({ where: { id }, data: patch });
}

export async function deleteLead(id: string): Promise<void> {
  await prisma.lead.delete({ where: { id } });
}

export type LeadListParams = {
  q?: string;
  status?: LeadStatus;
  from?: string;
  to?: string;
  page: number;
  pageSize: number;
  sort: "createdAt" | "name" | "status" | "interest";
  order: "asc" | "desc";
};

export async function listLeads(params: LeadListParams) {
  const where: Prisma.LeadWhereInput = {};

  if (params.status) where.status = params.status;

  if (params.q) {
    const q = params.q.trim();
    where.OR = [
      { name: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
      { interest: { contains: q } },
      { buttonName: { contains: q } },
      { sourcePage: { contains: q } },
      { city: { contains: q } },
    ];
  }

  if (params.from || params.to) {
    where.createdAt = {};
    if (params.from) where.createdAt.gte = new Date(`${params.from}T00:00:00.000Z`);
    if (params.to) where.createdAt.lte = new Date(`${params.to}T23:59:59.999Z`);
  }

  const [total, rows] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { [params.sort]: params.order },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
  ]);

  return {
    rows,
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.max(1, Math.ceil(total / params.pageSize)),
  };
}

export async function getLeadStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [total, today, byStatus] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.lead.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const statusMap = Object.fromEntries(
    byStatus.map((s) => [s.status, s._count._all]),
  ) as Partial<Record<LeadStatus, number>>;

  return {
    total,
    today,
    new: statusMap.NEW ?? 0,
    contacted: statusMap.CONTACTED ?? 0,
    inProgress: statusMap.IN_PROGRESS ?? 0,
    converted: statusMap.CONVERTED ?? 0,
    closed: statusMap.CLOSED ?? 0,
  };
}

export function leadsToCsv(rows: Lead[]): string {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "City",
    "Organization",
    "Interest",
    "Button",
    "Source Page",
    "Status",
    "Message",
    "Remarks",
    "Created At",
  ];

  const escape = (v: string | null | undefined) => {
    const s = (v ?? "").replace(/"/g, '""');
    return `"${s}"`;
  };

  const lines = rows.map((r) =>
    [
      r.name,
      r.email,
      r.phone,
      r.city,
      r.organization,
      r.interest,
      r.buttonName,
      r.sourcePage,
      r.status,
      r.message,
      r.remarks,
      r.createdAt.toISOString(),
    ]
      .map(escape)
      .join(","),
  );

  return [headers.join(","), ...lines].join("\n");
}
