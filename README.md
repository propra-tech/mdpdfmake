# mdpdfmake (Convert Markdown to pdfmake easily)

Finding a converter that can convert Markdown to PDFMake can be difficult. This package aims to solve that problem by providing a simple function that takes Markdown input (string) and converts it into a format that can be used with the PDFMake library.

This allows you to easily create PDF documents from your Markdown files.

> [!IMPORTANT]
> This is a fork that removes support for images in exchange for compatibility with browser

### Features

- `Headers`: Supports all levels of Markdown headers.

- `Lists`: Supports both ordered and unordered lists.

- `Links`: Converts Markdown links into clickable links in the PDF.

- ~~`Images`: Converts Markdown image syntax into images in the PDF.~~

- `Text Styling`: Supports bold, italic, strikethrough, and underline text styles.

- `Complex Markdown`: Supports complex Markdown syntax such as nested bold/italic text, and nested blockquote paragraphs.

### Installation

Simply use npm to install this package

```bash

npm  install  mdpdfmake

```

### Usage

To use this converter, simply import the module and call the convert function with your Markdown text as the argument. The function will return a PDFMake document definition that you can use to create your PDF.

```ts

import { mdpdfmake } from  "mdpdfmake";



const  options = {
  headings: {
	h1: {
		fontSize:  30,
		bold:  false,
		margin: [0, 10, 0, 10],
	},
	h2: { ...
  }
};



const  markdown = `# Heading

This is a paragraph with **bold** text and *italic* text.

- List Item 1

- List Item 2

> Blockquote

`;



mdpdfmake(markdown, options).then((docDefinition) => {

// Use docDefinition with a PDFMake instance to generate a PDF

});

```

> Note: The response from the convert function is a Promise, so you will need to use async/await or .then() to get the result.

## API Reference

`mdpdfmake(markdown: string, options?: MOptions): Promise<TDocumentDefinitions>` - Converts the given Markdown string into a PDFMake document definition.

### Parameters:

- `markdown` (string, options?): Converts the given Markdown string into a PDFMake document definition.

### Options

#### Headings

_An object for each headings ( h1 - h6 ) to set custom font size, bold, margins and underline_

##### Defaults

    headings: {
      h1: { fontSize: 36, bold: true, margin: [0, 10, 0, 10] },
      h2: { fontSize: 30, bold: true, margin: [0, 10, 0, 10] },
      h3: { fontSize: 24, bold: true, margin: [0, 5, 0, 5], },
      h4: { fontSize: 18, bold: true, margin: [0, 5, 0, 5], },
      h5: { fontSize: 15, bold: true, margin: [0, 5, 0, 5], },
      h6: { fontSize: 12, bold: true, margin: [0, 5, 0, 5], }
    }

#### Type

    headings?: { h1?: { fontSize?: number; bold?: boolean; margin?: number[]; }; h2?: ... }

---

#### Hr

_Custom settings for hr line_

##### Defaults

    hr: { lineThickness: 1, lineWidth: 515, lineColor: "#2c2c2c", margin: [0, 10, 0, 10], }

#### Type

    hr?: { lineThickness?: number; lineWidth?: number; lineColor?: string; margin?: number[]; };

---

#### Blockquote

_Custom settings for blockquote_

##### Defaults

    { italics: true, margin: [0, 5, 0, 5], background: "#eae7f2", }

#### Type

    blockquote?: { italics?: boolean; margin?: number[]; background?: string; };

---

#### List

_Set custom margins and font size for list_

##### Defaults

    { margin: [0, 5, 0, 5], fontSize: 14 }

#### Type

    list?: { margin?: number[]; fontSize?: number };

---

#### Paragraph

_Set custom margins and font size for paragraph_

##### Defaults

    { margin: [0, 5, 0, 5], fontSize: 14 }

#### Type

    paragraph?: { margin?: number[]; fontSize?: number };

---

#### Codeblock

_Set custom margins for codeblock_

##### Defaults

    { margin: [0, 5, 0, 5] }

#### Type

    codeblock?: { margin?: number[]; };

---

### Upcoming Features

- `Table Support`: Add support for converting Markdown tables into tables in the PDF.

### Contributing

Contributions to this project are welcome! If you're interested in adding a feature or fixing a bug, please open a pull request.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
