interface SendFile {
  path: string;
  name: string;
  type: string;
  size: number;
}

type ProcessStatus = "waiting" | "processing" | "success" | "failed";

type Format = "original" | "jpg" | "png" | "webp" | "avif" | "gif";

interface IUserConfig {
  width?: number;
  height?: number;
  format: Format;
  suffix?: string;
  outputOriginal: boolean;
  outputPath?: string;
  quality: number;
}
