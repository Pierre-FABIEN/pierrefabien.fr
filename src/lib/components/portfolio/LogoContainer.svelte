<script lang="ts">
	import { scrollToSection } from './stores/portfolioStores';

	import Git from './svg/Git.svelte';
	import Linkedin from './svg/Linkedin.svelte';
	import PDF from './svg/PDF.svelte';
	import Arrow from './svg/Arrow.svelte';

	const buttonText = 'Découvrez mon Curriculum vitæ ! XD';

	const social = [
		{ component: Git, title: 'Github', link: 'https://github.com/Pierre-FABIEN' },
		{
			component: Linkedin,
			title: 'Linkedin',
			link: 'https://www.linkedin.com/in/pierre-fabien/'
		},
		{
			component: PDF,
			title: 'PDF',
			link: 'https://pierre-fabien-cv.vercel.app/CV_Pierre-FABIEN.pdf'
		}
	];
</script>

<div class="logo-container">
	<ul>
		{#each social as { component: IconComponent, title, link } (title)}
			<li>
				<IconComponent />

				<a href={link} target="_blank" rel="noopener noreferrer">{title}</a>
				<span>{title}</span>
			</li>
		{/each}
	</ul>
	<img class="visage" src="/portfolio/visage.webp" alt="" fetchpriority="high" />
	<h1 class="branding">
		<span><span>Pierre</span> FABIEN</span><br />
		<span>web développeur</span><br />
		<span>Full-stack - design</span>
	</h1>
	<button class="button-circle" onclick={() => scrollToSection('fullContainer', 70, 500)}>
		<Arrow />
		<div class="circle-container">
			<div class="circle-text">
				{#each buttonText.split('') as char, index (index)}
					<span>{char}</span>
				{/each}
			</div>
		</div>
	</button>
</div>
