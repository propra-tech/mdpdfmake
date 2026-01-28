import { describe, it } from "node:test";
import assert from "node:assert";
import { mergetags } from "./mergetags";

describe("utils/mergetags", () => {
  describe("mergetags pattern detection", () => {
    it("detects bold pattern **text**", () => {
      const result = mergetags({}, "**bold text**");
      assert.deepStrictEqual(result, {
        text: "bold text",
        bold: true,
      });
    });

    it("detects italic pattern *text*", () => {
      const result = mergetags({}, "*italic text*");
      assert.deepStrictEqual(result, {
        text: "italic text",
        italics: true,
      });
    });

    it("detects strikethrough pattern ~~text~~", () => {
      const result = mergetags({}, "~~strikethrough~~");
      // cleanString doesn't remove ~~ markers, only ** and * and <u> tags
      assert.deepStrictEqual(result, {
        text: "~~strikethrough~~",
        decoration: "lineThrough",
      });
    });

    it("detects underline pattern <u>text</u>", () => {
      const result = mergetags({}, "<u>underlined</u>");
      assert.deepStrictEqual(result, {
        text: "underlined",
        style: { decoration: "underline" },
      });
    });

    it("detects bold+italic+underline pattern ***<u>text</u>***", () => {
      const result = mergetags({}, "***<u>combo</u>***");
      // Pattern adds both decoration and style properties for underline
      assert.deepStrictEqual(result, {
        text: "combo",
        bold: true,
        italics: true,
        decoration: "underline",
        style: { decoration: "underline" },
      });
    });

    it("passes through text with no patterns", () => {
      const result = mergetags({}, "plain text");
      assert.deepStrictEqual(result, {
        text: "plain text",
      });
    });

    it("merges with existing currentTag properties", () => {
      const result = mergetags({ fontSize: 16 }, "**bold**");
      assert.deepStrictEqual(result, {
        text: "bold",
        bold: true,
        fontSize: 16,
      });
    });

    it("currentTag overrides detected styles", () => {
      const result = mergetags({ bold: false }, "**bold**");
      assert.deepStrictEqual(result, {
        text: "bold",
        bold: false,
      });
    });

    it("handles empty text", () => {
      const result = mergetags({});
      assert.deepStrictEqual(result, {
        text: "",
      });
    });

    it("handles undefined text", () => {
      const result = mergetags({}, undefined);
      assert.deepStrictEqual(result, {
        text: "",
      });
    });

    it("handles multiple bold markers in text", () => {
      const result = mergetags({}, "**one** and **two**");
      assert.deepStrictEqual(result, {
        text: "one and two",
        bold: true,
      });
    });
  });
});
