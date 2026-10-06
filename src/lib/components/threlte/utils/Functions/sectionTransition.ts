// Anime la caméra vers une section avant la navigation vers /dev ou /music :
// uniquement la cible (orbit target) bouge, jamais la position de la caméra,
// pour obtenir une pure rotation vers le haut (pas de déplacement). La
// résolution de la Promise permet d'attendre la fin avant d'appeler goto().
import gsap from 'gsap';
import * as THREE from 'three';
import { get } from 'svelte/store';
import { tick } from 'svelte';
import { goto } from '$app/navigation';
import SmoothScrollBarStore from '$lib/store/SmoothScrollBarStore';
import {
	desiredTarget,
	activeSection,
	homeSceneVisible
} from '$lib/store/ThreeStore/animationStores';

export type Section = 'home' | 'dev' | 'music';

export const sectionTarget: Record<Section, THREE.Vector3> = {
	home: new THREE.Vector3(0, 2, 0),
	dev: new THREE.Vector3(3, 9, -7),
	music: new THREE.Vector3(3, 9, 7)
};

export function animateCameraToSection(section: Section): Promise<void> {
	const target = sectionTarget[section];
	const startTarget = get(desiredTarget);

	const proxy = { tx: startTarget.x, ty: startTarget.y, tz: startTarget.z };

	return new Promise((resolve) => {
		gsap.to(proxy, {
			tx: target.x,
			ty: target.y,
			tz: target.z,
			duration: 1.2,
			ease: 'power2.inOut',
			onUpdate: () => {
				desiredTarget.set(new THREE.Vector3(proxy.tx, proxy.ty, proxy.tz));
			},
			onComplete: () => resolve()
		});
	});
}

// Même rotation de caméra que les hotspots de la home, mais réutilisable depuis
// n'importe quelle route (ex: nav persistante) pour naviguer entre home/dev/music.
let navigationInProgress = false;

export async function navigateToSection(section: Section, href: string): Promise<void> {
	if (navigationInProgress) return;
	navigationInProgress = true;
	const content = document.querySelector<HTMLElement>('[data-route-content]');
	try {
		if (get(activeSection) === 'home') {
			const { smoothScroll } = get(SmoothScrollBarStore);
			if (smoothScroll && smoothScroll.offset.y > 0) {
				smoothScroll.setMomentum(0, 0);
				await new Promise<void>((resolve) => {
					smoothScroll.scrollTo(0, 0, 600, { callback: () => resolve() });
				});
				await tick();
			}
		}
		if (content && get(activeSection) !== 'home') {
			await new Promise<void>((resolve) => {
				gsap.to(content, {
					opacity: 0,
					duration: 0.3,
					ease: 'power2.out',
					onComplete: resolve
				});
			});
		}
		if (section !== 'home') {
			activeSection.set(section);
		} else {
			homeSceneVisible.set(true);
		}
		await animateCameraToSection(section);
		homeSceneVisible.set(section === 'home');
		if (section === 'home') {
			activeSection.set('home');
		}
		await goto(href);
	} finally {
		if (content) gsap.set(content, { clearProps: 'opacity' });
		navigationInProgress = false;
	}
}
