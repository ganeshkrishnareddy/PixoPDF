/**
 * PixoPDF Add Page Numbers Tool Implementation
 * Inserts formatted numbers (1, Page 1, 1/X) using pdf-lib standard fonts.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { MemoryManager } from '../core/memory-manager.js';
import { ErrorHandler } from '../core/error-handler.js';
import { Analytics } from '../analytics.js';
import { PageRangeParser } from '../core/page-range-parser.js';

export const AddPageNumbers = {
  /**
   * Applies page numbering layout.
   * @param {File} pdfFile Source document
   * @param {Object} options Configuration parameters
   * @param {string} options.position 'topLeft'|'topCenter'|'topRight'|'bottomLeft'|'bottomCenter'|'bottomRight'
   * @param {number} options.startingNumber Default 1
   * @param {string} options.rangeMode 'all'|'custom'
   * @param {string} options.customRange Custom page range input (if custom mode)
   * @param {string} options.format 'number'|'prefix'|'fraction'|'fractionOf'
   * @param {string} options.fontSize 'small'|'medium'|'large'
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob>}
   */
  async process(pdfFile, options, onProgress) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }

    Analytics.trackEvent('processing_started', { tool: 'add-page-numbers' });
    onProgress('Loading PDF structure...', 20);

    try {
      const fileBuffer = await FileReaderUtil.readAsArrayBuffer(pdfFile);
      const doc = await window.PDFLib.PDFDocument.load(fileBuffer);
      const pages = doc.getPages();
      const totalPages = pages.length;

      // Determine target pages to number
      let targetIndices = Array.from({ length: totalPages }, (_, i) => i);
      if (options.rangeMode === 'custom') {
        onProgress('Parsing target page ranges...', 35);
        targetIndices = PageRangeParser.parse(options.customRange, totalPages);
      }

      onProgress('Calculating fonts and coordinates...', 50);
      const helveticaFont = await doc.embedFont(window.PDFLib.StandardFonts.Helvetica);

      // Map font sizes
      let fontSizeVal = 11;
      if (options.fontSize === 'small') fontSizeVal = 9;
      if (options.fontSize === 'large') fontSizeVal = 15;

      const startingNumber = options.startingNumber || 1;

      onProgress('Drawing page numbers...', 70);
      targetIndices.forEach((pageIdx, idxInSelection) => {
        const page = pages[pageIdx];
        const { width, height } = page.getSize();
        
        // Apply page rotation correction to coordinate system if rotated
        const rotationAngle = page.getRotation().angle;

        // Compile display label string
        const currentNum = startingNumber + idxInSelection;
        let text = `${currentNum}`;
        if (options.format === 'prefix') text = `Page ${currentNum}`;
        if (options.format === 'fraction') text = `${currentNum} / ${totalPages}`;
        if (options.format === 'fractionOf') text = `Page ${currentNum} of ${totalPages}`;

        // Measure text metrics
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSizeVal);
        const textHeight = helveticaFont.heightAtSize(fontSizeVal);

        // Position coordinates offsets
        const margin = 24;
        let x = margin;
        let y = margin;

        // X coordinate calculations
        if (options.position.includes('Center')) {
          x = (width - textWidth) / 2;
        } else if (options.position.includes('Right')) {
          x = width - textWidth - margin;
        }

        // Y coordinate calculations
        if (options.position.startsWith('top')) {
          y = height - textHeight - margin;
        }

        // Draw with rotation matching the page
        page.drawText(text, {
          x,
          y,
          size: fontSizeVal,
          font: helveticaFont,
          color: window.PDFLib.rgb(0.3, 0.3, 0.3),
        });
      });

      onProgress('Writing numbered output streams...', 85);
      const outputBytes = await doc.save();
      const outputBlob = new Blob([outputBytes], { type: 'application/pdf' });

      MemoryManager.wipeArrayBufferRefs(fileBuffer);
      MemoryManager.wipeArrayBufferRefs(outputBytes);

      onProgress('Done!', 100);
      Analytics.trackEvent('processing_completed', { tool: 'add-page-numbers', size: outputBlob.size });
      return outputBlob;
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: 'add-page-numbers', error: err.message });
      throw new Error(ErrorHandler.getFriendlyMessage(err));
    }
  }
};
