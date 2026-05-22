import { Pool } from 'pg';

const authDBUser = process.env.AUTHDB_USER;
const authDBPass = process.env.AUTHDB_PASSWORD;
const authDBHost = process.env.AUTHDB_HOST;
const authDBPort = process.env.AUTHDB_PORT;
const authDBDatabase = process.env.AUTHDB_DB;
const dbURL = `postgresql://${authDBUser}:${authDBPass}@${authDBHost}:${authDBPort}/${authDBDatabase}`;

const pool = new Pool({connectionString: dbURL});
export default pool;