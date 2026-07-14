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
        <a href="${tool.pageUrl}" class="flex flex-col p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer" aria-label="Use tool ${tool.name}">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 transition-colors duration-200">
              ${tool.icon}
            </div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              ${tool.category}
            </span>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1 font-display">${tool.name}</h3>
          <p class="text-sm text-slate-650 dark:text-slate-400 flex-1 leading-relaxed">${tool.description}</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5 mr-1"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              In Browser
            </span>
            <div class="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-200">
              <span>Open Tool</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-3.5 h-3.5 ml-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>
        </a>
      `;
    }).join('');
  }
};
