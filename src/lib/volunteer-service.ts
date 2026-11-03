import type { Prisma, VolunteerApplication, VolunteerStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/leads";
import {
  formatVolunteerId,
  normalizeIndianMobile,
  type VolunteerStatusFilter,
} from "@/lib/volunteer";
import type {
  RegisterVolunteerInput,
  UpdateVolunteerStatusInput,
} from "@/lib/volunteer-validation";

export class VolunteerConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VolunteerConflictError";
  }
}

export class VolunteerNotFoundError extends Error {
  constructor(message = "Volunteer not found.") {
    super(message);
    this.name = "VolunteerNotFoundError";
  }
}

async function nextVolunteerId(tx: Prisma.TransactionClient): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `CCI-${year}-`;
  const latest = await tx.volunteerApplication.findFirst({
    where: { volunteerId: { startsWith: prefix } },
    orderBy: { volunteerId: "desc" },
    select: { volunteerId: true },
  });

  let seq = 1;
  if (latest?.volunteerId) {
    const part = latest.volunteerId.slice(prefix.length);
    const n = Number.parseInt(part, 10);
    if (Number.isFinite(n)) seq = n + 1;
  }
  return formatVolunteerId(year, seq);
}

export async function registerVolunteer(
  payload: RegisterVolunteerInput,
): Promise<VolunteerApplication> {
  const email = sanitizeText(payload.email, 255).toLowerCase();
  const phone = normalizeIndianMobile(payload.phone);
  const name = sanitizeText(payload.name, 120);
  const message = sanitizeText(payload.message, 5000);

  return prisma.$transaction(async (tx) => {
    const duplicate = await tx.volunteerApplication.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
      select: { id: true, email: true, phone: true },
    });

    if (duplicate) {
      if (duplicate.email === email) {
        throw new VolunteerConflictError(
          "This email is already registered as a volunteer.",
        );
      }
      throw new VolunteerConflictError(
        "This mobile number is already registered as a volunteer.",
      );
    }

    const volunteerId = await nextVolunteerId(tx);

    return tx.volunteerApplication.create({
      data: {
        volunteerId,
        name,
        email,
        phone,
        interest: "Volunteer",
        message,
        profilePhoto: payload.profilePhoto ?? null,
        status: "PENDING",
        joinedAt: new Date(),
      },
    });
  });
}

export async function setVolunteerProfilePhoto(
  id: string,
  profilePhoto: string | null,
): Promise<VolunteerApplication> {
  try {
    return await prisma.volunteerApplication.update({
      where: { id },
      data: { profilePhoto },
    });
  } catch {
    throw new VolunteerNotFoundError();
  }
}

export async function getVolunteerById(id: string) {
  return prisma.volunteerApplication.findUnique({ where: { id } });
}

export async function getVolunteerByVolunteerId(volunteerId: string) {
  return prisma.volunteerApplication.findUnique({ where: { volunteerId } });
}

export async function listVolunteers(opts: {
  q?: string;
  status?: VolunteerStatusFilter;
  page?: number;
  pageSize?: number;
  order?: "asc" | "desc";
}) {
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 20;
  const where: Prisma.VolunteerApplicationWhereInput = {};

  if (opts.status) where.status = opts.status;

  if (opts.q?.trim()) {
    const q = opts.q.trim();
    where.OR = [
      { name: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
      { volunteerId: { contains: q } },
    ];
  }

  const [items, total, pending, approved, rejected] = await Promise.all([
    prisma.volunteerApplication.findMany({
      where,
      orderBy: { createdAt: opts.order ?? "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.volunteerApplication.count({ where }),
    prisma.volunteerApplication.count({ where: { status: "PENDING" } }),
    prisma.volunteerApplication.count({ where: { status: "APPROVED" } }),
    prisma.volunteerApplication.count({ where: { status: "REJECTED" } }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    stats: {
      total: await prisma.volunteerApplication.count(),
      pending,
      approved,
      rejected,
    },
  };
}

export async function updateVolunteerStatus(
  id: string,
  data: UpdateVolunteerStatusInput,
): Promise<VolunteerApplication> {
  const existing = await prisma.volunteerApplication.findUnique({
    where: { id },
  });
  if (!existing) throw new VolunteerNotFoundError();

  const patch: Prisma.VolunteerApplicationUpdateInput = {
    status: data.status as VolunteerStatus,
  };
  if (data.notes !== undefined) {
    patch.notes =
      data.notes === null || data.notes === ""
        ? null
        : sanitizeText(data.notes, 5000);
  }

  return prisma.volunteerApplication.update({
    where: { id },
    data: patch,
  });
}

export async function deleteVolunteer(id: string): Promise<void> {
  const existing = await prisma.volunteerApplication.findUnique({
    where: { id },
  });
  if (!existing) throw new VolunteerNotFoundError();

  const { deleteVolunteerPhotoFile } = await import("@/lib/volunteer-photo");
  await deleteVolunteerPhotoFile(existing.profilePhoto);

  await prisma.volunteerApplication.delete({ where: { id } });
}
