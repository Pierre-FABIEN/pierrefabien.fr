<script lang="ts">
	import { T } from '@threlte/core';

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
	import {
		devLettersIntensity,
		musicLettersIntensity
	} from '$lib/store/ThreeStore/animationStores';
</script>

<T.PointLight
	bind:ref={$letterDLights}
	intensity={$devLettersIntensity / 2}
	color="#FFFFFF"
	position={[3.44, 1.65, -8.21]}
	distance={2}
	decay={1}
	angle={Math.PI / 1}
	penumbra={1}
	castShadow
	receiveShadow
/>
<T.PointLight
	bind:ref={$letterELights}
	intensity={$devLettersIntensity / 2}
	color="#FFFFFF"
	position={[4.15, 1.8, -7.68]}
	distance={2}
	decay={1}
	angle={Math.PI / 1}
	penumbra={1}
	castShadow
	receiveShadow
/>
<T.PointLight
	bind:ref={$letterVLights}
	intensity={$devLettersIntensity / 2}
	color="#FFFFFF"
	position={[4.75, 2.01, -7.21]}
	distance={2}
	decay={1}
	angle={Math.PI / 1}
	penumbra={1}
	castShadow
	receiveShadow
/>

<T.PointLight
	bind:ref={$letterMLights}
	intensity={$musicLettersIntensity / 2}
	color="#FFFFFF"
	position={[5.36, 1.64, 6.74]}
	distance={2}
	decay={1}
	angle={Math.PI / 1}
	penumbra={1}
	castShadow
	receiveShadow
/>
<T.PointLight
	bind:ref={$letterULights}
	intensity={$musicLettersIntensity / 2}
	color="#FFFFFF"
	position={[5.2, 1.78, 7.98]}
	distance={2}
	decay={1}
	angle={Math.PI / 1}
	penumbra={1}
	castShadow
	receiveShadow
/>
<T.PointLight
	bind:ref={$letterSLights}
	intensity={$musicLettersIntensity / 2}
	color="#FFFFFF"
	position={[4.69, 2.35, 8.9]}
	distance={2}
	decay={1}
	angle={Math.PI / 1}
	penumbra={1}
	castShadow
	receiveShadow
/>
<T.PointLight
	bind:ref={$letterILights}
	intensity={$musicLettersIntensity / 2}
	color="#FFFFFF"
	position={[4.1, 2.34, 9.21]}
	distance={2}
	decay={1}
	angle={Math.PI / 1}
	penumbra={1}
	castShadow
	receiveShadow
/>
<T.PointLight
	bind:ref={$letterCLights}
	intensity={$musicLettersIntensity / 2}
	color="#FFFFFF"
	position={[4.19, 2.3, 9.97]}
	distance={2}
	decay={1}
	angle={Math.PI / 1}
	penumbra={1}
	castShadow
	receiveShadow
/>
