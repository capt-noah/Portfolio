// ─────────────────────────────────────────────────────────────
// Types — match the DB schema and the shape the UI uses
// ─────────────────────────────────────────────────────────────

export interface Experience {
  id?:    number;
  period: string;
  role:   string;
  desc:   string;   // DB column: description
}

export interface Project {
  id?:          string; // DB auto-increment, absent on new items
  title:        string;
  meta:         string;
  desc:         string;          // DB column: short_desc
  detailedDesc?: string;
  technologies?: string[];
  repo:          string;         // DB column: repo_url
  link:          string;         // DB column: live_link
}

export interface StackItem {
  id?:   number;
  name:  string;
  color: string;
}

export interface Social {
  id?:  number;
  name: string;
  url:  string;
}

export interface PortfolioData {
  experience: Experience[];
  projects:   Project[];
  stack:      StackItem[];
  socials:    Social[];
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('admin_token') || '';
  return {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────────────
// Aggregate read — used by public landing page and Admin on load
// ─────────────────────────────────────────────────────────────

export async function getPortfolioData(): Promise<PortfolioData> {
  return apiFetch<PortfolioData>('/api/data');
}

// ─────────────────────────────────────────────────────────────
// EXPERIENCES
// ─────────────────────────────────────────────────────────────

export async function createExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
  const raw = await apiFetch<any>('/api/experiences', {
    method:  'POST',
    headers: authHeaders(),
    body:    JSON.stringify({
      period:      exp.period,
      role:        exp.role,
      description: exp.desc,
    }),
  });
  return { id: raw.id, period: raw.period, role: raw.role, desc: raw.description };
}

export async function updateExperience(id: number, exp: Partial<Experience>): Promise<Experience> {
  const raw = await apiFetch<any>(`/api/experiences/${id}`, {
    method:  'PUT',
    headers: authHeaders(),
    body:    JSON.stringify({
      ...(exp.period !== undefined && { period:      exp.period }),
      ...(exp.role   !== undefined && { role:        exp.role   }),
      ...(exp.desc   !== undefined && { description: exp.desc   }),
    }),
  });
  return { id: raw.id, period: raw.period, role: raw.role, desc: raw.description };
}

export async function deleteExperience(id: number): Promise<void> {
  await apiFetch(`/api/experiences/${id}`, {
    method:  'DELETE',
    headers: authHeaders(),
  });
}

// ─────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────

function dbProjectToUi(raw: any): Project {
  return {
    id:           String(raw.id),
    title:        raw.title,
    meta:         raw.meta         ?? '',
    desc:         raw.shortDesc    ?? raw.short_desc ?? '',
    detailedDesc: raw.detailedDesc ?? raw.detailed_desc ?? '',
    technologies: raw.technologies ?? [],
    repo:         raw.repoUrl      ?? raw.repo_url ?? '',
    link:         raw.liveLink     ?? raw.live_link ?? '',
  };
}

export async function createProject(proj: Omit<Project, 'id'>): Promise<Project> {
  const raw = await apiFetch<any>('/api/projects', {
    method:  'POST',
    headers: authHeaders(),
    body:    JSON.stringify({
      title:        proj.title,
      meta:         proj.meta,
      shortDesc:    proj.desc,
      detailedDesc: proj.detailedDesc ?? '',
      technologies: proj.technologies ?? [],
      repoUrl:      proj.repo,
      liveLink:     proj.link,
    }),
  });
  return dbProjectToUi(raw);
}

export async function updateProject(id: number, proj: Partial<Project>): Promise<Project> {
  const raw = await apiFetch<any>(`/api/projects/${id}`, {
    method:  'PUT',
    headers: authHeaders(),
    body:    JSON.stringify({
      ...(proj.title        !== undefined && { title:        proj.title }),
      ...(proj.meta         !== undefined && { meta:         proj.meta  }),
      ...(proj.desc         !== undefined && { shortDesc:    proj.desc  }),
      ...(proj.detailedDesc !== undefined && { detailedDesc: proj.detailedDesc }),
      ...(proj.technologies !== undefined && { technologies: proj.technologies }),
      ...(proj.repo         !== undefined && { repoUrl:      proj.repo  }),
      ...(proj.link         !== undefined && { liveLink:     proj.link  }),
    }),
  });
  return dbProjectToUi(raw);
}

export async function deleteProject(id: number): Promise<void> {
  await apiFetch(`/api/projects/${id}`, {
    method:  'DELETE',
    headers: authHeaders(),
  });
}

// ─────────────────────────────────────────────────────────────
// TECH STACK
// ─────────────────────────────────────────────────────────────

export async function createStackItem(item: Omit<StackItem, 'id'>): Promise<StackItem> {
  return apiFetch<StackItem>('/api/stack', {
    method:  'POST',
    headers: authHeaders(),
    body:    JSON.stringify(item),
  });
}

export async function updateStackItem(id: number, item: Partial<StackItem>): Promise<StackItem> {
  return apiFetch<StackItem>(`/api/stack/${id}`, {
    method:  'PUT',
    headers: authHeaders(),
    body:    JSON.stringify(item),
  });
}

export async function deleteStackItem(id: number): Promise<void> {
  await apiFetch(`/api/stack/${id}`, {
    method:  'DELETE',
    headers: authHeaders(),
  });
}

// ─────────────────────────────────────────────────────────────
// SOCIALS
// ─────────────────────────────────────────────────────────────

export async function createSocial(social: Omit<Social, 'id'>): Promise<Social> {
  return apiFetch<Social>('/api/socials', {
    method:  'POST',
    headers: authHeaders(),
    body:    JSON.stringify(social),
  });
}

export async function updateSocial(id: number, social: Partial<Social>): Promise<Social> {
  return apiFetch<Social>(`/api/socials/${id}`, {
    method:  'PUT',
    headers: authHeaders(),
    body:    JSON.stringify(social),
  });
}

export async function deleteSocial(id: number): Promise<void> {
  await apiFetch(`/api/socials/${id}`, {
    method:  'DELETE',
    headers: authHeaders(),
  });
}

// ─────────────────────────────────────────────────────────────
// savePortfolioData — called by Admin "PUBLISH_CHANGES" button.
// Diffs the editor state against the DB and fires only the
// necessary creates / updates / deletes per table.
// ─────────────────────────────────────────────────────────────

export async function savePortfolioData(next: PortfolioData): Promise<void> {
  const current = await getPortfolioData();

  await syncList<Experience>({
    current: current.experience,
    next:    next.experience,
    getId:   i => i.id ? Number(i.id) : 0,
    create:  item => createExperience(item),
    update:  (id, item) => updateExperience(id, item),
    remove:  id => deleteExperience(id),
  });

  await syncList<Project>({
    current: current.projects,
    next:    next.projects,
    getId:   i => i.id ? Number(i.id) : 0,
    create:  item => createProject(item),
    update:  (id, item) => updateProject(id, item),
    remove:  id => deleteProject(id),
  });

  await syncList<StackItem>({
    current: current.stack,
    next:    next.stack,
    getId:   i => i.id ? Number(i.id) : 0,
    create:  item => createStackItem(item),
    update:  (id, item) => updateStackItem(id, item),
    remove:  id => deleteStackItem(id),
  });

  await syncList<Social>({
    current: current.socials,
    next:    next.socials,
    getId:   i => i.id ? Number(i.id) : 0,
    create:  item => createSocial(item),
    update:  (id, item) => updateSocial(id, item),
    remove:  id => deleteSocial(id),
  });
}

// ─────────────────────────────────────────────────────────────
// Generic sync helper
// ─────────────────────────────────────────────────────────────

interface SyncOptions<T> {
  current: T[];
  next:    T[];
  getId:   (item: T) => number;
  create:  (item: T) => Promise<unknown>;
  update:  (id: number, item: T) => Promise<unknown>;
  remove:  (id: number) => Promise<unknown>;
}

async function syncList<T>({ current, next, getId, create, update, remove }: SyncOptions<T>): Promise<void> {
  const currentIds = new Set(current.map(getId).filter(Boolean));
  const nextIds    = new Set(next.map(getId).filter(Boolean));

  // items removed in the UI → delete from DB
  for (const item of current) {
    const id = getId(item);
    if (id && !nextIds.has(id)) {
      await remove(id);
    }
  }

  // items in next → create if new, update if existing
  for (const item of next) {
    const id = getId(item);
    if (!id || !currentIds.has(id)) {
      await create(item);
    } else {
      await update(id, item);
    }
  }
}
