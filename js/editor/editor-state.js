/**
 * PixoPDF Editor State Manager
 * Centralizes editor state variables and provides safe state mutations.
 */

export class EditorState {
  constructor() {
    this.reset();
  }

  reset() {
    this.document = {
      pageCount: 0,
      currentPage: 1
    };
    this.viewport = {
      zoom: 1.0 // Multiplier (0.5, 0.75, 1.0, 1.25, 1.5, 2.0)
    };
    this.objects = []; // Array of editor objects: { id, type, pageIndex, x, y, width, height, rotation, properties }
    this.selection = {
      objectId: null
    };
    this.isDirty = false;
  }

  /**
   * Appends a new editable object to the active registry.
   * @param {Object} obj Configuration parameters of target object
   */
  addObject(obj) {
    const newObj = {
      id: obj.id || `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: obj.type,
      pageIndex: obj.pageIndex,
      x: obj.x,
      y: obj.y,
      width: obj.width || 100,
      height: obj.height || 30,
      rotation: obj.rotation || 0,
      properties: JSON.parse(JSON.stringify(obj.properties || {})) // Deep clone properties
    };
    this.objects.push(newObj);
    this.selection.objectId = newObj.id;
    this.isDirty = true;
    return newObj;
  }

  /**
   * Safely duplicates an existing object, ensuring unique IDs and clean memory reference copies.
   * @param {string} objectId target object to clone
   */
  duplicateObject(objectId) {
    const index = this.objects.findIndex(o => o.id === objectId);
    if (index === -1) return null;

    const source = this.objects[index];
    const clone = {
      ...source,
      id: `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      // Offset position slightly to distinguish from original visually
      x: source.x + 20,
      y: source.y + 20,
      properties: JSON.parse(JSON.stringify(source.properties)) // Secure deep copy
    };
    
    this.objects.push(clone);
    this.selection.objectId = clone.id;
    this.isDirty = true;
    return clone;
  }

  /**
   * Updates coordinates or attributes of a target object.
   * @param {string} objectId 
   * @param {Object} updates Properties dictionary
   */
  updateObject(objectId, updates) {
    const obj = this.objects.find(o => o.id === objectId);
    if (!obj) return;

    if (updates.x !== undefined) obj.x = updates.x;
    if (updates.y !== undefined) obj.y = updates.y;
    if (updates.width !== undefined) obj.width = updates.width;
    if (updates.height !== undefined) obj.height = updates.height;
    if (updates.rotation !== undefined) obj.rotation = updates.rotation;
    if (updates.properties !== undefined) {
      obj.properties = { ...obj.properties, ...updates.properties };
    }
    this.isDirty = true;
  }

  /**
   * Removes an object from the registry.
   * @param {string} objectId 
   */
  deleteObject(objectId) {
    this.objects = this.objects.filter(o => o.id !== objectId);
    if (this.selection.objectId === objectId) {
      this.selection.objectId = null;
    }
    this.isDirty = true;
  }

  clearSelection() {
    this.selection.objectId = null;
  }
}
