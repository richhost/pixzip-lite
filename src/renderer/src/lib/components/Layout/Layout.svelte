<script lang="ts">
	import type { Snippet } from 'svelte';
	const { children } = $props<{ children?: Snippet }>();
</script>

<div class="layout">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.layout {
		display: flex;
		height: 100dvh;
	}
</style>
