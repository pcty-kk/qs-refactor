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
    st.deepEqual(qs.parse("a[0]=b&a[1]=c", { arrayFormat: "brackets" }), {
      a: ["b", "c"],
    });
    st.deepEqual(qs.parse("a=b,c", { arrayFormat: "brackets" }), {
      a: "b,c",
    });
    st.deepEqual(qs.parse("a=b&a=c", { arrayFormat: "brackets" }), {
      a: ["b", "c"],
    });
    st.end();
  });

  t.test("arrayFormat: indices allows only indexed arrays", function (st) {
    st.deepEqual(qs.parse("a[]=b&a[]=c", { arrayFormat: "indices" }), {
      a: ["b", "c"],
    });
    st.deepEqual(qs.parse("a[0]=b&a[1]=c", { arrayFormat: "indices" }), {
      a: ["b", "c"],
    });
    st.deepEqual(qs.parse("a=b,c", { arrayFormat: "indices" }), {
      a: "b,c",
    });
    st.deepEqual(qs.parse("a=b&a=c", { arrayFormat: "indices" }), {
      a: ["b", "c"],
    });
    st.end();
  });

  t.test(
    "arrayFormat: comma allows only comma-separated arrays",
    function (st) {
      st.deepEqual(qs.parse("a[]=b&a[]=c", { arrayFormat: "comma" }), {
        a: ["b", "c"],
      });
      st.deepEqual(qs.parse("a[0]=b&a[1]=c", { arrayFormat: "comma" }), {
        a: ["b", "c"],
      });
      st.deepEqual(qs.parse("a=b,c", { arrayFormat: "comma" }), {
        a: "b,c",
      });
      st.deepEqual(qs.parse("a=b&a=c", { arrayFormat: "comma" }), {
        a: ["b", "c"],
      });
      st.end();
    }
  );

  t.test("arrayFormat: repeat allows only repeated values", function (st) {
    st.deepEqual(qs.parse("a[]=b&a[]=c", { arrayFormat: "repeat" }), {
      a: ["b", "c"],
    });
    st.deepEqual(qs.parse("a[0]=b&a[1]=c", { arrayFormat: "repeat" }), {
      a: ["b", "c"],
    });
    st.deepEqual(qs.parse("a=b,c", { arrayFormat: "repeat" }), {
      a: "b,c",
    });
    st.deepEqual(qs.parse("a=b&a=c", { arrayFormat: "repeat" }), {
      a: ["b", "c"],
    });
    st.end();
  });

  t.test("allows enabling dot notation", function (st) {
    st.deepEqual(qs.parse("a.b=c"), { "a.b": "c" });
    st.deepEqual(qs.parse("a.b=c", { allowDots: true }), { a: { b: "c" } });
    st.end();
  });

  t.deepEqual(
    qs.parse("a[b]=c"),
    { a: { b: "c" } },
    "parses a single nested string"
  );

  t.deepEqual(
    qs.parse("a[b][c]=d"),
    { a: { b: { c: "d" } } },
    "parses a double nested string"
  );
});
