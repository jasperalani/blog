# Blog

A fast personal blog built with [Astro](https://astro.build) and edited with [Keystatic](https://keystatic.com), a visual editor that saves posts as files in this repository.

- **Fast by default.** Every page is plain, prerendered HTML. Pages ship no JavaScript apart from a tiny theme switcher, and the traffic animation's small script only loads on the post that uses it.
- **Easy to write.** Posts are written in a visual editor at `/keystatic`. You can drop blocks such as the traffic animation into a post from the editor's **+** menu.
- **Yours.** Content lives in Git as Markdown (MDX) files, so there is no database to look after and nothing to lock you in.

## Quick start

You need [Node.js](https://nodejs.org) 22.23 or newer (24 is recommended).

```sh
npm install
npm run dev
```

Then open:

- the site: <http://127.0.0.1:4321>
- the editor: <http://127.0.0.1:4321/keystatic>

When you run the site on your own computer, the editor saves straight to the files in `src/content/`. Commit and push those changes to publish them.

## Writing posts

1. Open <http://127.0.0.1:4321/keystatic> and choose **Posts**, then **Add**.
2. Fill in the title, summary, and date, then write the post.
3. To add the traffic animation, click **+** in the editor toolbar and choose **Traffic animation**, then add a caption.
4. Tick **Draft** to keep a post off the live site while you work on it.
5. Save. The post is stored as `src/content/posts/<slug>.mdx`.

The editor also has **Site settings** (title, tagline, description, author) and the **About page**.

## Project layout

| Path | What it is |
| --- | --- |
| `src/content/posts/` | Blog posts (MDX), managed by the editor |
| `src/content/settings.json` | Site title, tagline, description, author |
| `src/content/about.mdx` | The About page |
| `src/components/traffic/` | The traffic animation used in the first post |
| `src/components/mdx.ts` | Components that posts are allowed to use |
| `keystatic.config.ts` | The editor's fields and blocks |
| `astro.config.mjs` | Site configuration |

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Run the site and editor locally |
| `npm run build` | Build the site into `dist/` |
| `npm run preview` | Preview the built site |
| `npm run check` | Type-check the project |
| `npm run cms:setup` | One-off: connect the online editor to GitHub (see below) |

## Publishing

The site works on any static host. If you host it on **Netlify** or **Vercel**, you also get the editor on the live site (for example `https://your-site.netlify.app/keystatic`), so you can write from any browser without running anything locally.

### Netlify (recommended)

1. In Netlify, choose **Add new site**, then **Import an existing project**, and pick this GitHub repository.
2. Netlify reads the settings from `netlify.toml`, so you can accept the defaults and deploy.

### Vercel

1. In Vercel, choose **Add New**, then **Project**, and import this repository. The defaults are fine.

### Any other static host (GitHub Pages, Cloudflare Pages, and so on)

Run `npm run build` and publish the `dist/` folder. Set the `SITE_URL` environment variable to your site's address (for example `https://example.com`) so links in the RSS feed and sitemap are correct. On a static host the editor is not available online, so write locally with `npm run dev` and push your changes.

## Turning on the online editor

The online editor signs you in with GitHub and saves each change as a commit to this repository. This needs a small GitHub App, which Keystatic creates for you. You only do this once.

1. On your computer, run `npm run cms:setup` and open <http://127.0.0.1:4322/keystatic>.
2. Click **Log in with GitHub**. Keystatic shows a setup page.
3. Enter your live site's address as the **Deployed App URL** (for example `https://your-site.netlify.app`), then click **Create GitHub App** and confirm on GitHub.
4. Click **Install GitHub App** and give it access to this repository.
5. Keystatic writes four values into a local `.env` file: `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, and `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. Add all four as environment variables in Netlify (**Site configuration**, then **Environment variables**) or Vercel (**Settings**, then **Environment Variables**), and redeploy.
6. Visit `https://your-site/keystatic` and sign in.

Keep `.env` private. It is already excluded from Git.

If your site's address changes later, add `https://<new-address>/api/keystatic/github/oauth/callback` as a callback URL in the GitHub App's settings on GitHub.

If you rename or move the repository, update `GITHUB_REPO` at the top of `keystatic.config.ts`.
