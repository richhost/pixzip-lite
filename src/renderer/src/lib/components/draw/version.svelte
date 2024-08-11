<script lang="ts">
	import { client } from '$lib/client';

	let version = $state('');
	client.getVersion().then((res) => {
		version = res;
	});

	const fetchVersion = async () => {
		const resp = await fetch('https://api.github.com/repos/richhost/pixzip-lite/releases/latest');
		const data = await resp.json();
		if (resp.ok) {
			return data.tag_name.replace('v', '');
		} else {
			throw new Error('Failed to fetch version');
		}
	};
</script>

<div class="p-4 rounded-md bg-amber-200 shadow">
	<h2 class="font-bold text-lg mb-1">Version</h2>

	<div>Current Version: {version}</div>

	{#await fetchVersion()}
		<p>...waiting</p>
	{:then data}
		{#if data !== version}
			<p>Latest Version: {data}</p>
			<a
				class="rounded-md flex items-center justify-center h-8 bg-neutral-900 font-medium text-white mt-2"
				href="https://github.com/richhost/pixzip-lite/releases"
				target="_blank"
				rel="noreferrer"
			>
				Download
			</a>
		{:else}
			<div>No new version</div>
		{/if}
	{/await}
</div>
