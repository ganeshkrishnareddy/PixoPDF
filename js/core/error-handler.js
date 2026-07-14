/**
 * PixoPDF User-Friendly Error Handler
 */

export const ErrorHandler = {
  /**
   * Translates internal processing exceptions into user-friendly diagnostic logs.
   * @param {Error} error 
   * @returns {string} User-facing error message
   */
  getFriendlyMessage(error) {
    console.error("Internal processing error:", error);
    
    const msg = error.message || '';
    if (msg.includes('password') || msg.includes('decrypt')) {
      return "We couldn't process this PDF. The file may be password protected or encrypted.";
    }
    if (msg.includes('corrupt') || msg.includes('Invalid PDF structure')) {
      return "We couldn't process this PDF. The file may be damaged or malformed.";
    }
    if (msg.includes('out of memory') || msg.includes('allocat')) {
      return "The operation exceeded browser memory. Try split-processing your document in smaller chunks.";
    }
    
    return "An error occurred while processing your document securely. Please try again with a valid file.";
  }
};
