// src/lib/utils/Functions/mouseHandlers.ts

import { get } from 'svelte/store';

// Import des stores nécessaires
import {
	isMouseOutside,
	mousePercentage,
	homeInteractive
} from '$lib/store/ThreeStore/animationStores';

// Import des fonctions nécessaires avec le bon chemin
import { updateDesiredPositions, updateLightIntensityTargets } from './positionUtils'; // Ajustez le chemin selon votre structure de dossiers

// Throttle via rAF : un seul traitement par frame peu importe la fréquence des événements natifs
let pendingMouseEvent: MouseEvent | null = null;
let rafScheduled = false;

function processMouseMove(event: MouseEvent): void {
	const mouseX = event.clientX;
	const windowWidth = window.innerWidth;

	mousePercentage.set(mouseX / windowWidth);
	isMouseOutside.set(false);

	updateDesiredPositions();
	updateLightIntensityTargets();
}

// Fonctions de gestion de la souris (comme précédemment)
export function handleMouseMove(event: MouseEvent): void {
	if (!get(homeInteractive)) return;

	pendingMouseEvent = event;
	if (rafScheduled) return;

	rafScheduled = true;
	requestAnimationFrame(() => {
		rafScheduled = false;
		if (pendingMouseEvent) {
			processMouseMove(pendingMouseEvent);
			pendingMouseEvent = null;
		}
	});
}

export function handleMouseOut(event: MouseEvent): void {
	if (!event.relatedTarget || !get(homeInteractive)) {
		isMouseOutside.set(true);
		updateDesiredPositions();
		updateLightIntensityTargets();
	}
}

export function handleMouseEnter(): void {
	if (get(homeInteractive)) {
		isMouseOutside.set(false);
		updateDesiredPositions();
		updateLightIntensityTargets();
	}
}
