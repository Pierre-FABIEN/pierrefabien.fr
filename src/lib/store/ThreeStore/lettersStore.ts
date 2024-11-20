import { writable } from 'svelte/store';
import * as THREE from 'three';

// Store pour gérer les objets et lumières

  export const letterD = writable<THREE.Mesh | null>(null) 
  export const letterE = writable<THREE.Mesh | null>(null) 
  export const letterV = writable<THREE.Mesh | null>(null) 
  export const letterM = writable<THREE.Mesh | null>(null) 
  export const letterU = writable<THREE.Mesh | null>(null) 
  export const letterS = writable<THREE.Mesh | null>(null) 
  export const letterI = writable<THREE.Mesh | null>(null) 
  export const letterC = writable<THREE.Mesh | null>(null) 
  
  export const letterDLights = writable<THREE.PointLight | null>(null) 
  export const letterELights = writable<THREE.PointLight | null>(null) 
  export const letterVLights = writable<THREE.PointLight | null>(null) 
  export const letterMLights = writable<THREE.PointLight | null>(null) 
  export const letterULights = writable<THREE.PointLight | null>(null) 
  export const letterSLights = writable<THREE.PointLight | null>(null) 
  export const letterILights = writable<THREE.PointLight | null>(null) 
  export const letterCLights = writable<THREE.PointLight | null>(null) 

