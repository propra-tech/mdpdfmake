import { assert } from "chai";
import { mdpdfmake } from ".";
import { globalOptions } from "./globalOptions";

describe("index", () => {
  describe("convert markdown to pdfmake array", () => {
    it("should convert markdown to pdfmake array of object", async () => {
      const markdown = `# Heading
This is a paragraph with **bold** text and *italic* text.

- List Item 1
- List Item 2

___

> Blockquote
`;
      await mdpdfmake(markdown).then((docDefinition) => {
        assert.deepEqual(docDefinition, {
          content: [
            {
              text: "Heading",
              fontSize: 36,
              bold: true,
              margin: [0, 10, 0, 10],
            },
            {
              text: [
                { text: "This is a paragraph with " },
                { text: "bold", bold: true },
                { text: " text and " },
                { text: "italic", italics: true },
                { text: " text." },
              ],
              fontSize: globalOptions.paragraph.fontSize,
              margin: [0, 5, 0, 5],
            },
            {
              ul: [
                [{ text: ["List Item 1"], margin: [0, 5, 0, 5] }],
                [{ text: ["List Item 2"], margin: [0, 5, 0, 5] }],
              ],
              fontSize: globalOptions.list.fontSize,
              margin: [0, 5, 0, 5],
            },
            {
              canvas: [
                {
                  type: "line",
                  x1: 0,
                  y1: 5,
                  x2: 515,
                  y2: 5,
                  lineWidth: 1,
                  lineColor: "#2c2c2c",
                },
              ],
              margin: [0, 10, 0, 10],
            },
            {
              text: [{ text: "Blockquote" }],
              margin: [0, 5, 0, 5],
              italics: true,
              background: "#eae7f2",
              fontSize: globalOptions.paragraph.fontSize,
            },
            { text: [] },
          ],
          defaultStyle: { font: "Roboto" },
        });
      });
    });
    it("should convert markdown to pdfmake array of object with options", async () => {
      const markdown = `# Heading
This is a paragraph with **bold** text and *italic* text.

- List Item 1
- List Item 2

___

> Blockquote
`;

      const options = {
        headings: {
          h1: {
            fontSize: 24,
            margin: [0, 5, 0, 5],
            underline: true,
          },
        },
        hr: {
          lineThickness: 8,
          lineWidth: 532,
          lineColor: "#fc2c2c",
          margin: [0, 5, 0, 10],
        },
      };

      await mdpdfmake(markdown, options).then((docDefinition) => {
        assert.deepEqual(docDefinition, {
          content: [
            {
              text: "Heading",
              fontSize: 24,
              bold: true,
              margin: [0, 5, 0, 5],
            },
            {
              text: [
                { text: "This is a paragraph with " },
                { text: "bold", bold: true },
                { text: " text and " },
                { text: "italic", italics: true },
                { text: " text." },
              ],
              fontSize: globalOptions.paragraph.fontSize,
              margin: [0, 5, 0, 5],
            },
            {
              ul: [
                [{ text: ["List Item 1"], margin: [0, 5, 0, 5] }],
                [{ text: ["List Item 2"], margin: [0, 5, 0, 5] }],
              ],
              fontSize: globalOptions.list.fontSize,
              margin: [0, 5, 0, 5],
            },
            {
              canvas: [
                {
                  type: "line",
                  x1: 0,
                  y1: 5,
                  x2: 532,
                  y2: 5,
                  lineWidth: 8,
                  lineColor: "#fc2c2c",
                },
              ],
              margin: [0, 5, 0, 10],
            },
            {
              text: [{ text: "Blockquote" }],
              margin: [0, 5, 0, 5],
              italics: true,
              background: "#eae7f2",
              fontSize: globalOptions.paragraph.fontSize,
            },
            { text: [] },
          ],
          defaultStyle: { font: "Roboto" },
        });
      });
    });
  });
});
