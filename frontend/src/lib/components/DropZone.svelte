<script lang="ts">
  import Icon from '@iconify/svelte/offline';

  interface Props {
    hasTasks: boolean;
    onSelectFiles: () => void;
    onSelectFolder: () => void;
    onDropFiles: (filePaths: string[]) => void;
  }

  let { hasTasks, onSelectFiles, onSelectFolder, onDropFiles }: Props = $props();

  let isDragOver = $state(false);

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragOver = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragOver = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragOver = false;

    if (!e.dataTransfer) return;

    const paths: string[] = [];
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (const file of e.dataTransfer.files) {
        const path = (file as File & { path?: string }).path;
        if (path) paths.push(path);
        else if (file.name) paths.push(file.name);
      }
    }

    if (paths.length > 0) {
      onDropFiles(paths);
    }
  }
</script>

<div
  role="region"
  aria-label="拖拽区域"
  data-file-drop-target
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
  class="relative transition-all duration-300 w-full {hasTasks
    ? 'rounded-2xl border border-black/[0.06] dark:border-white/[0.08] p-4 sm:p-5 flex items-center justify-between apple-card'
    : 'grow flex flex-col items-center justify-center py-10 sm:py-16 select-none'} {isDragOver
    ? 'ring-2 ring-emerald-500/50 bg-emerald-500/[0.03] scale-[1.004]'
    : ''}"
>
  {#if hasTasks}
    <!-- Compact drop strip when task list is populated -->
    <div class="flex items-center gap-3.5 text-left">
      <div class="w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.05] dark:border-white/[0.08] flex items-center justify-center text-neutral-800 dark:text-neutral-200">
        <Icon icon="keyline-icons:image-plus" height={19} />
      </div>
      <div>
        <div class="font-medium text-xs sm:text-sm text-[#121316] dark:text-[#f4f4f6]">
          拖拽照片或文件夹至此
        </div>
        <div class="text-[11px] text-neutral-400 dark:text-neutral-500">
          支持 JPG, WebP, AVIF, PNG
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button
        onclick={onSelectFiles}
        class="pill-btn-secondary !py-1.5 !px-3.5 text-xs"
      >
        选择照片
      </button>
      <button
        onclick={onSelectFolder}
        class="pill-btn-secondary !py-1.5 !px-3.5 text-xs"
      >
        选择文件夹
      </button>
    </div>
  {:else}
    <!-- Hero Stage: Duo-Minimalist High-Tech Center Drop -->
    <div class="relative flex flex-col items-center justify-center gap-6 max-w-xl w-full text-center px-4">
      
      <!-- Graphic: Delicate Geometric Sonar / Radar Orbit Graphic (Reference Image 2 Inspired) -->
      <div class="relative flex items-center justify-center group cursor-pointer" onclick={onSelectFiles} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && onSelectFiles()}>
        <div class="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
          
          <!-- Outer Wireframe Circles -->
          <svg class="absolute inset-0 w-full h-full text-neutral-300 dark:text-neutral-700 pointer-events-none transition-transform duration-500 group-hover:scale-105" viewBox="0 0 200 200" fill="none">
            <!-- Concentric Grid Circles -->
            <circle cx="100" cy="100" r="90" stroke="currentColor" stroke-width="0.75" stroke-dasharray="3 4" stroke-opacity="0.5" />
            <circle cx="100" cy="100" r="68" stroke="currentColor" stroke-width="0.75" stroke-opacity="0.4" />
            <circle cx="100" cy="100" r="46" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3" stroke-opacity="0.6" class="{isDragOver ? 'text-emerald-500' : ''}" />
            
            <!-- Fine Axis Lines -->
            <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.25" />
            <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.25" />
            
            <!-- Satellite Orbit Tag: Status Indicator -->
            <circle cx="146" cy="54" r="3" fill="#22c55e" />
          </svg>

          <!-- Core Center Capsule Platter -->
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white dark:bg-[#18191d] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.6)] border border-black/[0.06] dark:border-white/[0.08] flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105">
            <Icon icon="keyline-icons:image-plus" height={30} class="text-neutral-800 dark:text-neutral-100" />
            <span class="text-[9px] font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500 mt-1 font-semibold">
              Drop Files
            </span>
          </div>
        </div>
      </div>

      <!-- Pill Buttons (Pure Black Capsule + Light Pill Secondary) -->
      <div class="flex items-center justify-center gap-3 sm:gap-4">
        <button
          onclick={onSelectFiles}
          class="pill-btn-black group"
        >
          <!-- Subtle glowing spinner / status dot like reference -->
          <span class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] shrink-0"></span>
          <span>选择照片</span>
        </button>

        <button
          onclick={onSelectFolder}
          class="pill-btn-secondary"
        >
          <Icon icon="keyline-icons:folder-open" height={15} class="text-neutral-500 dark:text-neutral-400" />
          <span>选择文件夹</span>
        </button>
      </div>

      <p class="text-[11px] text-neutral-400 dark:text-neutral-500">
        支持 JPG / JPEG · PNG · WebP · AVIF · GIF
      </p>

    </div>
  {/if}
</div>
