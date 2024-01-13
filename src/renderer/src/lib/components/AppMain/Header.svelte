<script lang="ts">
	import WindowClose from '../icons/ui/WindowClose.svelte';
	import WindowMaximize from '../icons/ui/WindowMaximize.svelte';
	import WindowMinimize from '../icons/ui/WindowMinimize.svelte';
	import WindowRestore from '../icons/ui/WindowRestore.svelte';
	import { createUI } from '../../runes/ui.svelte';
	import { OS } from '../../utils';

	const ui = createUI();
</script>

<div id="header" class="draggable">
	{#if OS !== 'darwin'}
		<div class="window-ctr">
			<button
				class="button no-drag"
				onclick={() => {
					ui.minimizeApp();
				}}
			>
				<WindowMinimize />
			</button>
			<button
				class="button no-drag"
				onclick={() => {
					if (ui.maximized) {
						ui.unmaximizeApp();
					} else {
						ui.maximizeApp();
					}
				}}
			>
				{#if ui.maximized}
					<WindowRestore />
				{:else}
					<WindowMaximize />
				{/if}
			</button>
			<button
				class="button no-drag"
				onclick={() => {
					ui.closeApp();
				}}
			>
				<WindowClose />
			</button>
		</div>
	{/if}
</div>

<style>
	#header {
		height: var(--h-header);
	}

	.window-ctr {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 16px;
		height: 100%;
		padding-inline-end: 16px;
	}

	.button {
		display: grid;
		place-items: center;
		width: 24px;
		aspect-ratio: 1;
		background-color: var(--gray-3);
		border-radius: 50%;
		transition: background 0.2s ease;
	}

	.button:hover {
		background-color: var(--gray-4);
	}
	.button:active {
		background-color: var(--gray-8);
	}
</style>
