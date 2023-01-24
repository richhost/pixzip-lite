interface SendFile {
  path: string;
  name: string;
  type: string;
  status: ProcessStatus;
  originalSize: number;
  compressedSize?: number;
  spaceId: string;
  outputPath?: string;
}

type ProcessStatus = "waiting" | "processing" | "success" | "failed";

type Format = "original" | "jpg" | "png" | "webp" | "avif" | "gif";

interface Space {
  id: string;
  name?: string;
  icon: string;
  width?: number;
  height?: number;
  suffix?: string;
  format: Format;
  quality: number;
  outputOriginal: boolean;
  outputPath?: string;
}
