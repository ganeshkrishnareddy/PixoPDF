/**
 * PixoPDF File List Visual Component
 * Renders a sortable or listable layout of selected files with reordering controls.
 */

export const FileList = {
  /**
   * Render file collection items inside element.
   * @param {HTMLElement} element 
   * @param {File[]} files 
   * @param {Object} options callbacks
   * @param {Function} options.onRemove callback(index)
   * @param {Function} options.onReorder callback(newOrderIndexes)
   * @param {boolean} options.showPages whether to query and show page count
   * @param {Object} options.pageCounts cached page counts mapped by file index/name
   */
  render(element, files, options = {}) {
    if (!element) return;
    if (files.length === 0) {
      element.innerHTML = '';
      return;
    }

    element.innerHTML = `
      <div class="space-y-2 max-w-2xl mx-auto">
        <div class="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2 flex justify-between">
          <span>Files Selected (${files.length})</span>
          <span>Drag items or use buttons to reorder</span>
        </div>
        <ul class="space-y-2" id="file-items-list" role="list">
          ${files.map((file, idx) => {
            const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
            const pageCount = options.pageCounts && options.pageCounts[idx] !== undefined ? `${options.pageCounts[idx]} pages` : 'Reading...';
            
            return `
              <li class="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm" 
                  draggable="true" data-index="${idx}">
                <div class="flex items-center space-x-3 min-w-0 flex-1">
                  <!-- Handle -->
                  <div class="cursor-move text-neutral-400 dark:text-neutral-600 drag-handle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
                  </div>
                  <!-- Details -->
                  <div class="min-w-0 flex-1">
                    <div class="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">${file.name}</div>
                    <div class="text-xs text-neutral-500 dark:text-neutral-400 flex items-center space-x-2">
                      <span>${sizeStr}</span>
                      <span>·</span>
                      <span>${options.showPages ? pageCount : 'Image file'}</span>
                    </div>
                  </div>
                </div>
                <!-- Actions -->
                <div class="flex items-center space-x-1 ml-2">
                  <button type="button" class="btn-move-up p-1 text-neutral-400 dark:text-neutral-600 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:pointer-events-none" 
                          data-index="${idx}" ${idx === 0 ? 'disabled' : ''} aria-label="Move item up">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><polyline points="18 15 12 9 6 15"></polyline></svg>
                  </button>
                  <button type="button" class="btn-move-down p-1 text-neutral-400 dark:text-neutral-600 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:pointer-events-none" 
                          data-index="${idx}" ${idx === files.length - 1 ? 'disabled' : ''} aria-label="Move item down">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                  <button type="button" class="btn-remove p-1 text-neutral-400 dark:text-neutral-600 hover:text-rose-600 dark:hover:text-rose-400" 
                          data-index="${idx}" aria-label="Remove item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </li>
            `;
          }).join('')}
        </ul>
      </div>
    `;

    // Bind item remove buttons
    element.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        if (options.onRemove) options.onRemove(index);
      });
    });

    // Up/down click actions
    element.querySelectorAll('.btn-move-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this._swap(files, index, index - 1, options);
      });
    });

    element.querySelectorAll('.btn-move-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this._swap(files, index, index + 1, options);
      });
    });

    // Drag-and-drop sort events
    const listItems = element.querySelectorAll('#file-items-list li');
    let dragSrcEl = null;

    listItems.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        dragSrcEl = item;
        e.dataTransfer.effectAllowed = 'move';
        item.classList.add('opacity-50');
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });

      item.addEventListener('dragenter', (e) => {
        item.classList.add('bg-neutral-100', 'dark:bg-neutral-700');
      });

      item.addEventListener('dragleave', () => {
        item.classList.remove('bg-neutral-100', 'dark:bg-neutral-700');
      });

      item.addEventListener('drop', (e) => {
        e.stopPropagation();
        item.classList.remove('bg-neutral-100', 'dark:bg-neutral-700');
        
        if (dragSrcEl && dragSrcEl !== item) {
          const fromIndex = parseInt(dragSrcEl.getAttribute('data-index'));
          const toIndex = parseInt(item.getAttribute('data-index'));
          this._reorder(files, fromIndex, toIndex, options);
        }
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('opacity-50');
        listItems.forEach(li => li.classList.remove('bg-neutral-100', 'dark:bg-neutral-700'));
      });
    });
  },

  _swap(files, from, to, options) {
    const newOrder = [...Array(files.length).keys()];
    const temp = newOrder[from];
    newOrder[from] = newOrder[to];
    newOrder[to] = temp;
    if (options.onReorder) options.onReorder(newOrder);
  },

  _reorder(files, from, to, options) {
    const newOrder = [...Array(files.length).keys()];
    newOrder.splice(from, 1);
    newOrder.splice(to, 0, from);
    if (options.onReorder) options.onReorder(newOrder);
  }
};
