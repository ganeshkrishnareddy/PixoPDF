/**
 * ZeroPDF File Validator
 * Enforces security, file validation, and memory warnings.
 */

export const FileValidator = {
  // Configurable guardrails
  LIMITS: {
    PDF_MAX_SIZE: 500 * 1024 * 1024, // 500 MB
    IMAGE_MAX_SIZE: 100 * 1024 * 1024, // 100 MB
    MAX_IMAGE_COUNT: 100,
    MAX_FILE_COUNT: 100,
    MEMORY_WARNING_THRESHOLD: 80 * 1024 * 1024 // 80 MB triggers threshold alert
  },

  /**
   * Reads the first few bytes of a file to check magic headers.
   * @param {File} file 
   * @returns {Promise<string>} Hex representation of header or file type identifier
   */
  detectTypeByHeader(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target || !e.target.result) {
          resolve('unknown');
          return;
        }
        const arr = new Uint8Array(e.target.result);
        let header = '';
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16).padStart(2, '0');
        }
        
        // Match magic headers
        // %PDF- => 25 50 44 46 2d
        if (header.startsWith('255044462d')) {
          resolve('pdf');
        } 
        // JPEG => ff d8 ff
        else if (header.startsWith('ffd8ff')) {
          resolve('jpeg');
        } 
        // PNG => 89 50 4e 47 0d 0a 1a 0a
        else if (header.startsWith('89504e470d0a1a0a')) {
          resolve('png');
        } else {
          resolve('unknown');
        }
      };
      // Read first 8 bytes for signature validation
      reader.readAsArrayBuffer(file.slice(0, 8));
    });
  },

  /**
   * Validates an array of selected files.
   * @param {FileList|File[]} files 
   * @param {string} expectedType 'pdf' | 'image' | 'any'
   * @returns {Promise<{ validFiles: File[], errors: string[], warnings: string[] }>}
   */
  async validateFiles(files, expectedType = 'any') {
    const fileList = Array.from(files);
    const validFiles = [];
    const errors = [];
    const warnings = [];
    let totalSize = 0;

    if (fileList.length > this.LIMITS.MAX_FILE_COUNT) {
      errors.push(`Maximum of ${this.LIMITS.MAX_FILE_COUNT} files can be selected at once.`);
      return { validFiles, errors, warnings };
    }

    for (const file of fileList) {
      totalSize += file.size;
      
      // Basic size validation
      if (expectedType === 'pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        if (file.size > this.LIMITS.PDF_MAX_SIZE) {
          errors.push(`"${file.name}" exceeds the maximum PDF size limit of 500 MB.`);
          continue;
        }
      } else {
        if (file.size > this.LIMITS.IMAGE_MAX_SIZE) {
          errors.push(`"${file.name}" exceeds the maximum image size limit of 100 MB.`);
          continue;
        }
      }

      // Magic byte check
      const detectedType = await this.detectTypeByHeader(file);
      
      if (expectedType === 'pdf' && detectedType !== 'pdf') {
        errors.push(`"${file.name}" is not a valid PDF document.`);
        continue;
      }
      if (expectedType === 'image' && detectedType !== 'jpeg' && detectedType !== 'png') {
        errors.push(`"${file.name}" is not a valid image. Only PNG and JPEG are supported.`);
        continue;
      }
      if (expectedType === 'any' && detectedType === 'unknown') {
        errors.push(`"${file.name}" has an unrecognized file format.`);
        continue;
      }

      validFiles.push(file);
    }

    // Memory risk heuristic check
    if (totalSize > this.LIMITS.MEMORY_WARNING_THRESHOLD) {
      warnings.push("These files may require significant browser memory. Processing could be slower on this device.");
    }

    return { validFiles, errors, warnings };
  }
};
