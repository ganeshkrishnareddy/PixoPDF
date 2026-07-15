/**
 * PixoPDF Interactive Object Controller
 * Centralizes dragging, resizing, selection, keyboard controls, and page clamping.
 */
export class InteractiveObjectController {
  constructor(state, pageRenderer, options = {}) {
    this.state = state;
    this.pageRenderer = pageRenderer;
    this.options = {
      onObjectSelected: null,
      onObjectDoubleClicked: null,
      onObjectDeleted: null,
      ...options
    };

    this.activeId = null;
    this.initKeyboardControls();
  }

  select(objectId) {
    this.activeId = objectId;
    this.state.selection.objectId = objectId;
    
    if (this.options.onObjectSelected) {
      this.options.onObjectSelected(objectId);
    }
  }

  deselect() {
    this.activeId = null;
    this.state.clearSelection();
    this.pageRenderer.refreshAll();
  }

  initKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      if (!this.activeId) return;

      // Ignore if user is typing in a textarea or input field
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
        return;
      }

      const obj = this.state.objects.find(o => o.id === this.activeId);
      if (!obj) return;

      const pageView = this.pageRenderer.pageViews[obj.pageIndex];
      if (!pageView) return;

      const step = e.shiftKey ? 10 : 1;
      let moved = false;

      if (e.key === 'ArrowUp') {
        obj.y = Math.max(0, obj.y - step);
        moved = true;
      } else if (e.key === 'ArrowDown') {
        obj.y = Math.min(pageView.wrapper.offsetHeight / this.state.viewport.zoom - obj.height, obj.y + step);
        moved = true;
      } else if (e.key === 'ArrowLeft') {
        obj.x = Math.max(0, obj.x - step);
        moved = true;
      } else if (e.key === 'ArrowRight') {
        obj.x = Math.min(pageView.wrapper.offsetWidth / this.state.viewport.zoom - obj.width, obj.x + step);
        moved = true;
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        const deletedId = this.activeId;
        this.deselect();
        this.state.deleteObject(deletedId);
        if (this.options.onObjectDeleted) {
          this.options.onObjectDeleted(deletedId);
        }
        this.pageRenderer.refreshAll();
      } else if (e.key === 'Escape') {
        this.deselect();
      }

      if (moved) {
        e.preventDefault();
        this.state.updateObject(obj.id, { x: obj.x, y: obj.y });
        this.pageRenderer.drawPageObjects(obj.pageIndex);
      }
    });
  }

  /**
   * Binds pointer-based dragging and corner-resizing handlers to a target DOM element.
   */
  bindEvents(obj, objEl, pageIndex) {
    // 1. Double click to edit callback
    objEl.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      if (this.options.onObjectDoubleClicked) {
        this.options.onObjectDoubleClicked(obj.id);
      }
    });

    // 2. Select & Drag event handler
    objEl.addEventListener('pointerdown', (e) => {
      // If clicking resize handle, ignore general dragging
      if (e.target.classList.contains('resize-handle')) return;

      e.stopPropagation();
      this.select(obj.id);
      this.pageRenderer.refreshAll();

      const zoom = this.state.viewport.zoom;
      const rectStart = this.pageRenderer.pageViews[pageIndex].wrapper.getBoundingClientRect();
      const objLeft = rectStart.left + (obj.x * zoom);
      const objTop = rectStart.top + (obj.y * zoom);
      
      const offsetX = e.clientX - objLeft;
      const offsetY = e.clientY - objTop;

      let currentPageIndex = pageIndex;

      const onPointerMove = (moveEvent) => {
        const z = this.state.viewport.zoom;
        let targetPageIndex = currentPageIndex;
        let rect = this.pageRenderer.pageViews[currentPageIndex].wrapper.getBoundingClientRect();
        
        for (let i = 0; i < this.pageRenderer.pageViews.length; i++) {
          const pv = this.pageRenderer.pageViews[i];
          if (pv && pv.rendered) {
            const r = pv.wrapper.getBoundingClientRect();
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

        const targetObjLeft = moveEvent.clientX - offsetX;
        const targetObjTop = moveEvent.clientY - offsetY;
        
        let localX = (targetObjLeft - rect.left) / z;
        let localY = (targetObjTop - rect.top) / z;

        // Constraint boundaries clamping
        const maxW = rect.width / z;
        const maxH = rect.height / z;
        localX = Math.max(0, Math.min(localX, maxW - obj.width));
        localY = Math.max(0, Math.min(localY, maxH - obj.height));

        if (targetPageIndex !== currentPageIndex) {
          const targetView = this.pageRenderer.pageViews[targetPageIndex];
          if (targetView && targetView.rendered) {
            targetView.overlay.appendChild(objEl);
            currentPageIndex = targetPageIndex;
          }
        }

        this.state.updateObject(obj.id, { 
          pageIndex: currentPageIndex,
          x: localX, 
          y: localY 
        });

        objEl.style.left = `${localX * z}px`;
        objEl.style.top = `${localY * z}px`;
      };

      const onPointerUp = () => {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        this.pageRenderer.drawPageObjects(pageIndex);
        if (currentPageIndex !== pageIndex) {
          this.pageRenderer.drawPageObjects(currentPageIndex);
        }
      };

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    });

    // 3. Inject Selection border and Corner Resize Handles if selected
    if (this.state.selection.objectId === obj.id) {
      objEl.classList.add('ring-1', 'ring-indigo-600', 'border-indigo-600');
      
      const handles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      handles.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle absolute w-3 h-3 bg-white border border-indigo-650 rounded-sm z-10`;
        
        // Positioning styles
        if (pos === 'top-left') {
          handle.style.left = '-6px';
          handle.style.top = '-6px';
          handle.style.cursor = 'nwse-resize';
        } else if (pos === 'top-right') {
          handle.style.right = '-6px';
          handle.style.top = '-6px';
          handle.style.cursor = 'nesw-resize';
        } else if (pos === 'bottom-left') {
          handle.style.left = '-6px';
          handle.style.bottom = '-6px';
          handle.style.cursor = 'nesw-resize';
        } else if (pos === 'bottom-right') {
          handle.style.right = '-6px';
          handle.style.bottom = '-6px';
          handle.style.cursor = 'nwse-resize';
        }

        handle.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          e.preventDefault();

          const zoom = this.state.viewport.zoom;
          const startX = e.clientX;
          const startY = e.clientY;
          const startW = obj.width;
          const startH = obj.height;
          const startXPos = obj.x;
          const startYPos = obj.y;
          const aspectRatio = startW / startH;

          // Aspect ratio preservation toggling depending on object type
          const preserveRatio = (obj.type === 'signature' || obj.type === 'image');

          const onResizeMove = (moveEvent) => {
            const dx = (moveEvent.clientX - startX) / zoom;
            const dy = (moveEvent.clientY - startY) / zoom;

            let newW = startW;
            let newH = startH;
            let newX = startXPos;
            let newY = startYPos;

            if (pos === 'bottom-right') {
              newW = Math.max(20, startW + dx);
              newH = preserveRatio ? (newW / aspectRatio) : Math.max(20, startH + dy);
            } else if (pos === 'bottom-left') {
              newW = Math.max(20, startW - dx);
              newX = startXPos + (startW - newW);
              newH = preserveRatio ? (newW / aspectRatio) : Math.max(20, startH + dy);
            } else if (pos === 'top-right') {
              newW = Math.max(20, startW + dx);
              newH = preserveRatio ? (newW / aspectRatio) : Math.max(20, startH - dy);
              newY = startYPos + (startH - newH);
            } else if (pos === 'top-left') {
              newW = Math.max(20, startW - dx);
              newX = startXPos + (startW - newW);
              newH = preserveRatio ? (newW / aspectRatio) : Math.max(20, startH - dy);
              newY = startYPos + (startH - newH);
            }

            // Clamping boundaries to stay inside the current page
            const rect = this.pageRenderer.pageViews[pageIndex].wrapper.getBoundingClientRect();
            const maxPageW = rect.width / zoom;
            const maxPageH = rect.height / zoom;

            newW = Math.min(newW, maxPageW - newX);
            newH = Math.min(newH, maxPageH - newY);

            this.state.updateObject(obj.id, {
              x: newX,
              y: newY,
              width: newW,
              height: newH
            });

            objEl.style.left = `${newX * zoom}px`;
            objEl.style.top = `${newY * zoom}px`;
            objEl.style.width = `${newW * zoom}px`;
            objEl.style.height = `${newH * zoom}px`;
          };

          const onResizeUp = () => {
            document.removeEventListener('pointermove', onResizeMove);
            document.removeEventListener('pointerup', onResizeUp);
            this.pageRenderer.drawPageObjects(pageIndex);
          };

          document.addEventListener('pointermove', onResizeMove);
          document.addEventListener('pointerup', onResizeUp);
        });

        objEl.appendChild(handle);
      });
    } else {
      objEl.classList.remove('ring-1', 'ring-indigo-600', 'border-indigo-600');
    }
  }
}
