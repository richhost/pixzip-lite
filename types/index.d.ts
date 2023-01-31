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

interface Img {
  path: string;
  name: string;
  size: number;
  type: string;
  spaceId: string;
}

type ImgStatus = "waiting" | "start" | "success" | "failed";
