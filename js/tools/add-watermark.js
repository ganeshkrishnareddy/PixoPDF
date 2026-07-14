/**
 * PixoPDF Add Watermark Tool Implementation
 * Embeds custom text watermarks using pdf-lib.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { MemoryManager } from '../core/memory-manager.js';
import { ErrorHandler } from '../core/error-handler.js';
import { Analytics } from '../analytics.js';
import { PageRangeParser } from '../core/page-range-parser.js';

export const AddWatermark = {
  /**
   * Embeds text overlay on selected pages.
   * @param {File} pdfFile Source document
   * @param {Object} options Configuration parameters
   * @param {string} options.text Watermark text
   * @param {number} options.fontSize Font size (e.g. 36)
   * @param {number} options.opacity Decimal opacity (0.0 to 1.0)
   * @param {number} options.rotation Rotation angle in degrees (e.g. 45)
   * @param {string} options.position 'center'|'top'|'bottom'
   * @param {string} options.rangeMode 'all'|'custom'
   * @param {string} options.customRange Custom page range string
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob>}
   */
  async process(pdfFile, options, onProgress) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }

    const { text, opacity, rotation, position } = options;
    if (!text || !text.trim()) {
      throw new Error("Watermark text cannot be empty.");
    }

    if (text.length > 100) {
      throw new Error("Watermark text exceeds maximum length of 100 characters.");
    }

    Analytics.trackEvent('processing_started', { tool: 'add-watermark' });
    onProgress('Loading PDF structure...', 20);

    try {
      const fileBuffer = await FileReaderUtil.readAsArrayBuffer(pdfFile);
      const doc = await window.PDFLib.PDFDocument.load(fileBuffer);
      const pages = doc.getPages();
      const totalPages = pages.length;

      let targetIndices = Array.from({ length: totalPages }, (_, i) => i);
      if (options.rangeMode === 'custom') {
        onProgress('Parsing target range...', 40);
        targetIndices = PageRangeParser.parse(options.customRange, totalPages);
      }

      onProgress('Calculating visual matrix...', 50);
      const helveticaFont = await doc.embedFont(window.PDFLib.StandardFonts.HelveticaBold);
      const fontSize = options.fontSize || 40;

      onProgress('Embedding text watermarks...', 70);
      targetIndices.forEach(pageIdx => {
        const page = pages[pageIdx];
        const { width, height } = page.getSize();

        // Calculate text metrics
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
        const textHeight = helveticaFont.heightAtSize(fontSize);

        // Coordinates calculations
        let x = (width - textWidth) / 2;
        let y = (height - textHeight) / 2;

        if (position === 'top') {
          y = height - textHeight - 48;
        } else if (position === 'bottom') {
          y = 48;
        }

        // Apply page rotation correction if page has native rotation angle
        const pageRotation = page.getRotation().angle;

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font: helveticaFont,
          color: window.PDFLib.rgb(0.5, 0.5, 0.5),
          opacity: opacity !== undefined ? opacity : 0.3,
          rotate: window.PDFLib.degrees(rotation || 0),
        });
      });

      onProgress('Saving watermarked PDF...', 85);
      const outputBytes = await doc.save();
      const outputBlob = new Blob([outputBytes], { type: 'application/pdf' });

      MemoryManager.wipeArrayBufferRefs(fileBuffer);
      MemoryManager.wipeArrayBufferRefs(outputBytes);

      onProgress('Done!', 100);
      Analytics.trackEvent('processing_completed', { tool: 'add-watermark', size: outputBlob.size });
      return outputBlob;
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: 'add-watermark', error: err.message });
      throw new Error(ErrorHandler.getFriendlyMessage(err));
    }
  }
};
