// qs.parse("0=foo"), { 0: "foo" }

module.exports = function (str, options) {
  let parts = str.split("&");
  let obj = {};

  for (let item of parts) {
    let bracketEqualPos = item.indexOf("]=");

    let equalPos =
      bracketEqualPos === -1 ? item.indexOf("=") : bracketEqualPos + 1;

    if (bracketEqualPos === -1 && equalPos !== -1) {
      // 字符串中不存在 ]= 且存在 = ，无需解析key值
      let key = item.slice(0, equalPos);
      let val = item.slice(equalPos + 1).replace(/\+/g, " ");

      obj[key] = val;
    } else if (equalPos === -1) {
      // 字符串中不存在 =
      if (options?.strictNullHandling) {
        obj[item] = null;
      } else {
        obj[item] = "";
      }
    } else {
      // 需要解析key值
      let key = item.slice(0, equalPos);
      let val = item.slice(equalPos + 1).replace(/\+/g, " ");
      parseKey(key, val, obj);
    }
  }
  return obj;
};

const parseKey = (key, val, obj) => {
  let brackets = /\[[^[\]]*]/;
  let child = /\[[^[\]]*]/g;

  let segment = brackets.exec(key);

  // 没有中括号
  if (!segment) {
    return key;
  }

  let tKey = key.slice(0, segment.index);
  let tVal = key.slice(segment.index + 1, -1);

  obj[tKey] = { [tVal]: val };
  // return { [tKey]: { [tVal]: val } };
};
