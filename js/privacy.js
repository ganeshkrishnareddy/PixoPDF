/**
 * PixoPDF Privacy Page Helper
 */

import { Analytics } from './analytics.js';

document.addEventListener('DOMContentLoaded', () => {
  Analytics.trackEvent('tool_page_view', { page: 'privacy' });
});
