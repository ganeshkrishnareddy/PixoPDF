/**
 * ZeroPDF Search & Quick Filters Component
 */

import { ToolRegistry } from '../tools.js';

export const ToolSearch = {
  /**
   * Initializes search bindings and renders matches dynamically on parentElement.
   * @param {HTMLInputElement} inputElement Search input selector
   * @param {HTMLElement} resultsContainer Target list element to draw matches
   */
  init(inputElement, resultsContainer) {
    if (!inputElement || !resultsContainer) return;

    const performSearch = () => {
      const q = inputElement.value.trim().toLowerCase();
      const matched = ToolRegistry.filter(tool => {
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.primaryKeyword.toLowerCase().includes(q) ||
          tool.secondaryKeywords.some(keyword => keyword.toLowerCase().includes(q))
        );
      });
      this._renderCards(resultsContainer, matched);
    };

    inputElement.addEventListener('input', performSearch);
    
    // Initial draw
    performSearch();
  },

  _renderCards(container, tools) {
    if (tools.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-8 text-center text-neutral-500 dark:text-neutral-400">
          No tools match your search. Try "merge", "split", "compress", or "image".
        </div>
      `;
      return;
    }

    container.innerHTML = tools.map(tool => {
      return `
        <a href="${tool.pageUrl}" class="flex flex-col p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-md transition-all duration-200 group">
          <div class="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-indigo-600 dark:text-indigo-400 w-fit mb-4 group-hover:bg-indigo-50 dark:group-hover:bg-neutral-700 transition-colors duration-200">
            ${tool.icon}
          </div>
          <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">${tool.name}</h3>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 flex-1">${tool.description}</p>
          <div class="mt-4 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
            <span>Open Tool</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 ml-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>
        </a>
      `;
    }).join('');
  }
};
