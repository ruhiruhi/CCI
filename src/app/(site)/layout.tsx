import type { Metadata } from "next";
import { Cursor } from "@/components/chrome/cursor";
import { Preloader } from "@/components/chrome/preloader";
import { Navbar } from "@/components/chrome/navbar";
import { Footer } from "@/components/chrome/footer";
import { ScrollProgress } from "@/components/chrome/scroll-progress";
import { getSiteSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s · ${site.name}`,
    },
    description: site.tagline,
  };
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteSettings();

  return (
    <>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Navbar siteName={site.name} />
      <main id="main">{children}</main>
      <Footer email={site.email} address={site.address} siteName={site.name} />
    </>
  );
}
