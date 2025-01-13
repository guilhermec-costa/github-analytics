export function formatBytes(bytes: number, decimalPlaces = 2): string {
  if (bytes === 0) return "0";

  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const divisor = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(divisor));

  return (
    parseFloat((bytes / Math.pow(divisor, i)).toFixed(decimalPlaces)) +
    " " +
    units[i]
  );
}
