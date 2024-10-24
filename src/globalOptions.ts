import { MOptions } from "./types";

export const globalOptions: MOptions = {
  headings: {
    h1: {
      fontSize: 36,
      bold: true,
      margin: [0, 10, 0, 10],
    },
    h2: {
      fontSize: 30,
      bold: true,
      margin: [0, 10, 0, 10],
    },
    h3: {
      fontSize: 24,
      bold: true,
      margin: [0, 5, 0, 5],
    },
    h4: {
      fontSize: 18,
      bold: true,
      margin: [0, 5, 0, 5],
    },
    h5: {
      fontSize: 15,
      bold: true,
      margin: [0, 5, 0, 5],
    },
    h6: {
      fontSize: 12,
      bold: true,
      margin: [0, 5, 0, 5],
    },
  },
  hr: {
    lineThickness: 1,
    lineWidth: 515,
    lineColor: "#2c2c2c",
    margin: [0, 10, 0, 10],
  },
  blockquote: {
    italics: true,
    margin: [0, 5, 0, 5],
    background: "#eae7f2",
  },
  list: {
    fontSize: 14,
    margin: [0, 5, 0, 5],
  },
  paragraph: {
    fontSize: 14,
    margin: [0, 5, 0, 5],
  },
  codeblock: {
    margin: [0, 5, 0, 5],
  },
  defaultStyle: {
    font: "Roboto",
  },
};
