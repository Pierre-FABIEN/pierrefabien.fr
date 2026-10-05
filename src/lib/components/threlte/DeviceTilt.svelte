<script lang="ts">
	import { Smartphone } from 'lucide-svelte';
	import {
		homeInteractive,
		isMouseOutside,
		mousePercentage
	} from '$lib/store/ThreeStore/animationStores';
	import {
		updateDesiredPositions,
		updateLightIntensityTargets
	} from './utils/Functions/positionUtils';

	type OrientationPermission = typeof DeviceOrientationEvent & {
		requestPermission?: () => Promise<'granted' | 'denied'>;
	};

	let available = $state(false);
	let enabled = $state(false);
	let requesting = $state(false);
	let foreground = $state(true);
	let status = $state('');

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return { destroy: () => node.remove() };
	}

	$effect(() => {
		const coarsePointer = window.matchMedia('(pointer: coarse)');
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updateAvailability = () => {
			available =
				window.isSecureContext &&
				'DeviceOrientationEvent' in window &&
				coarsePointer.matches &&
				!reducedMotion.matches;
		};
		const updateVisibility = () => {
			foreground = !document.hidden;
		};
		updateAvailability();
		updateVisibility();
		coarsePointer.addEventListener('change', updateAvailability);
		reducedMotion.addEventListener('change', updateAvailability);
		document.addEventListener('visibilitychange', updateVisibility);
		return () => {
			coarsePointer.removeEventListener('change', updateAvailability);
			reducedMotion.removeEventListener('change', updateAvailability);
			document.removeEventListener('visibilitychange', updateVisibility);
		};
	});

	async function toggleTilt() {
		if (requesting) return;
		if (enabled) {
			enabled = false;
			isMouseOutside.set(true);
			updateDesiredPositions();
			updateLightIntensityTargets();
			return;
		}
		requesting = true;
		status = '';
		try {
			const orientation = window.DeviceOrientationEvent as OrientationPermission;
			if (orientation.requestPermission && (await orientation.requestPermission()) !== 'granted') {
				status = 'Acces aux capteurs refuse';
				return;
			}
			enabled = true;
		} catch {
			status = 'Capteurs indisponibles';
		} finally {
			requesting = false;
		}
	}

	$effect(() => {
		if (!available || !enabled || !foreground || !$homeInteractive) return;
		let baseline: number | undefined;
		let percentage = 0.5;
		let nextPercentage = 0.5;
		let frame: number | undefined;
		const resetBaseline = () => {
			baseline = undefined;
		};
		const handleOrientation = (event: DeviceOrientationEvent) => {
			if (event.beta === null || event.gamma === null) return;
			const angle = ((screen.orientation?.angle ?? window.orientation ?? 0) * Math.PI) / 180;
			const horizontal = event.gamma * Math.cos(angle) + event.beta * Math.sin(angle);
			baseline ??= horizontal;
			const offset = horizontal - baseline;
			nextPercentage =
				0.5 + Math.max(-1, Math.min(1, Math.abs(offset) < 2 ? 0 : offset / 25)) * 0.5;
			if (frame !== undefined) return;
			frame = requestAnimationFrame(() => {
				frame = undefined;
				percentage += (nextPercentage - percentage) * 0.2;
				mousePercentage.set(percentage);
				isMouseOutside.set(false);
				updateDesiredPositions();
				updateLightIntensityTargets();
			});
		};
		window.addEventListener('deviceorientation', handleOrientation);
		window.addEventListener('orientationchange', resetBaseline);
		return () => {
			window.removeEventListener('deviceorientation', handleOrientation);
			window.removeEventListener('orientationchange', resetBaseline);
			if (frame !== undefined) cancelAnimationFrame(frame);
		};
	});
</script>

{#if available && $homeInteractive}
	<div use:portal>
		<button
			class="device-tilt"
			class:enabled
			type="button"
			aria-label={enabled ? 'Desactiver les capteurs' : 'Activer les capteurs'}
			title={status || (enabled ? 'Desactiver les capteurs' : 'Activer les capteurs')}
			aria-pressed={enabled}
			disabled={requesting}
			onclick={toggleTilt}
		>
			<Smartphone size={20} />
		</button>
		<span class="sr-only" role="status">{status}</span>
	</div>
{/if}

<style>
	.device-tilt {
		position: fixed;
		right: max(1rem, env(safe-area-inset-right));
		bottom: max(1rem, env(safe-area-inset-bottom));
		z-index: 50;
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		border: 1px solid rgb(255 255 255 / 0.4);
		border-radius: 4px;
		background: rgb(0 0 0 / 0.8);
		color: white;
	}

	.device-tilt.enabled {
		border-color: hsl(var(--primary));
		color: hsl(var(--primary));
	}

	.device-tilt:focus-visible {
		outline: 2px solid white;
		outline-offset: 4px;
	}
</style>
