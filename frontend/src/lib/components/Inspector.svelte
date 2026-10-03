<script lang="ts">
  import { ScrollArea } from '@ark-ui/svelte/scroll-area';
  import type { CompressConfig } from '#lib/types';
  import { formatOptions, resizeModes } from '#lib/options.svelte';
  import Icon from '@iconify/svelte/offline';
  import Slider from '#lib/components/Slider.svelte';

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
    if (q >= 90) return { label: '极佳', color: 'text-emerald-500' };
    if (q >= 75) return { label: '平衡', color: 'text-neutral-700 dark:text-neutral-300' };
    if (q >= 55) return { label: '紧凑', color: 'text-blue-500' };
    return { label: '极限', color: 'text-rose-500' };
  }

  let qualityDesc = $derived(getQualityDesc(config.quality));

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
    <!-- 1. SidebarHeader: Clean title matching titlebar height -->
    <div class="h-[44px] px-4 shrink-0 flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.06]">
      <div class="flex items-center gap-2 min-w-0">
        <Icon icon="keyline-icons:sliders-horizontal" height={14} class="text-neutral-500 dark:text-neutral-400 shrink-0" />
        <span class="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          检查器
        </span>
      </div>
      <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400 font-semibold uppercase">
        {config.format}
      </span>
    </div>

    <!-- 2. SidebarContent: Ark ScrollArea -->
    <ScrollArea.Root class="grow relative overflow-hidden min-h-0 group/scroll">
      <ScrollArea.Viewport class="h-full overflow-y-auto no-native-scrollbar">
        <div class="px-4 py-4 flex flex-col gap-4.5 text-xs">
          <!-- 1. 名称 -->
          <div class="space-y-1.5">
            <label for="space-name-input" class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              名称
            </label>
            <div class="relative flex items-center group">
              <input
                id="space-name-input"
                type="text"
                value={config.name}
                oninput={(e) => commit({ name: (e.currentTarget as HTMLInputElement).value })}
                class="w-full h-7.5 text-xs pl-2.5 pr-8 rounded-md bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 font-medium text-neutral-800 dark:text-neutral-200 hover:border-black/20 dark:hover:border-white/20 focus:border-neutral-400 dark:focus:border-neutral-500 focus:bg-white dark:focus:bg-[#18191d] transition-colors duration-120"
                placeholder="例如：电商主图 / 微信头像"
              />
              <Icon icon="keyline-icons:pen" height={12} class="absolute right-2.5 text-neutral-400 group-focus-within:text-neutral-700 dark:group-focus-within:text-neutral-200 pointer-events-none transition-colors duration-120" />
            </div>
          </div>

          <!-- 2. 格式 -->
          <div class="space-y-1.5">
            <span class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              格式
            </span>
            <div class="grid grid-cols-5 p-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.03] dark:border-white/[0.04] text-xs">
              {#each formatOptions() as f (f.id)}
                {@const isActive = config.format === f.id}
                <button
                  type="button"
                  onclick={() => commit({ format: f.id })}
                  class="h-6.5 flex items-center justify-center rounded-[5px] text-[11px] font-medium transition-all duration-120 cursor-pointer {isActive
                    ? 'bg-white dark:bg-[#222328] text-neutral-900 dark:text-neutral-100 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 active:scale-[0.98]'}"
                  title={f.label}
                >
                  {f.id === 'original' ? '原格式' : f.label}
                </button>
              {/each}
            </div>
          </div>

          <!-- 3. 质量 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                质量
              </span>
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400">
                  {qualityDesc.label}
                </span>
                <span class="font-mono font-semibold text-xs tabular-nums text-neutral-800 dark:text-neutral-200">
                  {config.quality}%
                </span>
              </div>
            </div>

            <Slider
              min={10}
              max={100}
              step={1}
              value={config.quality}
              onchange={(q) => commit({ quality: q })}
              label="质量"
              class="w-full"
            />
          </div>

          <!-- 4. 保留 EXIF 信息 (Flat row, no card wrapping) -->
          <div class="flex items-center justify-between py-1">
            <label for="exif-switch" class="flex items-center gap-2 min-w-0 cursor-pointer select-none">
              <Icon icon="keyline-icons:camera" height={14} class="text-neutral-400 dark:text-neutral-500 shrink-0" />
              <span class="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                保留 EXIF
              </span>
            </label>

            <button
              id="exif-switch"
              type="button"
              role="switch"
              aria-label="保留 EXIF"
              aria-checked={config.keepExif}
              onclick={toggleExif}
              class="w-7.5 h-4.5 rounded-full p-0.5 flex items-center shrink-0 transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 {config.keepExif
                ? 'bg-emerald-500'
                : 'bg-neutral-300 dark:bg-neutral-600'}"
            >
              <div
                class="w-3.5 h-3.5 rounded-full bg-white transition-transform duration-150 shadow-xs {config.keepExif
                  ? 'translate-x-3'
                  : 'translate-x-0'}"
              ></div>
            </button>
          </div>

          <!-- 5. 尺寸 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                尺寸
              </span>
              {#if config.resizeMode !== 'none'}
                <span class="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                  等比
                </span>
              {/if}
            </div>

            <div class="grid grid-cols-3 p-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.03] dark:border-white/[0.04] text-xs">
              {#each resizeModes() as mode (mode.id)}
                {@const isActive = config.resizeMode === mode.id}
                <button
                  type="button"
                  onclick={() => commit({ resizeMode: mode.id })}
                  class="h-6.5 flex items-center justify-center rounded-[5px] text-[11px] font-medium transition-all duration-120 cursor-pointer {isActive
                    ? 'bg-white dark:bg-[#222328] text-neutral-900 dark:text-neutral-100 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 active:scale-[0.98]'}"
                >
                  {mode.label}
                </button>
              {/each}
            </div>

            {#if config.resizeMode === 'width'}
              <div class="relative flex items-center pt-0.5">
                <input
                  type="number"
                  min="50"
                  max="10000"
                  value={config.width || 1920}
                  oninput={(e) => commit({ width: numberFrom(e) })}
                  class="w-full h-7.5 text-xs pl-2.5 pr-8 rounded-md bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 font-mono font-medium text-neutral-800 dark:text-neutral-200 hover:border-black/20 dark:hover:border-white/20 focus:border-neutral-400 dark:focus:border-neutral-500 focus:bg-white dark:focus:bg-[#18191d] transition-colors duration-120 text-right"
                  placeholder="指定最大宽度"
                />
                <span class="absolute right-2.5 text-xs font-mono text-neutral-400 pointer-events-none">px</span>
              </div>
            {/if}

            {#if config.resizeMode === 'height'}
              <div class="relative flex items-center pt-0.5">
                <input
                  type="number"
                  min="50"
                  max="10000"
                  value={config.height || 1080}
                  oninput={(e) => commit({ height: numberFrom(e) })}
                  class="w-full h-7.5 text-xs pl-2.5 pr-8 rounded-md bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 font-mono font-medium text-neutral-800 dark:text-neutral-200 hover:border-black/20 dark:hover:border-white/20 focus:border-neutral-400 dark:focus:border-neutral-500 focus:bg-white dark:focus:bg-[#18191d] transition-colors duration-120 text-right"
                  placeholder="指定最大高度"
                />
                <span class="absolute right-2.5 text-xs font-mono text-neutral-400 pointer-events-none">px</span>
              </div>
            {/if}
          </div>

          <!-- 6. 保存目录 -->
          <div class="space-y-1.5">
            <span class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              保存目录
            </span>
            <div class="grid grid-cols-2 p-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.03] dark:border-white/[0.04] text-xs">
              <button
                type="button"
                onclick={() => commit({ originalOutput: true })}
                class="h-6.5 flex items-center justify-center rounded-[5px] text-[11px] font-medium transition-all duration-120 cursor-pointer {config.originalOutput
                  ? 'bg-white dark:bg-[#222328] text-neutral-900 dark:text-neutral-100 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 active:scale-[0.98]'}"
              >
                原目录
              </button>
              <button
                type="button"
                onclick={() => commit({ originalOutput: false })}
                class="h-6.5 flex items-center justify-center rounded-[5px] text-[11px] font-medium transition-all duration-120 cursor-pointer {!config.originalOutput
                  ? 'bg-white dark:bg-[#222328] text-neutral-900 dark:text-neutral-100 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 active:scale-[0.98]'}"
              >
                自定义
              </button>
            </div>

            {#if !config.originalOutput}
              <div
                class="w-full h-7.5 flex items-center justify-between pl-2.5 pr-1.5 rounded-md bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 transition-colors duration-120"
                title={config.outputDir || '默认保存在系统「文档」目录下的 pixzip-lite 文件夹'}
              >
                <div class="flex items-center gap-2 min-w-0 pr-2">
                  <Icon icon="keyline-icons:folder" height={13} class="text-neutral-400 dark:text-neutral-500 shrink-0" />
                  <span class="text-xs font-mono truncate text-neutral-700 dark:text-neutral-300 select-none">
                    {config.outputDir ? config.outputDir.split(/[/\\]/).pop() || config.outputDir : '文档/pixzip-lite (默认)'}
                  </span>
                </div>
                <button
                  type="button"
                  onclick={onSelectOutputDir}
                  class="h-5.5 px-2 rounded text-[11px] font-medium bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-neutral-700 dark:text-neutral-300 transition-all duration-120 active:scale-95 cursor-pointer shrink-0"
                >
                  更改
                </button>
              </div>
            {/if}
          </div>

          <!-- 7. 后缀 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                后缀
              </span>
              {#if config.suffix}
                <span class="text-[10px] font-mono text-neutral-400">
                  photo<span class="text-neutral-700 dark:text-neutral-300 font-semibold">{config.suffix}</span>.{config.format === 'original' ? 'jpg' : config.format}
                </span>
              {/if}
            </div>
            <div class="relative flex items-center">
              <input
                type="text"
                value={config.suffix}
                oninput={(e) => commit({ suffix: (e.currentTarget as HTMLInputElement).value })}
                class="w-full h-7.5 text-xs pl-2.5 pr-14 rounded-md bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 font-mono font-medium text-neutral-800 dark:text-neutral-200 hover:border-black/20 dark:hover:border-white/20 focus:border-neutral-400 dark:focus:border-neutral-500 focus:bg-white dark:focus:bg-[#18191d] transition-colors duration-120"
                placeholder="-min"
              />
              <div class="absolute right-1.5 flex items-center">
                {#if config.suffix}
                  <button
                    type="button"
                    onclick={() => commit({ suffix: '' })}
                    class="h-5 px-1.5 rounded text-[10px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-95 transition-all duration-120 cursor-pointer"
                  >
                    无
                  </button>
                {:else}
                  <button
                    type="button"
                    onclick={() => commit({ suffix: '-min' })}
                    class="h-5 px-1.5 rounded text-[10px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-95 transition-all duration-120 cursor-pointer"
                  >
                    -min
                  </button>
                {/if}
              </div>
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

    <!-- 3. SidebarFooter: Clean footer matching titlebar height -->
    <div class="h-[44px] px-4 shrink-0 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
      {#if isConfirmingDelete}
        <div class="w-full flex items-center justify-between gap-2 animate-fade-in">
          <span class="text-xs text-red-500 font-medium truncate">
            确定删除？
          </span>
          <div class="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onclick={cancelDelete}
              class="h-7 px-2.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-xs transition active:scale-95"
            >
              取消
            </button>
            <button
              type="button"
              onclick={executeDelete}
              class="h-7 px-3 rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium text-xs transition active:scale-95 shadow-xs"
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
            class="h-7 px-2 -ml-1 flex items-center gap-1.5 rounded-lg text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/8 text-xs font-medium transition-colors duration-120 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-neutral-400 disabled:hover:bg-transparent cursor-pointer"
            title={spaces.length <= 1 ? '至少保留一个预设，无法删除' : '删除当前预设'}
          >
            <Icon icon="keyline-icons:bin" height={13} />
            <span>删除方案</span>
          </button>
          <span class="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 tabular-nums">
            {spaces.length} 个预设
          </span>
        </div>
      {/if}
    </div>
  </div>
</aside>
