import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/concepts' }),
  schema: z.object({
    title: z.string(),
    status: z.enum(['draft', 'ready', 'running', 'complete', 'killed']),
    created: z.coerce.date(),
    updated: z.coerce.date(),
    tags: z.array(z.string()).min(1),
    priority: z.enum(['high', 'medium', 'low']).optional(),
    hypothesis: z.string(),
    variants: z.array(z.object({
      name: z.string(),
      description: z.string(),
    })).min(2),
    successMetrics: z.array(z.object({
      name: z.string(),
      target: z.string(),
      isPrimary: z.boolean(),
    })).min(1),
    guardrails: z.array(z.string()).optional(),
    outcome: z.string().optional(),
    targetAudience: z.string().optional(),
    duration: z.string().optional(),
    trafficSplit: z.string().optional(),
    platform: z.string().optional(),
    prototypeUrl: z.string().optional(),
  }),
});

export const collections = { concepts };
