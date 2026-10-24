#!/usr/bin/env node
// Fidelity check: renders the reference infographic and a generated one at
// 1600x2000, then writes a side-by-side image and a difference image.
//
// Usage (from scripts/infographics/):
//   npm run compare -- <generated.svg>
// Read-only with respect to the reference file.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const REFERENCE = path.join(ROOT, 'content/blog/optimise-h1-tags-for-seo/how-to-write-and-optimise-h1-tags-for-seo-infographic.svg');

const target = process.argv[2];
if (!target) {
	console.error('Give the path of the generated SVG, e.g. npm run compare -- out/how-to-write-and-optimise-h1-tags-for-seo-infographic.svg');
	process.exit(1);
}

const render = (file) => {
	const svg = fs.readFileSync(file, 'utf8');
	const r = new Resvg(svg, { fitTo: { mode: 'width', value: 1600 }, background: '#000000' }).render();
	return PNG.sync.read(Buffer.from(r.asPng()));
};

const a = render(REFERENCE);
const b = render(path.resolve(target));
if (a.width !== b.width || a.height !== b.height) {
	console.error(`Size mismatch: reference ${a.width}x${a.height}, generated ${b.width}x${b.height}`);
	process.exit(1);
}
const { width: w, height: h } = a;

const diff = new PNG({ width: w, height: h });
const differing = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: 0.1, includeAA: true, diffColor: [255, 0, 0], alpha: 0.25 });

// "Inked" pixels: anything not pure black in either image.
let inked = 0;
for (let i = 0; i < a.data.length; i += 4) {
	const nonBlackA = a.data[i] + a.data[i + 1] + a.data[i + 2] > 30;
	const nonBlackB = b.data[i] + b.data[i + 1] + b.data[i + 2] > 30;
	if (nonBlackA || nonBlackB) inked++;
}

// Side by side.
const side = new PNG({ width: w * 2 + 20, height: h });
side.data.fill(60);
PNG.bitblt(a, side, 0, 0, w, h, 0, 0);
PNG.bitblt(b, side, 0, 0, w, h, w + 20, 0);

const stem = path.basename(target, '.svg');
const outDir = path.join(HERE, 'out');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `${stem}-side-by-side.png`), PNG.sync.write(side));
fs.writeFileSync(path.join(outDir, `${stem}-difference.png`), PNG.sync.write(diff));

console.log(`Compared at ${w}x${h}`);
console.log(`Differing pixels: ${differing} of ${w * h} = ${((differing / (w * h)) * 100).toFixed(3)}% of the canvas`);
console.log(`                  ${((differing / inked) * 100).toFixed(2)}% of the pixels that carry any artwork (${inked})`);
console.log(`Written: out/${stem}-side-by-side.png, out/${stem}-difference.png`);
