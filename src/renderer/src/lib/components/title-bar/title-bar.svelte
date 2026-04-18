<script lang="ts">
	import { OS } from '$lib/shared/utils';
	import WindowCtr from './window-ctr.svelte';
	import Toolbar from './toolbar.svelte';
</script>

<div class="electrobun-webkit-app-region-drag draggable flex h-[var(--h-title-bar)] shrink-0">
	{#if OS === 'darwin'}
		<!-- Spacer so content doesn't start behind macOS traffic lights (~74px) -->
		<div class="w-[74px] shrink-0"></div>
	{/if}

	<div class="relative grow flex items-center justify-center">
		<!-- Only the buttons themselves are no-drag, not the entire center area -->
		<div class="electrobun-webkit-app-region-no-drag">
			<Toolbar />
		</div>

		{#if OS !== 'darwin'}
			<div class="electrobun-webkit-app-region-no-drag absolute right-0">
				<WindowCtr />
			</div>
		{/if}
	</div>
</div>
