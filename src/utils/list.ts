import { Tokens } from "marked";
import { globalOptions } from "../globalOptions";
import { addToContent } from "./content-builder";
import { pdfMakeText } from "./text";

export const pdfMakeList = async (
  token: Tokens.List | Tokens.Generic,
  content: any[],
  push: boolean = true
) => {
  const processListItem = async (item) => {
    const itemContent = [];

    for (const childToken of item.tokens) {
      if (childToken.type === "list") {
        // Handle sublists: Recursively process the nested list
        const sublist = await pdfMakeList(childToken, [], false);
        itemContent.push(sublist);
      } else {
        // Handle regular list items
        const textContent = await pdfMakeText(childToken, [], false);
        itemContent.push(...textContent);
      }
    }

    // Return the list item content
    return { text: itemContent };
  };

  const listContent = await Promise.all(
    token.items.map(async (item) => processListItem(item))
  );

  // Define the list format
  const listFormat = token.ordered ? "ol" : "ul";

  const listStructure = {
    [listFormat]: listContent.map((itemContent) => itemContent.text),
    margin: globalOptions.list.margin,
    fontSize: globalOptions.list.fontSize,
  };

  return addToContent(content, listStructure, push);
};
