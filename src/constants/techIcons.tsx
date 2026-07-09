import React from 'react';

export interface TechIcon {
  name: string;
  color: string;
  slug: string;
}

export const TECH_ICONS: Record<string, TechIcon> = {
  'React': { name: 'React', color: '#61DAFB', slug: 'react' },
  'Next.js': { name: 'Next.js', color: '#FFFFFF', slug: 'nextjs' },
  'TypeScript': { name: 'TypeScript', color: '#3178C6', slug: 'typescript' },
  'Tailwind': { name: 'Tailwind', color: '#06B6D4', slug: 'tailwindcss' },
  'Node.js': { name: 'Node.js', color: '#339933', slug: 'nodejs' },
  'Vite': { name: 'Vite', color: '#646CFF', slug: 'vitejs' },
  'GraphQL': { name: 'GraphQL', color: '#E10098', slug: 'graphql' },
  'Docker': { name: 'Docker', color: '#2496ED', slug: 'docker' },
  'Python': { name: 'Python', color: '#3776AB', slug: 'python' },
  'Figma': { name: 'Figma', color: '#F24E1E', slug: 'figma' },
  'Firebase': { name: 'Firebase', color: '#FFCA28', slug: 'firebase' },
  'PostgreSQL': { name: 'PostgreSQL', color: '#4169E1', slug: 'postgresql' },
  'MongoDB': { name: 'MongoDB', color: '#47A248', slug: 'mongodb' },
  'AWS': { name: 'AWS', color: '#FF9900', slug: 'amazonwebservices' },
  'Vue': { name: 'Vue', color: '#4FC08D', slug: 'vuejs' },
  'Svelte': { name: 'Svelte', color: '#FF3E00', slug: 'svelte' },
  'Astro': { name: 'Astro', color: '#FF7E33', slug: 'astro' },
  'Redis': { name: 'Redis', color: '#DC382D', slug: 'redis' },
  'Rust': { name: 'Rust', color: '#DEA584', slug: 'rust' },
  'Go': { name: 'Go', color: '#00ADD8', slug: 'go' },
  'Supabase': { name: 'Supabase', color: '#3ECF8E', slug: 'supabase' }
};

export const getIconUrl = (slug: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;

