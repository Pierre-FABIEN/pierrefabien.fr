// Logique ScrollTrigger de la page d'accueil, isolée dans son propre module pour
// permettre un import dynamique depuis +page.svelte (gsap/three ne sont alors
// plus dans le bundle initial, chargés uniquement une fois le DOM monté).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import * as THREE from 'three';
import { get } from 'svelte/store';
import SmoothScrollBarStore from '$lib/store/SmoothScrollBarStore';
import {
	disableAnimationsHome,
	cameraPosition,
	cameraTarget,
	pointLightIntensity,
	PrincipalLightIntensity
} from '$lib/store/ThreeStore/animationStores';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations(): () => void {
	const cameraPos = { x: -25, y: 7, z: 0 };
	const cameraTgt = { x: 0, y: 2, z: 0 };
	const pointLight = { value: 0 };
	const sections = gsap.utils.toArray<HTMLElement>('[data-route-content] > section');
	const snapTrigger =
		sections.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
			? ScrollTrigger.create({
					id: 'home-section-snap',
					trigger: sections[0].parentElement,
					start: 'top top',
					end: 'bottom bottom',
					snap: {
						snapTo: 1 / (sections.length - 1),
						directional: true,
						inertia: false,
						delay: 0.2,
						duration: { min: 0.25, max: 0.6 },
						ease: 'power2.inOut',
						onStart: () => {
							const { smoothScroll } = get(SmoothScrollBarStore);
							smoothScroll?.setMomentum(0, 0);
						}
					}
				})
			: undefined;

	// ScrollTrigger pour désactiver les animations liées à la souris
	const scrollTrigger1 = ScrollTrigger.create({
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
	const scrollTrigger2 = ScrollTrigger.create({
		trigger: '.about',
		start: 'top -+100%',
		end: 'bottom',
		scrub: true,
		onUpdate: (self) => {
			const progress = self.progress;

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
				PrincipalLightIntensity.set(THREE.MathUtils.lerp(70, 0, progress * 2));
			} else {
				PrincipalLightIntensity.set(0);
			}

			gsap.killTweensOf(cameraPos);
			gsap.killTweensOf(cameraTgt);

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
	const scrollTrigger3 = ScrollTrigger.create({
		trigger: '.suite',
		start: 'top =+50%',
		end: 'bottom',
		scrub: true,
		onEnter: () => {
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

	return () => {
		snapTrigger?.kill();
		scrollTrigger1.kill();
		scrollTrigger2.kill();
		scrollTrigger3.kill();
		ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
	};
}
