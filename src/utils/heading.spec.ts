import { describe, it } from "node:test";
import assert from "node:assert";
import { globalOptions } from "../globalOptions";
import { pdfMakeHeading } from "./heading";
import { assertValidPdfContent } from "../test-utils/pdfmake-validators";

describe("utils/heading", () => {
  describe("convert markdown to pdfmake headings", () => {
    it("convert h1", () => {
      const heading = {
        type: "heading",
        depth: 1,
        raw: "# Hello world",
        text: "Hello world",
      };
      const content = [];
      pdfMakeHeading(heading, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
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

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: "Hello world",
          fontSize: globalOptions.headings.h2.fontSize,
          bold: true,
          margin: globalOptions.headings.h2.margin,
        },
      ]);
    });

    it("convert h3", () => {
      const heading = {
        type: "heading",
        depth: 3,
        raw: "### Hello world",
        text: "Hello world",
      };
      const content = [];
      pdfMakeHeading(heading, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: "Hello world",
          fontSize: globalOptions.headings.h3.fontSize,
          bold: true,
          margin: globalOptions.headings.h3.margin,
        },
      ]);
    });

    it("convert h4", () => {
      const heading = {
        type: "heading",
        depth: 4,
        raw: "#### Hello world",
        text: "Hello world",
      };
      const content = [];
      pdfMakeHeading(heading, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: "Hello world",
          fontSize: globalOptions.headings.h4.fontSize,
          bold: true,
          margin: globalOptions.headings.h4.margin,
        },
      ]);
    });

    it("convert h5", () => {
      const heading = {
        type: "heading",
        depth: 5,
        raw: "##### Hello world",
        text: "Hello world",
      };
      const content = [];
      pdfMakeHeading(heading, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: "Hello world",
          fontSize: globalOptions.headings.h5.fontSize,
          bold: true,
          margin: globalOptions.headings.h5.margin,
        },
      ]);
    });

    it("convert h6", () => {
      const heading = {
        type: "heading",
        depth: 6,
        raw: "###### Hello world",
        text: "Hello world",
      };
      const content = [];
      pdfMakeHeading(heading, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: "Hello world",
          fontSize: globalOptions.headings.h6.fontSize,
          bold: true,
          margin: globalOptions.headings.h6.margin,
        },
      ]);
    });
  });

  describe("headings with HTML entities", () => {
    it("decodes HTML entities in heading", () => {
      const heading = {
        type: "heading",
        depth: 1,
        raw: "# Tom &amp; Jerry",
        text: "Tom &amp; Jerry",
      };
      const content = [];
      pdfMakeHeading(heading, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: "Tom & Jerry",
          fontSize: globalOptions.headings.h1.fontSize,
          bold: true,
          margin: globalOptions.headings.h1.margin,
        },
      ]);
    });

    it("decodes multiple entities in heading", () => {
      const heading = {
        type: "heading",
        depth: 2,
        raw: "## &lt;code&gt; &amp; &quot;text&quot;",
        text: "&lt;code&gt; &amp; &quot;text&quot;",
      };
      const content = [];
      pdfMakeHeading(heading, content);

      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          text: "<code> & \"text\"",
          fontSize: globalOptions.headings.h2.fontSize,
          bold: true,
          margin: globalOptions.headings.h2.margin,
        },
      ]);
    });
  });

  describe("headings with inline formatting", () => {
    it("heading with bold markers adds bold style", () => {
      const heading = {
        type: "heading",
        depth: 1,
        raw: "# **Bold heading**",
        text: "**Bold heading**",
      };
      const content = [];
      pdfMakeHeading(heading, content);
      // mergetags detects ** pattern and adds bold style
      assert.strictEqual(content[0].bold, true);
      assert.strictEqual(content[0].text, "Bold heading");
    });

    it("heading with italic markers adds italic style", () => {
      const heading = {
        type: "heading",
        depth: 2,
        raw: "## *Italic heading*",
        text: "*Italic heading*",
      };
      const content = [];
      pdfMakeHeading(heading, content);
      assert.strictEqual(content[0].italics, true);
      assert.strictEqual(content[0].text, "Italic heading");
    });
  });

  describe("push parameter", () => {
    it("does not push to content when push is false", () => {
      const heading = {
        type: "heading",
        depth: 1,
        raw: "# Title",
        text: "Title",
      };
      const content = [];
      const result = pdfMakeHeading(heading, content, false);
      assert.strictEqual(content.length, 0);
      assert.strictEqual(result.text, "Title");
      assert.strictEqual(result.fontSize, globalOptions.headings.h1.fontSize);
    });
  });
});
