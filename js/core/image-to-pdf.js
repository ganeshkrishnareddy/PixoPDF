/**
 * PixoPDF Core Image to PDF Conversion Utility
 * Processes multiple image files (JPG, PNG) into a single PDF document locally.
 */

import { FileReaderUtil } from './file-reader.js';
import { MemoryManager } from './memory-manager.js';
import { ErrorHandler } from './error-handler.js';
import { Analytics } from '../analytics.js';

export const ImageToPDFUtil = {
  /**
   * Main image compilation process.
   * @param {File[]} imageFiles Array of image files
   * @param {Object} options Configuration parameters
   * @param {string} options.pageSize 'auto' | 'a4' | 'letter'
   * @param {string} options.orientation 'auto' | 'portrait' | 'landscape'
   * @param {string} options.margin 'none' | 'small' | 'medium' | 'large'
   * @param {string} options.imageFit 'contain' | 'cover'
   * @param {string} options.analyticsToolName Tool name value for logging
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob>}
   */
  async convert(imageFiles, options, onProgress) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }

    const toolName = options.analyticsToolName || 'image-to-pdf';
    Analytics.trackEvent('processing_started', { tool: toolName, count: imageFiles.length });
    onProgress('Creating PDF template...', 5);

    try {
      const pdfDoc = await window.PDFLib.PDFDocument.create();
      const totalImages = imageFiles.length;

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

        const imgBuffer = await FileReaderUtil.readAsArrayBuffer(file);
        let pdfImg;
        // Embed based on file type. Embedded png will automatically preserve transparency details where supported.
        if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
          pdfImg = await pdfDoc.embedPng(imgBuffer);
        } else {
          pdfImg = await pdfDoc.embedJpg(imgBuffer);
        }

        const { width: imgW, height: imgH } = pdfImg.scale(1.0);

        let finalPageW, finalPageH;
        if (options.pageSize === 'auto') {
          finalPageW = imgW + marginSize * 2;
          finalPageH = imgH + marginSize * 2;
        } else {
          const dims = PAGE_SIZES[options.pageSize || 'a4'];
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

        const printableW = finalPageW - marginSize * 2;
        const printableH = finalPageH - marginSize * 2;

        let drawW, drawH;
        const scaleW = printableW / imgW;
        const scaleH = printableH / imgH;

        if (options.imageFit === 'cover') {
          const scale = Math.max(scaleW, scaleH);
          drawW = imgW * scale;
          drawH = imgH * scale;
        } else {
          const scale = Math.min(scaleW, scaleH);
          drawW = imgW * scale;
          drawH = imgH * scale;
        }

        const x = marginSize + (printableW - drawW) / 2;
        const y = marginSize + (printableH - drawH) / 2;

        page.drawImage(pdfImg, {
          x,
          y,
          width: drawW,
          height: drawH
        });

        MemoryManager.wipeArrayBufferRefs(imgBuffer);
      }

      onProgress('Synthesizing output document...', 90);
      const outputBytes = await pdfDoc.save();
      const outputBlob = new Blob([outputBytes], { type: 'application/pdf' });

      MemoryManager.wipeArrayBufferRefs(outputBytes);

      onProgress('Done!', 100);
      Analytics.trackEvent('processing_completed', { tool: toolName, size: outputBlob.size });
      return outputBlob;
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: toolName, error: err.message });
      throw new Error(ErrorHandler.getFriendlyMessage(err));
    }
  }
};
