import { Tokens } from "marked";
import { globalOptions } from "../globalOptions";
import { mergetags } from "./mergetags";

export const pdfMakeHeading = (
  token: Tokens.Heading | Tokens.Generic,
  content: any[],
  push: boolean = true
) => {
  const fontSize = globalOptions.headings[`h${token.depth}`].fontSize;
  const bold = globalOptions.headings[`h${token.depth}`].bold;
  const margin = globalOptions.headings[`h${token.depth}`].margin;

  const styles = mergetags({}, token.text);

  if (push) {
    content.push({
      text: token.text,
      fontSize,
      bold,
      margin,
      ...styles,
    });
  }

  return {
    text: token.text,
    fontSize,
    bold,
    margin,
    ...styles,
  };
};
