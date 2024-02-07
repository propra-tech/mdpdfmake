import { assert } from "chai";
import { pdfMakeText } from "./text";

describe("utils/text", () => {
  describe("convert to markdown text", () => {
    it("convert bolded text", async () => {
      const text = {
        type: "strong",
        raw: "**Thank you!**",
        text: "Thank you!",
      };
      const content = [];
      await pdfMakeText(text, content);
      assert.deepEqual(content, [{ bold: true, text: "Thank you!" }]);
    });
    it("convert italicized text", async () => {
      const text = {
        type: "em",
        raw: "*Thank you!*",
        text: "Thank you!",
      };
      const content = [];
      await pdfMakeText(text, content);
      assert.deepEqual(content, [{ italics: true, text: "Thank you!" }]);
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
    assert.deepEqual(content, [
      {
        text: "Google",
        link: "https://www.google.com",
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
    assert.deepEqual(content, [
      { decoration: "lineThrough", text: "Thank you!" },
    ]);
  });
});
