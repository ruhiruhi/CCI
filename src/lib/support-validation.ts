import { z } from "zod";
import { SUPPORT_PRIORITIES, SUPPORT_ITEM_STATUSES } from "@/lib/support";

export const supportItemSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  category: z.string().trim().min(1, "Category is required").max(100),
  description: z.string().trim().min(10, "Description is required").max(5000),
  quantityNeeded: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  unit: z.string().trim().min(1).max(50).default("items"),
  image: z.string().trim().max(2000).optional().nullable(),
  priority: z.enum(SUPPORT_PRIORITIES).default("MEDIUM"),
  status: z.enum(SUPPORT_ITEM_STATUSES).default("OPEN"),
  sortOrder: z.coerce.number().int().optional().default(0),
});

export const supportRequestSchema = z.object({
  supportItemId: z.string().min(1, "Support item is required"),
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("Valid email is required").max(200),
  phone: z
    .string()
    .trim()
    .min(7, "Phone is required")
    .max(30)
    .regex(/^[+\d\s()-]+$/, "Invalid phone number"),
  address: z.string().trim().min(5, "Address is required").max(500),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(100),
  country: z.string().trim().min(2).max(100).default("India"),
  pincode: z
    .string()
    .trim()
    .min(4, "Pincode is required")
    .max(12)
    .regex(/^[A-Za-z0-9\s-]+$/, "Invalid pincode"),
  message: z.string().trim().max(2000).optional().nullable(),
  quantityToDonate: z.coerce
    .number()
    .int()
    .min(1, "Quantity must be at least 1"),
  agreeContact: z
    .boolean()
    .refine((v) => v === true, {
      message: "You must agree to be contacted.",
    }),
});

export type SupportItemInput = z.infer<typeof supportItemSchema>;
export type SupportRequestInput = z.infer<typeof supportRequestSchema>;
