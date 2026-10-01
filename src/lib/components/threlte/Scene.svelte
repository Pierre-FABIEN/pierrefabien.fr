<script lang="ts">
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import * as THREE from 'three';
	import { Canvas } from '@threlte/core';
	import { SoftShadows } from '@threlte/extras';

	import Modele from './Modele.svelte';
	import SpotLight from './utils/Light/SpotLight.svelte';
	import FlameLight from './utils/Light/FlameLight.svelte';
	import CameraRig from './CameraRig.svelte';

	import {
		disableAnimationsHome,
		desiredTarget,
		desiredCameraPosition,
		targetLeftIntensity,
		targetRightIntensity,
		leftSpotLightIntensity,
		rightSpotLightIntensity,
		devLettersIntensity,
		musicLettersIntensity,
		PrincipalLightIntensity,
		FlameIntensity,
		pointLightIntensity,
		lerpFactor
	} from '$store/ThreeStore/animationStores';

	import {
		handleMouseEnter,
		handleMouseMove,
		handleMouseOut
	} from './utils/Functions/mouseHandlers';
	import LetterLights from './utils/Light/LetterLights.svelte';

	gsap.registerPlugin(ScrollTrigger);

	// Gestion des animations désactivées
	disableAnimationsHome.subscribe((disable) => {
		if (disable) {
			// Mettre à jour les valeurs cibles pour la caméra et les lumières
			desiredTarget.set(new THREE.Vector3(0, 2, 0));
			desiredCameraPosition.set(new THREE.Vector3(-25, 7, 0));
			targetLeftIntensity.set(0);
			targetRightIntensity.set(0);
			rightSpotLightIntensity.set(0);
			leftSpotLightIntensity.set(0);
			devLettersIntensity.set(0);
			musicLettersIntensity.set(0);
			lerpFactor.set(0.2);
		}
	});
</script>

<Canvas shadows dpr={Math.min(window.devicePixelRatio, 2)}>
	<CameraRig />
	<SoftShadows focus={15} size={15} samples={16} />

	<FlameLight
		color="#FFA500"
		intensity={$FlameIntensity}
		position={[-0.25, 2.75, 0]}
		distance={0.8}
		decay={1}
		castShadow={true}
		helpers={false}
	/>

	<!-- Lumière principale -->
	<SpotLight
		helpers={false}
		intensity={$PrincipalLightIntensity}
		position={[0, 10, 0]}
		angle={Math.PI / 7}
		penumbra={0.5}
		distance={50}
		targetPosition={[0, 0, 0]}
	/>

	<!-- SpotLight droite (intensité interpolée) -->
	<SpotLight
		helpers={false}
		intensity={$rightSpotLightIntensity}
		position={[0, 10, 0]}
		angle={Math.PI / 7}
		penumbra={0.5}
		distance={50}
		targetPosition={[5, 0, 10]}
	/>

	<!-- SpotLight gauche (intensité interpolée) -->
	<SpotLight
		helpers={false}
		intensity={$leftSpotLightIntensity}
		position={[0, 10, 0]}
		angle={Math.PI / 7}
		penumbra={0.5}
		distance={50}
		targetPosition={[5, 0, -10]}
	/>

	<SpotLight
		helpers={false}
		intensity={$pointLightIntensity}
		position={[-30, 10, 0]}
		distance={50}
		penumbra={1}
		angle={Math.PI / 4}
		targetPosition={[-30, 0, 0]}
	/>

	<LetterLights />

	<Modele
		devLettersIntensity={$devLettersIntensity}
		musicLettersIntensity={$musicLettersIntensity}
	/>
</Canvas>

<svelte:window
	on:mousemove={handleMouseMove}
	on:mouseout={handleMouseOut}
	on:mouseenter={handleMouseEnter}
/>
