import type { CompressConfig, ImageFormat, ResizeMode } from '#lib/types';

/* Format and resize labels live in a .svelte module so wuchale can translate them.
   They are not exported: a translated top-level assignment becomes `$derived`,
   which Svelte refuses to export from a module, so components read the lists
   through the accessors below. */

const FORMAT_OPTIONS: { id: ImageFormat; label: string }[] = [
  { id: 'webp', label: 'WebP' },
  { id: 'avif', label: 'AVIF' },
  { id: 'jpeg', label: 'JPEG' },
  { id: 'png', label: 'PNG' },
  { id: 'original', label: '原格式' },
];

const RESIZE_MODES: { id: ResizeMode; label: string }[] = [
  { id: 'none', label: '原始' },
  { id: 'width', label: '限宽' },
  { id: 'height', label: '限高' },
];

export function formatOptions() {
  return FORMAT_OPTIONS;
}

export function resizeModes() {
  return RESIZE_MODES;
}

export function defaultPresets(): CompressConfig[] {
  // First launch ships with exactly one preset; users add their own from there.
  return [
    {
      id: 'default',
      name: '标准 WebP',
      description: '均衡压缩比与画质，保留相机 EXIF',
      format: 'webp',
      quality: 80,
      resizeMode: 'none',
      suffix: '-min',
      keepExif: true,
      originalOutput: true,
    },
  ];
}
