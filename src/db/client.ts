import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'mysql-db02.remote',
  port:     Number(process.env.DB_PORT) || 32636,
  user:     process.env.DB_USER     || 'capt_noah',
  password: process.env.DB_PASSWORD || '5RDPrt#xe67gx@bv',
  database: process.env.DB_NAME     || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(pool, { schema, mode: 'default' });
export { pool };
