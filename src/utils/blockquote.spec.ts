import { assert } from "chai";
import { globalOptions } from "../globalOptions";
import { pdfMakeBlockquote } from "./blockquote";

describe("utils/blockquote", () => {
  describe("convert to markdown blockquote", () => {
    it("convert blockquote", async () => {
      const blockquote = {
        type: "paragraph",
        raw: "> Hello world in blockquote",
        text: "Hello world in blockquote",
        tokens: [
          {
            type: "codespan",
            raw: "> Hello world in blockquote",
            text: "Hello world in blockquote",
          },
        ],
      };
      const content = [];
      await pdfMakeBlockquote(blockquote, content);
      assert.deepEqual(content, [
        {
          text: [
            {
              text: "Hello world in blockquote",
              background: "#f0f0f0",
              fontSize: 10,
              margin: globalOptions.blockquote.margin,
            },
          ],
        },
      ]);
    });
  });
});
