import { Tokens } from "marked";
import { pdfMakeText } from "./text";
import { pdfMakeCodeblock } from "./codeblock";
import { globalOptions } from "../globalOptions";
import { pdfMakeImage } from "./image";
import { pdfMakeHTML } from "./html";
import { cleanUnicodefromText } from "./utils";

export const pdfMakeParagraph = async (
  token: Tokens.Paragraph | Tokens.Generic,
  content: any[],
  push: boolean = true
) => {
  if (token.tokens && token.tokens.length > 0) {
    let inlineElements: any[] = [];
    const tags = [
      { pattern: /<u>/g, value: "underline" },
      // Add more patterns and corresponding styles as needed
    ];

    for (const childToken of token.tokens) {
      switch (childToken.type) {
        case "image": {
          // If there are inline elements before the image, push them as a paragraph
          if (inlineElements.length > 0) {
            content.push({
              text: inlineElements,
              margin: [0, 5, 0, 5],
            });
            inlineElements = []; // Reset inline elements
          }

          // Process and push the image as a separate block
          const imageFragment = await pdfMakeImage(childToken, [], false);
          content.push(imageFragment);
          break;
        }
        case "strong":
        case "em":
        case "codespan":
        case "del":
        case "underline":
        case "link": {
          // delete tokens array from childToken
          const fixedChildTokens: any = childToken;
          delete fixedChildTokens.tokens;
          const textRecContent = await pdfMakeText(fixedChildTokens, [], false);
          inlineElements.push(...textRecContent);
          break;
        }
        case "code": {
          const codeContent = await pdfMakeCodeblock(childToken, [], false);
          inlineElements.push(codeContent);
          break;
        }
        case "text": {
          // delete tokens array from childToken
          const textRecContentText = await pdfMakeText(childToken, [], false);
          inlineElements.push(...textRecContentText);
          break;
        }
        case "html":
          for (const tag of tags) {
            const index = token.tokens.indexOf(childToken);
            const match = tag.pattern.test(childToken.raw);
            if (match) {
              if (token.tokens[index + 1])
                token.tokens[index + 1].type = tag.value;
            } else {
              pdfMakeHTML(childToken, content, false);
            }
          }
          break;
        default:
          console.warn(`Unhandled token type: ${childToken.type}`);
          inlineElements.push({ text: childToken.raw });
      }
    }

    // Push remaining inline elements after the last image (if any)
    if (inlineElements.length > 0) {
      content.push({
        text: inlineElements.map((element) => ({
          text: cleanUnicodefromText(element.text),
        })),
        fontSize: globalOptions.paragraph.fontSize,
        margin: [0, 5, 0, 5],
      });
    }

    // If 'push' is false, return the last paragraph or image
    if (!push) {
      return content[content.length - 1];
    }
  } else {
    const simpleParagraph = {
      text: cleanUnicodefromText(token.text),
      fontSize: globalOptions.paragraph.fontSize,
      margin: globalOptions.paragraph.margin,
    };
    if (push) content.push(simpleParagraph);
    return simpleParagraph;
  }
};
