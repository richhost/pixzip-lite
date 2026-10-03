<script lang="ts">
  import Icon from "@iconify/svelte/offline";
  import { currentLocale, selectLocale } from "#lib/locale.svelte";

  interface Props {
    isOpen: boolean;
    onClose: () => void;
  }

  let { isOpen, onClose }: Props = $props();

  let current = $derived(currentLocale());

  function segment(active: boolean) {
    return `px-2.5 py-1 rounded-full text-[11px] transition ${
      active
        ? "bg-white dark:bg-[#25262b] text-neutral-900 dark:text-white font-semibold shadow-xs"
        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
    }`;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (isOpen && event.key === "Escape") onClose();
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
      if (e.key === "Escape") onClose();
    }}
  >
    <div
      class="relative w-full max-w-lg apple-card rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xl overflow-hidden p-6 sm:p-8 animate-scale-in flex flex-col max-h-[90vh] overflow-y-auto"
    >
      <!-- Close Button -->
      <button
        onclick={onClose}
        class="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition"
      >
        <Icon icon="keyline-icons:x" height={16} />
      </button>

      <!-- Brand Header -->
      <div
        class="flex flex-col items-center text-center pb-5 border-b border-black/[0.06] dark:border-white/[0.08]"
      >
        <img
          src="/icon.webp"
          alt="PixZip Lite"
          class="w-16 h-16 mb-3 object-contain select-none"
        />

        <h2
          class="text-xl font-bold tracking-tight text-[#121316] dark:text-[#f4f4f6]"
        >
          PixZip Lite
        </h2>
        <p
          class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs leading-relaxed"
        >
          轻快、克制的原生图片压缩工具
        </p>

      </div>

      <!-- Highlights -->
      <div class="py-4 space-y-3">
        <div
          class="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-1"
        >
          特性
        </div>

        <div class="grid grid-cols-1 gap-2 text-xs">
          <div
            class="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] flex flex-col gap-0.5"
          >
            <div
              class="font-semibold text-[#121316] dark:text-[#f4f4f6] flex items-center gap-1.5"
            >
              <Icon
                icon="keyline-icons:zap"
                height={14}
                class="text-emerald-500"
              />
              高效并发
            </div>
            <p
              class="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed"
            >
              多图并行批量处理，兼顾高压缩率与清晰画质。
            </p>
          </div>

          <div
            class="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] flex flex-col gap-0.5"
          >
            <div
              class="font-semibold text-[#121316] dark:text-[#f4f4f6] flex items-center gap-1.5"
            >
              <Icon
                icon="keyline-icons:shield-check"
                height={14}
                class="text-emerald-500"
              />
              本地安全
            </div>
            <p
              class="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed"
            >
              全本地离线处理，无需上传网络，保护隐私。
            </p>
          </div>

          <div
            class="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] flex flex-col gap-0.5"
          >
            <div
              class="font-semibold text-[#121316] dark:text-[#f4f4f6] flex items-center gap-1.5"
            >
              <Icon
                icon="keyline-icons:circle-check"
                height={14}
                class="text-emerald-500"
              />
              预设与导出
            </div>
            <p
              class="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed"
            >
              快速切换参数预设，一键打包导出 ZIP。
            </p>
          </div>
        </div>
      </div>

      <!-- Interface Language -->
      <div class="pb-3 flex items-center justify-between text-xs">
        <span class="text-neutral-500">语言</span>
        <div class="flex items-center p-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06]">
          <button
            type="button"
            onclick={() => selectLocale("zh")}
            aria-pressed={current === "zh"}
            class={segment(current === "zh")}
          >
            中文
          </button>
          <button
            type="button"
            onclick={() => selectLocale("en")}
            aria-pressed={current === "en"}
            class={segment(current === "en")}
          >
            English
          </button>
        </div>
      </div>

      <!-- Links -->
      <div
        class="pt-2 pb-4 space-y-2 border-t border-black/[0.06] dark:border-white/[0.08]"
      >
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
      </div>

      <!-- Footer Buttons -->
      <div
        class="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between"
      >
        <a
          href="https://github.com/richhost/pixzip"
          target="_blank"
          rel="noopener noreferrer"
          class="pill-btn-secondary !h-7 !py-0 !px-3 text-xs"
        >
          <Icon
            icon="keyline-icons:star-fill"
            height={13}
            class="text-amber-400"
          />
          <span>Star 支持</span>
        </a>

        <div class="flex items-center gap-2">
          <a
            href="https://afdian.com/a/abiee"
            target="_blank"
            rel="noopener noreferrer"
            class="pill-btn-black !h-7 !py-0 !px-3 text-xs"
          >
            <Icon
              icon="keyline-icons:heart-fill"
              height={13}
              class="text-rose-500"
            />
            <span>爱发电赞助</span>
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}
