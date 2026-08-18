import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ============================================================
// 1. MYSQL CONNECTION POOL
// ============================================================
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-db02.remote',
  port: Number(process.env.DB_PORT) || 32636,
  user: process.env.DB_USER || 'capt_noah',
  password: process.env.DB_PASSWORD || '5RDPrt#xe67gx@bv',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ============================================================
// 2. HEALTH & DIAGNOSTIC ENDPOINTS
// ============================================================
app.get('/hello', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ESM Express server is running on Plesk!',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    port: process.env.PORT || 3000
  });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const [ping] = await pool.query('SELECT 1 + 1 AS connection_test, NOW() AS server_time');
    const [tables] = await pool.query('SHOW TABLES');

    res.json({
      status: 'success',
      message: 'Node.js connected to MySQL on Plesk successfully!',
      ping: ping[0],
      tables: tables
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      status: 'database_error',
      errorMessage: error.message,
      errorCode: error.code,
      errno: error.errno,
      syscall: error.syscall,
      address: error.address,
      port: error.port,
      sqlState: error.sqlState
    });
  }
});

// ============================================================
// 3. STATIC FILES & REACT SPA FALLBACK
// ============================================================
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.get('/{*splat}', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('Express ESM server is active.');
  }
});

// ============================================================
// 4. PASSENGER BINDING
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
