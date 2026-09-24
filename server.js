import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
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
app.get('/hello', (req, res) => {
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

app.get('/api/db-test', async (req, res) => {
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
// 5. SELIHOM CHARITY API ROUTER
// ============================================================
const selihomRouter = express.Router();

function sanitize(value, maxLen = 500) {
  if (value == null) return '';
  return String(value).replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, maxLen);
}
function sanitizePhone(v)  { return sanitize(v, 30).replace(/[^\d+\-\s()]/g, ''); }
function isValidEmail(v)   { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function whitelist(v, arr, fb) { return arr.includes(v) ? v : fb; }

const BOOKING_STATUSES   = ['pending','approved','completed','cancelled'];
const PLEDGE_STATUSES    = ['pledged','received','cancelled'];
const VOLUNTEER_STATUSES = ['new','reviewed','accepted','declined'];
const VISIT_TYPES        = ['individual','group','corporate','school','volunteer'];
const VOLUNTEER_AREAS    = ['kitchen','medical','education','psychology','general'];
const VOLUNTEER_AVAIL    = ['weekdays','weekends','flexible'];
const INKIND_CATEGORIES  = ['Food','Clothing','Education','Medical','Hygiene','Other'];
const INKIND_URGENCIES   = ['High','Medium','Low'];
const EVENT_TYPES        = ['birthday','wedding','anniversary','other'];
const EVENT_STATUSES     = ['pending','confirmed','completed','cancelled'];
const NEWS_CATEGORIES    = ['Health','Community','Events','Announcements','Stories'];

async function q(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
async function q1(sql, params = []) {
  const rows = await q(sql, params);
  return rows[0] || null;
}

function rowToBooking(r) {
  if (!r) return null;
  return {
    id:               r.id,
    name:             r.name,
    email:            r.email,
    phone:            r.phone,
    date:             r.visit_date,
    timeSlot:         r.time_slot,
    visitType:        r.visit_type,
    visitorCount:     r.visitor_count,
    notes:            r.notes || '',
    status:           r.status,
    contactType:      r.contact_type,
    organizationName: r.organization_name,
    slotId:           r.slot_id || null,
    createdAt:        r.created_at,
  };
}

function rowToSlot(r) {
  if (!r) return null;
  return {
    id:              r.id,
    date:            r.slot_date,
    startTime:       r.start_time,
    endTime:         r.end_time,
    label:           r.label,
    maxBookings:     r.max_bookings,
    currentBookings: r.current_bookings,
    isActive:        !!r.is_active,
  };
}

function rowToVolunteer(r) {
  if (!r) return null;
  return {
    id:           r.id,
    fullName:     r.full_name,
    email:        r.email,
    phone:        r.phone,
    interestArea: r.interest_area,
    availability: r.availability,
    experience:   r.experience || '',
    status:       r.status,
    categoryId:   r.category_id,
    roleId:       r.role_id,
    roleName:     r.role_name,
    submittedAt:  r.submitted_at,
  };
}

function rowToNeed(r) {
  if (!r) return null;
  return {
    id:             r.id,
    name:           { en: r.name_en, am: r.name_am },
    category:       r.category,
    neededQuantity: { en: r.needed_qty_en, am: r.needed_qty_am },
    urgency:        r.urgency,
    description:    { en: r.description_en, am: r.description_am },
  };
}

function rowToMed(r) {
  if (!r) return null;
  return {
    id:             r.id,
    name:           r.name,
    monthlyQty:     r.monthly_qty,
    unitPrice:      r.unit_price,
    totalMonthly:   r.total_monthly,
    patientsHelped: r.patients_helped,
    urgency:        r.urgency,
    description:    { en: r.description_en || '', am: r.description_am || '' },
  };
}

function rowToNews(r) {
  if (!r) return null;
  let imagePaths = [];
  if (r.image_paths) {
    try {
      imagePaths = typeof r.image_paths === 'string' && r.image_paths.startsWith('[')
        ? JSON.parse(r.image_paths)
        : r.image_paths.split(',').map(s => s.trim()).filter(Boolean);
    } catch {
      imagePaths = [r.image_paths];
    }
  } else if (r.cover_image) {
    imagePaths = [r.cover_image];
  }

  return {
    id:          r.id,
    slug:        r.slug,
    title:       { en: r.title_en,   am: r.title_am   },
    excerpt:     { en: r.excerpt_en || '', am: r.excerpt_am || '' },
    body:        { en: r.body_en    || '', am: r.body_am    || '' },
    category:    r.category,
    coverImage:  r.cover_image || imagePaths[0] || '',
    imagePaths,
    author:      r.author,
    publishedAt: r.published_at instanceof Date ? r.published_at.toISOString() : r.published_at,
    isPublished: !!r.is_published,
  };
}

async function buildCategory(catRow) {
  const items = await q('SELECT * FROM supply_items WHERE category_id=? ORDER BY sort_order', [catRow.id]);
  return {
    id:    catRow.id,
    name:  { en: catRow.name_en, am: catRow.name_am },
    icon:  catRow.icon,
    color: catRow.color,
    items: items.map(it => ({
      id:         it.id,
      name:       { en: it.name_en,       am: it.name_am },
      neededQty:  { en: it.needed_qty_en, am: it.needed_qty_am },
      urgency:    it.urgency,
      impactDesc: { en: it.impact_desc_en,am: it.impact_desc_am },
    })),
  };
}

async function buildVolCategory(catRow) {
  const roles = await q('SELECT * FROM volunteer_roles WHERE category_id=? ORDER BY sort_order', [catRow.id]);
  return {
    id:    catRow.id,
    name:  { en: catRow.name_en, am: catRow.name_am },
    icon:  catRow.icon,
    color: catRow.color,
    roles: roles.map(r => ({
      id:          r.id,
      name:        { en: r.name_en,        am: r.name_am },
      description: { en: r.description_en, am: r.description_am },
    })),
  };
}

// Selihom ping / health
selihomRouter.get(['/ping', '/health'], async (_req, res) => {
  try {
    await pool.execute('SELECT 1 AS ping');
    res.json({ status: 'ok', db: 'connected', app: 'Selihom Charity API', timestamp: new Date().toISOString() });
  } catch (e) {
    res.status(200).json({ status: 'warning', db: 'disconnected', error: e.message, timestamp: new Date().toISOString() });
  }
});

// Bookings
selihomRouter.get('/bookings', async (_req, res) => {
  try {
    const rows = await q('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(rows.map(rowToBooking));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/bookings', async (req, res) => {
  try {
    const b = req.body;
    const name  = sanitize(b.name, 120);
    const phone = sanitizePhone(b.phone);
    if (!name)  return res.status(400).json({ error: 'name is required' });
    if (!phone) return res.status(400).json({ error: 'phone is required' });
    const email = sanitize(b.email, 120);
    if (email && !isValidEmail(email)) return res.status(400).json({ error: 'invalid email format' });

    const id          = sanitize(b.id, 40) || `TKT-${Date.now()}`;
    const visitDate   = sanitize(b.date, 80);
    const timeSlot    = sanitize(b.timeSlot, 80);
    const notes       = sanitize(b.notes, 600);
    const visitType   = whitelist(b.visitType, VISIT_TYPES, 'individual');
    const visitorCount= Math.max(1, Math.min(100, parseInt(b.visitorCount)||1));
    const status      = whitelist(b.status, BOOKING_STATUSES, 'pending');
    const createdAt   = sanitize(b.createdAt, 40) || new Date().toLocaleDateString();
    const contactType = sanitize(b.contactType, 20) || 'individual';
    const orgName     = sanitize(b.organizationName, 120);
    const slotId      = sanitize(b.slotId, 40) || null;

    await pool.execute(`
      INSERT INTO bookings
        (id,name,email,phone,visit_date,time_slot,visit_type,visitor_count,
         notes,status,contact_type,organization_name,slot_id,created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        name=VALUES(name), email=VALUES(email), phone=VALUES(phone),
        visit_date=VALUES(visit_date), time_slot=VALUES(time_slot),
        visit_type=VALUES(visit_type), visitor_count=VALUES(visitor_count),
        notes=VALUES(notes), status=VALUES(status), contact_type=VALUES(contact_type),
        organization_name=VALUES(organization_name), slot_id=VALUES(slot_id)
    `, [id,name,email,phone,visitDate,timeSlot,visitType,visitorCount,
        notes,status,contactType,orgName,slotId,createdAt]);

    if (slotId) {
      await pool.execute('UPDATE availability_slots SET current_bookings=current_bookings+1 WHERE id=?', [slotId]);
    }

    const rows = await q('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(rows.map(rowToBooking));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.put('/bookings/:id/status', async (req, res) => {
  try {
    const status = whitelist(req.body?.status, BOOKING_STATUSES, null);
    if (!status) return res.status(400).json({ error: 'invalid status value' });
    await pool.execute('UPDATE bookings SET status=? WHERE id=?', [status, req.params.id]);
    const rows = await q('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(rows.map(rowToBooking));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.delete('/bookings/:id', async (req, res) => {
  try {
    const bk = await q1('SELECT slot_id FROM bookings WHERE id=?', [req.params.id]);
    if (bk?.slot_id) {
      await pool.execute('UPDATE availability_slots SET current_bookings=GREATEST(current_bookings-1,0) WHERE id=?', [bk.slot_id]);
    }
    await pool.execute('DELETE FROM bookings WHERE id=?', [req.params.id]);
    const rows = await q('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(rows.map(rowToBooking));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Pledges
async function allPledges() {
  const pledges = await q('SELECT * FROM pledges ORDER BY created_at DESC');
  const result  = [];
  for (const p of pledges) {
    const items = await q('SELECT * FROM pledge_items WHERE pledge_id=?', [p.id]);
    result.push({
      id:          p.id,
      donorName:   p.donor_name,
      donorEmail:  p.donor_email,
      donorPhone:  p.donor_phone,
      type:        p.type,
      date:        p.date,
      status:      p.status,
      pledgedItems: items.map(it => ({ itemId: it.item_id, name: it.item_name, quantity: it.quantity })),
    });
  }
  return result;
}

selihomRouter.get('/pledges', async (_req, res) => {
  try { res.json(await allPledges()); } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/pledges', async (req, res) => {
  try {
    const b = req.body;
    const donorName  = sanitize(b.donorName, 120);
    const donorPhone = sanitizePhone(b.donorPhone);
    const donorEmail = sanitize(b.donorEmail, 120);
    if (!donorName) return res.status(400).json({ error: 'donorName is required' });
    if (!donorPhone && !donorEmail) return res.status(400).json({ error: 'phone or email required' });
    if (donorEmail && !isValidEmail(donorEmail)) return res.status(400).json({ error: 'invalid email' });
    const id     = sanitize(b.id, 40) || `PLG-${Date.now()}`;
    const date   = sanitize(b.date, 80);
    const status = whitelist(b.status, PLEDGE_STATUSES, 'pledged');
    const type   = whitelist(b.type, ['money','inkind'], 'inkind');
    await pool.execute(`
      INSERT INTO pledges (id,donor_name,donor_email,donor_phone,type,date,status)
      VALUES (?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        donor_name=VALUES(donor_name),donor_email=VALUES(donor_email),
        donor_phone=VALUES(donor_phone),type=VALUES(type),date=VALUES(date),status=VALUES(status)
    `, [id,donorName,donorEmail,donorPhone,type,date,status]);
    await pool.execute('DELETE FROM pledge_items WHERE pledge_id=?', [id]);
    for (const it of (Array.isArray(b.pledgedItems)?b.pledgedItems:[])) {
      await pool.execute(
        'INSERT INTO pledge_items (pledge_id,item_id,item_name,quantity) VALUES (?,?,?,?)',
        [id, sanitize(it.itemId,60), sanitize(it.name,200), Math.max(0,parseInt(it.quantity)||0)]);
    }
    res.json(await allPledges());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.put('/pledges/:id/status', async (req, res) => {
  try {
    const status = whitelist(req.body?.status, PLEDGE_STATUSES, null);
    if (!status) return res.status(400).json({ error: 'invalid status' });
    await pool.execute('UPDATE pledges SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ id: req.params.id, status });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.delete('/pledges/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM pledges WHERE id=?', [req.params.id]);
    res.json({ deleted: req.params.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Volunteers
selihomRouter.get('/volunteers', async (_req, res) => {
  try {
    const rows = await q('SELECT * FROM volunteers ORDER BY submitted_at DESC');
    res.json(rows.map(rowToVolunteer));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/volunteers', async (req, res) => {
  try {
    const b = req.body;
    const fullName = sanitize(b.fullName, 120);
    const phone    = sanitizePhone(b.phone);
    const email    = sanitize(b.email, 120);
    if (!fullName) return res.status(400).json({ error: 'fullName is required' });
    if (!phone && !email) return res.status(400).json({ error: 'phone or email required' });
    if (email && !isValidEmail(email)) return res.status(400).json({ error: 'invalid email' });
    const id           = sanitize(b.id, 40) || `VOL-${Date.now()}`;
    const interestArea = whitelist(b.interestArea, VOLUNTEER_AREAS, 'general');
    const availability = whitelist(b.availability, VOLUNTEER_AVAIL, 'flexible');
    const status       = whitelist(b.status, VOLUNTEER_STATUSES, 'new');
    const submittedAt  = sanitize(b.submittedAt, 40);
    await pool.execute(`
      INSERT INTO volunteers
        (id,full_name,email,phone,interest_area,availability,
         experience,status,category_id,role_id,role_name,submitted_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        full_name=VALUES(full_name),email=VALUES(email),phone=VALUES(phone),
        interest_area=VALUES(interest_area),availability=VALUES(availability),
        experience=VALUES(experience),status=VALUES(status),
        category_id=VALUES(category_id),role_id=VALUES(role_id),role_name=VALUES(role_name)
    `, [id,fullName,email,phone,interestArea,availability,
        sanitize(b.experience,1000),status,
        sanitize(b.categoryId,40),sanitize(b.roleId,40),sanitize(b.roleName,120),
        submittedAt]);
    const rows = await q('SELECT * FROM volunteers ORDER BY submitted_at DESC');
    res.json(rows.map(rowToVolunteer));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.put('/volunteers/:id/status', async (req, res) => {
  try {
    const status = whitelist(req.body?.status, VOLUNTEER_STATUSES, null);
    if (!status) return res.status(400).json({ error: 'invalid status' });
    await pool.execute('UPDATE volunteers SET status=? WHERE id=?', [status, req.params.id]);
    const rows = await q('SELECT * FROM volunteers ORDER BY submitted_at DESC');
    res.json(rows.map(rowToVolunteer));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.delete('/volunteers/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM volunteers WHERE id=?', [req.params.id]);
    const rows = await q('SELECT * FROM volunteers ORDER BY submitted_at DESC');
    res.json(rows.map(rowToVolunteer));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// In-Kind Needs
selihomRouter.get('/inkind_needs', async (_req, res) => {
  try {
    res.json((await q('SELECT * FROM inkind_needs')).map(rowToNeed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/inkind_needs', async (req, res) => {
  try {
    const b      = req.body;
    const nameEn = sanitize(b.name?.en, 200);
    if (!nameEn) return res.status(400).json({ error: 'name.en is required' });
    const id       = sanitize(b.id, 40) || `ik-${Date.now()}`;
    const category = whitelist(b.category, INKIND_CATEGORIES, 'Other');
    const urgency  = whitelist(b.urgency, INKIND_URGENCIES, 'Medium');
    await pool.execute(`
      INSERT INTO inkind_needs
        (id,name_en,name_am,category,needed_qty_en,needed_qty_am,urgency,description_en,description_am)
      VALUES (?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        name_en=VALUES(name_en),name_am=VALUES(name_am),category=VALUES(category),
        needed_qty_en=VALUES(needed_qty_en),needed_qty_am=VALUES(needed_qty_am),
        urgency=VALUES(urgency),description_en=VALUES(description_en),description_am=VALUES(description_am)
    `, [id, nameEn, sanitize(b.name?.am,200), category,
        sanitize(b.neededQuantity?.en,100), sanitize(b.neededQuantity?.am,100),
        urgency, sanitize(b.description?.en,600), sanitize(b.description?.am,600)]);
    res.json((await q('SELECT * FROM inkind_needs')).map(rowToNeed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.delete('/inkind_needs/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM inkind_needs WHERE id=?', [req.params.id]);
    res.json((await q('SELECT * FROM inkind_needs')).map(rowToNeed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/inkind_needs/reset', async (_req, res) => {
  try {
    res.json((await q('SELECT * FROM inkind_needs')).map(rowToNeed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin Profile
selihomRouter.get('/admin_profile', async (_req, res) => {
  try {
    const row = await q1('SELECT * FROM admin_profile LIMIT 1');
    if (!row) return res.status(404).json({ error: 'Admin profile not found' });
    res.json({
      name: row.name, email: row.email, role: row.role,
      phone: row.phone, username: row.username, passwordHash: row.password_hash,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/admin_profile', async (req, res) => {
  try {
    const b        = req.body;
    const username = sanitize(b.username, 60);
    const password = sanitize(b.passwordHash, 200);
    if (!username) return res.status(400).json({ error: 'username is required' });
    if (!password) return res.status(400).json({ error: 'password is required' });
    await pool.execute(`
      INSERT INTO admin_profile (name,email,role,phone,username,password_hash)
      VALUES (?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        name=VALUES(name),email=VALUES(email),role=VALUES(role),
        phone=VALUES(phone),password_hash=VALUES(password_hash)
    `, [sanitize(b.name,120), sanitize(b.email,120), sanitize(b.role,120),
        sanitizePhone(b.phone), username, password]);
    const row = await q1('SELECT * FROM admin_profile LIMIT 1');
    res.json({ name:row.name, email:row.email, role:row.role,
               phone:row.phone, username:row.username, passwordHash:row.password_hash });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Availability Slots
selihomRouter.get('/availability_slots', async (_req, res) => {
  try {
    res.json((await q('SELECT * FROM availability_slots ORDER BY slot_date, start_time')).map(rowToSlot));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.get('/availability_slots/available', async (_req, res) => {
  try {
    const rows = await q('SELECT * FROM availability_slots WHERE is_active=1 AND current_bookings<max_bookings ORDER BY slot_date, start_time');
    res.json(rows.map(rowToSlot));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/availability_slots', async (req, res) => {
  try {
    const b = req.body;
    const date      = sanitize(b.date, 80);
    const startTime = sanitize(b.startTime, 40);
    const endTime   = sanitize(b.endTime, 40);
    if (!date || !startTime || !endTime)
      return res.status(400).json({ error: 'date, startTime and endTime are required' });
    const id             = sanitize(b.id, 40) || `slot-${Date.now()}`;
    const maxBookings    = Math.max(1, Math.min(200, parseInt(b.maxBookings)||10));
    const currentBookings= Math.max(0, parseInt(b.currentBookings)||0);
    const isActive       = b.isActive !== false ? 1 : 0;
    await pool.execute(`
      INSERT INTO availability_slots
        (id,slot_date,start_time,end_time,label,max_bookings,current_bookings,is_active)
      VALUES (?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        slot_date=VALUES(slot_date),start_time=VALUES(start_time),end_time=VALUES(end_time),
        label=VALUES(label),max_bookings=VALUES(max_bookings),
        current_bookings=VALUES(current_bookings),is_active=VALUES(is_active)
    `, [id,date,startTime,endTime,sanitize(b.label,120),maxBookings,currentBookings,isActive]);
    res.json((await q('SELECT * FROM availability_slots ORDER BY slot_date, start_time')).map(rowToSlot));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.put('/availability_slots/:id', async (req, res) => {
  try {
    const existing = await q1('SELECT * FROM availability_slots WHERE id=?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Slot not found' });
    const b = { ...existing, ...req.body };
    await pool.execute(`
      UPDATE availability_slots
      SET slot_date=?,start_time=?,end_time=?,label=?,max_bookings=?,current_bookings=?,is_active=?
      WHERE id=?
    `, [sanitize(b.date||b.slot_date,80), sanitize(b.startTime||b.start_time,40),
        sanitize(b.endTime||b.end_time,40), sanitize(b.label,120),
        Math.max(1,parseInt(b.maxBookings||b.max_bookings)||10),
        Math.max(0,parseInt(b.currentBookings||b.current_bookings)||0),
        b.isActive!==false && b.is_active!==0 ? 1 : 0,
        req.params.id]);
    res.json((await q('SELECT * FROM availability_slots ORDER BY slot_date, start_time')).map(rowToSlot));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.delete('/availability_slots/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM availability_slots WHERE id=?', [req.params.id]);
    res.json((await q('SELECT * FROM availability_slots ORDER BY slot_date, start_time')).map(rowToSlot));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Medicine Items
selihomRouter.get('/medicine_items', async (_req, res) => {
  try {
    res.json((await q('SELECT * FROM medicine_items ORDER BY total_monthly DESC')).map(rowToMed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/medicine_items', async (req, res) => {
  try {
    const b    = req.body;
    const name = sanitize(b.name, 120);
    if (!name) return res.status(400).json({ error: 'name is required' });
    const id = sanitize(b.id, 40) || `med-${Date.now()}`;
    await pool.execute(`
      INSERT INTO medicine_items
        (id,name,monthly_qty,unit_price,total_monthly,patients_helped,urgency,description_en,description_am)
      VALUES (?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        name=VALUES(name),monthly_qty=VALUES(monthly_qty),unit_price=VALUES(unit_price),
        total_monthly=VALUES(total_monthly),patients_helped=VALUES(patients_helped),
        urgency=VALUES(urgency),description_en=VALUES(description_en),description_am=VALUES(description_am)
    `, [id, name,
        Math.max(0,parseInt(b.monthlyQty)||0), Math.max(0,parseFloat(b.unitPrice)||0),
        Math.max(0,parseFloat(b.totalMonthly)||0), Math.max(0,parseInt(b.patientsHelped)||0),
        whitelist(b.urgency, INKIND_URGENCIES, 'Medium'),
        sanitize(b.description?.en,500), sanitize(b.description?.am,500)]);
    res.json((await q('SELECT * FROM medicine_items ORDER BY total_monthly DESC')).map(rowToMed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.delete('/medicine_items/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM medicine_items WHERE id=?', [req.params.id]);
    res.json((await q('SELECT * FROM medicine_items ORDER BY total_monthly DESC')).map(rowToMed));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Medicine Pledges
async function allMedPledges() {
  const pledges = await q('SELECT * FROM medicine_pledges ORDER BY created_at DESC');
  const result  = [];
  for (const p of pledges) {
    const items = await q('SELECT * FROM medicine_pledge_items WHERE pledge_id=?', [p.id]);
    result.push({
      id: p.id, donorName: p.donor_name, donorPhone: p.donor_phone, donorEmail: p.donor_email,
      date: p.date, status: p.status, notes: p.notes,
      items: items.map(it => ({ medicineId: it.medicine_id, medicineName: it.medicine_name, quantity: it.quantity })),
    });
  }
  return result;
}

selihomRouter.get('/medicine_pledges', async (_req, res) => {
  try { res.json(await allMedPledges()); } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/medicine_pledges', async (req, res) => {
  try {
    const b = req.body;
    const donorName  = sanitize(b.donorName, 120);
    const donorPhone = sanitizePhone(b.donorPhone);
    const donorEmail = sanitize(b.donorEmail, 120);
    if (!donorName) return res.status(400).json({ error: 'donorName is required' });
    if (!donorPhone && !donorEmail) return res.status(400).json({ error: 'phone or email required' });
    const id = sanitize(b.id, 40) || `MED-${Date.now()}`;
    await pool.execute(`
      INSERT INTO medicine_pledges (id,donor_name,donor_phone,donor_email,date,status,notes)
      VALUES (?,?,?,?,?,?,?)
    `, [id,donorName,donorPhone,donorEmail,sanitize(b.date,80),
        whitelist(b.status,['pledged','received','cancelled'],'pledged'),sanitize(b.notes,500)]);
    for (const it of (Array.isArray(b.items)?b.items:[])) {
      await pool.execute(
        'INSERT INTO medicine_pledge_items (pledge_id,medicine_id,medicine_name,quantity) VALUES (?,?,?,?)',
        [id, sanitize(it.medicineId,40), sanitize(it.medicineName,120), Math.max(1,parseInt(it.quantity)||1)]);
    }
    res.json(await allMedPledges());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.put('/medicine_pledges/:id/status', async (req, res) => {
  try {
    const status = whitelist(req.body?.status,['pledged','received','cancelled'],null);
    if (!status) return res.status(400).json({ error: 'invalid status' });
    await pool.execute('UPDATE medicine_pledges SET status=? WHERE id=?', [status,req.params.id]);
    res.json(await allMedPledges());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.delete('/medicine_pledges/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM medicine_pledges WHERE id=?', [req.params.id]);
    res.json(await allMedPledges());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Supply Categories & Items
async function allSupplyCategories() {
  const cats   = await q('SELECT * FROM supply_categories ORDER BY sort_order');
  const result = [];
  for (const c of cats) result.push(await buildCategory(c));
  return result;
}

selihomRouter.get('/supply_categories', async (_req, res) => {
  try { res.json(await allSupplyCategories()); } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/supply_categories', async (req, res) => {
  try {
    const b      = req.body;
    const nameEn = sanitize(b.name?.en, 120);
    if (!nameEn) return res.status(400).json({ error: 'name.en is required' });
    const id = sanitize(b.id, 40) || `cat-${Date.now()}`;
    await pool.execute(`
      INSERT INTO supply_categories (id,name_en,name_am,icon,color)
      VALUES (?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        name_en=VALUES(name_en),name_am=VALUES(name_am),icon=VALUES(icon),color=VALUES(color)
    `, [id, nameEn, sanitize(b.name?.am,120), sanitize(b.icon,60)||'Package', sanitize(b.color,60)||'bg-brand-sky-400']);

    await pool.execute('DELETE FROM supply_items WHERE category_id=?', [id]);
    const items = Array.isArray(b.items) ? b.items : [];
    for (let ii = 0; ii < items.length; ii++) {
      const it = items[ii];
      const itId = sanitize(it.id, 40) || `itm-${Date.now()}-${ii}`;
      await pool.execute(`
        INSERT INTO supply_items
          (id,category_id,name_en,name_am,needed_qty_en,needed_qty_am,urgency,impact_desc_en,impact_desc_am,sort_order)
        VALUES (?,?,?,?,?,?,?,?,?,?)
      `, [itId, id, sanitize(it.name?.en,200), sanitize(it.name?.am,200),
          sanitize(it.neededQty?.en,100), sanitize(it.neededQty?.am,100),
          whitelist(it.urgency,INKIND_URGENCIES,'Medium'),
          sanitize(it.impactDesc?.en,300), sanitize(it.impactDesc?.am,300), ii]);
    }
    res.json(await allSupplyCategories());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.delete('/supply_categories/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM supply_categories WHERE id=?', [req.params.id]);
    res.json(await allSupplyCategories());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Supplies Pledges
async function allSuppliesPledges() {
  const pledges = await q('SELECT * FROM supplies_pledges ORDER BY created_at DESC');
  const result  = [];
  for (const p of pledges) {
    const items = await q('SELECT * FROM supplies_pledge_items WHERE pledge_id=?', [p.id]);
    result.push({
      id: p.id, donorName: p.donor_name, donorPhone: p.donor_phone, donorEmail: p.donor_email,
      categoryId: p.category_id, date: p.date, status: p.status, notes: p.notes,
      items: items.map(it => ({ itemId:it.item_id, itemName:it.item_name, quantity:it.quantity, custom:it.custom })),
    });
  }
  return result;
}

selihomRouter.get('/supplies_pledges', async (_req, res) => {
  try { res.json(await allSuppliesPledges()); } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/supplies_pledges', async (req, res) => {
  try {
    const b = req.body;
    const donorName  = sanitize(b.donorName, 120);
    const donorPhone = sanitizePhone(b.donorPhone);
    const donorEmail = sanitize(b.donorEmail, 120);
    if (!donorName) return res.status(400).json({ error: 'donorName is required' });
    if (!donorPhone && !donorEmail) return res.status(400).json({ error: 'phone or email required' });
    const id = sanitize(b.id, 40) || `SUP-${Date.now()}`;
    await pool.execute(`
      INSERT INTO supplies_pledges (id,donor_name,donor_phone,donor_email,category_id,date,status,notes)
      VALUES (?,?,?,?,?,?,?,?)
    `, [id,donorName,donorPhone,donorEmail,sanitize(b.categoryId,40),sanitize(b.date,80),
        whitelist(b.status,PLEDGE_STATUSES,'pledged'),sanitize(b.notes,500)]);
    for (const it of (Array.isArray(b.items)?b.items:[])) {
      await pool.execute(
        'INSERT INTO supplies_pledge_items (pledge_id,item_id,item_name,quantity,custom) VALUES (?,?,?,?,?)',
        [id, sanitize(it.itemId,40), sanitize(it.itemName,120), Math.max(1,parseInt(it.quantity)||1), sanitize(it.custom,200)]);
    }
    res.json(await allSuppliesPledges());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.put('/supplies_pledges/:id/status', async (req, res) => {
  try {
    const status = whitelist(req.body?.status, PLEDGE_STATUSES, null);
    if (!status) return res.status(400).json({ error: 'invalid status' });
    await pool.execute('UPDATE supplies_pledges SET status=? WHERE id=?', [status,req.params.id]);
    res.json(await allSuppliesPledges());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.delete('/supplies_pledges/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM supplies_pledges WHERE id=?', [req.params.id]);
    res.json(await allSuppliesPledges());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Event Pledges
function rowToEvent(r) {
  return {
    id: r.id, name: r.name, phone: r.phone, email: r.email,
    eventType: r.event_type, customType: r.custom_type,
    preferredDate: r.preferred_date, message: r.message,
    status: r.status, submittedAt: r.submitted_at,
  };
}

selihomRouter.get('/event_pledges', async (_req, res) => {
  try {
    res.json((await q('SELECT * FROM event_pledges ORDER BY created_at DESC')).map(rowToEvent));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/event_pledges', async (req, res) => {
  try {
    const b = req.body;
    const name  = sanitize(b.name, 120);
    const phone = sanitizePhone(b.phone);
    const email = sanitize(b.email, 120);
    if (!name) return res.status(400).json({ error: 'name is required' });
    if (!phone && !email) return res.status(400).json({ error: 'phone or email required' });
    const id = sanitize(b.id, 40) || `EVT-${Date.now()}`;
    await pool.execute(`
      INSERT INTO event_pledges
        (id,name,phone,email,event_type,custom_type,preferred_date,message,status,submitted_at)
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `, [id,name,phone,email,
        whitelist(b.eventType,EVENT_TYPES,'other'), sanitize(b.customType,80),
        sanitize(b.preferredDate,80), sanitize(b.message,600),
        whitelist(b.status,EVENT_STATUSES,'pending'), sanitize(b.submittedAt,40)]);
    res.json((await q('SELECT * FROM event_pledges ORDER BY created_at DESC')).map(rowToEvent));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.put('/event_pledges/:id/status', async (req, res) => {
  try {
    const status = whitelist(req.body?.status, EVENT_STATUSES, null);
    if (!status) return res.status(400).json({ error: 'invalid status' });
    await pool.execute('UPDATE event_pledges SET status=? WHERE id=?', [status,req.params.id]);
    res.json((await q('SELECT * FROM event_pledges ORDER BY created_at DESC')).map(rowToEvent));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.delete('/event_pledges/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM event_pledges WHERE id=?', [req.params.id]);
    res.json((await q('SELECT * FROM event_pledges ORDER BY created_at DESC')).map(rowToEvent));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Volunteer Categories & Roles
async function allVolunteerRoles() {
  const cats   = await q('SELECT * FROM volunteer_categories ORDER BY sort_order');
  const result = [];
  for (const c of cats) result.push(await buildVolCategory(c));
  return result;
}

selihomRouter.get('/volunteer_roles', async (_req, res) => {
  try { res.json(await allVolunteerRoles()); } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/volunteer_roles', async (req, res) => {
  try {
    const b      = req.body;
    const nameEn = sanitize(b.name?.en, 120);
    if (!nameEn) return res.status(400).json({ error: 'name.en is required' });
    const id = sanitize(b.id, 40) || `vcat-${Date.now()}`;
    await pool.execute(`
      INSERT INTO volunteer_categories (id,name_en,name_am,icon,color)
      VALUES (?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        name_en=VALUES(name_en),name_am=VALUES(name_am),icon=VALUES(icon),color=VALUES(color)
    `, [id, nameEn, sanitize(b.name?.am,120), sanitize(b.icon,60)||'Users', sanitize(b.color,60)||'bg-brand-sky-400']);

    await pool.execute('DELETE FROM volunteer_roles WHERE category_id=?', [id]);
    const roles = Array.isArray(b.roles) ? b.roles : [];
    for (let ri = 0; ri < roles.length; ri++) {
      const r  = roles[ri];
      const rid = sanitize(r.id, 40) || `vr-${Date.now()}-${ri}`;
      await pool.execute(`
        INSERT INTO volunteer_roles
          (id,category_id,name_en,name_am,description_en,description_am,sort_order)
        VALUES (?,?,?,?,?,?,?)
      `, [rid,id, sanitize(r.name?.en,120), sanitize(r.name?.am,120),
          sanitize(r.description?.en,300), sanitize(r.description?.am,300), ri]);
    }
    res.json(await allVolunteerRoles());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.delete('/volunteer_roles/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM volunteer_categories WHERE id=?', [req.params.id]);
    res.json(await allVolunteerRoles());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// File Upload
selihomRouter.post('/upload', async (req, res) => {
  try {
    const { filename, data, files } = req.body;

    const saveFile = (origName, base64Data) => {
      const matches = String(base64Data).match(/^data:([A-Za-z-+/0-9]+);base64,(.+)$/);
      const rawBase64 = matches ? matches[2] : base64Data;
      const buffer = Buffer.from(rawBase64, 'base64');
      const ext = path.extname(origName || '').toLowerCase() || (matches ? `.${matches[1].split('/')[1]}` : '.jpg');
      const cleanExt = ext.replace(/[^a-z0-9.]/g, '') || '.jpg';
      const safeName = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${cleanExt}`;
      const filePath = path.join(uploadsDir, safeName);
      const publicFilePath = path.join(publicUploadsDir, safeName);

      try { fs.writeFileSync(filePath, buffer); } catch (_) {}
      try { fs.writeFileSync(publicFilePath, buffer); } catch (_) {}

      return `/uploads/${safeName}`;
    };

    if (Array.isArray(files) && files.length > 0) {
      const urls = files.map(f => saveFile(f.filename || 'image.jpg', f.data));
      return res.json({ urls });
    }

    if (!data) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const url = saveFile(filename || 'image.jpg', data);
    res.json({ url, path: url, filename: path.basename(url) });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image: ' + err.message });
  }
});

// News
selihomRouter.get('/news', async (req, res) => {
  try {
    const rows = req.query.all === 'true'
      ? await q('SELECT * FROM news ORDER BY published_at DESC')
      : await q('SELECT * FROM news WHERE is_published=1 ORDER BY published_at DESC');
    res.json(rows.map(rowToNews));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.get('/news/:slug', async (req, res) => {
  try {
    const row = await q1('SELECT * FROM news WHERE slug=?', [req.params.slug]);
    if (!row) return res.status(404).json({ error: 'Article not found' });
    res.json(rowToNews(row));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.post('/news', async (req, res) => {
  try {
    const b       = req.body;
    const titleEn = sanitize(b.title?.en, 200);
    if (!titleEn) return res.status(400).json({ error: 'title.en is required' });
    const id      = sanitize(b.id, 40) || `news-${Date.now()}`;
    const rawSlug = (sanitize(b.slug || titleEn, 200))
      .toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'').slice(0,80)
      || `article-${Date.now()}`;
    const publishedAt = b.publishedAt ? new Date(b.publishedAt) : new Date();

    const imagePaths = Array.isArray(b.imagePaths)
      ? b.imagePaths
      : (b.coverImage ? [b.coverImage] : []);
    const coverImage = sanitize(b.coverImage || imagePaths[0] || '', 500);
    const imagePathsStr = JSON.stringify(imagePaths);

    await pool.execute(`
      INSERT INTO news
        (id,slug,title_en,title_am,excerpt_en,excerpt_am,body_en,body_am,
         category,cover_image,image_paths,author,published_at,is_published)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        slug=VALUES(slug),title_en=VALUES(title_en),title_am=VALUES(title_am),
        excerpt_en=VALUES(excerpt_en),excerpt_am=VALUES(excerpt_am),
        body_en=VALUES(body_en),body_am=VALUES(body_am),
        category=VALUES(category),cover_image=VALUES(cover_image),
        image_paths=VALUES(image_paths),
        author=VALUES(author),published_at=VALUES(published_at),is_published=VALUES(is_published)
    `, [id, rawSlug, titleEn, sanitize(b.title?.am, 200),
        sanitize(b.excerpt?.en || '', 400), sanitize(b.excerpt?.am || '', 400),
        b.body?.en || '', b.body?.am || '',
        whitelist(b.category, NEWS_CATEGORIES, 'Community'),
        coverImage, imagePathsStr, sanitize(b.author, 80),
        publishedAt, b.isPublished === true ? 1 : 0]);
    const row = await q1('SELECT * FROM news WHERE id=?', [id]);
    res.json(rowToNews(row));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.put('/news/:id/publish', async (req, res) => {
  try {
    const isPublished = req.body.isPublished === true ? 1 : 0;
    await pool.execute('UPDATE news SET is_published=? WHERE id=?', [isPublished,req.params.id]);
    const rows = await q('SELECT * FROM news ORDER BY published_at DESC');
    res.json(rows.map(rowToNews));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

selihomRouter.delete('/news/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM news WHERE id=?', [req.params.id]);
    const rows = await q('SELECT * FROM news ORDER BY published_at DESC');
    res.json(rows.map(rowToNews));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Full-DB Export / Backup
selihomRouter.get(['/db','/db/download'], async (req, res) => {
  try {
    const [bookingRows, pledgeRows, volRows, needRows, slotRows, medRows,
           medPledgeRows, catRows, supPledgeRows, evtRows, volCatRows, newsRows,
           apRow] = await Promise.all([
      q('SELECT * FROM bookings ORDER BY created_at DESC'),
      q('SELECT * FROM pledges ORDER BY created_at DESC'),
      q('SELECT * FROM volunteers ORDER BY submitted_at DESC'),
      q('SELECT * FROM inkind_needs'),
      q('SELECT * FROM availability_slots ORDER BY slot_date'),
      q('SELECT * FROM medicine_items ORDER BY total_monthly DESC'),
      q('SELECT * FROM medicine_pledges ORDER BY created_at DESC'),
      q('SELECT * FROM supply_categories ORDER BY sort_order'),
      q('SELECT * FROM supplies_pledges ORDER BY created_at DESC'),
      q('SELECT * FROM event_pledges ORDER BY created_at DESC'),
      q('SELECT * FROM volunteer_categories ORDER BY sort_order'),
      q('SELECT * FROM news ORDER BY published_at DESC'),
      q1('SELECT * FROM admin_profile LIMIT 1'),
    ]);
    const out = {
      bookings:        bookingRows.map(rowToBooking),
      pledges:         pledgeRows.map(r => ({id:r.id,donorName:r.donor_name,donorEmail:r.donor_email,donorPhone:r.donor_phone,type:r.type,date:r.date,status:r.status,pledgedItems:[]})),
      volunteers:      volRows.map(rowToVolunteer),
      inKindNeeds:     needRows.map(rowToNeed),
      availabilitySlots: slotRows.map(rowToSlot),
      medicineItems:   medRows.map(rowToMed),
      medicinePledges: await allMedPledges(),
      supplyCategories:await allSupplyCategories(),
      suppliesPledges: await allSuppliesPledges(),
      eventPledges:    evtRows.map(rowToEvent),
      volunteerRoles:  await allVolunteerRoles(),
      news:            newsRows.map(rowToNews),
      adminProfile:    apRow ? { name:apRow.name,email:apRow.email,role:apRow.role,phone:apRow.phone,username:apRow.username,passwordHash:apRow.password_hash } : null,
    };
    if (req.query.download==='true' || req.path.includes('download')) {
      res.setHeader('Content-Type','application/json');
      res.setHeader('Content-Disposition','attachment; filename="selihom_backup.json"');
      return res.send(JSON.stringify(out, null, 2));
    }
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Mount Selihom API routes on both /selihom/api and /api
app.use('/selihom/api', selihomRouter);
app.use('/api', selihomRouter);

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

// 1) Serve Portfolio static assets
if (fs.existsSync(portfolioDist)) {
  app.use(express.static(portfolioDist));
}

// 2) Serve Selihom static assets at /selihom and /selihom/selihom
if (selihomDist && fs.existsSync(selihomDist)) {
  app.use('/selihom', express.static(selihomDist));
  app.use('/selihom/selihom', express.static(selihomDist));

  const selihomAssets = path.join(selihomDist, 'assets');
  if (fs.existsSync(selihomAssets)) {
    app.use('/selihom/assets', express.static(selihomAssets));
  }
}

// 3) Serve NotFlix static assets at /notflix
if (notflixDist && fs.existsSync(notflixDist)) {
  app.use('/notflix', express.static(notflixDist));
  const notflixAssets = path.join(notflixDist, 'assets');
  if (fs.existsSync(notflixAssets)) {
    app.use('/notflix/assets', express.static(notflixAssets));
  }
}

// 4) Selihom SPA Fallback (serves Selihom index.html for any /selihom and /selihom/* request)
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

// 5) NotFlix SPA Fallback (serves NotFlix index.html for any /notflix and /notflix/* request)
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

// 6) Portfolio SPA Fallback (all other routes, including /admin and /)
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
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`- Portfolio root: http://localhost:${PORT}/`);
  console.log(`- Selihom route:  http://localhost:${PORT}/selihom`);
  console.log(`- NotFlix route: http://localhost:${PORT}/notflix`);
});
