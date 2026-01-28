import { describe, it } from "node:test";
import assert from "node:assert";
import { globalOptions } from "../globalOptions";
import { pdfMakeCodeblock } from "./codeblock";
import { assertValidPdfContent } from "../test-utils/pdfmake-validators";

describe("utils/codeblock", () => {
  describe("convert markdown code blocks", () => {
    it("convert code block with language", async () => {
      const codeToken = {
        type: "code",
        raw: "```javascript\nconsole.log('hello');\n```",
        text: "console.log('hello');",
        lang: "javascript",
      };
      const content = [];
      await pdfMakeCodeblock(codeToken, content);

      assertValidPdfContent(content[0]);

      assert.strictEqual(content.length, 1);
      assert.strictEqual(content[0].stack[0].text, "javascript");
      assert.strictEqual(content[0].stack[0].bold, true);
      assert.strictEqual(content[0].stack[0].color, "#004252");
      assert.deepStrictEqual(content[0].margin, globalOptions.codeblock.margin);
    });

    it("convert code block without language", async () => {
      const codeToken = {
        type: "code",
        raw: "```\nsome code\n```",
        text: "some code",
      };
      const content = [];
      await pdfMakeCodeblock(codeToken, content);

      assertValidPdfContent(content[0]);

      assert.strictEqual(content.length, 1);
      // Language header should be empty object when no lang
      assert.deepStrictEqual(content[0].stack[0], {});
      assert.deepStrictEqual(content[0].margin, globalOptions.codeblock.margin);
    });

    it("code block contains correct text", async () => {
      const codeToken = {
        type: "code",
        raw: "```python\nprint('hello')\n```",
        text: "print('hello')",
        lang: "python",
      };
      const content = [];
      await pdfMakeCodeblock(codeToken, content);

      assertValidPdfContent(content[0]);

      const codeText = content[0].stack[1].table.body[0][0];
      assert.strictEqual(codeText.columns[0].text, "print('hello')");
    });

    it("code block has correct styling", async () => {
      const codeToken = {
        type: "code",
        raw: "```\ntest\n```",
        text: "test",
      };
      const content = [];
      await pdfMakeCodeblock(codeToken, content);

      const codeText = content[0].stack[1].table.body[0][0];
      // Should have code styling from getStyle("code")
      assert.strictEqual(codeText.columns[0].fontSize, 10);
      assert.strictEqual(codeText.columns[0].color, "#333333");
      assert.strictEqual(codeText.columns[0].preserveLeadingSpaces, true);
    });

    it("code block has border layout", async () => {
      const codeToken = {
        type: "code",
        raw: "```\ntest\n```",
        text: "test",
      };
      const content = [];
      await pdfMakeCodeblock(codeToken, content);

      const layout = content[0].stack[1].layout;
      assert.strictEqual(typeof layout.hLineColor, "function");
      assert.strictEqual(layout.hLineColor(), "#dddddd");
      assert.strictEqual(typeof layout.vLineColor, "function");
      assert.strictEqual(layout.vLineColor(), "#dddddd");
    });

    it("preserves special characters in code", async () => {
      const codeToken = {
        type: "code",
        raw: "```\n<div>&amp;</div>\n```",
        text: "<div>&amp;</div>",
      };
      const content = [];
      await pdfMakeCodeblock(codeToken, content);

      const codeText = content[0].stack[1].table.body[0][0];
      // Code blocks should NOT decode HTML entities - preserve as-is
      assert.strictEqual(codeText.columns[0].text, "<div>&amp;</div>");
    });

    it("handles multi-line code", async () => {
      const codeToken = {
        type: "code",
        raw: "```\nline1\nline2\nline3\n```",
        text: "line1\nline2\nline3",
      };
      const content = [];
      await pdfMakeCodeblock(codeToken, content);

      const codeText = content[0].stack[1].table.body[0][0];
      assert.strictEqual(codeText.columns[0].text, "line1\nline2\nline3");
    });

    it("handles empty code block", async () => {
      const codeToken = {
        type: "code",
        raw: "```\n```",
        text: "",
      };
      const content = [];
      await pdfMakeCodeblock(codeToken, content);

      const codeText = content[0].stack[1].table.body[0][0];
      assert.strictEqual(codeText.columns[0].text, "");
    });
  });

  describe("push parameter", () => {
    it("does not push when push is false", async () => {
      const codeToken = {
        type: "code",
        raw: "```\ntest\n```",
        text: "test",
      };
      const content = [];
      const result = await pdfMakeCodeblock(codeToken, content, false);

      assert.strictEqual(content.length, 0);
      assert.ok(result.stack);
      assert.deepStrictEqual(result.margin, globalOptions.codeblock.margin);
    });

    it("returns codeblock structure when push is false", async () => {
      const codeToken = {
        type: "code",
        raw: "```typescript\nconst x = 1;\n```",
        text: "const x = 1;",
        lang: "typescript",
      };
      const content = [];
      const result = await pdfMakeCodeblock(codeToken, content, false);

      assert.strictEqual(result.stack[0].text, "typescript");
      assert.strictEqual(result.stack[1].table.body[0][0].columns[0].text, "const x = 1;");
    });
  });
});
