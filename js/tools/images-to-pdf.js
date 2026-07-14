/**
 * PixoPDF Images to PDF Tool Implementation
 * Converts multiple mixed images (JPG, PNG) into a single PDF document locally.
 */

import { ImageToPDFUtil } from '../core/image-to-pdf.js';

export const ImagesToPDF = {
  /**
   * Converts mixed images to PDF.
   * @param {File[]} imageFiles 
   * @param {Object} options Options object
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob>}
   */
  async process(imageFiles, options, onProgress) {
    return ImageToPDFUtil.convert(imageFiles, {
      ...options,
      analyticsToolName: 'images-to-pdf'
    }, onProgress);
  }
};
