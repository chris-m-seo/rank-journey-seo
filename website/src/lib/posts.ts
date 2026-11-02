import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

function filenameFromField(value?: string): string | undefined {
	if (!value) {
		return undefined;
	}
	return value.replace(/^\.\//, '').split('/').pop();
}

function publicMediaUrl(post: BlogPost, filename: string): string {
	return `/media/${post.id}/${filename}`;
}

export function getThumbnailUrl(post: BlogPost): string | undefined {
	const filename = filenameFromField(post.data.thumbnail);
	return filename ? publicMediaUrl(post, filename) : undefined;
}

export function getHeroUrl(post: BlogPost): string | undefined {
	const filename = filenameFromField(post.data.heroImage);
	return filename ? publicMediaUrl(post, filename) : undefined;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
	const posts = await getCollection('blog', ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	return posts.sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}

export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
}

export function postHref(post: BlogPost): string {
	return `/articles/${post.id}/`;
}

// ---- Weekly SEO news (content/seo-news/) ----

export type NewsPost = CollectionEntry<'news'>;

export const NEWS_PATH = '/seo-news-and-updates';
export const NEWS_TITLE = 'SEO News and Updates';

// Every week shares these images unless a post sets its own.
const NEWS_MEDIA = '/media/seo-news-and-updates';
export const NEWS_THUMBNAIL = `${NEWS_MEDIA}/seo-news-and-updates.svg`;
export const NEWS_THUMBNAIL_ALT = 'SEO news and updates: this week\'s top stories';
export const NEWS_HERO = `${NEWS_MEDIA}/top-seo-news-and-updates-this-week.svg`;
export const NEWS_HERO_ALT = 'Top SEO news and updates this week';

export function newsHref(post: NewsPost): string {
	return `${NEWS_PATH}/${post.id}/`;
}

export function getNewsThumbnailUrl(post: NewsPost): string {
	const filename = filenameFromField(post.data.thumbnail);
	return filename ? `${NEWS_MEDIA}/${post.id}/${filename}` : NEWS_THUMBNAIL;
}

export function getNewsHeroUrl(post: NewsPost): string {
	const filename = filenameFromField(post.data.heroImage);
	return filename ? `${NEWS_MEDIA}/${post.id}/${filename}` : NEWS_HERO;
}

export async function getPublishedNews(): Promise<NewsPost[]> {
	const posts = await getCollection('news', ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	// Newest week first.
	return posts.sort(
		(a, b) => b.data.weekStart.valueOf() - a.data.weekStart.valueOf(),
	);
}

// "26 October – 1 November 2026", or with both years when a week crosses New Year.
export function formatWeekRange(start: Date, end: Date): string {
	const opts = { timeZone: 'UTC' } as const;
	const day = (d: Date) => d.toLocaleDateString('en-GB', { ...opts, day: 'numeric' });
	const month = (d: Date) => d.toLocaleDateString('en-GB', { ...opts, month: 'long' });
	const year = (d: Date) => d.toLocaleDateString('en-GB', { ...opts, year: 'numeric' });

	if (year(start) !== year(end)) {
		return `${day(start)} ${month(start)} ${year(start)} – ${day(end)} ${month(end)} ${year(end)}`;
	}
	return `${day(start)} ${month(start)} – ${day(end)} ${month(end)} ${year(end)}`;
}

// The year in the folder name ("week-44-2026" -> 2026); falls back to the week's end date.
export function newsYear(post: NewsPost): number {
	const fromId = post.id.match(/-(\d{4})$/);
	return fromId ? Number(fromId[1]) : post.data.weekEnd.getUTCFullYear();
}
