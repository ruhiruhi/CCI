"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, Search } from "lucide-react";
import { ROLE_LABELS } from "@/lib/admin-roles";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@prisma/client";

type HeaderUser = {
  name?: string | null;
  role?: UserRole;
};

export function AdminHeaderClient({
  title,
  user,
}: {
  title: string;
  user: HeaderUser | null;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-warm/8 bg-ink/80 px-6 backdrop-blur-md">
      <div>
        <h1 className="font-display text-xl font-medium text-warm">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-56 rounded-lg border border-warm/10 bg-charcoal/50 pl-9 pr-3 text-sm text-warm placeholder:text-ash focus:border-gold/40 focus:outline-none"
          />
        </div>

        <button
          type="button"
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-warm/10 text-mist transition-colors hover:border-gold/30 hover:text-gold"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 border-l border-warm/10 pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-warm">
              {user?.name ?? "Admin"}
            </p>
            <Badge variant="gold" className="mt-0.5">
              {user?.role ? ROLE_LABELS[user.role] : "Admin"}
            </Badge>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="grid h-9 w-9 place-items-center rounded-lg border border-warm/10 text-mist transition-colors hover:border-red-500/30 hover:text-red-400"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
