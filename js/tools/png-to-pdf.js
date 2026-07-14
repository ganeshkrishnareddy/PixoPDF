/**
 * PixoPDF PNG to PDF Tool Implementation
 * Converts multiple PNG images into a single PDF document locally.
 */

import { ImageToPDFUtil } from '../core/image-to-pdf.js';

export const PngToPDF = {
  /**
   * Converts PNG images to PDF.
   * @param {File[]} imageFiles 
   * @param {Object} options Options object
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob>}
   */
  async process(imageFiles, options, onProgress) {
    return ImageToPDFUtil.convert(imageFiles, {
      ...options,
      analyticsToolName: 'png-to-pdf'
    }, onProgress);
  }
};
