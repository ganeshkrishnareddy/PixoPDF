/**
 * PixoPDF PDF Metadata Reader Implementation
 * Natively extracts PDF metadata locally in browser sandbox.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { Analytics } from '../analytics.js';

export const PDFMetadata = {
  /**
   * Reads metadata headers from file.
   * @param {File} pdfFile Source document
   * @returns {Promise<Object>} Object containing key-value metadata fields
   */
  async read(pdfFile) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }

    Analytics.trackEvent('processing_started', { tool: 'pdf-metadata' });

    try {
      const fileBuffer = await FileReaderUtil.readAsArrayBuffer(pdfFile);
      const doc = await window.PDFLib.PDFDocument.load(fileBuffer, { updateMetadata: false });

      // Detect PDF version from first bytes
      let pdfVersion = 'Not available';
      try {
        const view = new DataView(fileBuffer);
        const chars = [];
        // Read first 8 bytes for version headers like '%PDF-1.7'
        for (let i = 0; i < 8; i++) {
          chars.push(String.fromCharCode(view.getUint8(i)));
        }
        const header = chars.join('');
        if (header.startsWith('%PDF-')) {
          pdfVersion = header.substring(5, 8);
        }
      } catch (e) {
        console.warn("Could not determine PDF version header:", e);
      }

      // Read standard doc details using pdf-lib getters
      const result = {
        title: doc.getTitle() || 'Not available',
        author: doc.getAuthor() || 'Not available',
        subject: doc.getSubject() || 'Not available',
        keywords: doc.getKeywords() || 'Not available',
        creator: doc.getCreator() || 'Not available',
        producer: doc.getProducer() || 'Not available',
        creationDate: doc.getCreationDate() ? doc.getCreationDate().toISOString() : 'Not available',
        modificationDate: doc.getModificationDate() ? doc.getModificationDate().toISOString() : 'Not available',
        version: pdfVersion,
        pageCount: doc.getPageCount(),
        fileSize: `${(pdfFile.size / (1024 * 1024)).toFixed(3)} MB (${pdfFile.size} bytes)`
      };

      Analytics.trackEvent('processing_completed', { tool: 'pdf-metadata' });
      return result;
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: 'pdf-metadata', error: err.message });
      throw err;
    }
  }
};
