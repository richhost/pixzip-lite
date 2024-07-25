<script lang="ts">
	import { Tabs } from 'bits-ui';
	import Input from '../ui/input.svelte';
</script>

<Tabs.Root>
	<Tabs.List class="inline-flex p-0.5 rounded text-[10px] bg-neutral-200">
		<Tabs.Trigger value="original" class="py-0.5 px-1 rounded data-[state=active]:bg-white"
			>Original Directory</Tabs.Trigger
		>
		<Tabs.Trigger value="custom" class="py-0.5 px-1 rounded data-[state=active]:bg-white"
			>Custom Directory</Tabs.Trigger
		>
	</Tabs.List>

	<Tabs.Content value="custom" class="mt-2">
		<Input disabled placeholder="Select Directory" />
	</Tabs.Content>
</Tabs.Root>
