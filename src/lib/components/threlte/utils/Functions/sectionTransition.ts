// Anime la caméra vers une section avant la navigation vers /dev ou /music :
// uniquement la cible (orbit target) bouge, jamais la position de la caméra,
// pour obtenir une pure rotation vers le haut (pas de déplacement). La
// résolution de la Promise permet d'attendre la fin avant d'appeler goto().
import gsap from 'gsap';
import * as THREE from 'three';
import { get } from 'svelte/store';
import { desiredTarget } from '$lib/store/ThreeStore/animationStores';

type Section = 'dev' | 'music';

const sectionTarget: Record<Section, THREE.Vector3> = {
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
