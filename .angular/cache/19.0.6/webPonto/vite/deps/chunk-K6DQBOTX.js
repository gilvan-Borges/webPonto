import {
  assert
} from "./chunk-LCVGJ6M3.js";
import {
  Object_default
} from "./chunk-LFCNIOCW.js";
import {
  EventType_default,
  listen,
  unlistenByKey
} from "./chunk-TBRIBG4Z.js";

// node_modules/ol/Feature.js
var Feature = class _Feature extends Object_default {
  /**
   * @param {Geometry|ObjectWithGeometry<Geometry>} [geometryOrProperties]
   *     You may pass a Geometry object directly, or an object literal containing
   *     properties. If you pass an object literal, you may include a Geometry
   *     associated with a `geometry` key.
   */
  constructor(geometryOrProperties) {
    super();
    this.on;
    this.once;
    this.un;
    this.id_ = void 0;
    this.geometryName_ = "geometry";
    this.style_ = null;
    this.styleFunction_ = void 0;
    this.geometryChangeKey_ = null;
    this.addChangeListener(this.geometryName_, this.handleGeometryChanged_);
    if (geometryOrProperties) {
      if (typeof /** @type {?} */
      geometryOrProperties.getSimplifiedGeometry === "function") {
        const geometry = (
          /** @type {Geometry} */
          geometryOrProperties
        );
        this.setGeometry(geometry);
      } else {
        const properties = geometryOrProperties;
        this.setProperties(properties);
      }
    }
  }
  /**
   * Clone this feature. If the original feature has a geometry it
   * is also cloned. The feature id is not set in the clone.
   * @return {Feature<Geometry>} The clone.
   * @api
   */
  clone() {
    const clone = (
      /** @type {Feature<Geometry>} */
      new _Feature(this.hasProperties() ? this.getProperties() : null)
    );
    clone.setGeometryName(this.getGeometryName());
    const geometry = this.getGeometry();
    if (geometry) {
      clone.setGeometry(
        /** @type {Geometry} */
        geometry.clone()
      );
    }
    const style = this.getStyle();
    if (style) {
      clone.setStyle(style);
    }
    return clone;
  }
  /**
   * Get the feature's default geometry.  A feature may have any number of named
   * geometries.  The "default" geometry (the one that is rendered by default) is
   * set when calling {@link module:ol/Feature~Feature#setGeometry}.
   * @return {Geometry|undefined} The default geometry for the feature.
   * @api
   * @observable
   */
  getGeometry() {
    return (
      /** @type {Geometry|undefined} */
      this.get(this.geometryName_)
    );
  }
  /**
   * Get the feature identifier.  This is a stable identifier for the feature and
   * is either set when reading data from a remote source or set explicitly by
   * calling {@link module:ol/Feature~Feature#setId}.
   * @return {number|string|undefined} Id.
   * @api
   */
  getId() {
    return this.id_;
  }
  /**
   * Get the name of the feature's default geometry.  By default, the default
   * geometry is named `geometry`.
   * @return {string} Get the property name associated with the default geometry
   *     for this feature.
   * @api
   */
  getGeometryName() {
    return this.geometryName_;
  }
  /**
   * Get the feature's style. Will return what was provided to the
   * {@link module:ol/Feature~Feature#setStyle} method.
   * @return {import("./style/Style.js").StyleLike|undefined} The feature style.
   * @api
   */
  getStyle() {
    return this.style_;
  }
  /**
   * Get the feature's style function.
   * @return {import("./style/Style.js").StyleFunction|undefined} Return a function
   * representing the current style of this feature.
   * @api
   */
  getStyleFunction() {
    return this.styleFunction_;
  }
  /**
   * @private
   */
  handleGeometryChange_() {
    this.changed();
  }
  /**
   * @private
   */
  handleGeometryChanged_() {
    if (this.geometryChangeKey_) {
      unlistenByKey(this.geometryChangeKey_);
      this.geometryChangeKey_ = null;
    }
    const geometry = this.getGeometry();
    if (geometry) {
      this.geometryChangeKey_ = listen(geometry, EventType_default.CHANGE, this.handleGeometryChange_, this);
    }
    this.changed();
  }
  /**
   * Set the default geometry for the feature.  This will update the property
   * with the name returned by {@link module:ol/Feature~Feature#getGeometryName}.
   * @param {Geometry|undefined} geometry The new geometry.
   * @api
   * @observable
   */
  setGeometry(geometry) {
    this.set(this.geometryName_, geometry);
  }
  /**
   * Set the style for the feature to override the layer style.  This can be a
   * single style object, an array of styles, or a function that takes a
   * resolution and returns an array of styles. To unset the feature style, call
   * `setStyle()` without arguments or a falsey value.
   * @param {import("./style/Style.js").StyleLike} [style] Style for this feature.
   * @api
   * @fires module:ol/events/Event~BaseEvent#event:change
   */
  setStyle(style) {
    this.style_ = style;
    this.styleFunction_ = !style ? void 0 : createStyleFunction(style);
    this.changed();
  }
  /**
   * Set the feature id.  The feature id is considered stable and may be used when
   * requesting features or comparing identifiers returned from a remote source.
   * The feature id can be used with the
   * {@link module:ol/source/Vector~VectorSource#getFeatureById} method.
   * @param {number|string|undefined} id The feature id.
   * @api
   * @fires module:ol/events/Event~BaseEvent#event:change
   */
  setId(id) {
    this.id_ = id;
    this.changed();
  }
  /**
   * Set the property name to be used when getting the feature's default geometry.
   * When calling {@link module:ol/Feature~Feature#getGeometry}, the value of the property with
   * this name will be returned.
   * @param {string} name The property name of the default geometry.
   * @api
   */
  setGeometryName(name) {
    this.removeChangeListener(this.geometryName_, this.handleGeometryChanged_);
    this.geometryName_ = name;
    this.addChangeListener(this.geometryName_, this.handleGeometryChanged_);
    this.handleGeometryChanged_();
  }
};
function createStyleFunction(obj) {
  if (typeof obj === "function") {
    return obj;
  }
  let styles;
  if (Array.isArray(obj)) {
    styles = obj;
  } else {
    assert(typeof /** @type {?} */
    obj.getZIndex === "function", "Expected an `ol/style/Style` or an array of `ol/style/Style.js`");
    const style = (
      /** @type {import("./style/Style.js").default} */
      obj
    );
    styles = [style];
  }
  return function() {
    return styles;
  };
}
var Feature_default = Feature;

export {
  createStyleFunction,
  Feature_default
};
//# sourceMappingURL=chunk-K6DQBOTX.js.map
