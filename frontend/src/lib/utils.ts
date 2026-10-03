import type { FileTask, ImageFormat, ResizeMode } from '#lib/types';

/* Shared so the sidebar and the new-preset modal cannot drift apart in wording. */
export const FORMAT_OPTIONS: { id: ImageFormat; label: string }[] = [
  { id: 'webp', label: 'WebP' },
  { id: 'avif', label: 'AVIF' },
  { id: 'jpeg', label: 'JPEG' },
  { id: 'png', label: 'PNG' },
  { id: 'original', label: '保持原格式' },
];

export const RESIZE_MODES: { id: ResizeMode; label: string }[] = [
  { id: 'none', label: '原图尺寸' },
  { id: 'width', label: '限制宽度' },
  { id: 'height', label: '限制高度' },
];

export interface TaskSummary {
  total: number;
  idle: number;
  processing: number;
  completed: number;
  originalBytes: number;
  compressedBytes: number;
  savedBytes: number;
  sizedCompletions: number;
  savingsPercent: number;
}

/** One pass over the queue. Replaces repeated filter/reduce in the header and list. */
export function summarizeTasks(tasks: readonly FileTask[]): TaskSummary {
  let idle = 0;
  let processing = 0;
  let completed = 0;
  let originalBytes = 0;
  let compressedBytes = 0;
  let savedBytes = 0;
  let sizedCompletions = 0;

  for (const task of tasks) {
    originalBytes += task.originalSize;
    switch (task.status) {
      case 'idle':
        idle += 1;
        break;
      case 'processing':
        processing += 1;
        break;
      case 'completed':
        completed += 1;
        if (task.compressedSize) {
          sizedCompletions += 1;
          compressedBytes += task.compressedSize;
          savedBytes += Math.max(0, task.originalSize - task.compressedSize);
        }
        break;
    }
  }

  return {
    total: tasks.length,
    idle,
    processing,
    completed,
    originalBytes,
    compressedBytes,
    savedBytes,
    sizedCompletions,
    savingsPercent: originalBytes > 0 ? Math.round((savedBytes / originalBytes) * 100) : 0,
  };
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  return `${val} ${sizes[i] || 'MB'}`;
}

export function calculateSavings(original: number, compressed: number) {
  if (!original || !compressed) return { percent: 0, diffBytes: 0 };
  const diff = original - compressed;
  const percent = Math.round((Math.abs(diff) / original) * 100);
  return {
    percent,
    diffBytes: Math.abs(diff),
  };
}

export function getLocalImageUrl(filePath?: string, cacheBust?: number | string): string {
  if (!filePath) return '';
  const param = encodeURIComponent(filePath);
  return `/local-file?path=${param}${cacheBust ? `&_t=${cacheBust}` : ''}`;
}
