import { z } from "zod";
import { isValidIndianMobile, VOLUNTEER_STATUSES } from "@/lib/volunteer";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerVolunteerSchema = z.object({
  name: z.string().trim().min(2, "Full name is required.").max(120),
  email: z
    .string()
    .trim()
    .max(255)
    .regex(emailRe, "A valid email is required."),
  phone: z
    .string()
    .trim()
    .min(10, "Mobile number is required.")
    .max(20)
    .refine(isValidIndianMobile, "Enter a valid Indian mobile number."),
  interest: z.literal("Volunteer"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(5000, "Message is too long."),
  profilePhoto: z.string().trim().max(255).optional().nullable(),
});

export type RegisterVolunteerInput = z.infer<typeof registerVolunteerSchema>;

export const updateVolunteerStatusSchema = z.object({
  status: z.enum(VOLUNTEER_STATUSES),
  notes: z.string().trim().max(5000).optional().nullable(),
});

export type UpdateVolunteerStatusInput = z.infer<
  typeof updateVolunteerStatusSchema
>;

export const volunteerQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(VOLUNTEER_STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  order: z.enum(["asc", "desc"]).default("desc"),
});
