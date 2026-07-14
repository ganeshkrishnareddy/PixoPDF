/**
 * ZeroPDF PDF Loader
 * Configures locally hosted PDFJS Worker path and returns helper for parsing PDFs.
 */

// Initialize local PDFJS options
if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/vendor/pdfjs/pdf.worker.min.js';
}

export const PdfLoader = {
  /**
   * Loads a PDF file and returns its document object.
   * @param {File|Blob|ArrayBuffer} fileOrBuffer 
   * @returns {Promise<any>}
   */
  async loadPdf(fileOrBuffer) {
    if (!window.pdfjsLib) {
      throw new Error("PDF.js library is not loaded.");
    }

    let source;
    if (fileOrBuffer instanceof ArrayBuffer) {
      source = { data: new Uint8Array(fileOrBuffer) };
    } else if (fileOrBuffer instanceof File || fileOrBuffer instanceof Blob) {
      const buffer = await fileOrBuffer.arrayBuffer();
      source = { data: new Uint8Array(buffer) };
    } else {
      throw new Error("Invalid file source type.");
    }

    return window.pdfjsLib.getDocument(source).promise;
  }
};
