/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/Document", "ace/Editor", "ace/test/MockRenderer"], function(e, c, d) {
  TestCase("NavigationTest", {createTextDocument:function(a, b) {
    b = (new Array(b + 1)).join("a");
    a = (new Array(a)).join(b + "\n") + b;
    return new e(a)
  }, "test: navigate to end of file should scroll the last line into view":function() {
    var a = this.createTextDocument(200, 10);
    a = new c(new d, a);
    a.navigateFileEnd();
    var b = a.getCursorPosition();
    assertTrue(a.getFirstVisibleRow() <= b.row);
    assertTrue(a.getLastVisibleRow() >= b.row)
  }, "test: navigate to start of file should scroll the first row into view":function() {
    var a = this.createTextDocument(200, 10);
    a = new c(new d, a);
    a.moveCursorTo(a.getLastVisibleRow() + 20);
    a.navigateFileStart();
    assertEquals(0, a.getFirstVisibleRow())
  }, "test: goto hidden line should scroll the line into the middle of the viewport":function() {
    var a = new c(new d, this.createTextDocument(200, 5));
    a.navigateTo(0, 0);
    a.gotoLine(101);
    assertPosition(100, 0, a.getCursorPosition());
    assertEquals(90, a.getFirstVisibleRow());
    a.navigateTo(100, 0);
    a.gotoLine(11);
    assertPosition(10, 0, a.getCursorPosition());
    assertEquals(0, a.getFirstVisibleRow());
    a.navigateTo(100, 0);
    a.gotoLine(6);
    assertPosition(5, 0, a.getCursorPosition());
    assertEquals(0, a.getFirstVisibleRow());
    a.navigateTo(100, 0);
    a.gotoLine(1);
    assertPosition(0, 0, a.getCursorPosition());
    assertEquals(0, a.getFirstVisibleRow());
    a.navigateTo(0, 0);
    a.gotoLine(191);
    assertPosition(190, 0, a.getCursorPosition());
    assertEquals(180, a.getFirstVisibleRow());
    a.navigateTo(0, 0);
    a.gotoLine(196);
    assertPosition(195, 0, a.getCursorPosition());
    assertEquals(180, a.getFirstVisibleRow())
  }, "test: goto visible line should only move the cursor and not scroll":function() {
    var a = new c(new d, this.createTextDocument(200, 5));
    a.navigateTo(0, 0);
    a.gotoLine(12);
    assertPosition(11, 0, a.getCursorPosition());
    assertEquals(0, a.getFirstVisibleRow());
    a.navigateTo(30, 0);
    a.gotoLine(33);
    assertPosition(32, 0, a.getCursorPosition());
    assertEquals(30, a.getFirstVisibleRow())
  }, "test: navigate from the end of a long line down to a short line and back should maintain the curser column":function() {
    var a = new c(new d, new e(["123456", "1"]));
    a.navigateTo(0, 6);
    assertPosition(0, 6, a.getCursorPosition());
    a.navigateDown();
    assertPosition(1, 1, a.getCursorPosition());
    a.navigateUp();
    assertPosition(0, 6, a.getCursorPosition())
  }, "test: reset desired column on navigate left or right":function() {
    var a = new c(new d, new e(["123456", "12"]));
    a.navigateTo(0, 6);
    assertPosition(0, 6, a.getCursorPosition());
    a.navigateDown();
    assertPosition(1, 2, a.getCursorPosition());
    a.navigateLeft();
    assertPosition(1, 1, a.getCursorPosition());
    a.navigateUp();
    assertPosition(0, 1, a.getCursorPosition())
  }})
});