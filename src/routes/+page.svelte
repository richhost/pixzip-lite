<script lang="ts">
  import { Counter } from '$lib/runes/counter.svelte';

  const counter = new Counter();
</script>

<button on:click={() => counter.increment()}>clicks: {counter.count}</button>
<p>{counter.count} double is {counter.double}</p>
