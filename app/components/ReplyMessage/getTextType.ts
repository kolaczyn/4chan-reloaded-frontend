export const getTextType = (text: string) => {
  const isQuote = text.startsWith(">>");
  const quoteId = text.replace(">>", "");
  const isGreentext = text.startsWith(">") && !isQuote;

  return {
    isQuote,
    quoteId,
    isGreentext,
  };
};
