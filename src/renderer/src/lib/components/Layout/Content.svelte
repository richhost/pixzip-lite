<script lang="ts">
	import type { Snippet } from 'svelte';
	const { children } = $props<{ children?: Snippet }>();
</script>

<main class="main">
	{#if children}
		{@render children()}
	{/if}
</main>

<style>
	.main {
		flex-grow: 1;
	}
</style>
