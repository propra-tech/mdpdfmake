/**
 * Validation helpers for pdfmake content objects.
 * These validators ensure the library produces valid pdfmake document definitions.
 */

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a margin value.
 * pdfmake margins can be: number, [horizontal, vertical], or [left, top, right, bottom]
 */
function validateMargin(margin: unknown, path: string): string[] {
  const errors: string[] = [];

  if (margin === undefined || margin === null) {
    return errors;
  }

  if (typeof margin === "number") {
    return errors;
  }

  if (Array.isArray(margin)) {
    if (margin.length === 2 || margin.length === 4) {
      const allNumbers = margin.every((v) => typeof v === "number");
      if (!allNumbers) {
        errors.push(`${path}: margin array must contain only numbers`);
      }
    } else {
      errors.push(
        `${path}: margin array must have 2 or 4 elements, got ${margin.length}`
      );
    }
    return errors;
  }

  errors.push(
    `${path}: margin must be a number or array, got ${typeof margin}`
  );
  return errors;
}

/**
 * Validates text content (string, number, or array of content)
 */
function validateTextContent(
  text: unknown,
  path: string,
  depth: number = 0
): string[] {
  const errors: string[] = [];

  if (depth > 10) {
    errors.push(`${path}: text nesting too deep (max 10 levels)`);
    return errors;
  }

  if (text === undefined || text === null) {
    return errors;
  }

  if (typeof text === "string" || typeof text === "number") {
    return errors;
  }

  if (Array.isArray(text)) {
    text.forEach((item, index) => {
      if (typeof item === "string" || typeof item === "number") {
        return;
      }
      if (typeof item === "object" && item !== null) {
        const itemPath = `${path}[${index}]`;
        // Nested text objects can have text property and style properties
        if ("text" in item) {
          errors.push(
            ...validateTextContent(item.text, `${itemPath}.text`, depth + 1)
          );
        }
        if ("margin" in item) {
          errors.push(...validateMargin(item.margin, `${itemPath}.margin`));
        }
      } else {
        errors.push(
          `${path}[${index}]: invalid text array item type: ${typeof item}`
        );
      }
    });
    return errors;
  }

  errors.push(`${path}: text must be string, number, or array, got ${typeof text}`);
  return errors;
}

/**
 * Validates a canvas line element
 */
function validateCanvasLine(
  line: Record<string, unknown>,
  path: string
): string[] {
  const errors: string[] = [];
  const requiredProps = ["x1", "y1", "x2", "y2"];

  for (const prop of requiredProps) {
    if (!(prop in line)) {
      errors.push(`${path}: line element missing required property '${prop}'`);
    } else if (typeof line[prop] !== "number") {
      errors.push(`${path}.${prop}: must be a number, got ${typeof line[prop]}`);
    }
  }

  return errors;
}

/**
 * Validates a canvas element
 */
function validateCanvasElement(
  element: unknown,
  path: string
): string[] {
  const errors: string[] = [];

  if (typeof element !== "object" || element === null) {
    errors.push(`${path}: canvas element must be an object`);
    return errors;
  }

  const elem = element as Record<string, unknown>;

  if (!("type" in elem)) {
    errors.push(`${path}: canvas element missing 'type' property`);
    return errors;
  }

  if (elem.type === "line") {
    errors.push(...validateCanvasLine(elem, path));
  }

  return errors;
}

/**
 * Validates a canvas content object
 */
function validateCanvas(canvas: unknown, path: string): string[] {
  const errors: string[] = [];

  if (!Array.isArray(canvas)) {
    errors.push(`${path}: canvas must be an array`);
    return errors;
  }

  canvas.forEach((element, index) => {
    errors.push(...validateCanvasElement(element, `${path}[${index}]`));
  });

  return errors;
}

/**
 * Validates a table content object
 */
function validateTable(
  table: unknown,
  path: string
): string[] {
  const errors: string[] = [];

  if (typeof table !== "object" || table === null) {
    errors.push(`${path}: table must be an object`);
    return errors;
  }

  const tbl = table as Record<string, unknown>;

  if (!("body" in tbl)) {
    errors.push(`${path}: table missing 'body' property`);
    return errors;
  }

  if (!Array.isArray(tbl.body)) {
    errors.push(`${path}.body: must be a 2D array`);
    return errors;
  }

  tbl.body.forEach((row, rowIndex) => {
    if (!Array.isArray(row)) {
      errors.push(`${path}.body[${rowIndex}]: row must be an array`);
    }
  });

  return errors;
}

/**
 * Validates a list (ul or ol)
 */
function validateList(
  items: unknown,
  path: string
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(items)) {
    errors.push(`${path}: list items must be an array`);
    return errors;
  }

  items.forEach((item, index) => {
    errors.push(...validatePdfContentInternal(item, `${path}[${index}]`));
  });

  return errors;
}

/**
 * Validates a stack content object
 */
function validateStack(
  stack: unknown,
  path: string
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(stack)) {
    errors.push(`${path}: stack must be an array`);
    return errors;
  }

  stack.forEach((item, index) => {
    errors.push(...validatePdfContentInternal(item, `${path}[${index}]`));
  });

  return errors;
}

/**
 * Validates a columns content object
 */
function validateColumns(
  columns: unknown,
  path: string
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(columns)) {
    errors.push(`${path}: columns must be an array`);
    return errors;
  }

  columns.forEach((col, index) => {
    errors.push(...validatePdfContentInternal(col, `${path}[${index}]`));
  });

  return errors;
}

/**
 * Internal validation function for pdfmake content
 */
function validatePdfContentInternal(
  content: unknown,
  path: string = "content"
): string[] {
  const errors: string[] = [];

  // Allow primitives
  if (
    content === null ||
    content === undefined ||
    typeof content === "string" ||
    typeof content === "number"
  ) {
    return errors;
  }

  // Arrays are valid content
  if (Array.isArray(content)) {
    content.forEach((item, index) => {
      errors.push(...validatePdfContentInternal(item, `${path}[${index}]`));
    });
    return errors;
  }

  // Must be an object at this point
  if (typeof content !== "object") {
    errors.push(`${path}: content must be an object, array, string, or number`);
    return errors;
  }

  const obj = content as Record<string, unknown>;

  // Validate margin if present
  if ("margin" in obj) {
    errors.push(...validateMargin(obj.margin, `${path}.margin`));
  }

  // Identify content type and validate accordingly
  if ("text" in obj) {
    errors.push(...validateTextContent(obj.text, `${path}.text`));
  }

  if ("canvas" in obj) {
    errors.push(...validateCanvas(obj.canvas, `${path}.canvas`));
  }

  if ("table" in obj) {
    errors.push(...validateTable(obj.table, `${path}.table`));
  }

  if ("ul" in obj) {
    errors.push(...validateList(obj.ul, `${path}.ul`));
  }

  if ("ol" in obj) {
    errors.push(...validateList(obj.ol, `${path}.ol`));
  }

  if ("stack" in obj) {
    errors.push(...validateStack(obj.stack, `${path}.stack`));
  }

  if ("columns" in obj) {
    errors.push(...validateColumns(obj.columns, `${path}.columns`));
  }

  if ("image" in obj) {
    if (typeof obj.image !== "string") {
      errors.push(`${path}.image: must be a string`);
    }
  }

  return errors;
}

/**
 * Validates pdfmake content and returns a validation result
 */
export function validatePdfContent(content: unknown): ValidationResult {
  const errors = validatePdfContentInternal(content);
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a complete pdfmake document definition
 */
export function validateDocDefinition(doc: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof doc !== "object" || doc === null) {
    return {
      valid: false,
      errors: ["Document definition must be an object"],
    };
  }

  const docObj = doc as Record<string, unknown>;

  if (!("content" in docObj)) {
    errors.push("Document definition missing 'content' property");
  } else {
    const contentErrors = validatePdfContentInternal(docObj.content, "content");
    errors.push(...contentErrors);
  }

  // defaultStyle is optional but if present should be an object
  if ("defaultStyle" in docObj) {
    if (typeof docObj.defaultStyle !== "object" || docObj.defaultStyle === null) {
      errors.push("defaultStyle must be an object");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Asserts that content is valid pdfmake content.
 * Throws an assertion error with detailed messages if invalid.
 */
export function assertValidPdfContent(content: unknown): void {
  const result = validatePdfContent(content);
  if (!result.valid) {
    throw new Error(
      `Invalid pdfmake content:\n${result.errors.map((e) => `  - ${e}`).join("\n")}`
    );
  }
}

/**
 * Asserts that a document is a valid pdfmake document definition.
 * Throws an assertion error with detailed messages if invalid.
 */
export function assertValidDocDefinition(doc: unknown): void {
  const result = validateDocDefinition(doc);
  if (!result.valid) {
    throw new Error(
      `Invalid pdfmake document definition:\n${result.errors.map((e) => `  - ${e}`).join("\n")}`
    );
  }
}
