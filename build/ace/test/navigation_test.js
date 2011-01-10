define(function(d, h, i) {
  d("./mockdom");
  var g = d("../Document").Document, e = d("../Editor").Editor, f = d("./mockrenderer"), b = d("./assertions");
  h = {createTextDocument:function(a, c) {
    c = (new Array(c + 1)).join("a");
    a = (new Array(a)).join(c + "\n") + c;
    return new g(a)
  }, "test: navigate to end of file should scroll the last line into view":function() {
    var a = this.createTextDocument(200, 10);
    a = new e(new f, a);
    a.navigateFileEnd();
    var c = a.getCursorPosition();
    b.ok(a.getFirstVisibleRow() <= c.row);
    b.ok(a.getLastVisibleRow() >= c.row)
  }, "test: navigate to start of file should scroll the first row into view":function() {
    var a = this.createTextDocument(200, 10);
    a = new e(new f, a);
    a.moveCursorTo(a.getLastVisibleRow() + 20);
    a.navigateFileStart();
    b.equal(a.getFirstVisibleRow(), 0)
  }, "test: goto hidden line should scroll the line into the middle of the viewport":function() {
    var a = new e(new f, this.createTextDocument(200, 5));
    a.navigateTo(0, 0);
    a.gotoLine(101);
    b.position(a.getCursorPosition(), 100, 0);
    b.equal(a.getFirstVisibleRow(), 90);
    a.navigateTo(100, 0);
    a.gotoLine(11);
    b.position(a.getCursorPosition(), 10, 0);
    b.equal(a.getFirstVisibleRow(), 0);
    a.navigateTo(100, 0);
    a.gotoLine(6);
    b.position(a.getCursorPosition(), 5, 0);
    b.equal(0, a.getFirstVisibleRow(), 0);
    a.navigateTo(100, 0);
    a.gotoLine(1);
    b.position(a.getCursorPosition(), 0, 0);
    b.equal(a.getFirstVisibleRow(), 0);
    a.navigateTo(0, 0);
    a.gotoLine(191);
    b.position(a.getCursorPosition(), 190, 0);
    b.equal(a.getFirstVisibleRow(), 180);
    a.navigateTo(0, 0);
    a.gotoLine(196);
    b.position(a.getCursorPosition(), 195, 0);
    b.equal(a.getFirstVisibleRow(), 180)
  }, "test: goto visible line should only move the cursor and not scroll":function() {
    var a = new e(new f, this.createTextDocument(200, 5));
    a.navigateTo(0, 0);
    a.gotoLine(12);
    b.position(a.getCursorPosition(), 11, 0);
    b.equal(a.getFirstVisibleRow(), 0);
    a.navigateTo(30, 0);
    a.gotoLine(33);
    b.position(a.getCursorPosition(), 32, 0);
    b.equal(a.getFirstVisibleRow(), 30)
  }, "test: navigate from the end of a long line down to a short line and back should maintain the curser column":function() {
    var a = new e(new f, new g(["123456", "1"]));
    a.navigateTo(0, 6);
    b.position(a.getCursorPosition(), 0, 6);
    a.navigateDown();
    b.position(a.getCursorPosition(), 1, 1);
    a.navigateUp();
    b.position(a.getCursorPosition(), 0, 6)
  }, "test: reset desired column on navigate left or right":function() {
    var a = new e(new f, new g(["123456", "12"]));
    a.navigateTo(0, 6);
    b.position(a.getCursorPosition(), 0, 6);
    a.navigateDown();
    b.position(a.getCursorPosition(), 1, 2);
    a.navigateLeft();
    b.position(a.getCursorPosition(), 1, 1);
    a.navigateUp();
    b.position(a.getCursorPosition(), 0, 1)
  }};
  i.exports = d("async/test").testcase(h)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};