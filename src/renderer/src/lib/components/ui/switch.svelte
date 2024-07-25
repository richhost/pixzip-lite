<script lang="ts">
	import { Switch, type SwitchProps } from 'bits-ui';

	type Props = {} & SwitchProps;

	const props: Props = $props();
</script>

<Switch.Root
	{...props}
	class="peer inline-flex h-5 w-8 rounded-full shrink-0 items-center px-0.5 transition-colors bg-neutral-200 data-[state=checked]:bg-neutral-800"
>
	<Switch.Thumb
		class="pointer-events-none block size-4 rounded-full bg-white transition-transform data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0"
	/>
</Switch.Root>
