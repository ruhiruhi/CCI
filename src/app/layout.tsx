import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const SITE_URL = "https://consciouscine.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Conscious Cinema Initiative — Cinema for Awareness, Education and Social Impact",
    template: "%s · Conscious Cinema Initiative",
  },
  description:
    "Conscious Cinema Initiative is building a national movement using screenings, film education, community dialogue, and filmmaker empowerment.",
  keywords: [
    "conscious cinema",
    "film for social change",
    "community screenings",
    "film literacy",
    "documentary",
    "social impact",
    "volunteer",
    "India",
  ],
  authors: [{ name: "Conscious Cinema Initiative" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    title: "Conscious Cinema Initiative",
    description:
      "Cinema is more than entertainment. It creates awareness, builds empathy and transforms communities.",
    siteName: "Conscious Cinema Initiative",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conscious Cinema Initiative",
    description:
      "Cinema is more than entertainment. It creates awareness, builds empathy and transforms communities.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/logo.jpeg", type: "image/jpeg" }],
    apple: [{ url: "/logo.jpeg", type: "image/jpeg" }],
    shortcut: "/logo.jpeg",
  },
};

export const viewport: Viewport = {
  themeColor: "#3a2114",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} antialiased`}
    >
      <body className="min-h-dvh bg-ink text-warm">{children}</body>
    </html>
  );
}
