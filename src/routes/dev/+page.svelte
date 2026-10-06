<script lang="ts">
	import '$lib/components/portfolio/styles/portfolio.scss';
	import { onMount } from 'svelte';
	import Header from '$lib/components/portfolio/Header.svelte';
	import Lines from '$lib/components/portfolio/Lines.svelte';
	import LogoContainer from '$lib/components/portfolio/LogoContainer.svelte';
	import Items from '$lib/components/portfolio/Items/Items.svelte';
	import PortfolioSecond from '$lib/components/portfolio/PortfolioSecond.svelte';
	import PortfolioSquare from '$lib/components/portfolio/PortfolioSquare.svelte';
	import PortfolioFifth from '$lib/components/portfolio/PortfolioFifth.svelte';
	import PortfolioFourth from '$lib/components/portfolio/PortfolioFourth.svelte';
	import PortfolioSixth from '$lib/components/portfolio/PortfolioSixth.svelte';
	import PortfolioFooter from '$lib/components/portfolio/PortfolioFooter.svelte';
	import { sectionsStore } from '$lib/components/portfolio/stores/portfolioStores';
	import {
		DesignData,
		bookData,
		competencesData,
		experienceData,
		formationData
	} from '$lib/components/portfolio/data';

	let profilTitle: HTMLElement;
	let experiencesTitle: HTMLElement;
	let formationsTitle: HTMLElement;
	let competencesTitle: HTMLElement;
	let bookTitle: HTMLElement;

	onMount(() => {
		sectionsStore.update((sections) => {
			sections.set('profil', profilTitle);
			sections.set('experiences', experiencesTitle);
			sections.set('formations', formationsTitle);
			sections.set('competences', competencesTitle);
			sections.set('book', bookTitle);
			return sections;
		});

		return () => sectionsStore.set(new Map());
	});

	// L'en-tête est fixe : il doit sortir du contenu transformé par smooth-scrollbar.
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return { destroy: () => node.remove() };
	}
</script>

<svelte:head>
	<title>Pierre FABIEN | Développeur Fullstack & Design</title>
	<meta
		name="description"
		content="Portfolio de Pierre Fabien, développeur fullstack : React, Next.js, SvelteKit, GraphQL, Node.js et design interactif."
	/>
</svelte:head>

<div>
	<div class="portfolio-root" use:portal>
		<Header />
	</div>

	<div class="portfolio-root">
		<div class="home">
			<Lines />

			<LogoContainer />

			<Items />
			<h3 class="title" bind:this={profilTitle}>Profil</h3>
			<PortfolioSecond profilData={DesignData} />

			<h3 class="title" bind:this={experiencesTitle}>Experiences</h3>

			<PortfolioSquare {experienceData} />

			<h3 class="title" bind:this={competencesTitle}>Compétences</h3>
			<PortfolioFifth {competencesData} />

			<h3 class="title" bind:this={formationsTitle}>Formations</h3>
			<h4 class="subtitle">Dans le web on ne s'arrête jamais !</h4>
			<PortfolioFourth {formationData} />

			<h2 class="title axo">Les performances sur ce site ?</h2>
			<img
				class="lighthouse"
				src="/portfolio/LightHouse.webp"
				alt="Analyse Lighthouse le 03/04/2024"
				width="800"
				height="500"
				loading="lazy"
			/>

			<h3 class="title" bind:this={bookTitle}>Book</h3>
			<h4 class="subtitle">Quelques réalisations importantes pour moi</h4>

			<PortfolioSixth {bookData} />

			<PortfolioFooter />
		</div>
	</div>
</div>
