import {
  Base_default,
  EventType_default as EventType_default2,
  Event_default as Event_default2,
  Layer_default,
  NO_COLOR,
  asArray,
  asString,
  fromString,
  inView,
  lchaToRgba,
  normalize,
  rgbaToLcha,
  toString,
  withAlpha
} from "./chunk-2HOHXSLZ.js";
import {
  Polygon_default,
  ViewHint_default,
  View_default,
  disable
} from "./chunk-4C7RPFE6.js";
import {
  DEVICE_PIXEL_RATIO,
  FIREFOX,
  ImageState_default,
  MAC,
  PASSIVE_EVENT_LISTENERS,
  TileState_default,
  WEBKIT,
  createCanvasContext2D,
  decodeFallback,
  getSharedCanvasContext2D,
  hasArea,
  removeChildren,
  replaceChildren,
  replaceNode,
  toSize
} from "./chunk-3LEBAORA.js";
import {
  Disposable_default,
  EventType_default,
  Event_default,
  FALSE,
  ObjectEventType_default,
  Object_default,
  TRUE,
  Target_default,
  VOID,
  abstract,
  apply,
  ascending,
  assert,
  compose,
  create,
  easeOut,
  equals,
  getUid,
  linear,
  listen,
  makeInverse,
  toPromise,
  unlistenByKey
} from "./chunk-PO7IASFD.js";
import {
  clamp,
  clear,
  clone,
  createOrUpdateEmpty,
  equals as equals2,
  fromUserCoordinate,
  getForViewAndSize,
  getIntersection,
  getWidth,
  isEmpty,
  isEmpty2,
  rotate,
  scale,
  toUserCoordinate,
  warn,
  wrapX
} from "./chunk-XQ7KMS6H.js";
import {
  __async
} from "./chunk-WDMUDEB6.js";

// node_modules/ol/CollectionEventType.js
var CollectionEventType_default = {
  /**
   * Triggered when an item is added to the collection.
   * @event module:ol/Collection.CollectionEvent#add
   * @api
   */
  ADD: "add",
  /**
   * Triggered when an item is removed from the collection.
   * @event module:ol/Collection.CollectionEvent#remove
   * @api
   */
  REMOVE: "remove"
};

// node_modules/ol/Collection.js
var Property = {
  LENGTH: "length"
};
var CollectionEvent = class extends Event_default {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(type, element, index) {
    super(type);
    this.element = element;
    this.index = index;
  }
};
var Collection = class extends Object_default {
  /**
   * @param {Array<T>} [array] Array.
   * @param {Options} [options] Collection options.
   */
  constructor(array, options) {
    super();
    this.on;
    this.once;
    this.un;
    options = options || {};
    this.unique_ = !!options.unique;
    this.array_ = array ? array : [];
    if (this.unique_) {
      for (let i = 0, ii = this.array_.length; i < ii; ++i) {
        this.assertUnique_(this.array_[i], i);
      }
    }
    this.updateLength_();
  }
  /**
   * Remove all elements from the collection.
   * @api
   */
  clear() {
    while (this.getLength() > 0) {
      this.pop();
    }
  }
  /**
   * Add elements to the collection.  This pushes each item in the provided array
   * to the end of the collection.
   * @param {!Array<T>} arr Array.
   * @return {Collection<T>} This collection.
   * @api
   */
  extend(arr) {
    for (let i = 0, ii = arr.length; i < ii; ++i) {
      this.push(arr[i]);
    }
    return this;
  }
  /**
   * Iterate over each element, calling the provided callback.
   * @param {function(T, number, Array<T>): *} f The function to call
   *     for every element. This function takes 3 arguments (the element, the
   *     index and the array). The return value is ignored.
   * @api
   */
  forEach(f) {
    const array = this.array_;
    for (let i = 0, ii = array.length; i < ii; ++i) {
      f(array[i], i, array);
    }
  }
  /**
   * Get a reference to the underlying Array object. Warning: if the array
   * is mutated, no events will be dispatched by the collection, and the
   * collection's "length" property won't be in sync with the actual length
   * of the array.
   * @return {!Array<T>} Array.
   * @api
   */
  getArray() {
    return this.array_;
  }
  /**
   * Get the element at the provided index.
   * @param {number} index Index.
   * @return {T} Element.
   * @api
   */
  item(index) {
    return this.array_[index];
  }
  /**
   * Get the length of this collection.
   * @return {number} The length of the array.
   * @observable
   * @api
   */
  getLength() {
    return this.get(Property.LENGTH);
  }
  /**
   * Insert an element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  insertAt(index, elem) {
    if (index < 0 || index > this.getLength()) {
      throw new Error("Index out of bounds: " + index);
    }
    if (this.unique_) {
      this.assertUnique_(elem);
    }
    this.array_.splice(index, 0, elem);
    this.updateLength_();
    this.dispatchEvent(new CollectionEvent(CollectionEventType_default.ADD, elem, index));
  }
  /**
   * Remove the last element of the collection and return it.
   * Return `undefined` if the collection is empty.
   * @return {T|undefined} Element.
   * @api
   */
  pop() {
    return this.removeAt(this.getLength() - 1);
  }
  /**
   * Insert the provided element at the end of the collection.
   * @param {T} elem Element.
   * @return {number} New length of the collection.
   * @api
   */
  push(elem) {
    if (this.unique_) {
      this.assertUnique_(elem);
    }
    const n = this.getLength();
    this.insertAt(n, elem);
    return this.getLength();
  }
  /**
   * Remove the first occurrence of an element from the collection.
   * @param {T} elem Element.
   * @return {T|undefined} The removed element or undefined if none found.
   * @api
   */
  remove(elem) {
    const arr = this.array_;
    for (let i = 0, ii = arr.length; i < ii; ++i) {
      if (arr[i] === elem) {
        return this.removeAt(i);
      }
    }
    return void 0;
  }
  /**
   * Remove the element at the provided index and return it.
   * Return `undefined` if the collection does not contain this index.
   * @param {number} index Index.
   * @return {T|undefined} Value.
   * @api
   */
  removeAt(index) {
    if (index < 0 || index >= this.getLength()) {
      return void 0;
    }
    const prev = this.array_[index];
    this.array_.splice(index, 1);
    this.updateLength_();
    this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new CollectionEvent(CollectionEventType_default.REMOVE, prev, index)
    );
    return prev;
  }
  /**
   * Set the element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  setAt(index, elem) {
    const n = this.getLength();
    if (index >= n) {
      this.insertAt(index, elem);
      return;
    }
    if (index < 0) {
      throw new Error("Index out of bounds: " + index);
    }
    if (this.unique_) {
      this.assertUnique_(elem, index);
    }
    const prev = this.array_[index];
    this.array_[index] = elem;
    this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new CollectionEvent(CollectionEventType_default.REMOVE, prev, index)
    );
    this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new CollectionEvent(CollectionEventType_default.ADD, elem, index)
    );
  }
  /**
   * @private
   */
  updateLength_() {
    this.set(Property.LENGTH, this.array_.length);
  }
  /**
   * @private
   * @param {T} elem Element.
   * @param {number} [except] Optional index to ignore.
   */
  assertUnique_(elem, except) {
    for (let i = 0, ii = this.array_.length; i < ii; ++i) {
      if (this.array_[i] === elem && i !== except) {
        throw new Error("Duplicate item added to a unique collection");
      }
    }
  }
};
var Collection_default = Collection;

// node_modules/quickselect/index.js
function quickselect(arr, k, left = 0, right = arr.length - 1, compare = defaultCompare) {
  while (right > left) {
    if (right - left > 600) {
      const n = right - left + 1;
      const m = k - left + 1;
      const z = Math.log(n);
      const s = 0.5 * Math.exp(2 * z / 3);
      const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
      const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
      const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
      quickselect(arr, k, newLeft, newRight, compare);
    }
    const t = arr[k];
    let i = left;
    let j = right;
    swap(arr, left, k);
    if (compare(arr[right], t) > 0) swap(arr, left, right);
    while (i < j) {
      swap(arr, i, j);
      i++;
      j--;
      while (compare(arr[i], t) < 0) i++;
      while (compare(arr[j], t) > 0) j--;
    }
    if (compare(arr[left], t) === 0) swap(arr, left, j);
    else {
      j++;
      swap(arr, j, right);
    }
    if (j <= k) left = j + 1;
    if (k <= j) right = j - 1;
  }
}
function swap(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}
function defaultCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

// node_modules/rbush/index.js
var RBush = class {
  constructor(maxEntries = 9) {
    this._maxEntries = Math.max(4, maxEntries);
    this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));
    this.clear();
  }
  all() {
    return this._all(this.data, []);
  }
  search(bbox) {
    let node = this.data;
    const result = [];
    if (!intersects(bbox, node)) return result;
    const toBBox = this.toBBox;
    const nodesToSearch = [];
    while (node) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const childBBox = node.leaf ? toBBox(child) : child;
        if (intersects(bbox, childBBox)) {
          if (node.leaf) result.push(child);
          else if (contains(bbox, childBBox)) this._all(child, result);
          else nodesToSearch.push(child);
        }
      }
      node = nodesToSearch.pop();
    }
    return result;
  }
  collides(bbox) {
    let node = this.data;
    if (!intersects(bbox, node)) return false;
    const nodesToSearch = [];
    while (node) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const childBBox = node.leaf ? this.toBBox(child) : child;
        if (intersects(bbox, childBBox)) {
          if (node.leaf || contains(bbox, childBBox)) return true;
          nodesToSearch.push(child);
        }
      }
      node = nodesToSearch.pop();
    }
    return false;
  }
  load(data) {
    if (!(data && data.length)) return this;
    if (data.length < this._minEntries) {
      for (let i = 0; i < data.length; i++) {
        this.insert(data[i]);
      }
      return this;
    }
    let node = this._build(data.slice(), 0, data.length - 1, 0);
    if (!this.data.children.length) {
      this.data = node;
    } else if (this.data.height === node.height) {
      this._splitRoot(this.data, node);
    } else {
      if (this.data.height < node.height) {
        const tmpNode = this.data;
        this.data = node;
        node = tmpNode;
      }
      this._insert(node, this.data.height - node.height - 1, true);
    }
    return this;
  }
  insert(item) {
    if (item) this._insert(item, this.data.height - 1);
    return this;
  }
  clear() {
    this.data = createNode([]);
    return this;
  }
  remove(item, equalsFn) {
    if (!item) return this;
    let node = this.data;
    const bbox = this.toBBox(item);
    const path = [];
    const indexes = [];
    let i, parent, goingUp;
    while (node || path.length) {
      if (!node) {
        node = path.pop();
        parent = path[path.length - 1];
        i = indexes.pop();
        goingUp = true;
      }
      if (node.leaf) {
        const index = findItem(item, node.children, equalsFn);
        if (index !== -1) {
          node.children.splice(index, 1);
          path.push(node);
          this._condense(path);
          return this;
        }
      }
      if (!goingUp && !node.leaf && contains(node, bbox)) {
        path.push(node);
        indexes.push(i);
        i = 0;
        parent = node;
        node = node.children[0];
      } else if (parent) {
        i++;
        node = parent.children[i];
        goingUp = false;
      } else node = null;
    }
    return this;
  }
  toBBox(item) {
    return item;
  }
  compareMinX(a, b) {
    return a.minX - b.minX;
  }
  compareMinY(a, b) {
    return a.minY - b.minY;
  }
  toJSON() {
    return this.data;
  }
  fromJSON(data) {
    this.data = data;
    return this;
  }
  _all(node, result) {
    const nodesToSearch = [];
    while (node) {
      if (node.leaf) result.push(...node.children);
      else nodesToSearch.push(...node.children);
      node = nodesToSearch.pop();
    }
    return result;
  }
  _build(items, left, right, height) {
    const N = right - left + 1;
    let M = this._maxEntries;
    let node;
    if (N <= M) {
      node = createNode(items.slice(left, right + 1));
      calcBBox(node, this.toBBox);
      return node;
    }
    if (!height) {
      height = Math.ceil(Math.log(N) / Math.log(M));
      M = Math.ceil(N / Math.pow(M, height - 1));
    }
    node = createNode([]);
    node.leaf = false;
    node.height = height;
    const N2 = Math.ceil(N / M);
    const N1 = N2 * Math.ceil(Math.sqrt(M));
    multiSelect(items, left, right, N1, this.compareMinX);
    for (let i = left; i <= right; i += N1) {
      const right2 = Math.min(i + N1 - 1, right);
      multiSelect(items, i, right2, N2, this.compareMinY);
      for (let j = i; j <= right2; j += N2) {
        const right3 = Math.min(j + N2 - 1, right2);
        node.children.push(this._build(items, j, right3, height - 1));
      }
    }
    calcBBox(node, this.toBBox);
    return node;
  }
  _chooseSubtree(bbox, node, level, path) {
    while (true) {
      path.push(node);
      if (node.leaf || path.length - 1 === level) break;
      let minArea = Infinity;
      let minEnlargement = Infinity;
      let targetNode;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const area = bboxArea(child);
        const enlargement = enlargedArea(bbox, child) - area;
        if (enlargement < minEnlargement) {
          minEnlargement = enlargement;
          minArea = area < minArea ? area : minArea;
          targetNode = child;
        } else if (enlargement === minEnlargement) {
          if (area < minArea) {
            minArea = area;
            targetNode = child;
          }
        }
      }
      node = targetNode || node.children[0];
    }
    return node;
  }
  _insert(item, level, isNode) {
    const bbox = isNode ? item : this.toBBox(item);
    const insertPath = [];
    const node = this._chooseSubtree(bbox, this.data, level, insertPath);
    node.children.push(item);
    extend(node, bbox);
    while (level >= 0) {
      if (insertPath[level].children.length > this._maxEntries) {
        this._split(insertPath, level);
        level--;
      } else break;
    }
    this._adjustParentBBoxes(bbox, insertPath, level);
  }
  // split overflowed node into two
  _split(insertPath, level) {
    const node = insertPath[level];
    const M = node.children.length;
    const m = this._minEntries;
    this._chooseSplitAxis(node, m, M);
    const splitIndex = this._chooseSplitIndex(node, m, M);
    const newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
    newNode.height = node.height;
    newNode.leaf = node.leaf;
    calcBBox(node, this.toBBox);
    calcBBox(newNode, this.toBBox);
    if (level) insertPath[level - 1].children.push(newNode);
    else this._splitRoot(node, newNode);
  }
  _splitRoot(node, newNode) {
    this.data = createNode([node, newNode]);
    this.data.height = node.height + 1;
    this.data.leaf = false;
    calcBBox(this.data, this.toBBox);
  }
  _chooseSplitIndex(node, m, M) {
    let index;
    let minOverlap = Infinity;
    let minArea = Infinity;
    for (let i = m; i <= M - m; i++) {
      const bbox1 = distBBox(node, 0, i, this.toBBox);
      const bbox2 = distBBox(node, i, M, this.toBBox);
      const overlap = intersectionArea(bbox1, bbox2);
      const area = bboxArea(bbox1) + bboxArea(bbox2);
      if (overlap < minOverlap) {
        minOverlap = overlap;
        index = i;
        minArea = area < minArea ? area : minArea;
      } else if (overlap === minOverlap) {
        if (area < minArea) {
          minArea = area;
          index = i;
        }
      }
    }
    return index || M - m;
  }
  // sorts node children by the best axis for split
  _chooseSplitAxis(node, m, M) {
    const compareMinX = node.leaf ? this.compareMinX : compareNodeMinX;
    const compareMinY = node.leaf ? this.compareMinY : compareNodeMinY;
    const xMargin = this._allDistMargin(node, m, M, compareMinX);
    const yMargin = this._allDistMargin(node, m, M, compareMinY);
    if (xMargin < yMargin) node.children.sort(compareMinX);
  }
  // total margin of all possible split distributions where each node is at least m full
  _allDistMargin(node, m, M, compare) {
    node.children.sort(compare);
    const toBBox = this.toBBox;
    const leftBBox = distBBox(node, 0, m, toBBox);
    const rightBBox = distBBox(node, M - m, M, toBBox);
    let margin = bboxMargin(leftBBox) + bboxMargin(rightBBox);
    for (let i = m; i < M - m; i++) {
      const child = node.children[i];
      extend(leftBBox, node.leaf ? toBBox(child) : child);
      margin += bboxMargin(leftBBox);
    }
    for (let i = M - m - 1; i >= m; i--) {
      const child = node.children[i];
      extend(rightBBox, node.leaf ? toBBox(child) : child);
      margin += bboxMargin(rightBBox);
    }
    return margin;
  }
  _adjustParentBBoxes(bbox, path, level) {
    for (let i = level; i >= 0; i--) {
      extend(path[i], bbox);
    }
  }
  _condense(path) {
    for (let i = path.length - 1, siblings; i >= 0; i--) {
      if (path[i].children.length === 0) {
        if (i > 0) {
          siblings = path[i - 1].children;
          siblings.splice(siblings.indexOf(path[i]), 1);
        } else this.clear();
      } else calcBBox(path[i], this.toBBox);
    }
  }
};
function findItem(item, items, equalsFn) {
  if (!equalsFn) return items.indexOf(item);
  for (let i = 0; i < items.length; i++) {
    if (equalsFn(item, items[i])) return i;
  }
  return -1;
}
function calcBBox(node, toBBox) {
  distBBox(node, 0, node.children.length, toBBox, node);
}
function distBBox(node, k, p, toBBox, destNode) {
  if (!destNode) destNode = createNode(null);
  destNode.minX = Infinity;
  destNode.minY = Infinity;
  destNode.maxX = -Infinity;
  destNode.maxY = -Infinity;
  for (let i = k; i < p; i++) {
    const child = node.children[i];
    extend(destNode, node.leaf ? toBBox(child) : child);
  }
  return destNode;
}
function extend(a, b) {
  a.minX = Math.min(a.minX, b.minX);
  a.minY = Math.min(a.minY, b.minY);
  a.maxX = Math.max(a.maxX, b.maxX);
  a.maxY = Math.max(a.maxY, b.maxY);
  return a;
}
function compareNodeMinX(a, b) {
  return a.minX - b.minX;
}
function compareNodeMinY(a, b) {
  return a.minY - b.minY;
}
function bboxArea(a) {
  return (a.maxX - a.minX) * (a.maxY - a.minY);
}
function bboxMargin(a) {
  return a.maxX - a.minX + (a.maxY - a.minY);
}
function enlargedArea(a, b) {
  return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) * (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
}
function intersectionArea(a, b) {
  const minX = Math.max(a.minX, b.minX);
  const minY = Math.max(a.minY, b.minY);
  const maxX = Math.min(a.maxX, b.maxX);
  const maxY = Math.min(a.maxY, b.maxY);
  return Math.max(0, maxX - minX) * Math.max(0, maxY - minY);
}
function contains(a, b) {
  return a.minX <= b.minX && a.minY <= b.minY && b.maxX <= a.maxX && b.maxY <= a.maxY;
}
function intersects(a, b) {
  return b.minX <= a.maxX && b.minY <= a.maxY && b.maxX >= a.minX && b.maxY >= a.minY;
}
function createNode(children) {
  return {
    children,
    height: 1,
    leaf: true,
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  };
}
function multiSelect(arr, left, right, n, compare) {
  const stack = [left, right];
  while (stack.length) {
    right = stack.pop();
    left = stack.pop();
    if (right - left <= n) continue;
    const mid = left + Math.ceil((right - left) / n / 2) * n;
    quickselect(arr, mid, left, right, compare);
    stack.push(left, mid, mid, right);
  }
}

// node_modules/ol/style/IconImageCache.js
var IconImageCache = class {
  constructor() {
    this.cache_ = {};
    this.patternCache_ = {};
    this.cacheSize_ = 0;
    this.maxCacheSize_ = 1024;
  }
  /**
   * FIXME empty description for jsdoc
   */
  clear() {
    this.cache_ = {};
    this.patternCache_ = {};
    this.cacheSize_ = 0;
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    return this.cacheSize_ > this.maxCacheSize_;
  }
  /**
   * FIXME empty description for jsdoc
   */
  expire() {
    if (this.canExpireCache()) {
      let i = 0;
      for (const key in this.cache_) {
        const iconImage = this.cache_[key];
        if ((i++ & 3) === 0 && !iconImage.hasListener()) {
          delete this.cache_[key];
          delete this.patternCache_[key];
          --this.cacheSize_;
        }
      }
    }
  }
  /**
   * @param {string} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../color.js").Color|string|null} color Color.
   * @return {import("./IconImage.js").default} Icon image.
   */
  get(src, crossOrigin, color) {
    const key = getCacheKey(src, crossOrigin, color);
    return key in this.cache_ ? this.cache_[key] : null;
  }
  /**
   * @param {string} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../color.js").Color|string|null} color Color.
   * @return {CanvasPattern} Icon image.
   */
  getPattern(src, crossOrigin, color) {
    const key = getCacheKey(src, crossOrigin, color);
    return key in this.patternCache_ ? this.patternCache_[key] : null;
  }
  /**
   * @param {string} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../color.js").Color|string|null} color Color.
   * @param {import("./IconImage.js").default|null} iconImage Icon image.
   * @param {boolean} [pattern] Also cache a `'repeat'` pattern with this `iconImage`.
   */
  set(src, crossOrigin, color, iconImage, pattern) {
    const key = getCacheKey(src, crossOrigin, color);
    const update = key in this.cache_;
    this.cache_[key] = iconImage;
    if (pattern) {
      if (iconImage.getImageState() === ImageState_default.IDLE) {
        iconImage.load();
      }
      if (iconImage.getImageState() === ImageState_default.LOADING) {
        iconImage.ready().then(() => {
          this.patternCache_[key] = getSharedCanvasContext2D().createPattern(iconImage.getImage(1), "repeat");
        });
      } else {
        this.patternCache_[key] = getSharedCanvasContext2D().createPattern(iconImage.getImage(1), "repeat");
      }
    }
    if (!update) {
      ++this.cacheSize_;
    }
  }
  /**
   * Set the cache size of the icon cache. Default is `1024`. Change this value when
   * your map uses more than 1024 different icon images and you are not caching icon
   * styles on the application level.
   * @param {number} maxCacheSize Cache max size.
   * @api
   */
  setSize(maxCacheSize) {
    this.maxCacheSize_ = maxCacheSize;
    this.expire();
  }
};
function getCacheKey(src, crossOrigin, color) {
  const colorString = color ? asArray(color) : "null";
  return crossOrigin + ":" + src + ":" + colorString;
}
var shared = new IconImageCache();

// node_modules/ol/style/IconImage.js
var taintedTestContext = null;
var IconImage = class extends Target_default {
  /**
   * @param {HTMLImageElement|HTMLCanvasElement|ImageBitmap|null} image Image.
   * @param {string|undefined} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../ImageState.js").default|undefined} imageState Image state.
   * @param {import("../color.js").Color|string|null} color Color.
   */
  constructor(image, src, crossOrigin, imageState, color) {
    super();
    this.hitDetectionImage_ = null;
    this.image_ = image;
    this.crossOrigin_ = crossOrigin;
    this.canvas_ = {};
    this.color_ = color;
    this.imageState_ = imageState === void 0 ? ImageState_default.IDLE : imageState;
    this.size_ = image && image.width && image.height ? [image.width, image.height] : null;
    this.src_ = src;
    this.tainted_;
    this.ready_ = null;
  }
  /**
   * @private
   */
  initializeImage_() {
    this.image_ = new Image();
    if (this.crossOrigin_ !== null) {
      this.image_.crossOrigin = this.crossOrigin_;
    }
  }
  /**
   * @private
   * @return {boolean} The image canvas is tainted.
   */
  isTainted_() {
    if (this.tainted_ === void 0 && this.imageState_ === ImageState_default.LOADED) {
      if (!taintedTestContext) {
        taintedTestContext = createCanvasContext2D(1, 1, void 0, {
          willReadFrequently: true
        });
      }
      taintedTestContext.drawImage(this.image_, 0, 0);
      try {
        taintedTestContext.getImageData(0, 0, 1, 1);
        this.tainted_ = false;
      } catch (e) {
        taintedTestContext = null;
        this.tainted_ = true;
      }
    }
    return this.tainted_ === true;
  }
  /**
   * @private
   */
  dispatchChangeEvent_() {
    this.dispatchEvent(EventType_default.CHANGE);
  }
  /**
   * @private
   */
  handleImageError_() {
    this.imageState_ = ImageState_default.ERROR;
    this.dispatchChangeEvent_();
  }
  /**
   * @private
   */
  handleImageLoad_() {
    this.imageState_ = ImageState_default.LOADED;
    this.size_ = [this.image_.width, this.image_.height];
    this.dispatchChangeEvent_();
  }
  /**
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLImageElement|HTMLCanvasElement|ImageBitmap} Image or Canvas element or image bitmap.
   */
  getImage(pixelRatio) {
    if (!this.image_) {
      this.initializeImage_();
    }
    this.replaceColor_(pixelRatio);
    return this.canvas_[pixelRatio] ? this.canvas_[pixelRatio] : this.image_;
  }
  /**
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Image or Canvas element.
   */
  getPixelRatio(pixelRatio) {
    this.replaceColor_(pixelRatio);
    return this.canvas_[pixelRatio] ? pixelRatio : 1;
  }
  /**
   * @return {import("../ImageState.js").default} Image state.
   */
  getImageState() {
    return this.imageState_;
  }
  /**
   * @return {HTMLImageElement|HTMLCanvasElement|ImageBitmap} Image element.
   */
  getHitDetectionImage() {
    if (!this.image_) {
      this.initializeImage_();
    }
    if (!this.hitDetectionImage_) {
      if (this.isTainted_()) {
        const width = this.size_[0];
        const height = this.size_[1];
        const context = createCanvasContext2D(width, height);
        context.fillRect(0, 0, width, height);
        this.hitDetectionImage_ = context.canvas;
      } else {
        this.hitDetectionImage_ = this.image_;
      }
    }
    return this.hitDetectionImage_;
  }
  /**
   * Get the size of the icon (in pixels).
   * @return {import("../size.js").Size} Image size.
   */
  getSize() {
    return this.size_;
  }
  /**
   * @return {string|undefined} Image src.
   */
  getSrc() {
    return this.src_;
  }
  /**
   * Load not yet loaded URI.
   */
  load() {
    if (this.imageState_ !== ImageState_default.IDLE) {
      return;
    }
    if (!this.image_) {
      this.initializeImage_();
    }
    this.imageState_ = ImageState_default.LOADING;
    try {
      if (this.src_ !== void 0) {
        this.image_.src = this.src_;
      }
    } catch (e) {
      this.handleImageError_();
    }
    if (this.image_ instanceof HTMLImageElement) {
      decodeFallback(this.image_, this.src_).then((image) => {
        this.image_ = image;
        this.handleImageLoad_();
      }).catch(this.handleImageError_.bind(this));
    }
  }
  /**
   * @param {number} pixelRatio Pixel ratio.
   * @private
   */
  replaceColor_(pixelRatio) {
    if (!this.color_ || this.canvas_[pixelRatio] || this.imageState_ !== ImageState_default.LOADED) {
      return;
    }
    const image = this.image_;
    const ctx = createCanvasContext2D(Math.ceil(image.width * pixelRatio), Math.ceil(image.height * pixelRatio));
    const canvas = ctx.canvas;
    ctx.scale(pixelRatio, pixelRatio);
    ctx.drawImage(image, 0, 0);
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = asString(this.color_);
    ctx.fillRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(image, 0, 0);
    this.canvas_[pixelRatio] = canvas;
  }
  /**
   * @return {Promise<void>} Promise that resolves when the image is loaded.
   */
  ready() {
    if (!this.ready_) {
      this.ready_ = new Promise((resolve) => {
        if (this.imageState_ === ImageState_default.LOADED || this.imageState_ === ImageState_default.ERROR) {
          resolve();
        } else {
          const onChange = () => {
            if (this.imageState_ === ImageState_default.LOADED || this.imageState_ === ImageState_default.ERROR) {
              this.removeEventListener(EventType_default.CHANGE, onChange);
              resolve();
            }
          };
          this.addEventListener(EventType_default.CHANGE, onChange);
        }
      });
    }
    return this.ready_;
  }
};
function get(image, cacheKey, crossOrigin, imageState, color, pattern) {
  let iconImage = cacheKey === void 0 ? void 0 : shared.get(cacheKey, crossOrigin, color);
  if (!iconImage) {
    iconImage = new IconImage(image, image && "src" in image ? image.src || void 0 : cacheKey, crossOrigin, imageState, color);
    shared.set(cacheKey, crossOrigin, color, iconImage, pattern);
  }
  if (pattern && iconImage && !shared.getPattern(cacheKey, crossOrigin, color)) {
    shared.set(cacheKey, crossOrigin, color, iconImage, pattern);
  }
  return iconImage;
}
var IconImage_default = IconImage;

// node_modules/ol/style/Image.js
var ImageStyle = class _ImageStyle {
  /**
   * @param {Options} options Options.
   */
  constructor(options) {
    this.opacity_ = options.opacity;
    this.rotateWithView_ = options.rotateWithView;
    this.rotation_ = options.rotation;
    this.scale_ = options.scale;
    this.scaleArray_ = toSize(options.scale);
    this.displacement_ = options.displacement;
    this.declutterMode_ = options.declutterMode;
  }
  /**
   * Clones the style.
   * @return {ImageStyle} The cloned style.
   * @api
   */
  clone() {
    const scale2 = this.getScale();
    return new _ImageStyle({
      opacity: this.getOpacity(),
      scale: Array.isArray(scale2) ? scale2.slice() : scale2,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
  }
  /**
   * Get the symbolizer opacity.
   * @return {number} Opacity.
   * @api
   */
  getOpacity() {
    return this.opacity_;
  }
  /**
   * Determine whether the symbolizer rotates with the map.
   * @return {boolean} Rotate with map.
   * @api
   */
  getRotateWithView() {
    return this.rotateWithView_;
  }
  /**
   * Get the symoblizer rotation.
   * @return {number} Rotation.
   * @api
   */
  getRotation() {
    return this.rotation_;
  }
  /**
   * Get the symbolizer scale.
   * @return {number|import("../size.js").Size} Scale.
   * @api
   */
  getScale() {
    return this.scale_;
  }
  /**
   * Get the symbolizer scale array.
   * @return {import("../size.js").Size} Scale array.
   */
  getScaleArray() {
    return this.scaleArray_;
  }
  /**
   * Get the displacement of the shape
   * @return {Array<number>} Shape's center displacement
   * @api
   */
  getDisplacement() {
    return this.displacement_;
  }
  /**
   * Get the declutter mode of the shape
   * @return {import("./Style.js").DeclutterMode} Shape's declutter mode
   * @api
   */
  getDeclutterMode() {
    return this.declutterMode_;
  }
  /**
   * Get the anchor point in pixels. The anchor determines the center point for the
   * symbolizer.
   * @abstract
   * @return {Array<number>} Anchor.
   */
  getAnchor() {
    return abstract();
  }
  /**
   * Get the image element for the symbolizer.
   * @abstract
   * @param {number} pixelRatio Pixel ratio.
   * @return {import('../DataTile.js').ImageLike} Image element.
   */
  getImage(pixelRatio) {
    return abstract();
  }
  /**
   * @abstract
   * @return {import('../DataTile.js').ImageLike} Image element.
   */
  getHitDetectionImage() {
    return abstract();
  }
  /**
   * Get the image pixel ratio.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Pixel ratio.
   */
  getPixelRatio(pixelRatio) {
    return 1;
  }
  /**
   * @abstract
   * @return {import("../ImageState.js").default} Image state.
   */
  getImageState() {
    return abstract();
  }
  /**
   * @abstract
   * @return {import("../size.js").Size} Image size.
   */
  getImageSize() {
    return abstract();
  }
  /**
   * Get the origin of the symbolizer.
   * @abstract
   * @return {Array<number>} Origin.
   */
  getOrigin() {
    return abstract();
  }
  /**
   * Get the size of the symbolizer (in pixels).
   * @abstract
   * @return {import("../size.js").Size} Size.
   */
  getSize() {
    return abstract();
  }
  /**
   * Set the displacement.
   *
   * @param {Array<number>} displacement Displacement.
   * @api
   */
  setDisplacement(displacement) {
    this.displacement_ = displacement;
  }
  /**
   * Set the opacity.
   *
   * @param {number} opacity Opacity.
   * @api
   */
  setOpacity(opacity) {
    this.opacity_ = opacity;
  }
  /**
   * Set whether to rotate the style with the view.
   *
   * @param {boolean} rotateWithView Rotate with map.
   * @api
   */
  setRotateWithView(rotateWithView) {
    this.rotateWithView_ = rotateWithView;
  }
  /**
   * Set the rotation.
   *
   * @param {number} rotation Rotation.
   * @api
   */
  setRotation(rotation) {
    this.rotation_ = rotation;
  }
  /**
   * Set the scale.
   *
   * @param {number|import("../size.js").Size} scale Scale.
   * @api
   */
  setScale(scale2) {
    this.scale_ = scale2;
    this.scaleArray_ = toSize(scale2);
  }
  /**
   * @abstract
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   */
  listenImageChange(listener) {
    abstract();
  }
  /**
   * Load not yet loaded URI.
   * @abstract
   */
  load() {
    abstract();
  }
  /**
   * @abstract
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   */
  unlistenImageChange(listener) {
    abstract();
  }
  /**
   * @return {Promise<void>} `false` or Promise that resolves when the style is ready to use.
   */
  ready() {
    return Promise.resolve();
  }
};
var Image_default = ImageStyle;

// node_modules/ol/colorlike.js
function asColorLike(color) {
  if (!color) {
    return null;
  }
  if (Array.isArray(color)) {
    return toString(color);
  }
  if (typeof color === "object" && "src" in color) {
    return asCanvasPattern(color);
  }
  return color;
}
function asCanvasPattern(pattern) {
  if (!pattern.offset || !pattern.size) {
    return shared.getPattern(pattern.src, "anonymous", pattern.color);
  }
  const cacheKey = pattern.src + ":" + pattern.offset;
  const canvasPattern = shared.getPattern(cacheKey, void 0, pattern.color);
  if (canvasPattern) {
    return canvasPattern;
  }
  const iconImage = shared.get(pattern.src, "anonymous", null);
  if (iconImage.getImageState() !== ImageState_default.LOADED) {
    return null;
  }
  const patternCanvasContext = createCanvasContext2D(pattern.size[0], pattern.size[1]);
  patternCanvasContext.drawImage(iconImage.getImage(1), pattern.offset[0], pattern.offset[1], pattern.size[0], pattern.size[1], 0, 0, pattern.size[0], pattern.size[1]);
  get(patternCanvasContext.canvas, cacheKey, void 0, ImageState_default.LOADED, pattern.color, true);
  return shared.getPattern(cacheKey, void 0, pattern.color);
}

// node_modules/ol/css.js
var CLASS_HIDDEN = "ol-hidden";
var CLASS_UNSELECTABLE = "ol-unselectable";
var CLASS_CONTROL = "ol-control";
var CLASS_COLLAPSED = "ol-collapsed";
var fontRegEx = new RegExp(["^\\s*(?=(?:(?:[-a-z]+\\s*){0,2}(italic|oblique))?)", "(?=(?:(?:[-a-z]+\\s*){0,2}(small-caps))?)", "(?=(?:(?:[-a-z]+\\s*){0,2}(bold(?:er)?|lighter|[1-9]00 ))?)", "(?:(?:normal|\\1|\\2|\\3)\\s*){0,3}((?:xx?-)?", "(?:small|large)|medium|smaller|larger|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx]))", "(?:\\s*\\/\\s*(normal|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx])?))", `?\\s*([-,\\"\\'\\sa-z]+?)\\s*$`].join(""), "i");
var fontRegExMatchIndex = ["style", "variant", "weight", "size", "lineHeight", "family"];
var getFontParameters = function(fontSpec) {
  const match = fontSpec.match(fontRegEx);
  if (!match) {
    return null;
  }
  const style = (
    /** @type {FontParameters} */
    {
      lineHeight: "normal",
      size: "1.2em",
      style: "normal",
      weight: "normal",
      variant: "normal"
    }
  );
  for (let i = 0, ii = fontRegExMatchIndex.length; i < ii; ++i) {
    const value = match[i + 1];
    if (value !== void 0) {
      style[fontRegExMatchIndex[i]] = value;
    }
  }
  style.families = style.family.split(/,\s?/);
  return style;
};

// node_modules/ol/render/canvas.js
var defaultFillStyle = "#000";
var defaultLineCap = "round";
var defaultLineJoin = "round";
var defaultMiterLimit = 10;
var defaultStrokeStyle = "#000";
var defaultLineWidth = 1;
var checkedFonts = new Object_default();
var measureContext = null;
var measureFont;
var textHeights = {};
var registerFont = function() {
  const retries = 100;
  const size = "32px ";
  const referenceFonts = ["monospace", "serif"];
  const len = referenceFonts.length;
  const text = "wmytzilWMYTZIL@#/&?$%10";
  let interval, referenceWidth;
  function isAvailable(fontStyle, fontWeight, fontFamily) {
    let available = true;
    for (let i = 0; i < len; ++i) {
      const referenceFont = referenceFonts[i];
      referenceWidth = measureTextWidth(fontStyle + " " + fontWeight + " " + size + referenceFont, text);
      if (fontFamily != referenceFont) {
        const width = measureTextWidth(fontStyle + " " + fontWeight + " " + size + fontFamily + "," + referenceFont, text);
        available = available && width != referenceWidth;
      }
    }
    if (available) {
      return true;
    }
    return false;
  }
  function check() {
    let done = true;
    const fonts = checkedFonts.getKeys();
    for (let i = 0, ii = fonts.length; i < ii; ++i) {
      const font = fonts[i];
      if (checkedFonts.get(font) < retries) {
        const [style, weight, family] = font.split("\n");
        if (isAvailable(style, weight, family)) {
          clear(textHeights);
          measureContext = null;
          measureFont = void 0;
          checkedFonts.set(font, retries);
        } else {
          checkedFonts.set(font, checkedFonts.get(font) + 1, true);
          done = false;
        }
      }
    }
    if (done) {
      clearInterval(interval);
      interval = void 0;
    }
  }
  return function(fontSpec) {
    const font = getFontParameters(fontSpec);
    if (!font) {
      return;
    }
    const families = font.families;
    for (let i = 0, ii = families.length; i < ii; ++i) {
      const family = families[i];
      const key = font.style + "\n" + font.weight + "\n" + family;
      if (checkedFonts.get(key) === void 0) {
        checkedFonts.set(key, retries, true);
        if (!isAvailable(font.style, font.weight, family)) {
          checkedFonts.set(key, 0, true);
          if (interval === void 0) {
            interval = setInterval(check, 32);
          }
        }
      }
    }
  };
}();
function measureText(font, text) {
  if (!measureContext) {
    measureContext = createCanvasContext2D(1, 1);
  }
  if (font != measureFont) {
    measureContext.font = font;
    measureFont = measureContext.font;
  }
  return measureContext.measureText(text);
}
function measureTextWidth(font, text) {
  return measureText(font, text).width;
}

// node_modules/ol/style/RegularShape.js
var RegularShape = class _RegularShape extends Image_default {
  /**
   * @param {Options} options Options.
   */
  constructor(options) {
    super({
      opacity: 1,
      rotateWithView: options.rotateWithView !== void 0 ? options.rotateWithView : false,
      rotation: options.rotation !== void 0 ? options.rotation : 0,
      scale: options.scale !== void 0 ? options.scale : 1,
      displacement: options.displacement !== void 0 ? options.displacement : [0, 0],
      declutterMode: options.declutterMode
    });
    this.hitDetectionCanvas_ = null;
    this.fill_ = options.fill !== void 0 ? options.fill : null;
    this.origin_ = [0, 0];
    this.points_ = options.points;
    this.radius = options.radius;
    this.radius2_ = options.radius2;
    this.angle_ = options.angle !== void 0 ? options.angle : 0;
    this.stroke_ = options.stroke !== void 0 ? options.stroke : null;
    this.size_;
    this.renderOptions_;
    this.imageState_ = this.fill_ && this.fill_.loading() ? ImageState_default.LOADING : ImageState_default.LOADED;
    if (this.imageState_ === ImageState_default.LOADING) {
      this.ready().then(() => this.imageState_ = ImageState_default.LOADED);
    }
    this.render();
  }
  /**
   * Clones the style.
   * @return {RegularShape} The cloned style.
   * @api
   * @override
   */
  clone() {
    const scale2 = this.getScale();
    const style = new _RegularShape({
      fill: this.getFill() ? this.getFill().clone() : void 0,
      points: this.getPoints(),
      radius: this.getRadius(),
      radius2: this.getRadius2(),
      angle: this.getAngle(),
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      scale: Array.isArray(scale2) ? scale2.slice() : scale2,
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
    style.setOpacity(this.getOpacity());
    return style;
  }
  /**
   * Get the anchor point in pixels. The anchor determines the center point for the
   * symbolizer.
   * @return {Array<number>} Anchor.
   * @api
   * @override
   */
  getAnchor() {
    const size = this.size_;
    const displacement = this.getDisplacement();
    const scale2 = this.getScaleArray();
    return [size[0] / 2 - displacement[0] / scale2[0], size[1] / 2 + displacement[1] / scale2[1]];
  }
  /**
   * Get the angle used in generating the shape.
   * @return {number} Shape's rotation in radians.
   * @api
   */
  getAngle() {
    return this.angle_;
  }
  /**
   * Get the fill style for the shape.
   * @return {import("./Fill.js").default|null} Fill style.
   * @api
   */
  getFill() {
    return this.fill_;
  }
  /**
   * Set the fill style.
   * @param {import("./Fill.js").default|null} fill Fill style.
   * @api
   */
  setFill(fill) {
    this.fill_ = fill;
    this.render();
  }
  /**
   * @return {HTMLCanvasElement} Image element.
   * @override
   */
  getHitDetectionImage() {
    if (!this.hitDetectionCanvas_) {
      this.hitDetectionCanvas_ = this.createHitDetectionCanvas_(this.renderOptions_);
    }
    return this.hitDetectionCanvas_;
  }
  /**
   * Get the image icon.
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLCanvasElement} Image or Canvas element.
   * @api
   * @override
   */
  getImage(pixelRatio) {
    const fillKey = this.fill_?.getKey();
    const cacheKey = `${pixelRatio},${this.angle_},${this.radius},${this.radius2_},${this.points_},${fillKey}` + Object.values(this.renderOptions_).join(",");
    let image = (
      /** @type {HTMLCanvasElement} */
      shared.get(cacheKey, null, null)?.getImage(1)
    );
    if (!image) {
      const renderOptions = this.renderOptions_;
      const size = Math.ceil(renderOptions.size * pixelRatio);
      const context = createCanvasContext2D(size, size);
      this.draw_(renderOptions, context, pixelRatio);
      image = context.canvas;
      shared.set(cacheKey, null, null, new IconImage_default(image, void 0, null, ImageState_default.LOADED, null));
    }
    return image;
  }
  /**
   * Get the image pixel ratio.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Pixel ratio.
   * @override
   */
  getPixelRatio(pixelRatio) {
    return pixelRatio;
  }
  /**
   * @return {import("../size.js").Size} Image size.
   * @override
   */
  getImageSize() {
    return this.size_;
  }
  /**
   * @return {import("../ImageState.js").default} Image state.
   * @override
   */
  getImageState() {
    return this.imageState_;
  }
  /**
   * Get the origin of the symbolizer.
   * @return {Array<number>} Origin.
   * @api
   * @override
   */
  getOrigin() {
    return this.origin_;
  }
  /**
   * Get the number of points for generating the shape.
   * @return {number} Number of points for stars and regular polygons.
   * @api
   */
  getPoints() {
    return this.points_;
  }
  /**
   * Get the (primary) radius for the shape.
   * @return {number} Radius.
   * @api
   */
  getRadius() {
    return this.radius;
  }
  /**
   * Get the secondary radius for the shape.
   * @return {number|undefined} Radius2.
   * @api
   */
  getRadius2() {
    return this.radius2_;
  }
  /**
   * Get the size of the symbolizer (in pixels).
   * @return {import("../size.js").Size} Size.
   * @api
   * @override
   */
  getSize() {
    return this.size_;
  }
  /**
   * Get the stroke style for the shape.
   * @return {import("./Stroke.js").default|null} Stroke style.
   * @api
   */
  getStroke() {
    return this.stroke_;
  }
  /**
   * Set the stroke style.
   * @param {import("./Stroke.js").default|null} stroke Stroke style.
   * @api
   */
  setStroke(stroke) {
    this.stroke_ = stroke;
    this.render();
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   * @override
   */
  listenImageChange(listener) {
  }
  /**
   * Load not yet loaded URI.
   * @override
   */
  load() {
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   * @override
   */
  unlistenImageChange(listener) {
  }
  /**
   * Calculate additional canvas size needed for the miter.
   * @param {string} lineJoin Line join
   * @param {number} strokeWidth Stroke width
   * @param {number} miterLimit Miter limit
   * @return {number} Additional canvas size needed
   * @private
   */
  calculateLineJoinSize_(lineJoin, strokeWidth, miterLimit) {
    if (strokeWidth === 0 || this.points_ === Infinity || lineJoin !== "bevel" && lineJoin !== "miter") {
      return strokeWidth;
    }
    let r1 = this.radius;
    let r2 = this.radius2_ === void 0 ? r1 : this.radius2_;
    if (r1 < r2) {
      const tmp = r1;
      r1 = r2;
      r2 = tmp;
    }
    const points = this.radius2_ === void 0 ? this.points_ : this.points_ * 2;
    const alpha = 2 * Math.PI / points;
    const a = r2 * Math.sin(alpha);
    const b = Math.sqrt(r2 * r2 - a * a);
    const d = r1 - b;
    const e = Math.sqrt(a * a + d * d);
    const miterRatio = e / a;
    if (lineJoin === "miter" && miterRatio <= miterLimit) {
      return miterRatio * strokeWidth;
    }
    const k = strokeWidth / 2 / miterRatio;
    const l = strokeWidth / 2 * (d / e);
    const maxr = Math.sqrt((r1 + k) * (r1 + k) + l * l);
    const bevelAdd = maxr - r1;
    if (this.radius2_ === void 0 || lineJoin === "bevel") {
      return bevelAdd * 2;
    }
    const aa = r1 * Math.sin(alpha);
    const bb = Math.sqrt(r1 * r1 - aa * aa);
    const dd = r2 - bb;
    const ee = Math.sqrt(aa * aa + dd * dd);
    const innerMiterRatio = ee / aa;
    if (innerMiterRatio <= miterLimit) {
      const innerLength = innerMiterRatio * strokeWidth / 2 - r2 - r1;
      return 2 * Math.max(bevelAdd, innerLength);
    }
    return bevelAdd * 2;
  }
  /**
   * @return {RenderOptions}  The render options
   * @protected
   */
  createRenderOptions() {
    let lineCap = defaultLineCap;
    let lineJoin = defaultLineJoin;
    let miterLimit = 0;
    let lineDash = null;
    let lineDashOffset = 0;
    let strokeStyle;
    let strokeWidth = 0;
    if (this.stroke_) {
      strokeStyle = asColorLike(this.stroke_.getColor() ?? defaultStrokeStyle);
      strokeWidth = this.stroke_.getWidth() ?? defaultLineWidth;
      lineDash = this.stroke_.getLineDash();
      lineDashOffset = this.stroke_.getLineDashOffset() ?? 0;
      lineJoin = this.stroke_.getLineJoin() ?? defaultLineJoin;
      lineCap = this.stroke_.getLineCap() ?? defaultLineCap;
      miterLimit = this.stroke_.getMiterLimit() ?? defaultMiterLimit;
    }
    const add = this.calculateLineJoinSize_(lineJoin, strokeWidth, miterLimit);
    const maxRadius = Math.max(this.radius, this.radius2_ || 0);
    const size = Math.ceil(2 * maxRadius + add);
    return {
      strokeStyle,
      strokeWidth,
      size,
      lineCap,
      lineDash,
      lineDashOffset,
      lineJoin,
      miterLimit
    };
  }
  /**
   * @protected
   */
  render() {
    this.renderOptions_ = this.createRenderOptions();
    const size = this.renderOptions_.size;
    this.hitDetectionCanvas_ = null;
    this.size_ = [size, size];
  }
  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @param {CanvasRenderingContext2D} context The rendering context.
   * @param {number} pixelRatio The pixel ratio.
   */
  draw_(renderOptions, context, pixelRatio) {
    context.scale(pixelRatio, pixelRatio);
    context.translate(renderOptions.size / 2, renderOptions.size / 2);
    this.createPath_(context);
    if (this.fill_) {
      let color = this.fill_.getColor();
      if (color === null) {
        color = defaultFillStyle;
      }
      context.fillStyle = asColorLike(color);
      context.fill();
    }
    if (renderOptions.strokeStyle) {
      context.strokeStyle = renderOptions.strokeStyle;
      context.lineWidth = renderOptions.strokeWidth;
      if (renderOptions.lineDash) {
        context.setLineDash(renderOptions.lineDash);
        context.lineDashOffset = renderOptions.lineDashOffset;
      }
      context.lineCap = renderOptions.lineCap;
      context.lineJoin = renderOptions.lineJoin;
      context.miterLimit = renderOptions.miterLimit;
      context.stroke();
    }
  }
  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @return {HTMLCanvasElement} Canvas containing the icon
   */
  createHitDetectionCanvas_(renderOptions) {
    let context;
    if (this.fill_) {
      let color = this.fill_.getColor();
      let opacity = 0;
      if (typeof color === "string") {
        color = asArray(color);
      }
      if (color === null) {
        opacity = 1;
      } else if (Array.isArray(color)) {
        opacity = color.length === 4 ? color[3] : 1;
      }
      if (opacity === 0) {
        context = createCanvasContext2D(renderOptions.size, renderOptions.size);
        this.drawHitDetectionCanvas_(renderOptions, context);
      }
    }
    return context ? context.canvas : this.getImage(1);
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context The context to draw in.
   */
  createPath_(context) {
    let points = this.points_;
    const radius = this.radius;
    if (points === Infinity) {
      context.arc(0, 0, radius, 0, 2 * Math.PI);
    } else {
      const radius2 = this.radius2_ === void 0 ? radius : this.radius2_;
      if (this.radius2_ !== void 0) {
        points *= 2;
      }
      const startAngle = this.angle_ - Math.PI / 2;
      const step = 2 * Math.PI / points;
      for (let i = 0; i < points; i++) {
        const angle0 = startAngle + i * step;
        const radiusC = i % 2 === 0 ? radius : radius2;
        context.lineTo(radiusC * Math.cos(angle0), radiusC * Math.sin(angle0));
      }
      context.closePath();
    }
  }
  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @param {CanvasRenderingContext2D} context The context.
   */
  drawHitDetectionCanvas_(renderOptions, context) {
    context.translate(renderOptions.size / 2, renderOptions.size / 2);
    this.createPath_(context);
    context.fillStyle = defaultFillStyle;
    context.fill();
    if (renderOptions.strokeStyle) {
      context.strokeStyle = renderOptions.strokeStyle;
      context.lineWidth = renderOptions.strokeWidth;
      if (renderOptions.lineDash) {
        context.setLineDash(renderOptions.lineDash);
        context.lineDashOffset = renderOptions.lineDashOffset;
      }
      context.lineJoin = renderOptions.lineJoin;
      context.miterLimit = renderOptions.miterLimit;
      context.stroke();
    }
  }
  /**
   * @override
   */
  ready() {
    return this.fill_ ? this.fill_.ready() : Promise.resolve();
  }
};
var RegularShape_default = RegularShape;

// node_modules/ol/style/Circle.js
var CircleStyle = class _CircleStyle extends RegularShape_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    options = options ? options : {
      radius: 5
    };
    super({
      points: Infinity,
      fill: options.fill,
      radius: options.radius,
      stroke: options.stroke,
      scale: options.scale !== void 0 ? options.scale : 1,
      rotation: options.rotation !== void 0 ? options.rotation : 0,
      rotateWithView: options.rotateWithView !== void 0 ? options.rotateWithView : false,
      displacement: options.displacement !== void 0 ? options.displacement : [0, 0],
      declutterMode: options.declutterMode
    });
  }
  /**
   * Clones the style.
   * @return {CircleStyle} The cloned style.
   * @api
   * @override
   */
  clone() {
    const scale2 = this.getScale();
    const style = new _CircleStyle({
      fill: this.getFill() ? this.getFill().clone() : void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      radius: this.getRadius(),
      scale: Array.isArray(scale2) ? scale2.slice() : scale2,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
    style.setOpacity(this.getOpacity());
    return style;
  }
  /**
   * Set the circle radius.
   *
   * @param {number} radius Circle radius.
   * @api
   */
  setRadius(radius) {
    this.radius = radius;
    this.render();
  }
};
var Circle_default = CircleStyle;

// node_modules/ol/style/Fill.js
var Fill = class _Fill {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    options = options || {};
    this.patternImage_ = null;
    this.color_ = null;
    if (options.color !== void 0) {
      this.setColor(options.color);
    }
  }
  /**
   * Clones the style. The color is not cloned if it is a {@link module:ol/colorlike~ColorLike}.
   * @return {Fill} The cloned style.
   * @api
   */
  clone() {
    const color = this.getColor();
    return new _Fill({
      color: Array.isArray(color) ? color.slice() : color || void 0
    });
  }
  /**
   * Get the fill color.
   * @return {import("../color.js").Color|import("../colorlike.js").ColorLike|import('../colorlike.js').PatternDescriptor|null} Color.
   * @api
   */
  getColor() {
    return this.color_;
  }
  /**
   * Set the color.
   *
   * @param {import("../color.js").Color|import("../colorlike.js").ColorLike|import('../colorlike.js').PatternDescriptor|null} color Color.
   * @api
   */
  setColor(color) {
    if (color !== null && typeof color === "object" && "src" in color) {
      const patternImage = get(null, color.src, "anonymous", void 0, color.offset ? null : color.color ? color.color : null, !(color.offset && color.size));
      patternImage.ready().then(() => {
        this.patternImage_ = null;
      });
      if (patternImage.getImageState() === ImageState_default.IDLE) {
        patternImage.load();
      }
      if (patternImage.getImageState() === ImageState_default.LOADING) {
        this.patternImage_ = patternImage;
      }
    }
    this.color_ = color;
  }
  /**
   * @return {string} Key of the fill for cache lookup.
   */
  getKey() {
    const fill = this.getColor();
    if (!fill) {
      return "";
    }
    return fill instanceof CanvasPattern || fill instanceof CanvasGradient ? getUid(fill) : typeof fill === "object" && "src" in fill ? fill.src + ":" + fill.offset : asArray(fill).toString();
  }
  /**
   * @return {boolean} The fill style is loading an image pattern.
   */
  loading() {
    return !!this.patternImage_;
  }
  /**
   * @return {Promise<void>} `false` or a promise that resolves when the style is ready to use.
   */
  ready() {
    return this.patternImage_ ? this.patternImage_.ready() : Promise.resolve();
  }
};
var Fill_default = Fill;

// node_modules/ol/style/Stroke.js
var Stroke = class _Stroke {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    options = options || {};
    this.color_ = options.color !== void 0 ? options.color : null;
    this.lineCap_ = options.lineCap;
    this.lineDash_ = options.lineDash !== void 0 ? options.lineDash : null;
    this.lineDashOffset_ = options.lineDashOffset;
    this.lineJoin_ = options.lineJoin;
    this.miterLimit_ = options.miterLimit;
    this.width_ = options.width;
  }
  /**
   * Clones the style.
   * @return {Stroke} The cloned style.
   * @api
   */
  clone() {
    const color = this.getColor();
    return new _Stroke({
      color: Array.isArray(color) ? color.slice() : color || void 0,
      lineCap: this.getLineCap(),
      lineDash: this.getLineDash() ? this.getLineDash().slice() : void 0,
      lineDashOffset: this.getLineDashOffset(),
      lineJoin: this.getLineJoin(),
      miterLimit: this.getMiterLimit(),
      width: this.getWidth()
    });
  }
  /**
   * Get the stroke color.
   * @return {import("../color.js").Color|import("../colorlike.js").ColorLike} Color.
   * @api
   */
  getColor() {
    return this.color_;
  }
  /**
   * Get the line cap type for the stroke.
   * @return {CanvasLineCap|undefined} Line cap.
   * @api
   */
  getLineCap() {
    return this.lineCap_;
  }
  /**
   * Get the line dash style for the stroke.
   * @return {Array<number>|null} Line dash.
   * @api
   */
  getLineDash() {
    return this.lineDash_;
  }
  /**
   * Get the line dash offset for the stroke.
   * @return {number|undefined} Line dash offset.
   * @api
   */
  getLineDashOffset() {
    return this.lineDashOffset_;
  }
  /**
   * Get the line join type for the stroke.
   * @return {CanvasLineJoin|undefined} Line join.
   * @api
   */
  getLineJoin() {
    return this.lineJoin_;
  }
  /**
   * Get the miter limit for the stroke.
   * @return {number|undefined} Miter limit.
   * @api
   */
  getMiterLimit() {
    return this.miterLimit_;
  }
  /**
   * Get the stroke width.
   * @return {number|undefined} Width.
   * @api
   */
  getWidth() {
    return this.width_;
  }
  /**
   * Set the color.
   *
   * @param {import("../color.js").Color|import("../colorlike.js").ColorLike} color Color.
   * @api
   */
  setColor(color) {
    this.color_ = color;
  }
  /**
   * Set the line cap.
   *
   * @param {CanvasLineCap|undefined} lineCap Line cap.
   * @api
   */
  setLineCap(lineCap) {
    this.lineCap_ = lineCap;
  }
  /**
   * Set the line dash.
   *
   * @param {Array<number>|null} lineDash Line dash.
   * @api
   */
  setLineDash(lineDash) {
    this.lineDash_ = lineDash;
  }
  /**
   * Set the line dash offset.
   *
   * @param {number|undefined} lineDashOffset Line dash offset.
   * @api
   */
  setLineDashOffset(lineDashOffset) {
    this.lineDashOffset_ = lineDashOffset;
  }
  /**
   * Set the line join.
   *
   * @param {CanvasLineJoin|undefined} lineJoin Line join.
   * @api
   */
  setLineJoin(lineJoin) {
    this.lineJoin_ = lineJoin;
  }
  /**
   * Set the miter limit.
   *
   * @param {number|undefined} miterLimit Miter limit.
   * @api
   */
  setMiterLimit(miterLimit) {
    this.miterLimit_ = miterLimit;
  }
  /**
   * Set the width.
   *
   * @param {number|undefined} width Width.
   * @api
   */
  setWidth(width) {
    this.width_ = width;
  }
};
var Stroke_default = Stroke;

// node_modules/ol/style/Style.js
var Style = class _Style {
  /**
   * @param {Options} [options] Style options.
   */
  constructor(options) {
    options = options || {};
    this.geometry_ = null;
    this.geometryFunction_ = defaultGeometryFunction;
    if (options.geometry !== void 0) {
      this.setGeometry(options.geometry);
    }
    this.fill_ = options.fill !== void 0 ? options.fill : null;
    this.image_ = options.image !== void 0 ? options.image : null;
    this.renderer_ = options.renderer !== void 0 ? options.renderer : null;
    this.hitDetectionRenderer_ = options.hitDetectionRenderer !== void 0 ? options.hitDetectionRenderer : null;
    this.stroke_ = options.stroke !== void 0 ? options.stroke : null;
    this.text_ = options.text !== void 0 ? options.text : null;
    this.zIndex_ = options.zIndex;
  }
  /**
   * Clones the style.
   * @return {Style} The cloned style.
   * @api
   */
  clone() {
    let geometry = this.getGeometry();
    if (geometry && typeof geometry === "object") {
      geometry = /** @type {import("../geom/Geometry.js").default} */
      geometry.clone();
    }
    return new _Style({
      geometry: geometry ?? void 0,
      fill: this.getFill() ? this.getFill().clone() : void 0,
      image: this.getImage() ? this.getImage().clone() : void 0,
      renderer: this.getRenderer() ?? void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      text: this.getText() ? this.getText().clone() : void 0,
      zIndex: this.getZIndex()
    });
  }
  /**
   * Get the custom renderer function that was configured with
   * {@link #setRenderer} or the `renderer` constructor option.
   * @return {RenderFunction|null} Custom renderer function.
   * @api
   */
  getRenderer() {
    return this.renderer_;
  }
  /**
   * Sets a custom renderer function for this style. When set, `fill`, `stroke`
   * and `image` options of the style will be ignored.
   * @param {RenderFunction|null} renderer Custom renderer function.
   * @api
   */
  setRenderer(renderer) {
    this.renderer_ = renderer;
  }
  /**
   * Sets a custom renderer function for this style used
   * in hit detection.
   * @param {RenderFunction|null} renderer Custom renderer function.
   * @api
   */
  setHitDetectionRenderer(renderer) {
    this.hitDetectionRenderer_ = renderer;
  }
  /**
   * Get the custom renderer function that was configured with
   * {@link #setHitDetectionRenderer} or the `hitDetectionRenderer` constructor option.
   * @return {RenderFunction|null} Custom renderer function.
   * @api
   */
  getHitDetectionRenderer() {
    return this.hitDetectionRenderer_;
  }
  /**
   * Get the geometry to be rendered.
   * @return {string|import("../geom/Geometry.js").default|GeometryFunction|null}
   * Feature property or geometry or function that returns the geometry that will
   * be rendered with this style.
   * @api
   */
  getGeometry() {
    return this.geometry_;
  }
  /**
   * Get the function used to generate a geometry for rendering.
   * @return {!GeometryFunction} Function that is called with a feature
   * and returns the geometry to render instead of the feature's geometry.
   * @api
   */
  getGeometryFunction() {
    return this.geometryFunction_;
  }
  /**
   * Get the fill style.
   * @return {import("./Fill.js").default|null} Fill style.
   * @api
   */
  getFill() {
    return this.fill_;
  }
  /**
   * Set the fill style.
   * @param {import("./Fill.js").default|null} fill Fill style.
   * @api
   */
  setFill(fill) {
    this.fill_ = fill;
  }
  /**
   * Get the image style.
   * @return {import("./Image.js").default|null} Image style.
   * @api
   */
  getImage() {
    return this.image_;
  }
  /**
   * Set the image style.
   * @param {import("./Image.js").default} image Image style.
   * @api
   */
  setImage(image) {
    this.image_ = image;
  }
  /**
   * Get the stroke style.
   * @return {import("./Stroke.js").default|null} Stroke style.
   * @api
   */
  getStroke() {
    return this.stroke_;
  }
  /**
   * Set the stroke style.
   * @param {import("./Stroke.js").default|null} stroke Stroke style.
   * @api
   */
  setStroke(stroke) {
    this.stroke_ = stroke;
  }
  /**
   * Get the text style.
   * @return {import("./Text.js").default|null} Text style.
   * @api
   */
  getText() {
    return this.text_;
  }
  /**
   * Set the text style.
   * @param {import("./Text.js").default} text Text style.
   * @api
   */
  setText(text) {
    this.text_ = text;
  }
  /**
   * Get the z-index for the style.
   * @return {number|undefined} ZIndex.
   * @api
   */
  getZIndex() {
    return this.zIndex_;
  }
  /**
   * Set a geometry that is rendered instead of the feature's geometry.
   *
   * @param {string|import("../geom/Geometry.js").default|GeometryFunction} geometry
   *     Feature property or geometry or function returning a geometry to render
   *     for this style.
   * @api
   */
  setGeometry(geometry) {
    if (typeof geometry === "function") {
      this.geometryFunction_ = geometry;
    } else if (typeof geometry === "string") {
      this.geometryFunction_ = function(feature) {
        return (
          /** @type {import("../geom/Geometry.js").default} */
          feature.get(geometry)
        );
      };
    } else if (!geometry) {
      this.geometryFunction_ = defaultGeometryFunction;
    } else if (geometry !== void 0) {
      this.geometryFunction_ = function() {
        return (
          /** @type {import("../geom/Geometry.js").default} */
          geometry
        );
      };
    }
    this.geometry_ = geometry;
  }
  /**
   * Set the z-index.
   *
   * @param {number|undefined} zIndex ZIndex.
   * @api
   */
  setZIndex(zIndex) {
    this.zIndex_ = zIndex;
  }
};
function toFunction(obj) {
  let styleFunction;
  if (typeof obj === "function") {
    styleFunction = obj;
  } else {
    let styles;
    if (Array.isArray(obj)) {
      styles = obj;
    } else {
      assert(typeof /** @type {?} */
      obj.getZIndex === "function", "Expected an `Style` or an array of `Style`");
      const style = (
        /** @type {Style} */
        obj
      );
      styles = [style];
    }
    styleFunction = function() {
      return styles;
    };
  }
  return styleFunction;
}
var defaultStyles = null;
function createDefaultStyle(feature, resolution) {
  if (!defaultStyles) {
    const fill = new Fill_default({
      color: "rgba(255,255,255,0.4)"
    });
    const stroke = new Stroke_default({
      color: "#3399CC",
      width: 1.25
    });
    defaultStyles = [new Style({
      image: new Circle_default({
        fill,
        stroke,
        radius: 5
      }),
      fill,
      stroke
    })];
  }
  return defaultStyles;
}
function defaultGeometryFunction(feature) {
  return feature.getGeometry();
}
var Style_default = Style;

// node_modules/ol/style/Icon.js
function calculateScale(width, height, wantedWidth, wantedHeight) {
  if (wantedWidth !== void 0 && wantedHeight !== void 0) {
    return [wantedWidth / width, wantedHeight / height];
  }
  if (wantedWidth !== void 0) {
    return wantedWidth / width;
  }
  if (wantedHeight !== void 0) {
    return wantedHeight / height;
  }
  return 1;
}
var Icon = class _Icon extends Image_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    options = options || {};
    const opacity = options.opacity !== void 0 ? options.opacity : 1;
    const rotation = options.rotation !== void 0 ? options.rotation : 0;
    const scale2 = options.scale !== void 0 ? options.scale : 1;
    const rotateWithView = options.rotateWithView !== void 0 ? options.rotateWithView : false;
    super({
      opacity,
      rotation,
      scale: scale2,
      displacement: options.displacement !== void 0 ? options.displacement : [0, 0],
      rotateWithView,
      declutterMode: options.declutterMode
    });
    this.anchor_ = options.anchor !== void 0 ? options.anchor : [0.5, 0.5];
    this.normalizedAnchor_ = null;
    this.anchorOrigin_ = options.anchorOrigin !== void 0 ? options.anchorOrigin : "top-left";
    this.anchorXUnits_ = options.anchorXUnits !== void 0 ? options.anchorXUnits : "fraction";
    this.anchorYUnits_ = options.anchorYUnits !== void 0 ? options.anchorYUnits : "fraction";
    this.crossOrigin_ = options.crossOrigin !== void 0 ? options.crossOrigin : null;
    const image = options.img !== void 0 ? options.img : null;
    let cacheKey = options.src;
    assert(!(cacheKey !== void 0 && image), "`image` and `src` cannot be provided at the same time");
    if ((cacheKey === void 0 || cacheKey.length === 0) && image) {
      cacheKey = /** @type {HTMLImageElement} */
      image.src || getUid(image);
    }
    assert(cacheKey !== void 0 && cacheKey.length > 0, "A defined and non-empty `src` or `image` must be provided");
    assert(!((options.width !== void 0 || options.height !== void 0) && options.scale !== void 0), "`width` or `height` cannot be provided together with `scale`");
    let imageState;
    if (options.src !== void 0) {
      imageState = ImageState_default.IDLE;
    } else if (image !== void 0) {
      if ("complete" in image) {
        if (image.complete) {
          imageState = image.src ? ImageState_default.LOADED : ImageState_default.IDLE;
        } else {
          imageState = ImageState_default.LOADING;
        }
      } else {
        imageState = ImageState_default.LOADED;
      }
    }
    this.color_ = options.color !== void 0 ? asArray(options.color) : null;
    this.iconImage_ = get(
      image,
      /** @type {string} */
      cacheKey,
      this.crossOrigin_,
      imageState,
      this.color_
    );
    this.offset_ = options.offset !== void 0 ? options.offset : [0, 0];
    this.offsetOrigin_ = options.offsetOrigin !== void 0 ? options.offsetOrigin : "top-left";
    this.origin_ = null;
    this.size_ = options.size !== void 0 ? options.size : null;
    this.initialOptions_;
    if (options.width !== void 0 || options.height !== void 0) {
      let width, height;
      if (options.size) {
        [width, height] = options.size;
      } else {
        const image2 = this.getImage(1);
        if (image2.width && image2.height) {
          width = image2.width;
          height = image2.height;
        } else if (image2 instanceof HTMLImageElement) {
          this.initialOptions_ = options;
          const onload = () => {
            this.unlistenImageChange(onload);
            if (!this.initialOptions_) {
              return;
            }
            const imageSize = this.iconImage_.getSize();
            this.setScale(calculateScale(imageSize[0], imageSize[1], options.width, options.height));
          };
          this.listenImageChange(onload);
          return;
        }
      }
      if (width !== void 0) {
        this.setScale(calculateScale(width, height, options.width, options.height));
      }
    }
  }
  /**
   * Clones the style. The underlying Image/HTMLCanvasElement is not cloned.
   * @return {Icon} The cloned style.
   * @api
   * @override
   */
  clone() {
    let scale2, width, height;
    if (this.initialOptions_) {
      width = this.initialOptions_.width;
      height = this.initialOptions_.height;
    } else {
      scale2 = this.getScale();
      scale2 = Array.isArray(scale2) ? scale2.slice() : scale2;
    }
    return new _Icon({
      anchor: this.anchor_.slice(),
      anchorOrigin: this.anchorOrigin_,
      anchorXUnits: this.anchorXUnits_,
      anchorYUnits: this.anchorYUnits_,
      color: this.color_ && this.color_.slice ? this.color_.slice() : this.color_ || void 0,
      crossOrigin: this.crossOrigin_,
      offset: this.offset_.slice(),
      offsetOrigin: this.offsetOrigin_,
      opacity: this.getOpacity(),
      rotateWithView: this.getRotateWithView(),
      rotation: this.getRotation(),
      scale: scale2,
      width,
      height,
      size: this.size_ !== null ? this.size_.slice() : void 0,
      src: this.getSrc(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
  }
  /**
   * Get the anchor point in pixels. The anchor determines the center point for the
   * symbolizer.
   * @return {Array<number>} Anchor.
   * @api
   * @override
   */
  getAnchor() {
    let anchor = this.normalizedAnchor_;
    if (!anchor) {
      anchor = this.anchor_;
      const size = this.getSize();
      if (this.anchorXUnits_ == "fraction" || this.anchorYUnits_ == "fraction") {
        if (!size) {
          return null;
        }
        anchor = this.anchor_.slice();
        if (this.anchorXUnits_ == "fraction") {
          anchor[0] *= size[0];
        }
        if (this.anchorYUnits_ == "fraction") {
          anchor[1] *= size[1];
        }
      }
      if (this.anchorOrigin_ != "top-left") {
        if (!size) {
          return null;
        }
        if (anchor === this.anchor_) {
          anchor = this.anchor_.slice();
        }
        if (this.anchorOrigin_ == "top-right" || this.anchorOrigin_ == "bottom-right") {
          anchor[0] = -anchor[0] + size[0];
        }
        if (this.anchorOrigin_ == "bottom-left" || this.anchorOrigin_ == "bottom-right") {
          anchor[1] = -anchor[1] + size[1];
        }
      }
      this.normalizedAnchor_ = anchor;
    }
    const displacement = this.getDisplacement();
    const scale2 = this.getScaleArray();
    return [anchor[0] - displacement[0] / scale2[0], anchor[1] + displacement[1] / scale2[1]];
  }
  /**
   * Set the anchor point. The anchor determines the center point for the
   * symbolizer.
   *
   * @param {Array<number>} anchor Anchor.
   * @api
   */
  setAnchor(anchor) {
    this.anchor_ = anchor;
    this.normalizedAnchor_ = null;
  }
  /**
   * Get the icon color.
   * @return {import("../color.js").Color} Color.
   * @api
   */
  getColor() {
    return this.color_;
  }
  /**
   * Get the image icon.
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLImageElement|HTMLCanvasElement|ImageBitmap} Image or Canvas element. If the Icon
   * style was configured with `src` or with a not let loaded `img`, an `ImageBitmap` will be returned.
   * @api
   * @override
   */
  getImage(pixelRatio) {
    return this.iconImage_.getImage(pixelRatio);
  }
  /**
   * Get the pixel ratio.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} The pixel ratio of the image.
   * @api
   * @override
   */
  getPixelRatio(pixelRatio) {
    return this.iconImage_.getPixelRatio(pixelRatio);
  }
  /**
   * @return {import("../size.js").Size} Image size.
   * @override
   */
  getImageSize() {
    return this.iconImage_.getSize();
  }
  /**
   * @return {import("../ImageState.js").default} Image state.
   * @override
   */
  getImageState() {
    return this.iconImage_.getImageState();
  }
  /**
   * @return {HTMLImageElement|HTMLCanvasElement|ImageBitmap} Image element.
   * @override
   */
  getHitDetectionImage() {
    return this.iconImage_.getHitDetectionImage();
  }
  /**
   * Get the origin of the symbolizer.
   * @return {Array<number>} Origin.
   * @api
   * @override
   */
  getOrigin() {
    if (this.origin_) {
      return this.origin_;
    }
    let offset = this.offset_;
    if (this.offsetOrigin_ != "top-left") {
      const size = this.getSize();
      const iconImageSize = this.iconImage_.getSize();
      if (!size || !iconImageSize) {
        return null;
      }
      offset = offset.slice();
      if (this.offsetOrigin_ == "top-right" || this.offsetOrigin_ == "bottom-right") {
        offset[0] = iconImageSize[0] - size[0] - offset[0];
      }
      if (this.offsetOrigin_ == "bottom-left" || this.offsetOrigin_ == "bottom-right") {
        offset[1] = iconImageSize[1] - size[1] - offset[1];
      }
    }
    this.origin_ = offset;
    return this.origin_;
  }
  /**
   * Get the image URL.
   * @return {string|undefined} Image src.
   * @api
   */
  getSrc() {
    return this.iconImage_.getSrc();
  }
  /**
   * Get the size of the icon (in pixels).
   * @return {import("../size.js").Size} Image size.
   * @api
   * @override
   */
  getSize() {
    return !this.size_ ? this.iconImage_.getSize() : this.size_;
  }
  /**
   * Get the width of the icon (in pixels). Will return undefined when the icon image is not yet loaded.
   * @return {number} Icon width (in pixels).
   * @api
   */
  getWidth() {
    const scale2 = this.getScaleArray();
    if (this.size_) {
      return this.size_[0] * scale2[0];
    }
    if (this.iconImage_.getImageState() == ImageState_default.LOADED) {
      return this.iconImage_.getSize()[0] * scale2[0];
    }
    return void 0;
  }
  /**
   * Get the height of the icon (in pixels). Will return undefined when the icon image is not yet loaded.
   * @return {number} Icon height (in pixels).
   * @api
   */
  getHeight() {
    const scale2 = this.getScaleArray();
    if (this.size_) {
      return this.size_[1] * scale2[1];
    }
    if (this.iconImage_.getImageState() == ImageState_default.LOADED) {
      return this.iconImage_.getSize()[1] * scale2[1];
    }
    return void 0;
  }
  /**
   * Set the scale.
   *
   * @param {number|import("../size.js").Size} scale Scale.
   * @api
   * @override
   */
  setScale(scale2) {
    delete this.initialOptions_;
    super.setScale(scale2);
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   * @override
   */
  listenImageChange(listener) {
    this.iconImage_.addEventListener(EventType_default.CHANGE, listener);
  }
  /**
   * Load not yet loaded URI.
   * When rendering a feature with an icon style, the vector renderer will
   * automatically call this method. However, you might want to call this
   * method yourself for preloading or other purposes.
   * @api
   * @override
   */
  load() {
    this.iconImage_.load();
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   * @override
   */
  unlistenImageChange(listener) {
    this.iconImage_.removeEventListener(EventType_default.CHANGE, listener);
  }
  /**
   * @override
   */
  ready() {
    return this.iconImage_.ready();
  }
};
var Icon_default = Icon;

// node_modules/ol/style/Text.js
var DEFAULT_FILL_COLOR = "#333";
var Text = class _Text {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    options = options || {};
    this.font_ = options.font;
    this.rotation_ = options.rotation;
    this.rotateWithView_ = options.rotateWithView;
    this.keepUpright_ = options.keepUpright;
    this.scale_ = options.scale;
    this.scaleArray_ = toSize(options.scale !== void 0 ? options.scale : 1);
    this.text_ = options.text;
    this.textAlign_ = options.textAlign;
    this.justify_ = options.justify;
    this.repeat_ = options.repeat;
    this.textBaseline_ = options.textBaseline;
    this.fill_ = options.fill !== void 0 ? options.fill : new Fill_default({
      color: DEFAULT_FILL_COLOR
    });
    this.maxAngle_ = options.maxAngle !== void 0 ? options.maxAngle : Math.PI / 4;
    this.placement_ = options.placement !== void 0 ? options.placement : "point";
    this.overflow_ = !!options.overflow;
    this.stroke_ = options.stroke !== void 0 ? options.stroke : null;
    this.offsetX_ = options.offsetX !== void 0 ? options.offsetX : 0;
    this.offsetY_ = options.offsetY !== void 0 ? options.offsetY : 0;
    this.backgroundFill_ = options.backgroundFill ? options.backgroundFill : null;
    this.backgroundStroke_ = options.backgroundStroke ? options.backgroundStroke : null;
    this.padding_ = options.padding === void 0 ? null : options.padding;
    this.declutterMode_ = options.declutterMode;
  }
  /**
   * Clones the style.
   * @return {Text} The cloned style.
   * @api
   */
  clone() {
    const scale2 = this.getScale();
    return new _Text({
      font: this.getFont(),
      placement: this.getPlacement(),
      repeat: this.getRepeat(),
      maxAngle: this.getMaxAngle(),
      overflow: this.getOverflow(),
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      keepUpright: this.getKeepUpright(),
      scale: Array.isArray(scale2) ? scale2.slice() : scale2,
      text: this.getText(),
      textAlign: this.getTextAlign(),
      justify: this.getJustify(),
      textBaseline: this.getTextBaseline(),
      fill: this.getFill() ? this.getFill().clone() : void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      offsetX: this.getOffsetX(),
      offsetY: this.getOffsetY(),
      backgroundFill: this.getBackgroundFill() ? this.getBackgroundFill().clone() : void 0,
      backgroundStroke: this.getBackgroundStroke() ? this.getBackgroundStroke().clone() : void 0,
      padding: this.getPadding() || void 0,
      declutterMode: this.getDeclutterMode()
    });
  }
  /**
   * Get the `overflow` configuration.
   * @return {boolean} Let text overflow the length of the path they follow.
   * @api
   */
  getOverflow() {
    return this.overflow_;
  }
  /**
   * Get the font name.
   * @return {string|undefined} Font.
   * @api
   */
  getFont() {
    return this.font_;
  }
  /**
   * Get the maximum angle between adjacent characters.
   * @return {number} Angle in radians.
   * @api
   */
  getMaxAngle() {
    return this.maxAngle_;
  }
  /**
   * Get the label placement.
   * @return {TextPlacement} Text placement.
   * @api
   */
  getPlacement() {
    return this.placement_;
  }
  /**
   * Get the repeat interval of the text.
   * @return {number|undefined} Repeat interval in pixels.
   * @api
   */
  getRepeat() {
    return this.repeat_;
  }
  /**
   * Get the x-offset for the text.
   * @return {number} Horizontal text offset.
   * @api
   */
  getOffsetX() {
    return this.offsetX_;
  }
  /**
   * Get the y-offset for the text.
   * @return {number} Vertical text offset.
   * @api
   */
  getOffsetY() {
    return this.offsetY_;
  }
  /**
   * Get the fill style for the text.
   * @return {import("./Fill.js").default|null} Fill style.
   * @api
   */
  getFill() {
    return this.fill_;
  }
  /**
   * Determine whether the text rotates with the map.
   * @return {boolean|undefined} Rotate with map.
   * @api
   */
  getRotateWithView() {
    return this.rotateWithView_;
  }
  /**
   * Determine whether the text can be rendered upside down.
   * @return {boolean|undefined} Keep text upright.
   * @api
   */
  getKeepUpright() {
    return this.keepUpright_;
  }
  /**
   * Get the text rotation.
   * @return {number|undefined} Rotation.
   * @api
   */
  getRotation() {
    return this.rotation_;
  }
  /**
   * Get the text scale.
   * @return {number|import("../size.js").Size|undefined} Scale.
   * @api
   */
  getScale() {
    return this.scale_;
  }
  /**
   * Get the symbolizer scale array.
   * @return {import("../size.js").Size} Scale array.
   */
  getScaleArray() {
    return this.scaleArray_;
  }
  /**
   * Get the stroke style for the text.
   * @return {import("./Stroke.js").default|null} Stroke style.
   * @api
   */
  getStroke() {
    return this.stroke_;
  }
  /**
   * Get the text to be rendered.
   * @return {string|Array<string>|undefined} Text.
   * @api
   */
  getText() {
    return this.text_;
  }
  /**
   * Get the text alignment.
   * @return {CanvasTextAlign|undefined} Text align.
   * @api
   */
  getTextAlign() {
    return this.textAlign_;
  }
  /**
   * Get the justification.
   * @return {TextJustify|undefined} Justification.
   * @api
   */
  getJustify() {
    return this.justify_;
  }
  /**
   * Get the text baseline.
   * @return {CanvasTextBaseline|undefined} Text baseline.
   * @api
   */
  getTextBaseline() {
    return this.textBaseline_;
  }
  /**
   * Get the background fill style for the text.
   * @return {import("./Fill.js").default|null} Fill style.
   * @api
   */
  getBackgroundFill() {
    return this.backgroundFill_;
  }
  /**
   * Get the background stroke style for the text.
   * @return {import("./Stroke.js").default|null} Stroke style.
   * @api
   */
  getBackgroundStroke() {
    return this.backgroundStroke_;
  }
  /**
   * Get the padding for the text.
   * @return {Array<number>|null} Padding.
   * @api
   */
  getPadding() {
    return this.padding_;
  }
  /**
   * Get the declutter mode of the shape
   * @return {import("./Style.js").DeclutterMode} Shape's declutter mode
   * @api
   */
  getDeclutterMode() {
    return this.declutterMode_;
  }
  /**
   * Set the `overflow` property.
   *
   * @param {boolean} overflow Let text overflow the path that it follows.
   * @api
   */
  setOverflow(overflow) {
    this.overflow_ = overflow;
  }
  /**
   * Set the font.
   *
   * @param {string|undefined} font Font.
   * @api
   */
  setFont(font) {
    this.font_ = font;
  }
  /**
   * Set the maximum angle between adjacent characters.
   *
   * @param {number} maxAngle Angle in radians.
   * @api
   */
  setMaxAngle(maxAngle) {
    this.maxAngle_ = maxAngle;
  }
  /**
   * Set the x offset.
   *
   * @param {number} offsetX Horizontal text offset.
   * @api
   */
  setOffsetX(offsetX) {
    this.offsetX_ = offsetX;
  }
  /**
   * Set the y offset.
   *
   * @param {number} offsetY Vertical text offset.
   * @api
   */
  setOffsetY(offsetY) {
    this.offsetY_ = offsetY;
  }
  /**
   * Set the text placement.
   *
   * @param {TextPlacement} placement Placement.
   * @api
   */
  setPlacement(placement) {
    this.placement_ = placement;
  }
  /**
   * Set the repeat interval of the text.
   * @param {number|undefined} [repeat] Repeat interval in pixels.
   * @api
   */
  setRepeat(repeat) {
    this.repeat_ = repeat;
  }
  /**
   * Set whether to rotate the text with the view.
   *
   * @param {boolean} rotateWithView Rotate with map.
   * @api
   */
  setRotateWithView(rotateWithView) {
    this.rotateWithView_ = rotateWithView;
  }
  /**
   * Set whether the text can be rendered upside down.
   *
   * @param {boolean} keepUpright Keep text upright.
   * @api
   */
  setKeepUpright(keepUpright) {
    this.keepUpright_ = keepUpright;
  }
  /**
   * Set the fill.
   *
   * @param {import("./Fill.js").default|null} fill Fill style.
   * @api
   */
  setFill(fill) {
    this.fill_ = fill;
  }
  /**
   * Set the rotation.
   *
   * @param {number|undefined} rotation Rotation.
   * @api
   */
  setRotation(rotation) {
    this.rotation_ = rotation;
  }
  /**
   * Set the scale.
   *
   * @param {number|import("../size.js").Size|undefined} scale Scale.
   * @api
   */
  setScale(scale2) {
    this.scale_ = scale2;
    this.scaleArray_ = toSize(scale2 !== void 0 ? scale2 : 1);
  }
  /**
   * Set the stroke.
   *
   * @param {import("./Stroke.js").default|null} stroke Stroke style.
   * @api
   */
  setStroke(stroke) {
    this.stroke_ = stroke;
  }
  /**
   * Set the text.
   *
   * @param {string|Array<string>|undefined} text Text.
   * @api
   */
  setText(text) {
    this.text_ = text;
  }
  /**
   * Set the text alignment.
   *
   * @param {CanvasTextAlign|undefined} textAlign Text align.
   * @api
   */
  setTextAlign(textAlign) {
    this.textAlign_ = textAlign;
  }
  /**
   * Set the justification.
   *
   * @param {TextJustify|undefined} justify Justification.
   * @api
   */
  setJustify(justify) {
    this.justify_ = justify;
  }
  /**
   * Set the text baseline.
   *
   * @param {CanvasTextBaseline|undefined} textBaseline Text baseline.
   * @api
   */
  setTextBaseline(textBaseline) {
    this.textBaseline_ = textBaseline;
  }
  /**
   * Set the background fill.
   *
   * @param {import("./Fill.js").default|null} fill Fill style.
   * @api
   */
  setBackgroundFill(fill) {
    this.backgroundFill_ = fill;
  }
  /**
   * Set the background stroke.
   *
   * @param {import("./Stroke.js").default|null} stroke Stroke style.
   * @api
   */
  setBackgroundStroke(stroke) {
    this.backgroundStroke_ = stroke;
  }
  /**
   * Set the padding (`[top, right, bottom, left]`).
   *
   * @param {Array<number>|null} padding Padding.
   * @api
   */
  setPadding(padding) {
    this.padding_ = padding;
  }
};
var Text_default = Text;

// node_modules/ol/expr/expression.js
var numTypes = 0;
var BooleanType = 1 << numTypes++;
var NumberType = 1 << numTypes++;
var StringType = 1 << numTypes++;
var ColorType = 1 << numTypes++;
var NumberArrayType = 1 << numTypes++;
var SizeType = 1 << numTypes++;
var AnyType = Math.pow(2, numTypes) - 1;
var typeNames = {
  [BooleanType]: "boolean",
  [NumberType]: "number",
  [StringType]: "string",
  [ColorType]: "color",
  [NumberArrayType]: "number[]",
  [SizeType]: "size"
};
var namedTypes = Object.keys(typeNames).map(Number).sort(ascending);
function isSpecific(type) {
  return type in typeNames;
}
function typeName(type) {
  const names = [];
  for (const namedType of namedTypes) {
    if (includesType(type, namedType)) {
      names.push(typeNames[namedType]);
    }
  }
  if (names.length === 0) {
    return "untyped";
  }
  if (names.length < 3) {
    return names.join(" or ");
  }
  return names.slice(0, -1).join(", ") + ", or " + names[names.length - 1];
}
function includesType(broad, specific) {
  return (broad & specific) === specific;
}
function isType(type, expected) {
  return type === expected;
}
var LiteralExpression = class {
  /**
   * @param {number} type The value type.
   * @param {LiteralValue} value The literal value.
   */
  constructor(type, value) {
    if (!isSpecific(type)) {
      throw new Error(`literal expressions must have a specific type, got ${typeName(type)}`);
    }
    this.type = type;
    this.value = value;
  }
};
var CallExpression = class {
  /**
   * @param {number} type The return type.
   * @param {string} operator The operator.
   * @param {...Expression} args The arguments.
   */
  constructor(type, operator, ...args) {
    this.type = type;
    this.operator = operator;
    this.args = args;
  }
};
function newParsingContext() {
  return {
    variables: /* @__PURE__ */ new Set(),
    properties: /* @__PURE__ */ new Set(),
    featureId: false,
    geometryType: false
  };
}
function parse(encoded, expectedType, context) {
  switch (typeof encoded) {
    case "boolean": {
      if (isType(expectedType, StringType)) {
        return new LiteralExpression(StringType, encoded ? "true" : "false");
      }
      if (!includesType(expectedType, BooleanType)) {
        throw new Error(`got a boolean, but expected ${typeName(expectedType)}`);
      }
      return new LiteralExpression(BooleanType, encoded);
    }
    case "number": {
      if (isType(expectedType, SizeType)) {
        return new LiteralExpression(SizeType, toSize(encoded));
      }
      if (isType(expectedType, BooleanType)) {
        return new LiteralExpression(BooleanType, !!encoded);
      }
      if (isType(expectedType, StringType)) {
        return new LiteralExpression(StringType, encoded.toString());
      }
      if (!includesType(expectedType, NumberType)) {
        throw new Error(`got a number, but expected ${typeName(expectedType)}`);
      }
      return new LiteralExpression(NumberType, encoded);
    }
    case "string": {
      if (isType(expectedType, ColorType)) {
        return new LiteralExpression(ColorType, fromString(encoded));
      }
      if (isType(expectedType, BooleanType)) {
        return new LiteralExpression(BooleanType, !!encoded);
      }
      if (!includesType(expectedType, StringType)) {
        throw new Error(`got a string, but expected ${typeName(expectedType)}`);
      }
      return new LiteralExpression(StringType, encoded);
    }
    default: {
    }
  }
  if (!Array.isArray(encoded)) {
    throw new Error("expression must be an array or a primitive value");
  }
  if (encoded.length === 0) {
    throw new Error("empty expression");
  }
  if (typeof encoded[0] === "string") {
    return parseCallExpression(encoded, expectedType, context);
  }
  for (const item of encoded) {
    if (typeof item !== "number") {
      throw new Error("expected an array of numbers");
    }
  }
  if (isType(expectedType, SizeType)) {
    if (encoded.length !== 2) {
      throw new Error(`expected an array of two values for a size, got ${encoded.length}`);
    }
    return new LiteralExpression(SizeType, encoded);
  }
  if (isType(expectedType, ColorType)) {
    if (encoded.length === 3) {
      return new LiteralExpression(ColorType, [...encoded, 1]);
    }
    if (encoded.length === 4) {
      return new LiteralExpression(ColorType, encoded);
    }
    throw new Error(`expected an array of 3 or 4 values for a color, got ${encoded.length}`);
  }
  if (!includesType(expectedType, NumberArrayType)) {
    throw new Error(`got an array of numbers, but expected ${typeName(expectedType)}`);
  }
  return new LiteralExpression(NumberArrayType, encoded);
}
var Ops = {
  Get: "get",
  Var: "var",
  Concat: "concat",
  GeometryType: "geometry-type",
  LineMetric: "line-metric",
  Any: "any",
  All: "all",
  Not: "!",
  Resolution: "resolution",
  Zoom: "zoom",
  Time: "time",
  Equal: "==",
  NotEqual: "!=",
  GreaterThan: ">",
  GreaterThanOrEqualTo: ">=",
  LessThan: "<",
  LessThanOrEqualTo: "<=",
  Multiply: "*",
  Divide: "/",
  Add: "+",
  Subtract: "-",
  Clamp: "clamp",
  Mod: "%",
  Pow: "^",
  Abs: "abs",
  Floor: "floor",
  Ceil: "ceil",
  Round: "round",
  Sin: "sin",
  Cos: "cos",
  Atan: "atan",
  Sqrt: "sqrt",
  Match: "match",
  Between: "between",
  Interpolate: "interpolate",
  Coalesce: "coalesce",
  Case: "case",
  In: "in",
  Number: "number",
  String: "string",
  Array: "array",
  Color: "color",
  Id: "id",
  Band: "band",
  Palette: "palette",
  ToString: "to-string",
  Has: "has"
};
var parsers = {
  [Ops.Get]: createCallExpressionParser(hasArgsCount(1, Infinity), withGetArgs),
  [Ops.Var]: createCallExpressionParser(hasArgsCount(1, 1), withVarArgs),
  [Ops.Has]: createCallExpressionParser(hasArgsCount(1, Infinity), withGetArgs),
  [Ops.Id]: createCallExpressionParser(usesFeatureId, withNoArgs),
  [Ops.Concat]: createCallExpressionParser(hasArgsCount(2, Infinity), withArgsOfType(StringType)),
  [Ops.GeometryType]: createCallExpressionParser(usesGeometryType, withNoArgs),
  [Ops.LineMetric]: createCallExpressionParser(withNoArgs),
  [Ops.Resolution]: createCallExpressionParser(withNoArgs),
  [Ops.Zoom]: createCallExpressionParser(withNoArgs),
  [Ops.Time]: createCallExpressionParser(withNoArgs),
  [Ops.Any]: createCallExpressionParser(hasArgsCount(2, Infinity), withArgsOfType(BooleanType)),
  [Ops.All]: createCallExpressionParser(hasArgsCount(2, Infinity), withArgsOfType(BooleanType)),
  [Ops.Not]: createCallExpressionParser(hasArgsCount(1, 1), withArgsOfType(BooleanType)),
  [Ops.Equal]: createCallExpressionParser(hasArgsCount(2, 2), withArgsOfType(AnyType)),
  [Ops.NotEqual]: createCallExpressionParser(hasArgsCount(2, 2), withArgsOfType(AnyType)),
  [Ops.GreaterThan]: createCallExpressionParser(hasArgsCount(2, 2), withArgsOfType(NumberType)),
  [Ops.GreaterThanOrEqualTo]: createCallExpressionParser(hasArgsCount(2, 2), withArgsOfType(NumberType)),
  [Ops.LessThan]: createCallExpressionParser(hasArgsCount(2, 2), withArgsOfType(NumberType)),
  [Ops.LessThanOrEqualTo]: createCallExpressionParser(hasArgsCount(2, 2), withArgsOfType(NumberType)),
  [Ops.Multiply]: createCallExpressionParser(hasArgsCount(2, Infinity), withArgsOfReturnType),
  [Ops.Coalesce]: createCallExpressionParser(hasArgsCount(2, Infinity), withArgsOfReturnType),
  [Ops.Divide]: createCallExpressionParser(hasArgsCount(2, 2), withArgsOfType(NumberType)),
  [Ops.Add]: createCallExpressionParser(hasArgsCount(2, Infinity), withArgsOfType(NumberType)),
  [Ops.Subtract]: createCallExpressionParser(hasArgsCount(2, 2), withArgsOfType(NumberType)),
  [Ops.Clamp]: createCallExpressionParser(hasArgsCount(3, 3), withArgsOfType(NumberType)),
  [Ops.Mod]: createCallExpressionParser(hasArgsCount(2, 2), withArgsOfType(NumberType)),
  [Ops.Pow]: createCallExpressionParser(hasArgsCount(2, 2), withArgsOfType(NumberType)),
  [Ops.Abs]: createCallExpressionParser(hasArgsCount(1, 1), withArgsOfType(NumberType)),
  [Ops.Floor]: createCallExpressionParser(hasArgsCount(1, 1), withArgsOfType(NumberType)),
  [Ops.Ceil]: createCallExpressionParser(hasArgsCount(1, 1), withArgsOfType(NumberType)),
  [Ops.Round]: createCallExpressionParser(hasArgsCount(1, 1), withArgsOfType(NumberType)),
  [Ops.Sin]: createCallExpressionParser(hasArgsCount(1, 1), withArgsOfType(NumberType)),
  [Ops.Cos]: createCallExpressionParser(hasArgsCount(1, 1), withArgsOfType(NumberType)),
  [Ops.Atan]: createCallExpressionParser(hasArgsCount(1, 2), withArgsOfType(NumberType)),
  [Ops.Sqrt]: createCallExpressionParser(hasArgsCount(1, 1), withArgsOfType(NumberType)),
  [Ops.Match]: createCallExpressionParser(hasArgsCount(4, Infinity), hasEvenArgs, withMatchArgs),
  [Ops.Between]: createCallExpressionParser(hasArgsCount(3, 3), withArgsOfType(NumberType)),
  [Ops.Interpolate]: createCallExpressionParser(hasArgsCount(6, Infinity), hasEvenArgs, withInterpolateArgs),
  [Ops.Case]: createCallExpressionParser(hasArgsCount(3, Infinity), hasOddArgs, withCaseArgs),
  [Ops.In]: createCallExpressionParser(hasArgsCount(2, 2), withInArgs),
  [Ops.Number]: createCallExpressionParser(hasArgsCount(1, Infinity), withArgsOfType(AnyType)),
  [Ops.String]: createCallExpressionParser(hasArgsCount(1, Infinity), withArgsOfType(AnyType)),
  [Ops.Array]: createCallExpressionParser(hasArgsCount(1, Infinity), withArgsOfType(NumberType)),
  [Ops.Color]: createCallExpressionParser(hasArgsCount(1, 4), withArgsOfType(NumberType)),
  [Ops.Band]: createCallExpressionParser(hasArgsCount(1, 3), withArgsOfType(NumberType)),
  [Ops.Palette]: createCallExpressionParser(hasArgsCount(2, 2), withPaletteArgs),
  [Ops.ToString]: createCallExpressionParser(hasArgsCount(1, 1), withArgsOfType(BooleanType | NumberType | StringType | ColorType))
};
function withGetArgs(encoded, returnType, context) {
  const argsCount = encoded.length - 1;
  const args = new Array(argsCount);
  for (let i = 0; i < argsCount; ++i) {
    const key = encoded[i + 1];
    switch (typeof key) {
      case "number": {
        args[i] = new LiteralExpression(NumberType, key);
        break;
      }
      case "string": {
        args[i] = new LiteralExpression(StringType, key);
        break;
      }
      default: {
        throw new Error(`expected a string key or numeric array index for a get operation, got ${key}`);
      }
    }
    if (i === 0) {
      context.properties.add(String(key));
    }
  }
  return args;
}
function withVarArgs(encoded, returnType, context) {
  const name = encoded[1];
  if (typeof name !== "string") {
    throw new Error("expected a string argument for var operation");
  }
  context.variables.add(name);
  return [new LiteralExpression(StringType, name)];
}
function usesFeatureId(encoded, returnType, context) {
  context.featureId = true;
}
function usesGeometryType(encoded, returnType, context) {
  context.geometryType = true;
}
function withNoArgs(encoded, returnType, context) {
  const operation = encoded[0];
  if (encoded.length !== 1) {
    throw new Error(`expected no arguments for ${operation} operation`);
  }
  return [];
}
function hasArgsCount(minArgs, maxArgs) {
  return function(encoded, returnType, context) {
    const operation = encoded[0];
    const argCount = encoded.length - 1;
    if (minArgs === maxArgs) {
      if (argCount !== minArgs) {
        const plural = minArgs === 1 ? "" : "s";
        throw new Error(`expected ${minArgs} argument${plural} for ${operation}, got ${argCount}`);
      }
    } else if (argCount < minArgs || argCount > maxArgs) {
      const range = maxArgs === Infinity ? `${minArgs} or more` : `${minArgs} to ${maxArgs}`;
      throw new Error(`expected ${range} arguments for ${operation}, got ${argCount}`);
    }
  };
}
function withArgsOfReturnType(encoded, returnType, context) {
  const argCount = encoded.length - 1;
  const args = new Array(argCount);
  for (let i = 0; i < argCount; ++i) {
    const expression = parse(encoded[i + 1], returnType, context);
    args[i] = expression;
  }
  return args;
}
function withArgsOfType(argType) {
  return function(encoded, returnType, context) {
    const argCount = encoded.length - 1;
    const args = new Array(argCount);
    for (let i = 0; i < argCount; ++i) {
      const expression = parse(encoded[i + 1], argType, context);
      args[i] = expression;
    }
    return args;
  };
}
function hasOddArgs(encoded, returnType, context) {
  const operation = encoded[0];
  const argCount = encoded.length - 1;
  if (argCount % 2 === 0) {
    throw new Error(`expected an odd number of arguments for ${operation}, got ${argCount} instead`);
  }
}
function hasEvenArgs(encoded, returnType, context) {
  const operation = encoded[0];
  const argCount = encoded.length - 1;
  if (argCount % 2 === 1) {
    throw new Error(`expected an even number of arguments for operation ${operation}, got ${argCount} instead`);
  }
}
function withMatchArgs(encoded, returnType, context) {
  const argsCount = encoded.length - 1;
  const inputType = StringType | NumberType | BooleanType;
  const input = parse(encoded[1], inputType, context);
  const fallback = parse(encoded[encoded.length - 1], returnType, context);
  const args = new Array(argsCount - 2);
  for (let i = 0; i < argsCount - 2; i += 2) {
    try {
      const match = parse(encoded[i + 2], input.type, context);
      args[i] = match;
    } catch (err) {
      throw new Error(`failed to parse argument ${i + 1} of match expression: ${err.message}`);
    }
    try {
      const output = parse(encoded[i + 3], fallback.type, context);
      args[i + 1] = output;
    } catch (err) {
      throw new Error(`failed to parse argument ${i + 2} of match expression: ${err.message}`);
    }
  }
  return [input, ...args, fallback];
}
function withInterpolateArgs(encoded, returnType, context) {
  const interpolationType = encoded[1];
  let base;
  switch (interpolationType[0]) {
    case "linear":
      base = 1;
      break;
    case "exponential":
      const b = interpolationType[1];
      if (typeof b !== "number" || b <= 0) {
        throw new Error(`expected a number base for exponential interpolation, got ${JSON.stringify(b)} instead`);
      }
      base = b;
      break;
    default:
      throw new Error(`invalid interpolation type: ${JSON.stringify(interpolationType)}`);
  }
  const interpolation = new LiteralExpression(NumberType, base);
  let input;
  try {
    input = parse(encoded[2], NumberType, context);
  } catch (err) {
    throw new Error(`failed to parse argument 1 in interpolate expression: ${err.message}`);
  }
  const args = new Array(encoded.length - 3);
  for (let i = 0; i < args.length; i += 2) {
    try {
      const stop = parse(encoded[i + 3], NumberType, context);
      args[i] = stop;
    } catch (err) {
      throw new Error(`failed to parse argument ${i + 2} for interpolate expression: ${err.message}`);
    }
    try {
      const output = parse(encoded[i + 4], returnType, context);
      args[i + 1] = output;
    } catch (err) {
      throw new Error(`failed to parse argument ${i + 3} for interpolate expression: ${err.message}`);
    }
  }
  return [interpolation, input, ...args];
}
function withCaseArgs(encoded, returnType, context) {
  const fallback = parse(encoded[encoded.length - 1], returnType, context);
  const args = new Array(encoded.length - 1);
  for (let i = 0; i < args.length - 1; i += 2) {
    try {
      const condition = parse(encoded[i + 1], BooleanType, context);
      args[i] = condition;
    } catch (err) {
      throw new Error(`failed to parse argument ${i} of case expression: ${err.message}`);
    }
    try {
      const output = parse(encoded[i + 2], fallback.type, context);
      args[i + 1] = output;
    } catch (err) {
      throw new Error(`failed to parse argument ${i + 1} of case expression: ${err.message}`);
    }
  }
  args[args.length - 1] = fallback;
  return args;
}
function withInArgs(encoded, returnType, context) {
  let haystack = encoded[2];
  if (!Array.isArray(haystack)) {
    throw new Error(`the second argument for the "in" operator must be an array`);
  }
  let needleType;
  if (typeof haystack[0] === "string") {
    if (haystack[0] !== "literal") {
      throw new Error(`for the "in" operator, a string array should be wrapped in a "literal" operator to disambiguate from expressions`);
    }
    if (!Array.isArray(haystack[1])) {
      throw new Error(`failed to parse "in" expression: the literal operator must be followed by an array`);
    }
    haystack = haystack[1];
    needleType = StringType;
  } else {
    needleType = NumberType;
  }
  const args = new Array(haystack.length);
  for (let i = 0; i < args.length; i++) {
    try {
      const arg = parse(haystack[i], needleType, context);
      args[i] = arg;
    } catch (err) {
      throw new Error(`failed to parse haystack item ${i} for "in" expression: ${err.message}`);
    }
  }
  const needle = parse(encoded[1], needleType, context);
  return [needle, ...args];
}
function withPaletteArgs(encoded, returnType, context) {
  let index;
  try {
    index = parse(encoded[1], NumberType, context);
  } catch (err) {
    throw new Error(`failed to parse first argument in palette expression: ${err.message}`);
  }
  const colors = encoded[2];
  if (!Array.isArray(colors)) {
    throw new Error("the second argument of palette must be an array");
  }
  const parsedColors = new Array(colors.length);
  for (let i = 0; i < parsedColors.length; i++) {
    let color;
    try {
      color = parse(colors[i], ColorType, context);
    } catch (err) {
      throw new Error(`failed to parse color at index ${i} in palette expression: ${err.message}`);
    }
    if (!(color instanceof LiteralExpression)) {
      throw new Error(`the palette color at index ${i} must be a literal value`);
    }
    parsedColors[i] = color;
  }
  return [index, ...parsedColors];
}
function createCallExpressionParser(...validators) {
  return function(encoded, returnType, context) {
    const operator = encoded[0];
    let args;
    for (let i = 0; i < validators.length; i++) {
      const parsed = validators[i](encoded, returnType, context);
      if (i == validators.length - 1) {
        if (!parsed) {
          throw new Error("expected last argument validator to return the parsed args");
        }
        args = parsed;
      }
    }
    return new CallExpression(returnType, operator, ...args);
  };
}
function parseCallExpression(encoded, returnType, context) {
  const operator = encoded[0];
  const parser = parsers[operator];
  if (!parser) {
    throw new Error(`unknown operator: ${operator}`);
  }
  return parser(encoded, returnType, context);
}
function computeGeometryType(geometry) {
  if (!geometry) {
    return "";
  }
  const type = geometry.getType();
  switch (type) {
    case "Point":
    case "LineString":
    case "Polygon":
      return type;
    case "MultiPoint":
    case "MultiLineString":
    case "MultiPolygon":
      return (
        /** @type {'Point'|'LineString'|'Polygon'} */
        type.substring(5)
      );
    case "Circle":
      return "Polygon";
    case "GeometryCollection":
      return computeGeometryType(
        /** @type {import("../geom/GeometryCollection.js").default} */
        geometry.getGeometries()[0]
      );
    default:
      return "";
  }
}

// node_modules/ol/expr/cpu.js
function newEvaluationContext() {
  return {
    variables: {},
    properties: {},
    resolution: NaN,
    featureId: null,
    geometryType: ""
  };
}
function buildExpression(encoded, type, context) {
  const expression = parse(encoded, type, context);
  return compileExpression(expression, context);
}
function compileExpression(expression, context) {
  if (expression instanceof LiteralExpression) {
    if (expression.type === ColorType && typeof expression.value === "string") {
      const colorValue = fromString(expression.value);
      return function() {
        return colorValue;
      };
    }
    return function() {
      return expression.value;
    };
  }
  const operator = expression.operator;
  switch (operator) {
    case Ops.Number:
    case Ops.String:
    case Ops.Coalesce: {
      return compileAssertionExpression(expression, context);
    }
    case Ops.Get:
    case Ops.Var:
    case Ops.Has: {
      return compileAccessorExpression(expression, context);
    }
    case Ops.Id: {
      return (context2) => context2.featureId;
    }
    case Ops.GeometryType: {
      return (context2) => context2.geometryType;
    }
    case Ops.Concat: {
      const args = expression.args.map((e) => compileExpression(e, context));
      return (context2) => "".concat(...args.map((arg) => arg(context2).toString()));
    }
    case Ops.Resolution: {
      return (context2) => context2.resolution;
    }
    case Ops.Any:
    case Ops.All:
    case Ops.Between:
    case Ops.In:
    case Ops.Not: {
      return compileLogicalExpression(expression, context);
    }
    case Ops.Equal:
    case Ops.NotEqual:
    case Ops.LessThan:
    case Ops.LessThanOrEqualTo:
    case Ops.GreaterThan:
    case Ops.GreaterThanOrEqualTo: {
      return compileComparisonExpression(expression, context);
    }
    case Ops.Multiply:
    case Ops.Divide:
    case Ops.Add:
    case Ops.Subtract:
    case Ops.Clamp:
    case Ops.Mod:
    case Ops.Pow:
    case Ops.Abs:
    case Ops.Floor:
    case Ops.Ceil:
    case Ops.Round:
    case Ops.Sin:
    case Ops.Cos:
    case Ops.Atan:
    case Ops.Sqrt: {
      return compileNumericExpression(expression, context);
    }
    case Ops.Case: {
      return compileCaseExpression(expression, context);
    }
    case Ops.Match: {
      return compileMatchExpression(expression, context);
    }
    case Ops.Interpolate: {
      return compileInterpolateExpression(expression, context);
    }
    case Ops.ToString: {
      return compileConvertExpression(expression, context);
    }
    default: {
      throw new Error(`Unsupported operator ${operator}`);
    }
  }
}
function compileAssertionExpression(expression, context) {
  const type = expression.operator;
  const length = expression.args.length;
  const args = new Array(length);
  for (let i = 0; i < length; ++i) {
    args[i] = compileExpression(expression.args[i], context);
  }
  switch (type) {
    case Ops.Coalesce: {
      return (context2) => {
        for (let i = 0; i < length; ++i) {
          const value = args[i](context2);
          if (typeof value !== "undefined" && value !== null) {
            return value;
          }
        }
        throw new Error("Expected one of the values to be non-null");
      };
    }
    case Ops.Number:
    case Ops.String: {
      return (context2) => {
        for (let i = 0; i < length; ++i) {
          const value = args[i](context2);
          if (typeof value === type) {
            return value;
          }
        }
        throw new Error(`Expected one of the values to be a ${type}`);
      };
    }
    default: {
      throw new Error(`Unsupported assertion operator ${type}`);
    }
  }
}
function compileAccessorExpression(expression, context) {
  const nameExpression = (
    /** @type {LiteralExpression} */
    expression.args[0]
  );
  const name = (
    /** @type {string} */
    nameExpression.value
  );
  switch (expression.operator) {
    case Ops.Get: {
      return (context2) => {
        const args = expression.args;
        let value = context2.properties[name];
        for (let i = 1, ii = args.length; i < ii; ++i) {
          const keyExpression = (
            /** @type {LiteralExpression} */
            args[i]
          );
          const key = (
            /** @type {string|number} */
            keyExpression.value
          );
          value = value[key];
        }
        return value;
      };
    }
    case Ops.Var: {
      return (context2) => context2.variables[name];
    }
    case Ops.Has: {
      return (context2) => {
        const args = expression.args;
        if (!(name in context2.properties)) {
          return false;
        }
        let value = context2.properties[name];
        for (let i = 1, ii = args.length; i < ii; ++i) {
          const keyExpression = (
            /** @type {LiteralExpression} */
            args[i]
          );
          const key = (
            /** @type {string|number} */
            keyExpression.value
          );
          if (!value || !Object.hasOwn(value, key)) {
            return false;
          }
          value = value[key];
        }
        return true;
      };
    }
    default: {
      throw new Error(`Unsupported accessor operator ${expression.operator}`);
    }
  }
}
function compileComparisonExpression(expression, context) {
  const op = expression.operator;
  const left = compileExpression(expression.args[0], context);
  const right = compileExpression(expression.args[1], context);
  switch (op) {
    case Ops.Equal: {
      return (context2) => left(context2) === right(context2);
    }
    case Ops.NotEqual: {
      return (context2) => left(context2) !== right(context2);
    }
    case Ops.LessThan: {
      return (context2) => left(context2) < right(context2);
    }
    case Ops.LessThanOrEqualTo: {
      return (context2) => left(context2) <= right(context2);
    }
    case Ops.GreaterThan: {
      return (context2) => left(context2) > right(context2);
    }
    case Ops.GreaterThanOrEqualTo: {
      return (context2) => left(context2) >= right(context2);
    }
    default: {
      throw new Error(`Unsupported comparison operator ${op}`);
    }
  }
}
function compileLogicalExpression(expression, context) {
  const op = expression.operator;
  const length = expression.args.length;
  const args = new Array(length);
  for (let i = 0; i < length; ++i) {
    args[i] = compileExpression(expression.args[i], context);
  }
  switch (op) {
    case Ops.Any: {
      return (context2) => {
        for (let i = 0; i < length; ++i) {
          if (args[i](context2)) {
            return true;
          }
        }
        return false;
      };
    }
    case Ops.All: {
      return (context2) => {
        for (let i = 0; i < length; ++i) {
          if (!args[i](context2)) {
            return false;
          }
        }
        return true;
      };
    }
    case Ops.Between: {
      return (context2) => {
        const value = args[0](context2);
        const min = args[1](context2);
        const max = args[2](context2);
        return value >= min && value <= max;
      };
    }
    case Ops.In: {
      return (context2) => {
        const value = args[0](context2);
        for (let i = 1; i < length; ++i) {
          if (value === args[i](context2)) {
            return true;
          }
        }
        return false;
      };
    }
    case Ops.Not: {
      return (context2) => !args[0](context2);
    }
    default: {
      throw new Error(`Unsupported logical operator ${op}`);
    }
  }
}
function compileNumericExpression(expression, context) {
  const op = expression.operator;
  const length = expression.args.length;
  const args = new Array(length);
  for (let i = 0; i < length; ++i) {
    args[i] = compileExpression(expression.args[i], context);
  }
  switch (op) {
    case Ops.Multiply: {
      return (context2) => {
        let value = 1;
        for (let i = 0; i < length; ++i) {
          value *= args[i](context2);
        }
        return value;
      };
    }
    case Ops.Divide: {
      return (context2) => args[0](context2) / args[1](context2);
    }
    case Ops.Add: {
      return (context2) => {
        let value = 0;
        for (let i = 0; i < length; ++i) {
          value += args[i](context2);
        }
        return value;
      };
    }
    case Ops.Subtract: {
      return (context2) => args[0](context2) - args[1](context2);
    }
    case Ops.Clamp: {
      return (context2) => {
        const value = args[0](context2);
        const min = args[1](context2);
        if (value < min) {
          return min;
        }
        const max = args[2](context2);
        if (value > max) {
          return max;
        }
        return value;
      };
    }
    case Ops.Mod: {
      return (context2) => args[0](context2) % args[1](context2);
    }
    case Ops.Pow: {
      return (context2) => Math.pow(args[0](context2), args[1](context2));
    }
    case Ops.Abs: {
      return (context2) => Math.abs(args[0](context2));
    }
    case Ops.Floor: {
      return (context2) => Math.floor(args[0](context2));
    }
    case Ops.Ceil: {
      return (context2) => Math.ceil(args[0](context2));
    }
    case Ops.Round: {
      return (context2) => Math.round(args[0](context2));
    }
    case Ops.Sin: {
      return (context2) => Math.sin(args[0](context2));
    }
    case Ops.Cos: {
      return (context2) => Math.cos(args[0](context2));
    }
    case Ops.Atan: {
      if (length === 2) {
        return (context2) => Math.atan2(args[0](context2), args[1](context2));
      }
      return (context2) => Math.atan(args[0](context2));
    }
    case Ops.Sqrt: {
      return (context2) => Math.sqrt(args[0](context2));
    }
    default: {
      throw new Error(`Unsupported numeric operator ${op}`);
    }
  }
}
function compileCaseExpression(expression, context) {
  const length = expression.args.length;
  const args = new Array(length);
  for (let i = 0; i < length; ++i) {
    args[i] = compileExpression(expression.args[i], context);
  }
  return (context2) => {
    for (let i = 0; i < length - 1; i += 2) {
      const condition = args[i](context2);
      if (condition) {
        return args[i + 1](context2);
      }
    }
    return args[length - 1](context2);
  };
}
function compileMatchExpression(expression, context) {
  const length = expression.args.length;
  const args = new Array(length);
  for (let i = 0; i < length; ++i) {
    args[i] = compileExpression(expression.args[i], context);
  }
  return (context2) => {
    const value = args[0](context2);
    for (let i = 1; i < length; i += 2) {
      if (value === args[i](context2)) {
        return args[i + 1](context2);
      }
    }
    return args[length - 1](context2);
  };
}
function compileInterpolateExpression(expression, context) {
  const length = expression.args.length;
  const args = new Array(length);
  for (let i = 0; i < length; ++i) {
    args[i] = compileExpression(expression.args[i], context);
  }
  return (context2) => {
    const base = args[0](context2);
    const value = args[1](context2);
    let previousInput;
    let previousOutput;
    for (let i = 2; i < length; i += 2) {
      const input = args[i](context2);
      let output = args[i + 1](context2);
      const isColor = Array.isArray(output);
      if (isColor) {
        output = withAlpha(output);
      }
      if (input >= value) {
        if (i === 2) {
          return output;
        }
        if (isColor) {
          return interpolateColor(base, value, previousInput, previousOutput, input, output);
        }
        return interpolateNumber(base, value, previousInput, previousOutput, input, output);
      }
      previousInput = input;
      previousOutput = output;
    }
    return previousOutput;
  };
}
function compileConvertExpression(expression, context) {
  const op = expression.operator;
  const length = expression.args.length;
  const args = new Array(length);
  for (let i = 0; i < length; ++i) {
    args[i] = compileExpression(expression.args[i], context);
  }
  switch (op) {
    case Ops.ToString: {
      return (context2) => {
        const value = args[0](context2);
        if (expression.args[0].type === ColorType) {
          return toString(value);
        }
        return value.toString();
      };
    }
    default: {
      throw new Error(`Unsupported convert operator ${op}`);
    }
  }
}
function interpolateNumber(base, value, input1, output1, input2, output2) {
  const delta = input2 - input1;
  if (delta === 0) {
    return output1;
  }
  const along = value - input1;
  const factor = base === 1 ? along / delta : (Math.pow(base, along) - 1) / (Math.pow(base, delta) - 1);
  return output1 + factor * (output2 - output1);
}
function interpolateColor(base, value, input1, rgba1, input2, rgba2) {
  const delta = input2 - input1;
  if (delta === 0) {
    return rgba1;
  }
  const lcha1 = rgbaToLcha(rgba1);
  const lcha2 = rgbaToLcha(rgba2);
  let deltaHue = lcha2[2] - lcha1[2];
  if (deltaHue > 180) {
    deltaHue -= 360;
  } else if (deltaHue < -180) {
    deltaHue += 360;
  }
  const lcha = [interpolateNumber(base, value, input1, lcha1[0], input2, lcha2[0]), interpolateNumber(base, value, input1, lcha1[1], input2, lcha2[1]), lcha1[2] + interpolateNumber(base, value, input1, 0, input2, deltaHue), interpolateNumber(base, value, input1, rgba1[3], input2, rgba2[3])];
  return normalize(lchaToRgba(lcha));
}

// node_modules/ol/render/canvas/style.js
function always(context) {
  return true;
}
function rulesToStyleFunction(rules) {
  const parsingContext = newParsingContext();
  const evaluator = buildRuleSet(rules, parsingContext);
  const evaluationContext = newEvaluationContext();
  return function(feature, resolution) {
    evaluationContext.properties = feature.getPropertiesInternal();
    evaluationContext.resolution = resolution;
    if (parsingContext.featureId) {
      const id = feature.getId();
      if (id !== void 0) {
        evaluationContext.featureId = id;
      } else {
        evaluationContext.featureId = null;
      }
    }
    if (parsingContext.geometryType) {
      evaluationContext.geometryType = computeGeometryType(feature.getGeometry());
    }
    return evaluator(evaluationContext);
  };
}
function flatStylesToStyleFunction(flatStyles) {
  const parsingContext = newParsingContext();
  const length = flatStyles.length;
  const evaluators = new Array(length);
  for (let i = 0; i < length; ++i) {
    evaluators[i] = buildStyle(flatStyles[i], parsingContext);
  }
  const evaluationContext = newEvaluationContext();
  const styles = new Array(length);
  return function(feature, resolution) {
    evaluationContext.properties = feature.getPropertiesInternal();
    evaluationContext.resolution = resolution;
    if (parsingContext.featureId) {
      const id = feature.getId();
      if (id !== void 0) {
        evaluationContext.featureId = id;
      } else {
        evaluationContext.featureId = null;
      }
    }
    let nonNullCount = 0;
    for (let i = 0; i < length; ++i) {
      const style = evaluators[i](evaluationContext);
      if (style) {
        styles[nonNullCount] = style;
        nonNullCount += 1;
      }
    }
    styles.length = nonNullCount;
    return styles;
  };
}
function buildRuleSet(rules, context) {
  const length = rules.length;
  const compiledRules = new Array(length);
  for (let i = 0; i < length; ++i) {
    const rule = rules[i];
    const filter = "filter" in rule ? buildExpression(rule.filter, BooleanType, context) : always;
    let styles;
    if (Array.isArray(rule.style)) {
      const styleLength = rule.style.length;
      styles = new Array(styleLength);
      for (let j = 0; j < styleLength; ++j) {
        styles[j] = buildStyle(rule.style[j], context);
      }
    } else {
      styles = [buildStyle(rule.style, context)];
    }
    compiledRules[i] = {
      filter,
      styles
    };
  }
  return function(context2) {
    const styles = [];
    let someMatched = false;
    for (let i = 0; i < length; ++i) {
      const filterEvaluator = compiledRules[i].filter;
      if (!filterEvaluator(context2)) {
        continue;
      }
      if (rules[i].else && someMatched) {
        continue;
      }
      someMatched = true;
      for (const styleEvaluator of compiledRules[i].styles) {
        const style = styleEvaluator(context2);
        if (!style) {
          continue;
        }
        styles.push(style);
      }
    }
    return styles;
  };
}
function buildStyle(flatStyle, context) {
  const evaluateFill = buildFill(flatStyle, "", context);
  const evaluateStroke = buildStroke(flatStyle, "", context);
  const evaluateText = buildText(flatStyle, context);
  const evaluateImage = buildImage(flatStyle, context);
  const evaluateZIndex = numberEvaluator(flatStyle, "z-index", context);
  if (!evaluateFill && !evaluateStroke && !evaluateText && !evaluateImage && !isEmpty(flatStyle)) {
    throw new Error("No fill, stroke, point, or text symbolizer properties in style: " + JSON.stringify(flatStyle));
  }
  const style = new Style_default();
  return function(context2) {
    let empty = true;
    if (evaluateFill) {
      const fill = evaluateFill(context2);
      if (fill) {
        empty = false;
      }
      style.setFill(fill);
    }
    if (evaluateStroke) {
      const stroke = evaluateStroke(context2);
      if (stroke) {
        empty = false;
      }
      style.setStroke(stroke);
    }
    if (evaluateText) {
      const text = evaluateText(context2);
      if (text) {
        empty = false;
      }
      style.setText(text);
    }
    if (evaluateImage) {
      const image = evaluateImage(context2);
      if (image) {
        empty = false;
      }
      style.setImage(image);
    }
    if (evaluateZIndex) {
      style.setZIndex(evaluateZIndex(context2));
    }
    if (empty) {
      return null;
    }
    return style;
  };
}
function buildFill(flatStyle, prefix, context) {
  let evaluateColor;
  if (prefix + "fill-pattern-src" in flatStyle) {
    evaluateColor = patternEvaluator(flatStyle, prefix + "fill-", context);
  } else {
    if (flatStyle[prefix + "fill-color"] === "none") {
      return (context2) => null;
    }
    evaluateColor = colorLikeEvaluator(flatStyle, prefix + "fill-color", context);
  }
  if (!evaluateColor) {
    return null;
  }
  const fill = new Fill_default();
  return function(context2) {
    const color = evaluateColor(context2);
    if (color === NO_COLOR) {
      return null;
    }
    fill.setColor(color);
    return fill;
  };
}
function buildStroke(flatStyle, prefix, context) {
  const evaluateWidth = numberEvaluator(flatStyle, prefix + "stroke-width", context);
  const evaluateColor = colorLikeEvaluator(flatStyle, prefix + "stroke-color", context);
  if (!evaluateWidth && !evaluateColor) {
    return null;
  }
  const evaluateLineCap = stringEvaluator(flatStyle, prefix + "stroke-line-cap", context);
  const evaluateLineJoin = stringEvaluator(flatStyle, prefix + "stroke-line-join", context);
  const evaluateLineDash = numberArrayEvaluator(flatStyle, prefix + "stroke-line-dash", context);
  const evaluateLineDashOffset = numberEvaluator(flatStyle, prefix + "stroke-line-dash-offset", context);
  const evaluateMiterLimit = numberEvaluator(flatStyle, prefix + "stroke-miter-limit", context);
  const stroke = new Stroke_default();
  return function(context2) {
    if (evaluateColor) {
      const color = evaluateColor(context2);
      if (color === NO_COLOR) {
        return null;
      }
      stroke.setColor(color);
    }
    if (evaluateWidth) {
      stroke.setWidth(evaluateWidth(context2));
    }
    if (evaluateLineCap) {
      const lineCap = evaluateLineCap(context2);
      if (lineCap !== "butt" && lineCap !== "round" && lineCap !== "square") {
        throw new Error("Expected butt, round, or square line cap");
      }
      stroke.setLineCap(lineCap);
    }
    if (evaluateLineJoin) {
      const lineJoin = evaluateLineJoin(context2);
      if (lineJoin !== "bevel" && lineJoin !== "round" && lineJoin !== "miter") {
        throw new Error("Expected bevel, round, or miter line join");
      }
      stroke.setLineJoin(lineJoin);
    }
    if (evaluateLineDash) {
      stroke.setLineDash(evaluateLineDash(context2));
    }
    if (evaluateLineDashOffset) {
      stroke.setLineDashOffset(evaluateLineDashOffset(context2));
    }
    if (evaluateMiterLimit) {
      stroke.setMiterLimit(evaluateMiterLimit(context2));
    }
    return stroke;
  };
}
function buildText(flatStyle, context) {
  const prefix = "text-";
  const evaluateValue = stringEvaluator(flatStyle, prefix + "value", context);
  if (!evaluateValue) {
    return null;
  }
  const evaluateFill = buildFill(flatStyle, prefix, context);
  const evaluateBackgroundFill = buildFill(flatStyle, prefix + "background-", context);
  const evaluateStroke = buildStroke(flatStyle, prefix, context);
  const evaluateBackgroundStroke = buildStroke(flatStyle, prefix + "background-", context);
  const evaluateFont = stringEvaluator(flatStyle, prefix + "font", context);
  const evaluateMaxAngle = numberEvaluator(flatStyle, prefix + "max-angle", context);
  const evaluateOffsetX = numberEvaluator(flatStyle, prefix + "offset-x", context);
  const evaluateOffsetY = numberEvaluator(flatStyle, prefix + "offset-y", context);
  const evaluateOverflow = booleanEvaluator(flatStyle, prefix + "overflow", context);
  const evaluatePlacement = stringEvaluator(flatStyle, prefix + "placement", context);
  const evaluateRepeat = numberEvaluator(flatStyle, prefix + "repeat", context);
  const evaluateScale = sizeLikeEvaluator(flatStyle, prefix + "scale", context);
  const evaluateRotateWithView = booleanEvaluator(flatStyle, prefix + "rotate-with-view", context);
  const evaluateRotation = numberEvaluator(flatStyle, prefix + "rotation", context);
  const evaluateAlign = stringEvaluator(flatStyle, prefix + "align", context);
  const evaluateJustify = stringEvaluator(flatStyle, prefix + "justify", context);
  const evaluateBaseline = stringEvaluator(flatStyle, prefix + "baseline", context);
  const evaluateKeepUpright = booleanEvaluator(flatStyle, prefix + "keep-upright", context);
  const evaluatePadding = numberArrayEvaluator(flatStyle, prefix + "padding", context);
  const declutterMode = optionalDeclutterMode(flatStyle, prefix + "declutter-mode");
  const text = new Text_default({
    declutterMode
  });
  return function(context2) {
    text.setText(evaluateValue(context2));
    if (evaluateFill) {
      text.setFill(evaluateFill(context2));
    }
    if (evaluateBackgroundFill) {
      text.setBackgroundFill(evaluateBackgroundFill(context2));
    }
    if (evaluateStroke) {
      text.setStroke(evaluateStroke(context2));
    }
    if (evaluateBackgroundStroke) {
      text.setBackgroundStroke(evaluateBackgroundStroke(context2));
    }
    if (evaluateFont) {
      text.setFont(evaluateFont(context2));
    }
    if (evaluateMaxAngle) {
      text.setMaxAngle(evaluateMaxAngle(context2));
    }
    if (evaluateOffsetX) {
      text.setOffsetX(evaluateOffsetX(context2));
    }
    if (evaluateOffsetY) {
      text.setOffsetY(evaluateOffsetY(context2));
    }
    if (evaluateOverflow) {
      text.setOverflow(evaluateOverflow(context2));
    }
    if (evaluatePlacement) {
      const placement = evaluatePlacement(context2);
      if (placement !== "point" && placement !== "line") {
        throw new Error("Expected point or line for text-placement");
      }
      text.setPlacement(placement);
    }
    if (evaluateRepeat) {
      text.setRepeat(evaluateRepeat(context2));
    }
    if (evaluateScale) {
      text.setScale(evaluateScale(context2));
    }
    if (evaluateRotateWithView) {
      text.setRotateWithView(evaluateRotateWithView(context2));
    }
    if (evaluateRotation) {
      text.setRotation(evaluateRotation(context2));
    }
    if (evaluateAlign) {
      const textAlign = evaluateAlign(context2);
      if (textAlign !== "left" && textAlign !== "center" && textAlign !== "right" && textAlign !== "end" && textAlign !== "start") {
        throw new Error("Expected left, right, center, start, or end for text-align");
      }
      text.setTextAlign(textAlign);
    }
    if (evaluateJustify) {
      const justify = evaluateJustify(context2);
      if (justify !== "left" && justify !== "right" && justify !== "center") {
        throw new Error("Expected left, right, or center for text-justify");
      }
      text.setJustify(justify);
    }
    if (evaluateBaseline) {
      const textBaseline = evaluateBaseline(context2);
      if (textBaseline !== "bottom" && textBaseline !== "top" && textBaseline !== "middle" && textBaseline !== "alphabetic" && textBaseline !== "hanging") {
        throw new Error("Expected bottom, top, middle, alphabetic, or hanging for text-baseline");
      }
      text.setTextBaseline(textBaseline);
    }
    if (evaluatePadding) {
      text.setPadding(evaluatePadding(context2));
    }
    if (evaluateKeepUpright) {
      text.setKeepUpright(evaluateKeepUpright(context2));
    }
    return text;
  };
}
function buildImage(flatStyle, context) {
  if ("icon-src" in flatStyle) {
    return buildIcon(flatStyle, context);
  }
  if ("shape-points" in flatStyle) {
    return buildShape(flatStyle, context);
  }
  if ("circle-radius" in flatStyle) {
    return buildCircle(flatStyle, context);
  }
  return null;
}
function buildIcon(flatStyle, context) {
  const prefix = "icon-";
  const srcName = prefix + "src";
  const src = requireString(flatStyle[srcName], srcName);
  const evaluateAnchor = coordinateEvaluator(flatStyle, prefix + "anchor", context);
  const evaluateScale = sizeLikeEvaluator(flatStyle, prefix + "scale", context);
  const evaluateOpacity = numberEvaluator(flatStyle, prefix + "opacity", context);
  const evaluateDisplacement = coordinateEvaluator(flatStyle, prefix + "displacement", context);
  const evaluateRotation = numberEvaluator(flatStyle, prefix + "rotation", context);
  const evaluateRotateWithView = booleanEvaluator(flatStyle, prefix + "rotate-with-view", context);
  const anchorOrigin = optionalIconOrigin(flatStyle, prefix + "anchor-origin");
  const anchorXUnits = optionalIconAnchorUnits(flatStyle, prefix + "anchor-x-units");
  const anchorYUnits = optionalIconAnchorUnits(flatStyle, prefix + "anchor-y-units");
  const color = optionalColorLike(flatStyle, prefix + "color");
  const crossOrigin = optionalString(flatStyle, prefix + "cross-origin");
  const offset = optionalNumberArray(flatStyle, prefix + "offset");
  const offsetOrigin = optionalIconOrigin(flatStyle, prefix + "offset-origin");
  const width = optionalNumber(flatStyle, prefix + "width");
  const height = optionalNumber(flatStyle, prefix + "height");
  const size = optionalSize(flatStyle, prefix + "size");
  const declutterMode = optionalDeclutterMode(flatStyle, prefix + "declutter-mode");
  const icon = new Icon_default({
    src,
    anchorOrigin,
    anchorXUnits,
    anchorYUnits,
    color,
    crossOrigin,
    offset,
    offsetOrigin,
    height,
    width,
    size,
    declutterMode
  });
  return function(context2) {
    if (evaluateOpacity) {
      icon.setOpacity(evaluateOpacity(context2));
    }
    if (evaluateDisplacement) {
      icon.setDisplacement(evaluateDisplacement(context2));
    }
    if (evaluateRotation) {
      icon.setRotation(evaluateRotation(context2));
    }
    if (evaluateRotateWithView) {
      icon.setRotateWithView(evaluateRotateWithView(context2));
    }
    if (evaluateScale) {
      icon.setScale(evaluateScale(context2));
    }
    if (evaluateAnchor) {
      icon.setAnchor(evaluateAnchor(context2));
    }
    return icon;
  };
}
function buildShape(flatStyle, context) {
  const prefix = "shape-";
  const pointsName = prefix + "points";
  const radiusName = prefix + "radius";
  const points = requireNumber(flatStyle[pointsName], pointsName);
  const radius = requireNumber(flatStyle[radiusName], radiusName);
  const evaluateFill = buildFill(flatStyle, prefix, context);
  const evaluateStroke = buildStroke(flatStyle, prefix, context);
  const evaluateScale = sizeLikeEvaluator(flatStyle, prefix + "scale", context);
  const evaluateDisplacement = coordinateEvaluator(flatStyle, prefix + "displacement", context);
  const evaluateRotation = numberEvaluator(flatStyle, prefix + "rotation", context);
  const evaluateRotateWithView = booleanEvaluator(flatStyle, prefix + "rotate-with-view", context);
  const radius2 = optionalNumber(flatStyle, prefix + "radius2");
  const angle = optionalNumber(flatStyle, prefix + "angle");
  const declutterMode = optionalDeclutterMode(flatStyle, prefix + "declutter-mode");
  const shape = new RegularShape_default({
    points,
    radius,
    radius2,
    angle,
    declutterMode
  });
  return function(context2) {
    if (evaluateFill) {
      shape.setFill(evaluateFill(context2));
    }
    if (evaluateStroke) {
      shape.setStroke(evaluateStroke(context2));
    }
    if (evaluateDisplacement) {
      shape.setDisplacement(evaluateDisplacement(context2));
    }
    if (evaluateRotation) {
      shape.setRotation(evaluateRotation(context2));
    }
    if (evaluateRotateWithView) {
      shape.setRotateWithView(evaluateRotateWithView(context2));
    }
    if (evaluateScale) {
      shape.setScale(evaluateScale(context2));
    }
    return shape;
  };
}
function buildCircle(flatStyle, context) {
  const prefix = "circle-";
  const evaluateFill = buildFill(flatStyle, prefix, context);
  const evaluateStroke = buildStroke(flatStyle, prefix, context);
  const evaluateRadius = numberEvaluator(flatStyle, prefix + "radius", context);
  const evaluateScale = sizeLikeEvaluator(flatStyle, prefix + "scale", context);
  const evaluateDisplacement = coordinateEvaluator(flatStyle, prefix + "displacement", context);
  const evaluateRotation = numberEvaluator(flatStyle, prefix + "rotation", context);
  const evaluateRotateWithView = booleanEvaluator(flatStyle, prefix + "rotate-with-view", context);
  const declutterMode = optionalDeclutterMode(flatStyle, prefix + "declutter-mode");
  const circle = new Circle_default({
    radius: 5,
    // this is arbitrary, but required - the evaluated radius is used below
    declutterMode
  });
  return function(context2) {
    if (evaluateRadius) {
      circle.setRadius(evaluateRadius(context2));
    }
    if (evaluateFill) {
      circle.setFill(evaluateFill(context2));
    }
    if (evaluateStroke) {
      circle.setStroke(evaluateStroke(context2));
    }
    if (evaluateDisplacement) {
      circle.setDisplacement(evaluateDisplacement(context2));
    }
    if (evaluateRotation) {
      circle.setRotation(evaluateRotation(context2));
    }
    if (evaluateRotateWithView) {
      circle.setRotateWithView(evaluateRotateWithView(context2));
    }
    if (evaluateScale) {
      circle.setScale(evaluateScale(context2));
    }
    return circle;
  };
}
function numberEvaluator(flatStyle, name, context) {
  if (!(name in flatStyle)) {
    return void 0;
  }
  const evaluator = buildExpression(flatStyle[name], NumberType, context);
  return function(context2) {
    return requireNumber(evaluator(context2), name);
  };
}
function stringEvaluator(flatStyle, name, context) {
  if (!(name in flatStyle)) {
    return null;
  }
  const evaluator = buildExpression(flatStyle[name], StringType, context);
  return function(context2) {
    return requireString(evaluator(context2), name);
  };
}
function patternEvaluator(flatStyle, prefix, context) {
  const srcEvaluator = stringEvaluator(flatStyle, prefix + "pattern-src", context);
  const offsetEvaluator = sizeEvaluator(flatStyle, prefix + "pattern-offset", context);
  const patternSizeEvaluator = sizeEvaluator(flatStyle, prefix + "pattern-size", context);
  const colorEvaluator = colorLikeEvaluator(flatStyle, prefix + "color", context);
  return function(context2) {
    return {
      src: srcEvaluator(context2),
      offset: offsetEvaluator && offsetEvaluator(context2),
      size: patternSizeEvaluator && patternSizeEvaluator(context2),
      color: colorEvaluator && colorEvaluator(context2)
    };
  };
}
function booleanEvaluator(flatStyle, name, context) {
  if (!(name in flatStyle)) {
    return null;
  }
  const evaluator = buildExpression(flatStyle[name], BooleanType, context);
  return function(context2) {
    const value = evaluator(context2);
    if (typeof value !== "boolean") {
      throw new Error(`Expected a boolean for ${name}`);
    }
    return value;
  };
}
function colorLikeEvaluator(flatStyle, name, context) {
  if (!(name in flatStyle)) {
    return null;
  }
  const evaluator = buildExpression(flatStyle[name], ColorType, context);
  return function(context2) {
    return requireColorLike(evaluator(context2), name);
  };
}
function numberArrayEvaluator(flatStyle, name, context) {
  if (!(name in flatStyle)) {
    return null;
  }
  const evaluator = buildExpression(flatStyle[name], NumberArrayType, context);
  return function(context2) {
    return requireNumberArray(evaluator(context2), name);
  };
}
function coordinateEvaluator(flatStyle, name, context) {
  if (!(name in flatStyle)) {
    return null;
  }
  const evaluator = buildExpression(flatStyle[name], NumberArrayType, context);
  return function(context2) {
    const array = requireNumberArray(evaluator(context2), name);
    if (array.length !== 2) {
      throw new Error(`Expected two numbers for ${name}`);
    }
    return array;
  };
}
function sizeEvaluator(flatStyle, name, context) {
  if (!(name in flatStyle)) {
    return null;
  }
  const evaluator = buildExpression(flatStyle[name], NumberArrayType, context);
  return function(context2) {
    return requireSize(evaluator(context2), name);
  };
}
function sizeLikeEvaluator(flatStyle, name, context) {
  if (!(name in flatStyle)) {
    return null;
  }
  const evaluator = buildExpression(flatStyle[name], NumberArrayType | NumberType, context);
  return function(context2) {
    return requireSizeLike(evaluator(context2), name);
  };
}
function optionalNumber(flatStyle, property) {
  const value = flatStyle[property];
  if (value === void 0) {
    return void 0;
  }
  if (typeof value !== "number") {
    throw new Error(`Expected a number for ${property}`);
  }
  return value;
}
function optionalSize(flatStyle, property) {
  const encoded = flatStyle[property];
  if (encoded === void 0) {
    return void 0;
  }
  if (typeof encoded === "number") {
    return toSize(encoded);
  }
  if (!Array.isArray(encoded)) {
    throw new Error(`Expected a number or size array for ${property}`);
  }
  if (encoded.length !== 2 || typeof encoded[0] !== "number" || typeof encoded[1] !== "number") {
    throw new Error(`Expected a number or size array for ${property}`);
  }
  return encoded;
}
function optionalString(flatStyle, property) {
  const encoded = flatStyle[property];
  if (encoded === void 0) {
    return void 0;
  }
  if (typeof encoded !== "string") {
    throw new Error(`Expected a string for ${property}`);
  }
  return encoded;
}
function optionalIconOrigin(flatStyle, property) {
  const encoded = flatStyle[property];
  if (encoded === void 0) {
    return void 0;
  }
  if (encoded !== "bottom-left" && encoded !== "bottom-right" && encoded !== "top-left" && encoded !== "top-right") {
    throw new Error(`Expected bottom-left, bottom-right, top-left, or top-right for ${property}`);
  }
  return encoded;
}
function optionalIconAnchorUnits(flatStyle, property) {
  const encoded = flatStyle[property];
  if (encoded === void 0) {
    return void 0;
  }
  if (encoded !== "pixels" && encoded !== "fraction") {
    throw new Error(`Expected pixels or fraction for ${property}`);
  }
  return encoded;
}
function optionalNumberArray(flatStyle, property) {
  const encoded = flatStyle[property];
  if (encoded === void 0) {
    return void 0;
  }
  return requireNumberArray(encoded, property);
}
function optionalDeclutterMode(flatStyle, property) {
  const encoded = flatStyle[property];
  if (encoded === void 0) {
    return void 0;
  }
  if (typeof encoded !== "string") {
    throw new Error(`Expected a string for ${property}`);
  }
  if (encoded !== "declutter" && encoded !== "obstacle" && encoded !== "none") {
    throw new Error(`Expected declutter, obstacle, or none for ${property}`);
  }
  return encoded;
}
function optionalColorLike(flatStyle, property) {
  const encoded = flatStyle[property];
  if (encoded === void 0) {
    return void 0;
  }
  return requireColorLike(encoded, property);
}
function requireNumberArray(value, property) {
  if (!Array.isArray(value)) {
    throw new Error(`Expected an array for ${property}`);
  }
  const length = value.length;
  for (let i = 0; i < length; ++i) {
    if (typeof value[i] !== "number") {
      throw new Error(`Expected an array of numbers for ${property}`);
    }
  }
  return value;
}
function requireString(value, property) {
  if (typeof value !== "string") {
    throw new Error(`Expected a string for ${property}`);
  }
  return value;
}
function requireNumber(value, property) {
  if (typeof value !== "number") {
    throw new Error(`Expected a number for ${property}`);
  }
  return value;
}
function requireColorLike(value, property) {
  if (typeof value === "string") {
    return value;
  }
  const array = requireNumberArray(value, property);
  const length = array.length;
  if (length < 3 || length > 4) {
    throw new Error(`Expected a color with 3 or 4 values for ${property}`);
  }
  return array;
}
function requireSize(value, property) {
  const size = requireNumberArray(value, property);
  if (size.length !== 2) {
    throw new Error(`Expected an array of two numbers for ${property}`);
  }
  return size;
}
function requireSizeLike(value, property) {
  if (typeof value === "number") {
    return value;
  }
  return requireSize(value, property);
}

// node_modules/ol/layer/BaseVector.js
var Property2 = {
  RENDER_ORDER: "renderOrder"
};
var BaseVectorLayer = class extends Layer_default {
  /**
   * @param {Options<FeatureType, VectorSourceType>} [options] Options.
   */
  constructor(options) {
    options = options ? options : {};
    const baseOptions = Object.assign({}, options);
    delete baseOptions.style;
    delete baseOptions.renderBuffer;
    delete baseOptions.updateWhileAnimating;
    delete baseOptions.updateWhileInteracting;
    super(baseOptions);
    this.declutter_ = options.declutter ? String(options.declutter) : void 0;
    this.renderBuffer_ = options.renderBuffer !== void 0 ? options.renderBuffer : 100;
    this.style_ = null;
    this.styleFunction_ = void 0;
    this.setStyle(options.style);
    this.updateWhileAnimating_ = options.updateWhileAnimating !== void 0 ? options.updateWhileAnimating : false;
    this.updateWhileInteracting_ = options.updateWhileInteracting !== void 0 ? options.updateWhileInteracting : false;
  }
  /**
   * @return {string} Declutter group.
   * @override
   */
  getDeclutter() {
    return this.declutter_;
  }
  /**
   * Get the topmost feature that intersects the given pixel on the viewport. Returns a promise
   * that resolves with an array of features. The array will either contain the topmost feature
   * when a hit was detected, or it will be empty.
   *
   * The hit detection algorithm used for this method is optimized for performance, but is less
   * accurate than the one used in [map.getFeaturesAtPixel()]{@link import("../Map.js").default#getFeaturesAtPixel}.
   * Text is not considered, and icons are only represented by their bounding box instead of the exact
   * image.
   *
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature").FeatureLike>>} Promise that resolves with an array of features.
   * @api
   * @override
   */
  getFeatures(pixel) {
    return super.getFeatures(pixel);
  }
  /**
   * @return {number|undefined} Render buffer.
   */
  getRenderBuffer() {
    return this.renderBuffer_;
  }
  /**
   * @return {function(import("../Feature.js").default, import("../Feature.js").default): number|null|undefined} Render
   *     order.
   */
  getRenderOrder() {
    return (
      /** @type {import("../render.js").OrderFunction|null|undefined} */
      this.get(Property2.RENDER_ORDER)
    );
  }
  /**
   * Get the style for features.  This returns whatever was passed to the `style`
   * option at construction or to the `setStyle` method.
   * @return {import("../style/Style.js").StyleLike|import("../style/flat.js").FlatStyleLike|null|undefined} Layer style.
   * @api
   */
  getStyle() {
    return this.style_;
  }
  /**
   * Get the style function.
   * @return {import("../style/Style.js").StyleFunction|undefined} Layer style function.
   * @api
   */
  getStyleFunction() {
    return this.styleFunction_;
  }
  /**
   * @return {boolean} Whether the rendered layer should be updated while
   *     animating.
   */
  getUpdateWhileAnimating() {
    return this.updateWhileAnimating_;
  }
  /**
   * @return {boolean} Whether the rendered layer should be updated while
   *     interacting.
   */
  getUpdateWhileInteracting() {
    return this.updateWhileInteracting_;
  }
  /**
   * Render declutter items for this layer
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {import("../layer/Layer.js").State} layerState Layer state.
   * @override
   */
  renderDeclutter(frameState, layerState) {
    const declutterGroup = this.getDeclutter();
    if (declutterGroup in frameState.declutter === false) {
      frameState.declutter[declutterGroup] = new RBush(9);
    }
    this.getRenderer().renderDeclutter(frameState, layerState);
  }
  /**
   * @param {import("../render.js").OrderFunction|null|undefined} renderOrder
   *     Render order.
   */
  setRenderOrder(renderOrder) {
    this.set(Property2.RENDER_ORDER, renderOrder);
  }
  /**
   * Set the style for features.  This can be a single style object, an array
   * of styles, or a function that takes a feature and resolution and returns
   * an array of styles. If set to `null`, the layer has no style (a `null` style),
   * so only features that have their own styles will be rendered in the layer. Call
   * `setStyle()` without arguments to reset to the default style. See
   * [the ol/style/Style module]{@link module:ol/style/Style~Style} for information on the default style.
   *
   * If your layer has a static style, you can use [flat style]{@link module:ol/style/flat~FlatStyle} object
   * literals instead of using the `Style` and symbolizer constructors (`Fill`, `Stroke`, etc.):
   * ```js
   * vectorLayer.setStyle({
   *   "fill-color": "yellow",
   *   "stroke-color": "black",
   *   "stroke-width": 4
   * })
   * ```
   *
   * @param {import("../style/Style.js").StyleLike|import("../style/flat.js").FlatStyleLike|null} [style] Layer style.
   * @api
   */
  setStyle(style) {
    this.style_ = style === void 0 ? createDefaultStyle : style;
    const styleLike = toStyleLike(style);
    this.styleFunction_ = style === null ? void 0 : toFunction(styleLike);
    this.changed();
  }
  /**
   * @param {boolean|string|number} declutter Declutter images and text.
   * @api
   */
  setDeclutter(declutter) {
    this.declutter_ = declutter ? String(declutter) : void 0;
    this.changed();
  }
};
function toStyleLike(style) {
  if (style === void 0) {
    return createDefaultStyle;
  }
  if (!style) {
    return null;
  }
  if (typeof style === "function") {
    return style;
  }
  if (style instanceof Style_default) {
    return style;
  }
  if (!Array.isArray(style)) {
    return flatStylesToStyleFunction([style]);
  }
  if (style.length === 0) {
    return [];
  }
  const length = style.length;
  const first = style[0];
  if (first instanceof Style_default) {
    const styles = new Array(length);
    for (let i = 0; i < length; ++i) {
      const candidate = style[i];
      if (!(candidate instanceof Style_default)) {
        throw new Error("Expected a list of style instances");
      }
      styles[i] = candidate;
    }
    return styles;
  }
  if ("style" in first) {
    const rules = new Array(length);
    for (let i = 0; i < length; ++i) {
      const candidate = style[i];
      if (!("style" in candidate)) {
        throw new Error("Expected a list of rules with a style property");
      }
      rules[i] = candidate;
    }
    return rulesToStyleFunction(rules);
  }
  const flatStyles = (
    /** @type {Array<import("../style/flat.js").FlatStyle>} */
    style
  );
  return flatStylesToStyleFunction(flatStyles);
}
var BaseVector_default = BaseVectorLayer;

// node_modules/ol/renderer/Map.js
var MapRenderer = class extends Disposable_default {
  /**
   * @param {import("../Map.js").default} map Map.
   */
  constructor(map) {
    super();
    this.map_ = map;
  }
  /**
   * @abstract
   * @param {import("../render/EventType.js").default} type Event type.
   * @param {import("../Map.js").FrameState} frameState Frame state.
   */
  dispatchRenderEvent(type, frameState) {
    abstract();
  }
  /**
   * @param {import("../Map.js").FrameState} frameState FrameState.
   * @protected
   */
  calculateMatrices2D(frameState) {
    const viewState = frameState.viewState;
    const coordinateToPixelTransform = frameState.coordinateToPixelTransform;
    const pixelToCoordinateTransform = frameState.pixelToCoordinateTransform;
    compose(coordinateToPixelTransform, frameState.size[0] / 2, frameState.size[1] / 2, 1 / viewState.resolution, -1 / viewState.resolution, -viewState.rotation, -viewState.center[0], -viewState.center[1]);
    makeInverse(pixelToCoordinateTransform, coordinateToPixelTransform);
  }
  /**
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../Map.js").FrameState} frameState FrameState.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {boolean} checkWrapped Check for wrapped geometries.
   * @param {import("./vector.js").FeatureCallback<T>} callback Feature callback.
   * @param {S} thisArg Value to use as `this` when executing `callback`.
   * @param {function(this: U, import("../layer/Layer.js").default): boolean} layerFilter Layer filter
   *     function, only layers which are visible and for which this function
   *     returns `true` will be tested for features.  By default, all visible
   *     layers will be tested.
   * @param {U} thisArg2 Value to use as `this` when executing `layerFilter`.
   * @return {T|undefined} Callback result.
   * @template S,T,U
   */
  forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, checkWrapped, callback, thisArg, layerFilter, thisArg2) {
    let result;
    const viewState = frameState.viewState;
    function forEachFeatureAtCoordinate(managed, feature, layer, geometry) {
      return callback.call(thisArg, feature, managed ? layer : null, geometry);
    }
    const projection = viewState.projection;
    const translatedCoordinate = wrapX(coordinate.slice(), projection);
    const offsets = [[0, 0]];
    if (projection.canWrapX() && checkWrapped) {
      const projectionExtent = projection.getExtent();
      const worldWidth = getWidth(projectionExtent);
      offsets.push([-worldWidth, 0], [worldWidth, 0]);
    }
    const layerStates = frameState.layerStatesArray;
    const numLayers = layerStates.length;
    const matches = (
      /** @type {Array<HitMatch<T>>} */
      []
    );
    const tmpCoord = [];
    for (let i = 0; i < offsets.length; i++) {
      for (let j = numLayers - 1; j >= 0; --j) {
        const layerState = layerStates[j];
        const layer = layerState.layer;
        if (layer.hasRenderer() && inView(layerState, viewState) && layerFilter.call(thisArg2, layer)) {
          const layerRenderer = layer.getRenderer();
          const source = layer.getSource();
          if (layerRenderer && source) {
            const coordinates = source.getWrapX() ? translatedCoordinate : coordinate;
            const callback2 = forEachFeatureAtCoordinate.bind(null, layerState.managed);
            tmpCoord[0] = coordinates[0] + offsets[i][0];
            tmpCoord[1] = coordinates[1] + offsets[i][1];
            result = layerRenderer.forEachFeatureAtCoordinate(tmpCoord, frameState, hitTolerance, callback2, matches);
          }
          if (result) {
            return result;
          }
        }
      }
    }
    if (matches.length === 0) {
      return void 0;
    }
    const order = 1 / matches.length;
    matches.forEach((m, i) => m.distanceSq += i * order);
    matches.sort((a, b) => a.distanceSq - b.distanceSq);
    matches.some((m) => {
      return result = m.callback(m.feature, m.layer, m.geometry);
    });
    return result;
  }
  /**
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../Map.js").FrameState} frameState FrameState.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {boolean} checkWrapped Check for wrapped geometries.
   * @param {function(this: U, import("../layer/Layer.js").default): boolean} layerFilter Layer filter
   *     function, only layers which are visible and for which this function
   *     returns `true` will be tested for features.  By default, all visible
   *     layers will be tested.
   * @param {U} thisArg Value to use as `this` when executing `layerFilter`.
   * @return {boolean} Is there a feature at the given coordinate?
   * @template U
   */
  hasFeatureAtCoordinate(coordinate, frameState, hitTolerance, checkWrapped, layerFilter, thisArg) {
    const hasFeature = this.forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, checkWrapped, TRUE, this, layerFilter, thisArg);
    return hasFeature !== void 0;
  }
  /**
   * @return {import("../Map.js").default} Map.
   */
  getMap() {
    return this.map_;
  }
  /**
   * Render.
   * @abstract
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   */
  renderFrame(frameState) {
    abstract();
  }
  /**
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @protected
   */
  scheduleExpireIconCache(frameState) {
    if (shared.canExpireCache()) {
      frameState.postRenderFunctions.push(expireIconCache);
    }
  }
};
function expireIconCache(map, frameState) {
  shared.expire();
}
var Map_default = MapRenderer;

// node_modules/ol/renderer/Composite.js
var CompositeMapRenderer = class extends Map_default {
  /**
   * @param {import("../Map.js").default} map Map.
   */
  constructor(map) {
    super(map);
    this.fontChangeListenerKey_ = listen(checkedFonts, ObjectEventType_default.PROPERTYCHANGE, map.redrawText, map);
    this.element_ = document.createElement("div");
    const style = this.element_.style;
    style.position = "absolute";
    style.width = "100%";
    style.height = "100%";
    style.zIndex = "0";
    this.element_.className = CLASS_UNSELECTABLE + " ol-layers";
    const container = map.getViewport();
    container.insertBefore(this.element_, container.firstChild || null);
    this.children_ = [];
    this.renderedVisible_ = true;
  }
  /**
   * @param {import("../render/EventType.js").default} type Event type.
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @override
   */
  dispatchRenderEvent(type, frameState) {
    const map = this.getMap();
    if (map.hasListener(type)) {
      const event = new Event_default2(type, void 0, frameState);
      map.dispatchEvent(event);
    }
  }
  /**
   * @override
   */
  disposeInternal() {
    unlistenByKey(this.fontChangeListenerKey_);
    this.element_.remove();
    super.disposeInternal();
  }
  /**
   * Render.
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   * @override
   */
  renderFrame(frameState) {
    if (!frameState) {
      if (this.renderedVisible_) {
        this.element_.style.display = "none";
        this.renderedVisible_ = false;
      }
      return;
    }
    this.calculateMatrices2D(frameState);
    this.dispatchRenderEvent(EventType_default2.PRECOMPOSE, frameState);
    const layerStatesArray = frameState.layerStatesArray.sort((a, b) => a.zIndex - b.zIndex);
    const declutter = layerStatesArray.some((layerState) => layerState.layer instanceof BaseVector_default && layerState.layer.getDeclutter());
    if (declutter) {
      frameState.declutter = {};
    }
    const viewState = frameState.viewState;
    this.children_.length = 0;
    const renderedLayerStates = [];
    let previousElement = null;
    for (let i = 0, ii = layerStatesArray.length; i < ii; ++i) {
      const layerState = layerStatesArray[i];
      frameState.layerIndex = i;
      const layer = layerState.layer;
      const sourceState = layer.getSourceState();
      if (!inView(layerState, viewState) || sourceState != "ready" && sourceState != "undefined") {
        layer.unrender();
        continue;
      }
      const element = layer.render(frameState, previousElement);
      if (!element) {
        continue;
      }
      if (element !== previousElement) {
        this.children_.push(element);
        previousElement = element;
      }
      renderedLayerStates.push(layerState);
    }
    this.declutter(frameState, renderedLayerStates);
    replaceChildren(this.element_, this.children_);
    this.dispatchRenderEvent(EventType_default2.POSTCOMPOSE, frameState);
    if (!this.renderedVisible_) {
      this.element_.style.display = "";
      this.renderedVisible_ = true;
    }
    this.scheduleExpireIconCache(frameState);
  }
  /**
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {Array<import('../layer/Layer.js').State>} layerStates Layers.
   */
  declutter(frameState, layerStates) {
    if (!frameState.declutter) {
      return;
    }
    for (let i = layerStates.length - 1; i >= 0; --i) {
      const layerState = layerStates[i];
      const layer = layerState.layer;
      if (layer.getDeclutter()) {
        layer.renderDeclutter(frameState, layerState);
      }
    }
    layerStates.forEach((layerState) => layerState.layer.renderDeferred(frameState));
  }
};
var Composite_default = CompositeMapRenderer;

// node_modules/ol/layer/Group.js
var GroupEvent = class extends Event_default {
  /**
   * @param {GroupEventType} type The event type.
   * @param {BaseLayer} layer The layer.
   */
  constructor(type, layer) {
    super(type);
    this.layer = layer;
  }
};
var Property3 = {
  LAYERS: "layers"
};
var LayerGroup = class _LayerGroup extends Base_default {
  /**
   * @param {Options} [options] Layer options.
   */
  constructor(options) {
    options = options || {};
    const baseOptions = (
      /** @type {Options} */
      Object.assign({}, options)
    );
    delete baseOptions.layers;
    let layers = options.layers;
    super(baseOptions);
    this.on;
    this.once;
    this.un;
    this.layersListenerKeys_ = [];
    this.listenerKeys_ = {};
    this.addChangeListener(Property3.LAYERS, this.handleLayersChanged_);
    if (layers) {
      if (Array.isArray(layers)) {
        layers = new Collection_default(layers.slice(), {
          unique: true
        });
      } else {
        assert(typeof /** @type {?} */
        layers.getArray === "function", "Expected `layers` to be an array or a `Collection`");
      }
    } else {
      layers = new Collection_default(void 0, {
        unique: true
      });
    }
    this.setLayers(layers);
  }
  /**
   * @private
   */
  handleLayerChange_() {
    this.changed();
  }
  /**
   * @private
   */
  handleLayersChanged_() {
    this.layersListenerKeys_.forEach(unlistenByKey);
    this.layersListenerKeys_.length = 0;
    const layers = this.getLayers();
    this.layersListenerKeys_.push(listen(layers, CollectionEventType_default.ADD, this.handleLayersAdd_, this), listen(layers, CollectionEventType_default.REMOVE, this.handleLayersRemove_, this));
    for (const id in this.listenerKeys_) {
      this.listenerKeys_[id].forEach(unlistenByKey);
    }
    clear(this.listenerKeys_);
    const layersArray = layers.getArray();
    for (let i = 0, ii = layersArray.length; i < ii; i++) {
      const layer = layersArray[i];
      this.registerLayerListeners_(layer);
      this.dispatchEvent(new GroupEvent("addlayer", layer));
    }
    this.changed();
  }
  /**
   * @param {BaseLayer} layer The layer.
   */
  registerLayerListeners_(layer) {
    const listenerKeys = [listen(layer, ObjectEventType_default.PROPERTYCHANGE, this.handleLayerChange_, this), listen(layer, EventType_default.CHANGE, this.handleLayerChange_, this)];
    if (layer instanceof _LayerGroup) {
      listenerKeys.push(listen(layer, "addlayer", this.handleLayerGroupAdd_, this), listen(layer, "removelayer", this.handleLayerGroupRemove_, this));
    }
    this.listenerKeys_[getUid(layer)] = listenerKeys;
  }
  /**
   * @param {GroupEvent} event The layer group event.
   */
  handleLayerGroupAdd_(event) {
    this.dispatchEvent(new GroupEvent("addlayer", event.layer));
  }
  /**
   * @param {GroupEvent} event The layer group event.
   */
  handleLayerGroupRemove_(event) {
    this.dispatchEvent(new GroupEvent("removelayer", event.layer));
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<import("./Base.js").default>} collectionEvent CollectionEvent.
   * @private
   */
  handleLayersAdd_(collectionEvent) {
    const layer = collectionEvent.element;
    this.registerLayerListeners_(layer);
    this.dispatchEvent(new GroupEvent("addlayer", layer));
    this.changed();
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<import("./Base.js").default>} collectionEvent CollectionEvent.
   * @private
   */
  handleLayersRemove_(collectionEvent) {
    const layer = collectionEvent.element;
    const key = getUid(layer);
    this.listenerKeys_[key].forEach(unlistenByKey);
    delete this.listenerKeys_[key];
    this.dispatchEvent(new GroupEvent("removelayer", layer));
    this.changed();
  }
  /**
   * Returns the {@link module:ol/Collection~Collection collection} of {@link module:ol/layer/Layer~Layer layers}
   * in this group.
   * @return {!Collection<import("./Base.js").default>} Collection of
   *   {@link module:ol/layer/Base~BaseLayer layers} that are part of this group.
   * @observable
   * @api
   */
  getLayers() {
    return (
      /** @type {!Collection<import("./Base.js").default>} */
      this.get(Property3.LAYERS)
    );
  }
  /**
   * Set the {@link module:ol/Collection~Collection collection} of {@link module:ol/layer/Layer~Layer layers}
   * in this group.
   * @param {!Collection<import("./Base.js").default>} layers Collection of
   *   {@link module:ol/layer/Base~BaseLayer layers} that are part of this group.
   * @observable
   * @api
   */
  setLayers(layers) {
    const collection = this.getLayers();
    if (collection) {
      const currentLayers = collection.getArray();
      for (let i = 0, ii = currentLayers.length; i < ii; ++i) {
        this.dispatchEvent(new GroupEvent("removelayer", currentLayers[i]));
      }
    }
    this.set(Property3.LAYERS, layers);
  }
  /**
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   * @override
   */
  getLayersArray(array) {
    array = array !== void 0 ? array : [];
    this.getLayers().forEach(function(layer) {
      layer.getLayersArray(array);
    });
    return array;
  }
  /**
   * Get the layer states list and use this groups z-index as the default
   * for all layers in this and nested groups, if it is unset at this point.
   * If dest is not provided and this group's z-index is undefined
   * 0 is used a the default z-index.
   * @param {Array<import("./Layer.js").State>} [dest] Optional list
   * of layer states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   * @override
   */
  getLayerStatesArray(dest) {
    const states = dest !== void 0 ? dest : [];
    const pos = states.length;
    this.getLayers().forEach(function(layer) {
      layer.getLayerStatesArray(states);
    });
    const ownLayerState = this.getLayerState();
    let defaultZIndex = ownLayerState.zIndex;
    if (!dest && ownLayerState.zIndex === void 0) {
      defaultZIndex = 0;
    }
    for (let i = pos, ii = states.length; i < ii; i++) {
      const layerState = states[i];
      layerState.opacity *= ownLayerState.opacity;
      layerState.visible = layerState.visible && ownLayerState.visible;
      layerState.maxResolution = Math.min(layerState.maxResolution, ownLayerState.maxResolution);
      layerState.minResolution = Math.max(layerState.minResolution, ownLayerState.minResolution);
      layerState.minZoom = Math.max(layerState.minZoom, ownLayerState.minZoom);
      layerState.maxZoom = Math.min(layerState.maxZoom, ownLayerState.maxZoom);
      if (ownLayerState.extent !== void 0) {
        if (layerState.extent !== void 0) {
          layerState.extent = getIntersection(layerState.extent, ownLayerState.extent);
        } else {
          layerState.extent = ownLayerState.extent;
        }
      }
      if (layerState.zIndex === void 0) {
        layerState.zIndex = defaultZIndex;
      }
    }
    return states;
  }
  /**
   * @return {import("../source/Source.js").State} Source state.
   * @override
   */
  getSourceState() {
    return "ready";
  }
};
var Group_default = LayerGroup;

// node_modules/ol/MapEvent.js
var MapEvent = class extends Event_default {
  /**
   * @param {string} type Event type.
   * @param {import("./Map.js").default} map Map.
   * @param {?import("./Map.js").FrameState} [frameState] Frame state.
   */
  constructor(type, map, frameState) {
    super(type);
    this.map = map;
    this.frameState = frameState !== void 0 ? frameState : null;
  }
};
var MapEvent_default = MapEvent;

// node_modules/ol/MapBrowserEvent.js
var MapBrowserEvent = class extends MapEvent_default {
  /**
   * @param {string} type Event type.
   * @param {import("./Map.js").default} map Map.
   * @param {EVENT} originalEvent Original event.
   * @param {boolean} [dragging] Is the map currently being dragged?
   * @param {import("./Map.js").FrameState} [frameState] Frame state.
   * @param {Array<PointerEvent>} [activePointers] Active pointers.
   */
  constructor(type, map, originalEvent, dragging, frameState, activePointers) {
    super(type, map, frameState);
    this.originalEvent = originalEvent;
    this.pixel_ = null;
    this.coordinate_ = null;
    this.dragging = dragging !== void 0 ? dragging : false;
    this.activePointers = activePointers;
  }
  /**
   * The map pixel relative to the viewport corresponding to the original event.
   * @type {import("./pixel.js").Pixel}
   * @api
   */
  get pixel() {
    if (!this.pixel_) {
      this.pixel_ = this.map.getEventPixel(this.originalEvent);
    }
    return this.pixel_;
  }
  set pixel(pixel) {
    this.pixel_ = pixel;
  }
  /**
   * The coordinate corresponding to the original browser event.  This will be in the user
   * projection if one is set.  Otherwise it will be in the view projection.
   * @type {import("./coordinate.js").Coordinate}
   * @api
   */
  get coordinate() {
    if (!this.coordinate_) {
      this.coordinate_ = this.map.getCoordinateFromPixel(this.pixel);
    }
    return this.coordinate_;
  }
  set coordinate(coordinate) {
    this.coordinate_ = coordinate;
  }
  /**
   * Prevents the default browser action.
   * See https://developer.mozilla.org/en-US/docs/Web/API/event.preventDefault.
   * @api
   * @override
   */
  preventDefault() {
    super.preventDefault();
    if ("preventDefault" in this.originalEvent) {
      this.originalEvent.preventDefault();
    }
  }
  /**
   * Prevents further propagation of the current event.
   * See https://developer.mozilla.org/en-US/docs/Web/API/event.stopPropagation.
   * @api
   * @override
   */
  stopPropagation() {
    super.stopPropagation();
    if ("stopPropagation" in this.originalEvent) {
      this.originalEvent.stopPropagation();
    }
  }
};
var MapBrowserEvent_default = MapBrowserEvent;

// node_modules/ol/MapBrowserEventType.js
var MapBrowserEventType_default = {
  /**
   * A true single click with no dragging and no double click. Note that this
   * event is delayed by 250 ms to ensure that it is not a double click.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#singleclick
   * @api
   */
  SINGLECLICK: "singleclick",
  /**
   * A click with no dragging. A double click will fire two of this.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#click
   * @api
   */
  CLICK: EventType_default.CLICK,
  /**
   * A true double click, with no dragging.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#dblclick
   * @api
   */
  DBLCLICK: EventType_default.DBLCLICK,
  /**
   * Triggered when a pointer is dragged.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#pointerdrag
   * @api
   */
  POINTERDRAG: "pointerdrag",
  /**
   * Triggered when a pointer is moved. Note that on touch devices this is
   * triggered when the map is panned, so is not the same as mousemove.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#pointermove
   * @api
   */
  POINTERMOVE: "pointermove",
  POINTERDOWN: "pointerdown",
  POINTERUP: "pointerup",
  POINTEROVER: "pointerover",
  POINTEROUT: "pointerout",
  POINTERENTER: "pointerenter",
  POINTERLEAVE: "pointerleave",
  POINTERCANCEL: "pointercancel"
};

// node_modules/ol/pointer/EventType.js
var EventType_default3 = {
  POINTERMOVE: "pointermove",
  POINTERDOWN: "pointerdown",
  POINTERUP: "pointerup",
  POINTEROVER: "pointerover",
  POINTEROUT: "pointerout",
  POINTERENTER: "pointerenter",
  POINTERLEAVE: "pointerleave",
  POINTERCANCEL: "pointercancel"
};

// node_modules/ol/MapBrowserEventHandler.js
var MapBrowserEventHandler = class extends Target_default {
  /**
   * @param {import("./Map.js").default} map The map with the viewport to listen to events on.
   * @param {number} [moveTolerance] The minimal distance the pointer must travel to trigger a move.
   */
  constructor(map, moveTolerance) {
    super(map);
    this.map_ = map;
    this.clickTimeoutId_;
    this.emulateClicks_ = false;
    this.dragging_ = false;
    this.dragListenerKeys_ = [];
    this.moveTolerance_ = moveTolerance === void 0 ? 1 : moveTolerance;
    this.down_ = null;
    const element = this.map_.getViewport();
    this.activePointers_ = [];
    this.trackedTouches_ = {};
    this.element_ = element;
    this.pointerdownListenerKey_ = listen(element, EventType_default3.POINTERDOWN, this.handlePointerDown_, this);
    this.originalPointerMoveEvent_;
    this.relayedListenerKey_ = listen(element, EventType_default3.POINTERMOVE, this.relayMoveEvent_, this);
    this.boundHandleTouchMove_ = this.handleTouchMove_.bind(this);
    this.element_.addEventListener(EventType_default.TOUCHMOVE, this.boundHandleTouchMove_, PASSIVE_EVENT_LISTENERS ? {
      passive: false
    } : false);
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  emulateClick_(pointerEvent) {
    let newEvent = new MapBrowserEvent_default(MapBrowserEventType_default.CLICK, this.map_, pointerEvent);
    this.dispatchEvent(newEvent);
    if (this.clickTimeoutId_ !== void 0) {
      clearTimeout(this.clickTimeoutId_);
      this.clickTimeoutId_ = void 0;
      newEvent = new MapBrowserEvent_default(MapBrowserEventType_default.DBLCLICK, this.map_, pointerEvent);
      this.dispatchEvent(newEvent);
    } else {
      this.clickTimeoutId_ = setTimeout(() => {
        this.clickTimeoutId_ = void 0;
        const newEvent2 = new MapBrowserEvent_default(MapBrowserEventType_default.SINGLECLICK, this.map_, pointerEvent);
        this.dispatchEvent(newEvent2);
      }, 250);
    }
  }
  /**
   * Keeps track on how many pointers are currently active.
   *
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  updateActivePointers_(pointerEvent) {
    const event = pointerEvent;
    const id = event.pointerId;
    if (event.type == MapBrowserEventType_default.POINTERUP || event.type == MapBrowserEventType_default.POINTERCANCEL) {
      delete this.trackedTouches_[id];
      for (const pointerId in this.trackedTouches_) {
        if (this.trackedTouches_[pointerId].target !== event.target) {
          delete this.trackedTouches_[pointerId];
          break;
        }
      }
    } else if (event.type == MapBrowserEventType_default.POINTERDOWN || event.type == MapBrowserEventType_default.POINTERMOVE) {
      this.trackedTouches_[id] = event;
    }
    this.activePointers_ = Object.values(this.trackedTouches_);
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  handlePointerUp_(pointerEvent) {
    this.updateActivePointers_(pointerEvent);
    const newEvent = new MapBrowserEvent_default(MapBrowserEventType_default.POINTERUP, this.map_, pointerEvent, void 0, void 0, this.activePointers_);
    this.dispatchEvent(newEvent);
    if (this.emulateClicks_ && !newEvent.defaultPrevented && !this.dragging_ && this.isMouseActionButton_(pointerEvent)) {
      this.emulateClick_(this.down_);
    }
    if (this.activePointers_.length === 0) {
      this.dragListenerKeys_.forEach(unlistenByKey);
      this.dragListenerKeys_.length = 0;
      this.dragging_ = false;
      this.down_ = null;
    }
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @return {boolean} If the left mouse button was pressed.
   * @private
   */
  isMouseActionButton_(pointerEvent) {
    return pointerEvent.button === 0;
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  handlePointerDown_(pointerEvent) {
    this.emulateClicks_ = this.activePointers_.length === 0;
    this.updateActivePointers_(pointerEvent);
    const newEvent = new MapBrowserEvent_default(MapBrowserEventType_default.POINTERDOWN, this.map_, pointerEvent, void 0, void 0, this.activePointers_);
    this.dispatchEvent(newEvent);
    this.down_ = new PointerEvent(pointerEvent.type, pointerEvent);
    Object.defineProperty(this.down_, "target", {
      writable: false,
      value: pointerEvent.target
    });
    if (this.dragListenerKeys_.length === 0) {
      const doc = this.map_.getOwnerDocument();
      this.dragListenerKeys_.push(
        listen(doc, MapBrowserEventType_default.POINTERMOVE, this.handlePointerMove_, this),
        listen(doc, MapBrowserEventType_default.POINTERUP, this.handlePointerUp_, this),
        /* Note that the listener for `pointercancel is set up on
         * `pointerEventHandler_` and not `documentPointerEventHandler_` like
         * the `pointerup` and `pointermove` listeners.
         *
         * The reason for this is the following: `TouchSource.vacuumTouches_()`
         * issues `pointercancel` events, when there was no `touchend` for a
         * `touchstart`. Now, let's say a first `touchstart` is registered on
         * `pointerEventHandler_`. The `documentPointerEventHandler_` is set up.
         * But `documentPointerEventHandler_` doesn't know about the first
         * `touchstart`. If there is no `touchend` for the `touchstart`, we can
         * only receive a `touchcancel` from `pointerEventHandler_`, because it is
         * only registered there.
         */
        listen(this.element_, MapBrowserEventType_default.POINTERCANCEL, this.handlePointerUp_, this)
      );
      if (this.element_.getRootNode && this.element_.getRootNode() !== doc) {
        this.dragListenerKeys_.push(listen(this.element_.getRootNode(), MapBrowserEventType_default.POINTERUP, this.handlePointerUp_, this));
      }
    }
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  handlePointerMove_(pointerEvent) {
    if (this.isMoving_(pointerEvent)) {
      this.updateActivePointers_(pointerEvent);
      this.dragging_ = true;
      const newEvent = new MapBrowserEvent_default(MapBrowserEventType_default.POINTERDRAG, this.map_, pointerEvent, this.dragging_, void 0, this.activePointers_);
      this.dispatchEvent(newEvent);
    }
  }
  /**
   * Wrap and relay a pointermove event.
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  relayMoveEvent_(pointerEvent) {
    this.originalPointerMoveEvent_ = pointerEvent;
    const dragging = !!(this.down_ && this.isMoving_(pointerEvent));
    this.dispatchEvent(new MapBrowserEvent_default(MapBrowserEventType_default.POINTERMOVE, this.map_, pointerEvent, dragging));
  }
  /**
   * Flexible handling of a `touch-action: none` css equivalent: because calling
   * `preventDefault()` on a `pointermove` event does not stop native page scrolling
   * and zooming, we also listen for `touchmove` and call `preventDefault()` on it
   * when an interaction (currently `DragPan` handles the event.
   * @param {TouchEvent} event Event.
   * @private
   */
  handleTouchMove_(event) {
    const originalEvent = this.originalPointerMoveEvent_;
    if ((!originalEvent || originalEvent.defaultPrevented) && (typeof event.cancelable !== "boolean" || event.cancelable === true)) {
      event.preventDefault();
    }
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @return {boolean} Is moving.
   * @private
   */
  isMoving_(pointerEvent) {
    return this.dragging_ || Math.abs(pointerEvent.clientX - this.down_.clientX) > this.moveTolerance_ || Math.abs(pointerEvent.clientY - this.down_.clientY) > this.moveTolerance_;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    if (this.relayedListenerKey_) {
      unlistenByKey(this.relayedListenerKey_);
      this.relayedListenerKey_ = null;
    }
    this.element_.removeEventListener(EventType_default.TOUCHMOVE, this.boundHandleTouchMove_);
    if (this.pointerdownListenerKey_) {
      unlistenByKey(this.pointerdownListenerKey_);
      this.pointerdownListenerKey_ = null;
    }
    this.dragListenerKeys_.forEach(unlistenByKey);
    this.dragListenerKeys_.length = 0;
    this.element_ = null;
    super.disposeInternal();
  }
};
var MapBrowserEventHandler_default = MapBrowserEventHandler;

// node_modules/ol/MapEventType.js
var MapEventType_default = {
  /**
   * Triggered after a map frame is rendered.
   * @event module:ol/MapEvent~MapEvent#postrender
   * @api
   */
  POSTRENDER: "postrender",
  /**
   * Triggered when the map starts moving.
   * @event module:ol/MapEvent~MapEvent#movestart
   * @api
   */
  MOVESTART: "movestart",
  /**
   * Triggered after the map is moved.
   * @event module:ol/MapEvent~MapEvent#moveend
   * @api
   */
  MOVEEND: "moveend",
  /**
   * Triggered when loading of additional map data (tiles, images, features) starts.
   * @event module:ol/MapEvent~MapEvent#loadstart
   * @api
   */
  LOADSTART: "loadstart",
  /**
   * Triggered when loading of additional map data has completed.
   * @event module:ol/MapEvent~MapEvent#loadend
   * @api
   */
  LOADEND: "loadend"
};

// node_modules/ol/MapProperty.js
var MapProperty_default = {
  LAYERGROUP: "layergroup",
  SIZE: "size",
  TARGET: "target",
  VIEW: "view"
};

// node_modules/ol/structs/PriorityQueue.js
var DROP = Infinity;
var PriorityQueue = class {
  /**
   * @param {function(T): number} priorityFunction Priority function.
   * @param {function(T): string} keyFunction Key function.
   */
  constructor(priorityFunction, keyFunction) {
    this.priorityFunction_ = priorityFunction;
    this.keyFunction_ = keyFunction;
    this.elements_ = [];
    this.priorities_ = [];
    this.queuedElements_ = {};
  }
  /**
   * FIXME empty description for jsdoc
   */
  clear() {
    this.elements_.length = 0;
    this.priorities_.length = 0;
    clear(this.queuedElements_);
  }
  /**
   * Remove and return the highest-priority element. O(log N).
   * @return {T} Element.
   */
  dequeue() {
    const elements = this.elements_;
    const priorities = this.priorities_;
    const element = elements[0];
    if (elements.length == 1) {
      elements.length = 0;
      priorities.length = 0;
    } else {
      elements[0] = /** @type {T} */
      elements.pop();
      priorities[0] = /** @type {number} */
      priorities.pop();
      this.siftUp_(0);
    }
    const elementKey = this.keyFunction_(element);
    delete this.queuedElements_[elementKey];
    return element;
  }
  /**
   * Enqueue an element. O(log N).
   * @param {T} element Element.
   * @return {boolean} The element was added to the queue.
   */
  enqueue(element) {
    assert(!(this.keyFunction_(element) in this.queuedElements_), "Tried to enqueue an `element` that was already added to the queue");
    const priority = this.priorityFunction_(element);
    if (priority != DROP) {
      this.elements_.push(element);
      this.priorities_.push(priority);
      this.queuedElements_[this.keyFunction_(element)] = true;
      this.siftDown_(0, this.elements_.length - 1);
      return true;
    }
    return false;
  }
  /**
   * @return {number} Count.
   */
  getCount() {
    return this.elements_.length;
  }
  /**
   * Gets the index of the left child of the node at the given index.
   * @param {number} index The index of the node to get the left child for.
   * @return {number} The index of the left child.
   * @private
   */
  getLeftChildIndex_(index) {
    return index * 2 + 1;
  }
  /**
   * Gets the index of the right child of the node at the given index.
   * @param {number} index The index of the node to get the right child for.
   * @return {number} The index of the right child.
   * @private
   */
  getRightChildIndex_(index) {
    return index * 2 + 2;
  }
  /**
   * Gets the index of the parent of the node at the given index.
   * @param {number} index The index of the node to get the parent for.
   * @return {number} The index of the parent.
   * @private
   */
  getParentIndex_(index) {
    return index - 1 >> 1;
  }
  /**
   * Make this a heap. O(N).
   * @private
   */
  heapify_() {
    let i;
    for (i = (this.elements_.length >> 1) - 1; i >= 0; i--) {
      this.siftUp_(i);
    }
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return this.elements_.length === 0;
  }
  /**
   * @param {string} key Key.
   * @return {boolean} Is key queued.
   */
  isKeyQueued(key) {
    return key in this.queuedElements_;
  }
  /**
   * @param {T} element Element.
   * @return {boolean} Is queued.
   */
  isQueued(element) {
    return this.isKeyQueued(this.keyFunction_(element));
  }
  /**
   * @param {number} index The index of the node to move down.
   * @private
   */
  siftUp_(index) {
    const elements = this.elements_;
    const priorities = this.priorities_;
    const count = elements.length;
    const element = elements[index];
    const priority = priorities[index];
    const startIndex = index;
    while (index < count >> 1) {
      const lIndex = this.getLeftChildIndex_(index);
      const rIndex = this.getRightChildIndex_(index);
      const smallerChildIndex = rIndex < count && priorities[rIndex] < priorities[lIndex] ? rIndex : lIndex;
      elements[index] = elements[smallerChildIndex];
      priorities[index] = priorities[smallerChildIndex];
      index = smallerChildIndex;
    }
    elements[index] = element;
    priorities[index] = priority;
    this.siftDown_(startIndex, index);
  }
  /**
   * @param {number} startIndex The index of the root.
   * @param {number} index The index of the node to move up.
   * @private
   */
  siftDown_(startIndex, index) {
    const elements = this.elements_;
    const priorities = this.priorities_;
    const element = elements[index];
    const priority = priorities[index];
    while (index > startIndex) {
      const parentIndex = this.getParentIndex_(index);
      if (priorities[parentIndex] > priority) {
        elements[index] = elements[parentIndex];
        priorities[index] = priorities[parentIndex];
        index = parentIndex;
      } else {
        break;
      }
    }
    elements[index] = element;
    priorities[index] = priority;
  }
  /**
   * FIXME empty description for jsdoc
   */
  reprioritize() {
    const priorityFunction = this.priorityFunction_;
    const elements = this.elements_;
    const priorities = this.priorities_;
    let index = 0;
    const n = elements.length;
    let element, i, priority;
    for (i = 0; i < n; ++i) {
      element = elements[i];
      priority = priorityFunction(element);
      if (priority == DROP) {
        delete this.queuedElements_[this.keyFunction_(element)];
      } else {
        priorities[index] = priority;
        elements[index++] = element;
      }
    }
    elements.length = index;
    priorities.length = index;
    this.heapify_();
  }
};
var PriorityQueue_default = PriorityQueue;

// node_modules/ol/TileQueue.js
var TileQueue = class extends PriorityQueue_default {
  /**
   * @param {PriorityFunction} tilePriorityFunction Tile priority function.
   * @param {function(): ?} tileChangeCallback Function called on each tile change event.
   */
  constructor(tilePriorityFunction, tileChangeCallback) {
    super(
      /**
       * @param {Array} element Element.
       * @return {number} Priority.
       */
      function(element) {
        return tilePriorityFunction.apply(null, element);
      },
      /**
       * @param {Array} element Element.
       * @return {string} Key.
       */
      function(element) {
        return (
          /** @type {import("./Tile.js").default} */
          element[0].getKey()
        );
      }
    );
    this.boundHandleTileChange_ = this.handleTileChange.bind(this);
    this.tileChangeCallback_ = tileChangeCallback;
    this.tilesLoading_ = 0;
    this.tilesLoadingKeys_ = {};
  }
  /**
   * @param {Array} element Element.
   * @return {boolean} The element was added to the queue.
   * @override
   */
  enqueue(element) {
    const added = super.enqueue(element);
    if (added) {
      const tile = element[0];
      tile.addEventListener(EventType_default.CHANGE, this.boundHandleTileChange_);
    }
    return added;
  }
  /**
   * @return {number} Number of tiles loading.
   */
  getTilesLoading() {
    return this.tilesLoading_;
  }
  /**
   * @param {import("./events/Event.js").default} event Event.
   * @protected
   */
  handleTileChange(event) {
    const tile = (
      /** @type {import("./Tile.js").default} */
      event.target
    );
    const state = tile.getState();
    if (state === TileState_default.LOADED || state === TileState_default.ERROR || state === TileState_default.EMPTY) {
      if (state !== TileState_default.ERROR) {
        tile.removeEventListener(EventType_default.CHANGE, this.boundHandleTileChange_);
      }
      const tileKey = tile.getKey();
      if (tileKey in this.tilesLoadingKeys_) {
        delete this.tilesLoadingKeys_[tileKey];
        --this.tilesLoading_;
      }
      this.tileChangeCallback_();
    }
  }
  /**
   * @param {number} maxTotalLoading Maximum number tiles to load simultaneously.
   * @param {number} maxNewLoads Maximum number of new tiles to load.
   */
  loadMoreTiles(maxTotalLoading, maxNewLoads) {
    let newLoads = 0;
    while (this.tilesLoading_ < maxTotalLoading && newLoads < maxNewLoads && this.getCount() > 0) {
      const tile = this.dequeue()[0];
      const tileKey = tile.getKey();
      const state = tile.getState();
      if (state === TileState_default.IDLE && !(tileKey in this.tilesLoadingKeys_)) {
        this.tilesLoadingKeys_[tileKey] = true;
        ++this.tilesLoading_;
        ++newLoads;
        tile.load();
      }
    }
  }
};
var TileQueue_default = TileQueue;
function getTilePriority(frameState, tile, tileSourceKey, tileCenter, tileResolution) {
  if (!frameState || !(tileSourceKey in frameState.wantedTiles)) {
    return DROP;
  }
  if (!frameState.wantedTiles[tileSourceKey][tile.getKey()]) {
    return DROP;
  }
  const center = frameState.viewState.center;
  const deltaX = tileCenter[0] - center[0];
  const deltaY = tileCenter[1] - center[1];
  return 65536 * Math.log(tileResolution) + Math.sqrt(deltaX * deltaX + deltaY * deltaY) / tileResolution;
}

// node_modules/ol/control/Control.js
var Control = class extends Object_default {
  /**
   * @param {Options} options Control options.
   */
  constructor(options) {
    super();
    const element = options.element;
    if (element && !options.target && !element.style.pointerEvents) {
      element.style.pointerEvents = "auto";
    }
    this.element = element ? element : null;
    this.target_ = null;
    this.map_ = null;
    this.listenerKeys = [];
    if (options.render) {
      this.render = options.render;
    }
    if (options.target) {
      this.setTarget(options.target);
    }
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.element?.remove();
    super.disposeInternal();
  }
  /**
   * Get the map associated with this control.
   * @return {import("../Map.js").default|null} Map.
   * @api
   */
  getMap() {
    return this.map_;
  }
  /**
   * Remove the control from its current map and attach it to the new map.
   * Pass `null` to just remove the control from the current map.
   * Subclasses may set up event handlers to get notified about changes to
   * the map here.
   * @param {import("../Map.js").default|null} map Map.
   * @api
   */
  setMap(map) {
    if (this.map_) {
      this.element?.remove();
    }
    for (let i = 0, ii = this.listenerKeys.length; i < ii; ++i) {
      unlistenByKey(this.listenerKeys[i]);
    }
    this.listenerKeys.length = 0;
    this.map_ = map;
    if (map) {
      const target = this.target_ ?? map.getOverlayContainerStopEvent();
      if (this.element) {
        target.appendChild(this.element);
      }
      if (this.render !== VOID) {
        this.listenerKeys.push(listen(map, MapEventType_default.POSTRENDER, this.render, this));
      }
      map.render();
    }
  }
  /**
   * Renders the control.
   * @param {import("../MapEvent.js").default} mapEvent Map event.
   * @api
   */
  render(mapEvent) {
  }
  /**
   * This function is used to set a target element for the control. It has no
   * effect if it is called after the control has been added to the map (i.e.
   * after `setMap` is called on the control). If no `target` is set in the
   * options passed to the control constructor and if `setTarget` is not called
   * then the control is added to the map's overlay container.
   * @param {HTMLElement|string} target Target.
   * @api
   */
  setTarget(target) {
    this.target_ = typeof target === "string" ? document.getElementById(target) : target;
  }
};
var Control_default = Control;

// node_modules/ol/control/Attribution.js
var Attribution = class extends Control_default {
  /**
   * @param {Options} [options] Attribution options.
   */
  constructor(options) {
    options = options ? options : {};
    super({
      element: document.createElement("div"),
      render: options.render,
      target: options.target
    });
    this.ulElement_ = document.createElement("ul");
    this.collapsed_ = options.collapsed !== void 0 ? options.collapsed : true;
    this.userCollapsed_ = this.collapsed_;
    this.overrideCollapsible_ = options.collapsible !== void 0;
    this.collapsible_ = options.collapsible !== void 0 ? options.collapsible : true;
    if (!this.collapsible_) {
      this.collapsed_ = false;
    }
    this.attributions_ = options.attributions;
    const className = options.className !== void 0 ? options.className : "ol-attribution";
    const tipLabel = options.tipLabel !== void 0 ? options.tipLabel : "Attributions";
    const expandClassName = options.expandClassName !== void 0 ? options.expandClassName : className + "-expand";
    const collapseLabel = options.collapseLabel !== void 0 ? options.collapseLabel : "›";
    const collapseClassName = options.collapseClassName !== void 0 ? options.collapseClassName : className + "-collapse";
    if (typeof collapseLabel === "string") {
      this.collapseLabel_ = document.createElement("span");
      this.collapseLabel_.textContent = collapseLabel;
      this.collapseLabel_.className = collapseClassName;
    } else {
      this.collapseLabel_ = collapseLabel;
    }
    const label = options.label !== void 0 ? options.label : "i";
    if (typeof label === "string") {
      this.label_ = document.createElement("span");
      this.label_.textContent = label;
      this.label_.className = expandClassName;
    } else {
      this.label_ = label;
    }
    const activeLabel = this.collapsible_ && !this.collapsed_ ? this.collapseLabel_ : this.label_;
    this.toggleButton_ = document.createElement("button");
    this.toggleButton_.setAttribute("type", "button");
    this.toggleButton_.setAttribute("aria-expanded", String(!this.collapsed_));
    this.toggleButton_.title = tipLabel;
    this.toggleButton_.appendChild(activeLabel);
    this.toggleButton_.addEventListener(EventType_default.CLICK, this.handleClick_.bind(this), false);
    const cssClasses = className + " " + CLASS_UNSELECTABLE + " " + CLASS_CONTROL + (this.collapsed_ && this.collapsible_ ? " " + CLASS_COLLAPSED : "") + (this.collapsible_ ? "" : " ol-uncollapsible");
    const element = this.element;
    element.className = cssClasses;
    element.appendChild(this.toggleButton_);
    element.appendChild(this.ulElement_);
    this.renderedAttributions_ = [];
    this.renderedVisible_ = true;
  }
  /**
   * Collect a list of visible attributions and set the collapsible state.
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @return {Array<string>} Attributions.
   * @private
   */
  collectSourceAttributions_(frameState) {
    const layers = this.getMap().getAllLayers();
    const visibleAttributions = new Set(layers.flatMap((layer) => layer.getAttributions(frameState)));
    if (this.attributions_ !== void 0) {
      Array.isArray(this.attributions_) ? this.attributions_.forEach((item) => visibleAttributions.add(item)) : visibleAttributions.add(this.attributions_);
    }
    if (!this.overrideCollapsible_) {
      const collapsible = !layers.some((layer) => layer.getSource()?.getAttributionsCollapsible() === false);
      this.setCollapsible(collapsible);
    }
    return Array.from(visibleAttributions);
  }
  /**
   * @private
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   */
  updateElement_(frameState) {
    return __async(this, null, function* () {
      if (!frameState) {
        if (this.renderedVisible_) {
          this.element.style.display = "none";
          this.renderedVisible_ = false;
        }
        return;
      }
      const attributions = yield Promise.all(this.collectSourceAttributions_(frameState).map((attribution) => toPromise(() => attribution)));
      const visible = attributions.length > 0;
      if (this.renderedVisible_ != visible) {
        this.element.style.display = visible ? "" : "none";
        this.renderedVisible_ = visible;
      }
      if (equals(attributions, this.renderedAttributions_)) {
        return;
      }
      removeChildren(this.ulElement_);
      for (let i = 0, ii = attributions.length; i < ii; ++i) {
        const element = document.createElement("li");
        element.innerHTML = attributions[i];
        this.ulElement_.appendChild(element);
      }
      this.renderedAttributions_ = attributions;
    });
  }
  /**
   * @param {MouseEvent} event The event to handle
   * @private
   */
  handleClick_(event) {
    event.preventDefault();
    this.handleToggle_();
    this.userCollapsed_ = this.collapsed_;
  }
  /**
   * @private
   */
  handleToggle_() {
    this.element.classList.toggle(CLASS_COLLAPSED);
    if (this.collapsed_) {
      replaceNode(this.collapseLabel_, this.label_);
    } else {
      replaceNode(this.label_, this.collapseLabel_);
    }
    this.collapsed_ = !this.collapsed_;
    this.toggleButton_.setAttribute("aria-expanded", String(!this.collapsed_));
  }
  /**
   * Return `true` if the attribution is collapsible, `false` otherwise.
   * @return {boolean} True if the widget is collapsible.
   * @api
   */
  getCollapsible() {
    return this.collapsible_;
  }
  /**
   * Set whether the attribution should be collapsible.
   * @param {boolean} collapsible True if the widget is collapsible.
   * @api
   */
  setCollapsible(collapsible) {
    if (this.collapsible_ === collapsible) {
      return;
    }
    this.collapsible_ = collapsible;
    this.element.classList.toggle("ol-uncollapsible");
    if (this.userCollapsed_) {
      this.handleToggle_();
    }
  }
  /**
   * Collapse or expand the attribution according to the passed parameter. Will
   * not do anything if the attribution isn't collapsible or if the current
   * collapsed state is already the one requested.
   * @param {boolean} collapsed True if the widget is collapsed.
   * @api
   */
  setCollapsed(collapsed) {
    this.userCollapsed_ = collapsed;
    if (!this.collapsible_ || this.collapsed_ === collapsed) {
      return;
    }
    this.handleToggle_();
  }
  /**
   * Return `true` when the attribution is currently collapsed or `false`
   * otherwise.
   * @return {boolean} True if the widget is collapsed.
   * @api
   */
  getCollapsed() {
    return this.collapsed_;
  }
  /**
   * Update the attribution element.
   * @param {import("../MapEvent.js").default} mapEvent Map event.
   * @override
   */
  render(mapEvent) {
    this.updateElement_(mapEvent.frameState);
  }
};
var Attribution_default = Attribution;

// node_modules/ol/control/Rotate.js
var Rotate = class extends Control_default {
  /**
   * @param {Options} [options] Rotate options.
   */
  constructor(options) {
    options = options ? options : {};
    super({
      element: document.createElement("div"),
      render: options.render,
      target: options.target
    });
    const className = options.className !== void 0 ? options.className : "ol-rotate";
    const label = options.label !== void 0 ? options.label : "⇧";
    const compassClassName = options.compassClassName !== void 0 ? options.compassClassName : "ol-compass";
    this.label_ = null;
    if (typeof label === "string") {
      this.label_ = document.createElement("span");
      this.label_.className = compassClassName;
      this.label_.textContent = label;
    } else {
      this.label_ = label;
      this.label_.classList.add(compassClassName);
    }
    const tipLabel = options.tipLabel ? options.tipLabel : "Reset rotation";
    const button = document.createElement("button");
    button.className = className + "-reset";
    button.setAttribute("type", "button");
    button.title = tipLabel;
    button.appendChild(this.label_);
    button.addEventListener(EventType_default.CLICK, this.handleClick_.bind(this), false);
    const cssClasses = className + " " + CLASS_UNSELECTABLE + " " + CLASS_CONTROL;
    const element = this.element;
    element.className = cssClasses;
    element.appendChild(button);
    this.callResetNorth_ = options.resetNorth ? options.resetNorth : void 0;
    this.duration_ = options.duration !== void 0 ? options.duration : 250;
    this.autoHide_ = options.autoHide !== void 0 ? options.autoHide : true;
    this.rotation_ = void 0;
    if (this.autoHide_) {
      this.element.classList.add(CLASS_HIDDEN);
    }
  }
  /**
   * @param {MouseEvent} event The event to handle
   * @private
   */
  handleClick_(event) {
    event.preventDefault();
    if (this.callResetNorth_ !== void 0) {
      this.callResetNorth_();
    } else {
      this.resetNorth_();
    }
  }
  /**
   * @private
   */
  resetNorth_() {
    const map = this.getMap();
    const view = map.getView();
    if (!view) {
      return;
    }
    const rotation = view.getRotation();
    if (rotation !== void 0) {
      if (this.duration_ > 0 && rotation % (2 * Math.PI) !== 0) {
        view.animate({
          rotation: 0,
          duration: this.duration_,
          easing: easeOut
        });
      } else {
        view.setRotation(0);
      }
    }
  }
  /**
   * Update the rotate control element.
   * @param {import("../MapEvent.js").default} mapEvent Map event.
   * @override
   */
  render(mapEvent) {
    const frameState = mapEvent.frameState;
    if (!frameState) {
      return;
    }
    const rotation = frameState.viewState.rotation;
    if (rotation != this.rotation_) {
      const transform = "rotate(" + rotation + "rad)";
      if (this.autoHide_) {
        const contains2 = this.element.classList.contains(CLASS_HIDDEN);
        if (!contains2 && rotation === 0) {
          this.element.classList.add(CLASS_HIDDEN);
        } else if (contains2 && rotation !== 0) {
          this.element.classList.remove(CLASS_HIDDEN);
        }
      }
      this.label_.style.transform = transform;
    }
    this.rotation_ = rotation;
  }
};
var Rotate_default = Rotate;

// node_modules/ol/control/Zoom.js
var Zoom = class extends Control_default {
  /**
   * @param {Options} [options] Zoom options.
   */
  constructor(options) {
    options = options ? options : {};
    super({
      element: document.createElement("div"),
      target: options.target
    });
    const className = options.className !== void 0 ? options.className : "ol-zoom";
    const delta = options.delta !== void 0 ? options.delta : 1;
    const zoomInClassName = options.zoomInClassName !== void 0 ? options.zoomInClassName : className + "-in";
    const zoomOutClassName = options.zoomOutClassName !== void 0 ? options.zoomOutClassName : className + "-out";
    const zoomInLabel = options.zoomInLabel !== void 0 ? options.zoomInLabel : "+";
    const zoomOutLabel = options.zoomOutLabel !== void 0 ? options.zoomOutLabel : "–";
    const zoomInTipLabel = options.zoomInTipLabel !== void 0 ? options.zoomInTipLabel : "Zoom in";
    const zoomOutTipLabel = options.zoomOutTipLabel !== void 0 ? options.zoomOutTipLabel : "Zoom out";
    const inElement = document.createElement("button");
    inElement.className = zoomInClassName;
    inElement.setAttribute("type", "button");
    inElement.title = zoomInTipLabel;
    inElement.appendChild(typeof zoomInLabel === "string" ? document.createTextNode(zoomInLabel) : zoomInLabel);
    inElement.addEventListener(EventType_default.CLICK, this.handleClick_.bind(this, delta), false);
    const outElement = document.createElement("button");
    outElement.className = zoomOutClassName;
    outElement.setAttribute("type", "button");
    outElement.title = zoomOutTipLabel;
    outElement.appendChild(typeof zoomOutLabel === "string" ? document.createTextNode(zoomOutLabel) : zoomOutLabel);
    outElement.addEventListener(EventType_default.CLICK, this.handleClick_.bind(this, -delta), false);
    const cssClasses = className + " " + CLASS_UNSELECTABLE + " " + CLASS_CONTROL;
    const element = this.element;
    element.className = cssClasses;
    element.appendChild(inElement);
    element.appendChild(outElement);
    this.duration_ = options.duration !== void 0 ? options.duration : 250;
  }
  /**
   * @param {number} delta Zoom delta.
   * @param {MouseEvent} event The event to handle
   * @private
   */
  handleClick_(delta, event) {
    event.preventDefault();
    this.zoomByDelta_(delta);
  }
  /**
   * @param {number} delta Zoom delta.
   * @private
   */
  zoomByDelta_(delta) {
    const map = this.getMap();
    const view = map.getView();
    if (!view) {
      return;
    }
    const currentZoom = view.getZoom();
    if (currentZoom !== void 0) {
      const newZoom = view.getConstrainedZoom(currentZoom + delta);
      if (this.duration_ > 0) {
        if (view.getAnimating()) {
          view.cancelAnimations();
        }
        view.animate({
          zoom: newZoom,
          duration: this.duration_,
          easing: easeOut
        });
      } else {
        view.setZoom(newZoom);
      }
    }
  }
};
var Zoom_default = Zoom;

// node_modules/ol/control/defaults.js
function defaults(options) {
  options = options ? options : {};
  const controls = new Collection_default();
  const zoomControl = options.zoom !== void 0 ? options.zoom : true;
  if (zoomControl) {
    controls.push(new Zoom_default(options.zoomOptions));
  }
  const rotateControl = options.rotate !== void 0 ? options.rotate : true;
  if (rotateControl) {
    controls.push(new Rotate_default(options.rotateOptions));
  }
  const attributionControl = options.attribution !== void 0 ? options.attribution : true;
  if (attributionControl) {
    controls.push(new Attribution_default(options.attributionOptions));
  }
  return controls;
}

// node_modules/ol/interaction/Property.js
var Property_default = {
  ACTIVE: "active"
};

// node_modules/ol/interaction/Interaction.js
var Interaction = class extends Object_default {
  /**
   * @param {InteractionOptions} [options] Options.
   */
  constructor(options) {
    super();
    this.on;
    this.once;
    this.un;
    if (options && options.handleEvent) {
      this.handleEvent = options.handleEvent;
    }
    this.map_ = null;
    this.setActive(true);
  }
  /**
   * Return whether the interaction is currently active.
   * @return {boolean} `true` if the interaction is active, `false` otherwise.
   * @observable
   * @api
   */
  getActive() {
    return (
      /** @type {boolean} */
      this.get(Property_default.ACTIVE)
    );
  }
  /**
   * Get the map associated with this interaction.
   * @return {import("../Map.js").default|null} Map.
   * @api
   */
  getMap() {
    return this.map_;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event}.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   */
  handleEvent(mapBrowserEvent) {
    return true;
  }
  /**
   * Activate or deactivate the interaction.
   * @param {boolean} active Active.
   * @observable
   * @api
   */
  setActive(active) {
    this.set(Property_default.ACTIVE, active);
  }
  /**
   * Remove the interaction from its current map and attach it to the new map.
   * Subclasses may set up event handlers to get notified about changes to
   * the map here.
   * @param {import("../Map.js").default|null} map Map.
   */
  setMap(map) {
    this.map_ = map;
  }
};
function pan(view, delta, duration) {
  const currentCenter = view.getCenterInternal();
  if (currentCenter) {
    const center = [currentCenter[0] + delta[0], currentCenter[1] + delta[1]];
    view.animateInternal({
      duration: duration !== void 0 ? duration : 250,
      easing: linear,
      center: view.getConstrainedCenter(center)
    });
  }
}
function zoomByDelta(view, delta, anchor, duration) {
  const currentZoom = view.getZoom();
  if (currentZoom === void 0) {
    return;
  }
  const newZoom = view.getConstrainedZoom(currentZoom + delta);
  const newResolution = view.getResolutionForZoom(newZoom);
  if (view.getAnimating()) {
    view.cancelAnimations();
  }
  view.animate({
    resolution: newResolution,
    anchor,
    duration: duration !== void 0 ? duration : 250,
    easing: easeOut
  });
}
var Interaction_default = Interaction;

// node_modules/ol/interaction/DoubleClickZoom.js
var DoubleClickZoom = class extends Interaction_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    super();
    options = options ? options : {};
    this.delta_ = options.delta ? options.delta : 1;
    this.duration_ = options.duration !== void 0 ? options.duration : 250;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} (if it was a
   * doubleclick) and eventually zooms the map.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(mapBrowserEvent) {
    let stopEvent = false;
    if (mapBrowserEvent.type == MapBrowserEventType_default.DBLCLICK) {
      const browserEvent = (
        /** @type {MouseEvent} */
        mapBrowserEvent.originalEvent
      );
      const map = mapBrowserEvent.map;
      const anchor = mapBrowserEvent.coordinate;
      const delta = browserEvent.shiftKey ? -this.delta_ : this.delta_;
      const view = map.getView();
      zoomByDelta(view, delta, anchor, this.duration_);
      browserEvent.preventDefault();
      stopEvent = true;
    }
    return !stopEvent;
  }
};
var DoubleClickZoom_default = DoubleClickZoom;

// node_modules/ol/interaction/Pointer.js
var PointerInteraction = class extends Interaction_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    options = options ? options : {};
    super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      options
    );
    if (options.handleDownEvent) {
      this.handleDownEvent = options.handleDownEvent;
    }
    if (options.handleDragEvent) {
      this.handleDragEvent = options.handleDragEvent;
    }
    if (options.handleMoveEvent) {
      this.handleMoveEvent = options.handleMoveEvent;
    }
    if (options.handleUpEvent) {
      this.handleUpEvent = options.handleUpEvent;
    }
    if (options.stopDown) {
      this.stopDown = options.stopDown;
    }
    this.handlingDownUpSequence = false;
    this.targetPointers = [];
  }
  /**
   * Returns the current number of pointers involved in the interaction,
   * e.g. `2` when two fingers are used.
   * @return {number} The number of pointers.
   * @api
   */
  getPointerCount() {
    return this.targetPointers.length;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @protected
   */
  handleDownEvent(mapBrowserEvent) {
    return false;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @protected
   */
  handleDragEvent(mapBrowserEvent) {
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} and may call into
   * other functions, if event sequences like e.g. 'drag' or 'down-up' etc. are
   * detected.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   * @override
   */
  handleEvent(mapBrowserEvent) {
    if (!mapBrowserEvent.originalEvent) {
      return true;
    }
    let stopEvent = false;
    this.updateTrackedPointers_(mapBrowserEvent);
    if (this.handlingDownUpSequence) {
      if (mapBrowserEvent.type == MapBrowserEventType_default.POINTERDRAG) {
        this.handleDragEvent(mapBrowserEvent);
        mapBrowserEvent.originalEvent.preventDefault();
      } else if (mapBrowserEvent.type == MapBrowserEventType_default.POINTERUP) {
        const handledUp = this.handleUpEvent(mapBrowserEvent);
        this.handlingDownUpSequence = handledUp && this.targetPointers.length > 0;
      }
    } else {
      if (mapBrowserEvent.type == MapBrowserEventType_default.POINTERDOWN) {
        const handled = this.handleDownEvent(mapBrowserEvent);
        this.handlingDownUpSequence = handled;
        stopEvent = this.stopDown(handled);
      } else if (mapBrowserEvent.type == MapBrowserEventType_default.POINTERMOVE) {
        this.handleMoveEvent(mapBrowserEvent);
      }
    }
    return !stopEvent;
  }
  /**
   * Handle pointer move events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @protected
   */
  handleMoveEvent(mapBrowserEvent) {
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @protected
   */
  handleUpEvent(mapBrowserEvent) {
    return false;
  }
  /**
   * This function is used to determine if "down" events should be propagated
   * to other interactions or should be stopped.
   * @param {boolean} handled Was the event handled by the interaction?
   * @return {boolean} Should the `down` event be stopped?
   */
  stopDown(handled) {
    return handled;
  }
  /**
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @private
   */
  updateTrackedPointers_(mapBrowserEvent) {
    if (mapBrowserEvent.activePointers) {
      this.targetPointers = mapBrowserEvent.activePointers;
    }
  }
};
function centroid(pointerEvents) {
  const length = pointerEvents.length;
  let clientX = 0;
  let clientY = 0;
  for (let i = 0; i < length; i++) {
    clientX += pointerEvents[i].clientX;
    clientY += pointerEvents[i].clientY;
  }
  return {
    clientX: clientX / length,
    clientY: clientY / length
  };
}
var Pointer_default = PointerInteraction;

// node_modules/ol/events/condition.js
function all(var_args) {
  const conditions = arguments;
  return function(event) {
    let pass = true;
    for (let i = 0, ii = conditions.length; i < ii; ++i) {
      pass = pass && conditions[i](event);
      if (!pass) {
        break;
      }
    }
    return pass;
  };
}
var altShiftKeysOnly = function(mapBrowserEvent) {
  const originalEvent = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    mapBrowserEvent.originalEvent
  );
  return originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && originalEvent.shiftKey;
};
var focus = function(event) {
  const targetElement = event.map.getTargetElement();
  const rootNode = targetElement.getRootNode();
  const activeElement = event.map.getOwnerDocument().activeElement;
  return rootNode instanceof ShadowRoot ? rootNode.host.contains(activeElement) : targetElement.contains(activeElement);
};
var focusWithTabindex = function(event) {
  const targetElement = event.map.getTargetElement();
  const rootNode = targetElement.getRootNode();
  const tabIndexCandidate = rootNode instanceof ShadowRoot ? rootNode.host : targetElement;
  return tabIndexCandidate.hasAttribute("tabindex") ? focus(event) : true;
};
var always2 = TRUE;
var mouseActionButton = function(mapBrowserEvent) {
  const originalEvent = (
    /** @type {MouseEvent} */
    mapBrowserEvent.originalEvent
  );
  return originalEvent.button == 0 && !(WEBKIT && MAC && originalEvent.ctrlKey);
};
var noModifierKeys = function(mapBrowserEvent) {
  const originalEvent = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    mapBrowserEvent.originalEvent
  );
  return !originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && !originalEvent.shiftKey;
};
var platformModifierKey = function(mapBrowserEvent) {
  const originalEvent = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    mapBrowserEvent.originalEvent
  );
  return MAC ? originalEvent.metaKey : originalEvent.ctrlKey;
};
var shiftKeyOnly = function(mapBrowserEvent) {
  const originalEvent = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    mapBrowserEvent.originalEvent
  );
  return !originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && originalEvent.shiftKey;
};
var targetNotEditable = function(mapBrowserEvent) {
  const originalEvent = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    mapBrowserEvent.originalEvent
  );
  const tagName = (
    /** @type {Element} */
    originalEvent.target.tagName
  );
  return tagName !== "INPUT" && tagName !== "SELECT" && tagName !== "TEXTAREA" && // `isContentEditable` is only available on `HTMLElement`, but it may also be a
  // different type like `SVGElement`.
  // @ts-ignore
  !originalEvent.target.isContentEditable;
};
var mouseOnly = function(mapBrowserEvent) {
  const pointerEvent = (
    /** @type {import("../MapBrowserEvent").default} */
    mapBrowserEvent.originalEvent
  );
  assert(pointerEvent !== void 0, "mapBrowserEvent must originate from a pointer event");
  return pointerEvent.pointerType == "mouse";
};
var primaryAction = function(mapBrowserEvent) {
  const pointerEvent = (
    /** @type {import("../MapBrowserEvent").default} */
    mapBrowserEvent.originalEvent
  );
  assert(pointerEvent !== void 0, "mapBrowserEvent must originate from a pointer event");
  return pointerEvent.isPrimary && pointerEvent.button === 0;
};

// node_modules/ol/interaction/DragPan.js
var DragPan = class extends Pointer_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    super({
      stopDown: FALSE
    });
    options = options ? options : {};
    this.kinetic_ = options.kinetic;
    this.lastCentroid = null;
    this.lastPointersCount_;
    this.panning_ = false;
    const condition = options.condition ? options.condition : all(noModifierKeys, primaryAction);
    this.condition_ = options.onFocusOnly ? all(focusWithTabindex, condition) : condition;
    this.noKinetic_ = false;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(mapBrowserEvent) {
    const map = mapBrowserEvent.map;
    if (!this.panning_) {
      this.panning_ = true;
      map.getView().beginInteraction();
    }
    const targetPointers = this.targetPointers;
    const centroid2 = map.getEventPixel(centroid(targetPointers));
    if (targetPointers.length == this.lastPointersCount_) {
      if (this.kinetic_) {
        this.kinetic_.update(centroid2[0], centroid2[1]);
      }
      if (this.lastCentroid) {
        const delta = [this.lastCentroid[0] - centroid2[0], centroid2[1] - this.lastCentroid[1]];
        const map2 = mapBrowserEvent.map;
        const view = map2.getView();
        scale(delta, view.getResolution());
        rotate(delta, view.getRotation());
        view.adjustCenterInternal(delta);
      }
    } else if (this.kinetic_) {
      this.kinetic_.begin();
    }
    this.lastCentroid = centroid2;
    this.lastPointersCount_ = targetPointers.length;
    mapBrowserEvent.originalEvent.preventDefault();
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(mapBrowserEvent) {
    const map = mapBrowserEvent.map;
    const view = map.getView();
    if (this.targetPointers.length === 0) {
      if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
        const distance = this.kinetic_.getDistance();
        const angle = this.kinetic_.getAngle();
        const center = view.getCenterInternal();
        const centerpx = map.getPixelFromCoordinateInternal(center);
        const dest = map.getCoordinateFromPixelInternal([centerpx[0] - distance * Math.cos(angle), centerpx[1] - distance * Math.sin(angle)]);
        view.animateInternal({
          center: view.getConstrainedCenter(dest),
          duration: 500,
          easing: easeOut
        });
      }
      if (this.panning_) {
        this.panning_ = false;
        view.endInteraction();
      }
      return false;
    }
    if (this.kinetic_) {
      this.kinetic_.begin();
    }
    this.lastCentroid = null;
    return true;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(mapBrowserEvent) {
    if (this.targetPointers.length > 0 && this.condition_(mapBrowserEvent)) {
      const map = mapBrowserEvent.map;
      const view = map.getView();
      this.lastCentroid = null;
      if (view.getAnimating()) {
        view.cancelAnimations();
      }
      if (this.kinetic_) {
        this.kinetic_.begin();
      }
      this.noKinetic_ = this.targetPointers.length > 1;
      return true;
    }
    return false;
  }
};
var DragPan_default = DragPan;

// node_modules/ol/interaction/DragRotate.js
var DragRotate = class extends Pointer_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    options = options ? options : {};
    super({
      stopDown: FALSE
    });
    this.condition_ = options.condition ? options.condition : altShiftKeysOnly;
    this.lastAngle_ = void 0;
    this.duration_ = options.duration !== void 0 ? options.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(mapBrowserEvent) {
    if (!mouseOnly(mapBrowserEvent)) {
      return;
    }
    const map = mapBrowserEvent.map;
    const view = map.getView();
    if (view.getConstraints().rotation === disable) {
      return;
    }
    const size = map.getSize();
    const offset = mapBrowserEvent.pixel;
    const theta = Math.atan2(size[1] / 2 - offset[1], offset[0] - size[0] / 2);
    if (this.lastAngle_ !== void 0) {
      const delta = theta - this.lastAngle_;
      view.adjustRotationInternal(-delta);
    }
    this.lastAngle_ = theta;
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(mapBrowserEvent) {
    if (!mouseOnly(mapBrowserEvent)) {
      return true;
    }
    const map = mapBrowserEvent.map;
    const view = map.getView();
    view.endInteraction(this.duration_);
    return false;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(mapBrowserEvent) {
    if (!mouseOnly(mapBrowserEvent)) {
      return false;
    }
    if (mouseActionButton(mapBrowserEvent) && this.condition_(mapBrowserEvent)) {
      const map = mapBrowserEvent.map;
      map.getView().beginInteraction();
      this.lastAngle_ = void 0;
      return true;
    }
    return false;
  }
};
var DragRotate_default = DragRotate;

// node_modules/ol/render/Box.js
var RenderBox = class extends Disposable_default {
  /**
   * @param {string} className CSS class name.
   */
  constructor(className) {
    super();
    this.geometry_ = null;
    this.element_ = document.createElement("div");
    this.element_.style.position = "absolute";
    this.element_.style.pointerEvents = "auto";
    this.element_.className = "ol-box " + className;
    this.map_ = null;
    this.startPixel_ = null;
    this.endPixel_ = null;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.setMap(null);
  }
  /**
   * @private
   */
  render_() {
    const startPixel = this.startPixel_;
    const endPixel = this.endPixel_;
    const px = "px";
    const style = this.element_.style;
    style.left = Math.min(startPixel[0], endPixel[0]) + px;
    style.top = Math.min(startPixel[1], endPixel[1]) + px;
    style.width = Math.abs(endPixel[0] - startPixel[0]) + px;
    style.height = Math.abs(endPixel[1] - startPixel[1]) + px;
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   */
  setMap(map) {
    if (this.map_) {
      this.map_.getOverlayContainer().removeChild(this.element_);
      const style = this.element_.style;
      style.left = "inherit";
      style.top = "inherit";
      style.width = "inherit";
      style.height = "inherit";
    }
    this.map_ = map;
    if (this.map_) {
      this.map_.getOverlayContainer().appendChild(this.element_);
    }
  }
  /**
   * @param {import("../pixel.js").Pixel} startPixel Start pixel.
   * @param {import("../pixel.js").Pixel} endPixel End pixel.
   */
  setPixels(startPixel, endPixel) {
    this.startPixel_ = startPixel;
    this.endPixel_ = endPixel;
    this.createOrUpdateGeometry();
    this.render_();
  }
  /**
   * Creates or updates the cached geometry.
   */
  createOrUpdateGeometry() {
    if (!this.map_) {
      return;
    }
    const startPixel = this.startPixel_;
    const endPixel = this.endPixel_;
    const pixels = [startPixel, [startPixel[0], endPixel[1]], endPixel, [endPixel[0], startPixel[1]]];
    const coordinates = pixels.map(this.map_.getCoordinateFromPixelInternal, this.map_);
    coordinates[4] = coordinates[0].slice();
    if (!this.geometry_) {
      this.geometry_ = new Polygon_default([coordinates]);
    } else {
      this.geometry_.setCoordinates([coordinates]);
    }
  }
  /**
   * @return {import("../geom/Polygon.js").default} Geometry.
   */
  getGeometry() {
    return this.geometry_;
  }
};
var Box_default = RenderBox;

// node_modules/ol/interaction/DragBox.js
var DragBoxEventType = {
  /**
   * Triggered upon drag box start.
   * @event DragBoxEvent#boxstart
   * @api
   */
  BOXSTART: "boxstart",
  /**
   * Triggered on drag when box is active.
   * @event DragBoxEvent#boxdrag
   * @api
   */
  BOXDRAG: "boxdrag",
  /**
   * Triggered upon drag box end.
   * @event DragBoxEvent#boxend
   * @api
   */
  BOXEND: "boxend",
  /**
   * Triggered upon drag box canceled.
   * @event DragBoxEvent#boxcancel
   * @api
   */
  BOXCANCEL: "boxcancel"
};
var DragBoxEvent = class extends Event_default {
  /**
   * @param {string} type The event type.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Originating event.
   */
  constructor(type, coordinate, mapBrowserEvent) {
    super(type);
    this.coordinate = coordinate;
    this.mapBrowserEvent = mapBrowserEvent;
  }
};
var DragBox = class extends Pointer_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    super();
    this.on;
    this.once;
    this.un;
    options = options ?? {};
    this.box_ = new Box_default(options.className || "ol-dragbox");
    this.minArea_ = options.minArea ?? 64;
    if (options.onBoxEnd) {
      this.onBoxEnd = options.onBoxEnd;
    }
    this.startPixel_ = null;
    this.condition_ = options.condition ?? mouseActionButton;
    this.boxEndCondition_ = options.boxEndCondition ?? this.defaultBoxEndCondition;
  }
  /**
   * The default condition for determining whether the boxend event
   * should fire.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent The originating MapBrowserEvent
   *     leading to the box end.
   * @param {import("../pixel.js").Pixel} startPixel The starting pixel of the box.
   * @param {import("../pixel.js").Pixel} endPixel The end pixel of the box.
   * @return {boolean} Whether or not the boxend condition should be fired.
   */
  defaultBoxEndCondition(mapBrowserEvent, startPixel, endPixel) {
    const width = endPixel[0] - startPixel[0];
    const height = endPixel[1] - startPixel[1];
    return width * width + height * height >= this.minArea_;
  }
  /**
   * Returns geometry of last drawn box.
   * @return {import("../geom/Polygon.js").default} Geometry.
   * @api
   */
  getGeometry() {
    return this.box_.getGeometry();
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(mapBrowserEvent) {
    if (!this.startPixel_) {
      return;
    }
    this.box_.setPixels(this.startPixel_, mapBrowserEvent.pixel);
    this.dispatchEvent(new DragBoxEvent(DragBoxEventType.BOXDRAG, mapBrowserEvent.coordinate, mapBrowserEvent));
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(mapBrowserEvent) {
    if (!this.startPixel_) {
      return false;
    }
    const completeBox = this.boxEndCondition_(mapBrowserEvent, this.startPixel_, mapBrowserEvent.pixel);
    if (completeBox) {
      this.onBoxEnd(mapBrowserEvent);
    }
    this.dispatchEvent(new DragBoxEvent(completeBox ? DragBoxEventType.BOXEND : DragBoxEventType.BOXCANCEL, mapBrowserEvent.coordinate, mapBrowserEvent));
    this.box_.setMap(null);
    this.startPixel_ = null;
    return false;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(mapBrowserEvent) {
    if (this.condition_(mapBrowserEvent)) {
      this.startPixel_ = mapBrowserEvent.pixel;
      this.box_.setMap(mapBrowserEvent.map);
      this.box_.setPixels(this.startPixel_, this.startPixel_);
      this.dispatchEvent(new DragBoxEvent(DragBoxEventType.BOXSTART, mapBrowserEvent.coordinate, mapBrowserEvent));
      return true;
    }
    return false;
  }
  /**
   * Function to execute just before `onboxend` is fired
   * @param {import("../MapBrowserEvent.js").default} event Event.
   */
  onBoxEnd(event) {
  }
  /**
   * Activate or deactivate the interaction.
   * @param {boolean} active Active.
   * @observable
   * @api
   * @override
   */
  setActive(active) {
    if (!active) {
      this.box_.setMap(null);
      if (this.startPixel_) {
        this.dispatchEvent(new DragBoxEvent(DragBoxEventType.BOXCANCEL, this.startPixel_, null));
        this.startPixel_ = null;
      }
    }
    super.setActive(active);
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   * @override
   */
  setMap(map) {
    const oldMap = this.getMap();
    if (oldMap) {
      this.box_.setMap(null);
      if (this.startPixel_) {
        this.dispatchEvent(new DragBoxEvent(DragBoxEventType.BOXCANCEL, this.startPixel_, null));
        this.startPixel_ = null;
      }
    }
    super.setMap(map);
  }
};
var DragBox_default = DragBox;

// node_modules/ol/interaction/DragZoom.js
var DragZoom = class extends DragBox_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    options = options ? options : {};
    const condition = options.condition ? options.condition : shiftKeyOnly;
    super({
      condition,
      className: options.className || "ol-dragzoom",
      minArea: options.minArea
    });
    this.duration_ = options.duration !== void 0 ? options.duration : 200;
    this.out_ = options.out !== void 0 ? options.out : false;
  }
  /**
   * Function to execute just before `onboxend` is fired
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @override
   */
  onBoxEnd(event) {
    const map = this.getMap();
    const view = (
      /** @type {!import("../View.js").default} */
      map.getView()
    );
    let geometry = this.getGeometry();
    if (this.out_) {
      const rotatedExtent = view.rotatedExtentForGeometry(geometry);
      const resolution = view.getResolutionForExtentInternal(rotatedExtent);
      const factor = view.getResolution() / resolution;
      geometry = geometry.clone();
      geometry.scale(factor * factor);
    }
    view.fitInternal(geometry, {
      duration: this.duration_,
      easing: easeOut
    });
  }
};
var DragZoom_default = DragZoom;

// node_modules/ol/events/Key.js
var Key_default = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown"
};

// node_modules/ol/interaction/KeyboardPan.js
var KeyboardPan = class extends Interaction_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    super();
    options = options || {};
    this.defaultCondition_ = function(mapBrowserEvent) {
      return noModifierKeys(mapBrowserEvent) && targetNotEditable(mapBrowserEvent);
    };
    this.condition_ = options.condition !== void 0 ? options.condition : this.defaultCondition_;
    this.duration_ = options.duration !== void 0 ? options.duration : 100;
    this.pixelDelta_ = options.pixelDelta !== void 0 ? options.pixelDelta : 128;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} if it was a
   * `KeyEvent`, and decides the direction to pan to (if an arrow key was
   * pressed).
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(mapBrowserEvent) {
    let stopEvent = false;
    if (mapBrowserEvent.type == EventType_default.KEYDOWN) {
      const keyEvent = (
        /** @type {KeyboardEvent} */
        mapBrowserEvent.originalEvent
      );
      const key = keyEvent.key;
      if (this.condition_(mapBrowserEvent) && (key == Key_default.DOWN || key == Key_default.LEFT || key == Key_default.RIGHT || key == Key_default.UP)) {
        const map = mapBrowserEvent.map;
        const view = map.getView();
        const mapUnitsDelta = view.getResolution() * this.pixelDelta_;
        let deltaX = 0, deltaY = 0;
        if (key == Key_default.DOWN) {
          deltaY = -mapUnitsDelta;
        } else if (key == Key_default.LEFT) {
          deltaX = -mapUnitsDelta;
        } else if (key == Key_default.RIGHT) {
          deltaX = mapUnitsDelta;
        } else {
          deltaY = mapUnitsDelta;
        }
        const delta = [deltaX, deltaY];
        rotate(delta, view.getRotation());
        pan(view, delta, this.duration_);
        keyEvent.preventDefault();
        stopEvent = true;
      }
    }
    return !stopEvent;
  }
};
var KeyboardPan_default = KeyboardPan;

// node_modules/ol/interaction/KeyboardZoom.js
var KeyboardZoom = class extends Interaction_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    super();
    options = options ? options : {};
    this.condition_ = options.condition ? options.condition : function(mapBrowserEvent) {
      return !platformModifierKey(mapBrowserEvent) && targetNotEditable(mapBrowserEvent);
    };
    this.delta_ = options.delta ? options.delta : 1;
    this.duration_ = options.duration !== void 0 ? options.duration : 100;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} if it was a
   * `KeyEvent`, and decides whether to zoom in or out (depending on whether the
   * key pressed was '+' or '-').
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(mapBrowserEvent) {
    let stopEvent = false;
    if (mapBrowserEvent.type == EventType_default.KEYDOWN || mapBrowserEvent.type == EventType_default.KEYPRESS) {
      const keyEvent = (
        /** @type {KeyboardEvent} */
        mapBrowserEvent.originalEvent
      );
      const key = keyEvent.key;
      if (this.condition_(mapBrowserEvent) && (key === "+" || key === "-")) {
        const map = mapBrowserEvent.map;
        const delta = key === "+" ? this.delta_ : -this.delta_;
        const view = map.getView();
        zoomByDelta(view, delta, void 0, this.duration_);
        keyEvent.preventDefault();
        stopEvent = true;
      }
    }
    return !stopEvent;
  }
};
var KeyboardZoom_default = KeyboardZoom;

// node_modules/ol/Kinetic.js
var Kinetic = class {
  /**
   * @param {number} decay Rate of decay (must be negative).
   * @param {number} minVelocity Minimum velocity (pixels/millisecond).
   * @param {number} delay Delay to consider to calculate the kinetic
   *     initial values (milliseconds).
   */
  constructor(decay, minVelocity, delay) {
    this.decay_ = decay;
    this.minVelocity_ = minVelocity;
    this.delay_ = delay;
    this.points_ = [];
    this.angle_ = 0;
    this.initialVelocity_ = 0;
  }
  /**
   * FIXME empty description for jsdoc
   */
  begin() {
    this.points_.length = 0;
    this.angle_ = 0;
    this.initialVelocity_ = 0;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   */
  update(x, y) {
    this.points_.push(x, y, Date.now());
  }
  /**
   * @return {boolean} Whether we should do kinetic animation.
   */
  end() {
    if (this.points_.length < 6) {
      return false;
    }
    const delay = Date.now() - this.delay_;
    const lastIndex = this.points_.length - 3;
    if (this.points_[lastIndex + 2] < delay) {
      return false;
    }
    let firstIndex = lastIndex - 3;
    while (firstIndex > 0 && this.points_[firstIndex + 2] > delay) {
      firstIndex -= 3;
    }
    const duration = this.points_[lastIndex + 2] - this.points_[firstIndex + 2];
    if (duration < 1e3 / 60) {
      return false;
    }
    const dx = this.points_[lastIndex] - this.points_[firstIndex];
    const dy = this.points_[lastIndex + 1] - this.points_[firstIndex + 1];
    this.angle_ = Math.atan2(dy, dx);
    this.initialVelocity_ = Math.sqrt(dx * dx + dy * dy) / duration;
    return this.initialVelocity_ > this.minVelocity_;
  }
  /**
   * @return {number} Total distance travelled (pixels).
   */
  getDistance() {
    return (this.minVelocity_ - this.initialVelocity_) / this.decay_;
  }
  /**
   * @return {number} Angle of the kinetic panning animation (radians).
   */
  getAngle() {
    return this.angle_;
  }
};
var Kinetic_default = Kinetic;

// node_modules/ol/interaction/MouseWheelZoom.js
var MouseWheelZoom = class extends Interaction_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    options = options ? options : {};
    super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      options
    );
    this.totalDelta_ = 0;
    this.lastDelta_ = 0;
    this.maxDelta_ = options.maxDelta !== void 0 ? options.maxDelta : 1;
    this.duration_ = options.duration !== void 0 ? options.duration : 250;
    this.timeout_ = options.timeout !== void 0 ? options.timeout : 80;
    this.useAnchor_ = options.useAnchor !== void 0 ? options.useAnchor : true;
    this.constrainResolution_ = options.constrainResolution !== void 0 ? options.constrainResolution : false;
    const condition = options.condition ? options.condition : always2;
    this.condition_ = options.onFocusOnly ? all(focusWithTabindex, condition) : condition;
    this.lastAnchor_ = null;
    this.startTime_ = void 0;
    this.timeoutId_;
    this.mode_ = void 0;
    this.trackpadEventGap_ = 400;
    this.trackpadTimeoutId_;
    this.deltaPerZoom_ = 300;
  }
  /**
   * @private
   */
  endInteraction_() {
    this.trackpadTimeoutId_ = void 0;
    const map = this.getMap();
    if (!map) {
      return;
    }
    const view = map.getView();
    view.endInteraction(void 0, this.lastDelta_ ? this.lastDelta_ > 0 ? 1 : -1 : 0, this.lastAnchor_ ? map.getCoordinateFromPixel(this.lastAnchor_) : null);
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} (if it was a mousewheel-event) and eventually
   * zooms the map.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(mapBrowserEvent) {
    if (!this.condition_(mapBrowserEvent)) {
      return true;
    }
    const type = mapBrowserEvent.type;
    if (type !== EventType_default.WHEEL) {
      return true;
    }
    const map = mapBrowserEvent.map;
    const wheelEvent = (
      /** @type {WheelEvent} */
      mapBrowserEvent.originalEvent
    );
    wheelEvent.preventDefault();
    if (this.useAnchor_) {
      this.lastAnchor_ = mapBrowserEvent.pixel;
    }
    let delta;
    if (mapBrowserEvent.type == EventType_default.WHEEL) {
      delta = wheelEvent.deltaY;
      if (FIREFOX && wheelEvent.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
        delta /= DEVICE_PIXEL_RATIO;
      }
      if (wheelEvent.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        delta *= 40;
      }
    }
    if (delta === 0) {
      return false;
    }
    this.lastDelta_ = delta;
    const now = Date.now();
    if (this.startTime_ === void 0) {
      this.startTime_ = now;
    }
    if (!this.mode_ || now - this.startTime_ > this.trackpadEventGap_) {
      this.mode_ = Math.abs(delta) < 4 ? "trackpad" : "wheel";
    }
    const view = map.getView();
    if (this.mode_ === "trackpad" && !(view.getConstrainResolution() || this.constrainResolution_)) {
      if (this.trackpadTimeoutId_) {
        clearTimeout(this.trackpadTimeoutId_);
      } else {
        if (view.getAnimating()) {
          view.cancelAnimations();
        }
        view.beginInteraction();
      }
      this.trackpadTimeoutId_ = setTimeout(this.endInteraction_.bind(this), this.timeout_);
      view.adjustZoom(-delta / this.deltaPerZoom_, this.lastAnchor_ ? map.getCoordinateFromPixel(this.lastAnchor_) : null);
      this.startTime_ = now;
      return false;
    }
    this.totalDelta_ += delta;
    const timeLeft = Math.max(this.timeout_ - (now - this.startTime_), 0);
    clearTimeout(this.timeoutId_);
    this.timeoutId_ = setTimeout(this.handleWheelZoom_.bind(this, map), timeLeft);
    return false;
  }
  /**
   * @private
   * @param {import("../Map.js").default} map Map.
   */
  handleWheelZoom_(map) {
    const view = map.getView();
    if (view.getAnimating()) {
      view.cancelAnimations();
    }
    let delta = -clamp(this.totalDelta_, -this.maxDelta_ * this.deltaPerZoom_, this.maxDelta_ * this.deltaPerZoom_) / this.deltaPerZoom_;
    if (view.getConstrainResolution() || this.constrainResolution_) {
      delta = delta ? delta > 0 ? 1 : -1 : 0;
    }
    zoomByDelta(view, delta, this.lastAnchor_ ? map.getCoordinateFromPixel(this.lastAnchor_) : null, this.duration_);
    this.mode_ = void 0;
    this.totalDelta_ = 0;
    this.lastAnchor_ = null;
    this.startTime_ = void 0;
    this.timeoutId_ = void 0;
  }
  /**
   * Enable or disable using the mouse's location as an anchor when zooming
   * @param {boolean} useAnchor true to zoom to the mouse's location, false
   * to zoom to the center of the map
   * @api
   */
  setMouseAnchor(useAnchor) {
    this.useAnchor_ = useAnchor;
    if (!useAnchor) {
      this.lastAnchor_ = null;
    }
  }
};
var MouseWheelZoom_default = MouseWheelZoom;

// node_modules/ol/interaction/PinchRotate.js
var PinchRotate = class extends Pointer_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    options = options ? options : {};
    const pointerOptions = (
      /** @type {import("./Pointer.js").Options} */
      options
    );
    if (!pointerOptions.stopDown) {
      pointerOptions.stopDown = FALSE;
    }
    super(pointerOptions);
    this.anchor_ = null;
    this.lastAngle_ = void 0;
    this.rotating_ = false;
    this.rotationDelta_ = 0;
    this.threshold_ = options.threshold !== void 0 ? options.threshold : 0.3;
    this.duration_ = options.duration !== void 0 ? options.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(mapBrowserEvent) {
    let rotationDelta = 0;
    const touch0 = this.targetPointers[0];
    const touch1 = this.targetPointers[1];
    const angle = Math.atan2(touch1.clientY - touch0.clientY, touch1.clientX - touch0.clientX);
    if (this.lastAngle_ !== void 0) {
      const delta = angle - this.lastAngle_;
      this.rotationDelta_ += delta;
      if (!this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_) {
        this.rotating_ = true;
      }
      rotationDelta = delta;
    }
    this.lastAngle_ = angle;
    const map = mapBrowserEvent.map;
    const view = map.getView();
    if (view.getConstraints().rotation === disable) {
      return;
    }
    this.anchor_ = map.getCoordinateFromPixelInternal(map.getEventPixel(centroid(this.targetPointers)));
    if (this.rotating_) {
      map.render();
      view.adjustRotationInternal(rotationDelta, this.anchor_);
    }
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(mapBrowserEvent) {
    if (this.targetPointers.length < 2) {
      const map = mapBrowserEvent.map;
      const view = map.getView();
      view.endInteraction(this.duration_);
      return false;
    }
    return true;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(mapBrowserEvent) {
    if (this.targetPointers.length >= 2) {
      const map = mapBrowserEvent.map;
      this.anchor_ = null;
      this.lastAngle_ = void 0;
      this.rotating_ = false;
      this.rotationDelta_ = 0;
      if (!this.handlingDownUpSequence) {
        map.getView().beginInteraction();
      }
      return true;
    }
    return false;
  }
};
var PinchRotate_default = PinchRotate;

// node_modules/ol/interaction/PinchZoom.js
var PinchZoom = class extends Pointer_default {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    options = options ? options : {};
    const pointerOptions = (
      /** @type {import("./Pointer.js").Options} */
      options
    );
    if (!pointerOptions.stopDown) {
      pointerOptions.stopDown = FALSE;
    }
    super(pointerOptions);
    this.anchor_ = null;
    this.duration_ = options.duration !== void 0 ? options.duration : 400;
    this.lastDistance_ = void 0;
    this.lastScaleDelta_ = 1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(mapBrowserEvent) {
    let scaleDelta = 1;
    const touch0 = this.targetPointers[0];
    const touch1 = this.targetPointers[1];
    const dx = touch0.clientX - touch1.clientX;
    const dy = touch0.clientY - touch1.clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (this.lastDistance_ !== void 0) {
      scaleDelta = this.lastDistance_ / distance;
    }
    this.lastDistance_ = distance;
    const map = mapBrowserEvent.map;
    const view = map.getView();
    if (scaleDelta != 1) {
      this.lastScaleDelta_ = scaleDelta;
    }
    this.anchor_ = map.getCoordinateFromPixelInternal(map.getEventPixel(centroid(this.targetPointers)));
    map.render();
    view.adjustResolutionInternal(scaleDelta, this.anchor_);
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(mapBrowserEvent) {
    if (this.targetPointers.length < 2) {
      const map = mapBrowserEvent.map;
      const view = map.getView();
      const direction = this.lastScaleDelta_ > 1 ? 1 : -1;
      view.endInteraction(this.duration_, direction);
      return false;
    }
    return true;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(mapBrowserEvent) {
    if (this.targetPointers.length >= 2) {
      const map = mapBrowserEvent.map;
      this.anchor_ = null;
      this.lastDistance_ = void 0;
      this.lastScaleDelta_ = 1;
      if (!this.handlingDownUpSequence) {
        map.getView().beginInteraction();
      }
      return true;
    }
    return false;
  }
};
var PinchZoom_default = PinchZoom;

// node_modules/ol/interaction/defaults.js
function defaults2(options) {
  options = options ? options : {};
  const interactions = new Collection_default();
  const kinetic = new Kinetic_default(-5e-3, 0.05, 100);
  const altShiftDragRotate = options.altShiftDragRotate !== void 0 ? options.altShiftDragRotate : true;
  if (altShiftDragRotate) {
    interactions.push(new DragRotate_default());
  }
  const doubleClickZoom = options.doubleClickZoom !== void 0 ? options.doubleClickZoom : true;
  if (doubleClickZoom) {
    interactions.push(new DoubleClickZoom_default({
      delta: options.zoomDelta,
      duration: options.zoomDuration
    }));
  }
  const dragPan = options.dragPan !== void 0 ? options.dragPan : true;
  if (dragPan) {
    interactions.push(new DragPan_default({
      onFocusOnly: options.onFocusOnly,
      kinetic
    }));
  }
  const pinchRotate = options.pinchRotate !== void 0 ? options.pinchRotate : true;
  if (pinchRotate) {
    interactions.push(new PinchRotate_default());
  }
  const pinchZoom = options.pinchZoom !== void 0 ? options.pinchZoom : true;
  if (pinchZoom) {
    interactions.push(new PinchZoom_default({
      duration: options.zoomDuration
    }));
  }
  const keyboard = options.keyboard !== void 0 ? options.keyboard : true;
  if (keyboard) {
    interactions.push(new KeyboardPan_default());
    interactions.push(new KeyboardZoom_default({
      delta: options.zoomDelta,
      duration: options.zoomDuration
    }));
  }
  const mouseWheelZoom = options.mouseWheelZoom !== void 0 ? options.mouseWheelZoom : true;
  if (mouseWheelZoom) {
    interactions.push(new MouseWheelZoom_default({
      onFocusOnly: options.onFocusOnly,
      duration: options.zoomDuration
    }));
  }
  const shiftDragZoom = options.shiftDragZoom !== void 0 ? options.shiftDragZoom : true;
  if (shiftDragZoom) {
    interactions.push(new DragZoom_default({
      duration: options.zoomDuration
    }));
  }
  return interactions;
}

// node_modules/ol/Map.js
function removeLayerMapProperty(layer) {
  if (layer instanceof Layer_default) {
    layer.setMapInternal(null);
    return;
  }
  if (layer instanceof Group_default) {
    layer.getLayers().forEach(removeLayerMapProperty);
  }
}
function setLayerMapProperty(layer, map) {
  if (layer instanceof Layer_default) {
    layer.setMapInternal(map);
    return;
  }
  if (layer instanceof Group_default) {
    const layers = layer.getLayers().getArray();
    for (let i = 0, ii = layers.length; i < ii; ++i) {
      setLayerMapProperty(layers[i], map);
    }
  }
}
var Map = class extends Object_default {
  /**
   * @param {MapOptions} [options] Map options.
   */
  constructor(options) {
    super();
    options = options || {};
    this.on;
    this.once;
    this.un;
    const optionsInternal = createOptionsInternal(options);
    this.renderComplete_ = false;
    this.loaded_ = true;
    this.boundHandleBrowserEvent_ = this.handleBrowserEvent.bind(this);
    this.maxTilesLoading_ = options.maxTilesLoading !== void 0 ? options.maxTilesLoading : 16;
    this.pixelRatio_ = options.pixelRatio !== void 0 ? options.pixelRatio : DEVICE_PIXEL_RATIO;
    this.postRenderTimeoutHandle_;
    this.animationDelayKey_;
    this.animationDelay_ = this.animationDelay_.bind(this);
    this.coordinateToPixelTransform_ = create();
    this.pixelToCoordinateTransform_ = create();
    this.frameIndex_ = 0;
    this.frameState_ = null;
    this.previousExtent_ = null;
    this.viewPropertyListenerKey_ = null;
    this.viewChangeListenerKey_ = null;
    this.layerGroupPropertyListenerKeys_ = null;
    this.viewport_ = document.createElement("div");
    this.viewport_.className = "ol-viewport" + ("ontouchstart" in window ? " ol-touch" : "");
    this.viewport_.style.position = "relative";
    this.viewport_.style.overflow = "hidden";
    this.viewport_.style.width = "100%";
    this.viewport_.style.height = "100%";
    this.overlayContainer_ = document.createElement("div");
    this.overlayContainer_.style.position = "absolute";
    this.overlayContainer_.style.zIndex = "0";
    this.overlayContainer_.style.width = "100%";
    this.overlayContainer_.style.height = "100%";
    this.overlayContainer_.style.pointerEvents = "none";
    this.overlayContainer_.className = "ol-overlaycontainer";
    this.viewport_.appendChild(this.overlayContainer_);
    this.overlayContainerStopEvent_ = document.createElement("div");
    this.overlayContainerStopEvent_.style.position = "absolute";
    this.overlayContainerStopEvent_.style.zIndex = "0";
    this.overlayContainerStopEvent_.style.width = "100%";
    this.overlayContainerStopEvent_.style.height = "100%";
    this.overlayContainerStopEvent_.style.pointerEvents = "none";
    this.overlayContainerStopEvent_.className = "ol-overlaycontainer-stopevent";
    this.viewport_.appendChild(this.overlayContainerStopEvent_);
    this.mapBrowserEventHandler_ = null;
    this.moveTolerance_ = options.moveTolerance;
    this.keyboardEventTarget_ = optionsInternal.keyboardEventTarget;
    this.targetChangeHandlerKeys_ = null;
    this.targetElement_ = null;
    this.resizeObserver_ = new ResizeObserver(() => this.updateSize());
    this.controls = optionsInternal.controls || defaults();
    this.interactions = optionsInternal.interactions || defaults2({
      onFocusOnly: true
    });
    this.overlays_ = optionsInternal.overlays;
    this.overlayIdIndex_ = {};
    this.renderer_ = null;
    this.postRenderFunctions_ = [];
    this.tileQueue_ = new TileQueue_default(this.getTilePriority.bind(this), this.handleTileChange_.bind(this));
    this.addChangeListener(MapProperty_default.LAYERGROUP, this.handleLayerGroupChanged_);
    this.addChangeListener(MapProperty_default.VIEW, this.handleViewChanged_);
    this.addChangeListener(MapProperty_default.SIZE, this.handleSizeChanged_);
    this.addChangeListener(MapProperty_default.TARGET, this.handleTargetChanged_);
    this.setProperties(optionsInternal.values);
    const map = this;
    if (options.view && !(options.view instanceof View_default)) {
      options.view.then(function(viewOptions) {
        map.setView(new View_default(viewOptions));
      });
    }
    this.controls.addEventListener(
      CollectionEventType_default.ADD,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./control/Control.js").default>} event CollectionEvent
       */
      (event) => {
        event.element.setMap(this);
      }
    );
    this.controls.addEventListener(
      CollectionEventType_default.REMOVE,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./control/Control.js").default>} event CollectionEvent.
       */
      (event) => {
        event.element.setMap(null);
      }
    );
    this.interactions.addEventListener(
      CollectionEventType_default.ADD,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./interaction/Interaction.js").default>} event CollectionEvent.
       */
      (event) => {
        event.element.setMap(this);
      }
    );
    this.interactions.addEventListener(
      CollectionEventType_default.REMOVE,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./interaction/Interaction.js").default>} event CollectionEvent.
       */
      (event) => {
        event.element.setMap(null);
      }
    );
    this.overlays_.addEventListener(
      CollectionEventType_default.ADD,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./Overlay.js").default>} event CollectionEvent.
       */
      (event) => {
        this.addOverlayInternal_(event.element);
      }
    );
    this.overlays_.addEventListener(
      CollectionEventType_default.REMOVE,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./Overlay.js").default>} event CollectionEvent.
       */
      (event) => {
        const id = event.element.getId();
        if (id !== void 0) {
          delete this.overlayIdIndex_[id.toString()];
        }
        event.element.setMap(null);
      }
    );
    this.controls.forEach(
      /**
       * @param {import("./control/Control.js").default} control Control.
       */
      (control) => {
        control.setMap(this);
      }
    );
    this.interactions.forEach(
      /**
       * @param {import("./interaction/Interaction.js").default} interaction Interaction.
       */
      (interaction) => {
        interaction.setMap(this);
      }
    );
    this.overlays_.forEach(this.addOverlayInternal_.bind(this));
  }
  /**
   * Add the given control to the map.
   * @param {import("./control/Control.js").default} control Control.
   * @api
   */
  addControl(control) {
    this.getControls().push(control);
  }
  /**
   * Add the given interaction to the map. If you want to add an interaction
   * at another point of the collection use `getInteractions()` and the methods
   * available on {@link module:ol/Collection~Collection}. This can be used to
   * stop the event propagation from the handleEvent function. The interactions
   * get to handle the events in the reverse order of this collection.
   * @param {import("./interaction/Interaction.js").default} interaction Interaction to add.
   * @api
   */
  addInteraction(interaction) {
    this.getInteractions().push(interaction);
  }
  /**
   * Adds the given layer to the top of this map. If you want to add a layer
   * elsewhere in the stack, use `getLayers()` and the methods available on
   * {@link module:ol/Collection~Collection}.
   * @param {import("./layer/Base.js").default} layer Layer.
   * @api
   */
  addLayer(layer) {
    const layers = this.getLayerGroup().getLayers();
    layers.push(layer);
  }
  /**
   * @param {import("./layer/Group.js").GroupEvent} event The layer add event.
   * @private
   */
  handleLayerAdd_(event) {
    setLayerMapProperty(event.layer, this);
  }
  /**
   * Add the given overlay to the map.
   * @param {import("./Overlay.js").default} overlay Overlay.
   * @api
   */
  addOverlay(overlay) {
    this.getOverlays().push(overlay);
  }
  /**
   * This deals with map's overlay collection changes.
   * @param {import("./Overlay.js").default} overlay Overlay.
   * @private
   */
  addOverlayInternal_(overlay) {
    const id = overlay.getId();
    if (id !== void 0) {
      this.overlayIdIndex_[id.toString()] = overlay;
    }
    overlay.setMap(this);
  }
  /**
   *
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.controls.clear();
    this.interactions.clear();
    this.overlays_.clear();
    this.resizeObserver_.disconnect();
    this.setTarget(null);
    super.disposeInternal();
  }
  /**
   * Detect features that intersect a pixel on the viewport, and execute a
   * callback with each intersecting feature. Layers included in the detection can
   * be configured through the `layerFilter` option in `options`.
   * @param {import("./pixel.js").Pixel} pixel Pixel.
   * @param {function(import("./Feature.js").FeatureLike, import("./layer/Layer.js").default<import("./source/Source").default>, import("./geom/SimpleGeometry.js").default): T} callback Feature callback. The callback will be
   *     called with two arguments. The first argument is one
   *     {@link module:ol/Feature~Feature feature} or
   *     {@link module:ol/render/Feature~RenderFeature render feature} at the pixel, the second is
   *     the {@link module:ol/layer/Layer~Layer layer} of the feature and will be null for
   *     unmanaged layers. To stop detection, callback functions can return a
   *     truthy value.
   * @param {AtPixelOptions} [options] Optional options.
   * @return {T|undefined} Callback result, i.e. the return value of last
   * callback execution, or the first truthy callback return value.
   * @template T
   * @api
   */
  forEachFeatureAtPixel(pixel, callback, options) {
    if (!this.frameState_ || !this.renderer_) {
      return;
    }
    const coordinate = this.getCoordinateFromPixelInternal(pixel);
    options = options !== void 0 ? options : {};
    const hitTolerance = options.hitTolerance !== void 0 ? options.hitTolerance : 0;
    const layerFilter = options.layerFilter !== void 0 ? options.layerFilter : TRUE;
    const checkWrapped = options.checkWrapped !== false;
    return this.renderer_.forEachFeatureAtCoordinate(coordinate, this.frameState_, hitTolerance, checkWrapped, callback, null, layerFilter, null);
  }
  /**
   * Get all features that intersect a pixel on the viewport.
   * @param {import("./pixel.js").Pixel} pixel Pixel.
   * @param {AtPixelOptions} [options] Optional options.
   * @return {Array<import("./Feature.js").FeatureLike>} The detected features or
   * an empty array if none were found.
   * @api
   */
  getFeaturesAtPixel(pixel, options) {
    const features = [];
    this.forEachFeatureAtPixel(pixel, function(feature) {
      features.push(feature);
    }, options);
    return features;
  }
  /**
   * Get all layers from all layer groups.
   * @return {Array<import("./layer/Layer.js").default>} Layers.
   * @api
   */
  getAllLayers() {
    const layers = [];
    function addLayersFrom(layerGroup) {
      layerGroup.forEach(function(layer) {
        if (layer instanceof Group_default) {
          addLayersFrom(layer.getLayers());
        } else {
          layers.push(layer);
        }
      });
    }
    addLayersFrom(this.getLayers());
    return layers;
  }
  /**
   * Detect if features intersect a pixel on the viewport. Layers included in the
   * detection can be configured through the `layerFilter` option.
   * @param {import("./pixel.js").Pixel} pixel Pixel.
   * @param {AtPixelOptions} [options] Optional options.
   * @return {boolean} Is there a feature at the given pixel?
   * @api
   */
  hasFeatureAtPixel(pixel, options) {
    if (!this.frameState_ || !this.renderer_) {
      return false;
    }
    const coordinate = this.getCoordinateFromPixelInternal(pixel);
    options = options !== void 0 ? options : {};
    const layerFilter = options.layerFilter !== void 0 ? options.layerFilter : TRUE;
    const hitTolerance = options.hitTolerance !== void 0 ? options.hitTolerance : 0;
    const checkWrapped = options.checkWrapped !== false;
    return this.renderer_.hasFeatureAtCoordinate(coordinate, this.frameState_, hitTolerance, checkWrapped, layerFilter, null);
  }
  /**
   * Returns the coordinate in user projection for a browser event.
   * @param {MouseEvent} event Event.
   * @return {import("./coordinate.js").Coordinate} Coordinate.
   * @api
   */
  getEventCoordinate(event) {
    return this.getCoordinateFromPixel(this.getEventPixel(event));
  }
  /**
   * Returns the coordinate in view projection for a browser event.
   * @param {MouseEvent} event Event.
   * @return {import("./coordinate.js").Coordinate} Coordinate.
   */
  getEventCoordinateInternal(event) {
    return this.getCoordinateFromPixelInternal(this.getEventPixel(event));
  }
  /**
   * Returns the map pixel position for a browser event relative to the viewport.
   * @param {UIEvent|{clientX: number, clientY: number}} event Event.
   * @return {import("./pixel.js").Pixel} Pixel.
   * @api
   */
  getEventPixel(event) {
    const viewport = this.viewport_;
    const viewportPosition = viewport.getBoundingClientRect();
    const viewportSize = this.getSize();
    const scaleX = viewportPosition.width / viewportSize[0];
    const scaleY = viewportPosition.height / viewportSize[1];
    const eventPosition = (
      //FIXME Are we really calling this with a TouchEvent anywhere?
      "changedTouches" in event ? (
        /** @type {TouchEvent} */
        event.changedTouches[0]
      ) : (
        /** @type {MouseEvent} */
        event
      )
    );
    return [(eventPosition.clientX - viewportPosition.left) / scaleX, (eventPosition.clientY - viewportPosition.top) / scaleY];
  }
  /**
   * Get the target in which this map is rendered.
   * Note that this returns what is entered as an option or in setTarget:
   * if that was an element, it returns an element; if a string, it returns that.
   * @return {HTMLElement|string|undefined} The Element or id of the Element that the
   *     map is rendered in.
   * @observable
   * @api
   */
  getTarget() {
    return (
      /** @type {HTMLElement|string|undefined} */
      this.get(MapProperty_default.TARGET)
    );
  }
  /**
   * Get the DOM element into which this map is rendered. In contrast to
   * `getTarget` this method always return an `Element`, or `null` if the
   * map has no target.
   * @return {HTMLElement} The element that the map is rendered in.
   * @api
   */
  getTargetElement() {
    return this.targetElement_;
  }
  /**
   * Get the coordinate for a given pixel.  This returns a coordinate in the
   * user projection.
   * @param {import("./pixel.js").Pixel} pixel Pixel position in the map viewport.
   * @return {import("./coordinate.js").Coordinate} The coordinate for the pixel position.
   * @api
   */
  getCoordinateFromPixel(pixel) {
    return toUserCoordinate(this.getCoordinateFromPixelInternal(pixel), this.getView().getProjection());
  }
  /**
   * Get the coordinate for a given pixel.  This returns a coordinate in the
   * map view projection.
   * @param {import("./pixel.js").Pixel} pixel Pixel position in the map viewport.
   * @return {import("./coordinate.js").Coordinate} The coordinate for the pixel position.
   */
  getCoordinateFromPixelInternal(pixel) {
    const frameState = this.frameState_;
    if (!frameState) {
      return null;
    }
    return apply(frameState.pixelToCoordinateTransform, pixel.slice());
  }
  /**
   * Get the map controls. Modifying this collection changes the controls
   * associated with the map.
   * @return {Collection<import("./control/Control.js").default>} Controls.
   * @api
   */
  getControls() {
    return this.controls;
  }
  /**
   * Get the map overlays. Modifying this collection changes the overlays
   * associated with the map.
   * @return {Collection<import("./Overlay.js").default>} Overlays.
   * @api
   */
  getOverlays() {
    return this.overlays_;
  }
  /**
   * Get an overlay by its identifier (the value returned by overlay.getId()).
   * Note that the index treats string and numeric identifiers as the same. So
   * `map.getOverlayById(2)` will return an overlay with id `'2'` or `2`.
   * @param {string|number} id Overlay identifier.
   * @return {import("./Overlay.js").default|null} Overlay.
   * @api
   */
  getOverlayById(id) {
    const overlay = this.overlayIdIndex_[id.toString()];
    return overlay !== void 0 ? overlay : null;
  }
  /**
   * Get the map interactions. Modifying this collection changes the interactions
   * associated with the map.
   *
   * Interactions are used for e.g. pan, zoom and rotate.
   * @return {Collection<import("./interaction/Interaction.js").default>} Interactions.
   * @api
   */
  getInteractions() {
    return this.interactions;
  }
  /**
   * Get the layergroup associated with this map.
   * @return {LayerGroup} A layer group containing the layers in this map.
   * @observable
   * @api
   */
  getLayerGroup() {
    return (
      /** @type {LayerGroup} */
      this.get(MapProperty_default.LAYERGROUP)
    );
  }
  /**
   * Clear any existing layers and add layers to the map.
   * @param {Array<import("./layer/Base.js").default>|Collection<import("./layer/Base.js").default>} layers The layers to be added to the map.
   * @api
   */
  setLayers(layers) {
    const group = this.getLayerGroup();
    if (layers instanceof Collection_default) {
      group.setLayers(layers);
      return;
    }
    const collection = group.getLayers();
    collection.clear();
    collection.extend(layers);
  }
  /**
   * Get the collection of layers associated with this map.
   * @return {!Collection<import("./layer/Base.js").default>} Layers.
   * @api
   */
  getLayers() {
    const layers = this.getLayerGroup().getLayers();
    return layers;
  }
  /**
   * @return {boolean} Layers have sources that are still loading.
   */
  getLoadingOrNotReady() {
    const layerStatesArray = this.getLayerGroup().getLayerStatesArray();
    for (let i = 0, ii = layerStatesArray.length; i < ii; ++i) {
      const state = layerStatesArray[i];
      if (!state.visible) {
        continue;
      }
      const renderer = state.layer.getRenderer();
      if (renderer && !renderer.ready) {
        return true;
      }
      const source = state.layer.getSource();
      if (source && source.loading) {
        return true;
      }
    }
    return false;
  }
  /**
   * Get the pixel for a coordinate.  This takes a coordinate in the user
   * projection and returns the corresponding pixel.
   * @param {import("./coordinate.js").Coordinate} coordinate A map coordinate.
   * @return {import("./pixel.js").Pixel} A pixel position in the map viewport.
   * @api
   */
  getPixelFromCoordinate(coordinate) {
    const viewCoordinate = fromUserCoordinate(coordinate, this.getView().getProjection());
    return this.getPixelFromCoordinateInternal(viewCoordinate);
  }
  /**
   * Get the pixel for a coordinate.  This takes a coordinate in the map view
   * projection and returns the corresponding pixel.
   * @param {import("./coordinate.js").Coordinate} coordinate A map coordinate.
   * @return {import("./pixel.js").Pixel} A pixel position in the map viewport.
   */
  getPixelFromCoordinateInternal(coordinate) {
    const frameState = this.frameState_;
    if (!frameState) {
      return null;
    }
    return apply(frameState.coordinateToPixelTransform, coordinate.slice(0, 2));
  }
  /**
   * Get the map renderer.
   * @return {import("./renderer/Map.js").default|null} Renderer
   */
  getRenderer() {
    return this.renderer_;
  }
  /**
   * Get the size of this map.
   * @return {import("./size.js").Size|undefined} The size in pixels of the map in the DOM.
   * @observable
   * @api
   */
  getSize() {
    return (
      /** @type {import("./size.js").Size|undefined} */
      this.get(MapProperty_default.SIZE)
    );
  }
  /**
   * Get the view associated with this map. A view manages properties such as
   * center and resolution.
   * @return {View} The view that controls this map.
   * @observable
   * @api
   */
  getView() {
    return (
      /** @type {View} */
      this.get(MapProperty_default.VIEW)
    );
  }
  /**
   * Get the element that serves as the map viewport.
   * @return {HTMLElement} Viewport.
   * @api
   */
  getViewport() {
    return this.viewport_;
  }
  /**
   * Get the element that serves as the container for overlays.  Elements added to
   * this container will let mousedown and touchstart events through to the map,
   * so clicks and gestures on an overlay will trigger {@link module:ol/MapBrowserEvent~MapBrowserEvent}
   * events.
   * @return {!HTMLElement} The map's overlay container.
   */
  getOverlayContainer() {
    return this.overlayContainer_;
  }
  /**
   * Get the element that serves as a container for overlays that don't allow
   * event propagation. Elements added to this container won't let mousedown and
   * touchstart events through to the map, so clicks and gestures on an overlay
   * don't trigger any {@link module:ol/MapBrowserEvent~MapBrowserEvent}.
   * @return {!HTMLElement} The map's overlay container that stops events.
   */
  getOverlayContainerStopEvent() {
    return this.overlayContainerStopEvent_;
  }
  /**
   * @return {!Document} The document where the map is displayed.
   */
  getOwnerDocument() {
    const targetElement = this.getTargetElement();
    return targetElement ? targetElement.ownerDocument : document;
  }
  /**
   * @param {import("./Tile.js").default} tile Tile.
   * @param {string} tileSourceKey Tile source key.
   * @param {import("./coordinate.js").Coordinate} tileCenter Tile center.
   * @param {number} tileResolution Tile resolution.
   * @return {number} Tile priority.
   */
  getTilePriority(tile, tileSourceKey, tileCenter, tileResolution) {
    return getTilePriority(this.frameState_, tile, tileSourceKey, tileCenter, tileResolution);
  }
  /**
   * @param {UIEvent} browserEvent Browser event.
   * @param {string} [type] Type.
   */
  handleBrowserEvent(browserEvent, type) {
    type = type || browserEvent.type;
    const mapBrowserEvent = new MapBrowserEvent_default(type, this, browserEvent);
    this.handleMapBrowserEvent(mapBrowserEvent);
  }
  /**
   * @param {MapBrowserEvent} mapBrowserEvent The event to handle.
   */
  handleMapBrowserEvent(mapBrowserEvent) {
    if (!this.frameState_) {
      return;
    }
    const originalEvent = (
      /** @type {PointerEvent} */
      mapBrowserEvent.originalEvent
    );
    const eventType = originalEvent.type;
    if (eventType === EventType_default3.POINTERDOWN || eventType === EventType_default.WHEEL || eventType === EventType_default.KEYDOWN) {
      const doc = this.getOwnerDocument();
      const rootNode = this.viewport_.getRootNode ? this.viewport_.getRootNode() : doc;
      const target = (
        /** @type {Node} */
        originalEvent.target
      );
      const currentDoc = rootNode instanceof ShadowRoot ? rootNode.host === target ? rootNode.host.ownerDocument : rootNode : rootNode === doc ? doc.documentElement : rootNode;
      if (
        // Abort if the target is a child of the container for elements whose events are not meant
        // to be handled by map interactions.
        this.overlayContainerStopEvent_.contains(target) || // Abort if the event target is a child of the container that is no longer in the page.
        // It's possible for the target to no longer be in the page if it has been removed in an
        // event listener, this might happen in a Control that recreates it's content based on
        // user interaction either manually or via a render in something like https://reactjs.org/
        !currentDoc.contains(target)
      ) {
        return;
      }
    }
    mapBrowserEvent.frameState = this.frameState_;
    if (this.dispatchEvent(mapBrowserEvent) !== false) {
      const interactionsArray = this.getInteractions().getArray().slice();
      for (let i = interactionsArray.length - 1; i >= 0; i--) {
        const interaction = interactionsArray[i];
        if (interaction.getMap() !== this || !interaction.getActive() || !this.getTargetElement()) {
          continue;
        }
        const cont = interaction.handleEvent(mapBrowserEvent);
        if (!cont || mapBrowserEvent.propagationStopped) {
          break;
        }
      }
    }
  }
  /**
   * @protected
   */
  handlePostRender() {
    const frameState = this.frameState_;
    const tileQueue = this.tileQueue_;
    if (!tileQueue.isEmpty()) {
      let maxTotalLoading = this.maxTilesLoading_;
      let maxNewLoads = maxTotalLoading;
      if (frameState) {
        const hints = frameState.viewHints;
        if (hints[ViewHint_default.ANIMATING] || hints[ViewHint_default.INTERACTING]) {
          const lowOnFrameBudget = Date.now() - frameState.time > 8;
          maxTotalLoading = lowOnFrameBudget ? 0 : 8;
          maxNewLoads = lowOnFrameBudget ? 0 : 2;
        }
      }
      if (tileQueue.getTilesLoading() < maxTotalLoading) {
        tileQueue.reprioritize();
        tileQueue.loadMoreTiles(maxTotalLoading, maxNewLoads);
      }
    }
    if (frameState && this.renderer_ && !frameState.animate) {
      if (this.renderComplete_) {
        if (this.hasListener(EventType_default2.RENDERCOMPLETE)) {
          this.renderer_.dispatchRenderEvent(EventType_default2.RENDERCOMPLETE, frameState);
        }
        if (this.loaded_ === false) {
          this.loaded_ = true;
          this.dispatchEvent(new MapEvent_default(MapEventType_default.LOADEND, this, frameState));
        }
      } else if (this.loaded_ === true) {
        this.loaded_ = false;
        this.dispatchEvent(new MapEvent_default(MapEventType_default.LOADSTART, this, frameState));
      }
    }
    const postRenderFunctions = this.postRenderFunctions_;
    if (frameState) {
      for (let i = 0, ii = postRenderFunctions.length; i < ii; ++i) {
        postRenderFunctions[i](this, frameState);
      }
    }
    postRenderFunctions.length = 0;
  }
  /**
   * @private
   */
  handleSizeChanged_() {
    if (this.getView() && !this.getView().getAnimating()) {
      this.getView().resolveConstraints(0);
    }
    this.render();
  }
  /**
   * @private
   */
  handleTargetChanged_() {
    if (this.mapBrowserEventHandler_) {
      for (let i = 0, ii = this.targetChangeHandlerKeys_.length; i < ii; ++i) {
        unlistenByKey(this.targetChangeHandlerKeys_[i]);
      }
      this.targetChangeHandlerKeys_ = null;
      this.viewport_.removeEventListener(EventType_default.CONTEXTMENU, this.boundHandleBrowserEvent_);
      this.viewport_.removeEventListener(EventType_default.WHEEL, this.boundHandleBrowserEvent_);
      this.mapBrowserEventHandler_.dispose();
      this.mapBrowserEventHandler_ = null;
      this.viewport_.remove();
    }
    if (this.targetElement_) {
      this.resizeObserver_.unobserve(this.targetElement_);
      const rootNode = this.targetElement_.getRootNode();
      if (rootNode instanceof ShadowRoot) {
        this.resizeObserver_.unobserve(rootNode.host);
      }
      this.setSize(void 0);
    }
    const target = this.getTarget();
    const targetElement = typeof target === "string" ? document.getElementById(target) : target;
    this.targetElement_ = targetElement;
    if (!targetElement) {
      if (this.renderer_) {
        clearTimeout(this.postRenderTimeoutHandle_);
        this.postRenderTimeoutHandle_ = void 0;
        this.postRenderFunctions_.length = 0;
        this.renderer_.dispose();
        this.renderer_ = null;
      }
      if (this.animationDelayKey_) {
        cancelAnimationFrame(this.animationDelayKey_);
        this.animationDelayKey_ = void 0;
      }
    } else {
      targetElement.appendChild(this.viewport_);
      if (!this.renderer_) {
        this.renderer_ = new Composite_default(this);
      }
      this.mapBrowserEventHandler_ = new MapBrowserEventHandler_default(this, this.moveTolerance_);
      for (const key in MapBrowserEventType_default) {
        this.mapBrowserEventHandler_.addEventListener(MapBrowserEventType_default[key], this.handleMapBrowserEvent.bind(this));
      }
      this.viewport_.addEventListener(EventType_default.CONTEXTMENU, this.boundHandleBrowserEvent_, false);
      this.viewport_.addEventListener(EventType_default.WHEEL, this.boundHandleBrowserEvent_, PASSIVE_EVENT_LISTENERS ? {
        passive: false
      } : false);
      let keyboardEventTarget;
      if (!this.keyboardEventTarget_) {
        const targetRoot = targetElement.getRootNode();
        const targetCandidate = targetRoot instanceof ShadowRoot ? targetRoot.host : targetElement;
        keyboardEventTarget = targetCandidate;
      } else {
        keyboardEventTarget = this.keyboardEventTarget_;
      }
      this.targetChangeHandlerKeys_ = [listen(keyboardEventTarget, EventType_default.KEYDOWN, this.handleBrowserEvent, this), listen(keyboardEventTarget, EventType_default.KEYPRESS, this.handleBrowserEvent, this)];
      const rootNode = targetElement.getRootNode();
      if (rootNode instanceof ShadowRoot) {
        this.resizeObserver_.observe(rootNode.host);
      }
      this.resizeObserver_.observe(targetElement);
    }
    this.updateSize();
  }
  /**
   * @private
   */
  handleTileChange_() {
    this.render();
  }
  /**
   * @private
   */
  handleViewPropertyChanged_() {
    this.render();
  }
  /**
   * @private
   */
  handleViewChanged_() {
    if (this.viewPropertyListenerKey_) {
      unlistenByKey(this.viewPropertyListenerKey_);
      this.viewPropertyListenerKey_ = null;
    }
    if (this.viewChangeListenerKey_) {
      unlistenByKey(this.viewChangeListenerKey_);
      this.viewChangeListenerKey_ = null;
    }
    const view = this.getView();
    if (view) {
      this.updateViewportSize_(this.getSize());
      this.viewPropertyListenerKey_ = listen(view, ObjectEventType_default.PROPERTYCHANGE, this.handleViewPropertyChanged_, this);
      this.viewChangeListenerKey_ = listen(view, EventType_default.CHANGE, this.handleViewPropertyChanged_, this);
      view.resolveConstraints(0);
    }
    this.render();
  }
  /**
   * @private
   */
  handleLayerGroupChanged_() {
    if (this.layerGroupPropertyListenerKeys_) {
      this.layerGroupPropertyListenerKeys_.forEach(unlistenByKey);
      this.layerGroupPropertyListenerKeys_ = null;
    }
    const layerGroup = this.getLayerGroup();
    if (layerGroup) {
      this.handleLayerAdd_(new GroupEvent("addlayer", layerGroup));
      this.layerGroupPropertyListenerKeys_ = [listen(layerGroup, ObjectEventType_default.PROPERTYCHANGE, this.render, this), listen(layerGroup, EventType_default.CHANGE, this.render, this), listen(layerGroup, "addlayer", this.handleLayerAdd_, this), listen(layerGroup, "removelayer", this.handleLayerRemove_, this)];
    }
    this.render();
  }
  /**
   * @return {boolean} Is rendered.
   */
  isRendered() {
    return !!this.frameState_;
  }
  /**
   * @private
   */
  animationDelay_() {
    this.animationDelayKey_ = void 0;
    this.renderFrame_(Date.now());
  }
  /**
   * Requests an immediate render in a synchronous manner.
   * @api
   */
  renderSync() {
    if (this.animationDelayKey_) {
      cancelAnimationFrame(this.animationDelayKey_);
    }
    this.animationDelay_();
  }
  /**
   * Redraws all text after new fonts have loaded
   */
  redrawText() {
    const layerStates = this.getLayerGroup().getLayerStatesArray();
    for (let i = 0, ii = layerStates.length; i < ii; ++i) {
      const layer = layerStates[i].layer;
      if (layer.hasRenderer()) {
        layer.getRenderer().handleFontsChanged();
      }
    }
  }
  /**
   * Request a map rendering (at the next animation frame).
   * @api
   */
  render() {
    if (this.renderer_ && this.animationDelayKey_ === void 0) {
      this.animationDelayKey_ = requestAnimationFrame(this.animationDelay_);
    }
  }
  /**
   * Remove the given control from the map.
   * @param {import("./control/Control.js").default} control Control.
   * @return {import("./control/Control.js").default|undefined} The removed control (or undefined
   *     if the control was not found).
   * @api
   */
  removeControl(control) {
    return this.getControls().remove(control);
  }
  /**
   * Remove the given interaction from the map.
   * @param {import("./interaction/Interaction.js").default} interaction Interaction to remove.
   * @return {import("./interaction/Interaction.js").default|undefined} The removed interaction (or
   *     undefined if the interaction was not found).
   * @api
   */
  removeInteraction(interaction) {
    return this.getInteractions().remove(interaction);
  }
  /**
   * Removes the given layer from the map.
   * @param {import("./layer/Base.js").default} layer Layer.
   * @return {import("./layer/Base.js").default|undefined} The removed layer (or undefined if the
   *     layer was not found).
   * @api
   */
  removeLayer(layer) {
    const layers = this.getLayerGroup().getLayers();
    return layers.remove(layer);
  }
  /**
   * @param {import("./layer/Group.js").GroupEvent} event The layer remove event.
   * @private
   */
  handleLayerRemove_(event) {
    removeLayerMapProperty(event.layer);
  }
  /**
   * Remove the given overlay from the map.
   * @param {import("./Overlay.js").default} overlay Overlay.
   * @return {import("./Overlay.js").default|undefined} The removed overlay (or undefined
   *     if the overlay was not found).
   * @api
   */
  removeOverlay(overlay) {
    return this.getOverlays().remove(overlay);
  }
  /**
   * @param {number} time Time.
   * @private
   */
  renderFrame_(time) {
    const size = this.getSize();
    const view = this.getView();
    const previousFrameState = this.frameState_;
    let frameState = null;
    if (size !== void 0 && hasArea(size) && view && view.isDef()) {
      const viewHints = view.getHints(this.frameState_ ? this.frameState_.viewHints : void 0);
      const viewState = view.getState();
      frameState = {
        animate: false,
        coordinateToPixelTransform: this.coordinateToPixelTransform_,
        declutter: null,
        extent: getForViewAndSize(viewState.center, viewState.resolution, viewState.rotation, size),
        index: this.frameIndex_++,
        layerIndex: 0,
        layerStatesArray: this.getLayerGroup().getLayerStatesArray(),
        pixelRatio: this.pixelRatio_,
        pixelToCoordinateTransform: this.pixelToCoordinateTransform_,
        postRenderFunctions: [],
        size,
        tileQueue: this.tileQueue_,
        time,
        usedTiles: {},
        viewState,
        viewHints,
        wantedTiles: {},
        mapId: getUid(this),
        renderTargets: {}
      };
      if (viewState.nextCenter && viewState.nextResolution) {
        const rotation = isNaN(viewState.nextRotation) ? viewState.rotation : viewState.nextRotation;
        frameState.nextExtent = getForViewAndSize(viewState.nextCenter, viewState.nextResolution, rotation, size);
      }
    }
    this.frameState_ = frameState;
    this.renderer_.renderFrame(frameState);
    if (frameState) {
      if (frameState.animate) {
        this.render();
      }
      Array.prototype.push.apply(this.postRenderFunctions_, frameState.postRenderFunctions);
      if (previousFrameState) {
        const moveStart = !this.previousExtent_ || !isEmpty2(this.previousExtent_) && !equals2(frameState.extent, this.previousExtent_);
        if (moveStart) {
          this.dispatchEvent(new MapEvent_default(MapEventType_default.MOVESTART, this, previousFrameState));
          this.previousExtent_ = createOrUpdateEmpty(this.previousExtent_);
        }
      }
      const idle = this.previousExtent_ && !frameState.viewHints[ViewHint_default.ANIMATING] && !frameState.viewHints[ViewHint_default.INTERACTING] && !equals2(frameState.extent, this.previousExtent_);
      if (idle) {
        this.dispatchEvent(new MapEvent_default(MapEventType_default.MOVEEND, this, frameState));
        clone(frameState.extent, this.previousExtent_);
      }
    }
    this.dispatchEvent(new MapEvent_default(MapEventType_default.POSTRENDER, this, frameState));
    this.renderComplete_ = (this.hasListener(MapEventType_default.LOADSTART) || this.hasListener(MapEventType_default.LOADEND) || this.hasListener(EventType_default2.RENDERCOMPLETE)) && !this.tileQueue_.getTilesLoading() && !this.tileQueue_.getCount() && !this.getLoadingOrNotReady();
    if (!this.postRenderTimeoutHandle_) {
      this.postRenderTimeoutHandle_ = setTimeout(() => {
        this.postRenderTimeoutHandle_ = void 0;
        this.handlePostRender();
      }, 0);
    }
  }
  /**
   * Sets the layergroup of this map.
   * @param {LayerGroup} layerGroup A layer group containing the layers in this map.
   * @observable
   * @api
   */
  setLayerGroup(layerGroup) {
    const oldLayerGroup = this.getLayerGroup();
    if (oldLayerGroup) {
      this.handleLayerRemove_(new GroupEvent("removelayer", oldLayerGroup));
    }
    this.set(MapProperty_default.LAYERGROUP, layerGroup);
  }
  /**
   * Set the size of this map.
   * @param {import("./size.js").Size|undefined} size The size in pixels of the map in the DOM.
   * @observable
   * @api
   */
  setSize(size) {
    this.set(MapProperty_default.SIZE, size);
  }
  /**
   * Set the target element to render this map into.
   * For accessibility (focus and keyboard events for map navigation), the `target` element must have a
   *  properly configured `tabindex` attribute. If the `target` element is inside a Shadow DOM, the
   *  `tabindex` atribute must be set on the custom element's host element.
   * @param {HTMLElement|string} [target] The Element or id of the Element
   *     that the map is rendered in.
   * @observable
   * @api
   */
  setTarget(target) {
    this.set(MapProperty_default.TARGET, target);
  }
  /**
   * Set the view for this map.
   * @param {View|Promise<import("./View.js").ViewOptions>} view The view that controls this map.
   * It is also possible to pass a promise that resolves to options for constructing a view.  This
   * alternative allows view properties to be resolved by sources or other components that load
   * view-related metadata.
   * @observable
   * @api
   */
  setView(view) {
    if (!view || view instanceof View_default) {
      this.set(MapProperty_default.VIEW, view);
      return;
    }
    this.set(MapProperty_default.VIEW, new View_default());
    const map = this;
    view.then(function(viewOptions) {
      map.setView(new View_default(viewOptions));
    });
  }
  /**
   * Force a recalculation of the map viewport size.  This should be called when
   * third-party code changes the size of the map viewport.
   * @api
   */
  updateSize() {
    const targetElement = this.getTargetElement();
    let size = void 0;
    if (targetElement) {
      const computedStyle = getComputedStyle(targetElement);
      const width = targetElement.offsetWidth - parseFloat(computedStyle["borderLeftWidth"]) - parseFloat(computedStyle["paddingLeft"]) - parseFloat(computedStyle["paddingRight"]) - parseFloat(computedStyle["borderRightWidth"]);
      const height = targetElement.offsetHeight - parseFloat(computedStyle["borderTopWidth"]) - parseFloat(computedStyle["paddingTop"]) - parseFloat(computedStyle["paddingBottom"]) - parseFloat(computedStyle["borderBottomWidth"]);
      if (!isNaN(width) && !isNaN(height)) {
        size = [Math.max(0, width), Math.max(0, height)];
        if (!hasArea(size) && !!(targetElement.offsetWidth || targetElement.offsetHeight || targetElement.getClientRects().length)) {
          warn("No map visible because the map container's width or height are 0.");
        }
      }
    }
    const oldSize = this.getSize();
    if (size && (!oldSize || !equals(size, oldSize))) {
      this.setSize(size);
      this.updateViewportSize_(size);
    }
  }
  /**
   * Recomputes the viewport size and save it on the view object (if any)
   * @param {import("./size.js").Size|undefined} size The size.
   * @private
   */
  updateViewportSize_(size) {
    const view = this.getView();
    if (view) {
      view.setViewportSize(size);
    }
  }
};
function createOptionsInternal(options) {
  let keyboardEventTarget = null;
  if (options.keyboardEventTarget !== void 0) {
    keyboardEventTarget = typeof options.keyboardEventTarget === "string" ? document.getElementById(options.keyboardEventTarget) : options.keyboardEventTarget;
  }
  const values = {};
  const layerGroup = options.layers && typeof /** @type {?} */
  options.layers.getLayers === "function" ? (
    /** @type {LayerGroup} */
    options.layers
  ) : new Group_default({
    layers: (
      /** @type {Collection<import("./layer/Base.js").default>|Array<import("./layer/Base.js").default>} */
      options.layers
    )
  });
  values[MapProperty_default.LAYERGROUP] = layerGroup;
  values[MapProperty_default.TARGET] = options.target;
  values[MapProperty_default.VIEW] = options.view instanceof View_default ? options.view : new View_default();
  let controls;
  if (options.controls !== void 0) {
    if (Array.isArray(options.controls)) {
      controls = new Collection_default(options.controls.slice());
    } else {
      assert(typeof /** @type {?} */
      options.controls.getArray === "function", "Expected `controls` to be an array or an `ol/Collection.js`");
      controls = options.controls;
    }
  }
  let interactions;
  if (options.interactions !== void 0) {
    if (Array.isArray(options.interactions)) {
      interactions = new Collection_default(options.interactions.slice());
    } else {
      assert(typeof /** @type {?} */
      options.interactions.getArray === "function", "Expected `interactions` to be an array or an `ol/Collection.js`");
      interactions = options.interactions;
    }
  }
  let overlays;
  if (options.overlays !== void 0) {
    if (Array.isArray(options.overlays)) {
      overlays = new Collection_default(options.overlays.slice());
    } else {
      assert(typeof /** @type {?} */
      options.overlays.getArray === "function", "Expected `overlays` to be an array or an `ol/Collection.js`");
      overlays = options.overlays;
    }
  } else {
    overlays = new Collection_default();
  }
  return {
    controls,
    interactions,
    keyboardEventTarget,
    overlays,
    values
  };
}
var Map_default2 = Map;
export {
  Map_default2 as default
};
//# sourceMappingURL=ol_Map.js.map
