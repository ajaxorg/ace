/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/Document", "ace/Editor", "ace/mode/JavaScript", "ace/test/MockRenderer"], function(c, d, g, e) {
  TestCase("TextEditTest", {"test: delete line from the middle":function() {
    var b = new c("a\nb\nc\nd"), a = new d(new e, b);
    a.moveCursorTo(1, 1);
    a.removeLines();
    assertEquals("a\nc\nd", b.toString());
    assertPosition(1, 0, a.getCursorPosition());
    a.removeLines();
    assertEquals("a\nd", b.toString());
    assertPosition(1, 0, a.getCursorPosition());
    a.removeLines();
    assertEquals("a\n", b.toString());
    assertPosition(1, 0, a.getCursorPosition());
    a.removeLines();
    assertEquals("a\n", b.toString());
    assertPosition(1, 0, a.getCursorPosition())
  }, "test: delete multiple selected lines":function() {
    var b = new c("a\nb\nc\nd"), a = new d(new e, b);
    a.moveCursorTo(1, 1);
    a.getSelection().selectDown();
    a.removeLines();
    assertEquals("a\nd", b.toString());
    assertPosition(1, 0, a.getCursorPosition())
  }, "test: delete first line":function() {
    var b = new c("a\nb\nc"), a = new d(new e, b);
    a.removeLines();
    assertEquals("b\nc", b.toString());
    assertPosition(0, 0, a.getCursorPosition())
  }, "test: delete last":function() {
    var b = new c("a\nb\nc"), a = new d(new e, b);
    a.moveCursorTo(2, 1);
    a.removeLines();
    assertEquals("a\nb\n", b.toString());
    assertPosition(2, 0, a.getCursorPosition())
  }, "test: indent block":function() {
    var b = new c("a12345\nb12345\nc12345"), a = new d(new e, b);
    a.moveCursorTo(1, 3);
    a.getSelection().selectDown();
    a.blockIndent("    ");
    assertEquals("a12345\n    b12345\n    c12345", b.toString());
    assertPosition(2, 7, a.getCursorPosition());
    b = a.getSelectionRange();
    assertPosition(1, 7, b.start);
    assertPosition(2, 7, b.end)
  }, "test: outdent block":function() {
    var b = new c("    a12345\n  b12345\n    c12345"), a = new d(new e, b);
    a.moveCursorTo(0, 3);
    a.getSelection().selectDown();
    a.getSelection().selectDown();
    a.blockOutdent("  ");
    assertEquals("  a12345\nb12345\n  c12345", b.toString());
    assertPosition(2, 1, a.getCursorPosition());
    var f = a.getSelectionRange();
    assertPosition(0, 1, f.start);
    assertPosition(2, 1, f.end);
    a.blockOutdent("  ");
    assertEquals("  a12345\nb12345\n  c12345", b.toString());
    f = a.getSelectionRange();
    assertPosition(0, 1, f.start);
    assertPosition(2, 1, f.end)
  }, "test: outent without a selection should update cursor":function() {
    var b = new c("        12"), a = new d(new e, b);
    a.moveCursorTo(0, 3);
    a.blockOutdent("  ");
    assertEquals("      12", b.toString());
    assertPosition(0, 1, a.getCursorPosition())
  }, "test: comment lines should perserve selection":function() {
    var b = new c("  abc\ncde", new g), a = new d(new e, b);
    a.moveCursorTo(0, 2);
    a.getSelection().selectDown();
    a.toggleCommentLines();
    assertEquals("//  abc\n//cde", b.toString());
    b = a.getSelectionRange();
    assertPosition(0, 4, b.start);
    assertPosition(1, 4, b.end)
  }, "test: uncomment lines should perserve selection":function() {
    var b = new c("//  abc\n//cde", new g), a = new d(new e, b);
    a.moveCursorTo(0, 1);
    a.getSelection().selectDown();
    a.getSelection().selectRight();
    a.getSelection().selectRight();
    a.toggleCommentLines();
    assertEquals("  abc\ncde", b.toString());
    assertRange(0, 0, 1, 1, a.getSelectionRange())
  }, "test: comment lines - if the selection end is at the line start it should stay there":function() {
    var b = new c("abc\ncde", new g);
    b = new d(new e, b);
    b.moveCursorTo(0, 0);
    b.getSelection().selectDown();
    b.toggleCommentLines();
    assertRange(0, 2, 1, 0, b.getSelectionRange());
    b = new c("abc\ncde", new g);
    b = new d(new e, b);
    b.moveCursorTo(1, 0);
    b.getSelection().selectUp();
    b.toggleCommentLines();
    assertRange(0, 2, 1, 0, b.getSelectionRange())
  }, "test: move lines down should select moved lines":function() {
    var b = new c("11\n22\n33\n44"), a = new d(new e, b);
    a.moveCursorTo(0, 1);
    a.getSelection().selectDown();
    a.moveLinesDown();
    assertEquals("33\n11\n22\n44", b.toString());
    assertPosition(1, 0, a.getCursorPosition());
    assertPosition(3, 0, a.getSelection().getSelectionAnchor());
    assertPosition(1, 0, a.getSelection().getSelectionLead());
    a.moveLinesDown();
    assertEquals("33\n44\n11\n22", b.toString());
    assertPosition(2, 0, a.getCursorPosition());
    assertPosition(3, 2, a.getSelection().getSelectionAnchor());
    assertPosition(2, 0, a.getSelection().getSelectionLead());
    a.moveLinesDown();
    assertEquals("33\n44\n11\n22", b.toString());
    assertPosition(2, 0, a.getCursorPosition());
    assertPosition(3, 2, a.getSelection().getSelectionAnchor());
    assertPosition(2, 0, a.getSelection().getSelectionLead())
  }, "test: move lines up should select moved lines":function() {
    var b = new c("11\n22\n33\n44"), a = new d(new e, b);
    a.moveCursorTo(2, 1);
    a.getSelection().selectDown();
    a.moveLinesUp();
    assertEquals("11\n33\n44\n22", b.toString());
    assertPosition(1, 0, a.getCursorPosition());
    assertPosition(3, 0, a.getSelection().getSelectionAnchor());
    assertPosition(1, 0, a.getSelection().getSelectionLead());
    a.moveLinesUp();
    assertEquals("33\n44\n11\n22", b.toString());
    assertPosition(0, 0, a.getCursorPosition());
    assertPosition(2, 0, a.getSelection().getSelectionAnchor());
    assertPosition(0, 0, a.getSelection().getSelectionLead())
  }, "test: move line without active selection should move cursor to start of the moved line":function() {
    var b = new c("11\n22\n33\n44"), a = new d(new e, b);
    a.moveCursorTo(1, 1);
    a.clearSelection();
    a.moveLinesDown();
    assertEquals("11\n33\n22\n44", b.toString());
    assertPosition(2, 0, a.getCursorPosition());
    a.clearSelection();
    a.moveLinesUp();
    assertEquals("11\n22\n33\n44", b.toString());
    assertPosition(1, 0, a.getCursorPosition())
  }, "test: copy lines down should select lines and place cursor at the selection start":function() {
    var b = new c("11\n22\n33\n44"), a = new d(new e, b);
    a.moveCursorTo(1, 1);
    a.getSelection().selectDown();
    a.copyLinesDown();
    assertEquals("11\n22\n33\n22\n33\n44", b.toString());
    assertPosition(3, 0, a.getCursorPosition());
    assertPosition(5, 0, a.getSelection().getSelectionAnchor());
    assertPosition(3, 0, a.getSelection().getSelectionLead())
  }, "test: copy lines up should select lines and place cursor at the selection start":function() {
    var b = new c("11\n22\n33\n44"), a = new d(new e, b);
    a.moveCursorTo(1, 1);
    a.getSelection().selectDown();
    a.copyLinesUp();
    assertEquals("11\n22\n33\n22\n33\n44", b.toString());
    assertPosition(1, 0, a.getCursorPosition());
    assertPosition(3, 0, a.getSelection().getSelectionAnchor());
    assertPosition(1, 0, a.getSelection().getSelectionLead())
  }, "test: input a tab with soft tab should convert it to spaces":function() {
    var b = new c(""), a = new d(new e, b);
    b.setTabSize(2);
    b.setUseSoftTabs(true);
    a.onTextInput("\t");
    assertEquals("  ", b.toString());
    b.setTabSize(5);
    a.onTextInput("\t");
    assertEquals("       ", b.toString())
  }, "test: input tab without soft tabs should keep the tab character":function() {
    var b = new c(""), a = new d(new e, b);
    b.setUseSoftTabs(false);
    a.onTextInput("\t");
    assertEquals("\t", b.toString())
  }})
});