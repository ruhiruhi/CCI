import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import type { UserRole } from "@prisma/client";

function devAdminUser(email: string, password: string) {
  if (process.env.NODE_ENV !== "development") return null;

  const adminEmail = (
    process.env.ADMIN_EMAIL ?? "admin@consciouscinema.in"
  ).toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";

  if (email !== adminEmail || password !== adminPassword) return null;

  return {
    id: "dev-admin",
    email: adminEmail,
    name: "CCI Admin",
    role: "SUPER_ADMIN" as const,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase();
        const password = parsed.data.password;

        const devUser = devAdminUser(email, password);
        if (devUser) return devUser;

        let user;
        try {
          user = await prisma.user.findUnique({ where: { email } });
        } catch {
          return null;
        }

        if (!user?.passwordHash || !user.active) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
});

const ADMIN_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "CONTENT_MANAGER",
  "VOLUNTEER_MANAGER",
];

export function isAdminRole(role?: UserRole | null) {
  return role ? ADMIN_ROLES.includes(role) : false;
}

export function canManageUsers(role?: UserRole | null) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canManageVolunteers(role?: UserRole | null) {
  return (
    role === "SUPER_ADMIN" ||
    role === "ADMIN" ||
    role === "VOLUNTEER_MANAGER"
  );
}

export function canManageContent(role?: UserRole | null) {
  return (
    role === "SUPER_ADMIN" ||
    role === "ADMIN" ||
    role === "EDITOR" ||
    role === "CONTENT_MANAGER"
  );
}
