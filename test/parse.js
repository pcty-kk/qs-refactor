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
  t.deepEqual(
    qs.parse("a[b][c][d][e][f][g][h]=i"),
    { a: { b: { c: { d: { e: { f: { "[g][h]": "i" } } } } } } },
    "defaults to a depth of 5"
  );
  t.test("only parses one level when depth = 1", function (st) {
    st.deepEqual(qs.parse("a[b][c]=d", { depth: 1 }), {
      a: { b: { "[c]": "d" } },
    });
    st.deepEqual(qs.parse("a[b][c][d]=e", { depth: 1 }), {
      a: { b: { "[c][d]": "e" } },
    });
    st.end();
  });

  t.test("uses original key when depth = 0", function (st) {
    st.deepEqual(qs.parse("a[0]=b&a[1]=c", { depth: 0 }), {
      "a[0]": "b",
      "a[1]": "c",
    });
    st.deepEqual(qs.parse("a[0][0]=b&a[0][1]=c&a[1]=d&e=2", { depth: 0 }), {
      "a[0][0]": "b",
      "a[0][1]": "c",
      "a[1]": "d",
      e: "2",
    });
    st.end();
  });

  t.test("uses original key when depth = false", function (st) {
    st.deepEqual(qs.parse("a[0]=b&a[1]=c", { depth: false }), {
      "a[0]": "b",
      "a[1]": "c",
    });
    st.deepEqual(qs.parse("a[0][0]=b&a[0][1]=c&a[1]=d&e=2", { depth: false }), {
      "a[0][0]": "b",
      "a[0][1]": "c",
      "a[1]": "d",
      e: "2",
    });
    st.end();
  });

  t.deepEqual(qs.parse("a=b&a=c"), { a: ["b", "c"] }, "parses a simple array");

  t.test("parses an explicit array", function (st) {
    st.deepEqual(qs.parse("a[]=b"), { a: ["b"] });
    st.deepEqual(qs.parse("a[]=b&a[]=c"), { a: ["b", "c"] });
    st.deepEqual(qs.parse("a[]=b&a[]=c&a[]=d"), { a: ["b", "c", "d"] });
    st.end();
  });
  t.test(
    "parses a mix of simple and explicit arrays",

    function (st) {
      st.deepEqual(qs.parse("a=b&a[]=c"), { a: ["b", "c"] });
      st.deepEqual(qs.parse("a[]=b&a=c"), { a: ["b", "c"] });
      st.deepEqual(qs.parse("a[0]=b&a=c"), { a: ["b", "c"] });
      st.deepEqual(qs.parse("a=b&a[0]=c"), { a: ["b", "c"] });

      st.deepEqual(qs.parse("a[1]=b&a=c", { arrayLimit: 20 }), {
        a: ["b", "c"],
      });
      st.deepEqual(qs.parse("a[]=b&a=c", { arrayLimit: 0 }), {
        a: ["b", "c"],
      });
      st.deepEqual(qs.parse("a[]=b&a=c"), { a: ["b", "c"] });

      st.deepEqual(qs.parse("a=b&a[1]=c", { arrayLimit: 20 }), {
        a: ["b", "c"],
      });
      st.deepEqual(qs.parse("a=b&a[]=c", { arrayLimit: 0 }), {
        a: ["b", "c"],
      });
      st.deepEqual(qs.parse("a=b&a[]=c"), { a: ["b", "c"] });

      st.end();
    }
  );

  t.test("parses a nested array", function (st) {
    st.deepEqual(qs.parse("a[b][]=c&a[b][]=d"), { a: { b: ["c", "d"] } });
    st.deepEqual(qs.parse("a[>=]=25"), { a: { ">=": "25" } });
    st.end();
  });

  t.test("allows to specify array indices", function (st) {
    st.deepEqual(qs.parse("a[1]=c&a[0]=b&a[2]=d"), { a: ["b", "c", "d"] });
    st.deepEqual(qs.parse("a[1]=c&a[0]=b"), { a: ["b", "c"] });
    st.deepEqual(qs.parse("a[1]=c", { arrayLimit: 20 }), { a: ["c"] });
    st.deepEqual(qs.parse("a[1]=c", { arrayLimit: 0 }), { a: { 1: "c" } });
    st.deepEqual(qs.parse("a[1]=c"), { a: ["c"] });
    st.end();
  });
});
