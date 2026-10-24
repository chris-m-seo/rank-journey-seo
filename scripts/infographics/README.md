# Infographic generator

Build-time tool that makes the Rank Journey SEO article infographic (4:5 SVG, text converted to outlines) from a short JSON file. Nothing in this folder ships to the website; only the finished SVG does, and only when you use `--publish`.

## Make a new infographic

Run everything from `scripts/infographics/`.

1. Copy `data/meta-tags-for-seo.json` to `data/<your-name>.json` and edit it:
   - `articleSlug`: the folder name under `content/blog/`
   - `outputName`: the SVG file name without `.svg` (keyword-rich, hyphenated, no mention of AI)
   - `title1`, `title2`: the two title lines
   - `items`: exactly five short lines
   - `alt`: what the infographic is, in 125 characters or fewer, without repeating the five points
2. `npm run infographic -- <your-name>` writes the SVG and a PNG preview to `out/` (git-ignored).
3. Check the preview. Happy? `npm run infographic -- <your-name> --publish` copies the SVG into `content/blog/<articleSlug>/` and `website/public/media/<articleSlug>/`. It refuses to overwrite an existing file unless you add `--force`.
4. Paste the printed `<figure class="infographic">` block into the article (after "Final Words", before "About the author") and the two frontmatter lines into the frontmatter.

If a line is too wide, a glyph is missing, or the alt text is too long, the command stops and says which line and by how many pixels.

## Files

| File | What it is |
|---|---|
| `template.svg` | Layout: canvas, logo, hexagons, rules, text positions. Edit this to change the design |
| `assets/logo-embed.txt` | The logo, embedded exactly as in the original infographic |
| `fonts/` | Static fonts used to turn text into outlines (Source Sans 3 800 and 700, Source Serif 4 400) |
| `make-infographic.mjs` | The generator |
| `compare.mjs` | `npm run compare -- <svg>` renders it against the original H1 infographic and writes a side-by-side and a difference image |
| `build-fonts.py` | Only for rebuilding `fonts/`; needs Python with `fonttools` and `brotli`. Normal use needs no Python |

## Setup on a new computer

`npm install` in this folder. That is all.
