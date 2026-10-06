<script lang="ts">
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import { PortfolioMenuData } from './data';
	import { firstLoadComplete } from '$lib/store/initialLoaderStore';
	import { scrollToSection } from './stores/portfolioStores';
	import FullScreen from './FullScreen.svelte';
	import MenuIcon from './svg/MenuIcon.svelte';

	let bar: HTMLElement;
	let panel: HTMLElement;
	let contentMenu: HTMLElement;
	let isMenuExpanded = $state(false);
	let portfolioItems: HTMLElement[] = [];

	onMount(() => {
		portfolioItems = Array.from(panel.querySelectorAll<HTMLElement>('article'));
		gsap.set(portfolioItems, { duration: 0.2, stagger: 0.04, opacity: 0, y: '20px' });

		let unsubscribe: (() => void) | undefined;
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(bar, { yPercent: 100, autoAlpha: 0 });
			unsubscribe = firstLoadComplete.subscribe((complete) => {
				if (!complete) return;
				gsap.to(bar, {
					yPercent: 0,
					autoAlpha: 1,
					duration: 0.9,
					delay: 0.3,
					ease: 'power3.out',
					clearProps: 'transform,opacity,visibility'
				});
				queueMicrotask(() => unsubscribe?.());
			});
		}

		return () => {
			unsubscribe?.();
			gsap.killTweensOf([bar, panel, contentMenu, ...portfolioItems]);
		};
	});

	const handleMenu = () => {
		isMenuExpanded = !isMenuExpanded;

		if (isMenuExpanded) {
			gsap.to(panel, { height: '100%', duration: 0.25 });
			gsap.to(panel.querySelectorAll('svg polyline'), { rotateX: 180 });
			gsap.to(portfolioItems, {
				stagger: 0.04,
				delay: 0.2,
				duration: 0.2,
				opacity: 1,
				y: '0px'
			});
			gsap.to(contentMenu, { display: 'flex', opacity: 1, visibility: 'visible' });
		} else {
			gsap.to(panel, { height: '60px', duration: 0.25, delay: 0.2 });
			gsap.to(portfolioItems, { duration: 0.2, stagger: 0.04, opacity: 0, y: '20px' });
			gsap.to(contentMenu, { display: 'none', opacity: 0, visibility: 'hidden' });
		}
	};

	function scrollTo(section: string) {
		handleMenu();
		scrollToSection(section, -150, 1000);
	}

	function onKeydown(event: KeyboardEvent, action: () => void) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			action();
		}
	}
</script>

<header bind:this={bar} data-leave-down>
	<div bind:this={panel} class="header-container">
		<div
			bind:this={contentMenu}
			class="menu-container"
			onwheel={(event) => event.stopPropagation()}
			ontouchstart={(event) => event.stopPropagation()}
			ontouchmove={(event) => event.stopPropagation()}
		>
			<div class="portfolio-menu">
				{#each PortfolioMenuData as { id, title, content, position } (id)}
					<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
					<article
						class={`${position}`}
						onclick={() => scrollTo(id)}
						onkeydown={(event) => onKeydown(event, () => scrollTo(id))}
						role="button"
						tabindex={isMenuExpanded ? 0 : -1}
					>
						<h2>
							{#if title.length > 0}
								<span class="portfolio-menu-c">{title.charAt(0)}</span>
							{/if}
							{#if title.length > 1}
								<span class="portfolio-menu-next">{title.charAt(1)}</span>
							{/if}
							{title.substring(2)}
						</h2>
						<h4>
							{content}
						</h4>
					</article>
				{/each}
			</div>
		</div>

		<h1 class="header-branding">
			<span><b>Pierre</b> FABIEN</span>
		</h1>

		<div
			class={isMenuExpanded ? 'active linkMenu' : 'inactive linkMenu'}
			onclick={handleMenu}
			onkeydown={(event) => onKeydown(event, handleMenu)}
			role="button"
			tabindex="0"
			aria-expanded={isMenuExpanded}
			aria-label="Menu du portfolio"
		>
			<MenuIcon />
		</div>

		<div class="left-side">
			<FullScreen />
		</div>
	</div>
</header>
