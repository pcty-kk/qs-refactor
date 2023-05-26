const has = Object.prototype.hasOwnProperty;

const merge = (target, source, options) => {
  if (typeof target !== "object") {
    return [target].concat(source);
  }

  if (Array.isArray(target) && !Array.isArray(source)) {
    return [...target].concat(source);
  }
  let mergeTarget = target;

  return Object.keys(source).reduce((pre, key) => {
    let value = source[key];
    if (has.call(pre, key)) {
      pre[key] = merge(pre[key], value, options);
    } else {
      pre[key] = value;
    }
    return pre;
  }, mergeTarget);
};

const compact = (obj) => {
  let keys = Object.keys(obj);
  keys.forEach((key) => {
    if (Array.isArray(obj[key])) {
      let result = obj[key].filter((item) => item);
      obj[key] = result;
    }
  });
  return obj;
};

module.exports = {
  has,
  merge,
  compact,
};
