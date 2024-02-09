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

  // marked.use({
  //   async: true,
  //   pedantic: false,
  //   gfm: true,
  // });

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
    defaultStyle: globalOptions.defaultStyle,
  };
}

const options = {
  headings: {
    h1: {
      fontSize: 24,

      underline: false,
    },
  },
  hr: {
    lineThickness: 8,
    lineWidth: 532,
    lineColor: "#fc2c2c",
    margin: [0, 5, 0, 10],
  },
};

const markdown = `
# ***<u>Notice to all residents</u>***

The parking lot will be ***<u>cleared</u>*** on ***<u>January</u>*** 31,
sdsdsdsd sdsdsdds <u>test</u> blablabla
`;

mdpdfmake(markdown, options).then((docDefinition) => {
  // Use docDefinition with a PDFMake instance to generate a PDF
  console.log(docDefinition.content[1]);
});

export { mdpdfmake };
