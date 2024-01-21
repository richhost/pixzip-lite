declare namespace Pixzip {
  type SafeNumber = `${number}` | number;
  type Format = "original" | "jpg" | "png" | "webp" | "avif";
  type Workspace = {
    id: string;
    name: string;
    icon: string;
    width?: number;
    height?: number;
    suffix: string;
    format: Format;
    level: number;
    autoExec: boolean;
    originalOutput: boolean;
    outputDir?: string;
  };
}
