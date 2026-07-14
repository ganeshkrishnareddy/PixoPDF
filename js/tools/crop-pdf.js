/**
 * PixoPDF Crop PDF Tool Implementation
 * Updates PDF page boundaries (CropBox / MediaBox) using pdf-lib.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { MemoryManager } from '../core/memory-manager.js';
import { ErrorHandler } from '../core/error-handler.js';
import { Analytics } from '../analytics.js';

export const CropPDF = {
  /**
   * Crops PDF document pages using relative box coordinate values.
   * Coordinates are percentages of page size (0.0 to 1.0) representing:
   * options.crop: { left, top, right, bottom }
   * @param {File} pdfFile Source document
   * @param {Object} options Configuration parameters
   * @param {Object} options.crop Rectangle percentages { left, top, right, bottom }
   * @param {boolean} options.applyToAll Apply crop to all pages or just current index
   * @param {number} options.currentPageIndex 0-based page index to crop if applyToAll is false
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob>}
   */
  async process(pdfFile, options, onProgress) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }

    const { crop, applyToAll, currentPageIndex } = options;
    if (!crop) {
      throw new Error("No crop parameters provided.");
    }

    Analytics.trackEvent('processing_started', { tool: 'crop-pdf', all: applyToAll });
    onProgress('Loading PDF structure...', 20);

    try {
      const fileBuffer = await FileReaderUtil.readAsArrayBuffer(pdfFile);
      const doc = await window.PDFLib.PDFDocument.load(fileBuffer);
      const pages = doc.getPages();

      onProgress('Calculating crop coordinate maps...', 50);
      const indicesToCrop = applyToAll 
        ? Array.from({ length: pages.length }, (_, i) => i)
        : [currentPageIndex];

      indicesToCrop.forEach(idx => {
        if (idx >= 0 && idx < pages.length) {
          const page = pages[idx];
          
          // Get current dimensions from MediaBox or CropBox
          const width = page.getWidth();
          const height = page.getHeight();

          // Calculate absolute boundary numbers
          const cropLeft = width * crop.left;
          const cropRight = width * crop.right;
          const cropBottom = height * crop.bottom;
          const cropTop = height * crop.top;

          const newWidth = cropRight - cropLeft;
          const newHeight = cropTop - cropBottom;

          if (newWidth <= 10 || newHeight <= 10) {
            throw new Error("Crop selection is too small.");
          }

          // Apply to CropBox to preserve data while hiding cropped regions
          page.setCropBox(cropLeft, cropBottom, newWidth, newHeight);
        }
      });

      onProgress('Saving cropped document structure...', 85);
      const outputBytes = await doc.save();
      const outputBlob = new Blob([outputBytes], { type: 'application/pdf' });

      MemoryManager.wipeArrayBufferRefs(fileBuffer);
      MemoryManager.wipeArrayBufferRefs(outputBytes);

      onProgress('Done!', 100);
      Analytics.trackEvent('processing_completed', { tool: 'crop-pdf', size: outputBlob.size });
      return outputBlob;
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: 'crop-pdf', error: err.message });
      throw new Error(ErrorHandler.getFriendlyMessage(err));
    }
  }
};
