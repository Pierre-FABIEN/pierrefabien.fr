import { derived, writable } from 'svelte/store';
import * as THREE from 'three';

// Création des stores
export const disableAnimationsHome = writable(false);
export const isMouseOutside = writable<boolean>(false);
export const mousePercentage = writable<number>(0);

export const desiredTarget = writable<THREE.Vector3>(new THREE.Vector3(0, 2, 0));
export const desiredCameraPosition = writable<THREE.Vector3>(new THREE.Vector3(-25, 7, 0));

export const leftSpotLightIntensity = writable<number>(0);
export const rightSpotLightIntensity = writable<number>(0);
export const targetLeftIntensity = writable<number>(0);
export const targetRightIntensity = writable<number>(0);
export const pointLightIntensity = writable<number>(0);

export const devLettersIntensity = writable<number>(0);
export const musicLettersIntensity = writable<number>(0);

export const PrincipalLightIntensity = writable<number>(70);
export const FlameIntensity = writable<number>(1);

export const cameraPosition = writable(new THREE.Vector3(-25, 7, 0));
export const cameraTarget = writable(new THREE.Vector3(0, 2, 0));

export const lerpFactor = writable<number>(0.2);

// Section actuellement affichée (synchronisée avec la route courante dans +layout.svelte)
export const activeSection = writable<'home' | 'dev' | 'music'>('home');

// Visibilité des meshes/lumières de la scène d'accueil : reste true pendant la rotation
// de caméra vers une section, puis passe à false une fois l'animation terminée.
export const homeSceneVisible = writable<boolean>(true);

// true uniquement sur le 1er écran de la home (ni scrollé, ni sur /dev ou /music) :
// seul moment où la souris doit piloter caméra/lumières.
export const homeInteractive = derived(
	[disableAnimationsHome, activeSection],
	([$disableAnimationsHome, $activeSection]) => !$disableAnimationsHome && $activeSection === 'home'
);
