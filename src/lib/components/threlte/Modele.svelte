<script lang="ts">
	import * as THREE from 'three';
	import { T, useTask } from '@threlte/core';
	import { useDraco, useGltf } from '@threlte/extras';
	import { get } from 'svelte/store';
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

	export const ref = new THREE.Group();
	const dracoLoader = useDraco('/draco/');

	const gltf = useGltf('/models/modeleDraco.glb', { dracoLoader });
	let { devLettersIntensity, musicLettersIntensity } = $props();

	let synthNode: THREE.Object3D | null = $state(null);
	let keyboardNode: THREE.Object3D | null = $state(null);
	let humansNode: THREE.Mesh | null = $state(null);

	let batNode: THREE.Mesh | null = $state(null);
	let batLight: THREE.PointLight | null = $state(null);
	let batIntensity = 1; // Vous pouvez ajuster l'intensité selon vos besoins

	// Références des objets
	let letterD: THREE.Mesh | null = $state(null);
	let letterE: THREE.Mesh | null = $state(null);
	let letterV: THREE.Mesh | null = $state(null);
	let letterM: THREE.Mesh | null = $state(null);
	let letterU: THREE.Mesh | null = $state(null);
	let letterS: THREE.Mesh | null = $state(null);
	let letterI: THREE.Mesh | null = $state(null);
	let letterC: THREE.Mesh | null = $state(null);

	// Variables pour gérer les timeout de clignotement
	let timeoutIds: { [key: string]: number } = {};

	// Variables pour l'animation de clignotement
	let blinkTimers: { [key: string]: number } = {};
	let blinkDurations: { [key: string]: number } = {};

	// Initialiser les durées de clignotement
	function initBlinkDuration(id: string) {
		blinkDurations[id] = Math.random() * 0.5 + 0.1; // Durée entre 0.1s et 0.6s
	}

	// Appliquer une lumière et un matériau émissif à chaque lettre
	$effect(() => {
		// Fonction pour appliquer l'émission lumineuse à une lettre
		const applyEmissive = (node, color, intensity) => {
			if (node?.material instanceof THREE.MeshStandardMaterial) {
				node.material = node.material.clone();
				node.material.emissive = color;
				node.material.emissiveIntensity = intensity * 5;
			}
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
		if (batNode?.material instanceof THREE.MeshStandardMaterial) {
			batNode.material = batNode.material.clone();
			batNode.material.emissive = batEmissiveColor;
			batNode.material.emissiveIntensity = batIntensity * 5;
			batNode.frustumCulled = false;
		}

		// Fonction pour animer le clignotement des lettres
		const clignoter = (name, lights, node, intensity) => {
			if (lights && node) {
				animateClignotement(name, lights, node, intensity);
			}
		};

		// Clignotement indépendant pour chaque lettre
		[
			{
				name: 'letterD',
				lights: get(letterDLights),
				node: letterD,
				intensity: devLettersIntensity
			},
			{
				name: 'letterE',
				lights: get(letterELights),
				node: letterE,
				intensity: devLettersIntensity
			},
			{
				name: 'letterV',
				lights: get(letterVLights),
				node: letterV,
				intensity: devLettersIntensity
			},
			{
				name: 'letterM',
				lights: get(letterMLights),
				node: letterM,
				intensity: musicLettersIntensity
			},
			{
				name: 'letterU',
				lights: get(letterULights),
				node: letterU,
				intensity: musicLettersIntensity
			},
			{
				name: 'letterS',
				lights: get(letterSLights),
				node: letterS,
				intensity: musicLettersIntensity
			},
			{
				name: 'letterI',
				lights: get(letterILights),
				node: letterI,
				intensity: musicLettersIntensity
			},
			{
				name: 'letterC',
				lights: get(letterCLights),
				node: letterC,
				intensity: musicLettersIntensity
			},
			{ name: 'bat', lights: batLight, node: batNode, intensity: devLettersIntensity }
		].forEach(({ name, lights, node, intensity }) => clignoter(name, lights, node, intensity));

		// Fonction de nettoyage des lettres et du batNode
		return () => {
			Object.values(timeoutIds).forEach((id) => clearTimeout(id));
		};
	});

	// Fonction pour simuler le clignotement aléatoire
	function randomIntensity() {
		return Math.random() < 0.5 ? 0 : Math.random(); // 0 pour extinction, sinon un nombre entre 0 et 1
	}

	// Fonction d'animation pour gérer le clignotement synchronisé
	function animateClignotement(
		letterId: string,
		light: THREE.PointLight | null,
		mesh: THREE.Mesh | null,
		intensity: number
	) {
		// Vérifier si un timeout est déjà en cours et le nettoyer
		if (timeoutIds[letterId]) {
			clearTimeout(timeoutIds[letterId]);
		}

		// Clignotement des lettres 'DEV' et 'MUSIC'
		const randomIntensityValue = randomIntensity();
		if (light) {
			light.intensity = intensity * randomIntensityValue * 5;
		}
		if (mesh?.material instanceof THREE.MeshStandardMaterial) {
			mesh.material.emissiveIntensity = intensity * randomIntensityValue * 5;
		}

		// Reprogrammer le clignotement pour chaque lettre avec un délai aléatoire
		const randomDelay = Math.random() * 500 + 100; // Délai entre 100 ms et 600 ms
		timeoutIds[letterId] = setTimeout(
			() => animateClignotement(letterId, light, mesh, intensity),
			randomDelay
		);
	}

	// Tâche pour animer les objets seulement si les nœuds sont initialisés
	useTask((delta) => {
		// Clignotement de 'bat'
		if (!blinkTimers['bat']) {
			blinkTimers['bat'] = 0;
			initBlinkDuration('bat');
		}
		blinkTimers['bat'] += delta;

		if (blinkTimers['bat'] >= blinkDurations['bat']) {
			// Basculer l'intensité
			const randomIntensityValue = randomIntensity();

			if (batLight) {
				batLight.intensity = batIntensity * randomIntensityValue * 5;
				batLight.updateMatrix();
				batLight.updateMatrixWorld();
			}
			if (batNode?.material instanceof THREE.MeshStandardMaterial) {
				batNode.material.emissiveIntensity = batIntensity * randomIntensityValue * 5;
				batNode.material.needsUpdate = true;
			}

			// Réinitialiser le timer et la durée
			blinkTimers['bat'] = 0;
			initBlinkDuration('bat');
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

<T is={ref} dispose={false}>
	{#await gltf}
		<slot name="fallback" />
	{:then gltf}
		<T.Mesh
			castShadow
			receiveShadow
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

		<T.PointLight
			bind:ref={batLight}
			intensity={batIntensity}
			color="#FFFFFF"
			position={[0.26, 2.94, 0.32]}
			distance={10}
			castShadow
			receiveShadow
		/>
	{:catch error}
		<slot name="error" {error} />
	{/await}

	<slot {ref} />
</T>
