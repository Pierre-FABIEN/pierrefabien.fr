<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { Section } from '$lib/components/threlte/utils/Functions/sectionTransition';

	const links: { href: string; label: string; section: Section }[] = [
		{ href: '/dev', label: 'Dev', section: 'dev' },
		{ href: '/', label: 'Accueil', section: 'home' },
		{ href: '/music', label: 'Music', section: 'music' }
	];

	function isActive(href: string) {
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}

	// Même rotation de caméra que les hotspots de la home (import dynamique : sectionTransition
	// tire gsap/three, à garder hors du bundle eager de +layout.svelte).
	async function handleClick(event: MouseEvent, href: string, section: Section) {
		if (isActive(href)) return;
		event.preventDefault();
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			goto(href);
			return;
		}
		const { navigateToSection } = await import(
			'$lib/components/threlte/utils/Functions/sectionTransition'
		);
		await navigateToSection(section, href);
	}
</script>

<nav class="site-nav" aria-label="Navigation principale">
	<ul>
		{#each links as link (link.href)}
			<li>
				<a
					href={link.href}
					aria-current={isActive(link.href) ? 'page' : undefined}
					onclick={(e) => handleClick(e, link.href, link.section)}
				>
					{link.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.site-nav {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		width: 100%;
		display: flex;
		justify-content: center;
		padding: 1rem;
		pointer-events: none;
	}

	ul {
		display: flex;
		gap: 1.5rem;
		list-style: none;
		margin: 0;
		padding: 0.5rem 1.25rem;
		border: 1px solid rgb(255 255 255 / 0.2);
		border-radius: 9999px;
		background: rgb(0 0 0 / 0.6);
		backdrop-filter: blur(8px);
		pointer-events: auto;
	}

	a {
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: rgb(255 255 255 / 0.7);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	a:hover {
		color: hsl(var(--primary));
	}

	a[aria-current='page'] {
		color: hsl(var(--primary));
	}

	a:focus-visible {
		outline: 2px solid hsl(var(--primary));
		outline-offset: 4px;
		border-radius: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		a {
			transition: none;
		}
	}
</style>
