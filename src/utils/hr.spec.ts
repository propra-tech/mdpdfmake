import { describe, it } from "node:test";
import assert from "node:assert";
import { pdfMakeHR } from "./hr";
import { globalOptions } from "../globalOptions";
import { assertValidPdfContent } from "../test-utils/pdfmake-validators";

describe("utils/hr", () => {
  describe("convert markdown to pdfmake hr", () => {
    it("convert hr", async () => {
      const content = [];
      await pdfMakeHR(content);

      // Validate pdfmake structure
      assertValidPdfContent(content[0]);

      assert.deepStrictEqual(content, [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 5,
              x2: globalOptions.hr.lineWidth,
              y2: 5,
              lineWidth: globalOptions.hr.lineThickness,
              lineColor: globalOptions.hr.lineColor,
            },
          ],
          margin: globalOptions.hr.margin,
        },
      ]);
    });
  });
});
