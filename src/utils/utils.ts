const unicodes = [{ code: "&#x20;", replace: " " }];

export const cleanUnicodefromText = (text: string) => {
  unicodes.forEach(({ code, replace }) => {
    text = text.replaceAll(code, replace);
  });
  return text;
};
