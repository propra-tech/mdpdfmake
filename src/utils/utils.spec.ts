import { describe, it } from "node:test";
import assert from "node:assert";
import { cleanUnicodefromText } from "./utils";

describe("utils/utils", () => {
  describe("cleanUnicodefromText", () => {
    it("decodes &amp; to &", () => {
      const result = cleanUnicodefromText("Tom &amp; Jerry");
      assert.strictEqual(result, "Tom & Jerry");
    });

    it("decodes &#39; to apostrophe", () => {
      const result = cleanUnicodefromText("It&#39;s working");
      assert.strictEqual(result, "It's working");
    });

    it("decodes &lt; and &gt; to angle brackets", () => {
      const result = cleanUnicodefromText("&lt;div&gt;");
      assert.strictEqual(result, "<div>");
    });

    it("decodes &quot; to double quote", () => {
      const result = cleanUnicodefromText("He said &quot;Hello&quot;");
      assert.strictEqual(result, 'He said "Hello"');
    });

    it("decodes numeric entity &#123; to {", () => {
      const result = cleanUnicodefromText("&#123;code&#125;");
      assert.strictEqual(result, "{code}");
    });

    it("decodes hex entity &#x7B; to {", () => {
      const result = cleanUnicodefromText("&#x7B;hex&#x7D;");
      assert.strictEqual(result, "{hex}");
    });

    it("decodes multiple entities in mixed text", () => {
      const result = cleanUnicodefromText(
        "Hello &amp; goodbye &lt;world&gt; it&#39;s &quot;great&quot;"
      );
      assert.strictEqual(result, "Hello & goodbye <world> it's \"great\"");
    });

    it("handles empty string", () => {
      const result = cleanUnicodefromText("");
      assert.strictEqual(result, "");
    });

    it("passes through text with no entities", () => {
      const result = cleanUnicodefromText("Hello world, no entities here!");
      assert.strictEqual(result, "Hello world, no entities here!");
    });

    it("decodes &nbsp; to non-breaking space", () => {
      const result = cleanUnicodefromText("Hello&nbsp;World");
      assert.strictEqual(result, "Hello\u00A0World");
    });

    it("decodes &mdash; to em dash", () => {
      const result = cleanUnicodefromText("one&mdash;two");
      assert.strictEqual(result, "one—two");
    });

    it("decodes &ndash; to en dash", () => {
      const result = cleanUnicodefromText("2020&ndash;2024");
      assert.strictEqual(result, "2020–2024");
    });

    it("decodes &copy; to copyright symbol", () => {
      const result = cleanUnicodefromText("&copy; 2024");
      assert.strictEqual(result, "© 2024");
    });

    it("decodes &reg; to registered trademark", () => {
      const result = cleanUnicodefromText("Brand&reg;");
      assert.strictEqual(result, "Brand®");
    });
  });
});
