define(function(d, e, f) {
  d("./mockdom");
  var g = d("../document").Document, h = d("../virtual_renderer").VirtualRenderer, b = d("./assertions");
  e = {"test: screen2text the column should be rounded to the next character edge":function() {
    var c = document.createElement("div");
    c.style.left = "0px";
    c.style.top = "0px";
    c.style.width = "100px";
    c.style.height = "100px";
    document.body.style.margin = "0px";
    document.body.style.padding = "0px";
    document.body.appendChild(c);
    var a = new h(c);
    a.setDocument(new g("1234"));
    a.characterWidth = 10;
    a.lineHeight = 15;
    b.position(a.screenToTextCoordinates(0, 0), 0, 0);
    b.position(a.screenToTextCoordinates(4, 0), 0, 0);
    b.position(a.screenToTextCoordinates(5, 0), 0, 1);
    b.position(a.screenToTextCoordinates(9, 0), 0, 1);
    b.position(a.screenToTextCoordinates(10, 0), 0, 1);
    b.position(a.screenToTextCoordinates(14, 0), 0, 1);
    b.position(a.screenToTextCoordinates(15, 0), 0, 2);
    document.body.removeChild(c)
  }};
  f.exports = d("async/test").testcase(e)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};