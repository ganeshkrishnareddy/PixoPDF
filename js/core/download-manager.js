/**
 * PixoPDF Download Manager
 * Triggers client-side browser file downloads safely, tracking download events and cleanups.
 */

import { Analytics } from '../analytics.js';

export const DownloadManager = {
  /**
   * Downloads a Blob as a file, and automatically revokes the Object URL afterwards.
   * @param {Blob} blob 
   * @param {string} filename 
   * @param {string} toolSlug
   */
  downloadBlob(blob, filename, toolSlug = 'unknown') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup reference and revoke URL asynchronously to allow browser download dialog trigger
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 10000);

    // Track completed download without transmitting document identifiers
    Analytics.trackEvent('download_clicked', {
      tool: toolSlug,
      size: blob.size
    });
  },

  triggerDownload(blob, filename, toolSlug = 'unknown') {
    this.downloadBlob(blob, filename, toolSlug);
  }
};
