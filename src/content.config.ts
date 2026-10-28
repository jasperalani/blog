import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Keystatic writes empty optional fields as null; treat those as "not set".
const optional = <T extends z.ZodType>(schema: T) =>
	z.preprocess((value) => (value === null || value === '' ? undefined : value), schema.optional());

// Posts are edited in the CMS (see keystatic.config.ts) and stored as MDX files.
const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: optional(z.coerce.date()),
			draft: z.boolean().default(false),
			tags: z.array(z.string()).default([]),
			cover: optional(image()),
			coverAlt: optional(z.string()),
		}),
});

export const collections = { posts };
