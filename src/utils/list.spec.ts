import { describe, it } from "node:test";
import assert from "node:assert";
import { pdfMakeList } from "./list";
import { globalOptions } from "../globalOptions";
import { assertValidPdfContent } from "../test-utils/pdfmake-validators";

describe("utils/list", () => {
  describe("convert markdown to pdfmake list", () => {
    it("convert ordered list", async () => {
      const list = {
        type: "list",
        raw: "1. First item\n2. Second item",
        ordered: true,
        start: 1,
        loose: false,
        items: [
          {
            type: "list_item",
            raw: "1. First item",
            tokens: [
              {
                type: "text",
                raw: "First item",
                text: "First item",
              },
            ],
          },
          {
            type: "list_item",
            raw: "2. Second item",
            tokens: [
              {
                type: "text",
                raw: "Second item",
                text: "Second item",
              },
            ],
          },
        ],
      };
      const content = [];
      await pdfMakeList(list, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          ol: [
            [{ text: "First item" }],
            [{ text: "Second item" }],
          ],
          margin: globalOptions.list.margin,
          fontSize: globalOptions.list.fontSize,
        },
      ]);
    });

    it("convert unordered list", async () => {
      const list = {
        type: "list",
        raw: "- First item\n- Second item",
        ordered: false,
        start: 1,
        loose: false,
        items: [
          {
            type: "list_item",
            raw: "- First item",
            tokens: [
              {
                type: "text",
                raw: "First item",
                text: "First item",
              },
            ],
          },
          {
            type: "list_item",
            raw: "- Second item",
            tokens: [
              {
                type: "text",
                raw: "Second item",
                text: "Second item",
              },
            ],
          },
        ],
      };
      const content = [];
      await pdfMakeList(list, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          ul: [
            [{ text: "First item" }],
            [{ text: "Second item" }],
          ],
          margin: globalOptions.list.margin,
          fontSize: globalOptions.list.fontSize,
        },
      ]);
    });

    it("convert list with HTML entities", async () => {
      const list = {
        type: "list",
        raw: "- Tom &amp; Jerry",
        ordered: false,
        start: 1,
        loose: false,
        items: [
          {
            type: "list_item",
            raw: "- Tom &amp; Jerry",
            tokens: [
              {
                type: "text",
                raw: "Tom &amp; Jerry",
                text: "Tom &amp; Jerry",
              },
            ],
          },
        ],
      };
      const content = [];
      await pdfMakeList(list, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          ul: [
            [{ text: "Tom & Jerry" }],
          ],
          margin: globalOptions.list.margin,
          fontSize: globalOptions.list.fontSize,
        },
      ]);
    });

    it("convert list with bold item", async () => {
      const list = {
        type: "list",
        raw: "- **Bold item**",
        ordered: false,
        start: 1,
        loose: false,
        items: [
          {
            type: "list_item",
            raw: "- **Bold item**",
            tokens: [
              {
                type: "text",
                raw: "**Bold item**",
                text: "Bold item",
                tokens: [
                  {
                    type: "strong",
                    raw: "**Bold item**",
                    text: "Bold item",
                  },
                ],
              },
            ],
          },
        ],
      };
      const content = [];
      await pdfMakeList(list, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          ul: [
            [{ text: [{ text: "Bold item", bold: true }], margin: [0, 5, 0, 5] }],
          ],
          margin: globalOptions.list.margin,
          fontSize: globalOptions.list.fontSize,
        },
      ]);
    });

    it("returns list structure without pushing when push is false", async () => {
      const list = {
        type: "list",
        raw: "- Item",
        ordered: false,
        start: 1,
        loose: false,
        items: [
          {
            type: "list_item",
            raw: "- Item",
            tokens: [
              { type: "text", raw: "Item", text: "Item" },
            ],
          },
        ],
      };
      const content = [];
      const result = await pdfMakeList(list, content, false);
      assert.strictEqual(content.length, 0);
      assert.deepStrictEqual(result, {
        ul: [
          [{ text: "Item" }],
        ],
        margin: globalOptions.list.margin,
        fontSize: globalOptions.list.fontSize,
      });
    });
  });
});
