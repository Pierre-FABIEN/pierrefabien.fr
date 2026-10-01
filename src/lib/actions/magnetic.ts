import gsap from 'gsap';
import type { Action } from 'svelte/action';

export type MagneticOptions = {
	/** Fraction of the cursor offset applied to the element's translation. */
	strength?: number;
};

/**
 * `use:magnetic` — attire légèrement l'élément vers le curseur au survol
 * (effet "bouton magnétique"), via gsap.quickTo. Désactivé sur écrans
 * tactiles (`pointer: coarse`) et si `prefers-reduced-motion` est actif.
 */
export const magnetic: Action<HTMLElement, MagneticOptions | undefined> = (node, options) => {
	const strength = options?.strength ?? 0.4;

	const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (isCoarsePointer || prefersReducedMotion) {
		return {};
	}

	const xTo = gsap.quickTo(node, 'x', { duration: 0.4, ease: 'power3.out' });
	const yTo = gsap.quickTo(node, 'y', { duration: 0.4, ease: 'power3.out' });

	function handleMouseMove(event: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const relX = event.clientX - (rect.left + rect.width / 2);
		const relY = event.clientY - (rect.top + rect.height / 2);
		xTo(relX * strength);
		yTo(relY * strength);
	}

	function handleMouseLeave() {
		xTo(0);
		yTo(0);
	}

	node.addEventListener('mousemove', handleMouseMove);
	node.addEventListener('mouseleave', handleMouseLeave);

	return {
		destroy() {
			node.removeEventListener('mousemove', handleMouseMove);
			node.removeEventListener('mouseleave', handleMouseLeave);
		}
	};
};
