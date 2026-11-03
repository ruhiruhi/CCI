import { z } from "zod";
import { LEAD_INTERESTS, LEAD_STATUSES } from "@/lib/leads";

const phoneRe = /^[+]?[\d\s()-]{7,20}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, "Full name is required.").max(120),
  email: z
    .string()
    .trim()
    .max(255)
    .regex(emailRe, "A valid email is required."),
  phone: z
    .string()
    .trim()
    .min(7, "Mobile number is required.")
    .max(20)
    .regex(phoneRe, "Enter a valid mobile number."),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  interest: z.string().trim().min(1).max(80),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  sourcePage: z.string().trim().max(200).optional().or(z.literal("")),
  buttonName: z.string().trim().max(120).optional().or(z.literal("")),
  pageUrl: z.string().trim().max(500).optional().or(z.literal("")),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const updateLeadSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  remarks: z.string().trim().max(5000).optional().nullable(),
  interest: z.string().trim().max(80).optional(),
});

export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;

export const leadQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(["createdAt", "name", "status", "interest"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export { LEAD_INTERESTS };
