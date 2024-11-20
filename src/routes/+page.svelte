<script lang="ts">
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import * as THREE from 'three';
	import {
		disableAnimationsHome,
		cameraPosition,
		cameraTarget,
		pointLightIntensity,
		PrincipalLightIntensity
	} from '$lib/store/ThreeStore/animationStores';
	import { tick } from 'svelte';

	import '@fontsource-variable/montserrat';

	gsap.registerPlugin(ScrollTrigger);

	// Objets intermédiaires pour l'animation
	let cameraPos = { x: -25, y: 7, z: 0 };
	let cameraTgt = { x: 0, y: 2, z: 0 };
	let pointLight = { value: 0 };

	// Variables pour stocker les ScrollTriggers
	let scrollTrigger1: any;
	let scrollTrigger2: any;
	let scrollTrigger3: any;

	function initializeScrollTrigger() {
		// ScrollTrigger pour désactiver les animations liées à la souris
		scrollTrigger1 = ScrollTrigger.create({
			trigger: '.about',
			start: 'top -+80%',
			onEnter: () => {
				disableAnimationsHome.set(true);
			},
			onLeaveBack: () => {
				disableAnimationsHome.set(false);
			}
		});

		// ScrollTrigger pour animer la caméra et éteindre la lumière principale au milieu de '.about'
		scrollTrigger2 = ScrollTrigger.create({
			trigger: '.about',
			start: 'top -+100%',
			end: 'bottom',
			scrub: true,
			onUpdate: (self) => {
				const progress = self.progress;

				// Calcul des nouvelles positions de la caméra basées sur le défilement
				const newCameraPosition = {
					x: THREE.MathUtils.lerp(-25, -50, progress),
					y: THREE.MathUtils.lerp(7, 2, progress),
					z: 0
				};

				const newCameraTarget = {
					x: 0,
					y: THREE.MathUtils.lerp(2, 2, progress),
					z: 0
				};

				// Calcul de la nouvelle intensité de la lumière principale pour qu'elle atteigne zéro au milieu
				if (progress <= 0.5) {
					const newPrincipalLightIntensity = THREE.MathUtils.lerp(70, 0, progress * 2);
					PrincipalLightIntensity.set(newPrincipalLightIntensity);
				} else {
					PrincipalLightIntensity.set(0);
				}

				// Annuler toute animation en cours
				gsap.killTweensOf(cameraPos);
				gsap.killTweensOf(cameraTgt);

				// Utiliser gsap pour animer la caméra
				gsap.to(cameraPos, {
					duration: 0.1,
					x: newCameraPosition.x,
					y: newCameraPosition.y,
					z: newCameraPosition.z,
					ease: 'linear',
					onUpdate: () => {
						cameraPosition.set(new THREE.Vector3(cameraPos.x, cameraPos.y, cameraPos.z));
					}
				});

				gsap.to(cameraTgt, {
					duration: 0.1,
					x: newCameraTarget.x,
					y: newCameraTarget.y,
					z: newCameraTarget.z,
					ease: 'linear',
					onUpdate: () => {
						cameraTarget.set(new THREE.Vector3(cameraTgt.x, cameraTgt.y, cameraTgt.z));
					}
				});
			}
		});

		// ScrollTrigger pour animer la PointLight
		scrollTrigger3 = ScrollTrigger.create({
			trigger: '.suite',

			start: 'top =+50%',
			end: 'bottom',
			scrub: true,
			onEnter: () => {
				console.log('Entré dans .suite');
				// Allumer la lumière progressivement
				gsap.to(pointLight, {
					duration: 1,
					value: 50,
					ease: 'linear',
					onUpdate: () => {
						pointLightIntensity.set(pointLight.value);
					}
				});
			},
			onLeaveBack: () => {
				console.log('Sorti de .suite');
				// Éteindre la lumière progressivement
				gsap.to(pointLight, {
					duration: 1,
					value: 0,
					ease: 'linear',
					onUpdate: () => {
						pointLightIntensity.set(pointLight.value);
					}
				});
			}
		});
	}

	$effect(() => {
		tick().then(() => {
			initializeScrollTrigger();
		});

		return () => {
			if (scrollTrigger1) scrollTrigger1.kill();
			if (scrollTrigger2) scrollTrigger2.kill();
			if (scrollTrigger3) scrollTrigger3.kill();
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<!-- Votre code HTML pour les sections -->
<section class="home flex justify-center content-center items-center">
	<!-- <a href="/dev" class="link-music" aria-label="Go to dev section"> </a>
	<a href="/music" class="link-dev" aria-label="Go to music section"> </a> -->
</section>
<section class="about flex flex-col justify-center items-center">
	<p class="text-center container-text-about">
		Hello ! welcome to my website.
		<br />
		I'm a web developer and musical composer from Toulouse,<br /> passionate about both art and science.
	</p>
</section>
<section class="suite flex justify-center content-center items-center">
	<div class="flex-col container-text-suite">
		<p class="text-center">
			When art and science intertwine,<br /> they form the true alchemy of creation
		</p>
		<br />
		<p class="text-center">
			a balance as intricate as the caduceus of Hermes,<br /> guiding us toward freedom.
		</p>
	</div>
</section>
<section class="ets flex justify-center content-center items-center">
	<p>TEXTE</p>
</section>
<section class="fin flex justify-center content-center items-center">
	<p>TEXTE</p>
</section>

<style>
	section {
		border: red 2px solid;
		width: 100%;
		height: 100vh;
		font-family: 'Montserrat Variable', sans-serif;
	}

	.container-text-about {
		transform: translateY(10vh);
	}

	.container-text-suite {
		transform: translateY(-30vh);
	}

	/* .link-music {
		position: absolute;
		top: 0;
		right: 0;
		width: 40%;
		height: 100%;
		z-index: 1;
	}
	.link-dev {
		position: absolute;
		top: 0;
		left: 0;
		width: 40%;
		height: 100%;
		z-index: 1;
	} */
</style>
