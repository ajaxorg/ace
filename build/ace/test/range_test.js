define(function(e, f, g) {
  var c = e("../range").Range, b = e("./assertions");
  f = {"test: create range":function() {
    var a = new c(1, 2, 3, 4);
    b.equal(a.start.row, 1);
    b.equal(a.start.column, 2);
    b.equal(a.end.row, 3);
    b.equal(a.end.column, 4)
  }, "test: create from points":function() {
    var a = c.fromPoints({row:1, column:2}, {row:3, column:4});
    b.equal(a.start.row, 1);
    b.equal(a.start.column, 2);
    b.equal(a.end.row, 3);
    b.equal(a.end.column, 4)
  }, "test: clip to rows":function() {
    b.range((new c(0, 20, 100, 30)).clipRows(10, 30), 10, 0, 31, 0);
    b.range((new c(0, 20, 30, 10)).clipRows(10, 30), 10, 0, 30, 10);
    var a = new c(0, 20, 3, 10);
    a = a.clipRows(10, 30);
    b.ok(a.isEmpty());
    b.range(a, 10, 0, 10, 0)
  }, "test: isEmpty":function() {
    var a = new c(1, 2, 1, 2);
    b.ok(a.isEmpty());
    a = new c(1, 2, 1, 6);
    b.notOk(a.isEmpty())
  }, "test: is multi line":function() {
    var a = new c(1, 2, 1, 6);
    b.notOk(a.isMultiLine());
    a = new c(1, 2, 2, 6);
    b.ok(a.isMultiLine())
  }, "test: clone":function() {
    var a = new c(1, 2, 3, 4), d = a.clone();
    b.position(d.start, 1, 2);
    b.position(d.end, 3, 4);
    d.start.column = 20;
    b.position(a.start, 1, 2);
    d.end.column = 20;
    b.position(a.end, 3, 4)
  }, "test: contains for multi line ranges":function() {
    var a = new c(1, 10, 5, 20);
    b.ok(a.contains(1, 10));
    b.ok(a.contains(2, 0));
    b.ok(a.contains(3, 100));
    b.ok(a.contains(5, 19));
    b.ok(a.contains(5, 20));
    b.notOk(a.contains(1, 9));
    b.notOk(a.contains(0, 0));
    b.notOk(a.contains(5, 21))
  }, "test: contains for single line ranges":function() {
    var a = new c(1, 10, 1, 20);
    b.ok(a.contains(1, 10));
    b.ok(a.contains(1, 15));
    b.ok(a.contains(1, 20));
    b.notOk(a.contains(0, 9));
    b.notOk(a.contains(2, 9));
    b.notOk(a.contains(1, 9));
    b.notOk(a.contains(1, 21))
  }, "test: extend range":function() {
    var a = new c(2, 10, 2, 30);
    a = a.extend(2, 5);
    b.range(a, 2, 5, 2, 30);
    a = a.extend(2, 35);
    b.range(a, 2, 5, 2, 35);
    a = a.extend(2, 15);
    b.range(a, 2, 5, 2, 35);
    a = a.extend(1, 4);
    b.range(a, 1, 4, 2, 35);
    a = a.extend(6, 10);
    b.range(a, 1, 4, 6, 10)
  }, "test: collapse rows":function() {
    var a = new c(0, 2, 1, 2);
    b.range(a.collapseRows(), 0, 0, 1, 0);
    a = new c(2, 2, 3, 1);
    b.range(a.collapseRows(), 2, 0, 3, 0);
    a = new c(2, 2, 3, 0);
    b.range(a.collapseRows(), 2, 0, 2, 0);
    a = new c(2, 0, 2, 0);
    b.range(a.collapseRows(), 2, 0, 2, 0)
  }};
  g.exports = e("async/test").testcase(f)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};