<script lang="ts">
	import { SplitPane } from '../SplitPane';
	import WorkspaceConfig from './WorkspaceConfig.svelte';
	import Stage from './Stage.svelte';
</script>

<SplitPane min="180px" max="300px" pos="20%">
	{#snippet a()}
		<WorkspaceConfig />
	{/snippet}
	{#snippet b()}
		<Stage />
	{/snippet}
</SplitPane>
