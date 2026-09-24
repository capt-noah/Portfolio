import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import selihomRouter from './selihom/server/router.js';
import notflixRouter from './notflix/server/router.js';

// Prevent unhandled errors from crashing the Node.js process / Passenger
process.on('unhandledRejection', (reason) => {
  console.error('! Unhandled Promise Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('! Uncaught Exception:', err);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================================
// 1. SHARED DATABASE POOL
// ============================================================
const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'mysql-db02.remote',
  port:               Number(process.env.DB_PORT) || 32636,
  user:               process.env.DB_USER     || 'capt_noah',
  password:           process.env.DB_PASSWORD || '5RDPrt#xe67gx@bv',
  database:           process.env.DB_NAME     || 'portfolio_db',
  waitForConnections: true,
  connectionLimit:    Number(process.env.DB_POOL_MAX || 10),
  queueLimit:         0,
  connectTimeout:     5000,
  enableKeepAlive:    true,
  keepAliveInitialDelay: 30000,
  typeCast(field, next) {
    if (field.type === 'TINY' && field.length === 1) return field.string() === '1';
    if (field.type === 'DECIMAL' || field.type === 'NEWDECIMAL') return parseFloat(field.string());
    return next();
  },
  dateStrings: false,
  timezone: 'Z',
});

async function initDatabaseSchema() {
  try {
    const conn = await pool.getConnection();
    console.log(`✓ MySQL connected to ${process.env.DB_HOST || 'mysql-db02.remote'}/${process.env.DB_NAME || 'portfolio_db'}`);
    conn.release();

    try {
      const [rows] = await pool.query("SHOW COLUMNS FROM news LIKE 'image_paths'");
      if (rows && rows.length === 0) {
        await pool.query("ALTER TABLE news ADD COLUMN image_paths TEXT AFTER cover_image");
      }
    } catch (_) {}
  } catch (err) {
    console.warn(`! MySQL initial connection warning: ${err.message}`);
  }
}
initDatabaseSchema();

// ============================================================
// 2. PATH RESOLUTION (PORTFOLIO & SELIHOM)
// ============================================================
function findSelihomDir() {
  const candidates = [
    path.join(__dirname, 'selihom'),
    path.join(__dirname, 'selihom-charity'),
  ];
  for (const c of candidates) {
    try { if (fs.existsSync(c)) return c; } catch (_) {}
  }
  return path.join(__dirname, 'selihom');
}

function findSelihomDist() {
  const candidates = [
    path.join(__dirname, 'selihom', 'dist'),
    path.join(__dirname, 'selihom', 'selihom', 'dist'),
    path.join(__dirname, 'selihom-charity', 'dist'),
    path.join(__dirname, 'selihom'),
    path.join(__dirname, 'selihom-charity'),
    path.join(__dirname, 'dist', 'selihom'),
    path.join(__dirname, '..', 'selihom-charity', 'dist'),
    path.join(__dirname, '..', 'selihom', 'dist'),
  ];

  for (const c of candidates) {
    try {
      if (fs.existsSync(path.join(c, 'index.html'))) return c;
    } catch (_) {}
  }
  return path.join(__dirname, 'selihom', 'dist');
}

function findNotflixDir() {
  const candidates = [
    path.join(__dirname, 'notflix'),
    path.join(__dirname, 'NOTFLIX-web'),
    path.join(__dirname, '..', 'NOTFLIX-web'),
  ];
  for (const c of candidates) {
    try { if (fs.existsSync(c)) return c; } catch (_) {}
  }
  return path.join(__dirname, 'notflix');
}

function findNotflixDist() {
  const candidates = [
    path.join(__dirname, 'notflix', 'dist'),
    path.join(__dirname, 'notflix'),
    path.join(__dirname, 'NOTFLIX-web', 'dist'),
    path.join(__dirname, '..', 'NOTFLIX-web', 'dist'),
  ];
  for (const c of candidates) {
    try {
      if (fs.existsSync(path.join(c, 'index.html'))) return c;
    } catch (_) {}
  }
  return path.join(__dirname, 'notflix', 'dist');
}

// Uploads directory storage (safe directory creation)
const sDir = findSelihomDir();
const uploadsDir = path.join(sDir, 'uploads');
const publicUploadsDir = path.join(sDir, 'public', 'uploads');

try { if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true }); } catch (_) {}
try { if (!fs.existsSync(publicUploadsDir)) fs.mkdirSync(publicUploadsDir, { recursive: true }); } catch (_) {}

// Static uploads endpoints
app.use('/uploads', express.static(uploadsDir));
app.use('/uploads', express.static(publicUploadsDir));
app.use('/selihom/uploads', express.static(uploadsDir));
app.use('/selihom/uploads', express.static(publicUploadsDir));

// ============================================================
// 3. PORTFOLIO AUTH & HELPERS
// ============================================================
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'capt-noah';
const TOKEN_SECRET   = process.env.TOKEN_SECRET   || 'portfolio-secret-key-change-in-prod';

function generateToken() {
  const payload = Buffer.from(JSON.stringify({ ts: Date.now() })).toString('base64');
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

function verifyToken(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length < 2) return false;
  const sig     = parts.pop();
  const payload = parts.join('.');
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
  return sig === expected;
}

function auth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!verifyToken(token)) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// ============================================================
// 4. PORTFOLIO API ENDPOINTS
// ============================================================
app.get(['/health', '/ping', '/api/health', '/api/ping'], (req, res) => {
  res.json({
    status: 'ok',
    app: 'Portfolio Unified Server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: process.env.PORT || 3000,
  });
});

app.get(['/hello', '/api/hello'], (req, res) => {
  const sDist = findSelihomDist();
  const nDist = findNotflixDist();
  res.json({
    status: 'ok',
    message: 'Unified Express server running (Portfolio + Selihom + NotFlix)',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    port: process.env.PORT || 3000,
    selihomMounted: fs.existsSync(path.join(sDist, 'index.html')),
    selihomDist: sDist,
    notflixMounted: fs.existsSync(path.join(nDist, 'index.html')),
    notflixDist: nDist,
  });
});

app.get(['/api/db-test', '/db-test'], async (req, res) => {
  try {
    const [ping]   = await pool.query('SELECT 1+1 AS result, NOW() AS server_time');
    const [tables] = await pool.query('SHOW TABLES');
    res.json({ status: 'success', ping: ping[0], tables });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Invalid password' });
  }
  res.json({ success: true, token: generateToken() });
});

app.get('/api/data', async (req, res) => {
  try {
    const [[exp], [proj], [stack], [soc]] = await Promise.all([
      pool.query('SELECT id, period, role, description FROM experiences ORDER BY id ASC'),
      pool.query('SELECT id, title, meta, short_desc, detailed_desc, technologies, repo_url, live_link FROM projects ORDER BY display_order ASC, id ASC'),
      pool.query('SELECT id, name, color FROM tech_stack ORDER BY id ASC'),
      pool.query('SELECT id, name, url FROM socials ORDER BY id ASC'),
    ]);

    res.json({
      experience: exp.map(e => ({
        id:     e.id,
        period: e.period,
        role:   e.role,
        desc:   e.description,
      })),
      projects: proj.map(p => {
        let techs = p.technologies ?? [];
        if (typeof techs === 'string') {
          try { techs = JSON.parse(techs); } catch { techs = []; }
        }
        return {
          id:           String(p.id),
          title:        p.title,
          meta:         p.meta          ?? '',
          desc:         p.short_desc    ?? '',
          detailedDesc: p.detailed_desc ?? '',
          technologies: techs,
          repo:         p.repo_url      ?? '',
          link:         p.live_link     ?? '',
        };
      }),
      stack:   stack.map(s => ({ id: s.id, name: s.name, color: s.color ?? '#ffffff' })),
      socials: soc.map(s => ({ id: s.id, name: s.name, url: s.url })),
    });
  } catch (err) {
    console.warn(`GET /api/data: MySQL query failed (${err.message}). Serving fallback data.json`);
    try {
      const dataJsonPath = path.join(__dirname, 'data.json');
      if (fs.existsSync(dataJsonPath)) {
        const raw = fs.readFileSync(dataJsonPath, 'utf8');
        return res.json(JSON.parse(raw));
      }
    } catch (fsErr) {
      console.error('Fallback to data.json also failed:', fsErr);
    }
    res.status(500).json({ error: 'Failed to fetch portfolio data', detail: err.message });
  }
});

// Experiences CRUD
app.get('/api/experiences', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM experiences ORDER BY id ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/experiences', auth, async (req, res) => {
  const { period, role, description, displayOrder = 0 } = req.body;
  if (!period || !role || !description)
    return res.status(400).json({ error: 'period, role and description are required' });
  try {
    const [result] = await pool.query(
      'INSERT INTO experiences (period, role, description, display_order) VALUES (?, ?, ?, ?)',
      [period, role, description, displayOrder]
    );
    const [rows] = await pool.query('SELECT * FROM experiences WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/experiences/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const { period, role, description, displayOrder } = req.body;
  const fields = [];
  const values = [];
  if (period       !== undefined) { fields.push('period = ?');        values.push(period); }
  if (role         !== undefined) { fields.push('role = ?');          values.push(role); }
  if (description  !== undefined) { fields.push('description = ?');   values.push(description); }
  if (displayOrder !== undefined) { fields.push('display_order = ?'); values.push(displayOrder); }
  if (!fields.length) return res.status(400).json({ error: 'Nothing to update' });
  try {
    await pool.query(`UPDATE experiences SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
    const [rows] = await pool.query('SELECT * FROM experiences WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/experiences/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM experiences WHERE id = ?', [Number(req.params.id)]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Projects CRUD
app.get('/api/projects', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects ORDER BY display_order ASC, id ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/projects', auth, async (req, res) => {
  const { title, meta, shortDesc, detailedDesc, technologies, repoUrl, liveLink, displayOrder = 0 } = req.body;
  if (!title || !shortDesc)
    return res.status(400).json({ error: 'title and shortDesc are required' });
  try {
    const [result] = await pool.query(
      'INSERT INTO projects (title, meta, short_desc, detailed_desc, technologies, repo_url, live_link, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, meta ?? null, shortDesc, detailedDesc ?? null, JSON.stringify(technologies ?? []), repoUrl ?? null, liveLink ?? null, displayOrder]
    );
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/projects/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const { title, meta, shortDesc, detailedDesc, technologies, repoUrl, liveLink, displayOrder } = req.body;
  const fields = [];
  const values = [];
  if (title        !== undefined) { fields.push('title = ?');         values.push(title); }
  if (meta         !== undefined) { fields.push('meta = ?');          values.push(meta); }
  if (shortDesc    !== undefined) { fields.push('short_desc = ?');    values.push(shortDesc); }
  if (detailedDesc !== undefined) { fields.push('detailed_desc = ?'); values.push(detailedDesc); }
  if (technologies !== undefined) { fields.push('technologies = ?');  values.push(JSON.stringify(technologies)); }
  if (repoUrl      !== undefined) { fields.push('repo_url = ?');      values.push(repoUrl); }
  if (liveLink     !== undefined) { fields.push('live_link = ?');     values.push(liveLink); }
  if (displayOrder !== undefined) { fields.push('display_order = ?'); values.push(displayOrder); }
  if (!fields.length) return res.status(400).json({ error: 'Nothing to update' });
  try {
    await pool.query(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/projects/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM projects WHERE id = ?', [Number(req.params.id)]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Tech Stack CRUD
app.get('/api/stack', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tech_stack ORDER BY id ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/stack', auth, async (req, res) => {
  const { name, color = '#ffffff', displayOrder = 0 } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const [result] = await pool.query(
      'INSERT INTO tech_stack (name, color, display_order) VALUES (?, ?, ?)',
      [name, color, displayOrder]
    );
    const [rows] = await pool.query('SELECT * FROM tech_stack WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/stack/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const { name, color, displayOrder } = req.body;
  const fields = [];
  const values = [];
  if (name         !== undefined) { fields.push('name = ?');          values.push(name); }
  if (color        !== undefined) { fields.push('color = ?');         values.push(color); }
  if (displayOrder !== undefined) { fields.push('display_order = ?'); values.push(displayOrder); }
  if (!fields.length) return res.status(400).json({ error: 'Nothing to update' });
  try {
    await pool.query(`UPDATE tech_stack SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
    const [rows] = await pool.query('SELECT * FROM tech_stack WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/stack/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM tech_stack WHERE id = ?', [Number(req.params.id)]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Socials CRUD
app.get('/api/socials', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM socials ORDER BY id ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/socials', auth, async (req, res) => {
  const { name, url, displayOrder = 0 } = req.body;
  if (!name || !url) return res.status(400).json({ error: 'name and url are required' });
  try {
    const [result] = await pool.query(
      'INSERT INTO socials (name, url, display_order) VALUES (?, ?, ?)',
      [name, url, displayOrder]
    );
    const [rows] = await pool.query('SELECT * FROM socials WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/socials/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const { name, url, displayOrder } = req.body;
  const fields = [];
  const values = [];
  if (name         !== undefined) { fields.push('name = ?');          values.push(name); }
  if (url          !== undefined) { fields.push('url = ?');           values.push(url); }
  if (displayOrder !== undefined) { fields.push('display_order = ?'); values.push(displayOrder); }
  if (!fields.length) return res.status(400).json({ error: 'Nothing to update' });
  try {
    await pool.query(`UPDATE socials SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
    const [rows] = await pool.query('SELECT * FROM socials WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/socials/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM socials WHERE id = ?', [Number(req.params.id)]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
// 5. SUB-APPLICATION API ROUTERS (SELIHOM & NOTFLIX)
// ============================================================
// Mount Selihom Charity API router on both /selihom/api and /api
if (selihomRouter) {
  app.use('/selihom/api', selihomRouter);
  app.use('/api', selihomRouter);
}

// Mount NotFlix API router at /notflix/api
if (notflixRouter) {
  app.use('/notflix/api', notflixRouter);
} else {
  app.use('/notflix/api', (req, res) => {
    res.status(503).json({ error: 'NotFlix API router is not installed on this server instance.' });
  });
}

// ============================================================
// 6. STATIC ASSETS & SPA ROUTING
// ============================================================
const portfolioDist = path.join(__dirname, 'dist');
const selihomDist = findSelihomDist();
const notflixDist = findNotflixDist();

// Enforce trailing slashes on subpath apps so relative ./assets/ work properly
app.get('/notflix', (req, res, next) => {
  if (req.originalUrl === '/notflix' || req.originalUrl.startsWith('/notflix?')) {
    const query = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
    return res.redirect(301, `/notflix/${query}`);
  }
  next();
});
app.get('/selihom', (req, res, next) => {
  if (req.originalUrl === '/selihom' || req.originalUrl.startsWith('/selihom?')) {
    const query = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
    return res.redirect(301, `/selihom/${query}`);
  }
  next();
});

const staticOptions = {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    }
  },
};

// 1) Serve Portfolio static assets
if (fs.existsSync(portfolioDist)) {
  app.use(express.static(portfolioDist, staticOptions));
}

// 2) Serve Selihom static assets at /selihom and /selihom/selihom
if (selihomDist && fs.existsSync(selihomDist)) {
  app.use('/selihom', express.static(selihomDist, staticOptions));
  app.use('/selihom/selihom', express.static(selihomDist, staticOptions));

  const selihomAssets = path.join(selihomDist, 'assets');
  if (fs.existsSync(selihomAssets)) {
    app.use('/selihom/assets', express.static(selihomAssets, staticOptions));
    // Also allow root /assets fallback for Selihom bundles
    app.use('/assets', express.static(selihomAssets, staticOptions));
  }
}

// 3) Serve NotFlix static assets at /notflix
if (notflixDist && fs.existsSync(notflixDist)) {
  app.use('/notflix', express.static(notflixDist, staticOptions));
  const notflixAssets = path.join(notflixDist, 'assets');
  if (fs.existsSync(notflixAssets)) {
    app.use('/notflix/assets', express.static(notflixAssets, staticOptions));
  }
}

// 4) Static Asset Guard: Never serve SPA HTML for missing assets/files with file extensions
app.use(['/assets', '/selihom/assets', '/notflix/assets'], (req, res) => {
  res.status(404).type('text/plain').send('Asset not found');
});

app.get(/\.(js|mjs|css|map|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/i, (req, res) => {
  res.status(404).type('text/plain').send('Static resource not found');
});

// 5) Selihom SPA Fallback (serves Selihom index.html for any /selihom and /selihom/* request)
app.get(['/selihom', '/selihom/*'], (req, res, next) => {
  if (req.path.startsWith('/selihom/api') || req.path.startsWith('/api')) {
    return next();
  }
  const sDist = findSelihomDist();
  if (sDist) {
    const indexPath = path.join(sDist, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  res.status(404).send('Selihom Charity frontend not found.');
});

// 6) NotFlix SPA Fallback (serves NotFlix index.html for any /notflix and /notflix/* request)
app.get(['/notflix', '/notflix/*'], (req, res, next) => {
  if (req.path.startsWith('/notflix/api')) {
    return next();
  }
  const nDist = findNotflixDist();
  if (nDist) {
    const indexPath = path.join(nDist, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  res.status(404).send('NotFlix frontend not found.');
});

// 7) Portfolio SPA Fallback (all other routes, including /admin and /)
app.get('*', (req, res) => {
  const indexPath = path.join(portfolioDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(200).send('Portfolio server is running.');
});

// ============================================================
// 7. GLOBAL ERROR HANDLER
// ============================================================
app.use((err, req, res, next) => {
  console.error('! Unhandled server route error on', req.method, req.url, ':', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message,
  });
});

// ============================================================
// 8. START SERVER
// ============================================================
const PORT = process.env.PORT || 3000;
if (typeof PhusionPassenger !== 'undefined') {
  PhusionPassenger.configure({ autoInstall: false });
  app.listen('passenger', () => {
    console.log('✓ Server listening via Phusion Passenger');
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`- Portfolio root: http://localhost:${PORT}/`);
    console.log(`- Selihom route:  http://localhost:${PORT}/selihom`);
    console.log(`- NotFlix route:  http://localhost:${PORT}/notflix`);
  });
}
