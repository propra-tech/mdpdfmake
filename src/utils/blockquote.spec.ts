import { describe, it } from "node:test";
import assert from "node:assert";
import { globalOptions } from "../globalOptions";
import { pdfMakeBlockquote } from "./blockquote";
import { assertValidPdfContent } from "../test-utils/pdfmake-validators";

describe("utils/blockquote", () => {
  describe("convert markdown to pdfmake blockquote", () => {
    it("convert blockquote with codespan", async () => {
      const blockquote = {
        type: "blockquote",
        raw: "> Hello world in blockquote",
        text: "Hello world in blockquote",
        tokens: [
          {
            type: "codespan",
            raw: "> Hello world in blockquote",
            text: "Hello world in blockquote",
          },
        ],
      };
      const content = [];
      await pdfMakeBlockquote(blockquote, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: [
            {
              text: "Hello world in blockquote",
              background: "#f0f0f0",
              fontSize: 10,
              margin: globalOptions.blockquote.margin,
            },
          ],
        },
      ]);
    });

    it("convert blockquote with paragraph", async () => {
      const blockquote = {
        type: "blockquote",
        raw: "> Quoted text",
        tokens: [
          {
            type: "paragraph",
            raw: "Quoted text",
            text: "Quoted text",
            tokens: [{ type: "text", raw: "Quoted text", text: "Quoted text" }],
          },
        ],
      };
      const content = [];
      await pdfMakeBlockquote(blockquote, content);
      // When paragraph is processed, it pushes to content with blockquote styles
      assert.strictEqual(content.length, 2);
      assert.strictEqual(content[0].italics, globalOptions.blockquote.italics);
      assert.strictEqual(content[0].background, globalOptions.blockquote.background);
    });

    it("convert blockquote with bold text", async () => {
      const blockquote = {
        type: "blockquote",
        raw: "> **Bold quote**",
        tokens: [
          {
            type: "strong",
            raw: "**Bold quote**",
            text: "Bold quote",
          },
        ],
      };
      const content = [];
      await pdfMakeBlockquote(blockquote, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: [{ text: "Bold quote", bold: true }],
        },
      ]);
    });

    it("convert blockquote with italic text", async () => {
      const blockquote = {
        type: "blockquote",
        raw: "> *Italic quote*",
        tokens: [
          {
            type: "em",
            raw: "*Italic quote*",
            text: "Italic quote",
          },
        ],
      };
      const content = [];
      await pdfMakeBlockquote(blockquote, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: [{ text: "Italic quote", italics: true }],
        },
      ]);
    });

    it("convert blockquote with plain text", async () => {
      const blockquote = {
        type: "blockquote",
        raw: "> Simple quote",
        tokens: [
          {
            type: "text",
            raw: "Simple quote",
            text: "Simple quote",
          },
        ],
      };
      const content = [];
      await pdfMakeBlockquote(blockquote, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: [{ text: "Simple quote" }],
        },
      ]);
    });

    it("convert blockquote with strikethrough", async () => {
      const blockquote = {
        type: "blockquote",
        raw: "> ~~deleted~~",
        tokens: [
          {
            type: "del",
            raw: "~~deleted~~",
            text: "deleted",
          },
        ],
      };
      const content = [];
      await pdfMakeBlockquote(blockquote, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: [{ text: "deleted", decoration: "lineThrough" }],
        },
      ]);
    });

    it("convert blockquote with link", async () => {
      const blockquote = {
        type: "blockquote",
        raw: "> [Link](https://example.com)",
        tokens: [
          {
            type: "link",
            raw: "[Link](https://example.com)",
            text: "Link",
            href: "https://example.com",
          },
        ],
      };
      const content = [];
      await pdfMakeBlockquote(blockquote, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: [
            {
              text: "Link",
              color: "blue",
              decoration: "underline",
              link: "https://example.com",
            },
          ],
        },
      ]);
    });
  });

  describe("blockquotes with HTML entities", () => {
    it("decodes HTML entities in blockquote", async () => {
      const blockquote = {
        type: "blockquote",
        raw: "> Tom &amp; Jerry",
        tokens: [
          {
            type: "text",
            raw: "Tom &amp; Jerry",
            text: "Tom &amp; Jerry",
          },
        ],
      };
      const content = [];
      await pdfMakeBlockquote(blockquote, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: [{ text: "Tom & Jerry" }],
        },
      ]);
    });
  });

  describe("push parameter", () => {
    it("returns blockquote format when push is false", async () => {
      const blockquote = {
        type: "blockquote",
        raw: "> Test",
        tokens: [{ type: "text", raw: "Test", text: "Test" }],
      };
      const content = [];
      const result = await pdfMakeBlockquote(blockquote, content, false);
      assert.strictEqual(content.length, 0);
      assert.deepStrictEqual(result, {
        text: [{ text: "Test" }],
      });
    });
  });
});
