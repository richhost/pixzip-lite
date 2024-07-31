<script lang="ts">
	import { cn } from '$lib/utils';
	import { type Snippet } from 'svelte';
	import { closeFn, maximizeFn, minimizeFn, useWindowState } from './action.svelte';

	const isMax = useWindowState();

	$inspect('isMax---', isMax);
</script>

<div class="absolute right-0 top-0 bottom-0 flex items-center">
	{@render button(minimizeIcon, minimizeFn)}
	{@render button(maximizeIcon, maximizeFn)}
	{@render button(closeIcon, closeFn, true)}
</div>

{#snippet minimizeIcon()}
	<svg class="w-5 h-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
		<path d="M4 10v1h8v-1z" fill="currentColor" />
	</svg>
{/snippet}

{#snippet maximizeIcon()}
	<svg class="w-5 h-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
		<path d="M4 4v8h8V4zm1 1h6v6H5z" overflow="visible" fill="currentColor" />
	</svg>
{/snippet}

{#snippet closeIcon()}
	<svg class="w-5 h-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M3.793 4.5l3.5 3.5-3.5 3.5.707.707 3.5-3.5 3.5 3.5.707-.707-3.5-3.5 3.5-3.5-.707-.707-3.5 3.5-3.5-3.5z"
			fill="currentColor"
			fill-rule="evenodd"
			color="currentColor"
		/>
	</svg>
{/snippet}

{#snippet button(icon: Snippet, fn: Function, isClose = false)}
	<button
		onclick={() => fn()}
		class={cn('w-10 h-full grid place-items-center transition', {
			'hover:bg-red-600 hover:text-white': isClose,
			'hover:bg-neutral-200 hover:text-neutral-600': !isClose
		})}
	>
		{@render icon()}
	</button>
{/snippet}
