/**
 * PixoPDF Editor Page Renderer
 * Manages PDF.js page rendering and syncs absolute HTML overlays.
 */

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
      objEl.className = `editor-object absolute border border-dashed border-indigo-400 bg-indigo-50/10 cursor-move group select-none ${this.state.selection.objectId === obj.id ? 'border-indigo-600 ring-2 ring-indigo-500/20' : ''}`;
      
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

      // Pointer-based select & drag (supports Mouse and Touch drags)
      objEl.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        objEl.setPointerCapture(e.pointerId);
        
        if (this.options.onObjectSelected) {
          this.options.onObjectSelected(obj.id);
        }

        const startX = e.clientX;
        const startY = e.clientY;
        const initialX = obj.x;
        const initialY = obj.y;
        const zoom = this.state.viewport.zoom;

        let currentPageIndex = pageIndex;

        const onPointerMove = (moveEvent) => {
          const zoom = this.state.viewport.zoom;
          
          // Determine which page container is under the pointer
          let targetPageIndex = currentPageIndex;
          let rect = this.pageViews[currentPageIndex].container.getBoundingClientRect();
          
          for (let i = 0; i < this.pageViews.length; i++) {
            const pv = this.pageViews[i];
            if (pv && pv.rendered) {
              const r = pv.container.getBoundingClientRect();
              if (
                moveEvent.clientX >= r.left &&
                moveEvent.clientX <= r.right &&
                moveEvent.clientY >= r.top &&
                moveEvent.clientY <= r.bottom
              ) {
                targetPageIndex = i;
                rect = r;
                break;
              }
            }
          }

          // Calculate coordinates relative to the active target page top-left
          const sourceRect = this.pageViews[pageIndex].container.getBoundingClientRect();
          const dx = (moveEvent.clientX - startX) / zoom;
          const dy = (moveEvent.clientY - startY) / zoom;
          
          // Absolute client coordinates mapped back to target page coordinates
          const globalX = (startX + dx * zoom) - rect.left;
          const globalY = (startY + dy * zoom) - rect.top;
          
          const localX = globalX / zoom;
          const localY = globalY / zoom;

          if (targetPageIndex !== currentPageIndex) {
            // Migrate element in DOM to the new page overlay
            const targetView = this.pageViews[targetPageIndex];
            if (targetView && targetView.rendered) {
              targetView.overlay.appendChild(objEl);
              currentPageIndex = targetPageIndex;
            }
          }

          // Update state and styles
          this.state.updateObject(obj.id, { 
            pageIndex: currentPageIndex,
            x: localX, 
            y: localY 
          });

          objEl.style.left = `${localX * zoom}px`;
          objEl.style.top = `${localY * zoom}px`;
        };

        const onPointerUp = (upEvent) => {
          try {
            objEl.releasePointerCapture(upEvent.pointerId);
          } catch (err) {}
          document.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('pointerup', onPointerUp);
          
          // Redraw original and final page objects to make sure they are perfectly synced
          this.drawPageObjects(pageIndex);
          if (currentPageIndex !== pageIndex) {
            this.drawPageObjects(currentPageIndex);
          }
        };

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
      });

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
