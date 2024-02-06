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

async function mdpdfmake(
  markdown: string,
  options?: MOptions
): Promise<TDocumentDefinitions> {
  if (options) {
    for (const [key, value] of Object.entries(options)) {
      if (typeof value === "object") {
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          globalOptions[key][nestedKey] = nestedValue;
        }
      } else {
        globalOptions[key] = value;
      }
    }
  }

  const tokens = lexer(markdown);
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

      default:
        console.warn(`Unhandled token type: ${token.type}`);
    }
  }

  return {
    content: content,
    defaultStyle: {
      font: "Roboto",
    },
  };
}

export { mdpdfmake };
