import type { FileTask } from '#lib/types';

export function cn(...inputs: (string | boolean | null | undefined | Record<string, boolean>)[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  return classes.join(' ');
}

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
