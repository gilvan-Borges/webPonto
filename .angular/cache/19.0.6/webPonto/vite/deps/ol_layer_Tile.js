import {
  ERROR_THRESHOLD,
  ImageTile_default,
  TileRange_default,
  Tile_default,
  Tile_default2,
  Triangulation_default,
  calculateSourceExtentResolution,
  createOrUpdate2 as createOrUpdate,
  getKeyZXY
} from "./chunk-BQB2YDDW.js";
import {
  Layer_default as Layer_default2
} from "./chunk-SE4Z7672.js";
import {
  TileState_default
} from "./chunk-3ZMK6QCJ.js";
import {
  Layer_default
} from "./chunk-BBGPIVX6.js";
import "./chunk-WUBA4WRB.js";
import {
  toSize
} from "./chunk-AIXNK2NI.js";
import {
  WORKER_OFFSCREEN_CANVAS,
  createCanvasContext2D
} from "./chunk-P3VPQGWE.js";
import "./chunk-ZE6OZADB.js";
import "./chunk-O6DHRJAE.js";
import "./chunk-JF4TZ6W4.js";
import "./chunk-QX466IMN.js";
import "./chunk-XEC7PHI3.js";
import {
  apply,
  compose
} from "./chunk-XNR45YZT.js";
import {
  fromUserExtent
} from "./chunk-H2KJUZHU.js";
import {
  containsCoordinate,
  createEmpty,
  equals,
  extend,
  getArea,
  getHeight,
  getIntersection,
  getTopLeft,
  getWidth,
  intersects,
  wrapAndSliceX
} from "./chunk-7MDJCZRJ.js";
import {
  clamp
} from "./chunk-6OCNFQPD.js";
import {
  assert
} from "./chunk-LCVGJ6M3.js";
import "./chunk-LFCNIOCW.js";
import {
  Disposable_default,
  EventType_default,
  ascending,
  getUid,
  listen,
  unlistenByKey
} from "./chunk-TBRIBG4Z.js";
import "./chunk-PEWTSS5T.js";
import "./chunk-WDMUDEB6.js";

// node_modules/ol/layer/TileProperty.js
var TileProperty_default = {
  PRELOAD: "preload",
  USE_INTERIM_TILES_ON_ERROR: "useInterimTilesOnError"
};

// node_modules/ol/layer/BaseTile.js
var BaseTileLayer = class extends Layer_default {
  /**
   * @param {Options<TileSourceType>} [options] Tile layer options.
   */
  constructor(options) {
    options = options ? options : {};
    const baseOptions = Object.assign({}, options);
    const cacheSize = options.cacheSize;
    delete options.cacheSize;
    delete baseOptions.preload;
    delete baseOptions.useInterimTilesOnError;
    super(baseOptions);
    this.on;
    this.once;
    this.un;
    this.cacheSize_ = cacheSize;
    this.setPreload(options.preload !== void 0 ? options.preload : 0);
    this.setUseInterimTilesOnError(options.useInterimTilesOnError !== void 0 ? options.useInterimTilesOnError : true);
  }
  /**
   * @return {number|undefined} The suggested cache size
   * @protected
   */
  getCacheSize() {
    return this.cacheSize_;
  }
  /**
   * Return the level as number to which we will preload tiles up to.
   * @return {number} The level to preload tiles up to.
   * @observable
   * @api
   */
  getPreload() {
    return (
      /** @type {number} */
      this.get(TileProperty_default.PRELOAD)
    );
  }
  /**
   * Set the level as number to which we will preload tiles up to.
   * @param {number} preload The level to preload tiles up to.
   * @observable
   * @api
   */
  setPreload(preload) {
    this.set(TileProperty_default.PRELOAD, preload);
  }
  /**
   * Deprecated.  Whether we use interim tiles on error.
   * @return {boolean} Use interim tiles on error.
   * @observable
   * @api
   */
  getUseInterimTilesOnError() {
    return (
      /** @type {boolean} */
      this.get(TileProperty_default.USE_INTERIM_TILES_ON_ERROR)
    );
  }
  /**
   * Deprecated.  Set whether we use interim tiles on error.
   * @param {boolean} useInterimTilesOnError Use interim tiles on error.
   * @observable
   * @api
   */
  setUseInterimTilesOnError(useInterimTilesOnError) {
    this.set(TileProperty_default.USE_INTERIM_TILES_ON_ERROR, useInterimTilesOnError);
  }
  /**
   * Get data for a pixel location.  The return type depends on the source data.  For image tiles,
   * a four element RGBA array will be returned.  For data tiles, the array length will match the
   * number of bands in the dataset.  For requests outside the layer extent, `null` will be returned.
   * Data for a image tiles can only be retrieved if the source's `crossOrigin` property is set.
   *
   * ```js
   * // display layer data on every pointer move
   * map.on('pointermove', (event) => {
   *   console.log(layer.getData(event.pixel));
   * });
   * ```
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   * @api
   * @override
   */
  getData(pixel) {
    return super.getData(pixel);
  }
};
var BaseTile_default = BaseTileLayer;

// node_modules/ol/DataTile.js
function asImageLike(data) {
  return data instanceof Image || data instanceof HTMLCanvasElement || data instanceof HTMLVideoElement || data instanceof ImageBitmap ? data : null;
}
function asArrayLike(data) {
  return data instanceof Uint8Array || data instanceof Uint8ClampedArray || data instanceof Float32Array || data instanceof DataView ? data : null;
}
var disposedError = new Error("disposed");
var sharedContext = null;
function toArray(image) {
  if (!sharedContext) {
    sharedContext = createCanvasContext2D(image.width, image.height, void 0, {
      willReadFrequently: true
    });
  }
  const canvas = sharedContext.canvas;
  const width = image.width;
  if (canvas.width !== width) {
    canvas.width = width;
  }
  const height = image.height;
  if (canvas.height !== height) {
    canvas.height = height;
  }
  sharedContext.clearRect(0, 0, width, height);
  sharedContext.drawImage(image, 0, 0);
  return sharedContext.getImageData(0, 0, width, height).data;
}
var defaultSize = [256, 256];
var DataTile = class extends Tile_default {
  /**
   * @param {Options} options Tile options.
   */
  constructor(options) {
    const state = TileState_default.IDLE;
    super(options.tileCoord, state, {
      transition: options.transition,
      interpolate: options.interpolate
    });
    this.loader_ = options.loader;
    this.data_ = null;
    this.error_ = null;
    this.size_ = options.size || null;
    this.controller_ = options.controller || null;
  }
  /**
   * Get the tile size.
   * @return {import('./size.js').Size} Tile size.
   */
  getSize() {
    if (this.size_) {
      return this.size_;
    }
    const imageData = asImageLike(this.data_);
    if (imageData) {
      return [imageData.width, imageData.height];
    }
    return defaultSize;
  }
  /**
   * Get the data for the tile.
   * @return {Data} Tile data.
   * @api
   */
  getData() {
    return this.data_;
  }
  /**
   * Get any loading error.
   * @return {Error} Loading error.
   * @api
   */
  getError() {
    return this.error_;
  }
  /**
   * Load the tile data.
   * @api
   * @override
   */
  load() {
    if (this.state !== TileState_default.IDLE && this.state !== TileState_default.ERROR) {
      return;
    }
    this.state = TileState_default.LOADING;
    this.changed();
    const self = this;
    this.loader_().then(function(data) {
      self.data_ = data;
      self.state = TileState_default.LOADED;
      self.changed();
    }).catch(function(error) {
      self.error_ = error;
      self.state = TileState_default.ERROR;
      self.changed();
    });
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    if (this.controller_) {
      this.controller_.abort(disposedError);
      this.controller_ = null;
    }
    super.disposeInternal();
  }
};
var DataTile_default = DataTile;

// node_modules/ol/structs/LRUCache.js
var LRUCache = class {
  /**
   * @param {number} [highWaterMark] High water mark.
   */
  constructor(highWaterMark) {
    this.highWaterMark = highWaterMark !== void 0 ? highWaterMark : 2048;
    this.count_ = 0;
    this.entries_ = {};
    this.oldest_ = null;
    this.newest_ = null;
  }
  deleteOldest() {
    const entry = this.pop();
    if (entry instanceof Disposable_default) {
      entry.dispose();
    }
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    return this.highWaterMark > 0 && this.getCount() > this.highWaterMark;
  }
  /**
   * Expire the cache. When the cache entry is a {@link module:ol/Disposable~Disposable},
   * the entry will be disposed.
   * @param {!Object<string, boolean>} [keep] Keys to keep. To be implemented by subclasses.
   */
  expireCache(keep) {
    while (this.canExpireCache()) {
      this.deleteOldest();
    }
  }
  /**
   * FIXME empty description for jsdoc
   */
  clear() {
    while (this.oldest_) {
      this.deleteOldest();
    }
  }
  /**
   * @param {string} key Key.
   * @return {boolean} Contains key.
   */
  containsKey(key) {
    return this.entries_.hasOwnProperty(key);
  }
  /**
   * @param {function(T, string, LRUCache<T>): ?} f The function
   *     to call for every entry from the oldest to the newer. This function takes
   *     3 arguments (the entry value, the entry key and the LRUCache object).
   *     The return value is ignored.
   */
  forEach(f) {
    let entry = this.oldest_;
    while (entry) {
      f(entry.value_, entry.key_, this);
      entry = entry.newer;
    }
  }
  /**
   * @param {string} key Key.
   * @param {*} [options] Options (reserved for subclasses).
   * @return {T} Value.
   */
  get(key, options) {
    const entry = this.entries_[key];
    assert(entry !== void 0, "Tried to get a value for a key that does not exist in the cache");
    if (entry === this.newest_) {
      return entry.value_;
    }
    if (entry === this.oldest_) {
      this.oldest_ = /** @type {Entry} */
      this.oldest_.newer;
      this.oldest_.older = null;
    } else {
      entry.newer.older = entry.older;
      entry.older.newer = entry.newer;
    }
    entry.newer = null;
    entry.older = this.newest_;
    this.newest_.newer = entry;
    this.newest_ = entry;
    return entry.value_;
  }
  /**
   * Remove an entry from the cache.
   * @param {string} key The entry key.
   * @return {T} The removed entry.
   */
  remove(key) {
    const entry = this.entries_[key];
    assert(entry !== void 0, "Tried to get a value for a key that does not exist in the cache");
    if (entry === this.newest_) {
      this.newest_ = /** @type {Entry} */
      entry.older;
      if (this.newest_) {
        this.newest_.newer = null;
      }
    } else if (entry === this.oldest_) {
      this.oldest_ = /** @type {Entry} */
      entry.newer;
      if (this.oldest_) {
        this.oldest_.older = null;
      }
    } else {
      entry.newer.older = entry.older;
      entry.older.newer = entry.newer;
    }
    delete this.entries_[key];
    --this.count_;
    return entry.value_;
  }
  /**
   * @return {number} Count.
   */
  getCount() {
    return this.count_;
  }
  /**
   * @return {Array<string>} Keys.
   */
  getKeys() {
    const keys = new Array(this.count_);
    let i = 0;
    let entry;
    for (entry = this.newest_; entry; entry = entry.older) {
      keys[i++] = entry.key_;
    }
    return keys;
  }
  /**
   * @return {Array<T>} Values.
   */
  getValues() {
    const values = new Array(this.count_);
    let i = 0;
    let entry;
    for (entry = this.newest_; entry; entry = entry.older) {
      values[i++] = entry.value_;
    }
    return values;
  }
  /**
   * @return {T} Last value.
   */
  peekLast() {
    return this.oldest_.value_;
  }
  /**
   * @return {string} Last key.
   */
  peekLastKey() {
    return this.oldest_.key_;
  }
  /**
   * Get the key of the newest item in the cache.  Throws if the cache is empty.
   * @return {string} The newest key.
   */
  peekFirstKey() {
    return this.newest_.key_;
  }
  /**
   * Return an entry without updating least recently used time.
   * @param {string} key Key.
   * @return {T|undefined} Value.
   */
  peek(key) {
    return this.entries_[key]?.value_;
  }
  /**
   * @return {T} value Value.
   */
  pop() {
    const entry = this.oldest_;
    delete this.entries_[entry.key_];
    if (entry.newer) {
      entry.newer.older = null;
    }
    this.oldest_ = /** @type {Entry} */
    entry.newer;
    if (!this.oldest_) {
      this.newest_ = null;
    }
    --this.count_;
    return entry.value_;
  }
  /**
   * @param {string} key Key.
   * @param {T} value Value.
   */
  replace(key, value) {
    this.get(key);
    this.entries_[key].value_ = value;
  }
  /**
   * @param {string} key Key.
   * @param {T} value Value.
   */
  set(key, value) {
    assert(!(key in this.entries_), "Tried to set a value for a key that is used already");
    const entry = {
      key_: key,
      newer: null,
      older: this.newest_,
      value_: value
    };
    if (!this.newest_) {
      this.oldest_ = entry;
    } else {
      this.newest_.newer = entry;
    }
    this.newest_ = entry;
    this.entries_[key] = entry;
    ++this.count_;
  }
  /**
   * Set a maximum number of entries for the cache.
   * @param {number} size Cache size.
   * @api
   */
  setSize(size) {
    this.highWaterMark = size;
  }
};
var LRUCache_default = LRUCache;

// node_modules/ol/vec/mat4.js
function create() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}
function orthographic(left, right, bottom, top, near, far, out) {
  out = out ?? create();
  const lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
function scale(m, x, y, z, out) {
  out = out ?? create();
  out[0] = m[0] * x;
  out[1] = m[1] * x;
  out[2] = m[2] * x;
  out[3] = m[3] * x;
  out[4] = m[4] * y;
  out[5] = m[5] * y;
  out[6] = m[6] * y;
  out[7] = m[7] * y;
  out[8] = m[8] * z;
  out[9] = m[9] * z;
  out[10] = m[10] * z;
  out[11] = m[11] * z;
  out[12] = m[12];
  out[13] = m[13];
  out[14] = m[14];
  out[15] = m[15];
  return out;
}
function translate(m, x, y, z, out) {
  out = out ?? create();
  let a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
  if (m === out) {
    out[12] = m[0] * x + m[4] * y + m[8] * z + m[12];
    out[13] = m[1] * x + m[5] * y + m[9] * z + m[13];
    out[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
    out[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
  } else {
    a00 = m[0];
    a01 = m[1];
    a02 = m[2];
    a03 = m[3];
    a10 = m[4];
    a11 = m[5];
    a12 = m[6];
    a13 = m[7];
    a20 = m[8];
    a21 = m[9];
    a22 = m[10];
    a23 = m[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + m[12];
    out[13] = a01 * x + a11 * y + a21 * z + m[13];
    out[14] = a02 * x + a12 * y + a22 * z + m[14];
    out[15] = a03 * x + a13 * y + a23 * z + m[15];
  }
  return out;
}
function translation(x, y, z, out) {
  out = out ?? create();
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = x;
  out[13] = y;
  out[14] = z;
  out[15] = 1;
  return out;
}

// node_modules/ol/webgl/Canvas.js
var VERTEX_SHADER = `
  attribute vec4 a_position;
  attribute vec4 a_texcoord;

  uniform mat4 u_matrix;
  uniform mat4 u_textureMatrix;

  varying vec2 v_texcoord;

  void main() {
    gl_Position = u_matrix * a_position;
    vec2 texcoord = (u_textureMatrix * a_texcoord).xy;
    v_texcoord = texcoord;
  }
`;
var FRAGMENT_SHADER = `
  precision mediump float;

  varying vec2 v_texcoord;

  uniform sampler2D u_texture;

  void main() {
    if (
      v_texcoord.x < 0.0 ||
      v_texcoord.y < 0.0 ||
      v_texcoord.x > 1.0 ||
      v_texcoord.y > 1.0
    ) {
      discard;
    }
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }
`;
var Canvas = class {
  /**
   * @param {WebGLRenderingContext} gl Context to render in.
   */
  constructor(gl) {
    this.gl_ = gl;
    this.program_ = createProgram(gl, FRAGMENT_SHADER, VERTEX_SHADER);
    this.positionLocation = gl.getAttribLocation(this.program_, "a_position");
    this.texcoordLocation = gl.getAttribLocation(this.program_, "a_texcoord");
    this.matrixLocation = gl.getUniformLocation(this.program_, "u_matrix");
    this.textureMatrixLocation = gl.getUniformLocation(this.program_, "u_textureMatrix");
    this.textureLocation = gl.getUniformLocation(this.program_, "u_texture");
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    this.positions = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
    this.texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    this.texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texcoords), gl.STATIC_DRAW);
  }
  /**
   * 2dContext drawImage call implemented in webgl.
   * Unlike images, textures do not have a width and height associated
   * with them so we'll pass in the width and height of the texture.
   *
   * @param {WebGLTexture} tex Image to draw.
   * @param {number} texWidth Image width.
   * @param {number} texHeight Image height.
   * @param {number} srcX Top-left x-point to read src image.
   * @param {number} srcY Top-left y-point to read src image.
   * @param {number} [srcWidth] Width of source to read.
   * @param {number} [srcHeight] Height of source to read.
   * @param {number} [dstX] Top-left x-point of destination.
   * @param {number} [dstY] Top-left y-point of destination.
   * @param {number} [dstWidth] Width of written image in destination.
   * @param {number} [dstHeight] Height of written image in destination.
   * @param {number} [width] Width of canvas.
   * @param {number} [height] Height of canvas.
   */
  drawImage(tex, texWidth, texHeight, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight, width, height) {
    const gl = this.gl_;
    if (dstX === void 0) {
      dstX = srcX;
    }
    if (dstY === void 0) {
      dstY = srcY;
    }
    if (srcWidth === void 0) {
      srcWidth = texWidth;
    }
    if (srcHeight === void 0) {
      srcHeight = texHeight;
    }
    if (dstWidth === void 0) {
      dstWidth = srcWidth;
    }
    if (dstHeight === void 0) {
      dstHeight = srcHeight;
    }
    if (width === void 0) {
      width = gl.canvas.width;
    }
    if (height === void 0) {
      height = gl.canvas.height;
    }
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.useProgram(this.program_);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    gl.enableVertexAttribArray(this.texcoordLocation);
    gl.vertexAttribPointer(this.texcoordLocation, 2, gl.FLOAT, false, 0, 0);
    let matrix = orthographic(0, width, 0, height, -1, 1);
    matrix = translate(matrix, dstX, dstY, 0);
    matrix = scale(matrix, dstWidth, dstHeight, 1);
    gl.uniformMatrix4fv(this.matrixLocation, false, matrix);
    let texMatrix = translation(srcX / texWidth, srcY / texHeight, 0);
    texMatrix = scale(texMatrix, srcWidth / texWidth, srcHeight / texHeight, 1);
    gl.uniformMatrix4fv(this.textureMatrixLocation, false, texMatrix);
    gl.uniform1i(this.textureLocation, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.positions.length / 2);
  }
};
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (shader === null) {
    throw new Error("Shader compilation failed");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    if (log === null) {
      throw new Error("Shader info log creation failed");
    }
    throw new Error(log);
  }
  return shader;
}
function createProgram(gl, fragmentSource, vertexSource) {
  const program = gl.createProgram();
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (program === null) {
    throw new Error("Program creation failed");
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    if (log === null) {
      throw new Error("Program info log creation failed");
    }
    throw new Error();
  }
  return program;
}

// node_modules/ol/reproj/glreproj.js
var EDGE_VERTEX_SHADER = `
  attribute vec4 a_position;

  uniform mat4 u_matrix;

  void main() {
     gl_Position = u_matrix * a_position;
  }
`;
var EDGE_FRAGMENT_SHADER = `
  precision mediump float;

  uniform vec4 u_val;
  void main() {
     gl_FragColor = u_val;
  }
`;
var TRIANGLE_VERTEX_SHADER = `
  attribute vec4 a_position;
  attribute vec2 a_texcoord;

  varying vec2 v_texcoord;

  uniform mat4 u_matrix;

  void main() {
     gl_Position = u_matrix * a_position;
     v_texcoord = a_texcoord;
  }
`;
var TRIANGLE_FRAGMENT_SHADER = `
  precision mediump float;

  varying vec2 v_texcoord;

  uniform sampler2D u_texture;

  void main() {
    if (v_texcoord.x < 0.0 || v_texcoord.x > 1.0 || v_texcoord.y < 0.0 || v_texcoord.y > 1.0) {
      discard;
    }
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }
`;
function createCanvasContextWebGL(width, height, canvasPool, settings) {
  let canvas;
  if (canvasPool && canvasPool.length) {
    canvas = /** @type {HTMLCanvasElement} */
    canvasPool.shift();
  } else if (WORKER_OFFSCREEN_CANVAS) {
    canvas = new OffscreenCanvas(width || 300, height || 300);
  } else {
    canvas = document.createElement("canvas");
  }
  if (width) {
    canvas.width = width;
  }
  if (height) {
    canvas.height = height;
  }
  return (
    /** @type {WebGLRenderingContext} */
    canvas.getContext("webgl", settings)
  );
}
function releaseGLCanvas(gl) {
  const canvas = gl.canvas;
  canvas.width = 1;
  canvas.height = 1;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
}
var canvasGLPool = [];
function render(gl, width_, height_, pixelRatio, sourceResolution, targetResolution, targetExtent, triangulation, sources, gutter, dataType, renderEdges, interpolate, drawSingle) {
  const width = Math.round(pixelRatio * width_);
  const height = Math.round(pixelRatio * height_);
  gl.canvas.width = width;
  gl.canvas.height = height;
  let resultFrameBuffer;
  let resultTexture;
  {
    resultTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, resultTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (interpolate) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, dataType, null);
    resultFrameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, resultFrameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, resultTexture, 0);
  }
  if (resultFrameBuffer === null) {
    throw new Error("Could not create framebuffer");
  }
  if (resultTexture === null) {
    throw new Error("Could not create texture");
  }
  if (sources.length === 0) {
    return {
      width,
      height,
      framebuffer: resultFrameBuffer,
      texture: resultTexture
    };
  }
  const sourceDataExtent = createEmpty();
  sources.forEach(function(src, i, arr) {
    extend(sourceDataExtent, src.extent);
  });
  let stitchTexture;
  let stitchWidth;
  let stitchHeight;
  const stitchScale = 1 / sourceResolution;
  if (!drawSingle || sources.length !== 1 || gutter !== 0) {
    stitchTexture = gl.createTexture();
    if (resultTexture === null) {
      throw new Error("Could not create texture");
    }
    stitchWidth = Math.round(getWidth(sourceDataExtent) * stitchScale);
    stitchHeight = Math.round(getHeight(sourceDataExtent) * stitchScale);
    const maxTexSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const largeSide = Math.max(stitchWidth, stitchHeight);
    const scaleFactor = largeSide > maxTexSize ? maxTexSize / largeSide : 1;
    const stitchWidthFixed = Math.round(stitchWidth * scaleFactor);
    const stitchHeightFixed = Math.round(stitchHeight * scaleFactor);
    gl.bindTexture(gl.TEXTURE_2D, stitchTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (interpolate) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, stitchWidthFixed, stitchHeightFixed, 0, gl.RGBA, dataType, null);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, stitchTexture, 0);
    const webGLCanvas = new Canvas(gl);
    sources.forEach(function(src, i, arr) {
      const xPos = (src.extent[0] - sourceDataExtent[0]) * stitchScale * scaleFactor;
      const yPos = -(src.extent[3] - sourceDataExtent[3]) * stitchScale * scaleFactor;
      const srcWidth = getWidth(src.extent) * stitchScale * scaleFactor;
      const srcHeight = getHeight(src.extent) * stitchScale * scaleFactor;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.viewport(0, 0, stitchWidthFixed, stitchHeightFixed);
      if (src.clipExtent) {
        const xPos2 = (src.clipExtent[0] - sourceDataExtent[0]) * stitchScale * scaleFactor;
        const yPos2 = -(src.clipExtent[3] - sourceDataExtent[3]) * stitchScale * scaleFactor;
        const width2 = getWidth(src.clipExtent) * stitchScale * scaleFactor;
        const height2 = getHeight(src.clipExtent) * stitchScale * scaleFactor;
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(interpolate ? xPos2 : Math.round(xPos2), interpolate ? yPos2 : Math.round(yPos2), interpolate ? width2 : Math.round(xPos2 + width2) - Math.round(xPos2), interpolate ? height2 : Math.round(yPos2 + height2) - Math.round(yPos2));
      }
      webGLCanvas.drawImage(src.texture, src.width, src.height, gutter, gutter, src.width - 2 * gutter, src.height - 2 * gutter, interpolate ? xPos : Math.round(xPos), interpolate ? yPos : Math.round(yPos), interpolate ? srcWidth : Math.round(xPos + srcWidth) - Math.round(xPos), interpolate ? srcHeight : Math.round(yPos + srcHeight) - Math.round(yPos), stitchWidthFixed, stitchHeightFixed);
      gl.disable(gl.SCISSOR_TEST);
    });
    gl.deleteFramebuffer(fb);
  } else {
    stitchTexture = sources[0].texture;
    stitchWidth = sources[0].width;
    stitchHeight = sources[0].width;
  }
  const targetTopLeft = getTopLeft(targetExtent);
  const sourceTopLeft = getTopLeft(sourceDataExtent);
  const getUVs = (target) => {
    const u0 = (target[0][0] - targetTopLeft[0]) / targetResolution * pixelRatio;
    const v0 = -(target[0][1] - targetTopLeft[1]) / targetResolution * pixelRatio;
    const u1 = (target[1][0] - targetTopLeft[0]) / targetResolution * pixelRatio;
    const v1 = -(target[1][1] - targetTopLeft[1]) / targetResolution * pixelRatio;
    const u2 = (target[2][0] - targetTopLeft[0]) / targetResolution * pixelRatio;
    const v2 = -(target[2][1] - targetTopLeft[1]) / targetResolution * pixelRatio;
    return {
      u1,
      v1,
      u0,
      v0,
      u2,
      v2
    };
  };
  gl.bindFramebuffer(gl.FRAMEBUFFER, resultFrameBuffer);
  gl.viewport(0, 0, width, height);
  {
    const vertices = [];
    const texcoords = [];
    const triProgram = createProgram(gl, TRIANGLE_FRAGMENT_SHADER, TRIANGLE_VERTEX_SHADER);
    gl.useProgram(triProgram);
    const textureLocation = gl.getUniformLocation(triProgram, "u_texture");
    gl.bindTexture(gl.TEXTURE_2D, stitchTexture);
    gl.uniform1i(textureLocation, 0);
    triangulation.getTriangles().forEach(function(triangle, i, arr) {
      const source = triangle.source;
      const target = triangle.target;
      const {
        u1,
        v1,
        u0,
        v0,
        u2,
        v2
      } = getUVs(target);
      const su0 = (source[0][0] - sourceTopLeft[0]) / sourceResolution / stitchWidth;
      const sv0 = -(source[0][1] - sourceTopLeft[1]) / sourceResolution / stitchHeight;
      const su1 = (source[1][0] - sourceTopLeft[0]) / sourceResolution / stitchWidth;
      const sv1 = -(source[1][1] - sourceTopLeft[1]) / sourceResolution / stitchHeight;
      const su2 = (source[2][0] - sourceTopLeft[0]) / sourceResolution / stitchWidth;
      const sv2 = -(source[2][1] - sourceTopLeft[1]) / sourceResolution / stitchHeight;
      vertices.push(u1, v1, u0, v0, u2, v2);
      texcoords.push(su1, sv1, su0, sv0, su2, sv2);
    });
    const matrix = orthographic(0, width, height, 0, -1, 1);
    const matrixLocation = gl.getUniformLocation(triProgram, "u_matrix");
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    const positionLocation = gl.getAttribLocation(triProgram, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
    const texcoordLocation = gl.getAttribLocation(triProgram, "a_texcoord");
    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texcoordLocation);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
  }
  if (renderEdges) {
    const edgeProgram = createProgram(gl, EDGE_FRAGMENT_SHADER, EDGE_VERTEX_SHADER);
    gl.useProgram(edgeProgram);
    const matrix = orthographic(0, width, height, 0, -1, 1);
    const matrixLocation = gl.getUniformLocation(edgeProgram, "u_matrix");
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    const burnval = Array.isArray(renderEdges) ? renderEdges : [0, 0, 0, 255];
    const burnvalLocation = gl.getUniformLocation(edgeProgram, "u_val");
    const isFloat = true;
    if (isFloat) {
      gl.uniform4fv(burnvalLocation, burnval);
    } else {
      gl.uniform4iv(burnvalLocation, burnval);
    }
    const positionLocation = gl.getAttribLocation(edgeProgram, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
    const lines = triangulation.getTriangles().reduce(function(lines2, triangle) {
      const target = triangle.target;
      const {
        u1,
        v1,
        u0,
        v0,
        u2,
        v2
      } = getUVs(target);
      return lines2.concat([u1, v1, u0, v0, u0, v0, u2, v2, u2, v2, u1, v1]);
    }, []);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES, 0, lines.length / 2);
  }
  return {
    width,
    height,
    framebuffer: resultFrameBuffer,
    texture: resultTexture
  };
}

// node_modules/ol/reproj/DataTile.js
var ReprojDataTile = class extends DataTile_default {
  /**
   * @param {Options} options Tile options.
   */
  constructor(options) {
    super({
      tileCoord: options.tileCoord,
      loader: () => Promise.resolve(new Uint8ClampedArray(4)),
      interpolate: options.interpolate,
      transition: options.transition
    });
    this.renderEdges_ = options.renderEdges !== void 0 ? options.renderEdges : false;
    this.pixelRatio_ = options.pixelRatio;
    this.gutter_ = options.gutter;
    this.reprojData_ = null;
    this.reprojError_ = null;
    this.reprojSize_ = void 0;
    this.sourceTileGrid_ = options.sourceTileGrid;
    this.targetTileGrid_ = options.targetTileGrid;
    this.wrappedTileCoord_ = options.wrappedTileCoord || options.tileCoord;
    this.sourceTiles_ = [];
    this.sourcesListenerKeys_ = null;
    this.sourceZ_ = 0;
    const sourceProj = options.sourceProj;
    const sourceProjExtent = sourceProj.getExtent();
    const sourceTileGridExtent = options.sourceTileGrid.getExtent();
    this.clipExtent_ = sourceProj.canWrapX() ? sourceTileGridExtent ? getIntersection(sourceProjExtent, sourceTileGridExtent) : sourceProjExtent : sourceTileGridExtent;
    const targetExtent = this.targetTileGrid_.getTileCoordExtent(this.wrappedTileCoord_);
    const maxTargetExtent = this.targetTileGrid_.getExtent();
    let maxSourceExtent = this.sourceTileGrid_.getExtent();
    const limitedTargetExtent = maxTargetExtent ? getIntersection(targetExtent, maxTargetExtent) : targetExtent;
    if (getArea(limitedTargetExtent) === 0) {
      this.state = TileState_default.EMPTY;
      return;
    }
    if (sourceProjExtent) {
      if (!maxSourceExtent) {
        maxSourceExtent = sourceProjExtent;
      } else {
        maxSourceExtent = getIntersection(maxSourceExtent, sourceProjExtent);
      }
    }
    const targetResolution = this.targetTileGrid_.getResolution(this.wrappedTileCoord_[0]);
    const targetProj = options.targetProj;
    const sourceResolution = calculateSourceExtentResolution(sourceProj, targetProj, limitedTargetExtent, targetResolution);
    if (!isFinite(sourceResolution) || sourceResolution <= 0) {
      this.state = TileState_default.EMPTY;
      return;
    }
    const errorThresholdInPixels = options.errorThreshold !== void 0 ? options.errorThreshold : ERROR_THRESHOLD;
    this.triangulation_ = new Triangulation_default(sourceProj, targetProj, limitedTargetExtent, maxSourceExtent, sourceResolution * errorThresholdInPixels, targetResolution, options.transformMatrix);
    if (this.triangulation_.getTriangles().length === 0) {
      this.state = TileState_default.EMPTY;
      return;
    }
    this.sourceZ_ = this.sourceTileGrid_.getZForResolution(sourceResolution);
    let sourceExtent = this.triangulation_.calculateSourceExtent();
    if (maxSourceExtent) {
      if (sourceProj.canWrapX()) {
        sourceExtent[1] = clamp(sourceExtent[1], maxSourceExtent[1], maxSourceExtent[3]);
        sourceExtent[3] = clamp(sourceExtent[3], maxSourceExtent[1], maxSourceExtent[3]);
      } else {
        sourceExtent = getIntersection(sourceExtent, maxSourceExtent);
      }
    }
    if (!getArea(sourceExtent)) {
      this.state = TileState_default.EMPTY;
    } else {
      let worldWidth = 0;
      let worldsAway = 0;
      if (sourceProj.canWrapX()) {
        worldWidth = getWidth(sourceProjExtent);
        worldsAway = Math.floor((sourceExtent[0] - sourceProjExtent[0]) / worldWidth);
      }
      const sourceExtents = wrapAndSliceX(sourceExtent.slice(), sourceProj, true);
      sourceExtents.forEach((extent) => {
        const sourceRange = this.sourceTileGrid_.getTileRangeForExtentAndZ(extent, this.sourceZ_);
        const getTile = options.getTileFunction;
        for (let srcX = sourceRange.minX; srcX <= sourceRange.maxX; srcX++) {
          for (let srcY = sourceRange.minY; srcY <= sourceRange.maxY; srcY++) {
            const tile = getTile(this.sourceZ_, srcX, srcY, this.pixelRatio_);
            if (tile) {
              const offset = worldsAway * worldWidth;
              this.sourceTiles_.push({
                tile,
                offset
              });
            }
          }
        }
        ++worldsAway;
      });
      if (this.sourceTiles_.length === 0) {
        this.state = TileState_default.EMPTY;
      }
    }
  }
  /**
   * Get the tile size.
   * @return {import('../size.js').Size} Tile size.
   * @override
   */
  getSize() {
    return this.reprojSize_;
  }
  /**
   * Get the data for the tile.
   * @return {import("../DataTile.js").Data} Tile data.
   * @override
   */
  getData() {
    return this.reprojData_;
  }
  /**
   * Get any loading error.
   * @return {Error} Loading error.
   * @override
   */
  getError() {
    return this.reprojError_;
  }
  /**
   * @private
   */
  reproject_() {
    const dataSources = [];
    let imageLike = false;
    this.sourceTiles_.forEach((source) => {
      const tile = source.tile;
      if (!tile || tile.getState() !== TileState_default.LOADED) {
        return;
      }
      const size2 = tile.getSize();
      const gutter = this.gutter_;
      let tileData;
      const arrayData = asArrayLike(tile.getData());
      if (arrayData) {
        tileData = arrayData;
      } else {
        imageLike = true;
        tileData = toArray(asImageLike(tile.getData()));
      }
      const pixelSize = [size2[0] + 2 * gutter, size2[1] + 2 * gutter];
      const isFloat = tileData instanceof Float32Array;
      const pixelCount = pixelSize[0] * pixelSize[1];
      const DataType = isFloat ? Float32Array : Uint8ClampedArray;
      const tileDataR = new DataType(tileData.buffer);
      const bytesPerElement = DataType.BYTES_PER_ELEMENT;
      const bytesPerPixel = bytesPerElement * tileDataR.length / pixelCount;
      const bytesPerRow = tileDataR.byteLength / pixelSize[1];
      const bandCount2 = Math.floor(bytesPerRow / bytesPerElement / pixelSize[0]);
      const extent = this.sourceTileGrid_.getTileCoordExtent(tile.tileCoord);
      extent[0] += source.offset;
      extent[2] += source.offset;
      const clipExtent = this.clipExtent_?.slice();
      if (clipExtent) {
        clipExtent[0] += source.offset;
        clipExtent[2] += source.offset;
      }
      dataSources.push({
        extent,
        clipExtent,
        data: tileDataR,
        dataType: DataType,
        bytesPerPixel,
        pixelSize,
        bandCount: bandCount2
      });
    });
    this.sourceTiles_.length = 0;
    if (dataSources.length === 0) {
      this.state = TileState_default.ERROR;
      this.changed();
      return;
    }
    const z = this.wrappedTileCoord_[0];
    const size = this.targetTileGrid_.getTileSize(z);
    const targetWidth = typeof size === "number" ? size : size[0];
    const targetHeight = typeof size === "number" ? size : size[1];
    const outWidth = targetWidth * this.pixelRatio_;
    const outHeight = targetHeight * this.pixelRatio_;
    const targetResolution = this.targetTileGrid_.getResolution(z);
    const sourceResolution = this.sourceTileGrid_.getResolution(this.sourceZ_);
    const targetExtent = this.targetTileGrid_.getTileCoordExtent(this.wrappedTileCoord_);
    const bandCount = dataSources[0].bandCount;
    const dataR = new dataSources[0].dataType(bandCount * outWidth * outHeight);
    const gl = createCanvasContextWebGL(outWidth, outHeight, canvasGLPool, {
      premultipliedAlpha: false,
      antialias: false
    });
    let willInterpolate;
    const format = gl.RGBA;
    let textureType;
    if (dataSources[0].dataType == Float32Array) {
      textureType = gl.FLOAT;
      gl.getExtension("WEBGL_color_buffer_float");
      gl.getExtension("OES_texture_float");
      gl.getExtension("EXT_float_blend");
      const extension = gl.getExtension("OES_texture_float_linear");
      const canInterpolate = extension !== null;
      willInterpolate = canInterpolate && this.interpolate;
    } else {
      textureType = gl.UNSIGNED_BYTE;
      willInterpolate = this.interpolate;
    }
    const BANDS_PR_REPROJ = 4;
    const reprojs = Math.ceil(bandCount / BANDS_PR_REPROJ);
    for (let reproj = reprojs - 1; reproj >= 0; --reproj) {
      const sources = [];
      for (let i = 0, len = dataSources.length; i < len; ++i) {
        const dataSource = dataSources[i];
        const pixelSize = dataSource.pixelSize;
        const width2 = pixelSize[0];
        const height2 = pixelSize[1];
        const data2 = new dataSource.dataType(BANDS_PR_REPROJ * width2 * height2);
        const dataS = dataSource.data;
        let offset2 = reproj * BANDS_PR_REPROJ;
        for (let j = 0, len2 = data2.length; j < len2; j += BANDS_PR_REPROJ) {
          data2[j] = dataS[offset2];
          data2[j + 1] = dataS[offset2 + 1];
          data2[j + 2] = dataS[offset2 + 2];
          data2[j + 3] = dataS[offset2 + 3];
          offset2 += bandCount;
        }
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if (willInterpolate) {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, format, width2, height2, 0, format, textureType, data2);
        sources.push({
          extent: dataSource.extent,
          clipExtent: dataSource.clipExtent,
          texture,
          width: width2,
          height: height2
        });
      }
      const {
        framebuffer,
        width,
        height
      } = render(gl, targetWidth, targetHeight, this.pixelRatio_, sourceResolution, targetResolution, targetExtent, this.triangulation_, sources, this.gutter_, textureType, this.renderEdges_, willInterpolate);
      const rows = width;
      const cols = height * BANDS_PR_REPROJ;
      const data = new dataSources[0].dataType(rows * cols);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.readPixels(0, 0, width, height, gl.RGBA, textureType, data);
      let offset = reproj * BANDS_PR_REPROJ;
      for (let i = 0, len = data.length; i < len; i += BANDS_PR_REPROJ) {
        const flipY = (rows - 1 - (i / cols | 0)) * cols + i % cols;
        dataR[offset] = data[flipY];
        dataR[offset + 1] = data[flipY + 1];
        dataR[offset + 2] = data[flipY + 2];
        dataR[offset + 3] = data[flipY + 3];
        offset += bandCount;
      }
    }
    releaseGLCanvas(gl);
    canvasGLPool.push(gl.canvas);
    if (imageLike) {
      const context = createCanvasContext2D(targetWidth, targetHeight);
      const imageData = new ImageData(dataR, targetWidth);
      context.putImageData(imageData, 0, 0);
      this.reprojData_ = context.canvas;
    } else {
      this.reprojData_ = dataR;
    }
    this.reprojSize_ = [Math.round(outWidth), Math.round(outHeight)];
    this.state = TileState_default.LOADED;
    this.changed();
  }
  /**
   * Load not yet loaded URI.
   * @override
   */
  load() {
    if (this.state !== TileState_default.IDLE && this.state !== TileState_default.ERROR) {
      return;
    }
    this.state = TileState_default.LOADING;
    this.changed();
    let leftToLoad = 0;
    this.sourcesListenerKeys_ = [];
    this.sourceTiles_.forEach(({
      tile
    }) => {
      const state = tile.getState();
      if (state !== TileState_default.IDLE && state !== TileState_default.LOADING) {
        return;
      }
      leftToLoad++;
      const sourceListenKey = listen(tile, EventType_default.CHANGE, () => {
        const state2 = tile.getState();
        if (state2 == TileState_default.LOADED || state2 == TileState_default.ERROR || state2 == TileState_default.EMPTY) {
          unlistenByKey(sourceListenKey);
          leftToLoad--;
          if (leftToLoad === 0) {
            this.unlistenSources_();
            this.reproject_();
          }
        }
      });
      this.sourcesListenerKeys_.push(sourceListenKey);
    });
    if (leftToLoad === 0) {
      setTimeout(this.reproject_.bind(this), 0);
    } else {
      this.sourceTiles_.forEach(function({
        tile
      }) {
        const state = tile.getState();
        if (state == TileState_default.IDLE) {
          tile.load();
        }
      });
    }
  }
  /**
   * @private
   */
  unlistenSources_() {
    this.sourcesListenerKeys_.forEach(unlistenByKey);
    this.sourcesListenerKeys_ = null;
  }
};
var DataTile_default2 = ReprojDataTile;

// node_modules/ol/renderer/canvas/TileLayer.js
function getCacheKey(sourceKey, z, x, y) {
  return `${sourceKey},${getKeyZXY(z, x, y)}`;
}
function addTileToLookup(tilesByZ, tile, z) {
  if (!(z in tilesByZ)) {
    tilesByZ[z] = /* @__PURE__ */ new Set([tile]);
    return true;
  }
  const set = tilesByZ[z];
  const existing = set.has(tile);
  if (!existing) {
    set.add(tile);
  }
  return !existing;
}
function removeTileFromLookup(tilesByZ, tile, z) {
  const set = tilesByZ[z];
  if (set) {
    return set.delete(tile);
  }
  return false;
}
function getRenderExtent(frameState, extent) {
  const layerState = frameState.layerStatesArray[frameState.layerIndex];
  if (layerState.extent) {
    extent = getIntersection(extent, fromUserExtent(layerState.extent, frameState.viewState.projection));
  }
  const source = (
    /** @type {import("../../source/Tile.js").default} */
    layerState.layer.getRenderSource()
  );
  if (!source.getWrapX()) {
    const gridExtent = source.getTileGridForProjection(frameState.viewState.projection).getExtent();
    if (gridExtent) {
      extent = getIntersection(extent, gridExtent);
    }
  }
  return extent;
}
var CanvasTileLayerRenderer = class extends Layer_default2 {
  /**
   * @param {LayerType} tileLayer Tile layer.
   * @param {Options} [options] Options.
   */
  constructor(tileLayer, options) {
    super(tileLayer);
    options = options || {};
    this.extentChanged = true;
    this.renderComplete = false;
    this.renderedExtent_ = null;
    this.renderedPixelRatio;
    this.renderedProjection = null;
    this.renderedRevision;
    this.renderedTiles = [];
    this.renderedSourceKey_;
    this.renderedSourceRevision_;
    this.tempExtent = createEmpty();
    this.tempTileRange_ = new TileRange_default(0, 0, 0, 0);
    this.tempTileCoord_ = createOrUpdate(0, 0, 0);
    const cacheSize = options.cacheSize !== void 0 ? options.cacheSize : 512;
    this.tileCache_ = new LRUCache_default(cacheSize);
    this.maxStaleKeys = cacheSize * 0.5;
  }
  /**
   * @return {LRUCache} Tile cache.
   */
  getTileCache() {
    return this.tileCache_;
  }
  /**
   * Get a tile from the cache or create one if needed.
   *
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {import("../../Tile.js").default|null} Tile (or null if outside source extent).
   * @protected
   */
  getOrCreateTile(z, x, y, frameState) {
    const tileCache = this.tileCache_;
    const tileLayer = this.getLayer();
    const tileSource = tileLayer.getSource();
    const cacheKey = getCacheKey(tileSource.getKey(), z, x, y);
    let tile;
    if (tileCache.containsKey(cacheKey)) {
      tile = tileCache.get(cacheKey);
    } else {
      tile = tileSource.getTile(z, x, y, frameState.pixelRatio, frameState.viewState.projection);
      if (!tile) {
        return null;
      }
      tileCache.set(cacheKey, tile);
    }
    return tile;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {import("../../Tile.js").default|null} Tile (or null if outside source extent).
   * @protected
   */
  getTile(z, x, y, frameState) {
    const tile = this.getOrCreateTile(z, x, y, frameState);
    if (!tile) {
      return null;
    }
    return tile;
  }
  /**
   * @param {import("../../pixel.js").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray} Data at the pixel location.
   * @override
   */
  getData(pixel) {
    const frameState = this.frameState;
    if (!frameState) {
      return null;
    }
    const layer = this.getLayer();
    const coordinate = apply(frameState.pixelToCoordinateTransform, pixel.slice());
    const layerExtent = layer.getExtent();
    if (layerExtent) {
      if (!containsCoordinate(layerExtent, coordinate)) {
        return null;
      }
    }
    const viewState = frameState.viewState;
    const source = layer.getRenderSource();
    const tileGrid = source.getTileGridForProjection(viewState.projection);
    const tilePixelRatio = source.getTilePixelRatio(frameState.pixelRatio);
    for (let z = tileGrid.getZForResolution(viewState.resolution); z >= tileGrid.getMinZoom(); --z) {
      const tileCoord = tileGrid.getTileCoordForCoordAndZ(coordinate, z);
      const tile = this.getTile(z, tileCoord[1], tileCoord[2], frameState);
      if (!tile || tile.getState() !== TileState_default.LOADED) {
        continue;
      }
      const tileOrigin = tileGrid.getOrigin(z);
      const tileSize = toSize(tileGrid.getTileSize(z));
      const tileResolution = tileGrid.getResolution(z);
      let image;
      if (tile instanceof ImageTile_default || tile instanceof Tile_default2) {
        image = tile.getImage();
      } else if (tile instanceof DataTile_default) {
        image = asImageLike(tile.getData());
        if (!image) {
          continue;
        }
      } else {
        continue;
      }
      const col = Math.floor(tilePixelRatio * ((coordinate[0] - tileOrigin[0]) / tileResolution - tileCoord[1] * tileSize[0]));
      const row = Math.floor(tilePixelRatio * ((tileOrigin[1] - coordinate[1]) / tileResolution - tileCoord[2] * tileSize[1]));
      const gutter = Math.round(tilePixelRatio * source.getGutterForProjection(viewState.projection));
      return this.getImageData(image, col + gutter, row + gutter);
    }
    return null;
  }
  /**
   * Determine whether render should be called.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   * @override
   */
  prepareFrame(frameState) {
    if (!this.renderedProjection) {
      this.renderedProjection = frameState.viewState.projection;
    } else if (frameState.viewState.projection !== this.renderedProjection) {
      this.tileCache_.clear();
      this.renderedProjection = frameState.viewState.projection;
    }
    const source = this.getLayer().getSource();
    if (!source) {
      return false;
    }
    const sourceRevision = source.getRevision();
    if (!this.renderedRevision_) {
      this.renderedRevision_ = sourceRevision;
    } else if (this.renderedRevision_ !== sourceRevision) {
      this.renderedRevision_ = sourceRevision;
      if (this.renderedSourceKey_ === source.getKey()) {
        this.tileCache_.clear();
      }
    }
    return true;
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {import("../../extent.js").Extent} extent The extent to be rendered.
   * @param {number} initialZ The zoom level.
   * @param {TileLookup} tilesByZ Lookup of tiles by zoom level.
   * @param {number} preload Number of additional levels to load.
   */
  enqueueTiles(frameState, extent, initialZ, tilesByZ, preload) {
    const viewState = frameState.viewState;
    const tileLayer = this.getLayer();
    const tileSource = tileLayer.getRenderSource();
    const tileGrid = tileSource.getTileGridForProjection(viewState.projection);
    const tileSourceKey = getUid(tileSource);
    if (!(tileSourceKey in frameState.wantedTiles)) {
      frameState.wantedTiles[tileSourceKey] = {};
    }
    const wantedTiles = frameState.wantedTiles[tileSourceKey];
    const map = tileLayer.getMapInternal();
    const minZ = Math.max(initialZ - preload, tileGrid.getMinZoom(), tileGrid.getZForResolution(Math.min(tileLayer.getMaxResolution(), map ? map.getView().getResolutionForZoom(Math.max(tileLayer.getMinZoom(), 0)) : tileGrid.getResolution(0)), tileSource.zDirection));
    for (let z = initialZ; z >= minZ; --z) {
      const tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z, this.tempTileRange_);
      const tileResolution = tileGrid.getResolution(z);
      for (let x = tileRange.minX; x <= tileRange.maxX; ++x) {
        for (let y = tileRange.minY; y <= tileRange.maxY; ++y) {
          const tile = this.getTile(z, x, y, frameState);
          if (!tile) {
            continue;
          }
          const added = addTileToLookup(tilesByZ, tile, z);
          if (!added) {
            continue;
          }
          const tileQueueKey = tile.getKey();
          wantedTiles[tileQueueKey] = true;
          if (tile.getState() === TileState_default.IDLE) {
            if (!frameState.tileQueue.isKeyQueued(tileQueueKey)) {
              const tileCoord = createOrUpdate(z, x, y, this.tempTileCoord_);
              frameState.tileQueue.enqueue([tile, tileSourceKey, tileGrid.getTileCoordCenter(tileCoord), tileResolution]);
            }
          }
        }
      }
    }
  }
  /**
   * Look for tiles covering the provided tile coordinate at an alternate
   * zoom level.  Loaded tiles will be added to the provided tile texture lookup.
   * @param {import("../../tilecoord.js").TileCoord} tileCoord The target tile coordinate.
   * @param {TileLookup} tilesByZ Lookup of tiles by zoom level.
   * @return {boolean} The tile coordinate is covered by loaded tiles at the alternate zoom level.
   * @private
   */
  findStaleTile_(tileCoord, tilesByZ) {
    const tileCache = this.tileCache_;
    const z = tileCoord[0];
    const x = tileCoord[1];
    const y = tileCoord[2];
    const staleKeys = this.getStaleKeys();
    for (let i = 0; i < staleKeys.length; ++i) {
      const cacheKey = getCacheKey(staleKeys[i], z, x, y);
      if (tileCache.containsKey(cacheKey)) {
        const tile = tileCache.get(cacheKey);
        if (tile.getState() === TileState_default.LOADED) {
          tile.endTransition(getUid(this));
          addTileToLookup(tilesByZ, tile, z);
          return true;
        }
      }
    }
    return false;
  }
  /**
   * Look for tiles covering the provided tile coordinate at an alternate
   * zoom level.  Loaded tiles will be added to the provided tile texture lookup.
   * @param {import("../../tilegrid/TileGrid.js").default} tileGrid The tile grid.
   * @param {import("../../tilecoord.js").TileCoord} tileCoord The target tile coordinate.
   * @param {number} altZ The alternate zoom level.
   * @param {TileLookup} tilesByZ Lookup of tiles by zoom level.
   * @return {boolean} The tile coordinate is covered by loaded tiles at the alternate zoom level.
   * @private
   */
  findAltTiles_(tileGrid, tileCoord, altZ, tilesByZ) {
    const tileRange = tileGrid.getTileRangeForTileCoordAndZ(tileCoord, altZ, this.tempTileRange_);
    if (!tileRange) {
      return false;
    }
    let covered = true;
    const tileCache = this.tileCache_;
    const source = this.getLayer().getRenderSource();
    const sourceKey = source.getKey();
    for (let x = tileRange.minX; x <= tileRange.maxX; ++x) {
      for (let y = tileRange.minY; y <= tileRange.maxY; ++y) {
        const cacheKey = getCacheKey(sourceKey, altZ, x, y);
        let loaded = false;
        if (tileCache.containsKey(cacheKey)) {
          const tile = tileCache.get(cacheKey);
          if (tile.getState() === TileState_default.LOADED) {
            addTileToLookup(tilesByZ, tile, altZ);
            loaded = true;
          }
        }
        if (!loaded) {
          covered = false;
        }
      }
    }
    return covered;
  }
  /**
   * Render the layer.
   *
   * The frame rendering logic has three parts:
   *
   *  1. Enqueue tiles
   *  2. Find alt tiles for those that are not yet loaded
   *  3. Render loaded tiles
   *
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target that may be used to render content to.
   * @return {HTMLElement} The rendered element.
   * @override
   */
  renderFrame(frameState, target) {
    let allTilesIdle = true;
    this.renderComplete = true;
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const viewState = frameState.viewState;
    const projection = viewState.projection;
    const viewResolution = viewState.resolution;
    const viewCenter = viewState.center;
    const pixelRatio = frameState.pixelRatio;
    const tileLayer = this.getLayer();
    const tileSource = tileLayer.getSource();
    const sourceRevision = tileSource.getRevision();
    const tileGrid = tileSource.getTileGridForProjection(projection);
    const z = tileGrid.getZForResolution(viewResolution, tileSource.zDirection);
    const tileResolution = tileGrid.getResolution(z);
    const sourceKey = tileSource.getKey();
    if (!this.renderedSourceKey_) {
      this.renderedSourceKey_ = sourceKey;
    } else if (this.renderedSourceKey_ !== sourceKey) {
      this.prependStaleKey(this.renderedSourceKey_);
      this.renderedSourceKey_ = sourceKey;
    }
    let frameExtent = frameState.extent;
    const tilePixelRatio = tileSource.getTilePixelRatio(pixelRatio);
    this.prepareContainer(frameState, target);
    const width = this.context.canvas.width;
    const height = this.context.canvas.height;
    const layerExtent = layerState.extent && fromUserExtent(layerState.extent, projection);
    if (layerExtent) {
      frameExtent = getIntersection(frameExtent, fromUserExtent(layerState.extent, projection));
    }
    const dx = tileResolution * width / 2 / tilePixelRatio;
    const dy = tileResolution * height / 2 / tilePixelRatio;
    const canvasExtent = [viewCenter[0] - dx, viewCenter[1] - dy, viewCenter[0] + dx, viewCenter[1] + dy];
    const tilesByZ = {};
    this.renderedTiles.length = 0;
    const preload = tileLayer.getPreload();
    if (frameState.nextExtent) {
      const targetZ = tileGrid.getZForResolution(viewState.nextResolution, tileSource.zDirection);
      const nextExtent = getRenderExtent(frameState, frameState.nextExtent);
      this.enqueueTiles(frameState, nextExtent, targetZ, tilesByZ, preload);
    }
    const renderExtent = getRenderExtent(frameState, frameExtent);
    this.enqueueTiles(frameState, renderExtent, z, tilesByZ, 0);
    if (preload > 0) {
      setTimeout(() => {
        this.enqueueTiles(frameState, renderExtent, z - 1, tilesByZ, preload - 1);
      }, 0);
    }
    if (!(z in tilesByZ)) {
      return this.container;
    }
    const uid = getUid(this);
    const time = frameState.time;
    for (const tile of tilesByZ[z]) {
      const tileState = tile.getState();
      if ((tile instanceof Tile_default2 || tile instanceof DataTile_default2) && tileState === TileState_default.EMPTY) {
        continue;
      }
      const tileCoord = tile.tileCoord;
      if (tileState === TileState_default.LOADED) {
        const alpha = tile.getAlpha(uid, time);
        if (alpha === 1) {
          tile.endTransition(uid);
          continue;
        }
      }
      if (tileState !== TileState_default.IDLE) {
        allTilesIdle = false;
      }
      if (tileState !== TileState_default.ERROR) {
        this.renderComplete = false;
      }
      const hasStaleTile = this.findStaleTile_(tileCoord, tilesByZ);
      if (hasStaleTile) {
        removeTileFromLookup(tilesByZ, tile, z);
        frameState.animate = true;
        continue;
      }
      const coveredByChildren = this.findAltTiles_(tileGrid, tileCoord, z + 1, tilesByZ);
      if (coveredByChildren) {
        continue;
      }
      const minZoom = tileGrid.getMinZoom();
      for (let parentZ = z - 1; parentZ >= minZoom; --parentZ) {
        const coveredByParent = this.findAltTiles_(tileGrid, tileCoord, parentZ, tilesByZ);
        if (coveredByParent) {
          break;
        }
      }
    }
    const canvasScale = tileResolution / viewResolution * pixelRatio / tilePixelRatio;
    const context = this.getRenderContext(frameState);
    compose(this.tempTransform, width / 2, height / 2, canvasScale, canvasScale, 0, -width / 2, -height / 2);
    if (layerState.extent) {
      this.clipUnrotated(context, frameState, layerExtent);
    }
    if (!tileSource.getInterpolate()) {
      context.imageSmoothingEnabled = false;
    }
    this.preRender(context, frameState);
    const zs = Object.keys(tilesByZ).map(Number);
    zs.sort(ascending);
    let currentClip;
    const clips = [];
    const clipZs = [];
    for (let i = zs.length - 1; i >= 0; --i) {
      const currentZ = zs[i];
      const currentTilePixelSize = tileSource.getTilePixelSize(currentZ, pixelRatio, projection);
      const currentResolution = tileGrid.getResolution(currentZ);
      const currentScale = currentResolution / tileResolution;
      const dx2 = currentTilePixelSize[0] * currentScale * canvasScale;
      const dy2 = currentTilePixelSize[1] * currentScale * canvasScale;
      const originTileCoord = tileGrid.getTileCoordForCoordAndZ(getTopLeft(canvasExtent), currentZ);
      const originTileExtent = tileGrid.getTileCoordExtent(originTileCoord);
      const origin = apply(this.tempTransform, [tilePixelRatio * (originTileExtent[0] - canvasExtent[0]) / tileResolution, tilePixelRatio * (canvasExtent[3] - originTileExtent[3]) / tileResolution]);
      const tileGutter = tilePixelRatio * tileSource.getGutterForProjection(projection);
      for (const tile of tilesByZ[currentZ]) {
        if (tile.getState() !== TileState_default.LOADED) {
          continue;
        }
        const tileCoord = tile.tileCoord;
        const xIndex = originTileCoord[1] - tileCoord[1];
        const nextX = Math.round(origin[0] - (xIndex - 1) * dx2);
        const yIndex = originTileCoord[2] - tileCoord[2];
        const nextY = Math.round(origin[1] - (yIndex - 1) * dy2);
        const x = Math.round(origin[0] - xIndex * dx2);
        const y = Math.round(origin[1] - yIndex * dy2);
        const w = nextX - x;
        const h = nextY - y;
        const transition = zs.length === 1;
        let contextSaved = false;
        currentClip = [x, y, x + w, y, x + w, y + h, x, y + h];
        for (let i2 = 0, ii = clips.length; i2 < ii; ++i2) {
          if (!transition && currentZ < clipZs[i2]) {
            const clip = clips[i2];
            if (intersects([x, y, x + w, y + h], [clip[0], clip[3], clip[4], clip[7]])) {
              if (!contextSaved) {
                context.save();
                contextSaved = true;
              }
              context.beginPath();
              context.moveTo(currentClip[0], currentClip[1]);
              context.lineTo(currentClip[2], currentClip[3]);
              context.lineTo(currentClip[4], currentClip[5]);
              context.lineTo(currentClip[6], currentClip[7]);
              context.moveTo(clip[6], clip[7]);
              context.lineTo(clip[4], clip[5]);
              context.lineTo(clip[2], clip[3]);
              context.lineTo(clip[0], clip[1]);
              context.clip();
            }
          }
        }
        clips.push(currentClip);
        clipZs.push(currentZ);
        this.drawTile(tile, frameState, x, y, w, h, tileGutter, transition);
        if (contextSaved) {
          context.restore();
        }
        this.renderedTiles.unshift(tile);
        this.updateUsedTiles(frameState.usedTiles, tileSource, tile);
      }
    }
    this.renderedRevision = sourceRevision;
    this.renderedResolution = tileResolution;
    this.extentChanged = !this.renderedExtent_ || !equals(this.renderedExtent_, canvasExtent);
    this.renderedExtent_ = canvasExtent;
    this.renderedPixelRatio = pixelRatio;
    this.postRender(this.context, frameState);
    if (layerState.extent) {
      context.restore();
    }
    context.imageSmoothingEnabled = true;
    if (this.renderComplete) {
      const postRenderFunction = (map, frameState2) => {
        const tileSourceKey = getUid(tileSource);
        const wantedTiles = frameState2.wantedTiles[tileSourceKey];
        const tilesCount = wantedTiles ? Object.keys(wantedTiles).length : 0;
        this.updateCacheSize(tilesCount);
        this.tileCache_.expireCache();
      };
      frameState.postRenderFunctions.push(postRenderFunction);
    }
    if (!this.renderComplete && !allTilesIdle) {
      frameState.animate = true;
    }
    return this.container;
  }
  /**
   * Increases the cache size if needed
   * @param {number} tileCount Minimum number of tiles needed.
   */
  updateCacheSize(tileCount) {
    this.tileCache_.highWaterMark = Math.max(this.tileCache_.highWaterMark, tileCount * 2);
  }
  /**
   * @param {import("../../Tile.js").default} tile Tile.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {number} x Left of the tile.
   * @param {number} y Top of the tile.
   * @param {number} w Width of the tile.
   * @param {number} h Height of the tile.
   * @param {number} gutter Tile gutter.
   * @param {boolean} transition Apply an alpha transition.
   * @protected
   */
  drawTile(tile, frameState, x, y, w, h, gutter, transition) {
    let image;
    if (tile instanceof DataTile_default) {
      image = asImageLike(tile.getData());
      if (!image) {
        throw new Error("Rendering array data is not yet supported");
      }
    } else {
      image = this.getTileImage(
        /** @type {import("../../ImageTile.js").default} */
        tile
      );
    }
    if (!image) {
      return;
    }
    const context = this.getRenderContext(frameState);
    const uid = getUid(this);
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const alpha = layerState.opacity * (transition ? tile.getAlpha(uid, frameState.time) : 1);
    const alphaChanged = alpha !== context.globalAlpha;
    if (alphaChanged) {
      context.save();
      context.globalAlpha = alpha;
    }
    context.drawImage(image, gutter, gutter, image.width - 2 * gutter, image.height - 2 * gutter, x, y, w, h);
    if (alphaChanged) {
      context.restore();
    }
    if (alpha !== layerState.opacity) {
      frameState.animate = true;
    } else if (transition) {
      tile.endTransition(uid);
    }
  }
  /**
   * @return {HTMLCanvasElement} Image
   */
  getImage() {
    const context = this.context;
    return context ? context.canvas : null;
  }
  /**
   * Get the image from a tile.
   * @param {import("../../ImageTile.js").default} tile Tile.
   * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
   * @protected
   */
  getTileImage(tile) {
    return tile.getImage();
  }
  /**
   * @param {!Object<string, !Object<string, boolean>>} usedTiles Used tiles.
   * @param {import("../../source/Tile.js").default} tileSource Tile source.
   * @param {import('../../Tile.js').default} tile Tile.
   * @protected
   */
  updateUsedTiles(usedTiles, tileSource, tile) {
    const tileSourceKey = getUid(tileSource);
    if (!(tileSourceKey in usedTiles)) {
      usedTiles[tileSourceKey] = {};
    }
    usedTiles[tileSourceKey][tile.getKey()] = true;
  }
};
var TileLayer_default = CanvasTileLayerRenderer;

// node_modules/ol/layer/Tile.js
var TileLayer = class extends BaseTile_default {
  /**
   * @param {import("./BaseTile.js").Options<TileSourceType>} [options] Tile layer options.
   */
  constructor(options) {
    super(options);
  }
  /**
   * @override
   */
  createRenderer() {
    return new TileLayer_default(this, {
      cacheSize: this.getCacheSize()
    });
  }
};
var Tile_default3 = TileLayer;
export {
  Tile_default3 as default
};
//# sourceMappingURL=ol_layer_Tile.js.map
