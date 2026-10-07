import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			injectRegister: false,
			manifestFilename: 'pwa/manifest.webmanifest',
			manifest: {
				name: 'Pierre Fabien',
				short_name: 'Pierre Fabien',
				description: 'Pierre Fabien — développeur web et compositeur musical.',
				start_url: '/',
				display: 'standalone',
				background_color: '#000000',
				theme_color: '#4285f4',
				icons: [
					{
						src: '/pwa/favicon/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: '/pwa/favicon/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,png,svg,webp,woff2,glb}'],
				navigateFallback: null
			}
		})
	],

	resolve: {
		preserveSymlinks: true
	},

	server: {
		port: 5173
	}
};

export default config;
