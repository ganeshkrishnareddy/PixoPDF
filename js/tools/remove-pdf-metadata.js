/**
 * PixoPDF Remove PDF Metadata Tool Implementation
 * Clears header metadata fields locally using pdf-lib.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { MemoryManager } from '../core/memory-manager.js';
import { ErrorHandler } from '../core/error-handler.js';
import { Analytics } from '../analytics.js';

export const RemovePDFMetadata = {
  /**
   * Clears header properties fields.
   * @param {File} pdfFile Source document
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob>}
   */
  async process(pdfFile, onProgress) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }

    Analytics.trackEvent('processing_started', { tool: 'remove-pdf-metadata' });
    onProgress('Loading PDF structure...', 20);

    try {
      const fileBuffer = await FileReaderUtil.readAsArrayBuffer(pdfFile);
      
      // UpdateMetadata false to prevent auto filling details
      const doc = await window.PDFLib.PDFDocument.load(fileBuffer, { updateMetadata: false });

      onProgress('Clearing metadata properties...', 60);
      
      // Reset text fields
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setCreator('');
      doc.setProducer('');

      // Overwrite/nullify date metrics where supported by the library
      // For standard PDF structures, we can reset dates using setCreationDate and setModificationDate
      const emptyDate = new Date(0); // Epoch date as safe fallback
      doc.setCreationDate(emptyDate);
      doc.setModificationDate(emptyDate);

      onProgress('Saving clean document streams...', 85);
      const outputBytes = await doc.save();
      const outputBlob = new Blob([outputBytes], { type: 'application/pdf' });

      MemoryManager.wipeArrayBufferRefs(fileBuffer);
      MemoryManager.wipeArrayBufferRefs(outputBytes);

      onProgress('Done!', 100);
      Analytics.trackEvent('processing_completed', { tool: 'remove-pdf-metadata', size: outputBlob.size });
      return outputBlob;
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: 'remove-pdf-metadata', error: err.message });
      throw new Error(ErrorHandler.getFriendlyMessage(err));
    }
  }
};
