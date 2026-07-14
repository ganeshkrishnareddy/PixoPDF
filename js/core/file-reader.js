/**
 * ZeroPDF File Reader Utility
 * Reads files locally into ArrayBuffers or Object URLs safely.
 */

export const FileReaderUtil = {
  /**
   * Reads a file as an ArrayBuffer.
   * @param {File} file 
   * @returns {Promise<ArrayBuffer>}
   */
  readAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsArrayBuffer(file);
    });
  },

  /**
   * Reads an image file and returns its dimensions.
   * @param {File|Blob} fileOrBlob 
   * @returns {Promise<{ width: number, height: number, imgElement: HTMLImageElement }>}
   */
  loadImageDimensions(fileOrBlob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(fileOrBlob);
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          imgElement: img
        });
        URL.revokeObjectURL(objectUrl);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to load image layout dimensions."));
      };
      
      img.src = objectUrl;
    });
  }
};
