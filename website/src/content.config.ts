import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// A post's id is its folder name: content/blog/<slug>/index.md -> "<slug>".
const idFromFolder = ({ entry }: { entry: string }) =>
	entry.replace(/\/index\.mdx?$/, '').replace(/\.mdx?$/, '');

const blog = defineCollection({
	loader: glob({
		pattern: '**/[^_]*.{md,mdx}',
		base: '../content/blog',
		generateId: idFromFolder,
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

// Weekly SEO news: content/seo-news/week-44-2026/index.md -> /seo-news-and-updates/week-44-2026/
// Files starting with an underscore (such as _weekly-template.md) are ignored.
const news = defineCollection({
	loader: glob({
		pattern: '**/[^_]*.{md,mdx}',
		base: '../content/seo-news',
		generateId: idFromFolder,
	}),
	schema: z.object({
		title: z.string(),
		seoTitle: z.string().optional(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		// First (Monday) and last (Sunday) day the week covers.
		weekStart: z.coerce.date(),
		weekEnd: z.coerce.date(),
		author: z.string().optional(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
		// Optional overrides. Every week uses the shared news images unless these are set.
		thumbnail: z.string().optional(),
		thumbnailAlt: z.string().optional(),
		heroImage: z.string().optional(),
		heroImageAlt: z.string().optional(),
	}),
});

export const collections = { blog, news };
