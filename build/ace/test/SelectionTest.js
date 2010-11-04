/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/Document"], function(c) {
  TestCase("SelectionTest", {createTextDocument:function(a, b) {
    b = (new Array(b + 1)).join("a");
    a = (new Array(a)).join(b + "\n") + b;
    return new c(a)
  }, "test: move cursor to end of file should place the cursor on last row and column":function() {
    var a = this.createTextDocument(200, 10).getSelection();
    a.moveCursorFileEnd();
    assertPosition(199, 10, a.getCursor())
  }, "test: moveCursor to start of file should place the cursor on the first row and column":function() {
    var a = this.createTextDocument(200, 10).getSelection();
    a.moveCursorFileStart();
    assertPosition(0, 0, a.getCursor())
  }, "test: move selection lead to end of file":function() {
    var a = this.createTextDocument(200, 10).getSelection();
    a.moveCursorTo(100, 5);
    a.selectFileEnd();
    a = a.getRange();
    assertPosition(100, 5, a.start);
    assertPosition(199, 10, a.end)
  }, "test: move selection lead to start of file":function() {
    var a = this.createTextDocument(200, 10).getSelection();
    a.moveCursorTo(100, 5);
    a.selectFileStart();
    a = a.getRange();
    assertPosition(0, 0, a.start);
    assertPosition(100, 5, a.end)
  }, "test: move cursor word right":function() {
    var a = (new c("ab\n Juhu Kinners (abc, 12)\n cde")).getSelection();
    a.moveCursorDown();
    assertPosition(1, 0, a.getCursor());
    a.moveCursorWordRight();
    assertPosition(1, 1, a.getCursor());
    a.moveCursorWordRight();
    assertPosition(1, 5, a.getCursor());
    a.moveCursorWordRight();
    assertPosition(1, 6, a.getCursor());
    a.moveCursorWordRight();
    assertPosition(1, 13, a.getCursor());
    a.moveCursorWordRight();
    assertPosition(1, 15, a.getCursor());
    a.moveCursorWordRight();
    assertPosition(1, 18, a.getCursor());
    a.moveCursorWordRight();
    assertPosition(1, 20, a.getCursor());
    a.moveCursorWordRight();
    assertPosition(1, 22, a.getCursor());
    a.moveCursorWordRight();
    assertPosition(1, 23, a.getCursor());
    a.moveCursorWordRight();
    assertPosition(2, 0, a.getCursor())
  }, "test: select word right if cursor in word":function() {
    var a = (new c("Juhu Kinners")).getSelection();
    a.moveCursorTo(0, 2);
    a.moveCursorWordRight();
    assertPosition(0, 4, a.getCursor())
  }, "test: moveCursor word left":function() {
    var a = (new c("ab\n Juhu Kinners (abc, 12)\n cde")).getSelection();
    a.moveCursorDown();
    a.moveCursorLineEnd();
    assertPosition(1, 23, a.getCursor());
    a.moveCursorWordLeft();
    assertPosition(1, 22, a.getCursor());
    a.moveCursorWordLeft();
    assertPosition(1, 20, a.getCursor());
    a.moveCursorWordLeft();
    assertPosition(1, 18, a.getCursor());
    a.moveCursorWordLeft();
    assertPosition(1, 15, a.getCursor());
    a.moveCursorWordLeft();
    assertPosition(1, 13, a.getCursor());
    a.moveCursorWordLeft();
    assertPosition(1, 6, a.getCursor());
    a.moveCursorWordLeft();
    assertPosition(1, 5, a.getCursor());
    a.moveCursorWordLeft();
    assertPosition(1, 1, a.getCursor());
    a.moveCursorWordLeft();
    assertPosition(1, 0, a.getCursor());
    a.moveCursorWordLeft();
    assertPosition(0, 2, a.getCursor())
  }, "test: select word left if cursor in word":function() {
    var a = (new c("Juhu Kinners")).getSelection();
    a.moveCursorTo(0, 8);
    a.moveCursorWordLeft();
    assertPosition(0, 5, a.getCursor())
  }, "test: select word right and select":function() {
    var a = (new c("Juhu Kinners")).getSelection();
    a.moveCursorTo(0, 0);
    a.selectWordRight();
    a = a.getRange();
    assertPosition(0, 0, a.start);
    assertPosition(0, 4, a.end)
  }, "test: select word left and select":function() {
    var a = (new c("Juhu Kinners")).getSelection();
    a.moveCursorTo(0, 3);
    a.selectWordLeft();
    a = a.getRange();
    assertPosition(0, 0, a.start);
    assertPosition(0, 3, a.end)
  }, "test: select word with cursor in word should select the word":function() {
    var a = (new c("Juhu Kinners 123")).getSelection();
    a.moveCursorTo(0, 8);
    a.selectWord();
    a = a.getRange();
    assertPosition(0, 5, a.start);
    assertPosition(0, 12, a.end)
  }, "test: select word with cursor betwen white space and word should select the word":function() {
    var a = (new c("Juhu Kinners")).getSelection();
    a.moveCursorTo(0, 4);
    a.selectWord();
    var b = a.getRange();
    assertPosition(0, 0, b.start);
    assertPosition(0, 4, b.end);
    a.moveCursorTo(0, 5);
    a.selectWord();
    b = a.getRange();
    assertPosition(0, 5, b.start);
    assertPosition(0, 12, b.end)
  }, "test: select word with cursor in white space should select white space":function() {
    var a = (new c("Juhu  Kinners")).getSelection();
    a.moveCursorTo(0, 5);
    a.selectWord();
    a = a.getRange();
    assertPosition(0, 4, a.start);
    assertPosition(0, 6, a.end)
  }, "test: moving cursor should fire a 'changeCursor' event":function() {
    var a = (new c("Juhu  Kinners")).getSelection();
    a.moveCursorTo(0, 5);
    var b = false;
    a.addEventListener("changeCursor", function() {
      b = true
    });
    a.moveCursorTo(0, 6);
    assertTrue(b)
  }, "test: calling setCursor with the same position should not fire an event":function() {
    var a = (new c("Juhu  Kinners")).getSelection();
    a.moveCursorTo(0, 5);
    var b = false;
    a.addEventListener("changeCursor", function() {
      b = true
    });
    a.moveCursorTo(0, 5);
    assertFalse(b)
  }})
});