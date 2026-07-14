/**
 * PixoPDF Merge PDF Tool Implementation
 * Combines multiple uploaded PDF files locally in browser using pdf-lib.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { DownloadManager } from '../core/download-manager.js';
import { MemoryManager } from '../core/memory-manager.js';
import { PdfLoader } from '../core/pdf-loader.js';
import { ErrorHandler } from '../core/error-handler.js';
import { Analytics } from '../analytics.js';

export const MergePDF = {
  /**
   * Performs client-side PDF merging.
   * @param {File[]} files Sorted array of validated PDF files
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob>}
   */
  async process(files, onProgress) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }
    
    Analytics.trackEvent('processing_started', { tool: 'merge-pdf', count: files.length });

    onProgress('Initializing merge document...', 5);
    const mergedDoc = await window.PDFLib.PDFDocument.create();
    
    // Read and parse all PDFs
    const totalFiles = files.length;
    
    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const stepPercent = Math.round(5 + (i / totalFiles) * 80);
      onProgress(`Reading document: ${file.name}...`, stepPercent);

      try {
        const fileBuffer = await FileReaderUtil.readAsArrayBuffer(file);
        const srcDoc = await window.PDFLib.PDFDocument.load(fileBuffer);
        const pagesToCopy = srcDoc.getPageIndices();
        const copiedPages = await mergedDoc.copyPages(srcDoc, pagesToCopy);
        
        copiedPages.forEach(page => mergedDoc.addPage(page));
        
        // Deallocate source references immediately
        MemoryManager.wipeArrayBufferRefs(fileBuffer);
      } catch (err) {
        Analytics.trackEvent('processing_failed', { tool: 'merge-pdf', error: err.message });
        throw new Error(ErrorHandler.getFriendlyMessage(err));
      }
    }

    onProgress('Assembling merged PDF file...', 90);
    const mergedBytes = await mergedDoc.save();
    const mergedBlob = new Blob([mergedBytes], { type: 'application/pdf' });
    
    // Cleanup compiled bytes
    MemoryManager.wipeArrayBufferRefs(mergedBytes);
    
    onProgress('Done!', 100);
    Analytics.trackEvent('processing_completed', { tool: 'merge-pdf', size: mergedBlob.size });
    return mergedBlob;
  }
};
