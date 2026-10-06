export const PortfolioMenuData = [
	{
		id: 'profil',
		title: 'Profil',
		position: 'a',
		content: 'Découvrez les informations générales sur mon profil.'
	},
	{
		id: 'experiences',
		title: 'Expérience',
		position: 'b',
		content:
			"Explorez mon parcours professionnel et les rôles clés que j'ai occupés au fil des ans."
	},
	{
		id: 'formations',
		title: 'Formation',
		position: 'c',
		content:
			'Un aperçu de mon parcours académique et des formations en ligne qui ont enrichi mes compétences.'
	},
	{
		id: 'competences',
		title: 'Compétences',
		position: 'd',
		content:
			'Découvrez les compétences techniques et interpersonnelles qui me définissent en tant que professionnel.'
	},
	{
		id: 'book',
		title: 'Book',
		position: 'e',
		content:
			'Feuilletez une sélection de mes travaux qui illustrent mon expertise et mon approche créative.'
	}
];

export const DesignData = [
	{
		id: 'a',
		title: 'Profil',
		paragraphs: []
	},
	{
		id: 'b',
		title: 'Librairies',
		paragraphs: [
			'<b>Front-end :</b>',
			'React & Next.js',
			'Svelte & SvelteKit',

			'<b>Animation :</b>',
			'GSAP',
			'ThreeJS',

			'<b>Backend :</b>',
			'GraphQL & API REST',
			'Node.js',
			'PostgreSQL & MongoDB'
		]
	},
	{
		id: 'c',
		title: 'Le chemin vers le front-end et fullstack:',
		paragraphs: [
			`Depuis mes débuts dans la <b>création multimédia</b> en 2010, j'ai entrepris un voyage continu vers l'innovation, explorant les intersections entre la technologie et la <b>créativité</b>. Initialement fasciné par des outils comme <b>Photoshop</b>, <b>Illustrator</b> et <b>After Effects</b>, j'ai rapidement trouvé ma voie dans le développement web. De <b>WordPress</b> à <b>Symfony</b>, suivi de <b>React & Next.js</b> et récemment <b>SvelteKit, GraphQL</b> avec <b>Node.js</b>, chaque nouvelle technologie a enrichi mes compétences et nourri ma passion pour la création numérique.`,
			`Cherchant à continuellement élargir mes compétences, j'ai consolidé mon rôle de développeur frontend, j'ai approfondi ma maîtrise de <b>TypeScript</b>, <b>React</b> et <b>GraphQL</b>. J'ai ainsi développé un ensemble de compétences intégrées, essentielles pour créer des solutions web qui anticipent les besoins des utilisateurs plutôt que d'y répondre a posteriori.`,
			`Grâce au développement d'un <b>boilerplate créatif</b>, j'ai jeté les bases d'une approche <b>holistique</b> du développement web, combinant expertise <b>frontend</b> et <b>backend</b> pour créer des applications web complètes, <b>performantes et sécurisées</b>.`
		]
	}
];

export const experienceData = [
	{
		date: 'mars 2025 — actuel',
		title: 'Inetum · mission E2E Mode (Airbus)',
		poste: 'Développeur Fullstack',
		items: [
			"Conception et développement d'une plateforme fullstack de gestion du cycle de vie des modifications produit (changes, articles, plannings) pour l'aéronautique, architecturée en microservices GraphQL fédérés. Frontend Next.js/React consommant une Apollo Federation Gateway routant vers 8 microservices Node.js.",
			'TypeScript, React 19, Next.js 16, Redux Toolkit, GraphQL Federation v2, Apollo Client/Server, Node.js, Express, Sequelize, PostgreSQL, Docker, Playwright, Tailwind CSS'
		]
	},
	{
		date: 'sept. 2023 — actuel',
		title: 'Freelance',
		poste: 'Développeur Fullstack',
		items: [
			'Création de plusieurs boilerplates pour des projets personnalisés.',
			'SvelteKit, TypeScript, ThreeJS, GSAP, GraphQL, NodeJs, Vercel, MongoDB, Prisma, Playwright, Docker'
		]
	},
	{
		date: 'juin 2024 — août 2024',
		title: 'Boilerplate SaaS (basse intensité)',
		poste: 'Développeur Fullstack',
		items: [
			'TypeScript, SvelteKit, Shadcn, Tailwind, ThreeJs, GSAP, OAuth, Cloudinary, Zod, Superform, Stripe, Prisma, MongoDB, Vercel, PWA'
		]
	},
	{
		date: 'déc. 2023 — avr. 2024',
		title: 'Boilerplate SaaS (haute intensité)',
		poste: 'Développeur Fullstack intensif',
		items: [
			'Front-end SvelteKit (curseur personnalisé, dark mode, notifications, transitions de page, preloader, PWA, smooth scroll, traduction, ThreeJs). Back-end NodeJs (comptes et rôles, gestion des erreurs, tokens de session, sécurité rate limiter et tokens blacklistés).',
			'TypeScript, SvelteKit, Playwright, Websocket, GraphQL, Docker, MongoDB'
		]
	},
	{
		date: 'mar. 2023 — sept. 2023',
		title: 'Hubeecar',
		poste: 'Web Développeur',
		items: ['TypeScript, ReactJs, GraphQL, MUI']
	},
	{
		date: 'sept. 2022 — fev. 2023',
		title: 'XplicitDrink.com',
		poste: 'Auto-entrepreneur',
		items: [
			'Premier projet 3D visant à personnaliser une cannette.',
			'SvelteKit, ThreeJs, UX, UI, SEO'
		]
	},
	{
		date: 'sept. 2022 — oct. 2022',
		title: 'La Jungle',
		poste: 'Web Intégrateur',
		items: ['HTML, SASS, PHP, JavaScript']
	},
	{
		date: 'fev. 2022',
		title: 'inkorporation.fr',
		poste: 'Web Développeur',
		items: [
			'Site primé : Awwwards 7.39/10, CSS Design Awards (Special Kudos, Best UI, Best UX, Best Innovation), CSS Winner & CSS Nectar Site of the Day, Design Nominees Site of the Day.',
			'Symfony, ReactJs, GSAP'
		]
	},
	{
		date: 'déc. 2020 — mar. 2022',
		title: 'Caplaser',
		poste: 'Web Développeur',
		items: ['Wordpress, Prestashop, Symfony, ReactJs, GSAP']
	},
	{
		date: 'juin 2019 — sept. 2019',
		title: 'Play2Event · Mêlée Numérique',
		poste: 'Auto-entrepreneur',
		items: ['React, styled-components, MeteorJs']
	},
	{
		date: 'mar. 2019',
		title: 'Auto-Entrepreneur',
		poste: 'Développeur Fullstack',
		items: ['Symfony, ReactJs, GSAP, PHP']
	},
	{
		date: 'sept. 2017 — fev. 2019',
		title: 'Amadeus Mobile',
		poste: 'Webdesigner',
		items: ['Wordpress, Prestashop, Symfony 4']
	},
	{
		date: 'sept. 2015 — mai 2016',
		title: 'Reso Pouce',
		poste: 'Webdesigner · Intégrateur · Graphiste',
		items: ['Symfony 3, HTML, CSS, PHP, jQuery']
	}
];

export const formationData = [
	{
		key: 'a',
		headline: 'FormaSup82',
		description: `
		Bac+ 2, Design de pages Web, des ressources numériques / multimédia et d'information Septembre 2016 à 2017.<br><br>
		Web designer, intégrateur, développeur web.<br><br>
		Une promo exceptionnelle ! Nous étions tous soudés pour apprendre les bases du développement web. Nous avons découvert le HTML et le CSS ainsi que Wordpress. Durant cette reconversion, j'ai réalisé un stage chez RezoPouce, avec Olivier Fillol comme maître de stage. Il m'a initié à Twig et m'a expliqué les fondamentaux de PHP avec Symfony. RezoPouce est une association basée à Moissac, qui facilite la mise en relation dans le domaine rural pour le covoiturage.
		`
	},
	{
		key: 'b',
		headline: '56',
		description: 'Cours sur Udémy: Sveltekit, React, NextJs, NodeJs, threeJs, MeteorJs, GSAP,...'
	},
	{
		key: 'c',
		headline: '2',
		description:
			'Cours sur Awwwards: <br>-Merging WebGL and HTML worlds, <br>-Building an immersive creative website from scratch without frameworks'
	},
	{
		key: 'd',
		headline: 'ThreeJs Journey ',
		description: `Le meilleurs pédagogue pour comprendre la 3D. J'ai nommé Bruno Simon.`
	}
];

export const competencesData = [
	{
		id: 'a',
		title: 'Front-end',
		content: 'TypeScript<br/>React / Next.js<br/>Svelte / SvelteKit<br/>GSAP<br/>ThreeJs',
		imageUrl: '/portfolio/competences/frontend.webp'
	},
	{
		id: 'b',
		title: 'Back-end',
		content:
			'Node.js<br/>Express<br/>GraphQL (Apollo, Federation)<br/>Prisma / Sequelize<br/>PostgreSQL / MongoDB',
		imageUrl: '/portfolio/competences/backend.webp'
	},
	{
		id: 'c',
		title: 'Design',
		content: 'Photoshop<br/>Illustrator<br/>Figma',
		imageUrl: '/portfolio/competences/design.webp'
	},
	{
		id: 'd',
		title: 'Outils',
		content: 'Git / GitHub / GitLab<br/>Docker<br/>Playwright',
		imageUrl: '/portfolio/competences/gestion.webp'
	}
];

export const bookData = [
	{
		id: 'a',
		title: 'Inkorporation.fr',
		subtitle: 'Le premier site présenté aux compétitions de design web.',
		imageUrl: '/portfolio/book/ink.webp'
	},
	{
		id: 'b',
		title: 'XplicitDrink.com',
		subtitle: 'Premier projet 3D : personnalisation d’une cannette en temps réel.',
		imageUrl: '/portfolio/book/xpli.webp'
	},
	{
		id: 'c',
		title: 'Boilerplate SvelteKit / GraphQL / Websocket / MongoDB',
		subtitle: 'Boilerplate pour projets conséquents, front et back dissociés, travail en équipe.',
		imageUrl: ''
	},
	{
		id: 'd',
		title: 'Boilerplate SvelteKit / SaaS / Vercel',
		subtitle: 'Boilerplate économique et scalable pour petits projets client.',
		imageUrl: '/portfolio/book/act.webp'
	}
];
