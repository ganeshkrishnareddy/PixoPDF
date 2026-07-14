/**
 * PixoPDF PDF Coordinate Conversion Utility
 * Translates coordinates between browser viewport pixels and PDF page points.
 */

export const PdfCoordinate = {
  /**
   * Translates screen (browser CSS pixels relative to page overlay container) to PDF page coordinate points.
   * Note: PDF origin starts at bottom-left, whereas browser starts at top-left.
   * @param {Object} point { x, y } in CSS pixels relative to the rendered page element
   * @param {Object} pageDims { width, height } original PDF page width/height in points
   * @param {number} zoom Current zoom scale multiplier (e.g. 1.0)
   * @param {number} rotation Page rotation angle (0, 90, 180, 270)
   * @returns {Object} { x, y } in PDF points
   */
  screenToPdf(point, pageDims, zoom, rotation) {
    const { x, y } = point;
    const { width: pdfW, height: pdfH } = pageDims;
    
    // Scale screen pixels back to unzoomed dimensions
    const rawX = x / zoom;
    const rawY = y / zoom;

    let pdfX = rawX;
    let pdfY = rawY;

    // Standardize rotation
    const rot = (rotation % 360 + 360) % 360;

    if (rot === 0) {
      pdfX = rawX;
      pdfY = pdfH - rawY; // Invert Y
    } else if (rot === 90) {
      pdfX = rawY;
      pdfY = rawX;
    } else if (rot === 180) {
      pdfX = pdfW - rawX;
      pdfY = rawY;
    } else if (rot === 270) {
      pdfX = pdfW - rawY;
      pdfY = pdfH - rawX;
    }

    return { x: pdfX, y: pdfY };
  },

  /**
   * Translates PDF points back to screen coordinate CSS pixels.
   * @param {Object} point { x, y } in PDF points
   * @param {Object} pageDims { width, height } original PDF page width/height in points
   * @param {number} zoom Current zoom scale multiplier
   * @param {number} rotation Page rotation angle (0, 90, 180, 270)
   * @returns {Object} { x, y } in CSS pixels relative to page overlay container
   */
  pdfToScreen(point, pageDims, zoom, rotation) {
    const { x, y } = point;
    const { width: pdfW, height: pdfH } = pageDims;

    let rawX = x;
    let rawY = y;

    const rot = (rotation % 360 + 360) % 360;

    if (rot === 0) {
      rawX = x;
      rawY = pdfH - y; // Invert Y back
    } else if (rot === 90) {
      rawX = y;
      rawY = x;
    } else if (rot === 180) {
      rawX = pdfW - x;
      rawY = y;
    } else if (rot === 270) {
      rawX = pdfH - y;
      rawY = pdfW - x;
    }

    return {
      x: rawX * zoom,
      y: rawY * zoom
    };
  }
};
