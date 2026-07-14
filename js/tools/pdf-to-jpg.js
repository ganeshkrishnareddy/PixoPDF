/**
 * ZeroPDF PDF to JPG Tool Implementation
 * Extracts and renders PDF pages locally to downloadable JPEG/PNG assets using PDF.js.
 */

import { PdfLoader } from '../core/pdf-loader.js';
import { MemoryManager } from '../core/memory-manager.js';
import { ErrorHandler } from '../core/error-handler.js';
import { Analytics } from '../analytics.js';

export const PdfToJPG = {
  // Max resolution bounds to avoid allocation crashes
  MAX_CANVAS_DIMENSION: 4096,

  /**
   * Renders PDF pages to canvases and packages them.
   * @param {File} pdfFile 
   * @param {Object} options Options object
   * @param {string} options.format 'jpg' | 'png'
   * @param {string} options.quality 'high' | 'recommended' | 'small'
   * @param {string} options.resolution 'standard' | 'high'
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<{name: string, blob: Blob}[]>}
   */
  async process(pdfFile, options, onProgress) {
    Analytics.trackEvent('processing_started', { tool: 'pdf-to-jpg', format: options.format });
    onProgress('Parsing PDF structures...', 10);

    try {
      const pdf = await PdfLoader.loadPdf(pdfFile);
      const totalPages = pdf.numPages;
      const images = [];

      // Determine scale resolution multiplier
      let scaleMultiplier = options.resolution === 'high' ? 2.0 : 1.5;

      // Determine jpeg quality
      const qualityMap = {
        high: 0.95,
        recommended: 0.80,
        small: 0.55
      };
      const jpegQuality = qualityMap[options.quality || 'recommended'];
      const imageMime = options.format === 'png' ? 'image/png' : 'image/jpeg';
      const fileExt = options.format === 'png' ? 'png' : 'jpg';

      for (let i = 1; i <= totalPages; i++) {
        const stepPercent = Math.round(10 + (i / totalPages) * 80);
        onProgress(`Rendering page ${i} of ${totalPages}...`, stepPercent);

        const page = await pdf.getPage(i);
        let viewport = page.getViewport({ scale: scaleMultiplier });

        // Guard safety against dimension limits
        if (viewport.width > this.MAX_CANVAS_DIMENSION || viewport.height > this.MAX_CANVAS_DIMENSION) {
          const maxDim = Math.max(viewport.width, viewport.height);
          const ratio = this.MAX_CANVAS_DIMENSION / maxDim;
          viewport = page.getViewport({ scale: scaleMultiplier * ratio });
        }

        // Initialize canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };

        // Render PDF page off-screen to canvas
        await page.render(renderContext).promise;

        // Convert canvas context to blob
        const blob = await new Promise((resolve) => {
          canvas.toBlob((b) => resolve(b), imageMime, jpegQuality);
        });

        const baseName = pdfFile.name.substring(0, pdfFile.name.lastIndexOf('.')) || pdfFile.name;
        const zeroPaddedNum = String(i).padStart(3, '0');
        
        images.push({
          name: `${baseName}-page-${zeroPaddedNum}.${fileExt}`,
          blob: blob
        });

        // Immediately deallocate canvas frame
        MemoryManager.deallocateCanvas(canvas);
      }

      onProgress('Packaging rendered images...', 95);
      Analytics.trackEvent('processing_completed', { tool: 'pdf-to-jpg', count: images.length });
      return images;
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: 'pdf-to-jpg', error: err.message });
      throw new Error(ErrorHandler.getFriendlyMessage(err));
    }
  }
};
