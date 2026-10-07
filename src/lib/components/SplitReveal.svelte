<script lang="ts">
	let {
		lines,
		capitalize = false,
		class: className = ''
	}: { lines: string[]; capitalize?: boolean; class?: string } = $props();

	// text-transform: capitalize ne marche pas ici : chaque caractère est dans son propre span.
	const display = (word: string) =>
		capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word;
</script>

<p class={className}>
	<span class="sr-only">{lines.join(' ')}</span>
	<span aria-hidden="true">
		{#each lines as line, lineIndex (lineIndex)}
			{#if lineIndex > 0}<br />{/if}
			{#each line.split(' ') as word, wordIndex (wordIndex)}
				<span class="word"
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

	.char {
		display: inline-block;
	}
</style>
