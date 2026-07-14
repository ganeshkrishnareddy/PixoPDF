/**
 * PixoPDF Registry
 * Definitive tools list metadata for PixoPDF.
 */

export const ToolRegistry = [
  // SIGN & EDIT PDF
  {
    slug: "sign-pdf",
    name: "Sign PDF",
    category: "Edit & Sign PDF",
    description: "Sign PDF online for free. Draw touch signatures or type electronic names.",
    primaryKeyword: "sign pdf online",
    secondaryKeywords: ["add signature to pdf", "sign pdf visually", "place signature on pdf"],
    pageUrl: "/sign-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`
  },
  {
    slug: "edit-pdf",
    name: "Edit PDF",
    category: "Edit & Sign PDF",
    description: "Add texts, visual replacements, and drawings. Processed strictly locally.",
    primaryKeyword: "edit pdf",
    secondaryKeywords: ["edit pdf online", "free pdf editor", "change pdf text"],
    pageUrl: "/edit-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path></svg>`
  },
  {
    slug: "add-text-to-pdf",
    name: "Add Text to PDF",
    category: "Edit & Sign PDF",
    description: "Type text boxes onto PDF documents and customize font parameters.",
    primaryKeyword: "add text to pdf",
    secondaryKeywords: ["type on pdf", "write on pdf online", "insert text into pdf"],
    pageUrl: "/add-text-to-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`
  },
  {
    slug: "add-image-to-pdf",
    name: "Add Image to PDF",
    category: "Edit & Sign PDF",
    description: "Overlay transparent PNG, JPG, and WebP images on PDF pages.",
    primaryKeyword: "add image to pdf",
    secondaryKeywords: ["insert photo into pdf", "overlay image on pdf", "put image on pdf"],
    pageUrl: "/add-image-to-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`
  },
  {
    slug: "annotate-pdf",
    name: "Annotate PDF",
    category: "Edit & Sign PDF",
    description: "Draw highlight rectangles, underlines, or strike through sections online.",
    primaryKeyword: "annotate pdf",
    secondaryKeywords: ["pdf annotation tool", "highlight pdf online", "markup pdf pages"],
    pageUrl: "/annotate-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`
  },
  {
    slug: "fill-pdf",
    name: "Fill PDF",
    category: "Edit & Sign PDF",
    description: "Visually add checkmarks, texts, dates, and initials on regular PDFs.",
    primaryKeyword: "fill pdf",
    secondaryKeywords: ["fill pdf online", "document filler", "type on pdf form"],
    pageUrl: "/fill-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>`
  },
  {
    slug: "pdf-form-filler",
    name: "PDF Form Filler",
    category: "Edit & Sign PDF",
    description: "Fill interactive forms and save input text fields, dropdowns, and checkboxes.",
    primaryKeyword: "pdf form filler",
    secondaryKeywords: ["fill pdf forms online", "acroform filler", "complete pdf form"],
    pageUrl: "/pdf-form-filler/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9 17h6"></path><path d="M9 12h6"></path><path d="M9 7h6"></path></svg>`
  },
  {
    slug: "add-page-numbers",
    name: "Add Page Numbers",
    category: "Edit & Sign PDF",
    description: "Add formatted page numbers to your PDF document online for free.",
    primaryKeyword: "add page numbers to pdf",
    secondaryKeywords: ["number pdf pages", "pdf page numbering", "insert page numbers"],
    pageUrl: "/add-page-numbers/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><circle cx="12" cy="10" r="2"></circle></svg>`
  },
  {
    slug: "add-watermark",
    name: "Add Watermark",
    category: "Edit & Sign PDF",
    description: "Add text watermarks to your PDF pages with custom options.",
    primaryKeyword: "add watermark to pdf",
    secondaryKeywords: ["watermark pdf online", "pdf watermark creator", "draft stamp pdf"],
    pageUrl: "/add-watermark/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
  },
  {
    slug: "redact-pdf",
    name: "Redact PDF",
    category: "Edit & Sign PDF",
    description: "Rasterized redaction removes underlying page content from rebuilt redacted pages.",
    primaryKeyword: "redact pdf online",
    secondaryKeywords: ["black out text in pdf", "pdf content masking", "remove text in pdf"],
    pageUrl: "/redact-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
  },

  // ORGANIZE PDF
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    category: "Organize PDF",
    description: "Combine multiple PDF files into one document online for free.",
    primaryKeyword: "merge pdf",
    secondaryKeywords: ["merge pdf online", "combine pdf", "pdf merger"],
    pageUrl: "/merge-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M9 15h6"></path><path d="M12 12v6"></path></svg>`
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    category: "Organize PDF",
    description: "Extract specific page ranges or split every page into separate documents.",
    primaryKeyword: "split pdf",
    secondaryKeywords: ["split pdf online", "pdf splitter", "extract pdf pages"],
    pageUrl: "/split-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="9" x2="12" y2="15"></line></svg>`
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    category: "Organize PDF",
    description: "Rotate individual pages or all pages clockwise or counter-clockwise visually.",
    primaryKeyword: "rotate pdf",
    secondaryKeywords: ["rotate pdf online", "rotate pdf pages", "pdf rotation"],
    pageUrl: "/rotate-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>`
  },
  {
    slug: "remove-pdf-pages",
    name: "Remove PDF Pages",
    category: "Organize PDF",
    description: "Delete unwanted pages from your PDF file online easily.",
    primaryKeyword: "remove pdf pages",
    secondaryKeywords: ["delete pdf pages", "remove pages from pdf", "delete pages online"],
    pageUrl: "/remove-pdf-pages/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>`
  },
  {
    slug: "extract-pdf-pages",
    name: "Extract PDF Pages",
    category: "Organize PDF",
    description: "Extract specific page ranges into a separate, standalone PDF document.",
    primaryKeyword: "extract pdf pages",
    secondaryKeywords: ["extract pages from pdf", "pdf page extractor", "get pages from pdf"],
    pageUrl: "/extract-pdf-pages/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"></path></svg>`
  },
  {
    slug: "organize-pdf",
    name: "Organize PDF",
    category: "Organize PDF",
    description: "Drag and drop to reorder, delete, or rotate pages in your PDF file.",
    primaryKeyword: "organize pdf",
    secondaryKeywords: ["organize pdf pages", "reorder pdf pages", "pdf page organizer"],
    pageUrl: "/organize-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`
  },

  // OPTIMIZE PDF
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    category: "Optimize PDF",
    description: "Optimize PDF document size by compressing embedded raster images.",
    primaryKeyword: "compress pdf",
    secondaryKeywords: ["compress pdf online", "reduce pdf size", "pdf compressor"],
    pageUrl: "/compress-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M12 12v6"></path><path d="m9 15 3-3 3 3"></path></svg>`
  },
  {
    slug: "crop-pdf",
    name: "Crop PDF",
    category: "Optimize PDF",
    description: "Crop PDF pages visually by adjusting bounding crop box parameters.",
    primaryKeyword: "crop pdf",
    secondaryKeywords: ["crop pdf online", "trim pdf pages", "cut pdf margins"],
    pageUrl: "/crop-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path></svg>`
  },
  {
    slug: "pdf-metadata",
    name: "PDF Metadata Viewer",
    category: "Optimize PDF",
    description: "Read PDF file metadata headers locally to inspect document properties.",
    primaryKeyword: "view pdf metadata",
    secondaryKeywords: ["pdf metadata viewer", "read pdf properties", "check pdf details"],
    pageUrl: "/pdf-metadata/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
  },
  {
    slug: "remove-pdf-metadata",
    name: "Remove PDF Metadata",
    category: "Optimize PDF",
    description: "Removes supported PDF metadata fields locally inside your browser.",
    primaryKeyword: "remove pdf metadata",
    secondaryKeywords: ["clear pdf metadata", "clean pdf properties", "sanitize pdf properties"],
    pageUrl: "/remove-pdf-metadata/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
  },

  // CONVERT TO PDF
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    category: "Convert to PDF",
    description: "Convert JPG, JPEG, and PNG images into a clean PDF document.",
    primaryKeyword: "jpg to pdf",
    secondaryKeywords: ["image to pdf", "png to pdf", "convert jpg to pdf"],
    pageUrl: "/jpg-to-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`
  },
  {
    slug: "png-to-pdf",
    name: "PNG to PDF",
    category: "Convert to PDF",
    description: "Convert PNG images to PDF online with layout and orientation options.",
    primaryKeyword: "png to pdf",
    secondaryKeywords: ["convert png to pdf", "png to pdf online", "image to pdf"],
    pageUrl: "/png-to-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`
  },
  {
    slug: "images-to-pdf",
    name: "Images to PDF",
    category: "Convert to PDF",
    description: "Convert multiple JPG, JPEG, and PNG images into a single PDF document online.",
    primaryKeyword: "images to pdf",
    secondaryKeywords: ["convert images to pdf", "photos to pdf", "pics to pdf"],
    pageUrl: "/images-to-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M21 15L16 10L5 21M9 10h.01"></path></svg>`
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    category: "Convert to PDF",
    description: "Convert JPG, PNG, and WebP files into PDF pages with visual margin configurations.",
    primaryKeyword: "image to pdf",
    secondaryKeywords: ["convert image to pdf", "webp to pdf", "images to pdf format"],
    pageUrl: "/image-to-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    category: "Convert to PDF",
    description: "Convert Microsoft Word DOCX files into clean PDF documents locally in your browser.",
    primaryKeyword: "word to pdf",
    secondaryKeywords: ["convert word to pdf", "docx to pdf", "convert docx to pdf"],
    pageUrl: "/word-to-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>`
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    category: "Convert to PDF",
    description: "Convert Microsoft Excel XLSX worksheets into clean PDF page grids in your browser.",
    primaryKeyword: "excel to pdf",
    secondaryKeywords: ["convert excel to pdf", "xlsx to pdf", "spreadsheet to pdf"],
    pageUrl: "/excel-to-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>`
  },
  {
    slug: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    category: "Convert to PDF",
    description: "Convert PPTX slide presentations into static PDF documents locally.",
    primaryKeyword: "powerpoint to pdf",
    secondaryKeywords: ["convert powerpoint to pdf", "pptx to pdf", "slides to pdf"],
    pageUrl: "/powerpoint-to-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M21 15L16 10L5 21M9 10h.01"></path></svg>`
  },
  {
    slug: "html-to-pdf",
    name: "HTML to PDF",
    category: "Convert to PDF",
    description: "Paste raw HTML layouts to render and export them to PDF securely inside your browser.",
    primaryKeyword: "html to pdf",
    secondaryKeywords: ["convert html to pdf", "raw html to pdf", "html layout exporter"],
    pageUrl: "/html-to-pdf/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`
  },

  // CONVERT FROM PDF
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    category: "Convert from PDF",
    description: "Convert pages of a PDF document into high-quality JPG images.",
    primaryKeyword: "pdf to jpg",
    secondaryKeywords: ["pdf to image", "pdf to png", "convert pdf to jpg"],
    pageUrl: "/pdf-to-jpg/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><rect x="8" y="12" width="8" height="6" rx="1"></rect></svg>`
  },
  {
    slug: "pdf-to-png",
    name: "PDF to PNG",
    category: "Convert from PDF",
    description: "Convert PDF pages into transparent PNG images online locally.",
    primaryKeyword: "pdf to png",
    secondaryKeywords: ["convert pdf to png", "pdf to png online", "pdf to image"],
    pageUrl: "/pdf-to-png/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`
  },
  {
    slug: "pdf-to-images",
    name: "PDF to Images",
    category: "Convert from PDF",
    description: "Extract PDF pages to JPG, PNG, and WebP formats packed into a ZIP download.",
    primaryKeyword: "pdf to images",
    secondaryKeywords: ["extract pdf to images", "convert pdf to webp", "pdf to zip images"],
    pageUrl: "/pdf-to-images/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    category: "Convert from PDF",
    description: "Convert PDF documents into editable Word DOCX files reconstructing structural layers.",
    primaryKeyword: "pdf to word",
    secondaryKeywords: ["convert pdf to word", "pdf to docx", "pdf to editable word"],
    pageUrl: "/pdf-to-word/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>`
  },
  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    category: "Convert from PDF",
    description: "Extract structured tables from PDF files into editable Excel XLSX spreadsheets.",
    primaryKeyword: "pdf to excel",
    secondaryKeywords: ["convert pdf to excel", "pdf to xlsx", "extract pdf table"],
    pageUrl: "/pdf-to-excel/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>`
  },
  {
    slug: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    category: "Convert from PDF",
    description: "Convert PDF slides into Microsoft PowerPoint PPTX slide presentations locally.",
    primaryKeyword: "pdf to powerpoint",
    secondaryKeywords: ["convert pdf to powerpoint", "pdf to pptx", "pdf to presentation"],
    pageUrl: "/pdf-to-powerpoint/",
    processingMode: "browser",
    active: true,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M21 15L16 10L5 21M9 10h.01"></path></svg>`
  }
];
