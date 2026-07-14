/**
 * PixoPDF Rotate PDF Tool Implementation
 * Natively rotates target pages by 90-degree steps using pdf-lib.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { MemoryManager } from '../core/memory-manager.js';
import { ErrorHandler } from '../core/error-handler.js';
import { Analytics } from '../analytics.js';

export const RotatePDF = {
  /**
   * Performs client-side PDF page rotation.
   * @param {File} pdfFile 
   * @param {Object} options Configuration parameters
   * @param {Object} options.rotations Map of pageIndex (0-based number) to rotation angle in degrees (0, 90, 180, 270)
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob>}
   */
  async process(pdfFile, options, onProgress) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }

    Analytics.trackEvent('processing_started', { tool: 'rotate-pdf' });
    onProgress('Loading PDF layout...', 20);

    try {
      const fileBuffer = await FileReaderUtil.readAsArrayBuffer(pdfFile);
      const doc = await window.PDFLib.PDFDocument.load(fileBuffer);
      const pages = doc.getPages();

      onProgress('Applying rotation parameters...', 60);
      for (const [idxStr, rotDegrees] of Object.entries(options.rotations)) {
        const idx = parseInt(idxStr, 10);
        if (idx >= 0 && idx < pages.length) {
          const page = pages[idx];
          
          // Get current page rotation
          const currentRotation = page.getRotation().angle;
          // Calculate new target rotation (clockwise step)
          const finalRotation = (currentRotation + rotDegrees) % 360;
          
          // Apply via degrees object
          page.setRotation(window.PDFLib.degrees(finalRotation));
        }
      }

      onProgress('Writing rotated output streams...', 85);
      const outputBytes = await doc.save();
      const outputBlob = new Blob([outputBytes], { type: 'application/pdf' });

      MemoryManager.wipeArrayBufferRefs(fileBuffer);
      MemoryManager.wipeArrayBufferRefs(outputBytes);

      onProgress('Done!', 100);
      Analytics.trackEvent('processing_completed', { tool: 'rotate-pdf', size: outputBlob.size });
      return outputBlob;
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: 'rotate-pdf', error: err.message });
      throw new Error(ErrorHandler.getFriendlyMessage(err));
    }
  }
};
