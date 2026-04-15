import { Tokens } from "marked";
import { globalOptions } from "../globalOptions";
import { pdfMakeCodeblock } from "./codeblock";
import { addToContent } from "./content-builder";
import { mergetags } from "./mergetags";
import { cleanUnicodefromText } from "./utils";

const styledTypes = ["strong", "em", "codespan", "del", "underline", "link"];

function buildStyledFragment(token) {
  // Skip auto-linked emails — render as plain text
  // Autolinks have raw without markdown link syntax (no "[")
  if (token.type === "link" && token.href?.startsWith("mailto:") && !token.raw?.startsWith("[")) {
    return { text: cleanUnicodefromText(token.text) };
  }

  const styleResult = getStyle(token.type, token.text || token.raw);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { text: _ignoredText, ...style } = styleResult as { text?: string };
  const fragment: { text: string; link?: string } & Record<string, unknown> = {
    text: cleanUnicodefromText(token.text),
    ...style,
  };
  if (token.type === "link") {
    fragment.link = token.href;
  }
  return fragment;
}

export const pdfMakeText = async (
  token: Tokens.Text | Tokens.Generic,
  content: any[],
  push: boolean = true,
) => {
  if (token?.tokens && token?.tokens.length > 0) {
    const textFragments: any[] = [];
    for (const childToken of token.tokens) {
      if (styledTypes.includes(childToken.type)) {
        textFragments.push(buildStyledFragment(childToken));
      } else if (childToken.type === "code") {
        const codeContent = await pdfMakeCodeblock(childToken, [], false);
        textFragments.push(codeContent);
      } else if (childToken.type === "text") {
        const textRecContent = await pdfMakeText(childToken, [], false);
        textFragments.push(...textRecContent.map((f) => f.text));
      } else if (childToken.type === "br") {
        textFragments.push("\n");
      } else {
        console.warn(`Unhandled token type: ${childToken.type}`);
        textFragments.push({ text: childToken.raw });
      }
    }

    const combinedText = {
      text: textFragments,
      margin: globalOptions.margins.default,
    };

    addToContent(content, combinedText, push);
    return [combinedText];
  } else {
    let fragment;
    if (styledTypes.includes(token.type)) {
      fragment = buildStyledFragment(token);
    } else if (token.type === "text") {
      fragment = { text: cleanUnicodefromText(token.text) };
    } else if (token.type === "code") {
      fragment = await pdfMakeCodeblock(token, [], false);
    } else {
      console.warn(`Unhandled token type: ${token.type}`);
      fragment = { text: token.raw };
    }

    addToContent(content, fragment, push);
    return [fragment];
  }
};

const staticStyles = {
  codespan: {
    background: "#f0f0f0",
    fontSize: 10,
    margin: globalOptions.margins.default,
  },
  del: { decoration: "lineThrough" },
  link: { color: "blue", decoration: "underline" },
  code: {
    fontSize: 10,
    color: "#333333",
    preserveLeadingSpaces: true,
    lineHeight: 1.2,
  },
};

const mergetagStyles = {
  strong: { bold: true },
  em: { italics: true },
  underline: { style: { decoration: "underline" } },
  ul: { style: { decoration: "underline" } },
};

export function getStyle(type: string, text?: string) {
  if (type in staticStyles) {
    return staticStyles[type];
  }
  if (type in mergetagStyles) {
    return mergetags(mergetagStyles[type], text);
  }
  return {};
}
