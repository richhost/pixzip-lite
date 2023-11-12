<script lang="ts">
	let count = $state(0);
	let double = $derived(count * 2);
</script>

<button on:click={() => count++}>clicks: {count}</button>
<p>{count} double is {double}</p>
