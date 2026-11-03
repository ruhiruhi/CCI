"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  FileText,
  Image,
  Calendar,
  Users,
  Handshake,
  Mail,
  MessageSquare,
  BarChart3,
  Settings,
  Film,
  Heart,
  Shield,
  Newspaper,
  FolderOpen,
  UserCog,
  Activity,
  ChevronLeft,
  MapPin,
  Clapperboard,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Content",
    items: [
      { label: "Homepage", href: "/admin/content/homepage", icon: Home },
      { label: "About", href: "/admin/content/about", icon: FileText },
      { label: "Our Activities", href: "/admin/content/our-activities", icon: MapPin },
      { label: "Catalogue", href: "/admin/content/catalogue", icon: Clapperboard },
      { label: "Projects", href: "/admin/content/projects", icon: Film },
      { label: "Events", href: "/admin/content/events", icon: Calendar },
      { label: "Gallery", href: "/admin/content/gallery", icon: Image },
      { label: "Articles", href: "/admin/content/articles", icon: Newspaper },
      { label: "Stories", href: "/admin/content/stories", icon: Users },
      { label: "Testimonials", href: "/admin/content/testimonials", icon: MessageSquare },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Leads", href: "/admin/leads", icon: MessageSquare },
      { label: "Volunteer Registrations", href: "/admin/volunteers", icon: Users },
      { label: "Memberships", href: "/admin/memberships", icon: UserCog },
      { label: "Partners", href: "/admin/partners", icon: Handshake },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
      { label: "Contact", href: "/admin/contact", icon: MessageSquare },
    ],
  },
  {
    label: "Impact",
    items: [
      { label: "Statistics", href: "/admin/impact/stats", icon: BarChart3 },
      { label: "Support Needed", href: "/admin/support", icon: Package },
      { label: "Donations", href: "/admin/donations", icon: Heart },
      { label: "Transparency", href: "/admin/transparency", icon: Shield },
      { label: "Analytics", href: "/admin/analytics", icon: Activity },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Media Library", href: "/admin/media", icon: FolderOpen },
      { label: "Users", href: "/admin/users", icon: UserCog },
      { label: "Activity Log", href: "/admin/activity", icon: Activity },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-warm/8 bg-ink-soft">
      <div className="flex h-16 items-center gap-3 border-b border-warm/8 px-5">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/15 text-gold">
          <Film className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-warm">CCI Admin</p>
          <p className="text-[0.65rem] text-mist">Content Management</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {NAV.map((section) => {
          if ("href" in section) {
            const active = pathname === section.href;
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-gold/12 text-gold"
                    : "text-cloud hover:bg-charcoal hover:text-warm",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {section.label}
              </Link>
            );
          }

          return (
            <div key={section.label} className="mb-4">
              <p className="mb-2 px-3 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ash">
                {section.label}
              </p>
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-gold/12 text-gold"
                        : "text-cloud hover:bg-charcoal hover:text-warm",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-70" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-warm/8 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-mist transition-colors hover:bg-charcoal hover:text-warm"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to website
        </Link>
      </div>
    </aside>
  );
}
