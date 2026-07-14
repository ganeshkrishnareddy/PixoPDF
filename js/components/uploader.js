/**
 * PixoPDF Uploader Component UI
 * Dynamically binds drop-zones, click handlers, and coordinates keyboard access.
 */

import { FileValidator } from '../core/file-validator.js';

export const Uploader = {
  /**
   * Initializes the upload container element and binds triggers.
   * @param {HTMLElement} element Root upload element matching template
   * @param {Object} options Configuration parameters
   * @param {string} options.expectedType 'pdf' | 'image' | 'any'
   * @param {Function} options.onFilesSelected Callback triggered on successful validation
   * @param {Function} options.onError Callback triggered on validation failures
   */
  init(element, options) {
    if (!element) return;
    
    // Clear and build secure inner structure
    element.className = "border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 text-center bg-white dark:bg-neutral-800 hover:border-indigo-500 transition-colors duration-200 cursor-pointer relative focus-within:ring-2 focus-within:ring-indigo-500 outline-none";
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');
    element.setAttribute('aria-label', 'Choose files. Click or drag files here.');

    element.innerHTML = `
      <input type="file" id="uploader-input" class="sr-only" multiple style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;" />
      <div class="flex flex-col items-center justify-center space-y-3 pointer-events-none">
        <div class="p-3 bg-indigo-50 dark:bg-neutral-900 rounded-full text-indigo-600 dark:text-indigo-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-8 h-8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        </div>
        <div>
          <span class="font-medium text-neutral-800 dark:text-neutral-100">Drop your files here</span>
          <span class="text-neutral-500 dark:text-neutral-400"> or click to choose files</span>
        </div>
        <div class="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <span>Files stay on your device · Processed securely in your browser</span>
        </div>
      </div>
    `;

    const input = element.querySelector('#uploader-input');

    // Handle clicks and drag states
    element.addEventListener('click', () => input.click());
    
    element.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        input.click();
      }
    });

    element.addEventListener('dragover', (e) => {
      e.preventDefault();
      element.classList.add('border-indigo-500', 'bg-indigo-50/20');
    });

    element.addEventListener('dragleave', () => {
      element.classList.remove('border-indigo-500', 'bg-indigo-50/20');
    });

    element.addEventListener('drop', async (e) => {
      e.preventDefault();
      element.classList.remove('border-indigo-500', 'bg-indigo-50/20');
      
      if (e.dataTransfer && e.dataTransfer.files) {
        await this._processSelection(e.dataTransfer.files, options);
      }
    });

    input.addEventListener('change', async (e) => {
      if (e.target.files) {
        await this._processSelection(e.target.files, options);
        // Clear input value to allow triggering change event on the same file again
        input.value = '';
      }
    });
  },

  async _processSelection(fileList, options) {
    const { validFiles, errors, warnings } = await FileValidator.validateFiles(fileList, options.expectedType || 'any');
    
    if (errors.length > 0) {
      if (options.onError) options.onError(errors[0]);
      return;
    }
    
    if (warnings.length > 0 && options.onWarning) {
      options.onWarning(warnings[0]);
    }

    if (validFiles.length > 0 && options.onFilesSelected) {
      options.onFilesSelected(validFiles);
    }
  }
};
