/**
 * PixoPDF Organize PDF Tool Implementation
 * Direct client-side visual reordering, deletion, and rotation using pdf-lib.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { MemoryManager } from '../core/memory-manager.js';
import { ErrorHandler } from '../core/error-handler.js';
import { Analytics } from '../analytics.js';

export const OrganizePDF = {
  /**
   * Applies page order, deletion state, and rotation modifications.
   * @param {File} pdfFile Source document
   * @param {Object} options Configuration parameters
   * @param {Object[]} options.pagesState Array of objects representing target page state: { originalIndex, rotation, deleted }
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob>}
   */
  async process(pdfFile, options, onProgress) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }

    const { pagesState } = options;
    if (!pagesState || pagesState.length === 0) {
      throw new Error("No page configuration provided.");
    }

    // Filter kept pages
    const keptPagesState = pagesState.filter(p => !p.deleted);
    if (keptPagesState.length === 0) {
      throw new Error("A PDF must contain at least one page.");
    }

    Analytics.trackEvent('processing_started', { tool: 'organize-pdf', count: keptPagesState.length });
    onProgress('Loading PDF source...', 20);

    try {
      const fileBuffer = await FileReaderUtil.readAsArrayBuffer(pdfFile);
      const srcDoc = await window.PDFLib.PDFDocument.load(fileBuffer);
      const outputDoc = await window.PDFLib.PDFDocument.create();

      onProgress('Reordering and copying pages...', 50);
      // Map keep index list
      const originalIndices = keptPagesState.map(p => p.originalIndex);
      const copiedPages = await outputDoc.copyPages(srcDoc, originalIndices);

      onProgress('Applying rotation parameters...', 75);
      copiedPages.forEach((copiedPage, i) => {
        const state = keptPagesState[i];
        // Apply rotation degrees
        if (state.rotation !== 0) {
          const currentRotation = copiedPage.getRotation().angle;
          const finalRotation = (currentRotation + state.rotation) % 360;
          copiedPage.setRotation(window.PDFLib.degrees(finalRotation));
        }
        outputDoc.addPage(copiedPage);
      });

      onProgress('Writing structural streams...', 85);
      const outputBytes = await outputDoc.save();
      const outputBlob = new Blob([outputBytes], { type: 'application/pdf' });

      MemoryManager.wipeArrayBufferRefs(fileBuffer);
      MemoryManager.wipeArrayBufferRefs(outputBytes);

      onProgress('Done!', 100);
      Analytics.trackEvent('processing_completed', { tool: 'organize-pdf', size: outputBlob.size });
      return outputBlob;
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: 'organize-pdf', error: err.message });
      throw new Error(ErrorHandler.getFriendlyMessage(err));
    }
  }
};
