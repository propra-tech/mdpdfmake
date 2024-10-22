import { Tokens } from "marked";
import { globalOptions } from "../globalOptions";
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

  const styles = mergetags({}, token.text);

  if (push) {
    content.push({
      text: cleanUnicodefromText(token.text),
      fontSize,
      bold,
      margin,
      ...styles,
    });
  }

  return {
    text: cleanUnicodefromText(token.text),
    fontSize,
    bold,
    margin,
    ...styles,
  };
};
