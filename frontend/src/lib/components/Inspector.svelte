<script lang="ts">
  import { Menu } from '@ark-ui/svelte/menu';
  import { ScrollArea } from '@ark-ui/svelte/scroll-area';
  import type { CompressConfig } from '#lib/types';
  import { FORMAT_OPTIONS, RESIZE_MODES } from '#lib/utils';
  import Icon from '@iconify/svelte/offline';

  interface Props {
    spaces: CompressConfig[];
    config: CompressConfig;
    onUpdateConfig: (updated: CompressConfig) => void;
    onDeleteSpace: (id: string) => void;
    onSelectOutputDir: () => void;
    isOpen: boolean;
  }

  let {
    spaces,
    config,
    onUpdateConfig,
    onDeleteSpace,
    onSelectOutputDir,
    isOpen,
  }: Props = $props();

  let isFormatMenuOpen = $state(false);
  let isConfirmingDelete = $state(false);
  let deleteTimer: ReturnType<typeof setTimeout> | null = null;

  function startDelete() {
    isConfirmingDelete = true;
    if (deleteTimer) clearTimeout(deleteTimer);
    deleteTimer = setTimeout(() => {
      isConfirmingDelete = false;
    }, 4000);
  }

  function cancelDelete() {
    if (deleteTimer) clearTimeout(deleteTimer);
    isConfirmingDelete = false;
  }

  function executeDelete() {
    if (deleteTimer) clearTimeout(deleteTimer);
    isConfirmingDelete = false;
    onDeleteSpace(config.id);
  }

  $effect(() => {
    config.id;
    cancelDelete();
  });

  function getQualityDesc(q: number) {
    if (q >= 90) return { label: '极佳画质', color: 'text-emerald-500' };
    if (q >= 75) return { label: '推荐平衡', color: 'text-accent' };
    if (q >= 55) return { label: '高压缩比', color: 'text-blue-500' };
    return { label: '极限体积', color: 'text-rose-500' };
  }

  let qualityDesc = $derived(getQualityDesc(config.quality));

  let formatLabel = $derived(
    FORMAT_OPTIONS.find((f) => f.id === config.format)?.label ?? '选择格式'
  );

  function commit(partial: Partial<CompressConfig>) {
    onUpdateConfig({ ...config, ...partial });
  }

  function toggleExif() {
    commit({ keepExif: !config.keepExif });
  }

  function numberFrom(event: Event) {
    return Number((event.currentTarget as HTMLInputElement).value);
  }
</script>

<!-- Flat, Shadow-Free Desktop Inspector Panel -->
<aside
  data-sidebar="sidebar"
  data-state={isOpen ? 'expanded' : 'closed'}
  class="relative z-50 h-full flex flex-col shrink-0 bg-[#fafafc] dark:bg-[#111215] border-r border-black/[0.06] dark:border-white/[0.07] transition-[width,transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none {isOpen
    ? 'w-76 sm:w-80 translate-x-0 opacity-100'
    : 'w-0 -translate-x-full lg:translate-x-0 lg:border-r-0 lg:opacity-0 overflow-hidden pointer-events-none'}"
>
  <div class="w-76 sm:w-80 h-full flex flex-col min-w-0">
    <!-- 1. SidebarHeader (No collapse button, clean context display) -->
    <div class="h-[44px] px-4 shrink-0 flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.06]">
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          参数配置
        </span>
        <span class="max-w-[130px] truncate text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300">
          {config.name}
        </span>
      </div>
    </div>

    <!-- 2. SidebarContent: Ark ScrollArea — macOS-style overlay scrollbar, no native gutter -->
    <ScrollArea.Root class="grow relative overflow-hidden min-h-0 group/scroll">
      <ScrollArea.Viewport class="h-full overflow-y-auto no-native-scrollbar">
        <div class="px-4 py-4 flex flex-col gap-4 text-xs">
      <!-- 1. 输出格式 (Target Format) -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            目标格式
          </span>
          <span class="text-[10px] font-mono text-neutral-400 uppercase">
            {config.format}
          </span>
        </div>

        <Menu.Root bind:open={isFormatMenuOpen} positioning={{ placement: 'bottom-start', offset: { mainAxis: 4 } }}>
          <Menu.Trigger
            class="w-full h-8 flex items-center justify-between px-3 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] active:bg-black/[0.08] dark:active:bg-white/[0.1] border border-black/[0.07] dark:border-white/[0.08] text-left transition group cursor-pointer"
            title="选择目标格式"
          >
            <span class="text-xs font-medium text-neutral-800 dark:text-neutral-200">
              {formatLabel}
            </span>
            <Icon icon="keyline-icons:chevron-down" height={12} class="text-neutral-400 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Menu.Trigger>

          <Menu.Positioner class="z-[9999] outline-none">
            <Menu.Content class="apple-glass backdrop-blur-2xl w-56 p-1 rounded-xl border border-black/[0.08] dark:border-white/[0.1] animate-scale-in text-xs outline-none">
              {#each FORMAT_OPTIONS as f (f.id)}
                {@const active = config.format === f.id}
                <Menu.Item
                  value={f.id}
                  onSelect={() => commit({ format: f.id })}
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
        </Menu.Root>
      </div>

      <div class="h-px bg-black/[0.05] dark:bg-white/[0.06]"></div>

      <!-- 2. 压缩质量 (Quality Slider) -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            压缩质量
          </span>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] font-medium {qualityDesc.color}">
              {qualityDesc.label}
            </span>
            <span class="font-mono font-bold text-xs tabular-nums text-neutral-800 dark:text-neutral-200">
              {config.quality}%
            </span>
          </div>
        </div>

        <input
          type="range"
          min="10"
          max="100"
          step="1"
          value={config.quality}
          oninput={(e) => commit({ quality: numberFrom(e) })}
          class="apple-slider w-full cursor-pointer"
        />
      </div>

      <div class="h-px bg-black/[0.05] dark:bg-white/[0.06]"></div>

      <!-- 3. EXIF 摄影数据 (only the switch toggles) -->
      <div class="flex items-center justify-between gap-3 py-0.5">
        <div class="flex flex-col min-w-0 pr-2">
          <span class="text-xs font-medium text-neutral-800 dark:text-neutral-200">
            保留 EXIF 摄影数据
          </span>
          <span class="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
            包含相机参数、光圈快门、时间与 GPS
          </span>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={config.keepExif}
          aria-label="保留 EXIF 摄影数据"
          onclick={toggleExif}
          class="w-8 h-4.5 rounded-full p-0.5 flex items-center shrink-0 cursor-pointer transition-colors {config.keepExif
            ? 'bg-emerald-500'
            : 'bg-neutral-300 dark:bg-neutral-600'}"
        >
          <div
            class="w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 {config.keepExif
              ? 'translate-x-3.5'
              : 'translate-x-0'}"
          ></div>
        </button>
      </div>

      <div class="h-px bg-black/[0.05] dark:bg-white/[0.06]"></div>

      <!-- 4. 尺寸缩放 (Resize) -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            尺寸缩放
          </span>
          {#if config.resizeMode !== 'none'}
            <span class="text-[10px] font-mono text-accent font-medium">等比缩放</span>
          {/if}
        </div>

        <div class="grid grid-cols-3 p-0.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] text-xs">
          {#each RESIZE_MODES as mode (mode.id)}
            {@const isActive = config.resizeMode === mode.id}
            <button
              type="button"
              onclick={() => commit({ resizeMode: mode.id })}
              class="py-1 rounded-md text-[11px] font-medium transition {isActive
                ? 'bg-white dark:bg-[#25262b] text-neutral-900 dark:text-white font-semibold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}"
            >
              {mode.label}
            </button>
          {/each}
        </div>

        {#if config.resizeMode === 'width'}
          <div class="flex items-center justify-between gap-2 pt-1">
            <span class="text-xs text-neutral-600 dark:text-neutral-400">指定最大宽度</span>
            <div class="flex items-center gap-1.5">
              <input
                type="number"
                min="50"
                max="10000"
                value={config.width || 1920}
                oninput={(e) => commit({ width: numberFrom(e) })}
                class="w-20 text-xs px-2.5 py-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] text-right font-mono font-semibold text-neutral-900 dark:text-neutral-100 focus:border-accent"
              />
              <span class="text-xs font-mono text-neutral-400">px</span>
            </div>
          </div>
        {/if}

        {#if config.resizeMode === 'height'}
          <div class="flex items-center justify-between gap-2 pt-1">
            <span class="text-xs text-neutral-600 dark:text-neutral-400">指定最大高度</span>
            <div class="flex items-center gap-1.5">
              <input
                type="number"
                min="50"
                max="10000"
                value={config.height || 1080}
                oninput={(e) => commit({ height: numberFrom(e) })}
                class="w-20 text-xs px-2.5 py-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] text-right font-mono font-semibold text-neutral-900 dark:text-neutral-100 focus:border-accent"
              />
              <span class="text-xs font-mono text-neutral-400">px</span>
            </div>
          </div>
        {/if}
      </div>

      <div class="h-px bg-black/[0.05] dark:bg-white/[0.06]"></div>

      <!-- 5. 保存目录与后缀 (Output & Suffix) -->
      <div class="space-y-2">
        <span class="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          保存目录与命名
        </span>

        <div class="grid grid-cols-2 p-0.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] text-xs">
          <button
            type="button"
            onclick={() => commit({ originalOutput: true })}
            class="py-1 rounded-md text-[11px] font-medium transition {config.originalOutput
              ? 'bg-white dark:bg-[#25262b] text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}"
          >
            保存在原目录
          </button>
          <button
            type="button"
            onclick={() => commit({ originalOutput: false })}
            class="py-1 rounded-md text-[11px] font-medium transition {!config.originalOutput
              ? 'bg-white dark:bg-[#25262b] text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}"
          >
            自定义输出目录
          </button>
        </div>

        {#if !config.originalOutput}
          <div class="flex items-center gap-1.5 p-1.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08]">
            <Icon icon="keyline-icons:folder" height={14} class="text-neutral-400 shrink-0 ml-1" />
            <span
              class="grow text-[11px] font-mono truncate text-neutral-700 dark:text-neutral-300"
              title={config.outputDir || '默认保存至桌面'}
            >
              {config.outputDir ? config.outputDir.split(/[/\\]/).pop() || config.outputDir : '默认保存至桌面'}
            </span>
            <button
              type="button"
              onclick={onSelectOutputDir}
              class="h-6 px-2.5 rounded-md bg-white dark:bg-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-200 border border-black/[0.08] dark:border-white/[0.1] hover:bg-neutral-50 dark:hover:bg-neutral-700 shrink-0 transition"
            >
              更改
            </button>
          </div>
        {/if}

        <div class="space-y-1 pt-1">
          <div class="flex items-center justify-between text-xs">
            <span class="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">文件名后缀</span>
            <span class="text-[10px] font-mono text-neutral-400">
              预览: photo<span class="text-accent font-semibold">{config.suffix}</span>.{config.format === 'original' ? 'jpg' : config.format}
            </span>
          </div>
          <input
            type="text"
            value={config.suffix}
            oninput={(e) => commit({ suffix: (e.currentTarget as HTMLInputElement).value })}
            class="w-full h-8 text-xs px-2.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] font-mono font-medium text-neutral-800 dark:text-neutral-200 focus:border-accent"
            placeholder="-min"
          />
        </div>
      </div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="vertical"
        class="absolute top-0 bottom-0 right-0 flex w-2 touch-none select-none p-[3px] opacity-0 transition-opacity duration-200 group-hover/scroll:opacity-100 data-[state=visible]:opacity-100"
      >
        <ScrollArea.Thumb class="w-full min-h-[28px] rounded-full bg-black/[0.18] dark:bg-white/[0.22]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>

    <!-- 3. SidebarFooter: Anti-misclick inline confirmation, zero clutter -->
    <div class="p-3 shrink-0 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between min-h-[49px]">
      {#if isConfirmingDelete}
        <div class="w-full flex items-center justify-between gap-2 animate-fade-in">
          <span class="text-xs text-red-500 font-medium truncate">
            确定删除方案？
          </span>
          <div class="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onclick={cancelDelete}
              class="h-7 px-2.5 rounded-md text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-xs transition"
            >
              取消
            </button>
            <button
              type="button"
              onclick={executeDelete}
              class="h-7 px-3 rounded-md bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium text-xs transition active:scale-95"
            >
              确认删除
            </button>
          </div>
        </div>
      {:else}
        <div class="w-full flex items-center justify-between">
          <button
            type="button"
            onclick={startDelete}
            disabled={spaces.length <= 1}
            class="h-7.5 px-2 flex items-center gap-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-500/10 text-xs font-medium transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-neutral-400 disabled:hover:bg-transparent"
            title={spaces.length <= 1 ? '至少保留一个预设方案，无法删除' : '删除当前预设方案'}
          >
            <Icon icon="keyline-icons:bin" height={13} />
            <span>删除方案</span>
          </button>
        </div>
      {/if}
    </div>
  </div>
</aside>
