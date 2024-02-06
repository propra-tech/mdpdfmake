import { Tokens } from "Tokens";
import { globalOptions } from "../globalOptions";

export const pdfMakeHeading = (
  token: Tokens.Heading | Tokens.Generic,
  content: any[],
  push: boolean = true
) => {
  const fontSize = globalOptions.headings[`h${token.depth}`].fontSize;
  const bold = globalOptions.headings[`h${token.depth}`].bold;
  const margin = globalOptions.headings[`h${token.depth}`].margin;
  const style = globalOptions.headings[`h${token.depth}`].underline
    ? { decoration: "underline" }
    : {};

  if (push) {
    content.push({
      text: token.text,
      fontSize,
      bold,
      margin,
      style,
    });
  }

  return {
    text: token.text,
    fontSize,
    bold,
    margin,
    style,
  };
};
