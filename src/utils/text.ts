import { Tokens } from "marked";
import { pdfMakeCodeblock } from "./codeblock";
import { mergetags } from "./mergetags";

export const pdfMakeText = async (
  token: Tokens.Text | Tokens.Generic,
  content: any[],
  push: boolean = true
) => {
  if (token?.tokens && token?.tokens.length > 0) {
    const textFragments: any[] = [];
    for (const childToken of token.tokens) {
      let fragment: any;
      switch (childToken.type) {
        case "strong":
        case "em":
        case "codespan":
        case "del":
        case "underline":
        case "link": {
          fragment = {
            text: childToken.text,
            ...getStyle(childToken.type, childToken.text),
          };
          if (childToken.type === "link") {
            fragment.link = childToken.href;
          }

          textFragments.push(fragment);
          break;
        }
        case "code": {
          const codeContent = await pdfMakeCodeblock(childToken, [], false);
          textFragments.push(codeContent);
          break;
        }
        case "text": {
          const textRecContent = await pdfMakeText(childToken, [], false);
          textFragments.push(...textRecContent.map((f: any) => f.text));
          break;
        }
        case "br":
          textFragments.push("\n");
          break;
        default:
          console.warn(`Unhandled token type: ${childToken.type}`);
          fragment = { text: childToken.raw };
          textFragments.push(fragment);
      }
    }

    const combinedText = {
      text: textFragments,
      margin: [0, 5, 0, 5],
    };

    if (push) content.push(combinedText);
    return [combinedText];
  } else {
    const textFragments: any[] = [];
    let fragment: any;
    switch (token.type) {
      case "strong":
      case "em":
      case "codespan":
      case "del":
      case "underline":
      case "link":
        fragment = {
          ...getStyle(token.type, token.raw),
        };
        if (token.type === "link") {
          fragment.link = token.href;
        }

        textFragments.push(fragment);
        break;
      case "text":
        fragment = { text: token.text };
        textFragments.push(fragment);
        break;
      case "code": {
        const codeContent = await pdfMakeCodeblock(token, [], false);
        textFragments.push(codeContent);
        break;
      }
      default:
        console.warn(`Unhandled token type: ${token.type}`);
        fragment = { text: token.raw };
        textFragments.push(fragment);
    }

    if (push) content.push(fragment);
    return textFragments;
  }
};

export function getStyle(type: string, text?: string) {
  switch (type) {
    case "strong":
      return mergetags({ bold: true }, text);
    case "em":
      return mergetags({ italics: true }, text);
    case "codespan":
      return {
        background: "#f0f0f0",
        fontSize: 10,
        margin: [0, 5, 0, 5],
      };
    case "del":
      return mergetags({ decoration: "lineThrough" }, text);
    case "link":
      return mergetags({ color: "blue", decoration: "underline" }, text);
    case "underline": {
      return mergetags({ style: { decoration: "underline" } }, text);
    }
    case "code":
      return {
        fontSize: 10, // Smaller font size for code
        color: "#333333", // Darker text color
        preserveLeadingSpaces: true, // Preserve indentation
        lineHeight: 1.2, // Adjust line height for better readability
      };
    case "ul":
      return mergetags({ style: { decoration: "underline" } }, text);
    default:
      return {};
  }
}
