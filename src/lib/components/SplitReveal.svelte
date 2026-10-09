<script lang="ts">
	let {
		lines,
		capitalize = false,
		accents = [],
		class: className = ''
	}: { lines: string[]; capitalize?: boolean; accents?: string[]; class?: string } = $props();

	// Mots mis en avant (police d'accent) : comparés sans casse ni ponctuation.
	const isAccent = (word: string) => accents.includes(word.toLowerCase().replace(/[^a-z]/g, ''));

	// text-transform: capitalize ne marche pas ici : chaque caractère est dans son propre span.
	const display = (word: string) =>
		capitalize && !isAccent(word) ? word.charAt(0).toUpperCase() + word.slice(1) : word;
</script>

<p class={className}>
	<span class="sr-only">{lines.join(' ')}</span>
	<span aria-hidden="true">
		{#each lines as line, lineIndex (lineIndex)}
			{#if lineIndex > 0}<br />{/if}
			{#each line.split(' ') as word, wordIndex (wordIndex)}
				<span class="word" class:accent={isAccent(word)}
					>{#each [...display(word)] as char, charIndex (charIndex)}<span class="char">{char}</span
						>{/each}</span
				>{' '}
			{/each}
		{/each}
	</span>
</p>

<style>
	.word {
		display: inline-block;
		white-space: nowrap;
		text-transform: capitalize;
	}

	.word.accent {
		font-family: var(--accent-font, inherit);
		font-size: var(--accent-size, 1em);
		font-weight: var(--accent-weight, inherit);
		letter-spacing: var(--accent-spacing, inherit);
		line-height: var(--accent-line-height, inherit);
		text-transform: none;
	}

	.char {
		display: inline-block;
	}
</style>
