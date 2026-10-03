export type ImageFormat = 'original' | 'webp' | 'avif' | 'jpeg' | 'png';

export type ResizeMode = 'none' | 'width' | 'height' | 'fit' | 'scale';

export interface CompressConfig {
  id: string;
  name: string;
  description: string;
  format: ImageFormat;
  quality: number; // 1 to 100
  resizeMode: ResizeMode;
  width?: number;
  height?: number;
  scale?: number; // e.g. 50, 75
  suffix: string;
  keepExif: boolean;
  originalOutput: boolean;
  outputDir?: string;
  isCustom?: boolean;
}

export type TaskStatus = 'idle' | 'processing' | 'completed' | 'error';

export interface FileTask {
  id: string;
  path: string;
  name: string;
  originalSize: number;
  compressedSize?: number;
  originalWidth: number;
  originalHeight: number;
  compressedWidth?: number;
  compressedHeight?: number;
  outputPath?: string;
  status: TaskStatus;
  error?: string;
  originalFormat: string;
  durationMs?: number;
}

export type ViewMode = 'list' | 'grid';
export type FilterStatus = 'all' | 'completed' | 'processing' | 'idle' | 'error';
