var test = require("tape");
var qs = require("../lib");

test("parse()", function (t) {
  t.test("parse a simple string", function (st) {
    st.deepEqual(qs.parse("0=foo"), { 0: "foo" });
    st.deepEqual(qs.parse("foo=c++"), { foo: "c  " });
    st.deepEqual(qs.parse("a[>=]=23"), { a: { ">=": "23" } });
    st.deepEqual(qs.parse("a[<=>]==23"), { a: { "<=>": "=23" } });
    st.deepEqual(qs.parse("a[==]=23"), { a: { "==": "23" } });
    st.deepEqual(qs.parse("foo", { strictNullHandling: true }), {
      foo: null,
    });
    st.deepEqual(qs.parse("foo"), { foo: "" });
    st.deepEqual(qs.parse("foo="), { foo: "" });
    st.deepEqual(qs.parse("foo=bar"), { foo: "bar" });
    st.deepEqual(qs.parse(" foo = bar = baz "), { " foo ": " bar = baz " });
    st.deepEqual(qs.parse("foo=bar=baz"), { foo: "bar=baz" });
    st.deepEqual(qs.parse("foo=bar&bar=baz"), { foo: "bar", bar: "baz" });
    st.deepEqual(qs.parse("foo2=bar2&baz2="), { foo2: "bar2", baz2: "" });
    st.deepEqual(qs.parse("foo=bar&baz", { strictNullHandling: true }), {
      foo: "bar",
      baz: null,
    });
    st.deepEqual(qs.parse("foo=bar&baz"), { foo: "bar", baz: "" });
    st.deepEqual(qs.parse("cht=p3&chd=t:60,40&chs=250x100&chl=Hello|World"), {
      cht: "p3",
      chd: "t:60,40",
      chs: "250x100",
      chl: "Hello|World",
    });
    st.end();
  });

  t.test("arrayFormat: brackets only allows explicit arrays", function (st) {
    st.deepEqual(qs.parse("a[]=b&a[]=c", { arrayFormat: "brackets" }), {
      a: ["b", "c"],
    });
    st.end();
  });
});
