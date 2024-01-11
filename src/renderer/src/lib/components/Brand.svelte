<script lang="ts">
	import { OS } from '../utils';
	import OpenMenu from './icons/ui/OpenMenu.svelte';

	const showBrandName = OS !== 'darwin';
</script>

<div class="brand draggable">
	{#if showBrandName}
		像素丢失
	{/if}
	<button class="open-menu no-drag"><OpenMenu /></button>
</div>

<style>
	.brand {
		height: var(--h-header);
		font-size: 15px;
		font-weight: 500;
		display: grid;
		place-items: center;
		position: relative;
	}

	.open-menu {
		position: absolute;
		right: 8px;
		width: 32px;
		aspect-ratio: 1;
		border-radius: 4px;
		display: grid;
		place-items: center;
		transition: background 0.2s var(--ease-4);
		background-color: transparent;
	}
	.open-menu:hover {
		background-color: var(--gray-5);
	}

	.open-menu:active {
		background-color: var(--gray-7);
	}
</style>
