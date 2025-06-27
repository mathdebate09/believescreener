export function formatCryptoNumber(num: number): string {
  let value: number;
  let suffix: string = "";

  if (num >= 1000000000) {
    value = num / 1000000000;
    suffix = "B";
  } else if (num >= 1000000) {
    value = num / 1000000;
    suffix = "M";
  } else if (num >= 1000) {
    value = num / 1000;
    suffix = "K";
  } else {
    return num.toFixed(2);
  }

  return value.toFixed(2) + suffix;
}