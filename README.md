# pierrefabien.fr

Site personnel statique de Pierre Fabien (développeur web & compositeur musical), construit avec [SvelteKit](https://svelte.dev/docs/kit) + Svelte 5 (runes) et une scène 3D interactive [Threlte](https://threlte.xyz)/Three.js animée au scroll (GSAP).

## Stack

- **SvelteKit 2 / Svelte 5** — runes (`$state`, `$props`, `$effect`), export statique via `@sveltejs/adapter-static`
- **Threlte** (`@threlte/core`, `@threlte/extras`) — scène 3D (modèle GLTF/Draco) en fond du layout
- **GSAP** (`ScrollTrigger`) — animations pilotées par le scroll
- **Tailwind CSS** + composants `shadcn-svelte`
- **Vite PWA** — manifeste + service worker

## Développement

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # génère un export statique dans build/
npm run preview
```

## Qualité

```bash
npm run check   # svelte-check
npm run lint    # prettier + eslint
npm run test    # vitest + playwright
```

## Pipeline modèles 3D

Les fichiers `.glb` dans `static/models` sont transformés en composants Threlte via :

```bash
npm run model-pipeline:run
```
