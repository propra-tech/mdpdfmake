import { Tokens } from "Tokens";
import { globalOptions } from "../globalOptions";

export const pdfMakeHR = async (content: any[], push: boolean = true) => {
  const horizontalRule = {
    canvas: [
      {
        type: "line",
        x1: 0,
        y1: 5,
        x2: globalOptions.hr.lineWidth,
        y2: 5,
        lineWidth: globalOptions.hr.lineThickness,
        lineColor: globalOptions.hr.lineColor,
      },
    ],
    margin: globalOptions.hr.margin,
  };

  if (push) {
    content.push(horizontalRule);
  }

  return horizontalRule;
};
