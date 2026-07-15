/**
 * PixoPDF Editor Page Renderer
 * Manages PDF.js page rendering and syncs absolute HTML overlays.
 */

import { InteractiveObjectController } from './interactive-object-controller.js';

export class PageRenderer {
  /**
   * @param {HTMLElement} workspaceContainer Target DOM element where pages are drawn
   * @param {Object} state EditorState instance reference
   * @param {Object} options Rendering hooks
   * @param {Function} options.onObjectSelected Callback when an object overlay is clicked
   */
  constructor(workspaceContainer, state, options) {
    this.container = workspaceContainer;
    this.state = state;
    this.options = options || {};
    this.pdfDoc = null;
    this.pageViews = {}; // pageIndex -> { canvas, overlay, viewport, page }
    
    // Shared Interactive Controller
    this.controller = new InteractiveObjectController(this.state, this, this.options);
  }

  /**
   * Loads a PDF.js document into the workspace renderer.
   * @param {Object} pdfjsDocInstance 
   */
  async loadDocument(pdfjsDocInstance) {
    this.pdfDoc = pdfjsDocInstance;
    this.container.innerHTML = '';
    this.pageViews = {};
    
    const pageCount = this.pdfDoc.numPages;
    this.state.document.pageCount = pageCount;

    // Build viewport containers for all pages sequentially
    for (let i = 0; i < pageCount; i++) {
      const pageWrapper = document.createElement('div');
      pageWrapper.className = "pdf-page-wrapper relative mx-auto my-6 bg-white shadow-md border border-slate-200 dark:border-slate-800 transition-all select-none";
      pageWrapper.id = `page-wrapper-${i}`;

      const canvas = document.createElement('canvas');
      canvas.className = "block max-w-full";
      canvas.id = `page-canvas-${i}`;

      const overlay = document.createElement('div');
      overlay.className = "page-overlay absolute top-0 left-0 w-full h-full z-10 overflow-hidden cursor-default";
      overlay.id = `page-overlay-${i}`;
      
      pageWrapper.appendChild(canvas);
      pageWrapper.appendChild(overlay);
      this.container.appendChild(pageWrapper);

      // Deselect when clicking empty page overlay canvas
      overlay.addEventListener('pointerdown', (e) => {
        if (e.target === overlay) {
          this.controller.deselect();
        }
      });

      this.pageViews[i] = {
        wrapper: pageWrapper,
        canvas: canvas,
        overlay: overlay,
        viewport: null,
        pdfPage: null,
        rendered: false
      };
    }
  }

  /**
   * Renders target pages using PDF.js viewport coordinates.
   * @param {number} pageIndex 
   */
  async renderPage(pageIndex) {
    const view = this.pageViews[pageIndex];
    if (!view || !this.pdfDoc) return;

    try {
      const page = await this.pdfDoc.getPage(pageIndex + 1);
      view.pdfPage = page;

      const rotation = page.rotate || 0;
      const zoom = this.state.viewport.zoom;
      
      // Standardize base size target viewport
      const standardViewport = page.getViewport({ scale: 1.0 });
      
      // Apply scale multiplier
      const scale = zoom * (792 / standardViewport.width); // Base standard page width fit scale
      const viewport = page.getViewport({ scale });
      view.viewport = viewport;

      // Adjust container wrapper sizes
      view.wrapper.style.width = `${viewport.width}px`;
      view.wrapper.style.height = `${viewport.height}px`;

      // Set canvas drawing pixel resolution (DPR)
      const dpr = window.devicePixelRatio || 1;
      view.canvas.width = viewport.width * dpr;
      view.canvas.height = viewport.height * dpr;
      
      // Keep style CSS matching viewport size
      view.canvas.style.width = `${viewport.width}px`;
      view.canvas.style.height = `${viewport.height}px`;

      const ctx = view.canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      // Render loops
      await page.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise;

      view.rendered = true;
      this.drawPageObjects(pageIndex);
    } catch (err) {
      console.error(`Page render failed for page ${pageIndex}:`, err);
    }
  }

  /**
   * Syncs and draws in-memory state objects onto the absolute visual overlay.
   * @param {number} pageIndex 
   */
  drawPageObjects(pageIndex) {
    const view = this.pageViews[pageIndex];
    if (!view || !view.rendered) return;

    view.overlay.innerHTML = '';
    
    // Filter matching objects for this page index
    const pageObjects = this.state.objects.filter(o => o.pageIndex === pageIndex);

    pageObjects.forEach(obj => {
      const objEl = document.createElement('div');
      objEl.className = `editor-object absolute border border-dashed border-indigo-300 bg-indigo-50/5 cursor-move group select-none transition-shadow duration-150`;
      
      // Transform coordinates relative to zoom & rotation viewport
      const x = obj.x * this.state.viewport.zoom;
      const y = obj.y * this.state.viewport.zoom;
      const w = obj.width * this.state.viewport.zoom;
      const h = obj.height * this.state.viewport.zoom;

      objEl.style.left = `${x}px`;
      objEl.style.top = `${y}px`;
      objEl.style.width = `${w}px`;
      objEl.style.height = `${h}px`;
      objEl.style.transform = `rotate(${obj.rotation}deg)`;
      objEl.id = `dom-obj-${obj.id}`;

      // Populate content wrapper depending on object types
      let innerHtml = '';
      if (obj.type === 'text') {
        const bgStyle = obj.properties.backgroundColor ? `background-color: ${obj.properties.backgroundColor};` : '';
        innerHtml = `<div class="w-full h-full overflow-hidden whitespace-pre-wrap outline-none p-1" style="${bgStyle} font-family: ${obj.properties.font || 'Helvetica'}; font-size: ${(obj.properties.fontSize || 12) * this.state.viewport.zoom}px; color: ${obj.properties.color || '#000000'}">${obj.properties.text || 'Type text...'}</div>`;
      } else if (obj.type === 'watermark-text') {
        const op = obj.properties.opacity !== undefined ? obj.properties.opacity : 0.3;
        innerHtml = `<div class="w-full h-full flex items-center justify-center overflow-hidden whitespace-nowrap outline-none select-none text-center" style="font-family: Arial, Helvetica, sans-serif; font-weight: bold; font-size: ${(obj.properties.fontSize || 48) * this.state.viewport.zoom}px; color: ${obj.properties.color || '#6b7280'}; opacity: ${op}; line-height: 1;">${obj.properties.text || 'DRAFT'}</div>`;
      } else if (obj.type === 'watermark-image') {
        const op = obj.properties.opacity !== undefined ? obj.properties.opacity : 0.3;
        innerHtml = `<img src="${obj.properties.dataUrl}" class="w-full h-full object-contain pointer-events-none select-none" style="opacity: ${op};" />`;
      } else if (obj.type === 'signature' || obj.type === 'image') {
        innerHtml = `<img src="${obj.properties.dataUrl}" class="w-full h-full object-contain pointer-events-none" />`;
      } else if (obj.type === 'checkmark') {
        innerHtml = `<div class="w-full h-full flex items-center justify-center font-bold text-indigo-600 text-lg">✓</div>`;
      } else if (obj.type === 'rectangle') {
        innerHtml = `<div class="w-full h-full border-2 border-indigo-600"></div>`;
      } else if (obj.type === 'highlight') {
        innerHtml = `<div class="w-full h-full bg-yellow-300 opacity-40"></div>`;
      } else if (obj.type === 'underline') {
        innerHtml = `<div class="w-full h-full border-b-2 border-indigo-600"></div>`;
      } else if (obj.type === 'strikeout') {
        innerHtml = `<div class="w-full h-full border-b-2 border-red-500 mt-2"></div>`;
      }

      objEl.innerHTML = innerHtml;

      // Bind the shared InteractiveObjectController actions
      this.controller.bindEvents(obj, objEl, pageIndex);

      view.overlay.appendChild(objEl);
    });
  }

  /**
   * Refreshes renderings across all pages when zoom updates.
   */
  async refreshAll() {
    const pageCount = this.state.document.pageCount;
    for (let i = 0; i < pageCount; i++) {
      await this.renderPage(i);
    }
  }
}
