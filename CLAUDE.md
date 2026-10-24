# CLAUDE.md

Project rules for Rank Journey SEO.

## Project overview

Rank Journey SEO is an SEO news and education website built with Astro and hosted on GitHub Pages at `https://www.rankjourneyseo.com` (custom domain). The site publishes long-form educational articles alongside timely news coverage of SEO, AI, code, and web development — the goal is to have pages live while readers are actively searching for answers on a given topic.

Long-form content is written by the owner. Internally, writing is also how the owner learns ("to teach is to learn twice") — that motive stays off the public site. The owner is also using this repository to learn GitHub; prefer clear, small steps and explain Git/GitHub when those come up.

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
- `content/blog/` — long-form articles. Each post is a folder: `content/blog/<slug>/index.md` with images beside it (hero, thumbnail, social graphic). Not a shared media folder. The file must be named exactly `index.md`: the site takes the URL from the folder name, so any other file name adds a second path segment to the URL.
- `content/youtube-scripts/` — voice-overlay scripts reworked from long-form blog articles, written to be read aloud on camera.
- `content/social-captions/` — short-form companion content for X and Instagram.
- `brand/` — voice guidelines and visual identity documents. Consult this before drafting any content to match site voice.
- `tools/` — standalone interactive SEO tools for readers, each in its own subfolder. Two exist conceptually so far: a ranking movement simulator and a meta title checker with live preview (a SERP simulator is planned). New tools should follow the same one-tool-per-folder pattern. Keep build scripts out of here; `tools/` is for reader-facing pages only.
- `scripts/` — build-time helpers that never ship to the site. Currently `scripts/infographics/` (see Infographics below).

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
infographic: "./how-to-write-and-optimise-h1-tags-for-seo-infographic.svg"
infographicAlt: "Infographic with five takeaways for writing and optimising H1 tags for SEO."
socialImage: "./social.png"   # not used yet; add only when a PNG exists
---
```

Only list an image field once its file exists. The site builds image URLs without checking the file, so a missing file means a broken image on the page.

- `title` is the visible H1. `seoTitle` is the browser tab / search-result headline when it should differ from the H1.
- Image files use keyword-rich names unique to that use (listing vs article). Each image has its own `thumbnailAlt` / `heroImageAlt`. No generic names like `thumbnail.svg` or `hero.svg`, and no wording about AI or generation.
- Keep the authoring copy in `content/blog/<slug>/`. Serve a copy from `website/public/media/<slug>/` so live image URLs are `/media/<slug>/<filename>` — never a local laptop path.
- `thumbnail` is a 3:2 SVG in the article folder (black field, white geometry, orange accent). It sits to the right of the listing text on Home and Articles. Height matches the listing text; width is about 1.5 times the height. Prefer SVG so it stays sharp at any zoom. Never full-bleed: thumbs stay inside the same page gutter as the text, on mobile and desktop. The listing excerpt should wrap after a fairly wide first line, usually onto a second line.
- `heroImage` is a 2:1 SVG of the same mark. It sits on the article page below the author/date line and above the body. Width matches the article text column; height is half that width. Same rule: never full-bleed.
- `infographic` is a 4:5 SVG summary of the article. It sits after the closing and before the author bio. Same `/media/<slug>/` serving rule. File names should be hyphenated, for example `how-to-write-and-optimise-h1-tags-for-seo-infographic.svg`.
- `draft: true` keeps the post off the production site. It still appears in `npm run dev`.
- Slug comes from the folder name, not a frontmatter field.
- Leave canonical URLs and series out until they are needed.
- The page template already prints the H1 (`title`), the author and the dates from frontmatter. Do not repeat any of them in the body: no `# Heading` (the page would have two H1s) and no "Author:" or "Publish date:" lines.
- The browser tab and search-result title is `seoTitle` (or `title` if there is no `seoTitle`), exactly as written. The layout adds no brand suffix, so write the brand into the title yourself only if there is room. Keep it to about 45–60 characters (around 600px).
- `thumbnail` and `heroImage` are drawn by hand as small SVGs: black field, white geometry, one orange accent, and a simple motif that hints at the article's subject. The H1 article uses an orange bar over two white bars (heading hierarchy). The meta tags article uses a white pole with an orange pennant (the flag that waves at search engines). Thumbnail `viewBox="0 0 150 100"`, hero `viewBox="0 0 200 100"`, each with a `<title>`. Give each article its own motif so the listing doesn't look repetitive.
- `og:image` currently points at the hero SVG. X and Facebook do not show SVG link previews, so make a PNG `socialImage` (about 1200×630) before promoting articles on social.

## Article body patterns

Reusable pieces for `content/blog/<slug>/index.md`. The styles live in `website/src/styles/global.css` under `.prose`.

- **Inline code** (a tag or short snippet in a sentence): wrap in backticks. It renders as a light grey chip, e.g. `<title>`.
- **Code block** (several lines of HTML for the reader to study): a fenced block with a language, ` ```html `. It renders as a dark box with light text. Never paste raw tags into the body as plain text: the browser treats `<head>` or `<title>` as real HTML and the example disappears.
- **Screenshot with annotation:** a plain `<figure>` with an `<img>` and a `<figcaption>`. The caption renders in muted grey sans-serif with a thin orange left rule, and explains why the screenshot is there and what it shows. Link to related articles from the caption when natural.

  ```html
  <figure>
  	<img
  		src="/media/<slug>/<descriptive-name>.png"
  		alt="What the screenshot shows"
  		width="1400"
  		height="294"
  		loading="lazy"
  	/>
  	<figcaption>
  		One sentence of annotation, with an <a href="/articles/<other-slug>/">internal link</a> where it fits.
  	</figcaption>
  </figure>
  ```
  Use the image's real pixel size for `width` and `height` (it stops the page jumping while loading). Copy the file to `website/public/media/<slug>/` as well.
- **Other images in the body:** raw `<img>` with `width`, `height` and `loading="lazy"`, same serving rule.
- **Bold labels in lists:** `**Label:** text`, with the space after the closing `**`. Do not paste `&#32;` or other export codes from a word processor; they stop the bold from rendering.
- **Placeholders** the owner leaves in a draft, such as `[SCREENSHOT: file name: x | Add alt text: y]`, mean: put that image there with that alt text, then delete the placeholder.

## Infographics

Made with `scripts/infographics/` (full guide in its `README.md`), not Canva. Nothing in that folder ships to the site except the SVG it outputs.

- One data file per article in `scripts/infographics/data/<name>.json`: `articleSlug`, `outputName`, `title1`, `title2`, five `items`, and `alt`. Copy an existing one.
- From `scripts/infographics/`, run `npm run infographic -- <name>`. It writes the SVG and a PNG preview to `out/` (git-ignored). Add `--publish` to copy the SVG to `content/blog/<slug>/` and `website/public/media/<slug>/` (identical copies). It will not overwrite existing files without `--force`. It never edits markdown; paste the printed `<figure class="infographic">` block and the two frontmatter lines into the article.
- Build the infographic after the article text is final: the five takeaways are distilled from it. The article keeps the full takeaways list as real text, because text outlined in an SVG can't be read by search engines.
- Format (must match every infographic): 4:5 SVG, `width="1600" height="2000"`, `viewBox="0 0 1200 1499.999933"`, text outlined as paths, colours `#000000`, `#ffffff`, `#ee5f23` only, the embedded logo, five numbered hexagons, footer "Rank Journey SEO". Fonts: Source Sans 3 weight 800 (title, footer) and 700 (numerals), Source Serif 4 weight 400 at optical size 20 (the five lines), measured against the original.
- Limits the tool enforces: five lines, each ending before x=1100; each title line no wider than 1005px; alt text 125 characters or fewer, describing what the infographic is without repeating its five points; file names lowercase-hyphenated with no mention of AI or generation.
- Markup is the `<figure class="infographic">` block with `loading="lazy"`, placed after "Final Words" and before "About the author".
- To change the design, edit `scripts/infographics/template.svg` and regenerate; do not hand-edit published SVGs. `npm run compare -- <svg>` checks a generated file against the original H1 infographic. Static fonts are in `scripts/infographics/fonts/`; `build-fonts.py` rebuilds them and is the only part that needs Python.

## Working agreements

- The owner makes their own git commits and pushes, to learn GitHub. Make the file changes, show `git status`, give the exact commands, then stop. Do not run `git add`, `commit`, `push` or create branches.
- Ask before installing anything or downloading files.
- Leave the manual copy of article images from `content/blog/<slug>/` to `website/public/media/<slug>/` as it is.
- Long-form article wording is the owner's. Fix structure, formatting and technical problems; do not rewrite the prose unless asked.

## Open items

- Target audience is not defined yet (see Content and voice guidelines).
- The About page is still a placeholder.
- PNG `socialImage` for link previews, when social publishing starts.
- A transparent PNG of the logo mark, to replace the black-square JPG.
- Voice notes in `brand/` do not exist yet. Build them gradually from published articles and treat them as provisional.

## Hosting

- GitHub repo: `chris-m-seo/rank-journey-seo`
- GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`), building `website/`
- Custom domain: `www.rankjourneyseo.com` (`website/public/CNAME`)
- Astro `site` is `https://www.rankjourneyseo.com`. Do not set `base` (custom domain serves from `/`).

DNS at GoDaddy (when going live): point `www` at GitHub Pages. Apex (`rankjourneyseo.com`) should redirect to `www`.

JSON-LD on the site: Organization (`Rank Journey SEO`), Person (`Chris M`) as author/founder in markup only, WebSite on the homepage, and BlogPosting on articles with `author` / `publisher` pointing at those `@id`s. About is the publication page, not a personal bio — do not link the byline to `/about/`. Do not invent extra Person `sameAs` profiles, awards, or ratings. The public X account belongs on the Organization, not on the Person, unless a personal profile exists.

## Content and voice guidelines

- Voice must reflect the owner's authentic character, not a performed or generic "brand" persona — authenticity is treated as more trust-building than polish.
- Public stance: an expert publication, in the same neighbourhood as Search Engine Land. Readers should land and feel they are in good hands. Never mention that the owner is learning, writing in order to learn, or that the site is a personal study project. That context is for this file and for the owner only.
- Homepage positioning (public): SEO news and education. Practical articles on search so the reader can improve their site with confidence. Factual, not salesy.
- Target audience / persona: not yet defined. When agreed, add it here.
- Long-form articles in `content/blog/` are primarily owner-authored. Claude's role there, if asked, is reviewing/refining rather than originating voice.
- For reactive news content (timely SEO/AI/code/dev news), Claude's expected role is: explain the news and its implications clearly, then produce a quick draft to give the owner a head start — not a finished, publish-ready piece.
- When adapting a blog article into a `content/youtube-scripts/` entry, preserve the article's core points but rewrite for spoken delivery (shorter sentences, verbal signposting, no visual-only formatting like tables or bullet-heavy lists).
- `content/social-captions/` content should be short-form and platform-appropriate (X vs. Instagram), derived from the linked long-form piece rather than written standalone.
