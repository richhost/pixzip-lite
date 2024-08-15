<script lang="ts">
	import Radio from '../ui/radio.svelte';
	import Fieldset from './fieldset.svelte';
	import Input from '../ui/input.svelte';
	import { client } from '$lib/client';
	import { getSpaceConfig } from '$lib/runes/space-config.svelte';

	const spaceConfig = getSpaceConfig();

	const originalDir = $derived.by(() => !!spaceConfig.formData?.originalOutput);
	const outputDir = $derived.by(() => spaceConfig.formData?.outputDir);
	const suffix = $derived(spaceConfig.formData?.suffix ?? '');

	const selectOutputDirectory = () => {
		client.folderPicker().then(([path]) => {
			if (path) {
				spaceConfig.update('outputDir', path);
			}
		});
	};
</script>

<Fieldset legend="Save Into">
	<Radio
		label="Original Directory"
		name="save into"
		checked={originalDir}
		onchange={(e) => {
			spaceConfig.update('originalOutput', true);
		}}
	/>
	<Radio
		class="my-1"
		label="Custom Directory"
		name="save into"
		checked={!originalDir}
		onchange={(e) => {
			spaceConfig.update('originalOutput', false);
			if (!outputDir) {
				selectOutputDirectory();
			}
		}}
	/>
	{#if originalDir === false}
		<Input readonly value={outputDir} onclick={selectOutputDirectory} />
	{/if}

	<hr class="border-neutral-200 my-4" />

	<label class="flex items-center justify-between">
		<span class="font-medium">Suffix</span>
		<Input
			class="w-28"
			value={suffix}
			oninput={(e) => {
				spaceConfig.update('suffix', (e.target as HTMLInputElement).value);
			}}
			spellcheck={false}
		/>
	</label>
	<div class="text-xs text-right">filename<span class="text-sky-500">{suffix}</span>.jpg</div>
</Fieldset>
