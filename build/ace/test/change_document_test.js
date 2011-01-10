define(function(c, d, f) {
  c("./mockdom");
  var e = c("../document").Document, g = c("../editor").Editor, h = c("../mode/text").Mode, i = c("../mode/javascript").Mode, j = c("./mockrenderer"), a = c("./assertions");
  d = {setUp:function() {
    this.doc1 = new e("abc\ndef");
    this.doc2 = new e("ghi\njkl");
    this.editor = new g(new j)
  }, "test: change document":function() {
    this.editor.setDocument(this.doc1);
    a.equal(this.editor.getDocument(), this.doc1);
    this.editor.setDocument(this.doc2);
    a.equal(this.editor.getDocument(), this.doc2)
  }, "test: only changes to the new document should have effect":function() {
    var b = false;
    this.editor.onDocumentChange = function() {
      b = true
    };
    this.editor.setDocument(this.doc1);
    this.editor.setDocument(this.doc2);
    this.doc1.duplicateLines(0, 0);
    a.notOk(b);
    this.doc2.duplicateLines(0, 0);
    a.notOk(b)
  }, "test: should use cursor of new document":function() {
    this.doc1.getSelection().moveCursorTo(0, 1);
    this.doc2.getSelection().moveCursorTo(1, 0);
    this.editor.setDocument(this.doc1);
    a.position(this.editor.getCursorPosition(), 0, 1);
    this.editor.setDocument(this.doc2);
    a.position(this.editor.getCursorPosition(), 1, 0)
  }, "test: only changing the cursor of the new doc should not have an effect":function() {
    this.editor.onCursorChange = function() {
      b = true
    };
    this.editor.setDocument(this.doc1);
    this.editor.setDocument(this.doc2);
    a.position(this.editor.getCursorPosition(), 0, 0);
    var b = false;
    this.doc1.getSelection().moveCursorTo(0, 1);
    a.position(this.editor.getCursorPosition(), 0, 0);
    a.notOk(b);
    this.doc2.getSelection().moveCursorTo(1, 1);
    a.position(this.editor.getCursorPosition(), 1, 1);
    a.ok(b)
  }, "test: should use selection of new document":function() {
    this.doc1.getSelection().selectTo(0, 1);
    this.doc2.getSelection().selectTo(1, 0);
    this.editor.setDocument(this.doc1);
    a.position(this.editor.getSelection().getSelectionLead(), 0, 1);
    this.editor.setDocument(this.doc2);
    a.position(this.editor.getSelection().getSelectionLead(), 1, 0)
  }, "test: only changing the selection of the new doc should not have an effect":function() {
    this.editor.onSelectionChange = function() {
      b = true
    };
    this.editor.setDocument(this.doc1);
    this.editor.setDocument(this.doc2);
    a.position(this.editor.getSelection().getSelectionLead(), 0, 0);
    var b = false;
    this.doc1.getSelection().selectTo(0, 1);
    a.position(this.editor.getSelection().getSelectionLead(), 0, 0);
    a.notOk(b);
    this.doc2.getSelection().selectTo(1, 1);
    a.position(this.editor.getSelection().getSelectionLead(), 1, 1);
    a.ok(b)
  }, "test: should use mode of new document":function() {
    this.editor.onDocumentModeChange = function() {
      b = true
    };
    this.editor.setDocument(this.doc1);
    this.editor.setDocument(this.doc2);
    var b = false;
    this.doc1.setMode(new h);
    a.notOk(b);
    this.doc2.setMode(new i);
    a.ok(b)
  }};
  f.exports = c("async/test").testcase(d)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};