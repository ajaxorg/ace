/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/Document", "ace/UndoManager", "ace/Editor", "ace/test/MockRenderer"], function(b, h, i, j) {
  new TestCase("TextDocumentTest", {"test: find matching opening bracket":function() {
    var a = new b(["(()(", "())))"]);
    assertPosition(0, 1, a.findMatchingBracket({row:0, column:3}));
    assertPosition(1, 0, a.findMatchingBracket({row:1, column:2}));
    assertPosition(0, 3, a.findMatchingBracket({row:1, column:3}));
    assertPosition(0, 0, a.findMatchingBracket({row:1, column:4}));
    assertEquals(null, a.findMatchingBracket({row:1, column:5}))
  }, "test: find matching closing bracket":function() {
    var a = new b(["(()(", "())))"]);
    assertPosition(1, 1, a.findMatchingBracket({row:1, column:1}));
    assertPosition(1, 1, a.findMatchingBracket({row:1, column:1}));
    assertPosition(1, 2, a.findMatchingBracket({row:0, column:4}));
    assertPosition(0, 2, a.findMatchingBracket({row:0, column:2}));
    assertPosition(1, 3, a.findMatchingBracket({row:0, column:1}));
    assertEquals(null, a.findMatchingBracket({row:0, column:0}))
  }, "test: match different bracket types":function() {
    var a = new b(["({[", ")]}"]);
    assertPosition(1, 0, a.findMatchingBracket({row:0, column:1}));
    assertPosition(1, 2, a.findMatchingBracket({row:0, column:2}));
    assertPosition(1, 1, a.findMatchingBracket({row:0, column:3}));
    assertPosition(0, 0, a.findMatchingBracket({row:1, column:1}));
    assertPosition(0, 2, a.findMatchingBracket({row:1, column:2}));
    assertPosition(0, 1, a.findMatchingBracket({row:1, column:3}))
  }, "test: move lines down":function() {
    var a = new b(["1", "2", "3", "4"]);
    a.moveLinesDown(0, 1);
    assertEquals("3\n1\n2\n4", a.toString());
    a.moveLinesDown(1, 2);
    assertEquals("3\n4\n1\n2", a.toString());
    a.moveLinesDown(2, 3);
    assertEquals("3\n4\n1\n2", a.toString());
    a.moveLinesDown(2, 2);
    assertEquals("3\n4\n2\n1", a.toString())
  }, "test: move lines up":function() {
    var a = new b(["1", "2", "3", "4"]);
    a.moveLinesUp(2, 3);
    assertEquals("1\n3\n4\n2", a.toString());
    a.moveLinesUp(1, 2);
    assertEquals("3\n4\n1\n2", a.toString());
    a.moveLinesUp(0, 1);
    assertEquals("3\n4\n1\n2", a.toString());
    a.moveLinesUp(2, 2);
    assertEquals("3\n1\n4\n2", a.toString())
  }, "test: duplicate lines":function() {
    var a = new b(["1", "2", "3", "4"]);
    a.duplicateLines(1, 2);
    assertEquals("1\n2\n3\n2\n3\n4", a.toString())
  }, "test: duplicate last line":function() {
    var a = new b(["1", "2", "3"]);
    a.duplicateLines(2, 2);
    assertEquals("1\n2\n3\n3", a.toString())
  }, "test: duplicate first line":function() {
    var a = new b(["1", "2", "3"]);
    a.duplicateLines(0, 0);
    assertEquals("1\n1\n2\n3", a.toString())
  }, "test: should handle unix style new lines":function() {
    var a = new b(["1", "2", "3"]);
    assertEquals("1\n2\n3", a.toString())
  }, "test: should handle windows style new lines":function() {
    var a = new b("1\r\n2\r\n3");
    a.setNewLineMode("unix");
    assertEquals("1\n2\n3", a.toString())
  }, "test: set new line mode to 'windows' should use '\r\n' as new lines":function() {
    var a = new b("1\n2\n3");
    a.setNewLineMode("windows");
    assertEquals("1\r\n2\r\n3", a.toString())
  }, "test: set new line mode to 'unix' should use '\n' as new lines":function() {
    var a = new b("1\r\n2\r\n3");
    a.setNewLineMode("unix");
    assertEquals("1\n2\n3", a.toString())
  }, "test: set new line mode to 'auto' should use detect the incoming nl type":function() {
    var a = new b("1\n2\n3");
    a.setNewLineMode("auto");
    assertEquals("1\n2\n3", a.toString());
    a = new b("1\r\n2\r\n3");
    a.setNewLineMode("auto");
    assertEquals("1\r\n2\r\n3", a.toString());
    a.replace(new Range(0, 0, 2, 1), "4\n5\n6");
    assertEquals("4\n5\n6", a.toString())
  }, "test: undo/redo for delete line":function() {
    var a = new b(["111", "222", "333"]), c = new h;
    a.setUndoManager(c);
    var e = a.toString(), d = new i(new j, a);
    d.removeLines();
    var f = a.toString();
    assertEquals("222\n333", f);
    a.$informUndoManager.call();
    d.removeLines();
    var g = a.toString();
    assertEquals("333", g);
    a.$informUndoManager.call();
    d.removeLines();
    d = a.toString();
    assertEquals("", d);
    a.$informUndoManager.call();
    c.undo();
    a.$informUndoManager.call();
    assertEquals(g, a.toString());
    c.undo();
    a.$informUndoManager.call();
    assertEquals(f, a.toString());
    c.undo();
    a.$informUndoManager.call();
    assertEquals(e, a.toString());
    c.undo();
    a.$informUndoManager.call();
    assertEquals(e, a.toString())
  }, "test: convert document to screen coordinates":function() {
    var a = new b("01234\t567890\t1234");
    a.setTabSize(4);
    assertEquals(0, a.documentToScreenColumn(0, 0));
    assertEquals(4, a.documentToScreenColumn(0, 4));
    assertEquals(5, a.documentToScreenColumn(0, 5));
    assertEquals(9, a.documentToScreenColumn(0, 6));
    assertEquals(15, a.documentToScreenColumn(0, 12));
    assertEquals(19, a.documentToScreenColumn(0, 13));
    a.setTabSize(2);
    assertEquals(0, a.documentToScreenColumn(0, 0));
    assertEquals(4, a.documentToScreenColumn(0, 4));
    assertEquals(5, a.documentToScreenColumn(0, 5));
    assertEquals(7, a.documentToScreenColumn(0, 6));
    assertEquals(13, a.documentToScreenColumn(0, 12));
    assertEquals(15, a.documentToScreenColumn(0, 13))
  }, "test: convert document to scrren coordinates with leading tabs":function() {
    var a = new b("\t\t123");
    a.setTabSize(4);
    assertEquals(0, a.documentToScreenColumn(0, 0));
    assertEquals(4, a.documentToScreenColumn(0, 1));
    assertEquals(8, a.documentToScreenColumn(0, 2));
    assertEquals(9, a.documentToScreenColumn(0, 3))
  }, "test: convert screen to document coordinates":function() {
    var a = new b("01234\t567890\t1234");
    a.setTabSize(4);
    assertEquals(0, a.screenToDocumentColumn(0, 0));
    assertEquals(4, a.screenToDocumentColumn(0, 4));
    assertEquals(5, a.screenToDocumentColumn(0, 5));
    assertEquals(5, a.screenToDocumentColumn(0, 6));
    assertEquals(5, a.screenToDocumentColumn(0, 7));
    assertEquals(5, a.screenToDocumentColumn(0, 8));
    assertEquals(6, a.screenToDocumentColumn(0, 9));
    assertEquals(12, a.screenToDocumentColumn(0, 15));
    assertEquals(13, a.screenToDocumentColumn(0, 19))
  }})
});