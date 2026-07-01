import { Pool } from 'pg';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const authDBUser = requireEnv('AUTHDB_USER');
const authDBPass = requireEnv('AUTHDB_PASSWORD');
const authDBHost = requireEnv('AUTHDB_HOST');
const authDBPort = requireEnv('AUTHDB_PORT');
const authDBDatabase = requireEnv('AUTHDB_DB');
const dbURL = `postgresql://${authDBUser}:${authDBPass}@${authDBHost}:${authDBPort}/${authDBDatabase}`;

const pool = new Pool({connectionString: dbURL});
export default pool;