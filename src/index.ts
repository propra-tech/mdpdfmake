// Markdown Tokenizer
import { lexer } from "marked";

// Types
import { TDocumentDefinitions } from "pdfmake/interfaces";

// Utils
import { pdfMakeParagraph } from "./utils/paragraph";
import { pdfMakeHeading } from "./utils/heading";
import { pdfMakeList } from "./utils/list";
import { pdfMakeBlockquote } from "./utils/blockquote";
import { pdfMakeCodeblock } from "./utils/codeblock";
import { pdfMakeHR } from "./utils/hr";
import { MOptions } from "./types";
import { globalOptions } from "./globalOptions";
import { cleanUnicodefromText } from "./utils/utils";
import { pdfMakeImage } from "./utils/image";
import { pdfMakeHTML } from "./utils/html";

async function mdpdfmake(
  markdown: string,
  options?: MOptions
): Promise<TDocumentDefinitions> {
  if (options) {
    for (const key in options) {
      if (key === "headings") {
        for (const heading in options.headings) {
          if (options.headings[heading]) {
            Object.assign(
              globalOptions.headings[heading],
              options.headings[heading]
            );
          }
        }
      } else {
        Object.assign(globalOptions[key], options[key]);
      }
    }
  }

  const tokens = lexer(cleanUnicodefromText(markdown));
  const content: any[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "paragraph":
        await pdfMakeParagraph(token, content);
        break;

      case "heading":
        pdfMakeHeading(token, content);
        break;

      case "list":
        await pdfMakeList(token, content);
        break;

      case "blockquote":
        await pdfMakeBlockquote(token, content);
        break;

      case "image":
        await pdfMakeImage(token, content);
        break;

      case "code":
        await pdfMakeCodeblock(token, content);
        break;

      case "hr":
        await pdfMakeHR(content);
        break;

      case "space":
        break;

      case "br":
        content.push({ text: "\n" });
        break;

      case "html":
        await pdfMakeHTML(token, content);
        break;

      default:
        console.warn(`Unhandled token type: ${token.type}`);
    }
  }

  return {
    content: content,
    defaultStyle: globalOptions.defaultStyle,
  };
}

export { mdpdfmake };
