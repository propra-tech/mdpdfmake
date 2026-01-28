import { Tokens } from "marked";
import { globalOptions } from "../globalOptions";
import { addToContent } from "./content-builder";
import { mergetags } from "./mergetags";
import { cleanUnicodefromText } from "./utils";

export const pdfMakeHeading = (
  token: Tokens.Heading | Tokens.Generic,
  content: any[],
  push: boolean = true
) => {
  const fontSize = globalOptions.headings[`h${token.depth}`].fontSize;
  const bold = globalOptions.headings[`h${token.depth}`].bold;
  const margin = globalOptions.headings[`h${token.depth}`].margin;

  const mergetagsResult = mergetags({}, token.text) as { text: string };
  const { text: cleanedText, ...styles } = mergetagsResult;

  const heading = {
    text: cleanUnicodefromText(cleanedText),
    fontSize,
    bold,
    margin,
    ...styles,
  };

  return addToContent(content, heading, push);
};
