/**
 * ZeroPDF JPG to PDF Tool Implementation
 * Converts multiple JPG/PNG images into a single PDF document locally.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { MemoryManager } from '../core/memory-manager.js';
import { ErrorHandler } from '../core/error-handler.js';
import { Analytics } from '../analytics.js';

export const JpgToPDF = {
  /**
   * Converts images to PDF.
   * @param {File[]} imageFiles 
   * @param {Object} options Options object
   * @param {string} options.pageSize 'auto' | 'a4' | 'letter'
   * @param {string} options.orientation 'auto' | 'portrait' | 'landscape'
   * @param {string} options.margin 'none' | 'small' | 'medium' | 'large'
   * @param {string} options.imageFit 'contain' | 'cover'
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob>}
   */
  async process(imageFiles, options, onProgress) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }

    Analytics.trackEvent('processing_started', { tool: 'jpg-to-pdf', count: imageFiles.length });
    onProgress('Creating PDF template...', 5);

    try {
      const pdfDoc = await window.PDFLib.PDFDocument.create();
      const totalImages = imageFiles.length;

      // Layout sizing configurations
      const PAGE_SIZES = {
        a4: { width: 595.28, height: 841.89 },
        letter: { width: 612, height: 792 }
      };

      const MARGINS = {
        none: 0,
        small: 18,
        medium: 36,
        large: 54
      };

      const marginSize = MARGINS[options.margin || 'small'];

      for (let i = 0; i < totalImages; i++) {
        const file = imageFiles[i];
        const stepPercent = Math.round(5 + (i / totalImages) * 85);
        onProgress(`Processing image ${i + 1} of ${totalImages}: ${file.name}...`, stepPercent);

        // Read and draw image
        const imgBuffer = await FileReaderUtil.readAsArrayBuffer(file);
        let pdfImg;
        if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
          pdfImg = await pdfDoc.embedPng(imgBuffer);
        } else {
          pdfImg = await pdfDoc.embedJpg(imgBuffer);
        }

        // Get layout dimensions
        const { width: imgW, height: imgH } = pdfImg.scale(1.0);

        let finalPageW, finalPageH;
        if (options.pageSize === 'auto') {
          // Adjust page size directly to image size + margins
          finalPageW = imgW + marginSize * 2;
          finalPageH = imgH + marginSize * 2;
        } else {
          const dims = PAGE_SIZES[options.pageSize || 'a4'];
          
          // Detect orientation
          let isLandscape = false;
          if (options.orientation === 'landscape') {
            isLandscape = true;
          } else if (options.orientation === 'auto') {
            isLandscape = imgW > imgH;
          }

          finalPageW = isLandscape ? dims.height : dims.width;
          finalPageH = isLandscape ? dims.width : dims.height;
        }

        const page = pdfDoc.addPage([finalPageW, finalPageH]);

        // Compute printable area sizes
        const printableW = finalPageW - marginSize * 2;
        const printableH = finalPageH - marginSize * 2;

        let drawW, drawH;
        const scaleW = printableW / imgW;
        const scaleH = printableH / imgH;

        if (options.imageFit === 'cover') {
          const scale = Math.max(scaleW, scaleH);
          drawW = imgW * scale;
          drawH = imgH * scale;
        } else { // default 'contain'
          const scale = Math.min(scaleW, scaleH);
          drawW = imgW * scale;
          drawH = imgH * scale;
        }

        // Center within printable boundary
        const drawX = marginSize + (printableW - drawW) / 2;
        const drawY = marginSize + (printableH - drawH) / 2;

        page.drawImage(pdfImg, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH
        });

        // Cleanup intermediate ArrayBuffer resources
        MemoryManager.wipeArrayBufferRefs(imgBuffer);
      }

      onProgress('Writing PDF output bytes...', 95);
      const pdfBytes = await pdfDoc.save();
      const outputBlob = new Blob([pdfBytes], { type: 'application/pdf' });

      MemoryManager.wipeArrayBufferRefs(pdfBytes);
      onProgress('Done!', 100);

      Analytics.trackEvent('processing_completed', { tool: 'jpg-to-pdf', size: outputBlob.size });
      return outputBlob;
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: 'jpg-to-pdf', error: err.message });
      throw new Error(ErrorHandler.getFriendlyMessage(err));
    }
  }
};
