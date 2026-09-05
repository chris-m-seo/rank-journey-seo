# Rank Journey SEO

SEO education site, built with Astro and published on GitHub Pages at [www.rankjourneyseo.com](https://www.rankjourneyseo.com).

## Run the site locally

```sh
cd website
npm install
npm run dev
```

Then open [http://localhost:4321](http://localhost:4321).

## Where things live

| Path | What it is |
|---|---|
| `website/` | The Astro site (pages, layout, styles, logo) |
| `content/blog/` | Articles. One folder per post: `content/blog/your-slug/index.md` |
| `AGENTS.md` | Project rules, design tokens, and how we should work in this repo |

## GitHub, in this project

This repository is the whole site. A few commands you will use often, from the repo root:

```sh
git status                 # what has changed
git add -A                 # stage those changes
git commit -m "Your note"  # save a snapshot
git push                   # send it to GitHub
```

A push to `main` builds `website/` and deploys to GitHub Pages. In the repo Settings → Pages, set Source to **GitHub Actions**. The custom domain is `www.rankjourneyseo.com`.

## Adding an article

1. Finish the piece.
2. Create `content/blog/your-article-slug/index.md`.
3. Add the frontmatter block documented in `AGENTS.md`.
4. Keep `draft: true` until you want it on the live site.
5. Put images in that same folder.
