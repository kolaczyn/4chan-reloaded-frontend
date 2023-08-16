export const truncateStr = (str: string, maxLen: number) =>
  str.length > maxLen ? str.slice(0, maxLen) + "..." : str;
