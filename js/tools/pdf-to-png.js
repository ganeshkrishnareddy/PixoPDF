/**
 * PixoPDF PDF to PNG Converter Implementation
 * Natively renders PDF pages to PNG blobs in client browser memory.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { MemoryManager } from '../core/memory-manager.js';
import { ErrorHandler } from '../core/error-handler.js';
import { Analytics } from '../analytics.js';

export const PdfToPNG = {
  /**
   * Renders PDF pages to PNG image collection.
   * @param {File} pdfFile Source document
   * @param {Object} options Configuration parameters
   * @param {string} options.resolution 'standard' | 'high'
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<{name: string, blob: Blob}[]>}
   */
  async process(pdfFile, options, onProgress) {
    if (!window.pdfjsLib) {
      throw new Error("PDF.js library is not loaded.");
    }

    Analytics.trackEvent('processing_started', { tool: 'pdf-to-png', resolution: options.resolution });
    onProgress('Loading PDF layout details...', 10);

    try {
      const fileBuffer = await FileReaderUtil.readAsArrayBuffer(pdfFile);
      
      // Load PDF via worker
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/vendor/pdfjs/pdf.worker.min.js';
      const pdfDoc = await window.pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) }).promise;
      const totalPages = pdfDoc.numPages;

      // Select target render scale based on resolution option
      let baseScale = options.resolution === 'high' ? 2.5 : 1.5;
      const outputImages = [];

      for (let i = 0; i < totalPages; i++) {
        const stepPercent = Math.round(10 + (i / totalPages) * 80);
        onProgress(`Rendering page ${i + 1} of ${totalPages}...`, stepPercent);

        const page = await pdfDoc.getPage(i + 1);
        let viewport = page.getViewport({ scale: baseScale });

        // Safety dimension boundary checks (limit width/height to max 3000px to prevent browser canvas crash)
        const maxLimit = 3000;
        if (viewport.width > maxLimit || viewport.height > maxLimit) {
          const ratio = Math.min(maxLimit / viewport.width, maxLimit / viewport.height);
          viewport = page.getViewport({ scale: baseScale * ratio });
          // Notify interface via warning later
        }

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        // Draw PDF content on canvas
        await page.render({
          canvasContext: ctx,
          viewport: viewport
        }).promise;

        // Convert canvas context to binary PNG blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        
        // Zero memory resources
        canvas.width = 0;
        canvas.height = 0;

        const paddedIndex = String(i + 1).padStart(3, '0');
        outputImages.push({
          name: `page-${paddedIndex}.png`,
          blob: blob
        });
      }

      onProgress('Cleaning document pointers...', 95);
      pdfDoc.destroy();
      MemoryManager.wipeArrayBufferRefs(fileBuffer);

      onProgress('Done!', 100);
      Analytics.trackEvent('processing_completed', { tool: 'pdf-to-png', count: outputImages.length });
      return outputImages;
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: 'pdf-to-png', error: err.message });
      throw new Error(ErrorHandler.getFriendlyMessage(err));
    }
  }
};
