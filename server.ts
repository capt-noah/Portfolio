import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load .env file (if present)
dotenv.config();

// ============================================================
// 1. ENVIRONMENT VARIABLES INSPECTION LOG
// ============================================================
console.log('--- 🚀 SERVER ENVIRONMENT CONFIGURATION ---');
console.log('NODE_ENV:    ', process.env.NODE_ENV || '(not set)');
console.log('PORT:        ', process.env.PORT || '3000 (fallback)');
console.log('DB_HOST:     ', process.env.DB_HOST || 'mysql-db02.remote (fallback)');
console.log('DB_PORT:     ', process.env.DB_PORT || '32636 (fallback)');
console.log('DB_USER:     ', process.env.DB_USER || 'capt_noah (fallback)');
console.log('DB_NAME:     ', process.env.DB_NAME || 'portfolio_db (fallback)');
console.log('DB_PASSWORD: ', process.env.DB_PASSWORD ? `[LOADED - length: ${process.env.DB_PASSWORD.length}]` : '[NOT SET / MISSING(5RDPrt#xe67gx@bv)]');
console.log('------------------------------------------');

const app = express();
app.use(express.json());

// ============================================================
// 2. MYSQL CONNECTION POOL CONFIGURATION
// ============================================================
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-db02.remote',
  port: Number(process.env.DB_PORT) || 32636,
  user: process.env.DB_USER || 'capt_noah',
  password: process.env.DB_PASSWORD || 'YOUR_DATABASE_PASSWORD',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ============================================================
// 3. API & DIAGNOSTIC ROUTES
// ============================================================

// Diagnostic Test Endpoint
app.get('/api/db-test', async (req: Request, res: Response) => {
  try {
    const [ping] = await pool.query('SELECT 1 + 1 AS connection_test, NOW() AS server_time');
    const [tables] = await pool.query('SHOW TABLES');

    res.json({
      status: 'success',
      message: 'Node.js connected to MySQL on Plesk successfully!',
      envCheck: {
        host: process.env.DB_HOST || 'mysql-db02.remote',
        port: process.env.DB_PORT || 32636,
        user: process.env.DB_USER || 'capt_noah',
        database: process.env.DB_NAME || 'portfolio_db',
        passwordConfigured: Boolean(process.env.DB_PASSWORD),
      },
      ping: (ping as any)[0],
      tables,
    });
  } catch (error: any) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      code: error.code,
      errno: error.errno,
      envCheck: {
        host: process.env.DB_HOST || 'mysql-db02.remote',
        port: process.env.DB_PORT || 32636,
        user: process.env.DB_USER || 'capt_noah',
        database: process.env.DB_NAME || 'portfolio_db',
        passwordConfigured: Boolean(process.env.DB_PASSWORD),
      },
    });
  }
});

// Full Portfolio Data Endpoint
app.get('/api/portfolio-data', async (req: Request, res: Response) => {
  try {
    const [experiences] = await pool.query(
      'SELECT period, role, description AS `desc` FROM experiences ORDER BY display_order ASC'
    );
    const [projectsRaw] = await pool.query(
      'SELECT id, title, meta, short_desc AS `desc`, detailed_desc AS detailedDesc, technologies, repo_url AS repo, live_link AS link FROM projects ORDER BY display_order ASC'
    );
    const [stack] = await pool.query('SELECT name, color FROM tech_stack');
    const [socials] = await pool.query('SELECT name, url FROM socials');

    const projects = (projectsRaw as any[]).map((p) => ({
      ...p,
      technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies,
    }));

    res.json({
      experience: experiences,
      projects,
      stack,
      socials,
    });
  } catch (error: any) {
    console.error('Database query error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// ============================================================
// 4. STATIC ASSETS & SPA WILDCARD CATCH-ALL
// ============================================================
const distPath = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
const indexPath = path.join(distPath, 'index.html');

app.use(express.static(distPath));

app.get('/{*splat}', (req: Request, res: Response) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('React bundle dist/index.html not found. Run npm run build.');
  }
});

// ============================================================
// 5. PASSENGER DYNAMIC BINDING
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Portfolio server listening on port ${PORT}`);
});
