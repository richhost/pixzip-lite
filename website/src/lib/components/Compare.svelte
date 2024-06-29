<script lang="ts">
	import { createComparison } from 'svelte-compare-slider';

	const api = createComparison({});
</script>

<div
	class="relative cursor-col-resize overflow-hidden inline-block touch-pan-y rounded-md"
	{...api.rootProps}
>
	<img src="/dog.jpg" alt="" {...api.panelAProps} />
	<img src="/dog-min.jpg" alt="" {...api.panelBProps} />
	<div
		class="absolute inset-y-0 flex flex-col items-center w-10 -translate-x-1/2"
		{...api.handleProps}
	>
		<div class="grow w-0.5 bg-white shadow"></div>
		<div
			class="w-10 h-10 border-2 rounded-full shadow bg-white/10 backdrop-blur flex items-center justify-center"
		>
			<div
				class="w-0 h-0"
				style="border: inset 6px transparent; border-right: 6px solid white; margin-right: 10px;"
			></div>
			<div
				class="w-0 h-0"
				style="border: inset 6px transparent; border-left: 6px solid white;"
			></div>
		</div>
		<div class="grow w-0.5 bg-white shadow"></div>
	</div>
</div>
