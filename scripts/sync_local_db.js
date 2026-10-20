import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const experiences = [
  {
    id: 1,
    period: 'Aug. 2026 — Oct. 2026',
    role: 'Full-Stack Software Engineer // HKC Trading PLC',
    description: 'Engineered a custom ERP featuring an integrated finance module that automated double-entry bookkeeping and ledger reconciliations with minimal manual involvement. Automated multi-warehouse inventory valuation, sales invoicing, and financial reporting pipelines. Configured Linux server deployment, database backup automation, and storage integrations via Plesk.',
    display_order: 1,
    certificates: null,
  },
  {
    id: 2,
    period: 'Aug. 2026 — Sep. 2026',
    role: 'Web Developer // Selihom Charity Foundation',
    description: 'Built a responsive bilingual web portal allowing community members to browse needed items and submit donation pledges. Developed an administrative pledge-tracking system to monitor and record donation commitments in real time.',
    display_order: 2,
    certificates: null,
  },
  {
    id: 3,
    period: 'Sep. 2025 — Dec. 2025',
    role: 'Lead Full Stack Engineer // Lideta Sub-City Administration',
    description: 'Architected the official public administration portal providing departmental services and community information. Built workflows for public news, events, online job vacancy applications, and formal citizen complaint submissions. Maintained high system uptime and secure records integration across municipal departments.',
    display_order: 3,
    certificates: null,
  },
  {
    id: 4,
    period: 'Feb. 2025 — Aug. 2025',
    role: 'Front-End Pro-Development & Foundations // ALX Africa',
    description: 'Completed intensive 7-month professional software engineering program covering modern front-end web architecture, responsive interface engineering, UI/UX implementation, asynchronous API integration, and foundational engineering principles.',
    display_order: 4,
    certificates: JSON.stringify([
      {
        id: 'alx-frontend-pro-developer',
        title: 'Front-End Web Pro-Development',
        issuer: 'ALX Africa',
        date: 'August 2025',
        image: '/certificates/alx-frontend-pro-developer.png',
      },
      {
        id: 'alx-professional-foundations',
        title: 'Professional Foundations',
        issuer: 'ALX Africa',
        date: 'August 2025',
        image: '/certificates/alx-professional-foundations.png',
      },
    ]),
  },
];

const projects = [
  {
    id: '01',
    title: 'Tone',
    meta: 'Mobile Audio Streaming / Offline Music Platform',
    short_desc: 'A cross-platform mobile audio application featuring offline playback caching, synchronized music libraries, and an automated Telegram bot service.',
    detailed_desc: 'Tone is a cross-platform mobile audio application built to make saving and listening to music seamless and accessible offline. Users can submit audio files and tracks via a connected Telegram bot service, which automatically parses metadata, extracts audio streams, and synchronizes playlists to user devices for high-fidelity offline playback. Built with React Native, Expo, Express, and PostgreSQL.',
    technologies: JSON.stringify([
      'React Native',
      'Expo',
      'TypeScript',
      'Express',
      'PostgreSQL',
      'Telegram Bot API',
    ]),
    repo_url: 'https://github.com/capt-noah/musicly-app',
    live_link: 'https://musicly-web.vercel.app/',
    display_order: 1,
  },
  {
    id: '02',
    title: 'ParkAddis',
    meta: 'Smart Parking / Urban Mobility Platform',
    short_desc: 'A real-time smart parking reservation platform with geospatial queries to locate vacant parking stalls and integrated digital payments.',
    detailed_desc: 'ParkAddis is a platform created to eliminate parking congestion in Addis Ababa. Users can quickly locate vacant parking stalls through interactive map queries, reserve spots in advance, pay securely using Chapa or the ParkAddis digital wallet, and receive expiration alerts via automated session tracking.',
    technologies: JSON.stringify([
      'React Native',
      'Next.js',
      'Bun',
      'Express',
      'PostgreSQL',
      'PostGIS',
      'Tailwind CSS',
    ]),
    repo_url: 'https://github.com/capt-noah/park-addis',
    live_link: 'https://park-addis.vercel.app',
    display_order: 2,
  },
  {
    id: '03',
    title: 'Typer',
    meta: 'Productivity / Typing Practice Application',
    short_desc: 'An interactive typing practice application with real-time WPM calculation, accuracy metrics, and a book-reading speed typing mode.',
    detailed_desc: 'Typer is a modern typing practice platform that combines speed drills with interactive literature reading. Users can type directly over classical and custom texts with real-time keystroke precision tracking, visual error distribution heatmaps, and WPM analytics.',
    technologies: JSON.stringify([
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Express',
    ]),
    repo_url: 'https://github.com/capt-noah/Typer',
    live_link: 'https://typer-woad.vercel.app/',
    display_order: 3,
  },
  {
    id: '04',
    title: 'Selihom Charity',
    meta: 'Bilingual Public Service & Community Portal',
    short_desc: 'A full-stack, bilingual (English & Amharic) charity and elderly care platform featuring donor pledges, visit scheduling, transformation stories, and a centralized administrative dashboard.',
    detailed_desc: 'Selihom Charity is a comprehensive web platform supporting elderly care and community initiatives in Addis Ababa. It features full bilingual localization (English & Amharic), allowing supporters to make monetary donations, pledge medicines or supplies, schedule on-site visits, and browse editorial news and transformation stories. An integrated administrative suite empowers staff to manage pledge fulfillments, volunteer applications, and visit bookings in real time.',
    technologies: JSON.stringify([
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'Express',
      'MySQL',
    ]),
    repo_url: 'https://github.com/capt-noah/selihom-charity',
    live_link: 'https://noah.enginner.et/selihom',
    display_order: 4,
  },
  {
    id: '05',
    title: 'Lideta Subcity Portal',
    meta: 'Municipal Public Administration Portal',
    short_desc: 'Official digital portal for Lideta Subcity Administration providing departmental services, public announcements, and grievance submissions.',
    detailed_desc: 'A government digital portal engineered to streamline citizen access to public administrative services in Lideta Subcity. Includes public announcements, departmental office directories, vacancy applications, downloadable civic forms, and an online citizen complaint submission system.',
    technologies: JSON.stringify([
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
    ]),
    repo_url: 'https://github.com/capt-noah',
    live_link: 'https://lidetasubcity.gov.et',
    display_order: 5,
  },
];

const techStack = [
  { id: 1, name: 'React', color: '#61DAFB', display_order: 1 },
  { id: 2, name: 'Next.js', color: '#FFFFFF', display_order: 2 },
  { id: 3, name: 'TypeScript', color: '#3178C6', display_order: 3 },
  { id: 4, name: 'Tailwind', color: '#06B6D4', display_order: 4 },
  { id: 5, name: 'Node.js', color: '#339933', display_order: 5 },
  { id: 6, name: 'Bun', color: '#FBF0DF', display_order: 6 },
  { id: 7, name: 'Python', color: '#3776AB', display_order: 7 },
  { id: 8, name: 'PostgreSQL', color: '#4169E1', display_order: 8 },
  { id: 9, name: 'MySQL', color: '#4479A1', display_order: 9 },
  { id: 10, name: 'Supabase', color: '#3ECF8E', display_order: 10 },
  { id: 11, name: 'Docker', color: '#2496ED', display_order: 11 },
  { id: 12, name: 'Vite', color: '#646CFF', display_order: 12 },
  { id: 13, name: 'Git', color: '#F05032', display_order: 13 },
];

const socials = [
  { id: 1, name: 'GitHub', url: 'https://github.com/capt-noah', display_order: 1 },
  { id: 2, name: 'LinkedIn', url: 'https://www.linkedin.com/in/noah-tesfaye-3b2b56364', display_order: 2 },
  { id: 3, name: 'Email', url: 'mailto:noahte2020@gmail.com', display_order: 3 },
];

async function sync() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'selihom',
    password: process.env.DB_PASSWORD || 'Selihom@2026#Secure!',
    database: process.env.DB_NAME || 'selihom',
    waitForConnections: true,
    connectionLimit: 5,
  });

  const conn = await pool.getConnection();
  console.log(`Connected to MySQL: ${process.env.DB_HOST}/${process.env.DB_NAME}`);

  try {
    // 1. Ensure certificates column in experiences
    const [cols] = await conn.query("SHOW COLUMNS FROM experiences LIKE 'certificates'");
    if (cols.length === 0) {
      console.log('Adding certificates column to experiences...');
      await conn.query("ALTER TABLE experiences ADD COLUMN certificates JSON NULL AFTER description");
    }

    // Ensure display_order in tech_stack and socials
    const [stackCols] = await conn.query("SHOW COLUMNS FROM tech_stack LIKE 'display_order'");
    if (stackCols.length === 0) {
      await conn.query("ALTER TABLE tech_stack ADD COLUMN display_order INT DEFAULT 0");
    }
    const [socCols] = await conn.query("SHOW COLUMNS FROM socials LIKE 'display_order'");
    if (socCols.length === 0) {
      await conn.query("ALTER TABLE socials ADD COLUMN display_order INT DEFAULT 0");
    }

    // 2. Sync experiences
    console.log('Syncing experiences...');
    await conn.query('DELETE FROM experiences');
    for (const exp of experiences) {
      await conn.query(
        'INSERT INTO experiences (id, period, role, description, certificates, display_order) VALUES (?, ?, ?, ?, ?, ?)',
        [exp.id, exp.period, exp.role, exp.description, exp.certificates, exp.display_order]
      );
    }

    // 3. Sync projects
    console.log('Syncing projects...');
    await conn.query('DELETE FROM projects');
    for (const proj of projects) {
      await conn.query(
        'INSERT INTO projects (id, title, meta, short_desc, detailed_desc, technologies, repo_url, live_link, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [proj.id, proj.title, proj.meta, proj.short_desc, proj.detailed_desc, proj.technologies, proj.repo_url, proj.live_link, proj.display_order]
      );
    }

    // 4. Sync tech_stack
    console.log('Syncing tech_stack...');
    await conn.query('DELETE FROM tech_stack');
    for (const tech of techStack) {
      await conn.query(
        'INSERT INTO tech_stack (id, name, color, display_order) VALUES (?, ?, ?, ?)',
        [tech.id, tech.name, tech.color, tech.display_order]
      );
    }

    // 5. Sync socials
    console.log('Syncing socials...');
    await conn.query('DELETE FROM socials');
    for (const soc of socials) {
      await conn.query(
        'INSERT INTO socials (id, name, url, display_order) VALUES (?, ?, ?, ?)',
        [soc.id, soc.name, soc.url, soc.display_order]
      );
    }

    console.log('✓ Successfully synchronized all tables with authentic portfolio data!');
  } finally {
    conn.release();
    await pool.end();
  }
}

sync().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
