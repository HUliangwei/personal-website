import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { PROJECT_CATEGORIES } from './config/projects';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(PROJECT_CATEGORIES),
    summary: z.string(),
    date: z.string(),
    status: z.string(),
    role: z.string(),
    cover: z.string(),
    technologies: z.array(z.string()),
    featured: z.boolean(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })),
  }),
});

export const collections = { projects };
