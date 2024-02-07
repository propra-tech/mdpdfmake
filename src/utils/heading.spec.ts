import { assert } from "chai";
import { globalOptions } from "../globalOptions";
import { pdfMakeHeading } from "./heading";

describe("utils/heading", () => {
  describe("convert to markdown headings", () => {
    it("convert h1", () => {
      const heading = {
        type: "heading",
        depth: 1,
        raw: "# Hello world",
        text: "Hello world",
      };
      const content = [];
      pdfMakeHeading(heading, content);
      assert.deepEqual(content, [
        {
          text: "Hello world",
          fontSize: globalOptions.headings.h1.fontSize,
          bold: true,
          margin: globalOptions.headings.h1.margin,
        },
      ]);
    });
    it("convert h2", () => {
      const heading = {
        type: "heading",
        depth: 2,
        raw: "## Hello world",
        text: "Hello world",
      };
      const content = [];
      pdfMakeHeading(heading, content);
      assert.deepEqual(content, [
        {
          text: "Hello world",
          fontSize: globalOptions.headings.h2.fontSize,
          bold: true,
          margin: globalOptions.headings.h2.margin,
        },
      ]);
    });
  });
});
