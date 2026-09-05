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
