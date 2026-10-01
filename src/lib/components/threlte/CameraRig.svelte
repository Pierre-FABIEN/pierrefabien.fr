<script lang="ts">
	import * as THREE from 'three';
	import { T, useTask } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { updateCamera } from './utils/Functions/cameraUtils';
	import {
		disableAnimationsHome,
		desiredTarget,
		desiredCameraPosition,
		leftSpotLightIntensity,
		rightSpotLightIntensity,
		targetLeftIntensity,
		targetRightIntensity,
		lerpFactor
	} from '$store/ThreeStore/animationStores';

	let perspectiveCameraRef = $state<THREE.PerspectiveCamera | undefined>(undefined);
	let orbitControlsRef = $state<any | undefined>(undefined);

	// useTask nécessite le contexte Threlte fourni par <Canvas> à ses enfants :
	// ce composant doit impérativement être monté à l'intérieur de <Canvas>.
	const cameraLerpTask = useTask(
		() => {
			const factor = $lerpFactor;

			leftSpotLightIntensity.set(
				THREE.MathUtils.lerp($leftSpotLightIntensity, $targetLeftIntensity, factor)
			);
			rightSpotLightIntensity.set(
				THREE.MathUtils.lerp($rightSpotLightIntensity, $targetRightIntensity, factor)
			);

			if (orbitControlsRef?.target) {
				orbitControlsRef.target.lerp($desiredTarget, factor);
				orbitControlsRef.update();
			}

			if (perspectiveCameraRef) {
				perspectiveCameraRef.position.lerp($desiredCameraPosition, factor);
			}
		},
		{ autoStart: false }
	);

	$effect(() => {
		if ($disableAnimationsHome) {
			cameraLerpTask.stop();
		} else {
			cameraLerpTask.start();
		}
	});

	// Caméra pilotée par le scroll (ScrollTrigger) : abonnement mis en place une
	// seule fois dès que la ref caméra est prête, et actif en permanence (ne doit
	// pas dépendre de `disableAnimationsHome`, qui ne contrôle que le lerp souris).
	$effect(() => {
		if (!perspectiveCameraRef) return;

		const { unsubscribePosition, unsubscribeTarget } = updateCamera(
			perspectiveCameraRef,
			orbitControlsRef
		);

		return () => {
			unsubscribePosition();
			unsubscribeTarget();
		};
	});
</script>

<T.PerspectiveCamera bind:ref={perspectiveCameraRef} makeDefault position={[-25, 7, 0]} fov={15}>
	<OrbitControls
		bind:ref={orbitControlsRef}
		autoRotate={false}
		enableRotate={true}
		enableZoom={true}
		enablePan={true}
		enableDamping={true}
		target={[0, 2, 0]}
	/>
</T.PerspectiveCamera>
