import { Pool } from 'pg';

let pool: Pool | null = null;

function getDatabaseUrl(): string {
  const authDBUser = process.env.AUTHDB_USER;
  const authDBPass = process.env.AUTHDB_PASSWORD;
  const authDBHost = process.env.AUTHDB_HOST;
  const authDBPort = process.env.AUTHDB_PORT;
  const authDBDatabase = process.env.AUTHDB_DB;

  return `postgresql://${authDBUser}:${authDBPass}@${authDBHost}:${authDBPort}/${authDBDatabase}`;
}

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: getDatabaseUrl() });
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
