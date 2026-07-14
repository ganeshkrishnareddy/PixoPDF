/**
 * PixoPDF Split PDF Tool Implementation
 * Extracts selected page ranges or splits all pages into individual files.
 */

import { FileReaderUtil } from '../core/file-reader.js';
import { MemoryManager } from '../core/memory-manager.js';
import { ErrorHandler } from '../core/error-handler.js';
import { Analytics } from '../analytics.js';
import { PageRangeParser } from '../core/page-range-parser.js';

export const SplitPDF = {
  /**
   * Performs client-side PDF splitting.
   * @param {File} file Uploaded PDF file
   * @param {Object} options Configuration parameters
   * @param {string} options.mode 'extract' | 'split-all'
   * @param {string} options.rangeStr Optional input page string (for extract mode)
   * @param {Function} onProgress callback(message, percentage)
   * @returns {Promise<Blob|{name: string, blob: Blob}[]>} Returns single PDF Blob if extract mode, or array of files if split-all.
   */
  async process(file, options, onProgress) {
    if (!window.PDFLib) {
      throw new Error("PDFLib library is not loaded.");
    }
    
    Analytics.trackEvent('processing_started', { tool: 'split-pdf', mode: options.mode });
    onProgress('Loading PDF source...', 10);

    try {
      const fileBuffer = await FileReaderUtil.readAsArrayBuffer(file);
      const srcDoc = await window.PDFLib.PDFDocument.load(fileBuffer);
      const totalPages = srcDoc.getPageCount();

      if (options.mode === 'extract') {
        onProgress('Parsing target range...', 20);
        const targetPages = PageRangeParser.parse(options.rangeStr, totalPages);
        
        if (targetPages.length === 0) {
          throw new Error("No valid page range specified.");
        }

        onProgress(`Extracting ${targetPages.length} pages...`, 50);
        const splitDoc = await window.PDFLib.PDFDocument.create();
        const copiedPages = await splitDoc.copyPages(srcDoc, targetPages);
        copiedPages.forEach(page => splitDoc.addPage(page));

        onProgress('Writing PDF structure...', 80);
        const outputBytes = await splitDoc.save();
        const outputBlob = new Blob([outputBytes], { type: 'application/pdf' });
        
        MemoryManager.wipeArrayBufferRefs(fileBuffer);
        MemoryManager.wipeArrayBufferRefs(outputBytes);
        
        onProgress('Done!', 100);
        Analytics.trackEvent('processing_completed', { tool: 'split-pdf', size: outputBlob.size });
        return outputBlob;
      } 
      
      // Split All Mode
      else {
        const splitFiles = [];
        for (let i = 0; i < totalPages; i++) {
          const stepPercent = Math.round(20 + (i / totalPages) * 70);
          onProgress(`Splitting page ${i + 1} of ${totalPages}...`, stepPercent);

          const splitDoc = await window.PDFLib.PDFDocument.create();
          const copiedPages = await splitDoc.copyPages(srcDoc, [i]);
          splitDoc.addPage(copiedPages[0]);

          const outputBytes = await splitDoc.save();
          const outputBlob = new Blob([outputBytes], { type: 'application/pdf' });

          const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          const zeroPaddedNum = String(i + 1).padStart(3, '0');
          
          splitFiles.push({
            name: `${baseName}-page-${zeroPaddedNum}.pdf`,
            blob: outputBlob
          });

          // Deallocate single page output bytes immediately
          MemoryManager.wipeArrayBufferRefs(outputBytes);
        }

        MemoryManager.wipeArrayBufferRefs(fileBuffer);
        onProgress('Packaging all files into ZIP...', 95);
        
        Analytics.trackEvent('processing_completed', { tool: 'split-pdf-zip', pages: totalPages });
        return splitFiles;
      }
    } catch (err) {
      Analytics.trackEvent('processing_failed', { tool: 'split-pdf', error: err.message });
      throw new Error(ErrorHandler.getFriendlyMessage(err));
    }
  }
};
