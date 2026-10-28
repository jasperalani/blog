import type { APIContext } from 'astro';

export function GET({ site, url }: APIContext) {
	const sitemap = new URL('sitemap-index.xml', site ?? url.origin);
	const body = ['User-agent: *', 'Allow: /', 'Disallow: /keystatic', '', `Sitemap: ${sitemap.href}`, ''].join('\n');
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
