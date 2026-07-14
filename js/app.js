/**
 * PixoPDF Main App Initializer
 * Coordinates light/dark theme preference and layout setups.
 */

export const App = {
  init() {
    this._initTheme();
  },

  _initTheme() {
    // Rely on head script state for initial load setup.
    // Bind manually defined theme toggle switch if rendered.
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('pixopdf-theme', 'light');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('pixopdf-theme', 'dark');
        }
      });
    }
  }
};

// Auto boot on DOM load
document.addEventListener('DOMContentLoaded', () => App.init());
