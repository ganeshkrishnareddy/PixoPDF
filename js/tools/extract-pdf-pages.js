/**
 * PixoPDF Extract PDF Pages Tool Implementation
 * Extracts selected page ranges into a separate PDF.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { MemoryManager } from '../core/memory-manager.js';
import { ErrorHandler } from '../core/error-handler.js';
import { Analytics } from '../analytics.js';
import { PageRangeParser } from '../core/page-range-parser.js';

export const ExtractPDFPages = {
  /**
   * Extracts designated range of page indexes.
   * @param {File} pdfFile Source PDF
   * @param {Object} options Configuration parameters
   * @param {string} options.rangeStr Numeric selection range input
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob>}
   */
  async process(pdfFile, options, onProgress) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }

    Analytics.trackEvent('processing_started', { tool: 'extract-pdf-pages' });
    onProgress('Loading PDF layout...', 20);

    try {
      const fileBuffer = await FileReaderUtil.readAsArrayBuffer(pdfFile);
      const srcDoc = await window.PDFLib.PDFDocument.load(fileBuffer);
      const totalPages = srcDoc.getPageCount();

      onProgress('Parsing target range...', 40);
      const targetPages = PageRangeParser.parse(options.rangeStr, totalPages);

      if (targetPages.length === 0) {
        throw new Error("No valid page range specified.");
      }

      onProgress(`Synthesizing output with ${targetPages.length} pages...`, 70);
      const outputDoc = await window.PDFLib.PDFDocument.create();
      const copiedPages = await outputDoc.copyPages(srcDoc, targetPages);
      copiedPages.forEach(page => outputDoc.addPage(page));

      onProgress('Writing structural streams...', 85);
      const outputBytes = await outputDoc.save();
      const outputBlob = new Blob([outputBytes], { type: 'application/pdf' });

      MemoryManager.wipeArrayBufferRefs(fileBuffer);
      MemoryManager.wipeArrayBufferRefs(outputBytes);

      onProgress('Done!', 100);
      Analytics.trackEvent('processing_completed', { tool: 'extract-pdf-pages', size: outputBlob.size });
      return outputBlob;
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: 'extract-pdf-pages', error: err.message });
      throw new Error(ErrorHandler.getFriendlyMessage(err));
    }
  }
};
