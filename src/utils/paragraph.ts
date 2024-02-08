import { Tokens } from "Tokens";
import { pdfMakeText } from "./text";
import { pdfMakeCodeblock } from "./codeblock";
import { globalOptions } from "../globalOptions";

export const pdfMakeParagraph = async (
  token: Tokens.Paragraph | Tokens.Generic,
  content: any[],
  push: boolean = true
) => {
  if (token.tokens && token.tokens.length > 0) {
    const inlineElements: any[] = [];

    for (const childToken of token.tokens) {
      switch (childToken.type) {
        case "strong":
        case "em":
        case "codespan":
        case "del":
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
        default:
          console.warn(`Unhandled token type: ${childToken.type}`);
          inlineElements.push({ text: childToken.raw });
      }
    }

    // Push remaining inline elements after the last image (if any)
    if (inlineElements.length > 0) {
      content.push({
        text: inlineElements,
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
      text: token.text,
      fontSize: globalOptions.paragraph.fontSize,
      margin: globalOptions.paragraph.margin,
    };
    if (push) content.push(simpleParagraph);
    return simpleParagraph;
  }
};
