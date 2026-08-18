import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/mysql2';
import { mysqlTable, int, varchar, text, longtext, json, timestamp } from 'drizzle-orm/mysql-core';
import { asc, eq } from 'drizzle-orm';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
app.use(express.json());

// ============================================================
// 1. SCHEMA
// ============================================================
const experiences = mysqlTable('experiences', {
  id:           int('id').autoincrement().primaryKey(),
  period:       varchar('period', { length: 100 }).notNull(),
  role:         varchar('role', { length: 255 }).notNull(),
  description:  text('description').notNull(),
  displayOrder: int('display_order').default(0),
  createdAt:    timestamp('created_at').defaultNow(),
});

const projects = mysqlTable('projects', {
  id:           int('id').autoincrement().primaryKey(),
  title:        varchar('title', { length: 255 }).notNull(),
  meta:         varchar('meta', { length: 255 }),
  shortDesc:    text('short_desc').notNull(),
  detailedDesc: longtext('detailed_desc'),
  technologies: json('technologies').notNull(),
  repoUrl:      varchar('repo_url', { length: 500 }),
  liveLink:     varchar('live_link', { length: 500 }),
  displayOrder: int('display_order').default(0),
  createdAt:    timestamp('created_at').defaultNow(),
});

const techStack = mysqlTable('tech_stack', {
  id:           int('id').autoincrement().primaryKey(),
  name:         varchar('name', { length: 100 }).notNull(),
  color:        varchar('color', { length: 50 }).default('#ffffff'),
  displayOrder: int('display_order').default(0),
});

const socials = mysqlTable('socials', {
  id:           int('id').autoincrement().primaryKey(),
  name:         varchar('name', { length: 100 }).notNull(),
  url:          varchar('url', { length: 500 }).notNull(),
  displayOrder: int('display_order').default(0),
});

// ============================================================
// 2. DB POOL + DRIZZLE
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

const db = drizzle(pool, { mode: 'default' });

// ============================================================
// 3. AUTH
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
// 4. HEALTH / DIAGNOSTICS
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
    res.json({ status: 'success', ping: ping[0], tables });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ============================================================
// 5. AUTH ENDPOINT
// ============================================================
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Invalid password' });
  }
  res.json({ success: true, token: generateToken() });
});

// ============================================================
// 6. AGGREGATE READ  (public — landing page + admin load)
// ============================================================
app.get('/api/data', async (req, res) => {
  try {
    const [exp, proj, stack, soc] = await Promise.all([
      db.select().from(experiences).orderBy(asc(experiences.displayOrder)),
      db.select().from(projects).orderBy(asc(projects.displayOrder)),
      db.select().from(techStack).orderBy(asc(techStack.displayOrder)),
      db.select().from(socials).orderBy(asc(socials.displayOrder)),
    ]);

    res.json({
      experience: exp.map(e => ({
        id:     e.id,
        period: e.period,
        role:   e.role,
        desc:   e.description,
      })),
      projects: proj.map(p => ({
        id:           String(p.id),
        title:        p.title,
        meta:         p.meta         ?? '',
        desc:         p.shortDesc,
        detailedDesc: p.detailedDesc ?? '',
        technologies: p.technologies ?? [],
        repo:         p.repoUrl      ?? '',
        link:         p.liveLink     ?? '',
      })),
      stack:   stack.map(s => ({ id: s.id, name: s.name, color: s.color })),
      socials: soc.map(s => ({ id: s.id, name: s.name, url: s.url })),
    });
  } catch (err) {
    console.error('GET /api/data:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

// ============================================================
// 7. EXPERIENCES CRUD
// ============================================================
app.get('/api/experiences', auth, async (req, res) => {
  try {
    res.json(await db.select().from(experiences).orderBy(asc(experiences.displayOrder)));
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
    const [row] = await db.select().from(experiences).where(eq(experiences.id, result.insertId));
    res.status(201).json(row);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/experiences/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const { period, role, description, displayOrder } = req.body;
  try {
    await db.update(experiences).set({
      ...(period       !== undefined && { period }),
      ...(role         !== undefined && { role }),
      ...(description  !== undefined && { description }),
      ...(displayOrder !== undefined && { displayOrder }),
    }).where(eq(experiences.id, id));
    const [row] = await db.select().from(experiences).where(eq(experiences.id, id));
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/experiences/:id', auth, async (req, res) => {
  try {
    await db.delete(experiences).where(eq(experiences.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
// 8. PROJECTS CRUD
// ============================================================
app.get('/api/projects', auth, async (req, res) => {
  try {
    res.json(await db.select().from(projects).orderBy(asc(projects.displayOrder)));
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
    const [row] = await db.select().from(projects).where(eq(projects.id, result.insertId));
    res.status(201).json(row);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/projects/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const { title, meta, shortDesc, detailedDesc, technologies, repoUrl, liveLink, displayOrder } = req.body;
  try {
    await db.update(projects).set({
      ...(title        !== undefined && { title }),
      ...(meta         !== undefined && { meta }),
      ...(shortDesc    !== undefined && { shortDesc }),
      ...(detailedDesc !== undefined && { detailedDesc }),
      ...(technologies !== undefined && { technologies }),
      ...(repoUrl      !== undefined && { repoUrl }),
      ...(liveLink     !== undefined && { liveLink }),
      ...(displayOrder !== undefined && { displayOrder }),
    }).where(eq(projects.id, id));
    const [row] = await db.select().from(projects).where(eq(projects.id, id));
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/projects/:id', auth, async (req, res) => {
  try {
    await db.delete(projects).where(eq(projects.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
// 9. TECH STACK CRUD
// ============================================================
app.get('/api/stack', auth, async (req, res) => {
  try {
    res.json(await db.select().from(techStack).orderBy(asc(techStack.displayOrder)));
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
    const [row] = await db.select().from(techStack).where(eq(techStack.id, result.insertId));
    res.status(201).json(row);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/stack/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const { name, color, displayOrder } = req.body;
  try {
    await db.update(techStack).set({
      ...(name         !== undefined && { name }),
      ...(color        !== undefined && { color }),
      ...(displayOrder !== undefined && { displayOrder }),
    }).where(eq(techStack.id, id));
    const [row] = await db.select().from(techStack).where(eq(techStack.id, id));
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/stack/:id', auth, async (req, res) => {
  try {
    await db.delete(techStack).where(eq(techStack.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
// 10. SOCIALS CRUD
// ============================================================
app.get('/api/socials', auth, async (req, res) => {
  try {
    res.json(await db.select().from(socials).orderBy(asc(socials.displayOrder)));
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
    const [row] = await db.select().from(socials).where(eq(socials.id, result.insertId));
    res.status(201).json(row);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/socials/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const { name, url, displayOrder } = req.body;
  try {
    await db.update(socials).set({
      ...(name         !== undefined && { name }),
      ...(url          !== undefined && { url }),
      ...(displayOrder !== undefined && { displayOrder }),
    }).where(eq(socials.id, id));
    const [row] = await db.select().from(socials).where(eq(socials.id, id));
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/socials/:id', auth, async (req, res) => {
  try {
    await db.delete(socials).where(eq(socials.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
// 11. STATIC + SPA FALLBACK
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
    res.status(200).send('Server is running.');
  }
});

// ============================================================
// 12. START
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
