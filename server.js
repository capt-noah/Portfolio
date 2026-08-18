import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
app.use(express.json());

// ============================================================
// 1. DB POOL  (plain mysql2 — no Drizzle at runtime)
// ============================================================
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

// ============================================================
// 2. AUTH
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
// 3. HEALTH / DIAGNOSTICS
// ============================================================
app.get('/hello', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Express server running on Plesk',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    port: process.env.PORT || 3000,
  });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const [ping]   = await pool.query('SELECT 1+1 AS result, NOW() AS server_time');
    const [tables] = await pool.query('SHOW TABLES');
    const [sample] = await pool.query('SELECT * FROM projects LIMIT 1');
    const [expCols]   = await pool.query('DESCRIBE experiences');
    const [socCols]   = await pool.query('DESCRIBE socials');
    const [stackCols] = await pool.query('DESCRIBE tech_stack');
    const [projCols]  = await pool.query('DESCRIBE projects');
    res.json({
      status: 'success', ping: ping[0], tables, sample: sample[0] ?? null,
      columns: { experiences: expCols, socials: socCols, tech_stack: stackCols, projects: projCols }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ============================================================
// 4. AUTH ENDPOINT
// ============================================================
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Invalid password' });
  }
  res.json({ success: true, token: generateToken() });
});

// ============================================================
// 5. AGGREGATE READ  (public — landing page + admin load)
// ============================================================
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
    console.error('GET /api/data:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio data', detail: err.message });
  }
});

// ============================================================
// 6. EXPERIENCES CRUD
// ============================================================
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

// ============================================================
// 7. PROJECTS CRUD
// ============================================================
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

// ============================================================
// 8. TECH STACK CRUD
// ============================================================
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

// ============================================================
// 9. SOCIALS CRUD
// ============================================================
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
// 10. STATIC + SPA FALLBACK
// ============================================================
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('Server is running.');
  }
});

// ============================================================
// 11. START
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
