export type SendData = {
  "compress-start": {
    path: string;
    spaceId: string;
    status: ImgStatus;
  };
  "compress-success": {
    path: string;
    spaceId: string;
    status: ImgStatus;
    compressedSize: number;
    outputPath: string;
  };
  "compress-failed": {
    path: string;
    spaceId: string;
    status: ImgStatus;
  };
};
