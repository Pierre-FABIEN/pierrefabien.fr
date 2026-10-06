<script lang="ts">
	let { profilData = [] }: { profilData?: { id: string; title: string; paragraphs: string[] }[] } =
		$props();
</script>

<div class="portfolio-second">
	{#each profilData as { id, title, paragraphs } (id)}
		<article class={`${id}`}>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<h2>{@html title}</h2>
			<div class="portfolio-second-container">
				{#each paragraphs as paragraph, index (index)}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<p>{@html paragraph}</p>
				{/each}
			</div>
		</article>
	{/each}
</div>
