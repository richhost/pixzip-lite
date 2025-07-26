<script lang="ts">
	import { SiGithub } from '@icons-pack/svelte-simple-icons';
	import { locales, setLocale, getLocale } from '$lib/paraglide/runtime';

	const options = $derived.by(()=> {
		return locales.map(locale => ({
			value: locale,
			label: locale === 'en' ? 'English' : '简体中文'
		}));
	})

</script>

<header class="shadow-sm sticky top-0 bg-white">
	<nav class="h-14 mx-auto max-w-7xl px-5 w-full flex items-center justify-between">
		<a href="#home" class="flex items-center justify-center gap-2 font-medium">
			<img class="w-7 h-7 rounded-md" src="/icon.webp" alt="logo" />PixZip Lite
		</a>

		<div class="flex items-center gap-2">
			<select value={getLocale()} onchange={e=> {
				const target = e.target as HTMLSelectElement
				setLocale(target.value as typeof locales[number]);
			}}>
				{#each options as { value, label }}
					<option value={value}>{label}</option>
				{/each}
			</select>

			<a href="https://github.com/richhost/pixzip-lite" target="_blank" rel="noopener noreferrer">
				<SiGithub size={24} />
			</a>
		</div>
	</nav>
</header>
