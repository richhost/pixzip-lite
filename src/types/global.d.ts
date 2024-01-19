declare namespace Pixzip {
  type SafeNumber = `${number}` | number;
  type Format = "original" | "jpg" | "png" | "webp" | "avif";
  type Workspace = {
    id: string;
    name?: string;
    icon: string;
    width?: SafeNumber;
    height?: SafeNumber;
    format: Format;
    quality: number;
    /**
     * output path.
     *
     * `0`: original path,
     * `string`: custom path
     */
    outputPath: 0 | string;
  };
}
