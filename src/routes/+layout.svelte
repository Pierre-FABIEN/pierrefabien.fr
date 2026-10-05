<script lang="ts">
	import { initializeLayoutState, setupNavigationEffect, isClient } from './layout.svelte';

	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$shadcn/sonner';
	import '../app.css';
	import SmoothScrollBar from '$lib/components/smoothScrollBar/SmoothScrollBar.svelte';
	import {
		firstLoadComplete,
		setFirstOpen,
		setRessourceToValide
	} from '$lib/store/initialLoaderStore';
	import Loader from '$lib/components/loader/Loader.svelte';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import { page } from '$app/state';
	import type { Component } from 'svelte';

	let { children } = $props();

	// Chargée dynamiquement après le montage pour ne pas inclure Three.js/Threlte/GSAP
	// dans le bundle JS initial (retarderait le Time To Interactive).
	let Scene: Component | undefined = $state();

	$effect(() => {
		initializeLayoutState(page);
		setupNavigationEffect();
		setFirstOpen(true);
		setRessourceToValide(true);
	});

	$effect(() => {
		if ($isClient && !Scene) {
			import('$lib/components/threlte/Scene.svelte').then((module) => {
				Scene = module.default;
			});
		}
	});

	$effect(() => {
		if ($isClient && import.meta.env.PROD) {
			// Généré par vite-plugin-pwa (voir vite.config.ts) : enregistre le service worker
			// pour le cache offline, mis à jour automatiquement en arrière-plan. Pas de SW en
			// dev (non généré par défaut par vite-plugin-pwa), d'où le garde-fou PROD.
			import('virtual:pwa-register').then(({ registerSW }) => {
				registerSW({ immediate: true });
			});
		}
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
	<meta name="viewport" content="width=device-width" />
	<link rel="manifest" href="/pwa/manifest.webmanifest" />
	<meta name="theme-color" content="#4285f4" />
</svelte:head>

{#if !$firstLoadComplete}
	<Loader />
{/if}
{#if $isClient}
	<div class="threlte">
		{#if Scene}
			<Scene />
		{/if}
	</div>
	<ModeWatcher />
	<SiteNav />
	<div class="container">
		<SmoothScrollBar>
			<main data-route-content>
				{@render children()}
			</main>
		</SmoothScrollBar>
	</div>
	<Toaster />
{/if}

<style>
	main {
		overflow-x: hidden;
	}

	.container {
		width: 100%;
		padding: 0;
		margin: 0;
		max-width: none;

		/* pointer-events: none;
		position: absolute;
		z-index: -1; */
	}

	.threlte {
		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		z-index: -1;
	}
</style>
