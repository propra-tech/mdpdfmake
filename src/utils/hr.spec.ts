import { assert } from "chai";
import { pdfMakeHR } from "./hr";
import { globalOptions } from "../globalOptions";

describe("utils/hr", () => {
  describe("convert to markdown hr", () => {
    it("convert hr", async () => {
      const content = [];
      await pdfMakeHR(content);
      assert.deepEqual(content, [
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
