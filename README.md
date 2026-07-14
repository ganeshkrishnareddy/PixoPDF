# PixoPDF

PixoPDF is a privacy-first, zero-signup, zero-watermark, free online PDF tools suite. 
All document editing, merging, splitting, compression, and conversions are handled **entirely in the user's browser sandbox**. Documents never leave the device.

## Locally-Hosted Vendor Libraries
We host version-pinned PDF structures locally to remove CDN single-point failures:
- `pdf-lib` (v1.17.1) for generating, merging, and writing PDFs.
- `pdf.js` (v3.11.174) for rendering previews and converting pages to raster formats.
- `jszip` (v3.10.1) for client-side package assembly.

## Running Locally

To preview PixoPDF, start a local HTTP server inside the project root:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

Open `http://localhost:8000` in your browser.
