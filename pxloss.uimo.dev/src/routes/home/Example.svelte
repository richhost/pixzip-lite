<script lang="ts">
	import BeerHandle from './BeerHandle.svelte';
	import H3 from './H3.svelte';
</script>

<section class="max-w-7xl mx-auto px-5 md:px-10 xl:px-20 py-16" id="example">
	<H3 text="样例图片" />
	<div class="h-16" />

	<BeerHandle
		left="1.5MB"
		right="863KB"
		save="44%"
		leftImage="/images/IMG_7774.jpg"
		rightImage="/images/IMG_7774-loss.jpg"
	/>

	<div class="pt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
		<BeerHandle
			left="354KB"
			right="181KB"
			save="49%"
			leftImage="/images/1.jpg"
			rightImage="/images/1-loss.jpg"
		/>
		<BeerHandle
			left="227KB"
			right="108KB"
			save="52%"
			leftImage="/images/2.jpg"
			rightImage="/images/2-loss.jpg"
		/>
	</div>
</section>
