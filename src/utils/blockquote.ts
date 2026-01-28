import { Tokens } from "marked";
import { globalOptions } from "../globalOptions";
import { pdfMakeCodeblock } from "./codeblock";
import { addToContent } from "./content-builder";
import { pdfMakeParagraph } from "./paragraph";
import { pdfMakeText } from "./text";

export const pdfMakeBlockquote = async (
  token: Tokens.Blockquote | Tokens.Generic,
  content: any[],
  push: boolean = true
) => {
  const blockquoteContent: any[] = [];

  const handleToken = async (
    nestedToken:
      | Tokens.Paragraph
      | Tokens.Link
      | Tokens.Strong
      | Tokens.Em
      | Tokens.Del
      | Tokens.Code
      | Tokens.Text
      | Tokens.Generic
  ) => {
    switch (nestedToken.type) {
      case "paragraph": {
        const pcontent = await pdfMakeParagraph(nestedToken, [], false);

        content.push({
          ...pcontent,
          italics: globalOptions.blockquote.italics,
          margin: globalOptions.blockquote.margin,
          background: globalOptions.blockquote.background,
        });
        break;
      }
      case "strong":
      case "em":
      case "codespan":
      case "del":
      case "link":
      case "text": {
        const textRecContent = await pdfMakeText(nestedToken, [], false);
        blockquoteContent.push(...textRecContent);
        break;
      }
      case "code": {
        const codeContent = await pdfMakeCodeblock(nestedToken, [], false);
        blockquoteContent.push(codeContent);
        break;
      }
      default:
        blockquoteContent.push({ text: nestedToken.text });
    }
  };

  for (const nestedToken of token.tokens) {
    await handleToken(nestedToken);
  }

  const blockquoteFormat = {
    text: blockquoteContent,
  };

  return addToContent(content, blockquoteFormat, push);
};
