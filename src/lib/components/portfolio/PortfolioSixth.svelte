<script lang="ts">
	type Book = { id: string; title: string; subtitle: string; imageUrl: string };

	let { bookData = [] }: { bookData?: Book[] } = $props();
</script>

<div class="portfolio-sixth">
	{#each bookData as { id, title, subtitle, imageUrl } (id)}
		<article class={`${id}`}>
			{#if imageUrl}
				<img src={imageUrl} alt={title} width="100%" height="100%" loading="lazy" />
			{/if}
			<h2>{title}</h2>
			<h3>{subtitle}</h3>
		</article>
	{/each}
</div>
