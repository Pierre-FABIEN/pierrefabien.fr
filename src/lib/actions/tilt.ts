import type { Action } from 'svelte/action';

export type TiltOptions = {
	/** Rotation maximale en degrés. */
	max?: number;
	/** Échelle appliquée au survol. */
	scale?: number;
};

/**
 * `use:tilt` — effet de bascule 3D (perspective + rotateX/rotateY) qui suit
 * la position du curseur sur l'élément, en CSS pur (pas de three.js).
 * Désactivé sur écrans tactiles (`pointer: coarse`) et si
 * `prefers-reduced-motion` est actif.
 */
export const tilt: Action<HTMLElement, TiltOptions | undefined> = (node, options) => {
	const max = options?.max ?? 8;
	const scale = options?.scale ?? 1.02;

	const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (isCoarsePointer || prefersReducedMotion) {
		return {};
	}

	node.style.transformStyle = 'preserve-3d';
	node.style.willChange = 'transform';
	node.style.transition = 'transform 0.2s ease';

	function handleMouseMove(event: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const px = (event.clientX - rect.left) / rect.width;
		const py = (event.clientY - rect.top) / rect.height;
		const rotateX = (0.5 - py) * max * 2;
		const rotateY = (px - 0.5) * max * 2;
		node.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
	}

	function handleMouseLeave() {
		node.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
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
