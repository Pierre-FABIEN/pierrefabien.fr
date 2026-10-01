<script lang="ts">
	import { tick } from 'svelte';
	import * as Card from '$shadcn/card';
	import { Badge } from '$shadcn/badge';
	import { Separator } from '$shadcn/separator';
	import { cn } from '$components/shadcn/utils';
	import Marquee from '$components/Marquee.svelte';
	import { magnetic } from '$lib/actions/magnetic';
	import { tilt } from '$lib/actions/tilt';
	import CustomCursor from '$components/CustomCursor.svelte';

	type Experience = {
		period: string;
		company: string;
		role: string;
		description?: string;
		stack: string[];
		highlight?: boolean;
	};

	const experiences: Experience[] = [
		{
			period: 'mars 2025 — actuel',
			company: 'Inetum · mission E2E Mode (Airbus)',
			role: 'Développeur Fullstack',
			description:
				"Conception et développement d'une plateforme fullstack de gestion du cycle de vie des modifications produit (changes, articles, plannings) pour l'aéronautique, architecturée en microservices GraphQL fédérés. Frontend Next.js/React consommant une Apollo Federation Gateway routant vers 8 microservices Node.js.",
			stack: [
				'TypeScript',
				'React 19',
				'Next.js 16',
				'Redux Toolkit',
				'GraphQL Federation v2',
				'Apollo Client/Server',
				'Node.js',
				'Express',
				'Sequelize',
				'PostgreSQL',
				'Docker',
				'Playwright',
				'Tailwind CSS'
			],
			highlight: true
		},
		{
			period: 'sept. 2023 — actuel',
			company: 'Freelance',
			role: 'Développeur Fullstack',
			description: 'Création de plusieurs boilerplates pour des projets personnalisés.',
			stack: [
				'SvelteKit',
				'TypeScript',
				'ThreeJS',
				'GSAP',
				'GraphQL',
				'NodeJs',
				'Vercel',
				'MongoDB',
				'Prisma',
				'Playwright',
				'Docker'
			]
		},
		{
			period: 'juin 2024 — août 2024',
			company: 'Boilerplate SaaS (basse intensité)',
			role: 'Développeur Fullstack',
			stack: [
				'TypeScript',
				'SvelteKit',
				'Shadcn',
				'Tailwind',
				'ThreeJs',
				'GSAP',
				'OAuth',
				'Cloudinary',
				'Zod',
				'Superform',
				'Stripe',
				'Prisma',
				'MongoDB',
				'Vercel',
				'PWA'
			]
		},
		{
			period: 'déc. 2023 — avr. 2024',
			company: 'Boilerplate SaaS (haute intensité)',
			role: 'Développeur Fullstack intensif',
			description:
				'Front-end SvelteKit (curseur personnalisé, dark mode, notifications, transitions de page, preloader, PWA, smooth scroll, traduction, ThreeJs). Back-end NodeJs (comptes et rôles, gestion des erreurs, tokens de session, sécurité rate limiter et tokens blacklistés).',
			stack: ['TypeScript', 'SvelteKit', 'Playwright', 'Websocket', 'GraphQL', 'Docker', 'MongoDB']
		},
		{
			period: 'mar. 2023 — sept. 2023',
			company: 'Hubeecar',
			role: 'Web Développeur',
			stack: ['TypeScript', 'ReactJs', 'GraphQL', 'MUI']
		},
		{
			period: 'sept. 2022 — fev. 2023',
			company: 'XplicitDrink.com',
			role: 'Auto-entrepreneur',
			description: 'Premier projet 3D visant à personnaliser une cannette.',
			stack: ['SvelteKit', 'ThreeJs', 'UX', 'UI', 'SEO']
		},
		{
			period: 'sept. 2022 — oct. 2022',
			company: 'La Jungle',
			role: 'Web Intégrateur',
			stack: ['HTML', 'SASS', 'PHP', 'JavaScript']
		},
		{
			period: 'fev. 2022',
			company: 'inkorporation.fr',
			role: 'Web Développeur',
			description:
				'Site primé : Awwwards 7.39/10, CSS Design Awards (Special Kudos, Best UI, Best UX, Best Innovation), CSS Winner & CSS Nectar Site of the Day, Design Nominees Site of the Day.',
			stack: ['Symfony', 'ReactJs', 'GSAP']
		},
		{
			period: 'déc. 2020 — mar. 2022',
			company: 'Caplaser',
			role: 'Web Développeur',
			stack: ['Wordpress', 'Prestashop', 'Symfony', 'ReactJs', 'GSAP']
		},
		{
			period: 'juin 2019 — sept. 2019',
			company: 'Play2Event · Mêlée Numérique',
			role: 'Auto-entrepreneur',
			stack: ['React', 'styled-components', 'MeteorJs']
		},
		{
			period: 'mar. 2019',
			company: 'Auto-Entrepreneur',
			role: 'Développeur Fullstack',
			stack: ['Symfony', 'ReactJs', 'GSAP', 'PHP']
		},
		{
			period: 'sept. 2017 — fev. 2019',
			company: 'Amadeus Mobile',
			role: 'Webdesigner',
			stack: ['Wordpress', 'Prestashop', 'Symfony 4']
		},
		{
			period: 'sept. 2015 — mai 2016',
			company: 'Reso Pouce',
			role: 'Webdesigner · Intégrateur · Graphiste',
			stack: ['Symfony 3', 'HTML', 'CSS', 'PHP', 'jQuery']
		}
	];

	const skills = {
		'Front-end': ['TypeScript', 'React / Next.js', 'Svelte / SvelteKit', 'GSAP', 'ThreeJs'],
		'Back-end': [
			'Node.js',
			'Express',
			'GraphQL (Apollo, Federation)',
			'Prisma / Sequelize',
			'PostgreSQL / MongoDB'
		],
		Design: ['Photoshop', 'Illustrator', 'Figma'],
		Outils: ['Git / GitHub / GitLab', 'Docker', 'Playwright']
	};

	const projects = [
		{
			name: 'Inkorporation.fr',
			description: 'Le premier site présenté aux compétitions de design web.'
		},
		{
			name: 'XplicitDrink.com',
			description: 'Premier projet 3D : personnalisation d’une cannette en temps réel.'
		},
		{
			name: 'Boilerplate SvelteKit / GraphQL / Websocket / MongoDB',
			description:
				'Boilerplate pour projets conséquents, front et back dissociés, travail en équipe.'
		},
		{
			name: 'Boilerplate SvelteKit / SaaS / Vercel',
			description: 'Boilerplate économique et scalable pour petits projets client.'
		}
	];

	// Base brutaliste commune aux cartes shadcn : coins francs, bordure marquée,
	// fond quasi-transparent — en classes Tailwind pour que twMerge écrase
	// proprement les classes par défaut de Card.Root (rounded-lg/border/bg-card/shadow-sm).
	const cardBase =
		'rounded-none border-2 border-white/15 bg-white/[0.03] shadow-none transition-colors hover:border-primary';

	// Liste dédupliquée des technologies (compétences + stacks d'expériences) pour le bandeau défilant.
	const techStack = [
		...new Set([...Object.values(skills).flat(), ...experiences.flatMap((e) => e.stack)])
	];

	$effect(() => {
		let destroyed = false;
		let cleanup: (() => void) | undefined;

		tick().then(async () => {
			const { initDevPageAnimations } = await import('./devPageAnimations');
			if (destroyed) return;
			cleanup = initDevPageAnimations();
		});

		return () => {
			destroyed = true;
			cleanup?.();
		};
	});
</script>

<div class="dev-page">
	<CustomCursor />

	<section class="hero">
		<span class="section-number">00</span>
		<h1 class="display">Pierre<br />Fabien</h1>
		<p class="subtitle">Développeur Web Full-Stack — Design</p>
		<p class="summary">
			Depuis mes débuts dans la création multimédia en 2010, j'ai entrepris un voyage continu vers
			l'innovation, entre technologie et créativité. De WordPress à Symfony, puis React/Next.js et
			SvelteKit avec GraphQL et Node.js, chaque technologie a enrichi mes compétences pour créer des
			solutions web complètes, performantes et sécurisées.
		</p>
		<div class="links">
			<a
				use:magnetic
				data-cursor-hover
				href="https://github.com/Pierre-FABIEN"
				target="_blank"
				rel="noopener noreferrer">GitHub</a
			>
			<a
				use:magnetic
				data-cursor-hover
				href="https://www.linkedin.com/in/pierre-fabien/"
				target="_blank"
				rel="noopener noreferrer">LinkedIn</a
			>
			<a
				use:magnetic
				data-cursor-hover
				href="https://pierre-fabien-cv.vercel.app/"
				target="_blank"
				rel="noopener noreferrer">CV interactif</a
			>
			<a
				use:magnetic
				data-cursor-hover
				href="https://pierre-fabien-cv.vercel.app/CV_Pierre-FABIEN.pdf"
				target="_blank"
				rel="noopener noreferrer">PDF</a
			>
		</div>
	</section>

	<Marquee items={techStack} speed={40} />

	<section class="skills">
		<div class="section-head">
			<span class="section-number">01</span>
			<h2>Compétences</h2>
		</div>
		<div class="skills-grid">
			{#each Object.entries(skills) as [category, items] (category)}
				<div class="tilt-wrapper" use:tilt>
					<Card.Root data-cursor-hover class={cardBase}>
						<Card.Header>
							<Card.Title>{category}</Card.Title>
						</Card.Header>
						<Card.Content class="flex flex-wrap gap-2">
							{#each items as item (item)}
								<Badge variant="secondary">{item}</Badge>
							{/each}
						</Card.Content>
					</Card.Root>
				</div>
			{/each}
		</div>
	</section>

	<section class="experience">
		<div class="section-head">
			<span class="section-number">02</span>
			<h2>Expérience</h2>
		</div>
		<div class="timeline-viewport">
			<div class="timeline">
				{#each experiences as exp (exp.company + exp.period)}
					<div class="tilt-wrapper" use:tilt>
						<Card.Root
							data-cursor-hover
							class={cn(cardBase, 'timeline-card', exp.highlight && 'border-primary bg-primary/10')}
						>
							<Card.Header>
								<Card.Description>{exp.period}</Card.Description>
								<Card.Title>{exp.company}</Card.Title>
								<p class="role">{exp.role}</p>
							</Card.Header>
							<Card.Content>
								{#if exp.description}
									<p class="description">{exp.description}</p>
								{/if}
								<div class="flex flex-wrap gap-2">
									{#each exp.stack as tech (tech)}
										<Badge variant="outline">{tech}</Badge>
									{/each}
								</div>
							</Card.Content>
						</Card.Root>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<Separator class="border-white/15" />

	<section class="projects">
		<div class="section-head">
			<span class="section-number">03</span>
			<h2>Réalisations marquantes</h2>
		</div>
		<div class="projects-grid">
			{#each projects as project (project.name)}
				<div class="tilt-wrapper" use:tilt>
					<Card.Root data-cursor-hover class={cardBase}>
						<Card.Header>
							<Card.Title>{project.name}</Card.Title>
							<Card.Description>{project.description}</Card.Description>
						</Card.Header>
					</Card.Root>
				</div>
			{/each}
		</div>
	</section>

	<section class="formation">
		<div class="section-head">
			<span class="section-number">04</span>
			<h2>Formation</h2>
		</div>
		<ul>
			<li>
				<strong>FormaSup82</strong> — Bac+2 Design de pages Web, ressources numériques et multimédia
				(2016–2017). Stage chez Reso Pouce.
			</li>
			<li><strong>Udemy</strong> — SvelteKit, React, Next.js, Node.js, ThreeJs, MeteorJs, GSAP…</li>
			<li>
				<strong>Awwwards</strong> — Merging WebGL and HTML worlds, Building an immersive creative website
				from scratch without frameworks.
			</li>
			<li><strong>ThreeJs Journey</strong> — Bruno Simon.</li>
		</ul>
	</section>
</div>

<style>
	.dev-page {
		font-family: 'Montserrat Variable', sans-serif;
		color: white;
		padding: 6rem 1.5rem 10rem;
		display: flex;
		flex-direction: column;
		gap: 8rem;
		max-width: 72rem;
		margin: 0 auto;
	}

	@media (hover: hover) and (pointer: fine) {
		.dev-page {
			cursor: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dev-page {
			cursor: auto;
		}
	}

	.section-number {
		display: inline-block;
		font-weight: 700;
		letter-spacing: 0.2em;
		color: hsl(var(--primary));
	}

	.hero {
		position: relative;
		min-height: 70vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.display {
		font-size: clamp(3.5rem, 12vw, 9rem);
		font-weight: 800;
		line-height: 0.9;
		text-transform: uppercase;
		letter-spacing: -0.02em;
		margin-top: 1.5rem;
	}

	.subtitle {
		opacity: 0.8;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		margin-top: 1.5rem;
		font-weight: 600;
	}

	.summary {
		max-width: 36rem;
		margin-top: 2rem;
		line-height: 1.7;
		opacity: 0.75;
		font-size: 1.05rem;
	}

	.links {
		display: flex;
		gap: 1.5rem;
		margin-top: 3rem;
		flex-wrap: wrap;
	}

	.links a {
		padding: 0.75rem 1.5rem;
		border: 2px solid white;
		text-transform: uppercase;
		font-weight: 700;
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	.links a:hover {
		background: hsl(var(--primary));
		border-color: hsl(var(--primary));
		color: black;
	}

	.section-head {
		display: flex;
		align-items: baseline;
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.section-head h2 {
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: -0.01em;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 1.5rem;
	}

	.tilt-wrapper {
		height: 100%;
	}

	.tilt-wrapper :global(> div) {
		height: 100%;
	}

	.timeline {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* État enrichi par devPageAnimations.ts (JS uniquement, pin + défilement
	   horizontal) — sans JS ou avec prefers-reduced-motion, le fallback
	   ci-dessus (colonne verticale) reste affiché. La classe .is-pinned est
	   ajoutée dynamiquement en JS, d'où le :global() nécessaire ici. */
	:global(.timeline-viewport.is-pinned) {
		display: flex;
		align-items: center;
		height: 100vh;
		overflow: hidden;
	}

	:global(.timeline-viewport.is-pinned) .timeline {
		flex-direction: row;
	}

	:global(.timeline-viewport.is-pinned) .tilt-wrapper {
		flex-shrink: 0;
		width: min(85vw, 24rem);
	}

	.role {
		opacity: 0.8;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.description {
		margin-bottom: 0.75rem;
		opacity: 0.85;
		line-height: 1.5;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 1.5rem;
	}

	.formation ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		opacity: 0.9;
		line-height: 1.6;
		font-size: 1.05rem;
	}

	.formation li {
		border-left: 2px solid hsl(var(--primary));
		padding-left: 1.5rem;
	}
</style>
