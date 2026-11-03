import { prisma } from "@/lib/prisma";
import type { Prisma, SupportRequestStatus } from "@prisma/client";
import {
  sanitizeSupportText,
  type SupportItemStatusValue,
  type SupportPriorityValue,
} from "@/lib/support";
import type { SupportItemInput, SupportRequestInput } from "@/lib/support-validation";

export type SupportItemFilters = {
  q?: string;
  category?: string;
  priority?: SupportPriorityValue | "";
  status?: SupportItemStatusValue | "";
  page?: number;
  pageSize?: number;
  sort?: "newest" | "priority" | "progress";
};

export async function listSupportItems(filters: SupportItemFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, filters.pageSize ?? 12));
  const where: Prisma.SupportItemWhereInput = {};

  if (filters.status) where.status = filters.status;
  if (filters.category) where.category = filters.category;
  if (filters.priority) where.priority = filters.priority;
  if (filters.q?.trim()) {
    const q = filters.q.trim();
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { category: { contains: q } },
    ];
  }

  const orderBy: Prisma.SupportItemOrderByWithRelationInput[] =
    filters.sort === "priority"
      ? [{ priority: "desc" }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }];

  const [total, items] = await Promise.all([
    prisma.supportItem.count({ where }),
    prisma.supportItem.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getOpenSupportItems(filters: SupportItemFilters = {}) {
  return listSupportItems({
    ...filters,
    status: filters.status || "OPEN",
    pageSize: filters.pageSize ?? 24,
  });
}

export async function createSupportItem(input: SupportItemInput) {
  return prisma.supportItem.create({
    data: {
      title: sanitizeSupportText(input.title, 200),
      category: sanitizeSupportText(input.category, 100),
      description: sanitizeSupportText(input.description, 5000),
      quantityNeeded: input.quantityNeeded,
      unit: sanitizeSupportText(input.unit || "items", 50),
      image: input.image ? sanitizeSupportText(input.image, 2000) : null,
      priority: input.priority,
      status: input.status,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function updateSupportItem(id: string, input: SupportItemInput) {
  return prisma.supportItem.update({
    where: { id },
    data: {
      title: sanitizeSupportText(input.title, 200),
      category: sanitizeSupportText(input.category, 100),
      description: sanitizeSupportText(input.description, 5000),
      quantityNeeded: input.quantityNeeded,
      unit: sanitizeSupportText(input.unit || "items", 50),
      image: input.image ? sanitizeSupportText(input.image, 2000) : null,
      priority: input.priority,
      status: input.status,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function deleteSupportItem(id: string) {
  return prisma.supportItem.delete({ where: { id } });
}

export async function createSupportRequest(
  input: Omit<SupportRequestInput, "agreeContact">,
  ipAddress?: string | null,
) {
  const item = await prisma.supportItem.findUnique({
    where: { id: input.supportItemId },
  });
  if (!item) throw new Error("Support item not found.");
  if (item.status !== "OPEN") {
    throw new Error("This support need is closed.");
  }

  const remaining = Math.max(0, item.quantityNeeded - item.quantityReceived);
  if (input.quantityToDonate > remaining && remaining > 0) {
    throw new Error(
      `Only ${remaining} ${item.unit} remaining for this need.`,
    );
  }

  return prisma.supportRequest.create({
    data: {
      supportItemId: input.supportItemId,
      fullName: sanitizeSupportText(input.fullName, 120),
      email: sanitizeSupportText(input.email, 200).toLowerCase(),
      phone: sanitizeSupportText(input.phone, 30),
      address: sanitizeSupportText(input.address, 500),
      city: sanitizeSupportText(input.city, 100),
      state: sanitizeSupportText(input.state, 100),
      country: sanitizeSupportText(input.country || "India", 100),
      pincode: sanitizeSupportText(input.pincode, 12),
      message: input.message
        ? sanitizeSupportText(input.message, 2000)
        : null,
      quantityToDonate: input.quantityToDonate,
      ipAddress: ipAddress ?? null,
    },
    include: { supportItem: true },
  });
}

export async function listSupportRequests(opts: {
  q?: string;
  status?: SupportRequestStatus | "";
  page?: number;
  pageSize?: number;
} = {}) {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, opts.pageSize ?? 20));
  const where: Prisma.SupportRequestWhereInput = {};

  if (opts.status) where.status = opts.status;
  if (opts.q?.trim()) {
    const q = opts.q.trim();
    where.OR = [
      { fullName: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
      { supportItem: { title: { contains: q } } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.supportRequest.count({ where }),
    prisma.supportRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { supportItem: true },
    }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/**
 * When a request is marked COMPLETED, increase quantity_received.
 * Auto-close item when goal is met. Reverses quantity if leaving COMPLETED.
 */
export async function updateSupportRequestStatus(
  id: string,
  status: SupportRequestStatus,
  adminNotes?: string | null,
) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.supportRequest.findUnique({
      where: { id },
      include: { supportItem: true },
    });
    if (!request) throw new Error("Request not found.");

    const prev = request.status;
    if (prev === status) {
      return tx.supportRequest.update({
        where: { id },
        data: {
          adminNotes:
            adminNotes !== undefined ? adminNotes : request.adminNotes,
        },
        include: { supportItem: true },
      });
    }

    let delta = 0;
    if (prev !== "COMPLETED" && status === "COMPLETED") {
      delta = request.quantityToDonate;
    } else if (prev === "COMPLETED" && status !== "COMPLETED") {
      delta = -request.quantityToDonate;
    }

    if (delta !== 0) {
      const item = request.supportItem;
      const nextReceived = Math.max(0, item.quantityReceived + delta);
      const nextStatus =
        nextReceived >= item.quantityNeeded ? "CLOSED" : item.status === "CLOSED" && nextReceived < item.quantityNeeded
          ? "OPEN"
          : item.status;

      await tx.supportItem.update({
        where: { id: item.id },
        data: {
          quantityReceived: nextReceived,
          status:
            nextReceived >= item.quantityNeeded
              ? "CLOSED"
              : nextStatus === "CLOSED"
                ? "OPEN"
                : item.status,
        },
      });
    }

    return tx.supportRequest.update({
      where: { id },
      data: {
        status,
        adminNotes:
          adminNotes !== undefined ? adminNotes : request.adminNotes,
      },
      include: { supportItem: true },
    });
  });
}

export async function deleteSupportRequest(id: string) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.supportRequest.findUnique({ where: { id } });
    if (!request) throw new Error("Request not found.");

    if (request.status === "COMPLETED") {
      const item = await tx.supportItem.findUnique({
        where: { id: request.supportItemId },
      });
      if (item) {
        const nextReceived = Math.max(
          0,
          item.quantityReceived - request.quantityToDonate,
        );
        await tx.supportItem.update({
          where: { id: item.id },
          data: {
            quantityReceived: nextReceived,
            status:
              nextReceived >= item.quantityNeeded ? "CLOSED" : "OPEN",
          },
        });
      }
    }

    await tx.supportRequest.delete({ where: { id } });
  });
}

export async function getSupportStats() {
  const [
    totalItems,
    openItems,
    closedItems,
    pendingRequests,
    approvedRequests,
    completedRequests,
  ] = await Promise.all([
    prisma.supportItem.count(),
    prisma.supportItem.count({ where: { status: "OPEN" } }),
    prisma.supportItem.count({ where: { status: "CLOSED" } }),
    prisma.supportRequest.count({ where: { status: "PENDING" } }),
    prisma.supportRequest.count({ where: { status: "APPROVED" } }),
    prisma.supportRequest.count({ where: { status: "COMPLETED" } }),
  ]);

  return {
    totalItems,
    openItems,
    closedItems,
    pendingRequests,
    approvedRequests,
    completedRequests,
  };
}
