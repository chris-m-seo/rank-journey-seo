#!/usr/bin/env node
// Builds a Rank Journey SEO article infographic (SVG, text converted to outlines)
// from data/<name>.json and template.svg. Build-time only: nothing here ships
// to the website except the SVG that --publish copies into the article folders.
//
// Usage (from scripts/infographics/):
//   npm run infographic -- <name> [--publish] [--force]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ot from 'opentype.js';
import { Resvg } from '@resvg/resvg-js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');

// Layout limits, measured from the reference infographic.
const MAX_TITLE_WIDTH = 1005; // reference line 2 measures 1004.22
const MAX_ITEM_RIGHT_EDGE = 1100;
const MAX_ALT_LENGTH = 125;
const ITEM_COUNT = 5;

const FONT_FILES = {
	'sans-800': 'SourceSans3-800.ttf',
	'sans-700': 'SourceSans3-700.ttf',
	'serif-400': 'SourceSerif4-Text-400.ttf',
};

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const BANNED_NAME_WORDS = ['ai', 'generated', 'generation', 'chatgpt', 'gpt', 'claude', 'grok'];

function fail(message) {
	console.error(`\nError: ${message}\n`);
	process.exit(1);
}

function parseArgs(argv) {
	const flags = new Set(argv.filter((a) => a.startsWith('--')));
	const positional = argv.filter((a) => !a.startsWith('--'));
	const known = new Set(['--publish', '--force', '--match-reference']);
	for (const f of flags) {
		if (!known.has(f)) fail(`Unknown option ${f}. Options: --publish, --force.`);
	}
	if (positional.length !== 1) {
		fail('Give the name of one data file, e.g. npm run infographic -- meta-tags-for-seo');
	}
	return {
		name: positional[0],
		publish: flags.has('--publish'),
		force: flags.has('--force'),
		// Internal, for the fidelity check only: reproduces the reference's
		// title line 1, which Canva centred with a trailing space.
		matchReference: flags.has('--match-reference'),
	};
}

function loadFont(key) {
	const file = path.join(HERE, 'fonts', FONT_FILES[key]);
	if (!fs.existsSync(file)) fail(`Missing font file fonts/${FONT_FILES[key]}.`);
	const buf = fs.readFileSync(file);
	return ot.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

function loadData(name) {
	if (!SLUG_PATTERN.test(name)) fail(`"${name}" is not a valid data file name (lowercase letters, numbers, hyphens).`);
	const file = path.join(HERE, 'data', `${name}.json`);
	if (!fs.existsSync(file)) fail(`Cannot find data/${name}.json.`);
	let data;
	try {
		data = JSON.parse(fs.readFileSync(file, 'utf8'));
	} catch (err) {
		fail(`data/${name}.json is not valid JSON: ${err.message}`);
	}
	for (const key of ['articleSlug', 'outputName', 'title1', 'title2', 'alt']) {
		if (typeof data[key] !== 'string' || data[key].trim() === '') fail(`data/${name}.json: "${key}" must be a non-empty string.`);
		data[key] = data[key].trim();
	}
	if (!Array.isArray(data.items) || data.items.length !== ITEM_COUNT) {
		fail(`data/${name}.json: "items" must contain exactly ${ITEM_COUNT} lines (found ${Array.isArray(data.items) ? data.items.length : 'none'}).`);
	}
	data.items = data.items.map((item, i) => {
		if (typeof item !== 'string' || item.trim() === '') fail(`data/${name}.json: item ${i + 1} is empty.`);
		return item.trim();
	});
	for (const key of ['articleSlug', 'outputName']) {
		if (!SLUG_PATTERN.test(data[key])) fail(`data/${name}.json: "${key}" must be lowercase words joined by hyphens.`);
		const banned = data[key].split('-').filter((w) => BANNED_NAME_WORDS.includes(w));
		if (banned.length) fail(`data/${name}.json: "${key}" must not mention "${banned.join('", "')}".`);
	}
	if (data.alt.length > MAX_ALT_LENGTH) {
		fail(`Alt text is ${data.alt.length} characters; the limit is ${MAX_ALT_LENGTH} (${data.alt.length - MAX_ALT_LENGTH} too many).`);
	}
	return data;
}

// Lay a line of text out with kerning. Returns glyph positions and the advance width.
function layout(font, text, size) {
	const scale = size / font.unitsPerEm;
	const glyphs = Array.from(text).map((ch) => ({ ch, glyph: font.charToGlyph(ch) }));
	const missing = glyphs.filter((g) => g.ch !== ' ' && g.glyph.index === 0).map((g) => g.ch);
	if (missing.length) fail(`The font has no glyph for: ${[...new Set(missing)].map((c) => `"${c}"`).join(' ')} (in "${text}").`);
	let x = 0;
	const placed = [];
	glyphs.forEach((g, i) => {
		placed.push({ ...g, x });
		x += g.glyph.advanceWidth * scale;
		if (i < glyphs.length - 1) x += (font.getKerningValue(g.glyph, glyphs[i + 1].glyph) || 0) * scale;
	});
	return { placed, width: x, scale };
}

// opentype.js's own toPathData can emit NaN for some curves, so serialise the
// path commands directly (2 decimal places is well below a visible pixel).
function toPathData(path) {
	const n = (v) => {
		if (!Number.isFinite(v)) fail('A glyph produced an invalid coordinate.');
		return String(Number(v.toFixed(2)));
	};
	return path.commands
		.map((c) => {
			switch (c.type) {
				case 'M':
				case 'L':
					return `${c.type}${n(c.x)} ${n(c.y)}`;
				case 'Q':
					return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
				case 'C':
					return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
				case 'Z':
					return 'Z';
				default:
					return fail(`Unexpected path command "${c.type}".`);
			}
		})
		.join('');
}

function outline(font, text, size, originX, baselineY, anchor, trailingSpaceWidth = 0) {
	const { placed, width } = layout(font, text, size);
	const startX = anchor === 'middle' ? originX - (width + trailingSpaceWidth) / 2 : originX;
	const d = placed
		.filter((p) => p.ch !== ' ')
		.map((p) => toPathData(p.glyph.getPath(startX + p.x, baselineY, size)))
		.join('');
	return { d, startX, width };
}

function buildSvg(data, opts) {
	const fonts = {};
	const template = fs.readFileSync(path.join(HERE, 'template.svg'), 'utf8');
	const logo = fs.readFileSync(path.join(HERE, 'assets', 'logo-embed.txt'), 'utf8').trim();

	const values = {
		TITLE_1: data.title1,
		TITLE_2: data.title2,
		...Object.fromEntries(data.items.map((t, i) => [`ITEM_${i + 1}`, t])),
	};
	const problems = [];

	let svg = template.replace(/<text\s+([^>]*)>([^<]*)<\/text>/g, (_, attrString, content) => {
		const attrs = Object.fromEntries([...attrString.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
		const key = content.match(/^\{\{(\w+)\}\}$/)?.[1];
		const text = key ? values[key] : content;
		if (text === undefined) fail(`Template placeholder {{${key}}} has no value.`);
		fonts[attrs['data-font']] ??= loadFont(attrs['data-font']);
		const font = fonts[attrs['data-font']];
		const size = Number(attrs['font-size']);
		const x = Number(attrs.x);
		const y = Number(attrs.y);
		const anchor = attrs['text-anchor'];
		const spaceWidth = (font.charToGlyph(' ').advanceWidth * size) / font.unitsPerEm;
		const trailing = opts.matchReference && key === 'TITLE_1' ? spaceWidth : 0;
		const o = outline(font, text, size, x, y, anchor, trailing);

		if (key === 'TITLE_1' || key === 'TITLE_2') {
			if (o.width > MAX_TITLE_WIDTH) problems.push(`${key} ("${text}") is ${o.width.toFixed(1)}px wide, ${(o.width - MAX_TITLE_WIDTH).toFixed(1)}px over the ${MAX_TITLE_WIDTH}px limit.`);
		}
		if (key?.startsWith('ITEM_')) {
			const right = o.startX + o.width;
			if (right > MAX_ITEM_RIGHT_EDGE) problems.push(`${key} ("${text}") ends at x=${right.toFixed(1)}, ${(right - MAX_ITEM_RIGHT_EDGE).toFixed(1)}px past the x=${MAX_ITEM_RIGHT_EDGE} limit.`);
		}
		return `<path fill="${attrs.fill}" d="${o.d}"/>`;
	});

	if (problems.length) fail(`Text does not fit:\n  - ${problems.join('\n  - ')}`);

	svg = svg.replace('{{LOGO}}', logo);
	svg = svg.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s*\n\s*</g, '><').trim() + '\n';

	// Safety checks on the finished file.
	if (/\{\{|\}\}/.test(svg)) fail('Unfilled placeholder left in the SVG.');
	if (/<script|<style|<foreignObject|font-family|@import/i.test(svg)) fail('The SVG must not contain scripts, styles or font references.');
	const refs = [...svg.matchAll(/(?:xlink:)?href="([^"]*)"/g)].map((m) => m[1]).filter((h) => !h.startsWith('data:image/jpeg;base64,'));
	if (refs.length) fail(`The SVG contains external references: ${refs.join(', ')}`);
	return svg;
}

function figureMarkup(data) {
	const htmlAlt = data.alt.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
	const yamlAlt = data.alt.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
	return {
		figure: `<figure class="infographic">
	<img
		src="/media/${data.articleSlug}/${data.outputName}.svg"
		alt="${htmlAlt}"
		width="1600"
		height="2000"
		loading="lazy"
	/>
</figure>`,
		frontmatter: `infographic: "./${data.outputName}.svg"\ninfographicAlt: "${yamlAlt}"`,
	};
}

function publish(data, outPath) {
	const articleDir = path.join(ROOT, 'content', 'blog', data.articleSlug);
	if (!fs.existsSync(articleDir)) fail(`content/blog/${data.articleSlug}/ does not exist, so there is no article to attach this to. Check "articleSlug".`);
	const targets = [
		path.join(articleDir, `${data.outputName}.svg`),
		path.join(ROOT, 'website', 'public', 'media', data.articleSlug, `${data.outputName}.svg`),
	];
	return { targets };
}

// ---- main ----
const args = parseArgs(process.argv.slice(2));
const data = loadData(args.name);
const svg = buildSvg(data, args);

const outDir = path.join(HERE, 'out');
fs.mkdirSync(outDir, { recursive: true });
const svgPath = path.join(outDir, `${data.outputName}.svg`);
const pngPath = path.join(outDir, `${data.outputName}-preview.png`);
fs.writeFileSync(svgPath, svg);
const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1600 }, background: '#000000' }).render().asPng();
fs.writeFileSync(pngPath, png);

const rel = (p) => path.relative(process.cwd(), p) || p;
console.log(`\nSVG:     ${rel(svgPath)}  (${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB, ${Buffer.byteLength(svg)} bytes)`);
console.log(`Preview: ${rel(pngPath)}  (1600x2000 PNG, for review only, never published)`);

if (args.publish) {
	const { targets } = publish(data, svgPath);
	const existing = targets.filter((t) => fs.existsSync(t));
	if (existing.length && !args.force) {
		fail(`Not publishing; these files already exist (use --force to overwrite):\n  - ${existing.map((t) => path.relative(ROOT, t)).join('\n  - ')}`);
	}
	for (const t of targets) {
		fs.mkdirSync(path.dirname(t), { recursive: true });
		fs.copyFileSync(svgPath, t);
	}
	const same = targets.every((t) => fs.readFileSync(t).equals(fs.readFileSync(svgPath)));
	if (!same) fail('Published copies are not byte-identical.');
	console.log('\nPublished (byte-identical copies):');
	targets.forEach((t) => console.log(`  ${path.relative(ROOT, t)}`));
} else {
	console.log('\nNot published (add --publish to copy it into the article folder and website/public/media).');
}

const { figure, frontmatter } = figureMarkup(data);
console.log('\nPaste into the article body, after "Final Words" and before "About the author":\n');
console.log(figure);
console.log('\nFrontmatter lines:\n');
console.log(frontmatter);
console.log('');
