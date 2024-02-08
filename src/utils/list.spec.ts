import { assert } from "chai";
import { pdfMakeText } from "./text";

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
      await pdfMakeText(list, content);
      assert.deepEqual(content, [
        {
          text: "1. First item\n2. Second item",
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
      await pdfMakeText(list, content);
      assert.deepEqual(content, [
        {
          text: "- First item\n- Second item",
        },
      ]);
    });
  });
});
