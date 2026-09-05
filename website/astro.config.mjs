// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.rankjourneyseo.com',
	trailingSlash: 'always',
	integrations: [sitemap()],
	vite: {
		server: {
			fs: {
				allow: ['..'],
			},
		},
		build: {
			assetsInlineLimit: 0,
		},
	},
});
