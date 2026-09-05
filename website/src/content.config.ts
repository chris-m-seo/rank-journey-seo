import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({
		pattern: '**/[^_]*.{md,mdx}',
		base: '../content/blog',
		generateId: ({ entry }) =>
			entry.replace(/\/index\.mdx?$/, '').replace(/\.mdx?$/, ''),
	}),
	schema: z.object({
		title: z.string(),
		seoTitle: z.string().optional(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		author: z.string().optional(),
		type: z.enum(['guide', 'news']).default('guide'),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
		thumbnail: z.string().optional(),
		thumbnailAlt: z.string().optional(),
		heroImage: z.string().optional(),
		heroImageAlt: z.string().optional(),
		infographic: z.string().optional(),
		infographicAlt: z.string().optional(),
		socialImage: z.string().optional(),
	}),
});

export const collections = { blog };
