import { getCollection, type CollectionEntry } from 'astro:content';
import { smarten } from '../consts';

export type Post = CollectionEntry<'posts'>;

/**
 * Every post that should appear on the site, newest first. Drafts show up
 * while writing locally (`npm run dev`) and are left out of production builds,
 * so they get no page, no list entry, no RSS item and no prev/next link.
 */
export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection('posts', ({ data }) => !(import.meta.env.PROD && data.draft));
	return posts
		.map((post) => ({
			...post,
			data: { ...post.data, title: smarten(post.data.title), description: smarten(post.data.description) },
		}))
		.sort(
			(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.data.title.localeCompare(b.data.title),
		);
}

export const postUrl = (post: Post) => `/posts/${post.id}/`;

const WORDS_PER_MINUTE = 230;

/** Rough reading time from the raw MDX, ignoring imports, tags and code fences' markers. */
export function readingTime(body = ''): { minutes: number; label: string } {
	const text = body
		.replace(/^import\s.+$/gm, ' ')
		.replace(/<[^>]*>/g, ' ')
		.replace(/[`*_#>[\]()|~-]/g, ' ');
	const words = text.split(/\s+/).filter((w) => /\w/.test(w)).length;
	const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
	return { minutes, label: `${minutes} min read` };
}
