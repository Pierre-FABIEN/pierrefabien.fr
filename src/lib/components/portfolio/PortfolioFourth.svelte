<script lang="ts">
	let {
		formationData = []
	}: { formationData?: { key: string; headline: string; description: string }[] } = $props();
</script>

<div class="portfolio-fourth">
	{#each formationData as { key, headline, description } (key)}
		<article class={`${key}`}>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<h2>{@html headline}</h2>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<p>{@html description}</p>
		</article>
	{/each}
</div>
