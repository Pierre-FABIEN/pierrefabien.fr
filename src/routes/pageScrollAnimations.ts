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

interface TextRevealOptions {
	composition: string;
	chars: string;
	trigger: string;
	start: string;
	// Distances de scroll (en hauteurs d'écran) de l'apparition et de la disparition.
	revealSpan: number;
	exitSpan?: number;
	// Élément hors lettres (label) qui s'efface en premier à la sortie.
	label?: string;
	from: () => number;
	to: () => number;
}

// Le bloc de texte reste fixe à l'écran pendant l'arrivée de sa section, tandis que le contour de
// ses lettres se dessine une à une ; puis, si `exitSpan` est donné, il reste fixe pendant que les
// lettres s'effacent dans le même ordre. Tout est lié au scroll (scrub exact) ; `from`/`to` donnent
// le décalage vertical de départ et d'arrivée.
function createTextReveal({
	composition,
	chars,
	trigger,
	start,
	revealSpan,
	exitSpan = 0,
	label,
	from,
	to
}: TextRevealOptions) {
	const block = document.querySelector<HTMLElement>(composition);
	const letters = gsap.utils.toArray<HTMLElement>(chars);
	if (!block || !letters.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return undefined;
	}

	// Chaque lettre rejoint la couleur que le CSS lui donne (blanc, ou orange pour le &).
	const finalColors = letters.map((letter) => getComputedStyle(letter).color);
	const transparent = (color: string) => color.replace('rgb(', 'rgba(').replace(')', ', 0)');
	const waveDuration = 0.12 * revealSpan;
	const stagger = { each: (revealSpan - waveDuration) / (letters.length - 1) };

	const timeline = gsap
		.timeline({
			defaults: { ease: 'none' },
			scrollTrigger: {
				trigger,
				start,
				end: () => `+=${(revealSpan + exitSpan) * window.innerHeight}`,
				scrub: true,
				invalidateOnRefresh: true
			}
		})
		.fromTo(block, { y: from }, { y: to, duration: revealSpan }, 0)
		.fromTo(block, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 * revealSpan }, 0)
		.fromTo(
			letters,
			{ color: (index: number) => transparent(finalColors[index]) },
			{
				color: (index: number) => finalColors[index],
				duration: waveDuration,
				ease: 'power1.inOut',
				stagger
			},
			0
		);

	if (exitSpan > 0) {
		// Le décalage compense exactement le scroll : le bloc reste immobile à l'écran.
		timeline
			.fromTo(
				block,
				{ y: to },
				{
					y: () => to() + exitSpan * window.innerHeight,
					duration: exitSpan,
					immediateRender: false
				},
				revealSpan
			)
			.fromTo(
				letters,
				{ color: (index: number) => finalColors[index] },
				{
					color: (index: number) => transparent(finalColors[index]),
					duration: 0.12 * exitSpan,
					ease: 'power1.inOut',
					immediateRender: false,
					stagger: { each: (0.88 * exitSpan) / (letters.length - 1) }
				},
				revealSpan
			);

		const labelElement = label ? block.querySelector<HTMLElement>(label) : null;
		if (labelElement) {
			timeline.fromTo(
				labelElement,
				{ opacity: getComputedStyle(labelElement).opacity },
				{ opacity: 0, duration: 0.12 * exitSpan, ease: 'power1.inOut', immediateRender: false },
				revealSpan
			);
		}
	}

	return timeline;
}

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

	// Textes des sections 2 et 3 : contour dessiné lettre par lettre, bloc fixe pendant l'arrivée.
	const reveals = [
		// Aux 3/4 de l'écran (0 = haut, 1 = bas), du milieu de l'intersection 1/2 jusqu'au centrage.
		createTextReveal({
			composition: '.about .about-composition',
			chars: '.about .char',
			trigger: '.about',
			start: 'top 50%',
			revealSpan: 0.5,
			// Disparition finie avant l'arrivée du texte de .suite (about top à -70 %).
			exitSpan: 0.6,
			label: '.about-label',
			from: () => (0.75 - 1) * window.innerHeight,
			to: () => (0.75 - 0.5) * window.innerHeight
		}),
		// En bas de l'écran : fixe depuis le tiers bas de l'intersection 2/3, puis reste fixe pendant sa disparition.
		createTextReveal({
			composition: '.suite .suite-composition',
			chars: '.suite .char',
			trigger: '.suite',
			start: 'top 30%',
			revealSpan: 0.3,
			exitSpan: 0.6,
			from: () => -0.3 * window.innerHeight,
			to: () => 0
		})
	];

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
				x: THREE.MathUtils.lerp(-25, -70, progress),
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
		reveals.forEach((timeline) => {
			timeline?.scrollTrigger?.kill();
			timeline?.kill();
		});
		cueTween?.scrollTrigger?.kill();
		cueTween?.kill();
		scrollTrigger1.kill();
		scrollTrigger2.kill();
		scrollTrigger3.kill();
		ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
	};
}
