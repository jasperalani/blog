import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postUrl } from '../components/posts';
import { SITE } from '../consts';

export async function GET(context: APIContext) {
	const posts = await getPosts();
	return rss({
		title: SITE.title,
		description: SITE.description,
		site: context.site ?? context.url.origin,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: postUrl(post),
			categories: post.data.tags,
		})),
		customData: '<language>en-gb</language>',
		trailingSlash: true,
	});
}
