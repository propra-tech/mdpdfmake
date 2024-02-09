import { globalOptions } from "../globalOptions";
import { pdfMakeParagraph } from "./paragraph";
import { assert } from "chai";

describe("utils/paragraph", () => {
  describe("convert markdown to pdfmake paragraph", () => {
    it("convert bolded text", async () => {
      const paragraph = {
        type: "paragraph",
        raw: "**Thank you!**",
        text: "Thank you!",
        tokens: [{ type: "strong", raw: "**Thank you!**", text: "Thank you!" }],
      };
      const content = [];
      await pdfMakeParagraph(paragraph, content);

      assert.deepEqual(content, [
        {
          fontSize: globalOptions.paragraph.fontSize,
          text: [{ bold: true, text: "Thank you!" }],
          margin: globalOptions.paragraph.margin,
        },
      ]);
    });

    it("convert italicized text", async () => {
      const paragraph = {
        type: "paragraph",
        raw: "*Thank you!*",
        text: "Thank you!",
        tokens: [{ type: "em", raw: "*Thank you!*", text: "Thank you!" }],
      };
      const content = [];
      await pdfMakeParagraph(paragraph, content);

      assert.deepEqual(content, [
        {
          fontSize: globalOptions.paragraph.fontSize,
          text: [{ italics: true, text: "Thank you!" }],
          margin: globalOptions.paragraph.margin,
        },
      ]);
    });
  });

  it("convert long paragraph with some italicized text", async () => {
    const paragraph = {
      type: "paragraph",
      raw: "Hello *world*, how are you?",
      text: "Hello world, how are you?",
      tokens: [
        { type: "text", raw: "Hello ", text: "Hello " },
        { type: "em", raw: "*world*", text: "world" },
        { type: "text", raw: ", how are you?", text: ", how are you?" },
      ],
    };
    const content = [];
    await pdfMakeParagraph(paragraph, content);
    assert.deepEqual(content, [
      {
        fontSize: globalOptions.paragraph.fontSize,
        text: [
          { text: "Hello " },
          { italics: true, text: "world" },
          { text: ", how are you?" },
        ],
        margin: globalOptions.paragraph.margin,
      },
    ]);
  });

  it("convert code paragraph", async () => {
    const paragraph = {
      type: "paragraph",
      raw: "`Hello world`",
      text: "Hello world",
      tokens: [{ type: "codespan", raw: "`Hello world`", text: "Hello world" }],
    };
    const content = [];
    await pdfMakeParagraph(paragraph, content);
    assert.deepEqual(content, [
      {
        fontSize: globalOptions.paragraph.fontSize,
        text: [
          {
            text: "Hello world",
            background: "#f0f0f0",
            fontSize: 10,
            margin: [0, 5, 0, 5],
          },
        ],
        margin: globalOptions.paragraph.margin,
      },
    ]);
  });
});
