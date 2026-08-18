import {
  mysqlTable,
  int,
  varchar,
  text,
  longtext,
  json,
  timestamp,
} from 'drizzle-orm/mysql-core';

// ── experiences ─────────────────────────────────────────────
export const experiences = mysqlTable('experiences', {
  id:           int('id').autoincrement().primaryKey(),
  period:       varchar('period', { length: 100 }).notNull(),
  role:         varchar('role', { length: 255 }).notNull(),
  description:  text('description').notNull(),
  displayOrder: int('display_order').default(0),
  createdAt:    timestamp('created_at').defaultNow(),
});

// ── projects ────────────────────────────────────────────────
export const projects = mysqlTable('projects', {
  id:           int('id').autoincrement().primaryKey(),
  title:        varchar('title', { length: 255 }).notNull(),
  meta:         varchar('meta', { length: 255 }),
  shortDesc:    text('short_desc').notNull(),
  detailedDesc: longtext('detailed_desc'),
  technologies: json('technologies').$type<string[]>().notNull(),
  repoUrl:      varchar('repo_url', { length: 500 }),
  liveLink:     varchar('live_link', { length: 500 }),
  displayOrder: int('display_order').default(0),
  createdAt:    timestamp('created_at').defaultNow(),
});

// ── tech_stack ───────────────────────────────────────────────
export const techStack = mysqlTable('tech_stack', {
  id:           int('id').autoincrement().primaryKey(),
  name:         varchar('name', { length: 100 }).notNull(),
  color:        varchar('color', { length: 50 }).default('#ffffff'),
  displayOrder: int('display_order').default(0),
});

// ── socials ──────────────────────────────────────────────────
export const socials = mysqlTable('socials', {
  id:           int('id').autoincrement().primaryKey(),
  name:         varchar('name', { length: 100 }).notNull(),
  url:          varchar('url', { length: 500 }).notNull(),
  displayOrder: int('display_order').default(0),
});
