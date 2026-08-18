import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load .env if present
dotenv.config();

// ============================================================
// 1. DATABASE CONFIGURATION (WITH HARDCODED DEFAULTS)
// ============================================================
const DB_HOST = process.env.DB_HOST || 'mysql-db02.remote';
const DB_PORT = Number(process.env.DB_PORT) || 32636;
const DB_USER = process.env.DB_USER || 'capt_noah';
const DB_PASS = process.env.DB_PASSWORD || '5RDPrt#xe67gx@bv';
const DB_NAME = process.env.DB_NAME || 'portfolio_db';

console.log('--- 🚀 SERVER DATABASE CONFIGURATION ---');
console.log('DB_HOST:', DB_HOST);
console.log('DB_PORT:', DB_PORT);
console.log('DB_USER:', DB_USER);
console.log('DB_NAME:', DB_NAME);
console.log('----------------------------------------');

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(express.json());

// ============================================================
// 2. HTTP REQUEST LOGGER
// ============================================================
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`);
  });
  next();
});

// ============================================================
// 3. API & DIAGNOSTIC ENDPOINTS
// ============================================================

// Diagnostic Test Endpoint: visit /api/db-test in browser
app.get('/api/db-test', async (req: Request, res: Response) => {
  try {
    const [ping] = await pool.query('SELECT 1 + 1 AS connection_test, NOW() AS server_time');
    const [tables] = await pool.query('SHOW TABLES');

    res.json({
      status: 'success',
      message: 'Node.js connected to MySQL on Plesk successfully!',
      connectionDetails: {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        database: DB_NAME,
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
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      connectionDetails: {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        database: DB_NAME,
      },
    });
  }
});

// Aggregated Portfolio Data Endpoint
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
      code: error.code,
    });
  }
});

// ============================================================
// 4. STATIC ASSETS & REACT SPA WILDCARD CATCH-ALL
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
// 5. PROCESS MANAGER BINDING
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Portfolio server listening on port ${PORT}`);
});
