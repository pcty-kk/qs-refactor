var test = require("tape");
var qs = require("../lib");

test("parse()", function (t) {
  t.test("parse a simple string", function (st) {
    st.deepEqual(qs.parse("0=foo"), { 0: "foo" });
    st.deepEqual(qs.parse("foo=c++"), { foo: "c  " });
    st.deepEqual(qs.parse("a[>=]=23"), { a: { ">=": "23" } });
    st.deepEqual(qs.parse("a[<=>]==23"), { a: { "<=>": "=23" } });
    st.deepEqual(qs.parse("a[==]=23"), { a: { "==": "23" } });
    st.end();
  });
});
