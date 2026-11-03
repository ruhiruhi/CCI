import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as {
  pool: mysql.Pool | undefined;
  schemaReady: Promise<void> | undefined;
};

function createPool() {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!host || !user || !database) {
    throw new Error(
      "Missing database config. Set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in .env.local",
    );
  }

  return mysql.createPool({
    host,
    port: Number(process.env.DB_PORT ?? 3306),
    user,
    password: password ?? "",
    database,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

export function getPool() {
  if (!globalForDb.pool) {
    globalForDb.pool = createPool();
  }
  return globalForDb.pool;
}

export async function ensureContactSchema() {
  if (!globalForDb.schemaReady) {
    globalForDb.schemaReady = getPool()
      .execute(`
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          role VARCHAR(100) NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      .then(() => undefined);
  }
  return globalForDb.schemaReady;
}
