<script lang="ts">
	import { Settings } from 'lucide-svelte';
	import { Drawer } from 'vaul-svelte';
	import Version from './version.svelte';
	import Donate from './donate.svelte';
	import Privacy from './privacy.svelte';
	import OpenSource from './open-source.svelte';
</script>

<Drawer.Root shouldScaleBackground open>
	<Drawer.Trigger
		class="w-7 h-7 flex items-center justify-center transition hover:bg-neutral-200 rounded active:scale-95"
	>
		<Settings class="w-4 h-4" />
	</Drawer.Trigger>

	<Drawer.Portal>
		<Drawer.Content
			class="fixed inset-x-0 bottom-0 z-50 mt-24 rounded-t-[10px] bg-neutral-50 p-5 text-sm"
		>
			<main class="grid grid-cols-2 max-w-lg mx-auto gap-5">
				<section class="flex flex-col gap-5">
					<Version />
					<Privacy />
				</section>
				<section class="flex flex-col gap-5">
					<Donate />
					<OpenSource />
				</section>
			</main>
		</Drawer.Content>
		<Drawer.Overlay class="fixed inset-0 z-10 bg-black/80" />
	</Drawer.Portal>
</Drawer.Root>
