/**
 * PixoPDF Remove PDF Pages Tool Implementation
 * Client-side removal of selected page indices using pdf-lib.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { MemoryManager } from '../core/memory-manager.js';
import { ErrorHandler } from '../core/error-handler.js';
import { Analytics } from '../analytics.js';

export const RemovePDFPages = {
  /**
   * Removes designated page indices from the source PDF document.
   * @param {File} pdfFile Source PDF
   * @param {Object} options Configuration parameters
   * @param {number[]} options.pageIndicesToRemove 0-based page indices marked for deletion
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob>}
   */
  async process(pdfFile, options, onProgress) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }

    const toRemove = options.pageIndicesToRemove;
    if (!toRemove || toRemove.length === 0) {
      throw new Error("No pages selected for removal.");
    }

    Analytics.trackEvent('processing_started', { tool: 'remove-pdf-pages', count: toRemove.length });
    onProgress('Loading PDF layout...', 20);

    try {
      const fileBuffer = await FileReaderUtil.readAsArrayBuffer(pdfFile);
      const srcDoc = await window.PDFLib.PDFDocument.load(fileBuffer);
      const totalPages = srcDoc.getPageCount();

      if (toRemove.length >= totalPages) {
        throw new Error("A PDF must contain at least one page.");
      }

      onProgress('Synthesizing output document...', 50);
      const outputDoc = await window.PDFLib.PDFDocument.create();

      // Compile remaining pages list
      const indicesToKeep = [];
      for (let i = 0; i < totalPages; i++) {
        if (!toRemove.includes(i)) {
          indicesToKeep.push(i);
        }
      }

      onProgress('Copying kept page frames...', 70);
      const copiedPages = await outputDoc.copyPages(srcDoc, indicesToKeep);
      copiedPages.forEach(page => outputDoc.addPage(page));

      onProgress('Writing structural streams...', 85);
      const outputBytes = await outputDoc.save();
      const outputBlob = new Blob([outputBytes], { type: 'application/pdf' });

      MemoryManager.wipeArrayBufferRefs(fileBuffer);
      MemoryManager.wipeArrayBufferRefs(outputBytes);

      onProgress('Done!', 100);
      Analytics.trackEvent('processing_completed', { tool: 'remove-pdf-pages', size: outputBlob.size });
      return outputBlob;
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: 'remove-pdf-pages', error: err.message });
      throw new Error(ErrorHandler.getFriendlyMessage(err));
    }
  }
};
