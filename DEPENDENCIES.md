# ZeroPDF Dependencies

All third-party library files are downloaded and hosted locally in `/assets/vendor/` to prevent external CDN reliance, respect the privacy-first offline-capable model, and ensure high reliability.

| Library | Version | Local Path | Origin / Source URL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **pdf-lib** | 1.17.1 | `/assets/vendor/pdf-lib/pdf-lib.min.js` | [unpkg.com](https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js) | Client-side PDF generation, merging, splitting, inserting images, and modifying document page structures. |
| **pdf.js** | 3.11.174 | `/assets/vendor/pdfjs/pdf.min.js` | [cdnjs.com](https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js) | Parsing PDF files, retrieving page counts, rendering page thumbnails, and converting PDF pages to canvases/images. |
| **pdf.js worker** | 3.11.174 | `/assets/vendor/pdfjs/pdf.worker.min.js` | [cdnjs.com](https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js) | Web worker script companion for pdf.js to perform resource-intensive parsing operations off the main thread. |
| **jszip** | 3.10.1 | `/assets/vendor/jszip.min.js` | [cdnjs.com](https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js) | Compressing multiple output images or split PDF files into a single downloadable ZIP archive entirely in the browser. |
