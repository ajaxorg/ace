define(function(e, f, g) {
  var a = e("assert");
  a.position = function(b, c, d) {
    a.equal(b.row, c);
    a.equal(b.column, d)
  };
  a.range = function(b, c, d, h, i) {
    a.position(b.start, c, d);
    a.position(b.end, h, i)
  };
  a.notOk = function(b) {
    a.equal(b, false)
  };
  f.jsonEquals = function(b, c) {
    a.equal(JSON.stringify(b), JSON.stringify(c))
  };
  g.exports = a
});