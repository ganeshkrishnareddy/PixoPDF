/**
 * PixoPDF History Manager (Undo / Redo stack)
 * Manages user modification actions with memory-safe change references.
 */

export class HistoryManager {
  /**
   * @param {Object} state EditorState instance reference
   * @param {Function} onStateRestored Callback when state restores during undo/redo
   */
  constructor(state, onStateRestored) {
    this.state = state;
    this.onStateRestored = onStateRestored;
    this.undoStack = [];
    this.redoStack = [];
    this.maxLimit = 80;
  }

  /**
   * Pushes a snapshot of the current objects array onto the undo stack.
   * Clears redo stack when a new action executes.
   */
  pushAction() {
    // Clone objects state cleanly
    const snapshot = JSON.parse(JSON.stringify(this.state.objects));
    
    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.maxLimit) {
      this.undoStack.shift(); // Remove oldest
    }
    
    this.redoStack = []; // Reset redo
    this.state.isDirty = true;
  }

  /**
   * Undo last change.
   */
  undo() {
    if (this.undoStack.length === 0) return;

    // Push current layout to redo
    const current = JSON.parse(JSON.stringify(this.state.objects));
    this.redoStack.push(current);

    // Pop target state
    const previous = this.undoStack.pop();
    this.state.objects = previous;
    this.state.clearSelection();

    if (this.onStateRestored) {
      this.onStateRestored();
    }
  }

  /**
   * Redo undone change.
   */
  redo() {
    if (this.redoStack.length === 0) return;

    // Push current layout to undo
    const current = JSON.parse(JSON.stringify(this.state.objects));
    this.undoStack.push(current);

    // Pop target state
    const next = this.redoStack.pop();
    this.state.objects = next;
    this.state.clearSelection();

    if (this.onStateRestored) {
      this.onStateRestored();
    }
  }
}
