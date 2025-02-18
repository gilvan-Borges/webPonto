// node_modules/ol/obj.js
function clear(object) {
  for (const property in object) {
    delete object[property];
  }
}
function isEmpty(object) {
  let property;
  for (property in object) {
    return false;
  }
  return !property;
}

export {
  clear,
  isEmpty
};
//# sourceMappingURL=chunk-PEWTSS5T.js.map
