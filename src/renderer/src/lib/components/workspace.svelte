<script lang="ts">
	const list = [
		{ name: 'a' },
		{ name: 'b' },
		{ name: 'c' },
		{ name: 'd' },
		{ name: 'e' },
		{ name: 'f' }
	];
</script>

<div class="workspaces">
	{#each list as w}
		<div class="item">{w.name}</div>
	{/each}
</div>

<style>
	.workspaces {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
		padding: 16px;
		gap: 16px;
	}

	.item {
		aspect-ratio: 1;
		border: 1px solid var(--gray-2);
	}
</style>
