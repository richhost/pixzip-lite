<script lang="ts">
	import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from '../ui/context-menu';
</script>

<section class="grow m-2 ml-0 border border-neutral-200/80 bg-white rounded-2xl">
	<ContextMenu>
		{#snippet trigger()}
			<div class="w-20 h-10 bg-neutral-200">Right click me</div>
		{/snippet}
		<ContextMenuItem>
			<div>1</div>
		</ContextMenuItem>
		<ContextMenuSeparator />
		<ContextMenuItem>
			<div>2</div>
		</ContextMenuItem>
	</ContextMenu>
</section>
