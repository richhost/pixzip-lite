<script lang="ts">
	import { CompareImage } from 'svelte-compare-image';

	export let left: string;
	export let right: string;
	export let save: string;
	export let leftImage: string;
	export let rightImage: string;
</script>

<div class="relative text-sm">
	<div class="absolute px-5 py-1 rounded top-3 left-3 z-10 bg-white bg-opacity-80 backdrop-blur">
		压缩前
		<br />
		{left}
	</div>
	<div class="absolute px-5 py-1 rounded top-3 right-3 z-10 bg-white bg-opacity-80 backdrop-blur">
		压缩后
		<br />
		{right}
	</div>
	<div
		class="absolute right-3 top-16 bg-green-500 bg-opacity-80 backdrop-blur z-10 text-white px-5 py-1 rounded text-xs"
	>
		节省 {save}
	</div>
	<CompareImage imageLeftSrc={leftImage} imageRightSrc={rightImage} />
</div>
