import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// Site 100% statique : pas de code serveur, export HTML/CSS/JS pur.
		// https://svelte.dev/docs/kit/adapter-static
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),

		alias: {
			// this will match a file
			$lib: 'src/lib',
			$components: 'src/lib/components',
			$server: 'src/lib/server',
			$store: 'src/lib/store',
			$shadcn: 'src/lib/components/shadcn/ui'
		}
	}
};

export default config;
