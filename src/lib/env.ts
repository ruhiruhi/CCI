/**
 * Resolves DATABASE_URL from individual DB_* vars when a single URL is not set.
 * Call before Prisma client is first used (e.g. in middleware).
 */
export function ensureDatabaseUrl() {
  if (process.env.DATABASE_URL) return;

  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const database = process.env.DB_NAME;

  if (!host || !user || !database) return;

  const port = process.env.DB_PORT ?? "3306";
  const password = encodeURIComponent(process.env.DB_PASSWORD ?? "");
  process.env.DATABASE_URL = `mysql://${user}:${password}@${host}:${port}/${database}`;
}
