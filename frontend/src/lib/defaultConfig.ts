import type { CompressConfig } from '#lib/types';

// First launch ships with exactly one preset; users add their own from there.
export const DEFAULT_PRESETS: CompressConfig[] = [
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
