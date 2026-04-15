import { describe, it } from "node:test";
import assert from "node:assert";
import { pdfMakeText, getStyle } from "./text";
import { assertValidPdfContent } from "../test-utils/pdfmake-validators";

describe("utils/text", () => {
  describe("convert markdown to pdfmake text", () => {
    it("convert bolded text", async () => {
      const text = {
        type: "strong",
        raw: "**Thank you!**",
        text: "Thank you!",
      };
      const content = [];
      await pdfMakeText(text, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [{ bold: true, text: "Thank you!" }]);
    });
    it("convert italicized text", async () => {
      const text = {
        type: "em",
        raw: "*Thank you!*",
        text: "Thank you!",
      };
      const content = [];
      await pdfMakeText(text, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [{ italics: true, text: "Thank you!" }]);
    });
  });

  it("convert link in text", async () => {
    const text = {
      type: "link",
      raw: "[Google](https://www.google.com)",
      text: "Google",
      href: "https://www.google.com",
    };
    const content = [];
    await pdfMakeText(text, content);

    assertValidPdfContent(content[0]);

    assert.deepStrictEqual(content, [
      {
        text: "Google",
        link: "https://www.google.com",
        color: "blue",
        decoration: "underline",
      },
    ]);
  });

  it("should not auto-link email addresses", async () => {
    const text = {
      type: "link",
      raw: "test@example.com",
      text: "test@example.com",
      href: "mailto:test@example.com",
    };
    const content = [];
    await pdfMakeText(text, content);

    assertValidPdfContent(content[0]);

    assert.deepStrictEqual(content, [{ text: "test@example.com" }]);
  });

  it("should keep intentional email links", async () => {
    const text = {
      type: "link",
      raw: "[test@example.com](mailto:test@example.com)",
      text: "test@example.com",
      href: "mailto:test@example.com",
    };
    const content = [];
    await pdfMakeText(text, content);

    assertValidPdfContent(content[0]);

    assert.deepStrictEqual(content, [
      {
        text: "test@example.com",
        link: "mailto:test@example.com",
        color: "blue",
        decoration: "underline",
      },
    ]);
  });

  it("convert strikethrough text", async () => {
    const text = {
      type: "del",
      raw: "~~Thank you!~~",
      text: "Thank you!",
    };
    const content = [];
    await pdfMakeText(text, content);

    assertValidPdfContent(content[0]);

    assert.deepStrictEqual(content, [
      { decoration: "lineThrough", text: "Thank you!" },
    ]);
  });

  describe("HTML entity decoding", () => {
    it("decodes HTML entities in bold text", async () => {
      const text = {
        type: "strong",
        raw: "**Tom &amp; Jerry**",
        text: "Tom &amp; Jerry",
      };
      const content = [];
      await pdfMakeText(text, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [{ bold: true, text: "Tom & Jerry" }]);
    });

    it("decodes apostrophe entity in text", async () => {
      const text = {
        type: "text",
        raw: "It&#39;s great",
        text: "It&#39;s great",
      };
      const content = [];
      await pdfMakeText(text, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [{ text: "It's great" }]);
    });

    it("decodes multiple entities in italic text", async () => {
      const text = {
        type: "em",
        raw: "*&lt;hello&gt;*",
        text: "&lt;hello&gt;",
      };
      const content = [];
      await pdfMakeText(text, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [{ italics: true, text: "<hello>" }]);
    });
  });

  describe("codespan formatting", () => {
    it("convert inline code", async () => {
      const text = {
        type: "codespan",
        raw: "`console.log()`",
        text: "console.log()",
      };
      const content = [];
      await pdfMakeText(text, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: "console.log()",
          background: "#f0f0f0",
          fontSize: 10,
          margin: [0, 5, 0, 5],
        },
      ]);
    });
  });

  describe("text with nested tokens", () => {
    it("converts text with bold child token", async () => {
      const text = {
        type: "text",
        raw: "Hello **world**",
        text: "Hello **world**",
        tokens: [
          { type: "text", raw: "Hello ", text: "Hello " },
          { type: "strong", raw: "**world**", text: "world" },
        ],
      };
      const content = [];
      await pdfMakeText(text, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: ["Hello ", { text: "world", bold: true }],
          margin: [0, 5, 0, 5],
        },
      ]);
    });

    it("handles br token as newline", async () => {
      const text = {
        type: "text",
        raw: "Line 1\nLine 2",
        text: "Line 1\nLine 2",
        tokens: [
          { type: "text", raw: "Line 1", text: "Line 1" },
          { type: "br", raw: "\n" },
          { type: "text", raw: "Line 2", text: "Line 2" },
        ],
      };
      const content = [];
      await pdfMakeText(text, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: ["Line 1", "\n", "Line 2"],
          margin: [0, 5, 0, 5],
        },
      ]);
    });

    it("handles combined bold and italic tokens", async () => {
      const text = {
        type: "text",
        raw: "**bold** and *italic*",
        text: "bold and italic",
        tokens: [
          { type: "strong", raw: "**bold**", text: "bold" },
          { type: "text", raw: " and ", text: " and " },
          { type: "em", raw: "*italic*", text: "italic" },
        ],
      };
      const content = [];
      await pdfMakeText(text, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: [
            { text: "bold", bold: true },
            " and ",
            { text: "italic", italics: true },
          ],
          margin: [0, 5, 0, 5],
        },
      ]);
    });
  });

  describe("getStyle function", () => {
    it("returns bold style for strong type", () => {
      const style = getStyle("strong", "text");
      assert.strictEqual(style.bold, true);
    });

    it("returns italics style for em type", () => {
      const style = getStyle("em", "text");
      assert.strictEqual(style.italics, true);
    });

    it("returns codespan style", () => {
      const style = getStyle("codespan");
      assert.deepStrictEqual(style, {
        background: "#f0f0f0",
        fontSize: 10,
        margin: [0, 5, 0, 5],
      });
    });

    it("returns lineThrough for del type", () => {
      const style = getStyle("del");
      assert.deepStrictEqual(style, { decoration: "lineThrough" });
    });

    it("returns link style", () => {
      const style = getStyle("link");
      assert.deepStrictEqual(style, { color: "blue", decoration: "underline" });
    });

    it("returns code style", () => {
      const style = getStyle("code");
      assert.deepStrictEqual(style, {
        fontSize: 10,
        color: "#333333",
        preserveLeadingSpaces: true,
        lineHeight: 1.2,
      });
    });

    it("returns empty object for unknown type", () => {
      const style = getStyle("unknown");
      assert.deepStrictEqual(style, {});
    });
  });
});
