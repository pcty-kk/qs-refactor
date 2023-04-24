// qs.parse("0=foo"), { 0: "foo" }

module.exports = function (str) {
  let bracketEqualPos = str.indexOf("]=");

  let equalPos =
    bracketEqualPos === -1 ? str.indexOf("=") : bracketEqualPos + 1;

  if (bracketEqualPos === -1) {
    // 字符串中不存在 ]=，无需解析key值
    let key = str.slice(0, equalPos);
    let val = str.slice(equalPos + 1).replace(/\+/g, " ");
    return { [key]: val };
  } else {
    // 需要解析key值
    let key = str.slice(0, equalPos);
    let val = str.slice(equalPos + 1).replace(/\+/g, " ");
    return parseKey(key, val);
  }
};

const parseKey = (key, val) => {
  let brackets = /\[[^[\]]*]/;
  let child = /\[[^[\]]*]/g;

  let segment = brackets.exec(key);

  // 没有中括号
  if (!segment) {
    return key;
  }

  let tKey = key.slice(0, segment.index);
  let tVal = key.slice(segment.index + 1, -1);

  return { [tKey]: { [tVal]: val } };
};
