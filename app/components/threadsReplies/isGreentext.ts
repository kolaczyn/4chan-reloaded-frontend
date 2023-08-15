export const isGreentext = (text: string) =>
  text.startsWith(">") && !text.startsWith(">>");
