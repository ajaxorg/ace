/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require("../../../support/paths");
var Document = require("../document"), UndoManager = require("../undomanager"), MockRenderer = require("./mockrenderer"), Range = require("../range"), assert = require("./assertions"), async = require("async"), Test = {"test: find matching opening bracket":function() {
  var a = new Document(["(()(", "())))"]);
  assert.position(a.findMatchingBracket({row:0, column:3}), 0, 1);
  assert.position(a.findMatchingBracket({row:1, column:2}), 1, 0);
  assert.position(a.findMatchingBracket({row:1, column:3}), 0, 3);
  assert.position(a.findMatchingBracket({row:1, column:4}), 0, 0);
  assert.equal(a.findMatchingBracket({row:1, column:5}), null)
}, "test: find matching closing bracket":function() {
  var a = new Document(["(()(", "())))"]);
  assert.position(a.findMatchingBracket({row:1, column:1}), 1, 1);
  assert.position(a.findMatchingBracket({row:1, column:1}), 1, 1);
  assert.position(a.findMatchingBracket({row:0, column:4}), 1, 2);
  assert.position(a.findMatchingBracket({row:0, column:2}), 0, 2);
  assert.position(a.findMatchingBracket({row:0, column:1}), 1, 3);
  assert.equal(a.findMatchingBracket({row:0, column:0}), null)
}, "test: match different bracket types":function() {
  var a = new Document(["({[", ")]}"]);
  assert.position(a.findMatchingBracket({row:0, column:1}), 1, 0);
  assert.position(a.findMatchingBracket({row:0, column:2}), 1, 2);
  assert.position(a.findMatchingBracket({row:0, column:3}), 1, 1);
  assert.position(a.findMatchingBracket({row:1, column:1}), 0, 0);
  assert.position(a.findMatchingBracket({row:1, column:2}), 0, 2);
  assert.position(a.findMatchingBracket({row:1, column:3}), 0, 1)
}, "test: move lines down":function() {
  var a = new Document(["1", "2", "3", "4"]);
  console.log(a.toString().replace(/\n/g, "\\n"));
  a.moveLinesDown(0, 1);
  console.log(a.toString().replace(/\n/g, "\\n"));
  assert.equal(a.toString(), "3\n1\n2\n4");
  a.moveLinesDown(1, 2);
  assert.equal(a.toString(), "3\n4\n1\n2");
  a.moveLinesDown(2, 3);
  assert.equal(a.toString(), "3\n4\n1\n2");
  a.moveLinesDown(2, 2);
  assert.equal(a.toString(), "3\n4\n2\n1")
}, "__test: move lines up":function() {
  var a = new Document(["1", "2", "3", "4"]);
  console.log(a.toString().replace(/\n/g, "\\n"));
  a.moveLinesUp(2, 3);
  console.log(a.toString().replace(/\n/g, "\\n"));
  assert.equal(a.toString(), "1\n3\n4\n2");
  a.moveLinesUp(1, 2);
  assert.equal(a.toString(), "3\n4\n1\n2");
  a.moveLinesUp(0, 1);
  assert.equal(a.toString(), "3\n4\n1\n2");
  a.moveLinesUp(2, 2);
  assert.equal(a.toString(), "3\n1\n4\n2")
}, "test: duplicate lines":function() {
  var a = new Document(["1", "2", "3", "4"]);
  a.duplicateLines(1, 2);
  assert.equal(a.toString(), "1\n2\n3\n2\n3\n4")
}, "test: duplicate last line":function() {
  var a = new Document(["1", "2", "3"]);
  a.duplicateLines(2, 2);
  assert.equal(a.toString(), "1\n2\n3\n3")
}, "test: duplicate first line":function() {
  var a = new Document(["1", "2", "3"]);
  a.duplicateLines(0, 0);
  assert.equal(a.toString(), "1\n1\n2\n3")
}, "test: should handle unix style new lines":function() {
  var a = new Document(["1", "2", "3"]);
  assert.equal(a.toString(), "1\n2\n3")
}, "test: should handle windows style new lines":function() {
  var a = new Document("1\r\n2\r\n3");
  a.setNewLineMode("unix");
  assert.equal(a.toString(), "1\n2\n3")
}, "test: set new line mode to 'windows' should use '\r\n' as new lines":function() {
  var a = new Document("1\n2\n3");
  a.setNewLineMode("windows");
  assert.equal(a.toString(), "1\r\n2\r\n3")
}, "test: set new line mode to 'unix' should use '\n' as new lines":function() {
  var a = new Document("1\r\n2\r\n3");
  a.setNewLineMode("unix");
  assert.equal(a.toString(), "1\n2\n3")
}, "test: set new line mode to 'auto' should detect the incoming nl type":function() {
  var a = new Document("1\n2\n3");
  a.setNewLineMode("auto");
  assert.equal(a.toString(), "1\n2\n3");
  a = new Document("1\r\n2\r\n3");
  a.setNewLineMode("auto");
  assert.equal(a.toString(), "1\r\n2\r\n3");
  a.replace(new Range(0, 0, 2, 1), "4\n5\n6");
  assert.equal("4\n5\n6", a.toString())
}, "__test: undo/redo for delete line":function() {
  var a = new Document(["111", "222", "333"]), b = new UndoManager;
  a.setUndoManager(b);
  var d = a.toString(), c = new Editor(new MockRenderer, a);
  c.removeLines();
  var e = a.toString();
  assert.equal(e, "222\n333");
  a.$informUndoManager.call();
  c.removeLines();
  var f = a.toString();
  assert.equal(f, "333");
  a.$informUndoManager.call();
  c.removeLines();
  c = a.toString();
  assert.equal(c, "");
  a.$informUndoManager.call();
  b.undo();
  a.$informUndoManager.call();
  assert.equal(a.toString(), f);
  b.undo();
  a.$informUndoManager.call();
  assert.equal(a.toString(), e);
  b.undo();
  a.$informUndoManager.call();
  assert.equal(a.toString(), d);
  b.undo();
  a.$informUndoManager.call();
  assert.equal(a.toString(), d)
}, "test: convert document to screen coordinates":function() {
  var a = new Document("01234\t567890\t1234");
  a.setTabSize(4);
  assert.equal(a.documentToScreenColumn(0, 0), 0);
  assert.equal(a.documentToScreenColumn(0, 4), 4);
  assert.equal(a.documentToScreenColumn(0, 5), 5);
  assert.equal(a.documentToScreenColumn(0, 6), 9);
  assert.equal(a.documentToScreenColumn(0, 12), 15);
  assert.equal(a.documentToScreenColumn(0, 13), 19);
  a.setTabSize(2);
  assert.equal(a.documentToScreenColumn(0, 0), 0);
  assert.equal(a.documentToScreenColumn(0, 4), 4);
  assert.equal(a.documentToScreenColumn(0, 5), 5);
  assert.equal(a.documentToScreenColumn(0, 6), 7);
  assert.equal(a.documentToScreenColumn(0, 12), 13);
  assert.equal(a.documentToScreenColumn(0, 13), 15)
}, "test: convert document to scrren coordinates with leading tabs":function() {
  var a = new Document("\t\t123");
  a.setTabSize(4);
  assert.equal(a.documentToScreenColumn(0, 0), 0);
  assert.equal(a.documentToScreenColumn(0, 1), 4);
  assert.equal(a.documentToScreenColumn(0, 2), 8);
  assert.equal(a.documentToScreenColumn(0, 3), 9)
}, "test: convert screen to document coordinates":function() {
  var a = new Document("01234\t567890\t1234");
  a.setTabSize(4);
  assert.equal(a.screenToDocumentColumn(0, 0), 0);
  assert.equal(a.screenToDocumentColumn(0, 4), 4);
  assert.equal(a.screenToDocumentColumn(0, 5), 5);
  assert.equal(a.screenToDocumentColumn(0, 6), 5);
  assert.equal(a.screenToDocumentColumn(0, 7), 5);
  assert.equal(a.screenToDocumentColumn(0, 8), 5);
  assert.equal(a.screenToDocumentColumn(0, 9), 6);
  assert.equal(a.screenToDocumentColumn(0, 15), 12);
  assert.equal(a.screenToDocumentColumn(0, 19), 13)
}};
module.exports = require("async/test").testcase(Test);
module === require.main && module.exports.exec();