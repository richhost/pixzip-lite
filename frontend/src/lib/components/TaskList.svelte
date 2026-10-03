<script lang="ts">
  import { SvelteSet } from 'svelte/reactivity';
  import type { FileTask, ViewMode, FilterStatus } from '#lib/types';
  import { formatBytes, summarizeTasks } from '#lib/utils';
  import TaskItem from '#lib/components/TaskItem.svelte';
  import TaskCard from '#lib/components/TaskCard.svelte';
  import Icon from '@iconify/svelte/offline';

  interface Props {
    tasks: FileTask[];
    onCompressSingle: (task: FileTask) => void;
    onRevealInFinder: (path: string) => void;
    onDeleteSingle: (id: string) => void;
    onCompare: (task: FileTask) => void;
    onBatchCompress: (ids: string[]) => void;
    onBatchDelete: (ids: string[]) => void;
  }

  let {
    tasks,
    onCompressSingle,
    onRevealInFinder,
    onDeleteSingle,
    onCompare,
    onBatchCompress,
    onBatchDelete,
  }: Props = $props();

  let viewMode = $state<ViewMode>('list');
  let filterStatus = $state<FilterStatus>('all');
  const selectedIds = new SvelteSet<string>();

  let summary = $derived(summarizeTasks(tasks));
  let filteredTasks = $derived(filterStatus === 'all' ? tasks : tasks.filter((task) => task.status === filterStatus));
  let selectedExistingIds = $derived(tasks.filter((task) => selectedIds.has(task.id)).map((task) => task.id));
  let isAllSelected = $derived(filteredTasks.length > 0 && filteredTasks.every((task) => selectedIds.has(task.id)));

  function toggleSelectAll() {
    const selectAll = !isAllSelected;
    selectedIds.clear();
    if (selectAll) {
      for (const task of filteredTasks) selectedIds.add(task.id);
    }
  }

  function toggleSelect(id: string) {
    if (selectedIds.has(id)) selectedIds.delete(id);
    else selectedIds.add(id);
  }

  function handleBatchCompressClick() {
    if (selectedExistingIds.length === 0) return;
    onBatchCompress(selectedExistingIds);
  }

  function handleBatchDeleteClick() {
    if (selectedExistingIds.length === 0) return;
    onBatchDelete(selectedExistingIds);
    selectedIds.clear();
  }
</script>

<div class="flex flex-col gap-4 w-full">
  <!-- Top Stats Summary Banner -->
  <div class="apple-card rounded-2xl p-4 sm:p-5 border border-black/[0.05] dark:border-white/[0.07] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <!-- Left Stats Numbers -->
    <div class="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
      <div>
        <div class="text-neutral-400 dark:text-neutral-500 text-[11px] font-medium">任务总数</div>
        <div class="font-bold text-sm sm:text-base text-[#121316] dark:text-[#f4f4f6] tabular-nums font-mono">
          {summary.total} <span class="text-xs font-normal text-neutral-400">张</span>
        </div>
      </div>

      <div class="h-6 w-px bg-black/[0.06] dark:bg-white/[0.08] hidden sm:block"></div>

      <div>
        <div class="text-neutral-400 dark:text-neutral-500 text-[11px] font-medium">原始体积</div>
        <div class="font-bold text-sm sm:text-base text-[#121316] dark:text-[#f4f4f6] tabular-nums font-mono">
          {formatBytes(summary.originalBytes)}
        </div>
      </div>

      {#if summary.sizedCompletions > 0}
        <div class="h-6 w-px bg-black/[0.06] dark:bg-white/[0.08] hidden sm:block"></div>

        <div>
          <div class="text-neutral-400 dark:text-neutral-500 text-[11px] font-medium">压缩后体积</div>
          <div class="font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
            {formatBytes(summary.compressedBytes)}
          </div>
        </div>

        <div class="h-6 w-px bg-black/[0.06] dark:bg-white/[0.08] hidden sm:block"></div>

        <div class="flex items-center gap-2">
          <div>
            <div class="text-neutral-400 dark:text-neutral-500 text-[11px] font-medium">已节省空间</div>
            <div class="font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 tabular-nums font-mono flex items-center gap-1.5">
              <span>{formatBytes(summary.savedBytes)}</span>
              <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">-{summary.savingsPercent}%</span>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Right Controls: View Mode & Filter Tabs -->
    <div class="flex items-center gap-2.5 self-end sm:self-center">
      <!-- Filter Segmented Tabs -->
      <div class="flex items-center p-0.5 rounded-full bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06] text-xs">
        {@render filterTab('all', '全部', summary.total)}
        {@render filterTab('completed', '完成', summary.completed)}
        {@render filterTab('idle', '待处理', summary.idle)}
      </div>

      <!-- View Mode Buttons -->
      <div class="flex items-center p-0.5 rounded-full bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06]">
        <button
          onclick={() => {
            viewMode = 'list';
          }}
          class="p-1 rounded-full transition {viewMode === 'list'
            ? 'bg-white dark:bg-[#2c2c2e] text-[#121316] dark:text-[#f4f4f6] shadow-xs'
            : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}"
          title="列表视图"
        >
          <Icon icon="keyline-icons:list" height={15} />
        </button>
        <button
          onclick={() => {
            viewMode = 'grid';
          }}
          class="p-1 rounded-full transition {viewMode === 'grid'
            ? 'bg-white dark:bg-[#2c2c2e] text-[#121316] dark:text-[#f4f4f6] shadow-xs'
            : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}"
          title="网格画廊视图"
        >
          <Icon icon="keyline-icons:grid-2x2" height={15} />
        </button>
      </div>
    </div>
  </div>

  <!-- Batch Action Toolbar (When items selected) -->
  {#if selectedExistingIds.length > 0}
    <div class="apple-card rounded-2xl px-4 py-2.5 border border-black/[0.08] dark:border-white/[0.1] shadow-lg flex items-center justify-between animate-fade-in text-xs">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span class="font-semibold text-neutral-800 dark:text-neutral-200">已勾选 {selectedExistingIds.length} 项</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          onclick={handleBatchCompressClick}
          class="pill-btn-black !h-7 !py-0 !px-3 text-xs"
        >
          <Icon icon="keyline-icons:play-fill" height={11} class="" />
          <span>压缩所选</span>
        </button>
        <button
          onclick={handleBatchDeleteClick}
          class="pill-btn-secondary !h-7 !py-0 !px-3 text-xs !text-red-500 hover:!bg-red-500/10"
        >
          <Icon icon="keyline-icons:bin" height={12} />
          <span>移除</span>
        </button>
      </div>
    </div>
  {/if}

  <!-- Selection Header Row -->
  <div class="flex items-center justify-between px-2 text-[11px] text-neutral-400">
    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={isAllSelected}
        onchange={toggleSelectAll}
        class="w-3.5 h-3.5 cursor-pointer accent-accent"
      />
      <span>全选当前筛选列表 ({filteredTasks.length})</span>
    </label>

    <span>点击图片可打开前后画质对比滑块</span>
  </div>

  <!-- Task Content: List or Grid -->
  {#if viewMode === 'list'}
    <div class="flex flex-col gap-2">
      {#each filteredTasks as task (task.id)}
        <TaskItem
          {task}
          isSelected={selectedIds.has(task.id)}
          onToggleSelect={toggleSelect}
          {onCompressSingle}
          {onRevealInFinder}
          {onDeleteSingle}
          {onCompare}
        />
      {/each}
    </div>
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {#each filteredTasks as task (task.id)}
        <TaskCard
          {task}
          isSelected={selectedIds.has(task.id)}
          onToggleSelect={toggleSelect}
          {onCompressSingle}
          {onRevealInFinder}
          {onDeleteSingle}
          {onCompare}
        />
      {/each}
    </div>
  {/if}
</div>

{#snippet filterTab(status: FilterStatus, label: string, count: number)}
  <button
    onclick={() => {
      filterStatus = status;
    }}
    class="px-2.5 py-1 rounded-lg transition active:bg-black/[0.06] dark:active:bg-white/[0.12] {filterStatus === status
      ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm font-semibold'
      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'}"
  >
    {label} ({count})
  </button>
{/snippet}
