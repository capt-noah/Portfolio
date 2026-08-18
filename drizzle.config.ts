import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema:    './src/db/schema.ts',
  out:       './drizzle',
  dialect:   'mysql',
  dbCredentials: {
    host:     process.env.DB_HOST     || 'mysql-db02.remote',
    port:     Number(process.env.DB_PORT) || 32636,
    user:     process.env.DB_USER     || 'capt_noah',
    password: process.env.DB_PASSWORD || '5RDPrt#xe67gx@bv',
    database: process.env.DB_NAME     || 'portfolio_db',
  },
});
