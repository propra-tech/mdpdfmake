import { describe, it } from "node:test";
import assert from "node:assert";
import { globalOptions } from "../globalOptions";
import { pdfMakeParagraph } from "./paragraph";
import { assertValidPdfContent } from "../test-utils/pdfmake-validators";

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

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
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

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
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

    assertValidPdfContent(content[0]);

    assert.deepStrictEqual(content, [
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

    assertValidPdfContent(content[0]);

    assert.deepStrictEqual(content, [
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

  describe("paragraphs with links", () => {
    it("convert paragraph with link", async () => {
      const paragraph = {
        type: "paragraph",
        raw: "[Google](https://google.com)",
        text: "Google",
        tokens: [
          {
            type: "link",
            raw: "[Google](https://google.com)",
            text: "Google",
            href: "https://google.com",
          },
        ],
      };
      const content = [];
      await pdfMakeParagraph(paragraph, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          fontSize: globalOptions.paragraph.fontSize,
          text: [
            {
              text: "Google",
              color: "blue",
              decoration: "underline",
              link: "https://google.com",
            },
          ],
          margin: globalOptions.paragraph.margin,
        },
      ]);
    });

    it("convert paragraph with text and link", async () => {
      const paragraph = {
        type: "paragraph",
        raw: "Visit [Google](https://google.com) for more info.",
        text: "Visit Google for more info.",
        tokens: [
          { type: "text", raw: "Visit ", text: "Visit " },
          {
            type: "link",
            raw: "[Google](https://google.com)",
            text: "Google",
            href: "https://google.com",
          },
          { type: "text", raw: " for more info.", text: " for more info." },
        ],
      };
      const content = [];
      await pdfMakeParagraph(paragraph, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          fontSize: globalOptions.paragraph.fontSize,
          text: [
            { text: "Visit " },
            {
              text: "Google",
              color: "blue",
              decoration: "underline",
              link: "https://google.com",
            },
            { text: " for more info." },
          ],
          margin: globalOptions.paragraph.margin,
        },
      ]);
    });
  });

  describe("paragraphs with strikethrough", () => {
    it("convert strikethrough text", async () => {
      const paragraph = {
        type: "paragraph",
        raw: "~~deleted~~",
        text: "deleted",
        tokens: [{ type: "del", raw: "~~deleted~~", text: "deleted" }],
      };
      const content = [];
      await pdfMakeParagraph(paragraph, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          fontSize: globalOptions.paragraph.fontSize,
          text: [{ text: "deleted", decoration: "lineThrough" }],
          margin: globalOptions.paragraph.margin,
        },
      ]);
    });
  });

  describe("paragraphs with HTML entities", () => {
    it("decodes HTML entities in paragraph text", async () => {
      const paragraph = {
        type: "paragraph",
        raw: "Tom &amp; Jerry",
        text: "Tom &amp; Jerry",
        tokens: [{ type: "text", raw: "Tom &amp; Jerry", text: "Tom &amp; Jerry" }],
      };
      const content = [];
      await pdfMakeParagraph(paragraph, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          fontSize: globalOptions.paragraph.fontSize,
          text: [{ text: "Tom & Jerry" }],
          margin: globalOptions.paragraph.margin,
        },
      ]);
    });

    it("decodes HTML entities in bold paragraph", async () => {
      const paragraph = {
        type: "paragraph",
        raw: "**Tom &amp; Jerry**",
        text: "Tom &amp; Jerry",
        tokens: [
          { type: "strong", raw: "**Tom &amp; Jerry**", text: "Tom &amp; Jerry" },
        ],
      };
      const content = [];
      await pdfMakeParagraph(paragraph, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          fontSize: globalOptions.paragraph.fontSize,
          text: [{ bold: true, text: "Tom & Jerry" }],
          margin: globalOptions.paragraph.margin,
        },
      ]);
    });
  });

  describe("simple paragraphs without tokens", () => {
    it("converts simple paragraph without tokens array", async () => {
      const paragraph = {
        type: "paragraph",
        raw: "Simple text",
        text: "Simple text",
      };
      const content = [];
      await pdfMakeParagraph(paragraph, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: "Simple text",
          fontSize: globalOptions.paragraph.fontSize,
          margin: globalOptions.paragraph.margin,
        },
      ]);
    });

    it("decodes entities in simple paragraph", async () => {
      const paragraph = {
        type: "paragraph",
        raw: "Hello &amp; World",
        text: "Hello &amp; World",
      };
      const content = [];
      await pdfMakeParagraph(paragraph, content);
      assert.deepStrictEqual(content, [
        {
          text: "Hello & World",
          fontSize: globalOptions.paragraph.fontSize,
          margin: globalOptions.paragraph.margin,
        },
      ]);
    });
  });

  describe("push parameter", () => {
    it("does not push simple paragraph when push is false", async () => {
      const paragraph = {
        type: "paragraph",
        raw: "Test",
        text: "Test",
      };
      const content = [];
      const result = await pdfMakeParagraph(paragraph, content, false);
      assert.strictEqual(content.length, 0);
      assert.strictEqual(result.text, "Test");
    });
  });
});
