import adapter from '@sveltejs/adapter-static';
import { VitePWA } from 'vite-plugin-pwa';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	plugins: [
		VitePWA({
			manifest: {
				// les options pour votre manifeste
				name: 'Mon App SvelteKit PWA',
				short_name: 'SvelteKitPWA',
				description: 'Une démo de PWA avec SvelteKit et Vite',
				icons: [
					// Vos icônes pour la PWA
				]
				// ... d'autres options du manifeste
			},
			workbox: {
				// les options pour workbox
				swSrc: '/sw.js',
				runtimeCaching: [
					{
						urlPattern: /^https?.*/,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'http-cache'
						}
					}
				]
			}
		})
	],
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
