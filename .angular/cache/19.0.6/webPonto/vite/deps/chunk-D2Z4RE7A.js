import {
  Object_default
} from "./chunk-3S6XKZIH.js";
import {
  IconImage_default,
  Image_default,
  get,
  shared
} from "./chunk-IMXJLLKJ.js";
import {
  asArray,
  toString
} from "./chunk-RTT3XQ3T.js";
import {
  ImageState_default,
  WORKER_OFFSCREEN_CANVAS,
  createCanvasContext2D
} from "./chunk-P6LFJGEQ.js";
import {
  assert,
  getUid
} from "./chunk-H2CPFOG6.js";
import {
  clear
} from "./chunk-VNWMKJWE.js";

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
var defaultFont = "10px sans-serif";
var defaultFillStyle = "#000";
var defaultLineCap = "round";
var defaultLineDash = [];
var defaultLineDashOffset = 0;
var defaultLineJoin = "round";
var defaultMiterLimit = 10;
var defaultStrokeStyle = "#000";
var defaultTextAlign = "center";
var defaultTextBaseline = "middle";
var defaultPadding = [0, 0, 0, 0];
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
var measureTextHeight = /* @__PURE__ */ function() {
  let measureElement;
  return function(fontSpec) {
    let height = textHeights[fontSpec];
    if (height == void 0) {
      if (WORKER_OFFSCREEN_CANVAS) {
        const font = getFontParameters(fontSpec);
        const metrics = measureText(fontSpec, "Žg");
        const lineHeight = isNaN(Number(font.lineHeight)) ? 1.2 : Number(font.lineHeight);
        height = lineHeight * (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
      } else {
        if (!measureElement) {
          measureElement = document.createElement("div");
          measureElement.innerHTML = "M";
          measureElement.style.minHeight = "0";
          measureElement.style.maxHeight = "none";
          measureElement.style.height = "auto";
          measureElement.style.padding = "0";
          measureElement.style.border = "none";
          measureElement.style.position = "absolute";
          measureElement.style.display = "block";
          measureElement.style.left = "-99999px";
        }
        measureElement.style.font = fontSpec;
        document.body.appendChild(measureElement);
        height = measureElement.offsetHeight;
        document.body.removeChild(measureElement);
      }
      textHeights[fontSpec] = height;
    }
    return height;
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
function measureAndCacheTextWidth(font, text, cache) {
  if (text in cache) {
    return cache[text];
  }
  const width = text.split("\n").reduce((prev, curr) => Math.max(prev, measureTextWidth(font, curr)), 0);
  cache[text] = width;
  return width;
}
function getTextDimensions(baseStyle, chunks) {
  const widths = [];
  const heights = [];
  const lineWidths = [];
  let width = 0;
  let lineWidth = 0;
  let height = 0;
  let lineHeight = 0;
  for (let i = 0, ii = chunks.length; i <= ii; i += 2) {
    const text = chunks[i];
    if (text === "\n" || i === ii) {
      width = Math.max(width, lineWidth);
      lineWidths.push(lineWidth);
      lineWidth = 0;
      height += lineHeight;
      lineHeight = 0;
      continue;
    }
    const font = chunks[i + 1] || baseStyle.font;
    const currentWidth = measureTextWidth(font, text);
    widths.push(currentWidth);
    lineWidth += currentWidth;
    const currentHeight = measureTextHeight(font);
    heights.push(currentHeight);
    lineHeight = Math.max(lineHeight, currentHeight);
  }
  return {
    width,
    height,
    widths,
    heights,
    lineWidths
  };
}
function drawImageOrLabel(context, transform, opacity, labelOrImage, originX, originY, w, h, x, y, scale) {
  context.save();
  if (opacity !== 1) {
    if (context.globalAlpha === void 0) {
      context.globalAlpha = (context2) => context2.globalAlpha *= opacity;
    } else {
      context.globalAlpha *= opacity;
    }
  }
  if (transform) {
    context.transform.apply(context, transform);
  }
  if (
    /** @type {*} */
    labelOrImage.contextInstructions
  ) {
    context.translate(x, y);
    context.scale(scale[0], scale[1]);
    executeLabelInstructions(
      /** @type {Label} */
      labelOrImage,
      context
    );
  } else if (scale[0] < 0 || scale[1] < 0) {
    context.translate(x, y);
    context.scale(scale[0], scale[1]);
    context.drawImage(
      /** @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} */
      labelOrImage,
      originX,
      originY,
      w,
      h,
      0,
      0,
      w,
      h
    );
  } else {
    context.drawImage(
      /** @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} */
      labelOrImage,
      originX,
      originY,
      w,
      h,
      x,
      y,
      w * scale[0],
      h * scale[1]
    );
  }
  context.restore();
}
function executeLabelInstructions(label, context) {
  const contextInstructions = label.contextInstructions;
  for (let i = 0, ii = contextInstructions.length; i < ii; i += 2) {
    if (Array.isArray(contextInstructions[i + 1])) {
      context[contextInstructions[i]].apply(context, contextInstructions[i + 1]);
    } else {
      context[contextInstructions[i]] = contextInstructions[i + 1];
    }
  }
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
    const scale = this.getScale();
    const style = new _RegularShape({
      fill: this.getFill() ? this.getFill().clone() : void 0,
      points: this.getPoints(),
      radius: this.getRadius(),
      radius2: this.getRadius2(),
      angle: this.getAngle(),
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      scale: Array.isArray(scale) ? scale.slice() : scale,
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
    const scale = this.getScaleArray();
    return [size[0] / 2 - displacement[0] / scale[0], size[1] / 2 + displacement[1] / scale[1]];
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
    const scale = this.getScale();
    const style = new _CircleStyle({
      fill: this.getFill() ? this.getFill().clone() : void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      radius: this.getRadius(),
      scale: Array.isArray(scale) ? scale.slice() : scale,
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
function createEditingStyle() {
  const styles = {};
  const white = [255, 255, 255, 1];
  const blue = [0, 153, 255, 1];
  const width = 3;
  styles["Polygon"] = [new Style({
    fill: new Fill_default({
      color: [255, 255, 255, 0.5]
    })
  })];
  styles["MultiPolygon"] = styles["Polygon"];
  styles["LineString"] = [new Style({
    stroke: new Stroke_default({
      color: white,
      width: width + 2
    })
  }), new Style({
    stroke: new Stroke_default({
      color: blue,
      width
    })
  })];
  styles["MultiLineString"] = styles["LineString"];
  styles["Circle"] = styles["Polygon"].concat(styles["LineString"]);
  styles["Point"] = [new Style({
    image: new Circle_default({
      radius: width * 2,
      fill: new Fill_default({
        color: blue
      }),
      stroke: new Stroke_default({
        color: white,
        width: width / 2
      })
    }),
    zIndex: Infinity
  })];
  styles["MultiPoint"] = styles["Point"];
  styles["GeometryCollection"] = styles["Polygon"].concat(styles["LineString"], styles["Point"]);
  return styles;
}
function defaultGeometryFunction(feature) {
  return feature.getGeometry();
}
var Style_default = Style;

export {
  asColorLike,
  CLASS_HIDDEN,
  CLASS_UNSELECTABLE,
  CLASS_CONTROL,
  CLASS_COLLAPSED,
  defaultFont,
  defaultFillStyle,
  defaultLineCap,
  defaultLineDash,
  defaultLineDashOffset,
  defaultLineJoin,
  defaultMiterLimit,
  defaultStrokeStyle,
  defaultTextAlign,
  defaultTextBaseline,
  defaultPadding,
  defaultLineWidth,
  checkedFonts,
  registerFont,
  measureAndCacheTextWidth,
  getTextDimensions,
  drawImageOrLabel,
  RegularShape_default,
  Circle_default,
  Fill_default,
  Stroke_default,
  toFunction,
  createDefaultStyle,
  createEditingStyle,
  Style_default
};
//# sourceMappingURL=chunk-D2Z4RE7A.js.map
