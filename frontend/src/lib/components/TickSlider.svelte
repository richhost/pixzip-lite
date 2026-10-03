<script lang="ts">
  import Slider from './Slider.svelte';
  import type { ComponentProps } from 'svelte';

  let props: ComponentProps<typeof Slider> = $props();
</script>

<Slider {...props} />
