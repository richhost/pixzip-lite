<script lang="ts">
  import { Menu } from '@ark-ui/svelte/menu';
  import { Portal } from '@ark-ui/svelte/portal';
  import type { CompressConfig, ImageFormat, ResizeMode } from '#lib/types';
  import { formatOptions, resizeModes } from '#lib/options.svelte';
  import Icon from '@iconify/svelte/offline';
  import Slider from '#lib/components/Slider.svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (space: CompressConfig) => void;
  }

  let { isOpen, onClose, onSave }: Props = $props();

  let name = $state('');
  let format = $state<ImageFormat>('webp');
  let quality = $state(80);
  let resizeMode = $state<ResizeMode>('none');
  let width = $state<number>(1920);
  let height = $state<number>(1080);
  let suffix = $state('-custom');
  let keepExif = $state(false);
  let isFormatMenuOpen = $state(false);
  let nameInput = $state<HTMLInputElement | null>(null);

  // The name field is what you are here to type; preselect the default so typing replaces it.
  $effect(() => {
    if (isOpen) {
      name = '我的自定义方案';
      nameInput?.focus();
      nameInput?.select();
    }
  });

  const FORMAT_OPTIONS = $derived(formatOptions());
  const RESIZE_MODES = $derived(resizeModes());

  let formatLabel = $derived(
    FORMAT_OPTIONS.find((f) => f.id === format)?.label ?? '选择格式'
  );

  function handleKeydown(event: KeyboardEvent) {
    if (isOpen && event.key === 'Escape') onClose();
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const newSpace: CompressConfig = {
      id: `custom-${Date.now()}`,
      name: name.trim() || '自定义方案',
      description: '用户自定义配置方案',
      format,
      quality,
      resizeMode,
      width: resizeMode === 'width' ? width : undefined,
      height: resizeMode === 'height' ? height : undefined,
      suffix,
      keepExif,
      originalOutput: true,
      isCustom: true,
    };
    onSave(newSpace);
    onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="space-modal-title"
    tabindex="-1"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xl animate-fade-in select-none"
    onclick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
    onkeydown={(e) => {
      if (e.key === 'Escape') onClose();
    }}
  >
    <div class="relative w-full max-w-md apple-card rounded-squircle-lg border border-black/[0.08] dark:border-white/[0.12] shadow-2xl overflow-hidden p-6 animate-scale-in">
      <div class="flex items-center justify-between pb-3.5 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded-xl bg-accent/10 text-accent">
            <Icon icon="keyline-icons:sparkles" height={16} class="w-4 h-4" />
          </div>
          <h3 id="space-modal-title" class="font-semibold text-headline text-[#1d1d1f] dark:text-[#f5f5f7]">
            新建预设
          </h3>
        </div>
        <button
          type="button"
          onclick={onClose}
          class="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
          <Icon icon="keyline-icons:x" height={16} class="w-4 h-4" />
        </button>
      </div>

      <form onsubmit={handleSubmit} class="mt-4 flex flex-col gap-4 text-xs">
        <div class="space-y-1.5">
          <label class="block text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider" for="custom-name">
            名称
          </label>
          <input
            id="custom-name"
            type="text"
            required
            spellcheck="false"
            bind:this={nameInput}
            bind:value={name}
            class="w-full h-8 px-2.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] text-neutral-800 dark:text-neutral-200 font-medium focus:border-accent"
            placeholder="例如：电商主图 800px / 微信封面"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <span class="block text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              格式
            </span>
            <Menu.Root bind:open={isFormatMenuOpen} positioning={{ placement: 'bottom-start', offset: { mainAxis: 4 } }}>
              <Menu.Trigger
                type="button"
                class="w-full h-8 flex items-center justify-between px-2.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] active:bg-black/[0.08] dark:active:bg-white/[0.1] border border-black/[0.08] dark:border-white/[0.1] text-left transition group cursor-pointer"
                title="格式"
              >
                <span class="text-xs font-medium text-neutral-800 dark:text-neutral-200">{formatLabel}</span>
                <Icon icon="keyline-icons:chevron-down" height={12} class="text-neutral-400 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Menu.Trigger>

              <Portal>
                <Menu.Positioner class="outline-none">
                  <!-- z on Content, not Positioner: zag writes `z-index: var(--z-index)` inline on
                       the positioner, so a class there can never win. Portal keeps the menu out of
                       the card's overflow-hidden. -->
                  <Menu.Content class="apple-glass backdrop-blur-2xl z-[9999] w-48 p-1 rounded-xl animate-scale-in text-xs outline-none">
                    {#each FORMAT_OPTIONS as f (f.id)}
                      {@const active = format === f.id}
                      <Menu.Item
                        value={f.id}
                        onSelect={() => {
                          format = f.id;
                          isFormatMenuOpen = false;
                        }}
                        class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg outline-none transition cursor-pointer data-[highlighted]:bg-black/[0.05] dark:data-[highlighted]:bg-white/[0.08] {active
                          ? 'font-semibold text-neutral-900 dark:text-white'
                          : 'text-neutral-700 dark:text-neutral-300'}"
                      >
                        <span class="text-xs">{f.label}</span>
                        {#if active}
                          <Icon icon="keyline-icons:check" height={13} class="text-neutral-900 dark:text-white shrink-0" />
                        {/if}
                      </Menu.Item>
                    {/each}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="block text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                质量
              </span>
              <span class="font-mono font-bold text-xs tabular-nums text-neutral-800 dark:text-neutral-200">
                {quality}%
              </span>
            </div>
            <Slider
              min={10}
              max={100}
              step={1}
              bind:value={quality}
              label="质量"
              class="w-full"
            />
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="block text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              尺寸
            </span>
            {#if resizeMode !== 'none'}
              <span class="text-[10px] font-mono text-accent font-medium">等比</span>
            {/if}
          </div>

          <div class="grid grid-cols-3 p-0.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] text-xs">
            {#each RESIZE_MODES as mode (mode.id)}
              {@const isActive = resizeMode === mode.id}
              <button
                type="button"
                onclick={() => (resizeMode = mode.id)}
                class="py-1 rounded-md text-[11px] font-medium transition {isActive
                  ? 'bg-white dark:bg-[#25262b] text-neutral-900 dark:text-white font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}"
              >
                {mode.label}
              </button>
            {/each}
          </div>

          {#if resizeMode === 'width' || resizeMode === 'height'}
            <div class="flex items-center justify-between gap-2 pt-1">
              <span class="text-xs text-neutral-600 dark:text-neutral-400">
                指定最大{resizeMode === 'width' ? '宽度' : '高度'}
              </span>
              <div class="flex items-center gap-1.5">
                <input
                  type="number"
                  min="50"
                  max="10000"
                  aria-label="缩放目标像素"
                  value={resizeMode === 'width' ? width : height}
                  oninput={(e) => {
                    const px = Number(e.currentTarget.value);
                    if (resizeMode === 'width') width = px;
                    else height = px;
                  }}
                  class="w-20 text-xs px-2.5 py-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] text-right font-mono font-semibold text-neutral-900 dark:text-neutral-100 focus:border-accent"
                />
                <span class="text-xs font-mono text-neutral-400">px</span>
              </div>
            </div>
          {/if}
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider" for="custom-suffix">
              后缀
            </label>
            <span class="text-[10px] font-mono text-neutral-400">
              预览: photo<span class="text-accent font-semibold">{suffix}</span>.{format === 'original' ? 'jpg' : format}
            </span>
          </div>
          <input
            id="custom-suffix"
            type="text"
            spellcheck="false"
            bind:value={suffix}
            class="w-full h-8 text-xs px-2.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] font-mono font-medium text-neutral-800 dark:text-neutral-200 focus:border-accent"
            placeholder="-custom"
          />
        </div>

        <div class="flex items-center justify-between gap-3 pt-1">
          <span class="text-xs font-medium text-neutral-800 dark:text-neutral-200">保留 EXIF</span>
          <button
            type="button"
            role="switch"
            aria-checked={keepExif}
            aria-label="保留 EXIF"
            onclick={() => (keepExif = !keepExif)}
            class="w-8 h-4.5 rounded-full p-0.5 flex items-center shrink-0 cursor-pointer transition-colors {keepExif
              ? 'bg-emerald-500'
              : 'bg-neutral-300 dark:bg-neutral-600'}"
          >
            <div
              class="w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 {keepExif
                ? 'translate-x-3.5'
                : 'translate-x-0'}"
            ></div>
          </button>
        </div>

        <div class="flex items-center justify-end gap-2 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
          <button
            type="button"
            onclick={onClose}
            class="h-8 px-3.5 rounded-full text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.07] transition"
          >
            取消
          </button>
          <button type="submit" class="pill-btn-black !h-8 !py-0 !px-3.5 text-xs">
            <Icon icon="keyline-icons:check" height={13} class="w-3.5 h-3.5" />
            <span>创建</span>
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
