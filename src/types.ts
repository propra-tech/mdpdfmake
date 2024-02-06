export interface MOptions {
  headings?: {
    h1?: {
      fontSize?: number;
      bold?: boolean;
      margin?: number[];
      underline?: boolean;
    };
    h2?: {
      fontSize?: number;
      bold?: boolean;
      margin?: number[];
      underline?: boolean;
    };
    h3?: {
      fontSize?: number;
      bold?: boolean;
      margin?: number[];
      underline?: boolean;
    };
    h4?: {
      fontSize?: number;
      bold?: boolean;
      margin?: number[];
      underline?: boolean;
    };
    h5?: {
      fontSize?: number;
      bold?: boolean;
      margin?: number[];
      underline?: boolean;
    };
    h6?: {
      fontSize?: number;
      bold?: boolean;
      margin?: number[];
      underline?: boolean;
    };
  };
  hr?: {
    lineThickness?: number;
    lineWidth?: number;
    lineColor?: string;
    margin?: number[];
  };
  blockquote?: {
    italics?: boolean;
    margin?: number[];
    background?: string;
  };
  list?: {
    margin?: number[];
  };
  paragraph?: {
    margin?: number[];
  };
  codeblock?: {
    margin?: number[];
  };
}
