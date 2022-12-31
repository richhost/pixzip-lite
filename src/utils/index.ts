const unit = window.lossApi.isMacOS ? 1000 : 1024;

export const bytes2MB = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0";
  const i: number = parseInt(
    Math.floor(Math.log(bytes) / Math.log(unit)).toString()
  );
  let precision = i > 1 ? 1 : 0;
  return `${(bytes / Math.pow(unit, i)).toFixed(precision)}${sizes[i]}`;
};

/**
 * 计算较少的百分比
 * @param oldSize
 * @param newSize
 */
export const calcLossPercent = (oldSize: number, newSize: number) => {
  const percent = ((oldSize - newSize) / oldSize) * 100;
  return Math.round(percent) + "%";
};
