import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { PROJECT_CATEGORIES, PROJECT_SLUGS } from './config/projects';

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects',
    generateId: ({ data }) => `${data.locale}/${data.slug}`,
  }),
  schema: z.object({
    title: z.string(),
    slug: z.enum(PROJECT_SLUGS),
    locale: z.enum(['zh', 'en']),
    category: z.enum(PROJECT_CATEGORIES),
    summary: z.string(),
    highlights: z.array(z.string()).min(2).max(3),
    learningTopics: z.array(z.string()).max(6),
    date: z.string(),
    status: z.string(),
    role: z.string(),
    cover: z.string().optional(),
    technologies: z.array(z.string()),
    featured: z.boolean(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
  }),
});

export const collections = { projects };
