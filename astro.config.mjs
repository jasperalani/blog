// @ts-check
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';
import { defineConfig, fontProviders } from 'astro/config';

// Every page on the site is prerendered to static HTML. The only thing that
// needs a server is the CMS (/keystatic), so we pick an adapter based on the
// host we're building on. Anywhere else (GitHub Pages, any static host) we
// build a purely static site and the CMS is available locally via `npm run dev`.
const adapter = process.env.NETLIFY ? netlify() : process.env.VERCEL ? vercel() : undefined;
const isDev = process.argv.includes('dev');
const withCms = isDev || adapter !== undefined;

const site =
	process.env.SITE_URL ??
	(process.env.NETLIFY ? process.env.URL : undefined) ??
	(process.env.VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: undefined) ??
	'http://localhost:4321';

// The characters in Google Fonts' "latin" subset, which is what the font files hold.
/** @type {[string, ...string[]]} */
const LATIN = [
	'U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA', 'U+02DC', 'U+0304', 'U+0308',
	'U+0329', 'U+2000-206F', 'U+20AC', 'U+2122', 'U+2191', 'U+2193', 'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD',
];

// https://astro.build/config
export default defineConfig({
	site,
	adapter,
	integrations: [
		mdx(),
		sitemap({ filter: (page) => !page.includes('/keystatic') }),
		...(withCms ? [react(), keystatic()] : []),
	],

	// The whole stylesheet is a few kilobytes, so put it in each page rather
	// than making the browser wait for a separate request before first paint.
	build: { inlineStylesheets: 'always' },

	// Two self-hosted families, both variable fonts, so each style is one file
	// covering every weight we use: Newsreader (a serif drawn for reading on
	// screens) for text and headings, Instrument Sans for small interface text.
	// The latin subsets from Google Fonts are kept in src/styles/fonts (SIL Open
	// Font Licence, see the OFL files there), so builds never depend on a font
	// service being reachable. Astro writes the @font-face rules, the preload
	// links and metric-matched fallbacks (no layout shift while fonts load).
	// To fetch from Google at build time instead, swap a family's provider for
	// fontProviders.google() and drop its `options`.
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Newsreader',
			cssVariable: '--font-serif',
			fallbacks: ['Georgia', 'serif'],
			options: {
				variants: [
					{ src: ['./src/styles/fonts/newsreader.woff2'], weight: '400 700', style: 'normal', unicodeRange: LATIN },
					{ src: ['./src/styles/fonts/newsreader-italic.woff2'], weight: '400 700', style: 'italic', unicodeRange: LATIN },
				],
			},
		},
		{
			provider: fontProviders.local(),
			name: 'Instrument Sans',
			cssVariable: '--font-sans',
			fallbacks: ['system-ui', 'sans-serif'],
			options: {
				variants: [
					{ src: ['./src/styles/fonts/instrument-sans.woff2'], weight: '400 700', style: 'normal', unicodeRange: LATIN },
				],
			},
		},
	],

	markdown: {
		// Code blocks carry both palettes and follow the page's color-scheme.
		shikiConfig: {
			themes: { light: 'github-light', dark: 'github-dark' },
			defaultColor: 'light-dark()',
		},
	},
});
