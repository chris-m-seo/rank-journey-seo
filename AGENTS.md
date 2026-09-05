# AGENTS.md

Project rules for Rank Journey SEO. This is a Grok Build project — the owner and Grok only. Do not use Claude Code, Claude naming, or Claude conventions. If you find the name Claude in this repo, replace it with Grok.

## Project overview

Rank Journey SEO is an SEO news and education website built with Astro and hosted on GitHub Pages at `https://www.rankjourneyseo.com` (custom domain from GoDaddy). The site publishes long-form educational articles alongside timely news coverage of SEO, AI, code, and web development — the goal is to have pages live while readers are actively searching for answers on a given topic.

Most long-form content is written by the owner personally. Internally, writing is also how the owner learns ("to teach is to learn twice") — that motive stays off the public site. The owner is also using this repository to learn GitHub; prefer clear, small steps and explain Git/GitHub when those come up.

Start small. Ship a homepage, an articles index, individual article pages, and a thin About page. Grow navigation, tools, and sections as content grows.

## Commands

Run these from `website/`:

```sh
npm install
npm run dev      # local site at http://localhost:4321
npm run build    # production build to website/dist/
npm run preview  # serve the production build locally
```

There is no test suite yet.

## Repository structure

- `website/` — the Astro site source. Site-level assets (logo, favicon, icons) live here, not under `content/`.
- `content/blog/` — long-form articles. Each post is a folder: `content/blog/<slug>/index.md` with images beside it (hero, thumbnail, social graphic). Not a shared media folder.
- `content/youtube-scripts/` — voice-overlay scripts reworked from long-form blog articles, written to be read aloud on camera.
- `content/social-captions/` — short-form companion content for X and Instagram.
- `brand/` — voice guidelines and visual identity documents. Consult this before drafting any content to match site voice.
- `tools/` — standalone interactive SEO tools, each in its own subfolder. Two exist conceptually so far: a ranking movement simulator and a meta title checker with live preview. New tools should follow the same one-tool-per-folder pattern.

## Site information architecture

Current nav: **Home**, **Articles**, **About**.

| Route | Purpose |
|---|---|
| `/` | Homepage. Positioning line + latest published articles. Not a marketing landing page. |
| `/articles/` | Article index (the "SEO Articles" category page). |
| `/articles/<slug>/` | Individual article. |
| `/about/` | Thin about page. Expand when the owner writes it. |

Do not add Tools, News, YouTube, or social sections to the nav until those exist.

## Design tokens

The site is a light reading surface. Social/Canva assets may stay white-on-black; the website is the inverse of that palette.

| Token | Value | Notes |
|---|---|---|
| Background | `#ffffff` | |
| Text | `#1a1a1a` | Near-black, not pure `#000000` |
| Muted text | `#5a5a5a` | Dates, bylines, helper copy |
| Border | `#e6e6e6` | Header rule, cards |
| Accent | `#ee5f23` | Sampled from the logo flag. Links, active nav, buttons |
| Accent hover | `#d14f1c` | |
| UI font | Source Sans 3 | Header, nav, UI chrome |
| Article font | Source Serif 4 | Article body, for a familiar WordPress/Shopify reading page |
| Article measure | `42rem` | Comfortable long-form column |

Logo: mountain-and-flag icon. Use it as an icon next to the wordmark "Rank Journey SEO" in the header — do not bake the name into the image. The current file is a black-square JPG (`website/public/logo.jpg`). A transparent PNG of just the mark would sit more cleanly on white; swap the file when one exists.

Article pages should feel like a polished WordPress or Shopify content page: centred column, featured image, title, date, generous body type, orange links.

## Content frontmatter

Every post in `content/blog/<slug>/index.md` starts with:

```yaml
---
title: "The on-page H1"
seoTitle: "Optional title tag if it should differ from the H1"
description: "One or two sentences for the search snippet. Write this last."
pubDate: 2026-09-03
updatedDate: 2026-09-03
author: "Chris M"
type: guide          # guide | news
tags: ["seo"]
draft: true
thumbnail: "./h1-tags-for-seo.svg"
thumbnailAlt: "How to write and optimise H1 tags for SEO"
heroImage: "./how-to-write-and-optimise-h1-tags-for-seo.svg"
heroImageAlt: "How to write and optimise H1 tags for SEO"
socialImage: "./social.png"
---
```

- `title` is the visible H1. `seoTitle` is the browser tab / search-result headline when it should differ from the H1.
- Image files use keyword-rich names unique to that use (listing vs article). Each image has its own `thumbnailAlt` / `heroImageAlt`. No generic names like `thumbnail.svg` or `hero.svg`, and no wording about AI or generation.
- Keep the authoring copy in `content/blog/<slug>/`. Serve a copy from `website/public/media/<slug>/` so live image URLs are `/media/<slug>/<filename>` — never a local laptop path.
- `thumbnail` is a 3:2 SVG in the article folder (black field, white geometry, orange accent). It sits to the right of the listing text on Home and Articles. Height matches the listing text; width is about 1.5 times the height. Prefer SVG so it stays sharp at any zoom. Never full-bleed: thumbs stay inside the same page gutter as the text, on mobile and desktop. The listing excerpt should wrap after a fairly wide first line, usually onto a second line.
- `heroImage` is a 2:1 SVG of the same mark. It sits on the article page below the author/date line and above the body. Width matches the article text column; height is half that width. Same rule: never full-bleed.
- `infographic` is a 4:5 SVG summary of the article. It sits after the closing and before the author bio. Same `/media/<slug>/` serving rule. File names should be hyphenated, for example `how-to-write-and-optimise-h1-tags-for-seo-infographic.svg`.
- `draft: true` keeps the post off the production site. It still appears in `npm run dev`.
- Slug comes from the folder name, not a frontmatter field.
- Leave canonical URLs and series out until they are needed.

## Hosting

- GitHub repo: `chris-m-seo/rank-journey-seo`
- GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`), building `website/`
- Custom domain: `www.rankjourneyseo.com` (`website/public/CNAME`)
- Astro `site` is `https://www.rankjourneyseo.com`. Do not set `base` (custom domain serves from `/`).

DNS at GoDaddy (when going live): point `www` at GitHub Pages. Apex (`rankjourneyseo.com`) should redirect to `www`.

## Content and voice guidelines

- Voice must reflect the owner's authentic character, not a performed or generic "brand" persona — authenticity is treated as more trust-building than polish.
- Public stance: an expert publication, in the same neighbourhood as Search Engine Land. Readers should land and feel they are in good hands. Never mention that the owner is learning, writing in order to learn, or that the site is a personal study project. That context is for this file and for the owner only.
- Homepage positioning (public): SEO news and education. Practical articles on search so the reader can improve their site with confidence. Factual, not salesy.
- Target audience / persona: not yet defined. When agreed, add it here.
- Long-form articles in `content/blog/` are primarily owner-authored. Grok's role there, if asked, is reviewing/refining rather than originating voice.
- For reactive news content (timely SEO/AI/code/dev news), Grok's expected role is: explain the news and its implications clearly, then produce a quick draft to give the owner a head start — not a finished, publish-ready piece.
- When adapting a blog article into a `content/youtube-scripts/` entry, preserve the article's core points but rewrite for spoken delivery (shorter sentences, verbal signposting, no visual-only formatting like tables or bullet-heavy lists).
- `content/social-captions/` content should be short-form and platform-appropriate (X vs. Instagram), derived from the linked long-form piece rather than written standalone.
