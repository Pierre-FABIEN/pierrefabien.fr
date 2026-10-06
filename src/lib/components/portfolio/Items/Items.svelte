<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { scrollToSection, sectionsStore } from '../stores/portfolioStores';

	import Arrow from './Arrow.svelte';
	import First from './svg/First.svelte';
	import Second from './svg/Second.svelte';
	import Third from './svg/Third.svelte';
	import Fourth from './svg/Fourth.svelte';
	import Design from './icon/Design.svelte';
	import Frontend from './icon/Frontend.svelte';
	import Backend from './icon/Backend.svelte';
	import SoftSkill from './icon/SoftSkill.svelte';

	const entries = [
		{ section: 'profil', label: 'Profil', number: '01', image: 'design.png', Icon: Design },
		{
			section: 'experiences',
			label: 'Expérience',
			number: '02',
			image: 'frontend.png',
			Icon: Frontend
		},
		{
			section: 'competences',
			label: 'Compétences',
			number: '03',
			image: 'backend.png',
			Icon: Backend
		},
		{ section: 'book', label: 'Book', number: '04', image: 'softSkill.png', Icon: SoftSkill }
	];
	const illustrations = [First, Second, Third, Fourth];

	let items = $state<HTMLElement[]>([]);
	let itemsWrapper: HTMLElement;
	let logos = $state<HTMLElement[]>([]);
	let arrows = $state<HTMLElement[]>([]);
	let texts = $state<HTMLElement[]>([]);
	let itemsCadre: HTMLElement;
	let numbers = $state<HTMLElement[]>([]);
	let fullContainer: HTMLElement;

	let animatedSVG = $state([false, false, false, false]);
	let timeouts: ReturnType<typeof setTimeout>[] = [];

	const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		sectionsStore.update((sections) => sections.set('fullContainer', fullContainer));

		let trigger: ScrollTrigger | undefined;
		let frame = requestAnimationFrame(() => {
			timeouts.push(
				setTimeout(() => {
					trigger = ScrollTrigger.create({
						trigger: fullContainer,
						start: 'top 100%',
						end: 'bottom -100%',
						onEnter: () => animationItems(),
						onLeave: () => resetItems(),
						onEnterBack: () => animationItems(),
						onLeaveBack: () => resetItems()
					});
				}, 100)
			);
		});

		return () => {
			cancelAnimationFrame(frame);
			timeouts.forEach(clearTimeout);
			trigger?.kill();
			gsap.killTweensOf([itemsWrapper, ...items, ...logos, ...arrows, ...texts, ...numbers]);
		};
	});

	const resetItems = () => {
		items.forEach((item) => item?.classList.remove('animated'));
		itemsCadre?.classList.remove('animated');
	};

	const animationItems = () => {
		const delays = [150, 0, 0, 150];

		if (reducedMotion()) {
			items.forEach((item) => item.classList.add('animated'));
			itemsCadre.classList.add('animated');
			return;
		}

		gsap.fromTo(
			itemsWrapper,
			{ y: 100 },
			{ y: 0, duration: 0.5, delay: Math.min(...delays) / 1000 }
		);

		items.forEach((item, index) => {
			gsap.fromTo(item, { y: 100 }, { y: 0, duration: 0.5, delay: delays[index] / 1000 });

			timeouts.push(setTimeout(() => item.classList.add('animated'), delays[index]));
			timeouts.push(setTimeout(() => itemsCadre.classList.add('animated'), delays[index]));
		});

		logos.forEach((logo, index) => {
			gsap.fromTo(logo, { y: -50 }, { y: 0, duration: 1, delay: delays[index] / 1000 + 0.2 });
		});

		arrows.forEach((arrow, index) => {
			gsap.fromTo(arrow, { y: -50 }, { y: 0, duration: 1, delay: delays[index] / 1000 });
		});

		texts.forEach((text, index) => {
			gsap.fromTo(text, { y: 50 }, { y: 0, duration: 1, delay: delays[index] / 1000 });
		});

		numbers.forEach((number, index) => {
			gsap.fromTo(number, { y: 50 }, { y: 0, duration: 1, delay: delays[index] / 1000 });
		});
	};

	function openSection(section: string) {
		scrollToSection(section, -70, 500);
	}
</script>

<div class="itemsContainer" id="itemsContainer" bind:this={fullContainer}>
	<div class="itemsCadre" bind:this={itemsCadre}>
		{#each illustrations as Illustration, index (index)}
			<div class="itemsCadreContainer"><Illustration animated={animatedSVG[index]} /></div>
		{/each}
	</div>

	<div class="itemsWrapper">
		<div class="itemsWrapperFlex" bind:this={itemsWrapper}>
			{#each entries as { section, label, number, image, Icon }, index (section)}
				<div
					class="item"
					bind:this={items[index]}
					onmouseenter={() => (animatedSVG[index] = true)}
					onmouseleave={() => (animatedSVG[index] = false)}
					onclick={() => openSection(section)}
					onkeydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault();
							openSection(section);
						}
					}}
					role="button"
					tabindex="0"
					aria-label={label}
				>
					<div class="background-overlay"></div>
					<div class="content">
						<div class="imageContainer">
							<img class="image" src={`/portfolio/items/${image}`} alt="" loading="lazy" />
						</div>

						<div class="arrowContainer">
							<span bind:this={arrows[index]}>
								<Arrow />
							</span>
						</div>
						<div class="logoContainer" bind:this={logos[index]}>
							<Icon />
						</div>
						<span>.</span>
						<div class="textWrapper">
							<h1>
								<span bind:this={texts[index]}> {label} </span>
							</h1>
							<div class="numberContainer">
								<p class="number" bind:this={numbers[index]}>{number}</p>
							</div>
						</div>
						<div class="contentBand"></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
