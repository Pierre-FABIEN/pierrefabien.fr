// Logique ScrollTrigger de la page /dev, isolée dans son propre module pour
// permettre un import dynamique depuis +page.svelte (gsap n'est alors pas
// ajouté au bundle initial, chargé seulement une fois le DOM monté).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initDevPageAnimations(): () => void {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion) {
		// Pas d'animation d'entrée ni de pin horizontal : le contenu reste
		// visible et dans son flux vertical naturel (fallback CSS).
		return () => {};
	}

	const triggers: ScrollTrigger[] = [];

	// Scroll-reveal des titres de section et des cartes.
	const revealTargets = gsap.utils.toArray<HTMLElement>(
		'.section-head, .tilt-wrapper, .formation li'
	);

	revealTargets.forEach((target) => {
		gsap.set(target, { opacity: 0, y: 40 });
		triggers.push(
			ScrollTrigger.create({
				trigger: target,
				start: 'top 85%',
				onEnter: () => gsap.to(target, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
				onEnterBack: () => gsap.to(target, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
			})
		);
	});

	// Expérience : défilement horizontal pinné de la timeline.
	const viewport = document.querySelector<HTMLElement>('.timeline-viewport');
	const track = document.querySelector<HTMLElement>('.timeline');

	if (viewport && track) {
		viewport.classList.add('is-pinned');

		const getScrollDistance = () => Math.max(track.scrollWidth - viewport.clientWidth, 0);

		const timelineTween = gsap.to(track, {
			x: () => -getScrollDistance(),
			ease: 'none'
		});

		triggers.push(
			ScrollTrigger.create({
				trigger: viewport,
				start: 'top top',
				end: () => `+=${getScrollDistance()}`,
				pin: true,
				scrub: 1,
				animation: timelineTween,
				invalidateOnRefresh: true
			})
		);
	}

	return () => {
		triggers.forEach((trigger) => trigger.kill());
		if (track) {
			gsap.killTweensOf(track);
		}
		if (viewport) {
			viewport.classList.remove('is-pinned');
		}
	};
}
