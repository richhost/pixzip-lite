<script lang="ts">
  import type { FileTask } from '#lib/types';
  import { formatBytes, calculateSavings, getLocalImageUrl } from '#lib/utils';
  import Icon from '@iconify/svelte/offline';

  interface Props {
    task: FileTask | null;
    onClose: () => void;
    onRevealInFinder: (path: string) => void;
  }

  let { task, onClose, onRevealInFinder }: Props = $props();

  let sliderPos = $state(50);
  let zoom = $state(1);

  let originalUrl = $derived(task ? getLocalImageUrl(task.path) : '');
  let compressedUrl = $derived(
    task && task.outputPath ? getLocalImageUrl(task.outputPath, task.compressedSize) : ''
  );

  let savings = $derived(
    task && task.compressedSize
      ? calculateSavings(task.originalSize, task.compressedSize)
      : { percent: 0, diffBytes: 0 }
  );

  function moveSlider(clientX: number, el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    sliderPos = rect.width === 0 ? 0 : (x / rect.width) * 100;
  }

  function startDrag(event: PointerEvent) {
    const el = event.currentTarget;
    if (!(el instanceof HTMLElement)) return;
    el.setPointerCapture(event.pointerId);
    moveSlider(event.clientX, el);
  }

  function onDragMove(event: PointerEvent) {
    const el = event.currentTarget;
    if (!(el instanceof HTMLElement) || !el.hasPointerCapture(event.pointerId)) return;
    moveSlider(event.clientX, el);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!task) return;
    if (event.key === 'Escape') {
      onClose();
    } else if (event.key === 'ArrowLeft') {
      sliderPos = Math.max(0, sliderPos - 5);
    } else if (event.key === 'ArrowRight') {
      sliderPos = Math.min(100, sliderPos + 5);
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if task && compressedUrl}
  <div
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-fade-in select-none"
    onclick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
    onkeydown={(e) => {
      if (e.key === 'Escape') onClose();
    }}
  >
    <!-- Modal Container -->
    <div class="relative w-full max-w-5xl h-[88vh] bg-[#1c1c1e] text-white rounded-squircle-lg border border-white/[0.1] shadow-2xl flex flex-col overflow-hidden">
      <!-- Top Header Bar -->
      <div class="h-14 sm:h-16 px-6 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.03]">
        <div class="flex items-center gap-3">
          <!-- macOS traffic light mock close button -->
          <button
            onclick={() => {
              onClose();
            }}
            class="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 flex items-center justify-center group"
            title="关闭 (Esc)"
          >
            <Icon icon="keyline-icons:x" height={10} class="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>

          <div>
            <div class="font-semibold text-sm truncate max-w-xs sm:max-w-md">
              {task.name}
            </div>
            <div class="text-[11px] text-neutral-400">
              双图画质滑块对比 · 左右拖拽中线或使用方向键
            </div>
          </div>
        </div>

        <!-- Right Controls -->
        <div class="flex items-center gap-2">
          <!-- Zoom Stepper -->
          <div class="flex items-center p-0.5 rounded-full bg-white/[0.08] border border-white/[0.06]">
            <button
              onclick={() => (zoom = Math.max(0.5, zoom - 0.25))}
              class="p-1.5 text-neutral-300 hover:text-white rounded-full transition apple-pressable"
              title="缩小"
            >
              <Icon icon="keyline-icons:search-minus" height={14} class="w-3.5 h-3.5" />
            </button>
            <button
              onclick={() => (zoom = 1)}
              class="px-2 text-xs font-mono font-medium text-neutral-300 hover:text-white tabular-nums"
              title="重置 100%"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onclick={() => (zoom = Math.min(3, zoom + 0.25))}
              class="p-1.5 text-neutral-300 hover:text-white rounded-full transition apple-pressable"
              title="放大"
            >
              <Icon icon="keyline-icons:search-plus" height={14} class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Reveal in Finder -->
          <button
            onclick={() => {
              onRevealInFinder(task.outputPath || task.path);
            }}
            class="pill-btn-black !h-8 !py-0 !px-3 text-xs"
          >
            <Icon icon="keyline-icons:folder" height={14} class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">在 Finder 中显示</span>
          </button>

          <!-- Close Icon -->
          <button
            onclick={() => {
              onClose();
            }}
            class="p-1.5 text-neutral-400 hover:text-white rounded-full transition apple-pressable ml-1"
          >
            <Icon icon="keyline-icons:x" height={20} class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Main Comparison Visualizer Viewport -->
      <div
        role="slider"
        aria-label="双图对比画布"
        aria-valuenow={Math.round(sliderPos)}
        aria-valuemin="0"
        aria-valuemax="100"
        tabindex="0"
        onpointerdown={startDrag}
        onpointermove={onDragMove}
        class="relative grow w-full h-full overflow-hidden bg-checkerboard flex items-center justify-center cursor-ew-resize select-none"
      >
        <!-- Inner Transform Zoom Container -->
        <div
          class="relative w-full h-full flex items-center justify-center transition-transform duration-75"
          style="transform: scale({zoom});"
        >
          <!-- Base Layer (Right): Compressed Image -->
          <img
            src={compressedUrl}
            alt="压缩后"
            class="absolute max-w-full max-h-full object-contain pointer-events-none drop-shadow-xl"
            draggable="false"
          />

          <!-- Overlap Layer (Left): Original Image clipped by slider position -->
          <div
            class="absolute inset-0 overflow-hidden pointer-events-none"
            style="clip-path: polygon(0 0, {sliderPos}% 0, {sliderPos}% 100%, 0 100%);"
          >
            <div class="relative w-full h-full flex items-center justify-center">
              <img
                src={originalUrl}
                alt="原图"
                class="absolute max-w-full max-h-full object-contain pointer-events-none drop-shadow-xl"
                draggable="false"
              />
            </div>
          </div>

          <!-- Center Slider Divider Line with Glass Handle -->
          <div
            class="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
            style="left: {sliderPos}%;"
          >
            <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-2xl flex items-center justify-center border border-black/10 text-neutral-800">
              <Icon icon="keyline-icons:arrow-left-right" height={16} class="w-4 h-4 text-black" />
            </div>
          </div>
        </div>

        <!-- Floating Comparison Floating Pills (Left: Original, Right: Compressed) -->
        <div class="absolute bottom-5 inset-x-6 z-30 flex items-center justify-between pointer-events-none">
          <!-- Left Original Pill -->
          <div class="pointer-events-auto p-2.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 text-xs flex items-center gap-3 shadow-lg">
            <span class="w-2 h-2 rounded-full bg-neutral-400"></span>
            <div>
              <div class="font-semibold text-neutral-300">原图 (Original)</div>
              <div class="text-[11px] text-neutral-400 font-mono">
                {task.originalWidth}×{task.originalHeight} · {formatBytes(task.originalSize)}
              </div>
            </div>
          </div>

          <!-- Center Savings Callout (success green — it reports an outcome, not an action) -->
          <div class="pointer-events-auto px-4 py-2 rounded-full bg-emerald-500/90 backdrop-blur-xl text-white text-xs font-bold shadow-xl flex items-center gap-1.5">
            <Icon icon="keyline-icons:arrow-down" height={14} class="w-3.5 h-3.5" />
            <span>减小体积 {savings.percent}% ({formatBytes(savings.diffBytes)})</span>
          </div>

          <!-- Right Compressed Pill -->
          <div class="pointer-events-auto p-2.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 text-xs flex items-center gap-3 shadow-lg">
            <div>
              <div class="font-semibold text-emerald-400">压缩后 (Compressed)</div>
              <div class="text-[11px] text-neutral-300 font-mono">
                {task.compressedWidth || task.originalWidth}×{task.compressedHeight || task.originalHeight} · {formatBytes(task.compressedSize || 0)}
              </div>
            </div>
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
