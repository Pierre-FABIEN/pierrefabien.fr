<script lang="ts">
	import gsap from 'gsap';

	let cursorEl: HTMLDivElement | undefined = $state();
	let isHovering = $state(false);
	let enabled = $state(false);

	$effect(() => {
		if (!cursorEl) return;

		const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (isCoarsePointer || prefersReducedMotion) {
			return;
		}

		enabled = true;

		const xTo = gsap.quickTo(cursorEl, 'x', { duration: 0.15, ease: 'power3.out' });
		const yTo = gsap.quickTo(cursorEl, 'y', { duration: 0.15, ease: 'power3.out' });

		function handleMouseMove(event: MouseEvent) {
			xTo(event.clientX);
			yTo(event.clientY);
		}

		function handleMouseOver(event: MouseEvent) {
			isHovering = Boolean((event.target as HTMLElement)?.closest?.('[data-cursor-hover]'));
		}

		function handleMouseOut(event: MouseEvent) {
			const related = event.relatedTarget as HTMLElement | null;
			if (!related?.closest?.('[data-cursor-hover]')) {
				isHovering = false;
			}
		}

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseover', handleMouseOver);
		window.addEventListener('mouseout', handleMouseOut);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseover', handleMouseOver);
			window.removeEventListener('mouseout', handleMouseOut);
		};
	});
</script>

<div
	bind:this={cursorEl}
	class="custom-cursor"
	class:visible={enabled}
	class:is-hovering={isHovering}
	aria-hidden="true"
></div>

<style>
	.custom-cursor {
		position: fixed;
		top: 0;
		left: 0;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: hsl(var(--primary));
		pointer-events: none;
		z-index: 9999;
		transform: translate(-50%, -50%);
		mix-blend-mode: difference;
		opacity: 0;
		transition:
			width 0.2s ease,
			height 0.2s ease,
			opacity 0.2s ease;
	}

	.custom-cursor.visible {
		opacity: 1;
	}

	.custom-cursor.is-hovering {
		width: 3rem;
		height: 3rem;
	}
</style>
