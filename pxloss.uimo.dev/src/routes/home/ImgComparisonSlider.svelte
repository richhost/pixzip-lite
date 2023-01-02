<script lang="ts">
	import { onMount } from 'svelte';

	export let value: number = 50;
	export let hover: boolean = false;
	export let direction: 'horizontal' | 'vertical' = 'horizontal';
	export let nonce: string = '';
	export let keyboard: 'enabled' | 'disabled' = 'enabled';
	export let handle: boolean | undefined = undefined;

	onMount(() => {
		import('img-comparison-slider');
	});
</script>

<svelte:element
	this="img-comparison-slider"
	{value}
	{hover}
	{direction}
	{nonce}
	{keyboard}
	{handle}
	{...$$restProps}
>
	<slot name="first" />
	<slot name="second" />
	<slot name="handle" />
</svelte:element>
