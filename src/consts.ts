// Site-wide settings. The editable values live in src/content/settings.json,
// which is managed by the CMS (Site settings). Keystatic writes empty optional
// fields as "" or leaves them out, so every value has a sensible fallback.
import settings from './content/settings.json';

/**
 * Curly quotes and apostrophes for text that does not go through Markdown
 * (titles, summaries, site settings), so it matches the typeset post body.
 */
export const smarten = (text: string) =>
	text
		.replace(/(^|[\s([{\u2013\u2014/-])"/g, '$1\u201c')
		.replace(/"/g, '\u201d')
		.replace(/(^|[\s([{\u2013\u2014/-])'/g, '$1\u2018')
		.replace(/'/g, '\u2019');

type Settings = Partial<Record<'title' | 'tagline' | 'description' | 'author', string | null>>;
const s = settings as Settings;
const pick = (value: string | null | undefined, fallback: string) => smarten(value?.trim() || fallback);

export const SITE = {
	title: pick(s.title, 'My blog'),
	tagline: pick(s.tagline, ''),
	description: pick(s.description, pick(s.tagline, 'A personal blog.')),
	author: pick(s.author, ''),
	locale: 'en_GB',
	lang: 'en-GB',
} as const;

// Theme colours used for the browser UI (theme-color). Keep these in step
// with --bg in src/styles/global.css.
export const THEME_COLOURS = { light: '#fbf9f4', dark: '#161512' } as const;

export const NAV = [
	{ href: '/posts/', label: 'Writing' },
	{ href: '/about/', label: 'About' },
] as const;

const dateFormat = new Intl.DateTimeFormat('en-GB', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
	timeZone: 'UTC',
});

/** 28 October 2026 */
export const formatDate = (date: Date) => dateFormat.format(date);

/** 2026-10-28, for <time datetime> */
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);
