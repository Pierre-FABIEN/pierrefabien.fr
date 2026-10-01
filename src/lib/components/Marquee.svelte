<script lang="ts">
	let { items, speed = 30 }: { items: string[]; speed?: number } = $props();
</script>

<div class="marquee" style={`--marquee-duration: ${speed}s`}>
	<div class="marquee-track">
		{#each [0, 1] as dup (dup)}
			<ul class="marquee-list" aria-hidden={dup === 1}>
				{#each items as item (item + dup)}
					<li>{item}</li>
				{/each}
			</ul>
		{/each}
	</div>
</div>

<style>
	.marquee {
		overflow: hidden;
		border-top: 2px solid rgba(255, 255, 255, 0.15);
		border-bottom: 2px solid rgba(255, 255, 255, 0.15);
		padding: 1.25rem 0;
	}

	.marquee-track {
		display: flex;
		width: max-content;
		animation: marquee-scroll var(--marquee-duration, 30s) linear infinite;
	}

	.marquee-list {
		display: flex;
		gap: 3rem;
		padding: 0 1.5rem;
		margin: 0;
		list-style: none;
		white-space: nowrap;
	}

	.marquee-list li {
		font-size: 1.25rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		opacity: 0.6;
		color: white;
	}

	@keyframes marquee-scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
		}
	}
</style>
