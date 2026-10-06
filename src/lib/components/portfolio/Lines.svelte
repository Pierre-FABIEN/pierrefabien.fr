<script lang="ts">
	import { smoothScrollStore } from './stores/portfolioStores';

	let lines = $state<HTMLElement[]>([]);

	function updateElementsPosition(scrollY: number) {
		const distance = (scrollY - 30000) / 10;
		lines.forEach((element) => {
			if (element) {
				element.style.transform = `translateX(${distance}px)`;
				element.style.setProperty('--after', `${distance}px`);
				element.style.setProperty('--before', `${distance * 2}px`);
			}
		});
	}

	$effect(() => {
		const scroll = $smoothScrollStore;
		updateElementsPosition(scroll?.offset.y ?? 0);
		if (!scroll) return;

		const listener = (status: { offset: { y: number } }) => updateElementsPosition(status.offset.y);
		scroll.addListener(listener);
		return () => scroll.removeListener(listener);
	});
</script>

<div class="containerLines">
	<div class="background">
		{#each [0, 1, 2, 3] as index (index)}
			<picture bind:this={lines[index]} class="line"></picture>
		{/each}
	</div>
</div>
