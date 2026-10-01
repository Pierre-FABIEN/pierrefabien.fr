<script lang="ts">
	import * as THREE from 'three';
	import { T, useTask } from '@threlte/core';
	import { useDraco, useGltf } from '@threlte/extras';
	import type { Snippet } from 'svelte';
	import {
		letterDLights,
		letterELights,
		letterVLights,
		letterMLights,
		letterULights,
		letterSLights,
		letterILights,
		letterCLights
	} from '$lib/store/ThreeStore/lettersStore';
	import { disableAnimationsHome } from '$lib/store/ThreeStore/animationStores';

	export const ref = new THREE.Group();
	const dracoLoader = useDraco('/draco/');

	const gltf = useGltf('/models/modeleDraco.glb', { dracoLoader });
	let {
		devLettersIntensity,
		musicLettersIntensity,
		fallback,
		errorSnippet,
		children
	}: {
		devLettersIntensity: number;
		musicLettersIntensity: number;
		fallback?: Snippet;
		errorSnippet?: Snippet<[{ error: unknown }]>;
		children?: Snippet<[{ ref: THREE.Group }]>;
	} = $props();

	let synthNode: THREE.Mesh | undefined = $state();
	let keyboardNode: THREE.Mesh | undefined = $state();
	let humansNode: THREE.Mesh | undefined = $state();

	let batNode: THREE.Mesh | undefined = $state();
	let batLight: THREE.PointLight | undefined = $state();
	let batIntensity = 1; // Vous pouvez ajuster l'intensité selon vos besoins

	// Références des objets
	let letterD: THREE.Mesh | undefined = $state();
	let letterE: THREE.Mesh | undefined = $state();
	let letterV: THREE.Mesh | undefined = $state();
	let letterM: THREE.Mesh | undefined = $state();
	let letterU: THREE.Mesh | undefined = $state();
	let letterS: THREE.Mesh | undefined = $state();
	let letterI: THREE.Mesh | undefined = $state();
	let letterC: THREE.Mesh | undefined = $state();

	// Rend le matériau "possédé" par ce mesh (cloné une seule fois, via un flag sur
	// le matériau lui-même) pour pouvoir le faire clignoter sans affecter les meshes
	// qui partagent le même matériau source dans le glTF.
	function ownMaterial(node: THREE.Mesh | undefined): THREE.MeshStandardMaterial | undefined {
		if (!node || !(node.material instanceof THREE.MeshStandardMaterial)) return undefined;
		if (!node.material.userData.isEmissiveClone) {
			const cloned = node.material.clone();
			cloned.userData.isEmissiveClone = true;
			node.material = cloned;
			return cloned;
		}
		return node.material;
	}

	// Appliquer une lumière et un matériau émissif à chaque lettre
	$effect(() => {
		// Fonction pour appliquer l'émission lumineuse à une lettre
		const applyEmissive = (node: THREE.Mesh | undefined, color: THREE.Color, intensity: number) => {
			const material = ownMaterial(node);
			if (!material) return;
			material.emissive = color;
			material.emissiveIntensity = intensity * 5;
		};

		// Couleurs d'émission lumineuse
		const devEmissiveColor = new THREE.Color(0xffffff);
		const musicEmissiveColor = new THREE.Color(0xffffff);
		const batEmissiveColor = new THREE.Color(0xffffff);

		// Appliquer l'émission lumineuse aux lettres 'DEV'
		[letterD, letterE, letterV].forEach((letter) =>
			applyEmissive(letter, devEmissiveColor, devLettersIntensity)
		);

		// Appliquer l'émission lumineuse aux lettres 'MUSIC'
		[letterM, letterU, letterS, letterI, letterC].forEach((letter) =>
			applyEmissive(letter, musicEmissiveColor, musicLettersIntensity)
		);

		// Appliquer l'émission lumineuse au batNode
		const batMaterial = ownMaterial(batNode);
		if (batMaterial) {
			batMaterial.emissive = batEmissiveColor;
			batMaterial.emissiveIntensity = batIntensity * 5;
			if (batNode) batNode.frustumCulled = false;
		}
	});

	// État de clignotement par objet (lettre ou bat) : une phase "stable" longue
	// (lumière fixe) entrecoupée de courtes rafales d'à-coups façon néon défaillant.
	interface BlinkState {
		timer: number;
		phaseDuration: number;
		glitchStepsLeft: number;
	}
	const blinkStates: { [key: string]: BlinkState } = {};

	function randomStableDuration() {
		return 0.4 + Math.random() * 1.4; // lumière stable entre 0.4s et 1.8s (rafales plus fréquentes)
	}
	function randomGlitchStepDuration() {
		return 0.025 + Math.random() * 0.055; // à-coup entre 25ms et 80ms (flicker plus net)
	}

	// emissiveIntensity est un simple uniform : pas besoin de needsUpdate (qui
	// peut forcer une recompilation de shader) pour le mettre à jour.
	function applyLightIntensity(
		light: THREE.Light | null | undefined,
		mesh: THREE.Mesh | undefined,
		value: number
	) {
		if (light) light.intensity = value;
		if (mesh?.material instanceof THREE.MeshStandardMaterial) {
			mesh.material.emissiveIntensity = value;
		}
	}

	// Clignotement synchronisé au render loop de Threlte (plutôt que des setTimeout
	// récursifs indépendants) : une seule tâche gère toutes les lettres + le bat.
	function updateBlink(
		id: string,
		delta: number,
		light: THREE.Light | null | undefined,
		mesh: THREE.Mesh | undefined,
		intensity: number
	) {
		let state = blinkStates[id];
		if (!state) {
			state = blinkStates[id] = {
				timer: 0,
				phaseDuration: randomStableDuration(),
				glitchStepsLeft: 0
			};
			applyLightIntensity(light, mesh, intensity * 5);
			return;
		}

		state.timer += delta;
		if (state.timer < state.phaseDuration) return;
		state.timer = 0;

		if (state.glitchStepsLeft > 0) {
			state.glitchStepsLeft--;
			if (state.glitchStepsLeft === 0) {
				// fin de la rafale : la lumière se stabilise à nouveau
				applyLightIntensity(light, mesh, intensity * 5);
				state.phaseDuration = randomStableDuration();
			} else {
				// contraste franc tout-ou-rien (plus intense qu'un simple palier de luminosité)
				const isOffStep = state.glitchStepsLeft % 2 === 0;
				applyLightIntensity(light, mesh, isOffStep ? 0 : intensity * 5);
				state.phaseDuration = randomGlitchStepDuration();
			}
			return;
		}

		// 65% de chance de déclencher une rafale de 4 à 8 à-coups avant de se restabiliser
		if (Math.random() < 0.65) {
			state.glitchStepsLeft = 4 + Math.floor(Math.random() * 5);
			state.phaseDuration = randomGlitchStepDuration();
		} else {
			state.phaseDuration = randomStableDuration();
		}
	}

	// Tâche pour animer les objets seulement si les nœuds sont initialisés
	useTask((delta) => {
		updateBlink('bat', delta, batLight, batNode, batIntensity);

		// Lettres DEV/MUSIC masquées à partir du 2e écran : inutile de les faire clignoter
		if (!$disableAnimationsHome) {
			updateBlink('letterD', delta, $letterDLights, letterD, devLettersIntensity);
			updateBlink('letterE', delta, $letterELights, letterE, devLettersIntensity);
			updateBlink('letterV', delta, $letterVLights, letterV, devLettersIntensity);
			updateBlink('letterM', delta, $letterMLights, letterM, musicLettersIntensity);
			updateBlink('letterU', delta, $letterULights, letterU, musicLettersIntensity);
			updateBlink('letterS', delta, $letterSLights, letterS, musicLettersIntensity);
			updateBlink('letterI', delta, $letterILights, letterI, musicLettersIntensity);
			updateBlink('letterC', delta, $letterCLights, letterC, musicLettersIntensity);
		}

		// Rotation des synthNode et keyboardNode
		if (synthNode && keyboardNode) {
			synthNode.rotation.x = 0.8;
			keyboardNode.rotation.x = -0.8;
			// Appliquer la rotation
			synthNode.rotation.y += delta * 0.5;
			keyboardNode.rotation.y += delta * 0.5;
		}

		// Rotation du humansNode
		if (humansNode) {
			// Ajouter une rotation autour de l'axe Y
			humansNode.rotation.y += delta * 0.1; // Ajustez la vitesse de rotation (0.1 est un exemple)
			humansNode.updateMatrixWorld(); // Mettez à jour la matrice du monde
		}
	});
</script>

<T is={ref}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Mesh
			castShadow
			receiveShadow
			visible={!$disableAnimationsHome}
			geometry={gltf.nodes.Desk.geometry}
			material={gltf.nodes.Desk.material}
			position={[4.62, 1.02, -6.8]}
			rotation={[-1.57, -0.01, -0.55]}
			scale={1.8}
		/>
		<T.Mesh
			castShadow
			receiveShadow
			geometry={gltf.nodes.Ground.geometry}
			material={gltf.nodes.Ground.material}
			scale={[50, 1, 50]}
		/>
		<T.Mesh
			castShadow
			receiveShadow
			geometry={gltf.nodes.Human.geometry}
			material={gltf.nodes.Human.material}
			position={[0.13, 0, 0.06]}
			rotation={[0, 0, 0]}
			scale={1}
		/>
		<T.Mesh
			castShadow
			receiveShadow
			bind:ref={batNode}
			geometry={gltf.nodes.Bat.geometry}
			material={gltf.nodes.Bat.material}
			position={[0.26, 2.94, 0.32]}
			rotation={[0.3, 0, -0.56]}
			scale={0.15}
		/>
		<T.Mesh
			castShadow
			receiveShadow
			bind:ref={humansNode}
			geometry={gltf.nodes.Humans.geometry}
			material={gltf.nodes.Humans.material}
			position={[-30, 0, 0]}
			scale={2}
		/>

		<T.Mesh
			castShadow
			receiveShadow
			geometry={gltf.nodes.Keyboard.geometry}
			material={gltf.nodes.Keyboard.material}
			position={[0.18, 3, -1.65]}
			rotation={[Math.PI / 2, 0, -Math.PI / 2]}
			scale={5}
			bind:ref={keyboardNode}
		/>
		<T.Mesh
			castShadow
			receiveShadow
			visible={!$disableAnimationsHome}
			geometry={gltf.nodes.Piano.geometry}
			material={gltf.nodes.Piano.material}
			position={[4.6, 0.72, 6.85]}
		/>
		<T.Mesh
			castShadow
			receiveShadow
			geometry={gltf.nodes.Synth.geometry}
			material={gltf.nodes.Synth.material}
			position={[0, 3, 1.7]}
			rotation={[Math.PI / 2, 0, -Math.PI / 2]}
			scale={0.1}
			bind:ref={synthNode}
		/>

		<T.Group visible={!$disableAnimationsHome}>
			<T.Mesh
				castShadow
				receiveShadow
				bind:ref={letterD}
				geometry={gltf.nodes.letterD.geometry}
				material={gltf.nodes.letterD.material}
				position={[3.44, 1.65, -8.21]}
				rotation={[Math.PI / 2, 0, 0.68]}
				scale={[0.57, 0.66, 0.49]}
			/>
			<T.Mesh
				castShadow
				receiveShadow
				bind:ref={letterE}
				geometry={gltf.nodes.letterE.geometry}
				material={gltf.nodes.letterE.material}
				position={[4.15, 1.8, -7.68]}
				rotation={[Math.PI / 2, 0, 0.68]}
				scale={[0.57, 0.66, 0.49]}
			/>

			<T.Mesh
				castShadow
				receiveShadow
				bind:ref={letterV}
				geometry={gltf.nodes.letterV.geometry}
				material={gltf.nodes.letterV.material}
				position={[4.75, 2.01, -7.21]}
				rotation={[Math.PI / 2, 0, 0.68]}
				scale={[0.57, 0.66, 0.49]}
			/>

			<T.Mesh
				castShadow
				receiveShadow
				bind:ref={letterM}
				geometry={gltf.nodes.letterM.geometry}
				material={gltf.nodes.letterM.material}
				position={[5.36, 1.64, 6.74]}
				rotation={[1.48, -0.2, 1.92]}
				scale={[0.49, 0.52, 0.64]}
			/>
			<T.Mesh
				castShadow
				receiveShadow
				bind:ref={letterU}
				geometry={gltf.nodes.letterU.geometry}
				material={gltf.nodes.letterU.material}
				position={[5.2, 1.78, 7.98]}
				rotation={[1.44, -0.31, -1.11]}
				scale={[0.49, 0.52, 0.64]}
			/>

			<T.Mesh
				castShadow
				receiveShadow
				bind:ref={letterS}
				geometry={gltf.nodes.letterS.geometry}
				material={gltf.nodes.letterS.material}
				position={[4.69, 2.35, 8.9]}
				rotation={[1.41, -0.2, 1.94]}
				scale={[0.49, 0.52, 0.64]}
			/>
			<T.Mesh
				castShadow
				receiveShadow
				bind:ref={letterI}
				geometry={gltf.nodes.letterI.geometry}
				material={gltf.nodes.letterI.material}
				position={[4.1, 2.34, 9.21]}
				rotation={[1.57, -0.43, 1.99]}
				scale={[0.49, 0.52, 0.64]}
			/>

			<T.Mesh
				castShadow
				receiveShadow
				bind:ref={letterC}
				geometry={gltf.nodes.letterC.geometry}
				material={gltf.nodes.letterC.material}
				position={[4.19, 2.3, 9.97]}
				rotation={[1.34, -0.11, 2.31]}
				scale={[0.49, 0.52, 0.64]}
			/>
		</T.Group>

		<T.PointLight
			bind:ref={batLight}
			intensity={batIntensity}
			color="#FFFFFF"
			position={[0.26, 2.94, 0.32]}
			distance={3}
			castShadow
			receiveShadow
		/>
	{:catch error}
		{@render errorSnippet?.({ error })}
	{/await}

	{@render children?.({ ref })}
</T>
