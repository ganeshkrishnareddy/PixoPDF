/**
 * ZeroPDF Memory Manager
 * Handles browser garbage collection flags, canvas cleanup, and large buffers.
 */

export const MemoryManager = {
  /**
   * Resets canvas width and height to zero to force GC of rendering pipeline resources.
   * @param {HTMLCanvasElement} canvas 
   */
  deallocateCanvas(canvas) {
    if (!canvas) return;
    canvas.width = 0;
    canvas.height = 0;
  },

  /**
   * Clean up array buffers and arrays by resetting lengths and nullifying references.
   * @param {Array|Object} container 
   */
  wipeArrayBufferRefs(container) {
    if (Array.isArray(container)) {
      container.length = 0;
    }
  }
};
