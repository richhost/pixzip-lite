<script lang="ts">
  import { onMount } from 'svelte';
  import { Window, Events, System } from '@wailsio/runtime';
  import { Menu } from '@ark-ui/svelte/menu';
  import { Portal } from '@ark-ui/svelte/portal';
  import type { CompressConfig } from '#lib/types';
  import Icon from '@iconify/svelte/offline';

  interface Props {
    spaces: CompressConfig[];
    currentSpace: CompressConfig;
    onSelectSpace: (space: CompressConfig) => void;
    onOpenNewSpaceModal: () => void;
    taskCount: number;
    pendingCount: number;
    completedCount: number;
    isProcessing: boolean;
    onSelectFiles: () => void;
    onSelectFolder: () => void;
    onStartAll: () => void;
    onExportZip: () => void;
    onOpenAbout: () => void;
    onToggleInspector: () => void;
    isInspectorOpen: boolean;
  }

  let {
    spaces,
    currentSpace,
    onSelectSpace,
    onOpenNewSpaceModal,
    taskCount,
    pendingCount,
    completedCount,
    isProcessing,
    onSelectFiles,
    onSelectFolder,
    onStartAll,
    onExportZip,
    onOpenAbout,
    onToggleInspector,
    isInspectorOpen,
  }: Props = $props();

  function checkIsMac(): boolean {
    if (typeof navigator !== 'undefined') {
      const platform = (navigator as any).userAgentData?.platform || navigator.platform || '';
      const ua = navigator.userAgent || '';
      if (/Mac/i.test(platform) || /Macintosh|Mac OS X/i.test(ua)) {
        return true;
      }
    }
    try {
      if (System.IsMac()) return true;
    } catch {}
    return false;
  }

  function checkIsWindows(): boolean {
    if (typeof navigator !== 'undefined') {
      const platform = (navigator as any).userAgentData?.platform || navigator.platform || '';
      const ua = navigator.userAgent || '';
      if (/Win/i.test(platform) || /Windows/i.test(ua)) {
        return true;
      }
    }
    try {
      if (System.IsWindows()) return true;
    } catch {}
    return false;
  }

  let isMac = $state(checkIsMac());
  let isWindows = $state(checkIsWindows());
  let isFullscreen = $state(false);
  let isSpaceMenuOpen = $state(false);
  let isAddMenuOpen = $state(false);
  let isMaximised = $state(false);

  onMount(() => {
    try {
      if (System.IsMac()) {
        isMac = true;
        isWindows = false;
      } else if (System.IsWindows()) {
        isWindows = true;
        isMac = false;
      }

      Window.IsMaximised().then((val) => {
        isMaximised = val;
      });
      Window.IsFullscreen().then((val) => {
        isFullscreen = val;
      });
    } catch {
      // In standalone browser preview or dev mock
    }

    const unregs = [
      Events.On('common:WindowMaximise', () => { isMaximised = true; }),
      Events.On('windows:WindowMaximise', () => { isMaximised = true; }),
      Events.On('common:WindowUnMaximise', () => { isMaximised = false; }),
      Events.On('windows:WindowUnMaximise', () => { isMaximised = false; }),
      Events.On('common:WindowRestore', () => { isMaximised = false; }),
      Events.On('windows:WindowRestore', () => { isMaximised = false; }),
      Events.On('common:WindowFullscreen', () => { isFullscreen = true; }),
      Events.On('common:WindowUnFullscreen', () => { isFullscreen = false; }),
    ];

    return () => {
      unregs.forEach((fn) => fn?.());
    };
  });

  function onSpaceMenuSelect(event: { value: string }) {
    const space = spaces.find((s) => s.id === event.value);
    if (space) onSelectSpace(space);
  }

  function onAddSelect(event: { value: string }) {
    if (event.value === 'files') onSelectFiles();
    else if (event.value === 'folder') onSelectFolder();
  }

  function onHeaderDblClick(event: MouseEvent) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest('header.drag-region')) return;
    if (target.closest('.no-drag-region')) return;
    handleToggleMaximise();
  }

  function handleMinimise() {
    try {
      Window.Minimise();
    } catch (e) {
      console.warn('Minimise error:', e);
    }
  }

  async function handleToggleMaximise() {
    try {
      await Window.ToggleMaximise();
      isMaximised = await Window.IsMaximised();
    } catch (e) {
      console.warn('ToggleMaximise error:', e);
    }
  }

  function handleClose() {
    try {
      Window.Close();
    } catch (e) {
      console.warn('Close error:', e);
    }
  }
</script>

<svelte:window ondblclick={onHeaderDblClick} />

<header
  class="relative drag-region {isMac ? 'h-[52px]' : 'h-[44px]'} {isWindows ? 'pr-0' : 'pr-3 sm:pr-4'} border-b border-black/[0.05] dark:border-white/[0.06] bg-white/75 dark:bg-[#0c0d10]/80 backdrop-blur-xl shrink-0 flex items-center justify-between z-40 transition-colors select-none"
  style={isMac && !isFullscreen ? "padding-left: 96px;" : "padding-left: 14px;"}
>
  <!-- Left Zone: navigation + primary source picker -->
  <div class="no-drag-region flex items-center gap-2">
    <!-- Sidebar trigger -->
    <button
      onclick={onToggleInspector}
      class="h-7 w-7 flex items-center justify-center rounded-lg transition-colors {isInspectorOpen
        ? 'bg-black/[0.07] dark:bg-white/[0.12] text-neutral-900 dark:text-neutral-100 font-semibold'
        : 'text-neutral-500 dark:text-neutral-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] hover:text-neutral-800 dark:hover:text-neutral-200'}"
      title={isMac ? "切换参数侧栏 (⌘I)" : "切换参数侧栏 (Ctrl+I)"}
    >
      <Icon icon="keyline-icons:panel-left" height={15} />
    </button>

    <!-- "添加" opens a source picker: photos or folder -->
    <Menu.Root bind:open={isAddMenuOpen} onSelect={onAddSelect} positioning={{ placement: 'bottom-start', offset: { mainAxis: 6 } }}>
      <Menu.Trigger
        class="group h-7 flex items-center gap-1.5 px-3 rounded-full border border-black/[0.07] dark:border-white/[0.1] bg-white dark:bg-white/[0.06] hover:bg-neutral-50 dark:hover:bg-white/[0.1] text-xs font-medium text-neutral-800 dark:text-neutral-200 active:scale-[0.98] transition shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        title="添加照片或文件夹"
      >
        <Icon icon="keyline-icons:plus" height={13} />
        <span>添加</span>
        <Icon icon="keyline-icons:chevron-down" height={11} class="text-neutral-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner class="outline-none">
          <!-- z on Content, not Positioner: zag writes `z-index: var(--z-index)` inline on the
               positioner, and --z-index is read from the content's computed z-index. A class on
               the positioner can never win against that inline style. -->
          <Menu.Content class="apple-glass backdrop-blur-2xl z-[9999] w-48 p-1.5 rounded-2xl shadow-xl animate-scale-in text-xs outline-none">
            <Menu.Item
              value="files"
              class="w-full flex items-center gap-2.5 p-2 rounded-xl outline-none transition data-[highlighted]:bg-black/[0.05] dark:data-[highlighted]:bg-white/[0.08] text-neutral-700 dark:text-neutral-200"
            >
              <Icon icon="keyline-icons:image-plus" height={15} class="text-neutral-700 dark:text-neutral-200 shrink-0" />
              <span class="grow font-medium">选择照片</span>
              <span class="text-[10px] font-mono text-neutral-400">{isMac ? '⌘O' : 'Ctrl+O'}</span>
            </Menu.Item>
            <Menu.Item
              value="folder"
              class="w-full flex items-center gap-2.5 p-2 rounded-xl outline-none transition data-[highlighted]:bg-black/[0.05] dark:data-[highlighted]:bg-white/[0.08] text-neutral-700 dark:text-neutral-200"
            >
              <Icon icon="keyline-icons:folder-open" height={15} class="text-neutral-700 dark:text-neutral-200 shrink-0" />
              <span class="grow font-medium">选择文件夹</span>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  </div>

  <!-- Centre Zone: Compact Space Switcher Pill (Always strictly centered in Titlebar) -->
  <div class="no-drag-region absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center pointer-events-auto">
    <Menu.Root bind:open={isSpaceMenuOpen} onSelect={onSpaceMenuSelect} positioning={{ placement: 'bottom', offset: { mainAxis: 6 } }}>
      <Menu.Trigger
        class="group h-7 flex items-center gap-1.5 px-3 rounded-full bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] border border-black/[0.05] dark:border-white/[0.08] text-xs font-medium text-neutral-600 dark:text-neutral-300 transition shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-[0.98]"
        title="当前预设方案"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span class="max-w-[140px] truncate">{currentSpace.name}</span>
        <span class="text-[10px] font-mono text-neutral-400 uppercase font-semibold">({currentSpace.format})</span>
        <Icon icon="keyline-icons:chevron-down" height={11} class="text-neutral-400 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner class="outline-none">
          <Menu.Content class="apple-glass backdrop-blur-2xl z-[9999] w-72 p-2 rounded-2xl shadow-2xl animate-scale-in text-xs outline-none">
            <div class="px-2.5 py-1 text-[11px] font-semibold text-neutral-400 flex items-center justify-between">
              <span>预设方案 (Presets)</span>
              <span class="font-mono text-[11px]">{spaces.length} 个方案</span>
            </div>

            <div class="space-y-0.5 my-1 max-h-60 overflow-y-auto pr-0.5">
              {#each spaces as s (s.id)}
                {@const isSelected = s.id === currentSpace.id}
                <Menu.Item
                  value={s.id}
                  class="w-full flex items-center justify-between p-2 rounded-xl text-left outline-none transition data-[highlighted]:bg-black/[0.05] dark:data-[highlighted]:bg-white/[0.08] {isSelected
                    ? 'bg-black/[0.06] dark:bg-white/[0.12] text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-700 dark:text-neutral-200'}"
                >
                  <div class="flex flex-col truncate pr-2">
                    <span class="truncate">{s.name}</span>
                    <span class="text-[11px] text-neutral-400 truncate font-normal">{s.description || '自定义参数'}</span>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span class="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-neutral-500">
                      {s.format}
                    </span>
                    {#if isSelected}
                      <Icon icon="keyline-icons:check" height={14} class="text-neutral-900 dark:text-white" />
                    {/if}
                  </div>
                </Menu.Item>
              {/each}
            </div>

            <div class="border-t border-black/[0.06] dark:border-white/[0.08] pt-1.5 mt-1 flex items-center justify-between text-xs px-1">
              <button
                onclick={() => {
                  isSpaceMenuOpen = false;
                  onOpenNewSpaceModal();
                }}
                class="py-1 rounded-md text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white font-medium transition text-[11px]"
              >
                + 新建预设...
              </button>
              <button
                onclick={() => {
                  isSpaceMenuOpen = false;
                  onToggleInspector();
                }}
                class="py-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition text-[11px]"
              >
                详细配置 ({isMac ? '⌘I' : 'Ctrl+I'})
              </button>
            </div>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  </div>

  <!-- Right Side: Compression Actions, About, Flush Window Controls -->
  <div class="no-drag-region ml-auto flex items-center h-full">
    <!-- Action buttons group -->
    <div class="flex items-center gap-2 {isWindows ? 'pr-2 sm:pr-3' : ''}">
      {#if taskCount > 0}
        {#if pendingCount > 0}
          <button
            onclick={onStartAll}
            disabled={isProcessing}
            class="pill-btn-black !h-7 !py-0 !px-3 text-xs disabled:opacity-50"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>开始压缩 ({pendingCount})</span>
          </button>
        {/if}

        {#if completedCount > 0}
          <button
            onclick={onExportZip}
            class="pill-btn-secondary !h-7 !py-0 !px-3 text-xs"
            title="将已完成图片打包导出为 ZIP"
          >
            <Icon icon="keyline-icons:download" height={13} />
            <span class="hidden md:inline">导出 ZIP</span>
          </button>
        {/if}
      {/if}

      <!-- About Modal Toggle -->
      <button
        onclick={onOpenAbout}
        class="h-7 w-7 flex items-center justify-center rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition"
        title="关于 PixZip Lite"
      >
        <Icon icon="keyline-icons:info" height={15} />
      </button>
    </div>

    <!-- 1:1 Native Windows 11 Caption Controls (Flush right, full height, corner snap clickable) -->
    {#if isWindows}
      <div class="flex items-stretch h-full">
        <!-- Minimise -->
        <button
          onclick={handleMinimise}
          class="wails-minimize w-11 sm:w-12 h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] active:bg-black/[0.1] dark:active:bg-white/[0.14] transition-colors"
          style="--wails-non-client-region: minimize;"
          title="最小化"
          aria-label="最小化"
        >
          <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
            <rect width="10" height="1" />
          </svg>
        </button>

        <!-- Toggle Maximise / Restore (HTMAXBUTTON enables Windows 11 Snap Layouts flyout on hover) -->
        <button
          onclick={handleToggleMaximise}
          class="wails-maximize w-11 sm:w-12 h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] active:bg-black/[0.1] dark:active:bg-white/[0.14] transition-colors"
          style="--wails-non-client-region: maximize;"
          title={isMaximised ? "向下还原" : "最大化"}
          aria-label={isMaximised ? "向下还原" : "最大化"}
        >
          {#if isMaximised}
            <!-- Windows 11 Fluent Restore Glyph (overlapping squares) -->
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M3 2.5V1.5H8.5V7H7.5" />
              <rect x="1.5" y="2.5" width="6" height="6" />
            </svg>
          {:else}
            <!-- Windows 11 Fluent Maximize Glyph (single square) -->
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1">
              <rect x="0.5" y="0.5" width="9" height="9" />
            </svg>
          {/if}
        </button>

        <!-- Close (Native Win11 red flood on hover) -->
        <button
          onclick={handleClose}
          class="wails-close w-11 sm:w-12 h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-[#e81123] hover:text-white active:bg-[#c4101e] active:text-white transition-colors"
          style="--wails-non-client-region: close;"
          title="关闭"
          aria-label="关闭"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" stroke-width="1.1">
            <line x1="1" y1="1" x2="9" y2="9" />
            <line x1="9" y1="1" x2="1" y2="9" />
          </svg>
        </button>
      </div>
    {/if}
  </div>
</header>
