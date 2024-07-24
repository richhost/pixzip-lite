<script lang="ts">
	import WindowCtr from './window-ctr.svelte';
</script>

<div class="draggable flex h-[var(--h-title-bar)]">
	<div class="w-[clamp(var(--w-sidebar-min),16vw,var(--w-sidebar-max))]"></div>
	<div class="relative grow">
		<WindowCtr />
	</div>
</div>
