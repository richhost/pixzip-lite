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
  class="group relative rounded-2xl apple-card border border-black/[0.05] dark:border-white/[0.07] hover:border-black/[0.1] dark:hover:border-white/[0.15] overflow-hidden flex flex-col transition-all {isSelected
    ? 'ring-2 ring-accent/60 bg-accent/5'
    : ''}"
>
  <!-- Card Image Header -->
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
    class="relative aspect-[4/3] w-full bg-checkerboard overflow-hidden cursor-pointer"
  >
    <img
      src={thumbUrl}
      alt={task.name}
      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
    />

    <!-- Select Checkbox floating top left -->
    <div
      role="presentation"
      class="absolute top-2.5 left-2.5 z-10"
      onclick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onchange={() => onToggleSelect(task.id)}
        class="w-4 h-4 cursor-pointer shadow-sm accent-accent"
      />
    </div>

    <!-- Status Badges floating top right -->
    <div class="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
      {#if task.status === 'completed'}
        <span class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold shadow-md backdrop-blur-md">
          <Icon icon="keyline-icons:circle-check" height={12} class="w-3 h-3" />
          <span>-{savings.percent}%</span>
        </span>
      {:else if task.status === 'processing'}
        <span class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/90 text-white text-[10px] font-bold shadow-md backdrop-blur-md">
          <Icon icon="keyline-icons:refresh-cw" height={12} class="w-3 h-3 animate-spin" />
          <span>处理中</span>
        </span>
      {:else if task.status === 'error'}
        <span class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/90 text-white text-[10px] font-bold shadow-md backdrop-blur-md">
          <Icon icon="keyline-icons:circle-alert" height={12} class="w-3 h-3" />
          <span>失败</span>
        </span>
      {/if}
    </div>

    <!-- Hover overlay with compare prompt -->
    {#if task.status === 'completed'}
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200 text-white gap-2">
        <Icon icon="keyline-icons:eye" height={20} class="w-5 h-5" />
        <span class="text-xs font-semibold">双图对比</span>
      </div>
    {/if}
  </div>

  <!-- Card Body -->
  <div class="p-3 flex flex-col gap-2">
    <div>
      <div class="font-medium text-xs text-[#1d1d1f] dark:text-[#f5f5f7] truncate" title={task.name}>
        {task.name}
      </div>
      <div class="flex items-center justify-between text-[11px] text-neutral-400 mt-1 font-mono">
        <span>{task.originalWidth}×{task.originalHeight}</span>
        <span class="uppercase font-semibold text-[10px] px-1 rounded bg-black/[0.04] dark:bg-white/[0.08]">
          {task.originalFormat}
        </span>
      </div>
    </div>

    <!-- Size Comparison -->
    <div class="flex items-center justify-between text-xs pt-1 border-t border-black/[0.04] dark:border-white/[0.06] font-mono">
      <span class="text-neutral-400">{formatBytes(task.originalSize)}</span>
      {#if task.status === 'completed' && task.compressedSize}
        <span class="font-bold text-emerald-600 dark:text-emerald-400">
          {formatBytes(task.compressedSize)}
        </span>
      {:else}
        <span class="text-neutral-400 text-[11px]">—</span>
      {/if}
    </div>

    <!-- Bottom Actions -->
    <div class="flex items-center justify-between pt-1 border-t border-black/[0.04] dark:border-white/[0.06]">
      <div class="flex items-center gap-1">
        {#if task.status === 'completed'}
          <button
            onclick={() => {
              onRevealInFinder(task.outputPath || task.path);
            }}
            class="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] apple-pressable transition"
            title="在 Finder 中显示"
          >
            <Icon icon="keyline-icons:folder" height={14} class="w-3.5 h-3.5" />
          </button>
        {/if}

        <button
          onclick={() => {
            onCompressSingle(task);
          }}
          disabled={task.status === 'processing'}
          class="p-1.5 rounded-lg text-neutral-400 hover:text-accent hover:bg-accent/10 disabled:opacity-30 apple-pressable transition"
          title={task.status === 'completed' ? '重新压缩' : '开始压缩'}
        >
          {#if task.status === 'completed'}
            <Icon icon="keyline-icons:refresh-cw" height={14} class="w-3.5 h-3.5" />
          {:else}
            <Icon icon="keyline-icons:play-fill" height={14} class="w-3.5 h-3.5" />
          {/if}
        </button>
      </div>

      <button
        onclick={() => {
          onDeleteSingle(task.id);
        }}
        class="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-500/10 apple-pressable transition"
        title="移除任务"
      >
        <Icon icon="keyline-icons:bin" height={14} class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</div>
