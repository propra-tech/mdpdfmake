const cleanString = (text: string) => {
  return text
    .replace(/<\/?u>/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "");
};

export const mergetags = (currentTag: {}, text: string) => {
  const extraTags = [
    { pattern: /\*\*(.*?)\*\*/g, style: { bold: true } },
    { pattern: /\*([^*]+)\*/g, style: { italics: true } },
    { pattern: /<\/?u>/g, style: { style: { decoration: "underline" } } },
  ];
  let style = {};

  for (const tag of extraTags) {
    const match = tag.pattern.test(text);
    if (match) {
      style = { ...style, ...tag.style };
    }
  }
  text = cleanString(text);
  return { text, ...style, ...currentTag };
};
