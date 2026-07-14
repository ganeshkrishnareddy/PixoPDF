/**
 * ZeroPDF Toast Component
 * Emits fleeting notifications or error alerts matching accessibility goals.
 */

export const Toast = {
  /**
   * Fires a fleeting toast alert.
   * @param {string} message 
   * @param {string} type 'success' | 'error' | 'warning'
   */
  show(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.setAttribute('role', 'alert');
    toast.className = `p-4 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto flex items-center justify-between space-x-3`;
    
    // Choose styling based on alert type
    if (type === 'error') {
      toast.className += ' bg-rose-600 dark:bg-rose-700';
    } else if (type === 'warning') {
      toast.className += ' bg-amber-500 dark:bg-amber-600';
    } else {
      toast.className += ' bg-emerald-600 dark:bg-emerald-700';
    }

    toast.innerHTML = `
      <span>${message}</span>
      <button class="text-white hover:text-neutral-200 outline-none focus:ring-1 focus:ring-white rounded p-0.5" aria-label="Dismiss toast">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    container.appendChild(toast);

    // Bind close click
    toast.querySelector('button').addEventListener('click', () => {
      this._dismiss(toast);
    });

    // Trigger animate-in
    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    // Auto dismiss after duration
    setTimeout(() => {
      this._dismiss(toast);
    }, 5000);
  },

  _dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
};
