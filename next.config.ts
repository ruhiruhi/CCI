import type { NextConfig } from "next";
import path from "path";

// Keep Next scoped to this project — a package-lock.json on Desktop
// otherwise becomes the inferred workspace root and breaks Turbopack.
const projectRoot = path.join(__dirname);

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  serverExternalPackages: ["mysql2", "@prisma/client", "prisma", "sharp"],
  async redirects() {
    return [
      {
        source: "/our-work",
        destination: "/our-activities",
        permanent: true,
      },
      {
        source: "/our-work/:slug",
        destination: "/our-activities",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
