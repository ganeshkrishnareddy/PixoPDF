/**
 * PixoPDF Page Thumbnail Renderer Utility
 * Sequentially renders PDF pages to low-resolution image blobs.
 * Manages concurrency and memory safety.
 */

import { FileReaderUtil } from './file-reader.js';

export const PdfThumbnailRenderer = {
  /**
   * Renders target pages of a PDF file to data URLs using PDF.js.
   * Concurrency is limited to prevent browser crash / memory bloat.
   * @param {File|Blob} pdfFile Source PDF document
   * @param {number[]} pageIndices 0-based page indices to render
   * @param {Object} options Configuration parameters
   * @param {number} options.width Target thumbnail width (default 200)
   * @param {number} options.concurrency Max concurrent renders (default 3)
   * @param {Function} onPageRendered Callback when each page finishes rendering: callback(pageIndex, dataUrl)
   * @returns {Promise<void>} Resolves when all requested thumbnails complete
   */
  async renderThumbnails(pdfFile, pageIndices, options, onPageRendered) {
    if (!window.pdfjsLib) {
      throw new Error("PDF.js library is not loaded.");
    }

    const width = options.width || 200;
    const maxConcurrency = options.concurrency || 3;

    // Load PDF document using PDF.js
    const fileBuffer = await FileReaderUtil.readAsArrayBuffer(pdfFile);
    const pdfDoc = await window.pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) }).promise;

    // Build queue of pages to render
    const queue = [...pageIndices];
    const activePromises = [];

    const processNext = async () => {
      if (queue.length === 0) return;
      const idx = queue.shift();

      try {
        const page = await pdfDoc.getPage(idx + 1);
        
        // Compute scale based on target width
        const viewport = page.getViewport({ scale: 1.0 });
        const scale = width / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        // Create temporary canvas
        const canvas = document.createElement('canvas');
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        const ctx = canvas.getContext('2d');

        // Render page context
        await page.render({
          canvasContext: ctx,
          viewport: scaledViewport
        }).promise;

        // Extract image data url
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        // Free canvas references
        canvas.width = 0;
        canvas.height = 0;

        // Callback
        onPageRendered(idx, dataUrl);
      } catch (err) {
        console.error(`Failed to render thumbnail for page index ${idx}:`, err);
      }

      // Chain process next
      await processNext();
    };

    // Spin up concurrent workers
    const workerCount = Math.min(maxConcurrency, queue.length);
    for (let i = 0; i < workerCount; i++) {
      activePromises.push(processNext());
    }

    await Promise.all(activePromises);
    
    // Clean document ref
    pdfDoc.destroy();
  }
};
