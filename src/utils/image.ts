import { Tokens } from "marked";
import { globalOptions } from "../globalOptions";
import { addToContent } from "./content-builder";
import { imageURLToBase64 } from "./utils";

export const pdfMakeImage = async (
  token: Tokens.Image | Tokens.Generic,
  content: any[],
  push: boolean = true
) => {
  try {
    const base64Image = await imageURLToBase64(token.href);

    const extension = token.href.split(".").pop();

    let dataUrl = "";

    if (["jpg", "jpeg", "png"].includes(extension))
      dataUrl = `data:image/${extension};base64,` + base64Image;
    else if (extension === "svg")
      dataUrl = `data:image/svg+xml;base64,` + base64Image;
    else if (extension === "gif")
      dataUrl = `data:image/gif;base64,` + base64Image;
    else dataUrl = `${base64Image}`;

    const imageContent = { image: dataUrl, margin: globalOptions.margins.default };
    return addToContent(content, imageContent, push);
  } catch (err) {
    console.log(err);
    return {
      text: `[Image: ${token.href}]`,
      link: token.href,
      color: "blue",
      decoration: "underline",
    };
  }
};
