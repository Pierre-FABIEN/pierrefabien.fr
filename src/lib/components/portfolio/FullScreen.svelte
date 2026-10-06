<script lang="ts">
	import IconFullScreen from './svg/IconFullScreen.svelte';

	let active = $state(false);

	function handleFullscreenChange() {
		active = !!document.fullscreenElement;
	}

	function toggleFullScreen(): void {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen?.();
		} else {
			document.exitFullscreen?.();
		}
	}
</script>

<svelte:document onfullscreenchange={handleFullscreenChange} />

<button class="handleClass" onclick={toggleFullScreen} aria-label="Plein écran">
	<IconFullScreen fill="#1966cb" {active} />
</button>
