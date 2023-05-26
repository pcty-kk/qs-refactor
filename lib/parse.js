let utils = require("./utils");

let defaultOptions = {
  strictNullHandling: false,
  allowDots: false,
  depth: 5,
  arrayLimit: 20,
};

const normalizeParseOptions = function (opts) {
  if (!opts) {
    return defaultOptions;
  }

  return {
    strictNullHandling:
      typeof opts.strictNullHandling === "boolean"
        ? opts.strictNullHandling
        : defaultOptions.strictNullHandling,
    allowDots:
      typeof opts.allowDots === "undefined"
        ? defaultOptions.allowDots
        : opts.allowDots,
    depth:
      typeof opts.depth === "number" || opts.depth === false
        ? +opts.depth // 加号的作用是将变量转为数组，作用于Number()一样
        : defaultOptions.depth,
    arrayLimit:
      typeof opts.arrayLimit === "number"
        ? opts.arrayLimit
        : defaultOptions.arrayLimit,
  };
};

module.exports = function (str, opts) {
  let options = normalizeParseOptions(opts);
  let obj = {};

  let tempObj = parseValue(str, options);

  let keys = Object.keys(tempObj);
  keys.forEach((key) => {
    let newObj = parseKey(key, tempObj[key], options);
    obj = utils.merge(obj, newObj, options);
  });

  return utils.compact(obj);
};

const parseObject = (chain, val, options) => {
  let leaf = val;

  for (let i = chain.length - 1; i >= 0; --i) {
    let obj;
    let root = chain[i];

    if (root === "[]") {
      obj = [].concat(leaf);
    } else {
      let cleanRoot =
        root.charAt(0) === "[" && root.charAt(root.length - 1) === "]"
          ? root.slice(1, -1)
          : root;

      let index = parseInt(cleanRoot, 10);
      if (!isNaN(index) && cleanRoot !== root && index <= options.arrayLimit) {
        obj = [];
        obj[index] = leaf;
      } else {
        obj = {};
        obj[cleanRoot] = leaf;
      }
    }
    leaf = obj;
  }

  return leaf;
};

const parseKey = (givenKey, val, options) => {
  if (!givenKey) return;

  // 处理allowDots
  let key = options.allowDots
    ? givenKey.replace(/\.([^.[]+)/g, "[$1]")
    : givenKey;

  let brackets = /(\[[^[\]]*])/;
  let child = /(\[[^[\]]*])/g;
  let keys = [];

  let segment = options.depth > 0 && brackets.exec(key);
  let parent = segment ? key.slice(0, segment.index) : key;

  if (parent) keys.push(parent);

  let i = 0;
  while (
    options.depth > 0 &&
    (segment = child.exec(key)) !== null &&
    i < options.depth
  ) {
    keys.push(segment[1]);
    i++;
  }

  if (segment) {
    keys.push("[" + key.slice(segment.index) + "]");
  }

  return parseObject(keys, val, options);
};

const parseValue = (str, options) => {
  let parts = str.split("&");
  let obj = {};

  parts.forEach((item) => {
    let bracketEqualPos = item.indexOf("]=");

    let equalPos =
      bracketEqualPos === -1 ? item.indexOf("=") : bracketEqualPos + 1;

    if (equalPos === -1) {
      // 字符串中不存在 =
      obj[item] = options.strictNullHandling ? null : "";
    } else {
      // 需要解析key值
      let key = item.slice(0, equalPos);
      let val = item.slice(equalPos + 1).replace(/\+/g, " ");

      if (utils.has.call(obj, key)) {
        obj[key] = [].concat(obj[key], val);
      } else {
        obj[key] = val;
      }
    }
  });
  return obj;
};
