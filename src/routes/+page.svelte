<script lang="ts">
	import { Counter, createCounter } from '$lib/runes/counter.svelte';

	const counter = new Counter();

	// const counter = createCounter();
</script>

<button on:click={() => counter.increment()}>clicks: {counter.count}</button>
<p>{counter.count} double is {counter.double}</p>
