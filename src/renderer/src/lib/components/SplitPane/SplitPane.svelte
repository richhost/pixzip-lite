<script lang="ts">
	import { untrack } from 'svelte';
	import type { SplitPaneProps } from './types';
	import { constrain } from './utils';

	const { pos = '50%', min = '0%', max = '100%', a, b } = $props<SplitPaneProps>();

	let container: HTMLDivElement;
	let handler: HTMLDivElement;
	let w = $state(0);

	let position = $state(pos);

	$effect(() => {
		if (container && w) {
			position = constrain({ element: container, size: w, min, max, pos: position });
		}
	});

	$effect(() => {
		handler;

		handler.onpointerdown = (event) => {
			event.preventDefault();
			handler.setPointerCapture(event.pointerId);

			let shiftX = event.clientX - handler.getBoundingClientRect().left;

			const move = (e: PointerEvent) => {
				const { left } = container.getBoundingClientRect();
				const pos_px = e.clientX - left - shiftX;

				position = pos.endsWith('%') ? `${(100 * pos_px) / w}%` : `${pos_px}px`;
			};

			handler.onpointermove = move;

			handler.onpointerup = (e: PointerEvent) => {
				if (handler.hasPointerCapture(e.pointerId)) {
					handler.releasePointerCapture(e.pointerId);
				}

				handler.onpointermove = null;
				handler.onpointerup = null;
			};
		};

		return () => {
			handler.onpointerdown = null;
		};
	});
</script>

<div class="container" bind:this={container} style="--pos: {position}" bind:clientWidth={w}>
	<div class="pane">
		{#if a}
			{@render a()}
		{/if}
	</div>
	<div class="pane">
		{#if b}
			{@render b()}
		{/if}
	</div>

	{#if pos !== '0%' && pos !== '100%'}
		<div class="handle" bind:this={handler}></div>
	{/if}
</div>

<style>
	.container {
		--thickness: var(--sp-thickness, 8px);
		--color: var(--sp-color, transparent);
		display: grid;
		position: relative;
		grid-template-columns: var(--pos) 1fr;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.pane {
		height: 100%;
		overflow-y: auto;
	}

	.handle {
		position: absolute;
		z-index: 10;
		touch-action: none !important;
		cursor: ew-resize;
		width: 0;
		padding-inline: calc(var(--thickness) * 0.5);
		height: 100%;
		left: var(--pos);
		transform: translate(calc(var(--thickness) * -0.5), 0);
		background-color: var(--color);
	}
</style>
