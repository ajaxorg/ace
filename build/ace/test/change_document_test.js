/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/Document", "ace/Editor", "ace/mode/Text", "ace/mode/JavaScript", "ace/test/MockRenderer"], function(b, c, f, d, e) {
  new TestCase("ChangeDocumentTest", {setUp:function() {
    this.doc1 = new b("abc\ndef");
    this.doc2 = new b("ghi\njkl");
    this.editor = new c(new e)
  }, "test: change document":function() {
    this.editor.setDocument(this.doc1);
    assertEquals(this.doc1, this.editor.getDocument());
    this.editor.setDocument(this.doc2);
    assertEquals(this.doc2, this.editor.getDocument())
  }, "test: only changes to the new document should have effect":function() {
    var a = false;
    this.editor.onDocumentChange = function() {
      a = true
    };
    this.editor.setDocument(this.doc1);
    this.editor.setDocument(this.doc2);
    this.doc1.duplicateLines(0, 0);
    assertFalse(a);
    this.doc2.duplicateLines(0, 0);
    assertTrue(a)
  }, "test: should use cursor of new document":function() {
    this.doc1.getSelection().moveCursorTo(0, 1);
    this.doc2.getSelection().moveCursorTo(1, 0);
    this.editor.setDocument(this.doc1);
    assertPosition(0, 1, this.editor.getCursorPosition());
    this.editor.setDocument(this.doc2);
    assertPosition(1, 0, this.editor.getCursorPosition())
  }, "test: only changing the cursor of the new doc should not have an effect":function() {
    this.editor.onCursorChange = function() {
      a = true
    };
    this.editor.setDocument(this.doc1);
    this.editor.setDocument(this.doc2);
    assertPosition(0, 0, this.editor.getCursorPosition());
    var a = false;
    this.doc1.getSelection().moveCursorTo(0, 1);
    assertPosition(0, 0, this.editor.getCursorPosition());
    assertFalse(a);
    this.doc2.getSelection().moveCursorTo(1, 1);
    assertPosition(1, 1, this.editor.getCursorPosition());
    assertTrue(a)
  }, "test: should use selection of new document":function() {
    this.doc1.getSelection().selectTo(0, 1);
    this.doc2.getSelection().selectTo(1, 0);
    this.editor.setDocument(this.doc1);
    assertPosition(0, 1, this.editor.getSelection().getSelectionLead());
    this.editor.setDocument(this.doc2);
    assertPosition(1, 0, this.editor.getSelection().getSelectionLead())
  }, "test: only changing the selection of the new doc should not have an effect":function() {
    this.editor.onSelectionChange = function() {
      a = true
    };
    this.editor.setDocument(this.doc1);
    this.editor.setDocument(this.doc2);
    assertPosition(0, 0, this.editor.getSelection().getSelectionLead());
    var a = false;
    this.doc1.getSelection().selectTo(0, 1);
    assertPosition(0, 0, this.editor.getSelection().getSelectionLead());
    assertFalse(a);
    this.doc2.getSelection().selectTo(1, 1);
    assertPosition(1, 1, this.editor.getSelection().getSelectionLead());
    assertTrue(a)
  }, "test: should use mode of new document":function() {
    this.editor.onDocumentModeChange = function() {
      a = true
    };
    this.editor.setDocument(this.doc1);
    this.editor.setDocument(this.doc2);
    var a = false;
    this.doc1.setMode(new Text);
    assertFalse(a);
    this.doc2.setMode(new d);
    assertTrue(a)
  }})
});