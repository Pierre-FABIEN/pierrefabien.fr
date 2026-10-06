<script lang="ts">
	type Competence = { id: string; title: string; content: string; imageUrl: string };

	let { competencesData = [] }: { competencesData?: Competence[] } = $props();
</script>

<div class="portfolio-fifth">
	{#each competencesData as { id, title, content, imageUrl } (id)}
		<article class={`portfolio-card ${id}`}>
			{#if imageUrl}
				<img src={imageUrl} alt={title} width="100%" height="100%" loading="lazy" />
			{/if}
			<h3 class="portfolio-card-h3">{title}</h3>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<h4 class="portfolio-card-h4">{@html content}</h4>
		</article>
	{/each}
</div>
