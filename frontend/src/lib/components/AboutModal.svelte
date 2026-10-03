<script lang="ts">
  import Icon from '@iconify/svelte/offline';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
  }

  let { isOpen, onClose }: Props = $props();

  function handleKeydown(event: KeyboardEvent) {
    if (isOpen && event.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xl animate-fade-in select-none"
    onclick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
    onkeydown={(e) => {
      if (e.key === 'Escape') onClose();
    }}
  >
    <div class="relative w-full max-w-lg apple-card rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xl overflow-hidden p-6 sm:p-8 animate-scale-in flex flex-col max-h-[90vh] overflow-y-auto">
      <!-- Close Button -->
      <button
        onclick={onClose}
        class="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition"
      >
        <Icon icon="keyline-icons:x" height={16} />
      </button>

      <!-- Brand Header -->
      <div class="flex flex-col items-center text-center pb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div class="w-16 h-16 rounded-2xl bg-neutral-900 dark:bg-white p-0.5 shadow-lg mb-3 flex items-center justify-center">
          <div class="w-full h-full bg-white dark:bg-[#18191d] rounded-[14px] flex items-center justify-center overflow-hidden">
            <img src="/icon.webp" alt="PixZip" class="w-11 h-11 object-contain" />
          </div>
        </div>

        <h2 class="text-xl font-bold tracking-tight text-[#121316] dark:text-[#f4f4f6]">
          PixZip Lite
        </h2>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs leading-relaxed">
          极速、克制、现代的原生跨平台批量图片压缩工具
        </p>

        <div class="flex flex-wrap items-center justify-center gap-2 mt-3.5">
          <span class="pill-badge !text-[10px] font-mono">
            Wails 3 + Svelte 5
          </span>
          <span class="pill-badge !text-[10px] text-emerald-600 dark:text-emerald-400">
            <Icon icon="keyline-icons:shield-check" height={12} class="text-emerald-500" />
            原生并发 · 无 Canvas
          </span>
        </div>
      </div>

      <!-- Highlights -->
      <div class="py-4 space-y-3">
        <div class="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-1">
          核心架构与引擎
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div class="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] flex flex-col gap-1">
            <div class="font-semibold text-[#121316] dark:text-[#f4f4f6] flex items-center gap-1.5">
              <Icon icon="keyline-icons:cpu" height={14} class="text-emerald-500" />
              Go 后端原生引擎
            </div>
            <p class="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              严格遵循无 Canvas 要求，由 Go + libwebp + Lanczos 算法并发极速压缩。
            </p>
          </div>

          <div class="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] flex flex-col gap-1">
            <div class="font-semibold text-[#121316] dark:text-[#f4f4f6] flex items-center gap-1.5">
              <Icon icon="keyline-icons:sparkles" height={14} class="text-emerald-500" />
              双图画质滑块对比
            </div>
            <p class="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              前后对比滑块拖拽审视微观细节，支持无极放大缩小与透明棋盘格对比。
            </p>
          </div>

          <div class="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] flex flex-col gap-1">
            <div class="font-semibold text-[#121316] dark:text-[#f4f4f6] flex items-center gap-1.5">
              <Icon icon="keyline-icons:code" height={14} class="text-emerald-500" />
              Svelte 5 Runes 驱动
            </div>
            <p class="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              现代化 Svelte 5 全新响应式核心，带来如丝般顺滑的桌面交互体验。
            </p>
          </div>

          <div class="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] flex flex-col gap-1">
            <div class="font-semibold text-[#121316] dark:text-[#f4f4f6] flex items-center gap-1.5">
              <Icon icon="keyline-icons:circle-check" height={14} class="text-emerald-500" />
              多预设与批量导出
            </div>
            <p class="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              灵活预设切换、递归目录扫描、一键导出整份 ZIP 归档包。
            </p>
          </div>
        </div>
      </div>

      <!-- Links & Thanks -->
      <div class="pt-2 pb-4 space-y-2 border-t border-black/[0.06] dark:border-white/[0.08]">
        <div class="flex items-center justify-between text-xs">
          <span class="text-neutral-500">开源仓库</span>
          <a
            href="https://github.com/richhost/pixzip-lite"
            target="_blank"
            rel="noopener noreferrer"
            class="text-neutral-800 dark:text-neutral-200 hover:underline flex items-center gap-1 font-medium"
          >
            <span>richhost/pixzip-lite</span>
            <Icon icon="keyline-icons:square-arrow-up-right" height={13} />
          </a>
        </div>

        <div class="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
          <span class="text-neutral-500">致谢 JetBrains 开源许可支持</span>
          <span class="font-bold text-neutral-700 dark:text-neutral-300">JetBrains</span>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
        <a
          href="https://github.com/richhost/pixzip"
          target="_blank"
          rel="noopener noreferrer"
          class="pill-btn-secondary !h-7 !py-0 !px-3 text-xs"
        >
          <Icon icon="keyline-icons:star-fill" height={13} class="text-amber-400" />
          <span>Star 支持</span>
        </a>

        <div class="flex items-center gap-2">
          <a
            href="https://afdian.com/a/abiee"
            target="_blank"
            rel="noopener noreferrer"
            class="pill-btn-black !h-7 !py-0 !px-3 text-xs"
          >
            <Icon icon="keyline-icons:heart-fill" height={13} class="text-rose-500" />
            <span>爱发电赞助</span>
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}
