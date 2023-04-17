// qs.parse("0=foo"), { 0: "foo" }


module.exports = function(str) {

    let reg = /(.+)=(.+)/
    let matchResult = str.match(reg);
    let key = matchResult[1];
    let value = matchResult[2];

    let obj = {};
    obj[key] = value;

    return obj;
}