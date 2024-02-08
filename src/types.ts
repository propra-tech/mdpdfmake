export interface MOptions {
  headings?: {
    h1?: {
      fontSize?: number;
      bold?: boolean;
      margin?: number[];
    };
    h2?: {
      fontSize?: number;
      bold?: boolean;
      margin?: number[];
    };
    h3?: {
      fontSize?: number;
      bold?: boolean;
      margin?: number[];
    };
    h4?: {
      fontSize?: number;
      bold?: boolean;
      margin?: number[];
    };
    h5?: {
      fontSize?: number;
      bold?: boolean;
      margin?: number[];
    };
    h6?: {
      fontSize?: number;
      bold?: boolean;
      margin?: number[];
    };
  };
  hr?: {
    lineThickness?: number;
    lineWidth?: number;
    lineColor?: string;
    margin?: number[];
  };
  blockquote?: {
    fontSize?: number;
    italics?: boolean;
    margin?: number[];
    background?: string;
  };
  list?: {
    fontSize?: number;
    margin?: number[];
  };
  paragraph?: {
    fontSize?: number;
    margin?: number[];
  };
  codeblock?: {
    margin?: number[];
  };
  defaultStyle?: {
    font: string;
  };
}
