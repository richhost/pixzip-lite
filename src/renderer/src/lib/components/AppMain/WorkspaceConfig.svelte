<script lang="ts">
	import Scrollbar from '../Scrollbar.svelte';
	import Trash from '../icons/Trash.svelte';
</script>

<section class="container">
	<header class="header draggable">
		<button class="trash-btn no-drag">
			<Trash />
		</button>
	</header>

	<Scrollbar>
		<div class="content"></div>
	</Scrollbar>
</section>

<style>
	.container {
		display: flex;
		flex-direction: column;
		border-inline-end: 1px solid var(--gray-5);
		background-color: var(--gray-2);
		height: 100%;
		overflow-y: auto;
	}

	.header {
		height: var(--h-header);
		display: flex;
		align-items: center;
		padding-inline: 8px;
	}

	.trash-btn {
		width: 32px;
		aspect-ratio: 1;
		border-radius: 4px;
		display: grid;
		place-items: center;
		transition: background 0.2s var(--ease-4);
		background-color: transparent;

		&:hover {
			background-color: var(--gray-5);
		}

		&:active {
			background-color: var(--gray-7);
		}
	}

	.content {
		height: 200vh;
	}
</style>
