# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Rank Journey SEO is an SEO news and education website built with Astro and hosted on GitHub Pages. The site publishes long-form educational articles alongside timely news coverage of SEO, AI, code, and web development — the goal is to have pages live while readers are actively searching for answers on a given topic.

The project doubles as the owner's own learning-reinforcement exercise ("to teach is to learn twice"), so most long-form content is written by the owner personally. The target audience spans complete SEO beginners through in-house marketers looking to sharpen existing skills.

The repository is currently a fresh scaffold — no Astro project has been initialized yet. This file should be updated with real build/lint/test commands as soon as the `website/` Astro project exists.

## Repository structure

- `website/` — the Astro site source. Site-level assets (logo, favicon, icons) live here, not under `content/`.
- `content/blog/` — long-form articles. Content images (headers, thumbnails, social graphics) live alongside the article they belong to, not in a shared media folder.
- `content/youtube-scripts/` — voice-overlay scripts reworked from long-form blog articles, written to be read aloud on camera.
- `content/social-captions/` — short-form companion content for X and Instagram.
- `brand/` — voice guidelines and visual identity documents. Consult this before drafting any content to match site voice.
- `tools/` — standalone interactive SEO tools, each in its own subfolder. Two exist conceptually so far: a ranking movement simulator and a meta title checker with live preview. New tools should follow the same one-tool-per-folder pattern.

## Content and voice guidelines

- Voice must reflect the owner's authentic character, not a performed or generic "brand" persona — authenticity is treated as more trust-building than polish.
- Long-form articles in `content/blog/` are primarily owner-authored. Claude's role there, if asked, is reviewing/refining rather than originating voice.
- For reactive news content (timely SEO/AI/code/dev news), Claude's expected role is: explain the news and its implications clearly, then produce a quick draft to give the owner a head start — not a finished, publish-ready piece.
- When adapting a blog article into a `content/youtube-scripts/` entry, preserve the article's core points but rewrite for spoken delivery (shorter sentences, verbal signposting, no visual-only formatting like tables or bullet-heavy lists).
- `content/social-captions/` content should be short-form and platform-appropriate (X vs. Instagram), derived from the linked long-form piece rather than written standalone.
