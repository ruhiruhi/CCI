import { prisma } from "@/lib/prisma";

export async function isDatabaseAvailable() {
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 1500),
      ),
    ]);
    return true;
  } catch {
    return false;
  }
}
