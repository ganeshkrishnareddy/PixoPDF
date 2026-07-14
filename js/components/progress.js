/**
 * ZeroPDF Progress Component
 * Displays loading rings or bar percentages safely.
 */

export const Progress = {
  /**
   * Render loading state inside target container.
   * @param {HTMLElement} element 
   * @param {string} text Primary state label
   * @param {number} percentage Progress amount (0-100) or null/negative for indeterminate spinner
   */
  show(element, text = 'Processing...', percentage = -1) {
    if (!element) return;
    
    element.setAttribute('aria-live', 'polite');
    element.innerHTML = `
      <div class="flex flex-col items-center justify-center space-y-4 p-8">
        ${percentage >= 0 ? `
          <!-- Bar progress style -->
          <div class="w-full max-w-md bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden">
            <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style="width: ${percentage}%"></div>
          </div>
          <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">${text} (${percentage}%)</span>
        ` : `
          <!-- Spinner style -->
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">${text}</span>
        `}
      </div>
    `;
  },

  hide(element) {
    if (element) {
      element.innerHTML = '';
      element.removeAttribute('aria-live');
    }
  }
};
