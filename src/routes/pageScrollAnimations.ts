// Logique ScrollTrigger de la page d'accueil, isolée dans son propre module pour
// permettre un import dynamique depuis +page.svelte (gsap/three ne sont alors
// plus dans le bundle initial, chargés uniquement une fois le DOM monté).
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

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations(): () => void {
	const cameraPos = { x: -25, y: 7, z: 0 };
	const cameraTgt = { x: 0, y: 2, z: 0 };
	const pointLight = { value: 0 };

	// L'indicateur de scroll s'efface avec le premier défilement.
	const cue = document.querySelector<HTMLElement>('.scroll-cue');
	const cueTween = cue
		? gsap.to(cue, {
				opacity: 0,
				yPercent: 40,
				ease: 'none',
				scrollTrigger: { trigger: '.home', start: 'top top', end: 'top -30%', scrub: true }
			})
		: undefined;

	// Le texte de .about reste fixe aux 3/4 de l'écran du milieu de l'intersection 1/2 jusqu'au
	// centrage de la section 2, pendant que le contour blanc de ses lettres (remplissage
	// transparent) se dessine lettre par lettre (scrub exact).
	const aboutText = document.querySelector<HTMLElement>('.about .about-text');
	const chars = gsap.utils.toArray<HTMLElement>('.about .char');
	const revealTimeline =
		aboutText && chars.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
			? gsap.timeline({
					defaults: { ease: 'none' },
					scrollTrigger: {
						trigger: '.about',
						start: 'top 50%',
						end: 'top top',
						scrub: true,
						invalidateOnRefresh: true
					}
				})
			: undefined;

	if (revealTimeline && aboutText) {
		const wave = 0.12;
		// Position verticale du texte en fraction de la hauteur d'écran (0 = haut, 1 = bas).
		const line = 0.75;
		revealTimeline
			.fromTo(
				aboutText,
				{ y: () => (line - 1) * window.innerHeight },
				{ y: () => (line - 0.5) * window.innerHeight, duration: 1 },
				0
			)
			.fromTo(aboutText, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, 0)
			.fromTo(
				chars,
				{ color: 'rgba(255, 255, 255, 0)' },
				{
					color: '#fff',
					duration: wave,
					ease: 'power1.inOut',
					stagger: { each: (1 - wave) / (chars.length - 1) }
				},
				0
			);
	}

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
		revealTimeline?.scrollTrigger?.kill();
		revealTimeline?.kill();
		cueTween?.scrollTrigger?.kill();
		cueTween?.kill();
		scrollTrigger1.kill();
		scrollTrigger2.kill();
		scrollTrigger3.kill();
		ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
	};
}
