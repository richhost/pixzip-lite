<script lang="ts">
  import type { FileTask } from '#lib/types';
  import { formatBytes, calculateSavings, getLocalImageUrl } from '#lib/utils';
  import Icon from '@iconify/svelte/offline';

  interface Props {
    task: FileTask;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onCompressSingle: (task: FileTask) => void;
    onRevealInFinder: (path: string) => void;
    onDeleteSingle: (id: string) => void;
    onCompare: (task: FileTask) => void;
  }

  let {
    task,
    isSelected,
    onToggleSelect,
    onCompressSingle,
    onRevealInFinder,
    onDeleteSingle,
    onCompare,
  }: Props = $props();

  let savings = $derived(
    task.compressedSize
      ? calculateSavings(task.originalSize, task.compressedSize)
      : { percent: 0, diffBytes: 0 }
  );

  let thumbUrl = $derived(getLocalImageUrl(task.outputPath || task.path));
</script>

<div
  class="group relative flex items-center justify-between p-3 sm:p-3.5 rounded-2xl apple-card border border-black/[0.05] dark:border-white/[0.07] hover:border-black/[0.1] dark:hover:border-white/[0.15] transition-all {isSelected
    ? 'ring-2 ring-accent/60 bg-accent/5'
    : ''}"
>
  <!-- Left Side: Checkbox + Thumbnail + Details -->
  <div class="flex items-center gap-3 min-w-0">
    <!-- Select Checkbox -->
    <input
      type="checkbox"
      checked={isSelected}
      onchange={() => onToggleSelect(task.id)}
      class="w-4 h-4 cursor-pointer accent-accent"
    />

    <!-- Thumbnail Preview with Checkerboard -->
    <div
      role="button"
      tabindex="0"
      onclick={() => {
        if (task.status === 'completed') {
          onCompare(task);
        }
      }}
      onkeydown={(e) => {
        if (e.key === 'Enter' && task.status === 'completed') {
          onCompare(task);
        }
      }}
      class="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-checkerboard border border-black/[0.08] dark:border-white/[0.1] cursor-pointer group-hover:shadow-md transition"
    >
      <img
        src={thumbUrl}
        alt={task.name}
        class="w-full h-full object-cover"
        loading="lazy"
      />

      {#if task.status === 'completed'}
        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white">
          <Icon icon="keyline-icons:eye" height={16} class="w-4 h-4" />
        </div>
      {/if}
    </div>

    <!-- Metadata Details -->
    <div class="flex flex-col min-w-0 pr-2">
      <div class="flex items-center gap-2">
        <span class="font-medium text-xs sm:text-sm text-[#1d1d1f] dark:text-[#f5f5f7] truncate max-w-[160px] sm:max-w-xs md:max-w-sm">
          {task.name}
        </span>
        <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.08] text-neutral-400 uppercase font-semibold">
          {task.originalFormat}
        </span>
      </div>

      <div class="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
        <!-- Dimensions -->
        <span class="tabular-nums font-mono">
          {task.originalWidth}×{task.originalHeight}
          {#if task.compressedWidth && (task.compressedWidth !== task.originalWidth || task.compressedHeight !== task.originalHeight)}
            <span class="text-neutral-500">→</span>
            <span class="text-accent font-semibold">{task.compressedWidth}×{task.compressedHeight}</span>
          {/if}
        </span>

        <span>•</span>

        <!-- Original Size -->
        <span class="tabular-nums font-mono">{formatBytes(task.originalSize)}</span>

        {#if task.status === 'completed' && task.compressedSize}
          <span class="text-neutral-500">→</span>
          <span class="tabular-nums font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            {formatBytes(task.compressedSize)}
          </span>
          {#if task.durationMs}
            <span class="hidden sm:inline text-[10px] text-neutral-500">({task.durationMs}ms)</span>
          {/if}
        {/if}
      </div>
    </div>
  </div>

  <!-- Right Side: Status Badge & Actions -->
  <div class="flex items-center gap-2 sm:gap-3 shrink-0">
    <!-- Status Indicator -->
    {#if task.status === 'idle'}
      <span class="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-medium">
        待处理
      </span>
    {:else if task.status === 'processing'}
      <div class="flex items-center gap-1.5 text-xs text-accent font-medium">
        <Icon icon="keyline-icons:refresh-cw" height={14} class="w-3.5 h-3.5 animate-spin" />
        <span class="tabular-nums text-[11px] hidden sm:inline">压缩中...</span>
      </div>
    {:else if task.status === 'completed'}
      <div class="flex items-center gap-1.5">
        <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tabular-nums">
          <Icon icon="keyline-icons:circle-check" height={14} class="w-3.5 h-3.5" />
          <span>-{savings.percent}%</span>
        </div>
      </div>
    {:else if task.status === 'error'}
      <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-medium" title={task.error}>
        <Icon icon="keyline-icons:circle-alert" height={14} class="w-3.5 h-3.5" />
        <span class="hidden sm:inline text-[10px] max-w-[80px] truncate">失败</span>
      </div>
    {/if}

    <!-- Action Buttons -->
    <div class="flex items-center gap-1">
      {#if task.status === 'completed'}
        <!-- Compare Button -->
        <button
          onclick={() => {
            onCompare(task);
          }}
          class="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-100 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] apple-pressable transition"
          title="双图前后对比滑块"
        >
          <Icon icon="keyline-icons:eye" height={16} class="w-4 h-4" />
        </button>

        <!-- Reveal in Finder -->
        <button
          onclick={() => {
            onRevealInFinder(task.outputPath || task.path);
          }}
          class="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-100 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] apple-pressable transition"
          title="在 Finder 中显示输出文件"
        >
          <Icon icon="keyline-icons:folder" height={16} class="w-4 h-4" />
        </button>
      {/if}

      <!-- Recompress / Compress Single -->
      <button
        onclick={() => {
          onCompressSingle(task);
        }}
        disabled={task.status === 'processing'}
        class="p-1.5 rounded-lg text-neutral-500 hover:text-accent hover:bg-accent/10 disabled:opacity-30 apple-pressable transition"
        title={task.status === 'completed' ? '重新压缩' : '压缩此图片'}
      >
        {#if task.status === 'completed'}
          <Icon icon="keyline-icons:refresh-cw" height={16} class="w-4 h-4" />
        {:else}
          <Icon icon="keyline-icons:play-fill" height={16} class="w-4 h-4" />
        {/if}
      </button>

      <!-- Delete Single -->
      <button
        onclick={() => {
          onDeleteSingle(task.id);
        }}
        class="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-500/10 apple-pressable transition"
        title="移除任务"
      >
        <Icon icon="keyline-icons:bin" height={16} class="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
