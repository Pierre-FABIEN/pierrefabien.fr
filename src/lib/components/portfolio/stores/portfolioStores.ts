import { derived, get, writable } from 'svelte/store';
import SmoothScrollBarStore from '$lib/store/SmoothScrollBarStore';

export const sectionsStore = writable(new Map<string, HTMLElement>());

export const smoothScrollStore = derived(SmoothScrollBarStore, (state) => state.smoothScroll);

export function scrollToSection(section: string, offset: number, duration: number) {
	const element = get(sectionsStore).get(section);
	const scroll = get(smoothScrollStore);
	if (!element || !scroll) return;

	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	scroll.setMomentum(0, 0);
	scroll.scrollTo(0, Math.max(0, element.offsetTop + offset), reducedMotion ? 0 : duration);
}
