import { collection, config, fields, singleton } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';
import { createElement as h } from 'react';

// The GitHub repository the live CMS saves to. Change this if the repo is
// renamed or moved.
const GITHUB_REPO = 'jasperalani/blog';

// When you run `npm run dev`, the CMS saves straight to the files on your
// computer. On the live site it saves to GitHub instead, which needs a one-off
// GitHub App setup: run `npm run cms:setup` and follow the steps (see README).
const useGitHub = import.meta.env.PROD || import.meta.env.MODE === 'cms-setup';

// Components that can be dropped into a post from the editor's "+" menu.
// Each one must also be passed to <Content components={...} /> in
// src/components/mdx.ts so the site knows how to render it.
const contentComponents = {
	TrafficAnimation: block({
		label: 'Traffic animation',
		description: 'A small top-down animation of cars forming groups on a single-lane road.',
		schema: {
			caption: fields.text({ label: 'Caption', description: 'Optional text shown under the animation.' }),
		},
		// What the block looks like inside the editor (the animation itself only runs on the site).
		ContentView: ({ value }) =>
			h(
				'div',
				{ style: { display: 'grid', gap: 4, padding: '4px 0' } },
				h('strong', null, 'Cars forming groups on a single-lane road'),
				value.caption
					? h('span', { style: { opacity: 0.75 } }, value.caption)
					: h('span', { style: { opacity: 0.5, fontStyle: 'italic' } }, 'No caption'),
			),
	}),
	Callout: wrapper({
		label: 'Callout',
		description: 'A highlighted box for an aside or key point.',
		schema: {
			title: fields.text({ label: 'Title' }),
		},
		ContentView: ({ value, children }) =>
			h('div', null, value.title ? h('strong', { style: { display: 'block', marginBottom: 4 } }, value.title) : null, children),
	}),
};

export default config({
	storage: useGitHub ? { kind: 'github', repo: GITHUB_REPO } : { kind: 'local' },
	ui: {
		brand: { name: 'Blog CMS' },
		navigation: {
			Writing: ['posts'],
			Site: ['about', 'settings'],
		},
	},
	collections: {
		posts: collection({
			label: 'Posts',
			slugField: 'title',
			path: 'src/content/posts/*',
			format: { contentField: 'content' },
			entryLayout: 'content',
			columns: ['title', 'pubDate'],
			previewUrl: '/posts/{slug}/',
			schema: {
				title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
				description: fields.text({
					label: 'Summary',
					description: 'One or two sentences. Shown on the home page and in search results.',
					multiline: true,
					validation: { isRequired: true },
				}),
				pubDate: fields.date({
					label: 'Published',
					defaultValue: { kind: 'today' },
					validation: { isRequired: true },
				}),
				updatedDate: fields.date({ label: 'Last updated' }),
				draft: fields.checkbox({
					label: 'Draft',
					description: 'Drafts are visible while editing locally but are not published.',
					defaultValue: false,
				}),
				tags: fields.array(fields.text({ label: 'Tag' }), {
					label: 'Tags',
					itemLabel: (props) => props.value,
				}),
				cover: fields.image({
					label: 'Cover image',
					description: 'Optional. Used when the post is shared on social media.',
					directory: 'src/assets/images/posts',
					publicPath: '../../assets/images/posts/',
				}),
				coverAlt: fields.text({ label: 'Cover image description (alt text)' }),
				content: fields.mdx({
					label: 'Content',
					options: {
						image: {
							directory: 'src/assets/images/posts',
							publicPath: '../../assets/images/posts/',
						},
					},
					components: contentComponents,
				}),
			},
		}),
	},
	singletons: {
		settings: singleton({
			label: 'Site settings',
			path: 'src/content/settings',
			format: { data: 'json' },
			schema: {
				title: fields.text({ label: 'Site title', validation: { isRequired: true } }),
				tagline: fields.text({ label: 'Tagline', description: 'A short line shown under the title.' }),
				description: fields.text({
					label: 'Description',
					description: 'Used by search engines and in the RSS feed.',
					multiline: true,
				}),
				author: fields.text({ label: 'Author name' }),
			},
		}),
		about: singleton({
			label: 'About page',
			path: 'src/content/about',
			format: { contentField: 'content' },
			entryLayout: 'content',
			schema: {
				title: fields.text({ label: 'Title', validation: { isRequired: true } }),
				content: fields.mdx({ label: 'Content' }),
			},
		}),
	},
});
