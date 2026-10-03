<script lang="ts">
  import { Slider } from '@ark-ui/svelte/slider';
  import { cn } from '#lib/utils';

  interface Props {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    unit?: string;
    showValue?: boolean;
    accent?: boolean;
    class?: string;
    disabled?: boolean;
    onchange?: (next: number) => void;
    onChange?: (next: number) => void;
    oninput?: (next: number) => void;
  }

  let {
    value = $bindable(50),
    min = 0,
    max = 100,
    step = 1,
    label = 'Slider',
    unit = '',
    showValue = false,
    accent = false,
    class: className = '',
    disabled = false,
    onchange,
    onChange,
    oninput,
  }: Props = $props();

  let sliderValue = $state([value]);

  $effect(() => {
    if (sliderValue[0] !== value) {
      sliderValue = [value];
    }
  });

  function handleValueChange(details: { value: number[] }) {
    const next = details.value[0];
    if (next !== undefined && !Number.isNaN(next)) {
      sliderValue = details.value;
      if (value !== next) {
        value = next;
        oninput?.(next);
        onchange?.(next);
        onChange?.(next);
      }
    }
  }
</script>

<Slider.Root
  bind:value={sliderValue}
  onValueChange={handleValueChange}
  {min}
  {max}
  {step}
  thumbAlignment="contain"
  {disabled}
  aria-label={[label]}
  class={cn(
    "relative flex w-full items-center gap-3 select-none py-1.5",
    disabled && "opacity-40 pointer-events-none",
    className
  )}
>
  <Slider.Control class="relative flex-1 flex items-center h-5 cursor-pointer touch-none">
    <!-- Clean, quiet Apple-style track -->
    <Slider.Track class="relative h-1.5 w-full rounded-full bg-black/[0.08] dark:bg-white/[0.12] overflow-hidden">
      <!-- Active filled range -->
      <Slider.Range
        class={cn(
          "h-full rounded-full transition-[width] duration-75 ease-out",
          accent ? "bg-accent" : "bg-neutral-900 dark:bg-white"
        )}
      />
    </Slider.Track>

    <!-- Apple circular knob with refined tactile shadow & press physics -->
    <Slider.Thumb
      index={0}
      aria-label={label}
      class="top-1/2 -translate-y-1/2 h-4.5 w-4.5 rounded-full border border-black/10 dark:border-black/25 bg-white dark:bg-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.18),0_0.5px_1px_rgba(0,0,0,0.08)] cursor-grab active:cursor-grabbing data-[dragging]:cursor-grabbing outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 transition-transform duration-100 hover:scale-110 active:scale-95 flex items-center justify-center"
    >
      <Slider.HiddenInput />
    </Slider.Thumb>
  </Slider.Control>

  {#if showValue}
    <Slider.ValueText class="shrink-0 text-right text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 tabular-nums">
      {value}
      {#if unit}
        <span class="ml-0.5 text-[10px] text-neutral-400 font-normal">
          {unit}
        </span>
      {/if}
    </Slider.ValueText>
  {/if}
</Slider.Root>
