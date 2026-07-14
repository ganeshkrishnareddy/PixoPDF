# SEO Audit - ZeroPDF

Verified indexing configurations for production deployment:

## 1. Structured Indexing Directives
- **Crawler Access**: Verified that `robots.txt` does not restrict access to core assets, scripts, stylesheets, or vendor libraries.
- **noindex Checks**: Checked that no `<meta name="robots" content="noindex">` exists on any of the target tool index pages.
- **Sitemap URLs**: Checked that `sitemap.xml` contains absolute URLs pointing directly to index directories, with no fake attributes.

## 2. Directory Metadata Matrix

| Path | H1 Tag | Title Tag | Meta Description | Canonical URL |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Free Online PDF Tools | Free Online PDF Tools – Merge, Split & Convert | Free online PDF tools to merge, split, compress and convert files directly... | `https://zeropdf.pages.dev/` |
| `/merge-pdf/` | Merge PDF Files Online for Free | Merge PDF Online Free – Combine PDF Files | Merge PDF files online for free. Combine multiple PDFs securely in your browser... | `https://zeropdf.pages.dev/merge-pdf/` |
| `/split-pdf/` | Split PDF Files Online for Free | Split PDF Online Free – Extract PDF Pages | Split PDF files online for free. Extract selected pages or separate every PDF page... | `https://zeropdf.pages.dev/split-pdf/` |
| `/compress-pdf/` | Compress PDF Online Free | Compress PDF Online Free – Reduce PDF Size | Compress PDF files online for free with browser-based PDF optimization... | `https://zeropdf.pages.dev/compress-pdf/` |
| `/jpg-to-pdf/` | Convert JPG to PDF Online for Free | JPG to PDF Converter Free – Images to PDF | Convert JPG and PNG images to PDF online for free. Reorder images, choose page... | `https://zeropdf.pages.dev/jpg-to-pdf/` |
| `/pdf-to-jpg/` | Convert PDF to JPG Online | PDF to JPG Converter Free – Convert PDF to Images | Convert PDF pages to JPG or PNG images online for free. Process documents privately... | `https://zeropdf.pages.dev/pdf-to-jpg/` |
| `/privacy/` | Privacy & File Processing Architecture | Privacy & Local PDF Processing | Learn about ZeroPDF's local browser-based PDF processing. No file uploads... | `https://zeropdf.pages.dev/privacy/` |

All targets have exactly one H1 tag and self-referencing canonical definitions to resolve index deduplication issues.
