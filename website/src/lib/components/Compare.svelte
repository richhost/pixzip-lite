<script lang="ts">
	import { CompareSlider, SliderHandle } from 'svelte-compare-slider';
</script>

<CompareSlider class="rounded-md">
	{#snippet itemOne()}
		<img src="/dog.jpg" alt="" />
	{/snippet}
	{#snippet itemTwo()}
		<img src="dog-min.jpg" alt="" />
	{/snippet}

	{#snippet handle()}
		<SliderHandle />
	{/snippet}
</CompareSlider>
