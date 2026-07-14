/**
 * PixoPDF Page Range Parser Utility
 */

export const PageRangeParser = {
  /**
   * Parses page range string and returns an array of 0-based page indices.
   * Throws an error with descriptive validation feedback on failure.
   * @param {string} rangeStr User range input (e.g., "1-3, 5")
   * @param {number} totalPages Total pages in source PDF
   * @returns {number[]} Array of 0-based page numbers
   */
  parse(rangeStr, totalPages) {
    if (!rangeStr || !rangeStr.trim()) {
      throw new Error("Page range input cannot be empty.");
    }

    const pages = new Set();
    const cleanStr = rangeStr.replace(/\s+/g, '');
    
    // Validate characters
    if (!/^[0-9,-]+$/.test(cleanStr)) {
      throw new Error("Invalid characters in page range string. Only numbers, commas, and hyphens are allowed.");
    }

    const parts = cleanStr.split(',');

    for (const part of parts) {
      if (!part) {
        throw new Error("Empty range segment found (consecutive commas or leading/trailing comma).");
      }

      if (part.includes('-')) {
        const bounds = part.split('-');
        if (bounds.length !== 2) {
          throw new Error(`Invalid range format: "${part}"`);
        }
        
        if (bounds[0] === '' || bounds[1] === '') {
          throw new Error(`Incomplete range bounds: "${part}"`);
        }

        const start = parseInt(bounds[0], 10);
        const end = parseInt(bounds[1], 10);

        if (isNaN(start) || isNaN(end)) {
          throw new Error(`Invalid numbers in range: "${part}"`);
        }

        if (start <= 0 || end <= 0) {
          throw new Error("Page numbers must be positive integers starting from 1.");
        }

        if (start > end) {
          throw new Error(`Reversed range bounds are not allowed: "${part}" (Start must be less than or equal to end).`);
        }

        if (start > totalPages || end > totalPages) {
          throw new Error(`Page range "${part}" exceeds the total page count of ${totalPages}.`);
        }

        for (let i = start; i <= end; i++) {
          pages.add(i - 1);
        }
      } else {
        const pageNum = parseInt(part, 10);
        if (isNaN(pageNum)) {
          throw new Error(`Invalid page number: "${part}"`);
        }

        if (pageNum <= 0) {
          throw new Error("Page numbers must be positive integers starting from 1.");
        }

        if (pageNum > totalPages) {
          throw new Error(`Page number ${pageNum} exceeds the total page count of ${totalPages}.`);
        }

        pages.add(pageNum - 1);
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  }
};
