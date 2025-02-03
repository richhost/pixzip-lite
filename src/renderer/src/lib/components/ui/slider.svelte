<script lang="ts">
	import { Slider } from '@ark-ui/svelte/slider';
	import type { SliderRootProps } from '@ark-ui/svelte/slider';

	const { ...props }: SliderRootProps = $props();
</script>

<Slider.Root {...props}>
	<Slider.ValueText />
	<Slider.Control class="flex items-center">
		<Slider.Track class="bg-neutral-200 dark:bg-neutral-100/10 h-1 rounded-full grow">
			<Slider.Range class="bg-neutral-800 dark:bg-neutral-200 h-1 rounded-full" />
		</Slider.Track>
		<Slider.Thumb
			class="size-4 flex items-center justify-center rounded-full bg-neutral-50 dark:bg-neutral-200 shadow border border-neutral-800"
			index={0}
		>
			<Slider.HiddenInput />
		</Slider.Thumb>
	</Slider.Control>
</Slider.Root>
