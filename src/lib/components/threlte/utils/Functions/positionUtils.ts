// src/lib/utils/Functions/positionUtils.ts

import { get } from 'svelte/store';
import * as THREE from 'three';
import {
	isMouseOutside,
	mousePercentage,
	targetLeftIntensity,
	targetRightIntensity,
	devLettersIntensity,
	musicLettersIntensity,
	disableAnimationsHome,
	desiredTarget,
	desiredCameraPosition,
	activeSection
} from '$lib/store/ThreeStore/animationStores';

export function updateDesiredPositions() {
	// Hors de la section 'home' (transition/section dev-music en cours), la souris ne doit
	// plus piloter la caméra : ça entrait en conflit avec la rotation de section et
	// provoquait un retour brutal vers le cadrage de la scène principale.
	if (get(disableAnimationsHome) || get(activeSection) !== 'home') return;

	const mouseOutside = get(isMouseOutside);
	const mousePercent = get(mousePercentage);

	if (mouseOutside) {
		desiredTarget.set(new THREE.Vector3(0, 2, 0));
		desiredCameraPosition.set(new THREE.Vector3(-25, 7, 0));
	} else {
		const targetZ = THREE.MathUtils.lerp(-5, 5, mousePercent);
		desiredTarget.set(new THREE.Vector3(0, 2, targetZ));

		const cameraX = THREE.MathUtils.lerp(-25, -25, 1 - mousePercent);
		const cameraZ = THREE.MathUtils.lerp(-6, 6, 1 - mousePercent);
		desiredCameraPosition.set(new THREE.Vector3(cameraX, 7, cameraZ));
	}
}

export function updateLightIntensityTargets() {
	if (get(disableAnimationsHome) || get(activeSection) !== 'home') return;

	const mouseOutside = get(isMouseOutside);
	const mousePercent = get(mousePercentage);

	const centerMargin = 0.2;

	if (mouseOutside) {
		targetLeftIntensity.set(0);
		targetRightIntensity.set(0);
		devLettersIntensity.set(0);
		musicLettersIntensity.set(0);
	} else if (mousePercent < 0.5 - centerMargin) {
		// La souris est à gauche, on allume 'DEV'
		targetLeftIntensity.set(70);
		targetRightIntensity.set(0);
		devLettersIntensity.set(1);
		musicLettersIntensity.set(0);
	} else if (mousePercent > 0.5 + centerMargin) {
		// La souris est à droite, on allume 'MUSIC'
		targetLeftIntensity.set(0);
		targetRightIntensity.set(70);
		devLettersIntensity.set(0);
		musicLettersIntensity.set(1);
	} else {
		// La souris est au centre
		targetLeftIntensity.set(0);
		targetRightIntensity.set(0);
		devLettersIntensity.set(0);
		musicLettersIntensity.set(0);
	}
}
