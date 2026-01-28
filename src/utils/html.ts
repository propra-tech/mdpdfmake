import { Tokens } from "marked";
import { globalOptions } from "../globalOptions";
import { addToContent } from "./content-builder";
import { imageURLToBase64 } from "./utils";

export const pdfMakeHTML = async (
  token: Tokens.HTML | Tokens.Generic,
  content: any[],
  push: boolean = true
) => {
  let transformedContent = {};

  const tags = [{ pattern: /<img/g, value: "img" }];

  for (const tag of tags) {
    if (tag.pattern.test(token.text)) {
      switch (tag.value) {
        case "img": {
          const image = token.text.match(/src="([^"]*)"/);
          if (image) {
            const base64Image = await imageURLToBase64(image[1]);
            const width = token.text.match(/width="([^"]*)"/);
            const height = token.text.match(/height="([^"]*)"/);
            transformedContent = {
              image: `${base64Image}`,
              width: width?.[1] && Number(width[1]),
              height: height?.[1] && Number(height[1]),
              margin: globalOptions.margins.default,
            };
          }
          break;
        }
        default:
          console.warn(`Unhandled tag type: ${tag.value}`);
      }
    }
  }

  return addToContent(content, transformedContent, push);
};
