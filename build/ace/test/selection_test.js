define(function(e, f, g) {
  var d = e("../document").Document, b = e("./assertions");
  f = {createTextDocument:function(a, c) {
    c = (new Array(c + 1)).join("a");
    a = (new Array(a)).join(c + "\n") + c;
    return new d(a)
  }, "test: move cursor to end of file should place the cursor on last row and column":function() {
    var a = this.createTextDocument(200, 10).getSelection();
    a.moveCursorFileEnd();
    b.position(a.getCursor(), 199, 10)
  }, "test: moveCursor to start of file should place the cursor on the first row and column":function() {
    var a = this.createTextDocument(200, 10).getSelection();
    a.moveCursorFileStart();
    b.position(a.getCursor(), 0, 0)
  }, "test: move selection lead to end of file":function() {
    var a = this.createTextDocument(200, 10).getSelection();
    a.moveCursorTo(100, 5);
    a.selectFileEnd();
    a = a.getRange();
    b.position(a.start, 100, 5);
    b.position(a.end, 199, 10)
  }, "test: move selection lead to start of file":function() {
    var a = this.createTextDocument(200, 10).getSelection();
    a.moveCursorTo(100, 5);
    a.selectFileStart();
    a = a.getRange();
    b.position(a.start, 0, 0);
    b.position(a.end, 100, 5)
  }, "test: move cursor word right":function() {
    var a = (new d("ab\n Juhu Kinners (abc, 12)\n cde")).getSelection();
    a.moveCursorDown();
    b.position(a.getCursor(), 1, 0);
    a.moveCursorWordRight();
    b.position(a.getCursor(), 1, 1);
    a.moveCursorWordRight();
    b.position(a.getCursor(), 1, 5);
    a.moveCursorWordRight();
    b.position(a.getCursor(), 1, 6);
    a.moveCursorWordRight();
    b.position(a.getCursor(), 1, 13);
    a.moveCursorWordRight();
    b.position(a.getCursor(), 1, 15);
    a.moveCursorWordRight();
    b.position(a.getCursor(), 1, 18);
    a.moveCursorWordRight();
    b.position(a.getCursor(), 1, 20);
    a.moveCursorWordRight();
    b.position(a.getCursor(), 1, 22);
    a.moveCursorWordRight();
    b.position(a.getCursor(), 1, 23);
    a.moveCursorWordRight();
    b.position(a.getCursor(), 2, 0)
  }, "test: select word right if cursor in word":function() {
    var a = (new d("Juhu Kinners")).getSelection();
    a.moveCursorTo(0, 2);
    a.moveCursorWordRight();
    b.position(a.getCursor(), 0, 4)
  }, "test: moveCursor word left":function() {
    var a = (new d("ab\n Juhu Kinners (abc, 12)\n cde")).getSelection();
    a.moveCursorDown();
    a.moveCursorLineEnd();
    b.position(a.getCursor(), 1, 23);
    a.moveCursorWordLeft();
    b.position(a.getCursor(), 1, 22);
    a.moveCursorWordLeft();
    b.position(a.getCursor(), 1, 20);
    a.moveCursorWordLeft();
    b.position(a.getCursor(), 1, 18);
    a.moveCursorWordLeft();
    b.position(a.getCursor(), 1, 15);
    a.moveCursorWordLeft();
    b.position(a.getCursor(), 1, 13);
    a.moveCursorWordLeft();
    b.position(a.getCursor(), 1, 6);
    a.moveCursorWordLeft();
    b.position(a.getCursor(), 1, 5);
    a.moveCursorWordLeft();
    b.position(a.getCursor(), 1, 1);
    a.moveCursorWordLeft();
    b.position(a.getCursor(), 1, 0);
    a.moveCursorWordLeft();
    b.position(a.getCursor(), 0, 2)
  }, "test: select word left if cursor in word":function() {
    var a = (new d("Juhu Kinners")).getSelection();
    a.moveCursorTo(0, 8);
    a.moveCursorWordLeft();
    b.position(a.getCursor(), 0, 5)
  }, "test: select word right and select":function() {
    var a = (new d("Juhu Kinners")).getSelection();
    a.moveCursorTo(0, 0);
    a.selectWordRight();
    a = a.getRange();
    b.position(a.start, 0, 0);
    b.position(a.end, 0, 4)
  }, "test: select word left and select":function() {
    var a = (new d("Juhu Kinners")).getSelection();
    a.moveCursorTo(0, 3);
    a.selectWordLeft();
    a = a.getRange();
    b.position(a.start, 0, 0);
    b.position(a.end, 0, 3)
  }, "test: select word with cursor in word should select the word":function() {
    var a = (new d("Juhu Kinners 123")).getSelection();
    a.moveCursorTo(0, 8);
    a.selectWord();
    a = a.getRange();
    b.position(a.start, 0, 5);
    b.position(a.end, 0, 12)
  }, "test: select word with cursor betwen white space and word should select the word":function() {
    var a = (new d("Juhu Kinners")).getSelection();
    a.moveCursorTo(0, 4);
    a.selectWord();
    var c = a.getRange();
    b.position(c.start, 0, 0);
    b.position(c.end, 0, 4);
    a.moveCursorTo(0, 5);
    a.selectWord();
    c = a.getRange();
    b.position(c.start, 0, 5);
    b.position(c.end, 0, 12)
  }, "test: select word with cursor in white space should select white space":function() {
    var a = (new d("Juhu  Kinners")).getSelection();
    a.moveCursorTo(0, 5);
    a.selectWord();
    a = a.getRange();
    b.position(a.start, 0, 4);
    b.position(a.end, 0, 6)
  }, "test: moving cursor should fire a 'changeCursor' event":function() {
    var a = (new d("Juhu  Kinners")).getSelection();
    a.moveCursorTo(0, 5);
    var c = false;
    a.addEventListener("changeCursor", function() {
      c = true
    });
    a.moveCursorTo(0, 6);
    b.ok(c)
  }, "test: calling setCursor with the same position should not fire an event":function() {
    var a = (new d("Juhu  Kinners")).getSelection();
    a.moveCursorTo(0, 5);
    var c = false;
    a.addEventListener("changeCursor", function() {
      c = true
    });
    a.moveCursorTo(0, 5);
    b.notOk(c)
  }};
  g.exports = e("async/test").testcase(f)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};