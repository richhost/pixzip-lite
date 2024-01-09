<script lang="ts">
	import WindowClose from './icons/ui/window-close.svelte';
	import WindowMaximize from './icons/ui/window-maximize.svelte';
	import WindowMinimize from './icons/ui/window-minimize.svelte';
	import WindowRestore from './icons/ui/window-restore.svelte';
	import { createUI } from '../runes/ui.svelte';
	import OS from '../runes/os.svelte';

	const ui = createUI();
</script>

<div id="header" class="draggable">
	{#if OS.os !== 'darwin'}
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
