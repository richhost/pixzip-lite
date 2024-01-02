<script lang="ts">
	import { onMount } from 'svelte';
	import WindowClose from './icons/ui/window-close.svelte';
	import WindowMaximize from './icons/ui/window-maximize.svelte';
	import WindowMinimize from './icons/ui/window-minimize.svelte';
	import WindowRestore from './icons/ui/window-restore.svelte';

	let maximized = $state(false);

	onMount(() => {
		window.pixzip.ui.onUnmaximized(() => {
			maximized = false;
		});
		window.pixzip.ui.onMaximized(() => {
			maximized = true;
		});
	});
</script>

<div id="header" class="draggable">
	<div class="window-ctr">
		<button
			class="button no-drag"
			onclick={() => {
				window.pixzip.ui.minimize();
			}}
		>
			<WindowMinimize />
		</button>
		<button
			class="button no-drag"
			onclick={() => {
				if (maximized) {
					window.pixzip.ui.unmaximize();
				} else {
					window.pixzip.ui.maximize();
				}
			}}
		>
			{#if maximized}
				<WindowRestore />
			{:else}
				<WindowMaximize />
			{/if}
		</button>
		<button
			class="button no-drag"
			onclick={() => {
				window.pixzip.ui.close();
			}}
		>
			<WindowClose />
		</button>
	</div>
</div>

<style>
	#header {
		height: var(--h-header);
		background-color: var(--gray-2);
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
