<script lang="ts">
	import type { Snippet } from 'svelte';
	const { children } = $props<{ children?: Snippet }>();
</script>

<aside class="sider">
	{#if children}
		{@render children()}
	{/if}
</aside>

<style>
	.sider {
		background-color: var(--gray-3);
		width: clamp(var(--w-sidebar-min), 20%, var(--w-sidebar-max));
		border-inline-end: 1px solid var(--gray-5);
		display: flex;
		flex-direction: column;
	}
</style>
