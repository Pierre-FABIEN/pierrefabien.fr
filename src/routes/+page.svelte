<script lang="ts">
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import SplitReveal from '$lib/components/SplitReveal.svelte';
	import { animateCameraToSection } from '$lib/components/threlte/utils/Functions/sectionTransition';
	import {
		activeSection,
		disableAnimationsHome,
		homeSceneVisible
	} from '$lib/store/ThreeStore/animationStores';

	// Mots affichés dans la police d'accent (Qwitcher Grypen).
	const ACCENTS = ['art', 'science', 'alchemy', 'creation', 'caduceus', 'hermes', 'freedom'];

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
	<div class="scroll-cue" aria-hidden="true">
		<div class="scroll-cue-inner">
			<span class="scroll-cue-label">Scroll</span>
			<span class="scroll-cue-track"><span class="scroll-cue-line"></span></span>
		</div>
	</div>
</section>
<section class="about flex flex-col justify-center items-center">
	<svg aria-hidden="true" width="0" height="0" style="position: absolute">
		<defs>
			<!-- Anneau calculé sur la forme finale : pas de recouvrement de contours comme avec text-stroke. -->
			<filter id="about-outline" x="-5%" y="-5%" width="110%" height="110%">
				<feMorphology in="SourceAlpha" operator="erode" radius="0.5" result="inner" />
				<feComposite in="SourceGraphic" in2="inner" operator="out" result="ring" />
				<feComponentTransfer in="ring">
					<feFuncA type="linear" slope="0.7" />
				</feComponentTransfer>
			</filter>
			<filter id="about-outline-small" x="-5%" y="-5%" width="110%" height="110%">
				<feMorphology in="SourceAlpha" operator="erode" radius="0.5" result="inner" />
				<feComposite in="SourceGraphic" in2="inner" operator="out" result="ring" />
				<feComponentTransfer in="ring">
					<feFuncA type="linear" slope="0.7" />
				</feComponentTransfer>
			</filter>
		</defs>
	</svg>
	<div class="about-composition">
		<p class="about-label">About me</p>
		<div class="about-text">
			<SplitReveal
				capitalize
				class="about-block about-block-a"
				lines={["I'm a web developer", 'musical composer,']}
			/>
			<SplitReveal class="about-amp" lines={['&']} />
			<SplitReveal
				capitalize
				class="about-block about-block-b"
				lines={['passionate about both', 'art and technologies.']}
			/>
		</div>
	</div>
</section>
<section class="suite">
	<div class="suite-composition">
		<SplitReveal
			capitalize
			accents={ACCENTS}
			class="suite-block"
			lines={['when art and science intertwine,', 'they form the true alchemy of creation']}
		/>
		<SplitReveal
			capitalize
			accents={ACCENTS}
			class="suite-block"
			lines={['a balance as intricate as the caduceus of Hermes,', 'guiding us toward freedom.']}
		/>
	</div>
</section>
<section class="ets flex justify-center content-center items-center">
	<p>TEXTE</p>
</section>
<section class="fin flex justify-center content-center items-center">
	<p>TEXTE</p>
</section>

<style>
	@font-face {
		font-family: 'Clarity City';
		font-style: normal;
		font-weight: 100 900;
		font-display: swap;
		src: url('/font/clarity-city/normal-latin-ext.woff2') format('woff2');
		unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308,
			U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113,
			U+2C60-2C7F, U+A720-A7FF;
	}

	@font-face {
		font-family: 'Clarity City';
		font-style: normal;
		font-weight: 100 900;
		font-display: swap;
		src: url('/font/clarity-city/normal-latin.woff2') format('woff2');
		unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304,
			U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
	}

	@font-face {
		font-family: 'Clarity City';
		font-style: italic;
		font-weight: 100 900;
		font-display: swap;
		src: url('/font/clarity-city/italic-latin-ext.woff2') format('woff2');
		unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308,
			U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113,
			U+2C60-2C7F, U+A720-A7FF;
	}

	@font-face {
		font-family: 'Clarity City';
		font-style: italic;
		font-weight: 100 900;
		font-display: swap;
		src: url('/font/clarity-city/italic-latin.woff2') format('woff2');
		unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304,
			U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
	}

	@font-face {
		font-family: 'Qwitcher Grypen';
		font-style: normal;
		font-weight: 400;
		font-display: swap;
		src: url('/font/qwitcher-grypen/400-latin.woff2') format('woff2');
	}

	@font-face {
		font-family: 'Qwitcher Grypen';
		font-style: normal;
		font-weight: 700;
		font-display: swap;
		src: url('/font/qwitcher-grypen/700-latin.woff2') format('woff2');
	}

	section {
		/* border: red 2px solid; */
		width: 100%;
		height: 100vh;
		font-family: 'Clarity City', sans-serif;
		color: rgb(194, 193, 193);
	}

	/* Conteneur d'ensemble : label + composition ; c'est lui qui est positionné et animé. */
	.about-composition {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: clamp(1rem, 2.5vh, 1.75rem);
		align-self: flex-start;
		margin-left: clamp(1rem, 5vw, 6rem);
		max-width: 96vw;
	}

	/* Même style que le label du scroll cue. */
	.about-label {
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.42em;
		text-transform: uppercase;
		opacity: 0.8;
	}

	/* Rangée 1 : bloc A + grand & à sa droite ; rangée 2 : bloc B sous le bloc A. */
	.about :global(.about-text) {
		display: grid;
		grid-template-columns: auto auto;
		align-items: center;
		justify-content: center;
		column-gap: 0.7em;
		row-gap: 0.35em;
		max-width: 96vw;
		font-size: clamp(1.1rem, min(4.3vw, 7vh), 6rem);
		font-weight: 800;
		line-height: 1.08;
		letter-spacing: 0.02em;
		filter: url(#about-outline);
	}

	.about :global(.about-block) {
		text-align: left;
		white-space: nowrap;
	}

	.about :global(.about-block-a) {
		grid-area: 1 / 1;
	}

	.about :global(.about-amp) {
		grid-area: 1 / 2;
		justify-self: start;
		/* 100px / translateX(-30px) quand le texte fait 44.64px (1440×900), proportionnels ensuite. */
		font-size: 3.4em;
		line-height: 1;
		transform: translate(-1em, 0);
	}

	.about :global(.about-block-b) {
		grid-area: 2 / 1;
		transform: translateY(-30px);
	}

	/* Lettres pleines : le filtre n'en garde que l'anneau ; l'animation joue sur leur opacité. */
	.about :global(.char) {
		color: white;
	}

	.about :global(.about-amp .char) {
		color: hsl(var(--primary));
	}

	@media (max-width: 800px) {
		.about-composition {
			align-self: center;
			align-items: center;
			margin-left: 0;
		}

		.about-label {
			padding-left: 0.42em;
		}

		.about :global(.about-text) {
			display: flex;
			flex-direction: column;
			gap: 0.2em;
			font-size: clamp(1.25rem, 6vw, 2.2rem);
			filter: url(#about-outline-small);
		}

		.about :global(.about-block) {
			text-align: center;
		}

		.about :global(.about-amp) {
			justify-self: auto;
			font-size: 1.5em;
			transform: none;
		}
	}

	/* Section 3 : texte plein (sans contour), centré en bas pour laisser la place au personnage. */
	.suite {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
	}

	.suite-composition {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.9em;
		margin-bottom: clamp(4rem, 10vh, 7rem);
		max-width: 96vw;
		font-size: clamp(0.85rem, min(1.7vw, 3vh), 2.2rem);
		font-weight: 100;
		line-height: 1.2;
		letter-spacing: 0.02em;
		--accent-font: 'Qwitcher Grypen', cursive;
		--accent-size: 2em;
		--accent-weight: 400;
		--accent-spacing: 0;
		--accent-line-height: 0.7;
	}

	.suite :global(.suite-block) {
		text-align: center;
	}

	.suite :global(.char) {
		color: white;
	}

	@media (min-width: 801px) {
		.suite :global(.suite-block) {
			white-space: nowrap;
		}
	}

	@media (max-width: 800px) {
		.suite-composition {
			font-size: clamp(0.9rem, 3.8vw, 1.3rem);
		}
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

	.home {
		position: relative;
	}

	.scroll-cue {
		position: absolute;
		left: 0;
		right: 0;
		bottom: clamp(1.5rem, 5vh, 3.5rem);
		display: flex;
		justify-content: center;
		pointer-events: none;
	}

	.scroll-cue-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		animation: cue-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) 1.8s both;
	}

	.scroll-cue-label {
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.42em;
		padding-left: 0.42em;
		text-transform: uppercase;
		opacity: 0.8;
	}

	.scroll-cue-track {
		position: relative;
		width: 1px;
		height: 4.5rem;
		overflow: hidden;
		background: rgb(255 255 255 / 0.2);
	}

	.scroll-cue-line {
		position: absolute;
		inset: 0;
		background: white;
		transform-origin: top;
		animation: cue-line 2.2s cubic-bezier(0.76, 0, 0.24, 1) infinite;
	}

	@keyframes cue-in {
		from {
			opacity: 0;
			transform: translateY(1.5rem);
		}
	}

	@keyframes cue-line {
		0% {
			transform: scaleY(0);
			transform-origin: top;
		}
		45% {
			transform: scaleY(1);
			transform-origin: top;
		}
		55% {
			transform: scaleY(1);
			transform-origin: bottom;
		}
		100% {
			transform: scaleY(0);
			transform-origin: bottom;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-cue-inner {
			animation: none;
		}

		.scroll-cue-line {
			animation: none;
			transform: scaleY(0.4);
		}
	}
</style>
