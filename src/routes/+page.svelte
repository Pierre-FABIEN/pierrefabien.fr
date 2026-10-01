<script lang="ts">
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { animateCameraToSection } from '$lib/components/threlte/utils/Functions/sectionTransition';
	import {
		activeSection,
		disableAnimationsHome,
		homeSceneVisible
	} from '$lib/store/ThreeStore/animationStores';

	import '@fontsource-variable/montserrat';

	async function handleSectionClick(event: MouseEvent, section: 'dev' | 'music') {
		event.preventDefault();
		// Liens valables uniquement sur le premier écran (home)
		if ($disableAnimationsHome) return;
		// Active la section (affiche le placeholder) avant la rotation pour éviter tout pop-in
		activeSection.set(section);
		await animateCameraToSection(section);
		// La scène d'accueil ne disparaît qu'une fois la rotation terminée
		homeSceneVisible.set(false);
		goto(`/${section}`);
	}

	$effect(() => {
		let destroyed = false;
		let cleanup: (() => void) | undefined;

		tick().then(async () => {
			const { initScrollAnimations } = await import('./pageScrollAnimations');
			if (destroyed) return;
			cleanup = initScrollAnimations();
		});

		return () => {
			destroyed = true;
			cleanup?.();
		};
	});
</script>

<!-- Votre code HTML pour les sections -->
<section class="home flex justify-center content-center items-center">
	<a
		href="/dev"
		class="link-dev"
		aria-label="Go to dev section"
		inert={$disableAnimationsHome}
		onclick={(e) => handleSectionClick(e, 'dev')}
	></a>
	<a
		href="/music"
		class="link-music"
		aria-label="Go to music section"
		inert={$disableAnimationsHome}
		onclick={(e) => handleSectionClick(e, 'music')}
	></a>
</section>
<section class="about flex flex-col justify-center items-center">
	<p class="text-center container-text-about">
		Hello ! welcome to my website.
		<br />
		I'm a web developer and musical composer from Toulouse,<br /> passionate about both art and science.
	</p>
</section>
<section class="suite flex justify-center content-center items-center">
	<div class="flex-col container-text-suite">
		<p class="text-center">
			When art and science intertwine,<br /> they form the true alchemy of creation
		</p>
		<br />
		<p class="text-center">
			a balance as intricate as the caduceus of Hermes,<br /> guiding us toward freedom.
		</p>
	</div>
</section>
<section class="ets flex justify-center content-center items-center">
	<p>TEXTE</p>
</section>
<section class="fin flex justify-center content-center items-center">
	<p>TEXTE</p>
</section>

<style>
	section {
		border: red 2px solid;
		width: 100%;
		height: 100vh;
		font-family: 'Montserrat Variable', sans-serif;
	}

	.container-text-about {
		transform: translateY(10vh);
	}

	.container-text-suite {
		transform: translateY(-30vh);
	}

	.link-music {
		position: absolute;
		top: 0;
		right: 0;
		width: 40%;
		height: 100%;
		z-index: 1;
	}
	.link-music[inert],
	.link-dev[inert] {
		pointer-events: none;
	}
	.link-dev {
		position: absolute;
		top: 0;
		left: 0;
		width: 40%;
		height: 100%;
		z-index: 1;
	}
</style>
