import type { UserRole } from "@prisma/client";

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  CONTENT_MANAGER: "Content Manager",
  VOLUNTEER_MANAGER: "Volunteer Manager",
};
