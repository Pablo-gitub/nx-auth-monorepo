// libs/api/db/src/lib/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '../schema';

/**
 * Creates a singleton Postgres pool and Drizzle client for the whole monorepo.
 * The DATABASE_URL must be provided via environment variables.
 */
const DATABASE_URL = process.env['DATABASE_URL'];

if (!DATABASE_URL) {
  throw new Error('Missing DATABASE_URL environment variable');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  // Neon requires SSL; pg will negotiate correctly with the connection string.
  // If you want to be explicit, you can also set: ssl: true
});

export const db = drizzle(pool, { schema });

export type DbClient = typeof db;
