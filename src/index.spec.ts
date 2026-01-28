import { describe, it } from "node:test";
import assert from "node:assert";
import { mdpdfmake } from ".";
import { globalOptions } from "./globalOptions";
import { assertValidDocDefinition } from "./test-utils/pdfmake-validators";

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
        assertValidDocDefinition(docDefinition);

        assert.deepStrictEqual(docDefinition, {
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
        assertValidDocDefinition(docDefinition);

        assert.deepStrictEqual(docDefinition, {
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

  describe("HTML entity handling", () => {
    it("should decode HTML entities in headings", async () => {
      const markdown = `# Tom &amp; Jerry`;
      const docDefinition = await mdpdfmake(markdown);

      assertValidDocDefinition(docDefinition);

      assert.strictEqual(docDefinition.content[0].text, "Tom & Jerry");
    });

    it("should decode HTML entities in paragraphs", async () => {
      const markdown = `Hello &amp; goodbye`;
      const docDefinition = await mdpdfmake(markdown);

      assertValidDocDefinition(docDefinition);

      assert.strictEqual(docDefinition.content[0].text[0].text, "Hello & goodbye");
    });

    it("should decode entities in bold text", async () => {
      const markdown = `**Tom &amp; Jerry**`;
      const docDefinition = await mdpdfmake(markdown);

      const boldText = docDefinition.content[0].text[0];
      assert.strictEqual(boldText.text, "Tom & Jerry");
      assert.strictEqual(boldText.bold, true);
    });

    it("should decode entities in list items", async () => {
      const markdown = `- Item &amp; stuff`;
      const docDefinition = await mdpdfmake(markdown);

      // Check the list item text is decoded
      const listItem = docDefinition.content[0].ul[0];
      assert.ok(listItem[0].text.includes("Item & stuff") || listItem[0].text[0] === "Item & stuff");
    });
  });

  describe("code blocks", () => {
    it("should convert code blocks with language", async () => {
      const markdown = "```javascript\nconsole.log('hello');\n```";
      const docDefinition = await mdpdfmake(markdown);

      assertValidDocDefinition(docDefinition);

      const codeBlock = docDefinition.content[0];
      assert.ok(codeBlock.stack);
      assert.strictEqual(codeBlock.stack[0].text, "javascript");
      assert.strictEqual(codeBlock.stack[0].bold, true);
    });

    it("should handle code content with special characters", async () => {
      const markdown = "```\nconst x = 1 + 2;\n```";
      const docDefinition = await mdpdfmake(markdown);

      assertValidDocDefinition(docDefinition);

      const codeBlock = docDefinition.content[0];
      const codeText = codeBlock.stack[1].table.body[0][0].columns[0].text;
      assert.strictEqual(codeText, "const x = 1 + 2;");
    });
  });

  describe("links", () => {
    it("should convert links in paragraphs", async () => {
      const markdown = `Visit [Google](https://google.com) today.`;
      const docDefinition = await mdpdfmake(markdown);

      assertValidDocDefinition(docDefinition);

      const paragraph = docDefinition.content[0];
      const linkFragment = paragraph.text.find((t) => t.link);

      assert.ok(linkFragment);
      assert.strictEqual(linkFragment.text, "Google");
      assert.strictEqual(linkFragment.link, "https://google.com");
      assert.strictEqual(linkFragment.color, "blue");
      assert.strictEqual(linkFragment.decoration, "underline");
    });
  });

  describe("strikethrough", () => {
    it("should convert strikethrough text", async () => {
      const markdown = `~~deleted text~~`;
      const docDefinition = await mdpdfmake(markdown);

      assertValidDocDefinition(docDefinition);

      const paragraph = docDefinition.content[0];
      const delFragment = paragraph.text.find((t) => t.decoration === "lineThrough");

      assert.ok(delFragment);
      assert.strictEqual(delFragment.text, "deleted text");
    });
  });

  describe("ordered lists", () => {
    it("should convert ordered lists", async () => {
      const markdown = `1. First
2. Second
3. Third`;
      const docDefinition = await mdpdfmake(markdown);

      assertValidDocDefinition(docDefinition);

      const list = docDefinition.content[0];
      assert.ok(list.ol);
      assert.strictEqual(list.ol.length, 3);
    });
  });

  describe("multiple heading levels", () => {
    it("should convert all heading levels", async () => {
      const markdown = `# H1
## H2
### H3
#### H4
##### H5
###### H6`;
      const docDefinition = await mdpdfmake(markdown);

      assertValidDocDefinition(docDefinition);

      assert.strictEqual(docDefinition.content[0].fontSize, globalOptions.headings.h1.fontSize);
      assert.strictEqual(docDefinition.content[1].fontSize, globalOptions.headings.h2.fontSize);
      assert.strictEqual(docDefinition.content[2].fontSize, globalOptions.headings.h3.fontSize);
      assert.strictEqual(docDefinition.content[3].fontSize, globalOptions.headings.h4.fontSize);
      assert.strictEqual(docDefinition.content[4].fontSize, globalOptions.headings.h5.fontSize);
      assert.strictEqual(docDefinition.content[5].fontSize, globalOptions.headings.h6.fontSize);
    });
  });

  describe("empty document", () => {
    it("should handle empty markdown", async () => {
      const markdown = ``;
      const docDefinition = await mdpdfmake(markdown);

      assertValidDocDefinition(docDefinition);

      assert.ok(docDefinition.content);
      assert.ok(docDefinition.defaultStyle);
    });
  });

  describe("inline code", () => {
    it("should convert inline code spans", async () => {
      const markdown = "Use `console.log()` for debugging.";
      const docDefinition = await mdpdfmake(markdown);

      assertValidDocDefinition(docDefinition);

      const paragraph = docDefinition.content[0];
      const codeFragment = paragraph.text.find((t) => t.background === "#f0f0f0");

      assert.ok(codeFragment);
      assert.strictEqual(codeFragment.text, "console.log()");
      assert.strictEqual(codeFragment.fontSize, 10);
    });
  });
});
