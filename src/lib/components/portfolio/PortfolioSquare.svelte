<script lang="ts">
	type Experience = { date: string; title: string; poste: string; items: string[] };

	let { experienceData = [] }: { experienceData?: Experience[] } = $props();
</script>

<div class="portfolio-square">
	{#each experienceData as { title, poste, date, items } (title + date)}
		<div class="portfolio-square-container">
			<div class="portfolio-square-container-top">
				<h2>{date}</h2>
				<h3>{title}</h3>
				<h4>{poste}</h4>
			</div>

			<ul>
				{#each items as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
