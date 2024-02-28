const unicodes = ["&#x20;"];
export const cleanUnicodefromText = (text: string) => {
  unicodes.forEach((unicode) => {
    text = text.replaceAll(unicode, "");
  });
  return text;
};
