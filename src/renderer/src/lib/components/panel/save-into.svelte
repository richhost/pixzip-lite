<script lang="ts">
	import { useConfig } from '$lib/hooks/use-config.svelte';
	import Radio from '../ui/radio.svelte';
	import Fieldset from './fieldset.svelte';
	import Input from '../ui/input.svelte';
	import { client } from '$lib/client';

	const { getFormData, update } = useConfig();
	const originalDir = $derived.by(() => !!getFormData()?.originalOutput);
	const outputDir = $derived.by(() => getFormData()?.outputDir);
	const suffix = $derived(getFormData()?.suffix ?? '');

	const selectOutputDirectory = () => {
		client.folderPicker().then(([path]) => {
			if (path) {
				update('outputDir', path);
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
			update('originalOutput', true);
		}}
	/>
	<Radio
		class="my-1"
		label="Custom Directory"
		name="save into"
		checked={!originalDir}
		onchange={(e) => {
			update('originalOutput', false);
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
				update('suffix', (e.target as HTMLInputElement).value);
			}}
			spellcheck={false}
		/>
	</label>
	<div class="text-xs text-right">filename<span class="text-sky-500">{suffix}</span>.jpg</div>
</Fieldset>
