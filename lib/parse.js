// qs.parse("0=foo"), { 0: "foo" }

const has = Object.prototype.hasOwnProperty;

let defaultOptions = {
  strictNullHandling: false,
  allowDots: false,
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
  };
};

module.exports = function (str, opts) {
  let options = normalizeParseOptions(opts);
  let parts = str.split("&");
  let obj = {};

  for (let item of parts) {
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
      parseKey(key, val, obj, options);
    }
  }
  return obj;
};

const parseKey = (key, val, obj, options) => {
  let brackets = /\[[^[\]]*]/;
  let child = /\[[^[\]]*]/g;

  let segment = brackets.exec(key);

  // 没有中括号
  if (!segment && !options.allowDots) {
    if (has.call(obj, key)) {
      obj[key] = [].concat(obj[key], val);
    } else {
      obj[key] = val;
    }
    return;
  }

  let tKey, tVal;
  if (options.allowDots) {
    let keyArray = key.split(".");
    tKey = keyArray[0];
    tVal = keyArray[1];
  } else {
    tKey = key.slice(0, segment.index);
    tVal = key.slice(segment.index + 1, -1);
  }

  let index = parseInt(tVal, 10);
  if (!tVal) {
    // 括号内容为空 数组语法
    obj[tKey] = obj[tKey] ? obj[tKey].concat([val]) : [val];
  } else {
    if (!isNaN(index)) {
      obj[tKey] = obj[tKey] ? obj[tKey] : [];
      obj[tKey][index] = val;
    } else {
      if (has.call(obj, tKey)) {
        obj[tKey] = [].concat(obj[tKey], val);
      } else {
        obj[tKey] = { [tVal]: val };
      }
    }
  }
};
