define(function(g, k, n) {
  g("./mockdom");
  var d = g("../document").Document, e = g("../editor").Editor, i = g("../mode/javascript").Mode, o = g("../undomanager").UndoManager, f = g("./mockrenderer"), c = g("./assertions");
  k = {"test: delete line from the middle":function() {
    var b = new d("a\nb\nc\nd"), a = new e(new f, b);
    a.moveCursorTo(1, 1);
    a.removeLines();
    c.equal(b.toString(), "a\nc\nd");
    c.position(a.getCursorPosition(), 1, 0);
    a.removeLines();
    c.equal(b.toString(), "a\nd");
    c.position(a.getCursorPosition(), 1, 0);
    a.removeLines();
    c.equal(b.toString(), "a\n");
    c.position(a.getCursorPosition(), 1, 0);
    a.removeLines();
    c.equal(b.toString(), "a\n");
    c.position(a.getCursorPosition(), 1, 0)
  }, "test: delete multiple selected lines":function() {
    var b = new d("a\nb\nc\nd"), a = new e(new f, b);
    a.moveCursorTo(1, 1);
    a.getSelection().selectDown();
    a.removeLines();
    c.equal(b.toString(), "a\nd");
    c.position(a.getCursorPosition(), 1, 0)
  }, "test: delete first line":function() {
    var b = new d("a\nb\nc"), a = new e(new f, b);
    a.removeLines();
    c.equal(b.toString(), "b\nc");
    c.position(a.getCursorPosition(), 0, 0)
  }, "test: delete last":function() {
    var b = new d("a\nb\nc"), a = new e(new f, b);
    a.moveCursorTo(2, 1);
    a.removeLines();
    c.equal(b.toString(), "a\nb\n");
    c.position(a.getCursorPosition(), 2, 0)
  }, "test: indent block":function() {
    var b = new d("a12345\nb12345\nc12345"), a = new e(new f, b);
    a.moveCursorTo(1, 3);
    a.getSelection().selectDown();
    a.indent();
    c.equal("a12345\n    b12345\n    c12345", b.toString());
    c.position(a.getCursorPosition(), 2, 7);
    b = a.getSelectionRange();
    c.position(b.start, 1, 7);
    c.position(b.end, 2, 7)
  }, "test: indent selected lines":function() {
    var b = new d("a12345\nb12345\nc12345"), a = new e(new f, b);
    a.moveCursorTo(1, 0);
    a.getSelection().selectDown();
    a.indent();
    c.equal("a12345\n    b12345\nc12345", b.toString())
  }, "test: no auto indent if cursor is before the {":function() {
    var b = new d("{", new i), a = new e(new f, b);
    a.moveCursorTo(0, 0);
    a.onTextInput("\n");
    c.equal("\n{", b.toString())
  }, "test: outdent block":function() {
    var b = new d("        a12345\n    b12345\n        c12345"), a = new e(new f, b);
    a.moveCursorTo(0, 5);
    a.getSelection().selectDown();
    a.getSelection().selectDown();
    a.blockOutdent();
    c.equal(b.toString(), "    a12345\nb12345\n    c12345");
    c.position(a.getCursorPosition(), 2, 1);
    var h = a.getSelectionRange();
    c.position(h.start, 0, 1);
    c.position(h.end, 2, 1);
    a.blockOutdent();
    c.equal(b.toString(), "a12345\nb12345\nc12345");
    h = a.getSelectionRange();
    c.position(h.start, 0, 0);
    c.position(h.end, 2, 0)
  }, "test: outent without a selection should update cursor":function() {
    var b = new d("        12"), a = new e(new f, b);
    a.moveCursorTo(0, 3);
    a.blockOutdent("  ");
    c.equal(b.toString(), "    12");
    c.position(a.getCursorPosition(), 0, 0)
  }, "test: comment lines should perserve selection":function() {
    var b = new d("  abc\ncde", new i), a = new e(new f, b);
    a.moveCursorTo(0, 2);
    a.getSelection().selectDown();
    a.toggleCommentLines();
    c.equal("//  abc\n//cde", b.toString());
    b = a.getSelectionRange();
    c.position(b.start, 0, 4);
    c.position(b.end, 1, 4)
  }, "test: uncomment lines should perserve selection":function() {
    var b = new d("//  abc\n//cde", new i), a = new e(new f, b);
    a.moveCursorTo(0, 1);
    a.getSelection().selectDown();
    a.getSelection().selectRight();
    a.getSelection().selectRight();
    a.toggleCommentLines();
    c.equal("  abc\ncde", b.toString());
    c.range(a.getSelectionRange(), 0, 0, 1, 1)
  }, "test: toggle comment lines twice should return the original text":function() {
    var b = new d(["  abc", "cde", "fg"], new i), a = new e(new f, b);
    a.moveCursorTo(0, 0);
    a.getSelection().selectDown();
    a.getSelection().selectDown();
    a.toggleCommentLines();
    a.toggleCommentLines();
    c.equal("  abc\ncde\nfg", b.toString())
  }, "test: comment lines - if the selection end is at the line start it should stay there":function() {
    var b = new d("abc\ncde", new i);
    b = new e(new f, b);
    b.moveCursorTo(0, 0);
    b.getSelection().selectDown();
    b.toggleCommentLines();
    c.range(b.getSelectionRange(), 0, 2, 1, 0);
    b = new d("abc\ncde", new i);
    b = new e(new f, b);
    b.moveCursorTo(1, 0);
    b.getSelection().selectUp();
    b.toggleCommentLines();
    c.range(b.getSelectionRange(), 0, 2, 1, 0)
  }, "test: move lines down should select moved lines":function() {
    var b = new d("11\n22\n33\n44"), a = new e(new f, b);
    a.moveCursorTo(0, 1);
    a.getSelection().selectDown();
    a.moveLinesDown();
    c.equal("33\n11\n22\n44", b.toString());
    c.position(a.getCursorPosition(), 1, 0);
    c.position(a.getSelection().getSelectionAnchor(), 3, 0);
    c.position(a.getSelection().getSelectionLead(), 1, 0);
    a.moveLinesDown();
    c.equal("33\n44\n11\n22", b.toString());
    c.position(a.getCursorPosition(), 2, 0);
    c.position(a.getSelection().getSelectionAnchor(), 3, 2);
    c.position(a.getSelection().getSelectionLead(), 2, 0);
    a.moveLinesDown();
    c.equal("33\n44\n11\n22", b.toString());
    c.position(a.getCursorPosition(), 2, 0);
    c.position(a.getSelection().getSelectionAnchor(), 3, 2);
    c.position(a.getSelection().getSelectionLead(), 2, 0)
  }, "test: move lines up should select moved lines":function() {
    var b = new d("11\n22\n33\n44"), a = new e(new f, b);
    a.moveCursorTo(2, 1);
    a.getSelection().selectDown();
    a.moveLinesUp();
    c.equal(b.toString(), "11\n33\n44\n22");
    c.position(a.getCursorPosition(), 1, 0);
    c.position(a.getSelection().getSelectionAnchor(), 3, 0);
    c.position(a.getSelection().getSelectionLead(), 1, 0);
    a.moveLinesUp();
    c.equal(b.toString(), "33\n44\n11\n22");
    c.position(a.getCursorPosition(), 0, 0);
    c.position(a.getSelection().getSelectionAnchor(), 2, 0);
    c.position(a.getSelection().getSelectionLead(), 0, 0)
  }, "test: move line without active selection should move cursor to start of the moved line":function() {
    var b = new d("11\n22\n33\n44"), a = new e(new f, b);
    a.moveCursorTo(1, 1);
    a.clearSelection();
    a.moveLinesDown();
    c.equal("11\n33\n22\n44", b.toString());
    c.position(a.getCursorPosition(), 2, 0);
    a.clearSelection();
    a.moveLinesUp();
    c.equal("11\n22\n33\n44", b.toString());
    c.position(a.getCursorPosition(), 1, 0)
  }, "test: copy lines down should select lines and place cursor at the selection start":function() {
    var b = new d("11\n22\n33\n44"), a = new e(new f, b);
    a.moveCursorTo(1, 1);
    a.getSelection().selectDown();
    a.copyLinesDown();
    c.equal("11\n22\n33\n22\n33\n44", b.toString());
    c.position(a.getCursorPosition(), 3, 0);
    c.position(a.getSelection().getSelectionAnchor(), 5, 0);
    c.position(a.getSelection().getSelectionLead(), 3, 0)
  }, "test: copy lines up should select lines and place cursor at the selection start":function() {
    var b = new d("11\n22\n33\n44"), a = new e(new f, b);
    a.moveCursorTo(1, 1);
    a.getSelection().selectDown();
    a.copyLinesUp();
    c.equal("11\n22\n33\n22\n33\n44", b.toString());
    c.position(a.getCursorPosition(), 1, 0);
    c.position(a.getSelection().getSelectionAnchor(), 3, 0);
    c.position(a.getSelection().getSelectionLead(), 1, 0)
  }, "test: input a tab with soft tab should convert it to spaces":function() {
    var b = new d(""), a = new e(new f, b);
    b.setTabSize(2);
    b.setUseSoftTabs(true);
    a.onTextInput("\t");
    c.equal(b.toString(), "  ");
    b.setTabSize(5);
    a.onTextInput("\t");
    c.equal(b.toString(), "       ")
  }, "test: input tab without soft tabs should keep the tab character":function() {
    var b = new d(""), a = new e(new f, b);
    b.setUseSoftTabs(false);
    a.onTextInput("\t");
    c.equal(b.toString(), "\t")
  }, "test: undo/redo for delete line":function() {
    var b = new d(["111", "222", "333"]), a = new o;
    b.setUndoManager(a);
    var h = b.toString(), j = new e(new f, b);
    j.removeLines();
    var l = b.toString();
    c.equal(l, "222\n333");
    b.$informUndoManager.call();
    j.removeLines();
    var m = b.toString();
    c.equal(m, "333");
    b.$informUndoManager.call();
    j.removeLines();
    j = b.toString();
    c.equal(j, "");
    b.$informUndoManager.call();
    a.undo();
    b.$informUndoManager.call();
    c.equal(b.toString(), m);
    a.undo();
    b.$informUndoManager.call();
    c.equal(b.toString(), l);
    a.undo();
    b.$informUndoManager.call();
    c.equal(b.toString(), h);
    a.undo();
    b.$informUndoManager.call();
    c.equal(b.toString(), h)
  }, "test: remove left should remove character left of the cursor":function() {
    var b = new d(["123", "456"]), a = new e(new f, b);
    a.moveCursorTo(1, 1);
    a.removeLeft();
    c.equal(b.toString(), "123\n56")
  }, "test: remove left should remove line break if cursor is at line start":function() {
    var b = new d(["123", "456"]), a = new e(new f, b);
    a.moveCursorTo(1, 0);
    a.removeLeft();
    c.equal(b.toString(), "123456")
  }, "test: remove left should remove tabsize spaces if cursor is on a tab stop and preceeded by spaces":function() {
    var b = new d(["123", "        456"]);
    b.setUseSoftTabs(true);
    b.setTabSize(4);
    var a = new e(new f, b);
    a.moveCursorTo(1, 8);
    a.removeLeft();
    c.equal(b.toString(), "123\n    456")
  }};
  n.exports = g("async/test").testcase(k)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};