/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require("../../../support/paths");
var dom = require("jsdom/level2/html").dom.level2.html, browser = require("jsdom/browser/index").windowAugmentation(dom);
global.document = browser.document;
global.window = browser.window;
global.self = browser.self;
global.navigator = browser.navigator;
global.location = browser.location;
var Document = require("../document"), Editor = require("../editor"), JavaScriptMode = require("../mode/javascript"), MockRenderer = require("./mockrenderer"), assert = require("./assertions"), Test = {"test: delete line from the middle":function() {
  var b = new Document("a\nb\nc\nd"), a = new Editor(new MockRenderer, b);
  a.moveCursorTo(1, 1);
  a.removeLines();
  assert.equal(b.toString(), "a\nc\nd");
  assert.position(a.getCursorPosition(), 1, 0);
  a.removeLines();
  assert.equal(b.toString(), "a\nd");
  assert.position(a.getCursorPosition(), 1, 0);
  a.removeLines();
  assert.equal(b.toString(), "a\n");
  assert.position(a.getCursorPosition(), 1, 0);
  a.removeLines();
  assert.equal(b.toString(), "a\n");
  assert.position(a.getCursorPosition(), 1, 0)
}, "test: delete multiple selected lines":function() {
  var b = new Document("a\nb\nc\nd"), a = new Editor(new MockRenderer, b);
  a.moveCursorTo(1, 1);
  a.getSelection().selectDown();
  a.removeLines();
  assert.equal(b.toString(), "a\nd");
  assert.position(a.getCursorPosition(), 1, 0)
}, "test: delete first line":function() {
  var b = new Document("a\nb\nc"), a = new Editor(new MockRenderer, b);
  a.removeLines();
  assert.equal(b.toString(), "b\nc");
  assert.position(a.getCursorPosition(), 0, 0)
}, "test: delete last":function() {
  var b = new Document("a\nb\nc"), a = new Editor(new MockRenderer, b);
  a.moveCursorTo(2, 1);
  a.removeLines();
  assert.equal(b.toString(), "a\nb\n");
  assert.position(a.getCursorPosition(), 2, 0)
}, "__test: indent block":function() {
  var b = new Document("a12345\nb12345\nc12345"), a = new Editor(new MockRenderer, b);
  a.moveCursorTo(1, 3);
  a.getSelection().selectDown();
  a.blockIndent("    ");
  assert.equal("a12345\n    b12345\n    c12345", b.toString());
  assert.position(a.getCursorPosition(), 2, 7);
  b = a.getSelectionRange();
  assert.position(b.start, 1, 7);
  assert.position(b.end, 2, 7)
}, "__test: outdent block":function() {
  var b = new Document("        a12345\n    b12345\n        c12345"), a = new Editor(new MockRenderer, b);
  a.moveCursorTo(0, 3);
  a.getSelection().selectDown();
  a.getSelection().selectDown();
  a.blockOutdent("  ");
  assert.equal(b.toString(), "    a12345\nb12345\n    c12345");
  assert.position(a.getCursorPosition(), 2, 0);
  var c = a.getSelectionRange();
  assert.position(c.start, 0, 1);
  assert.position(c.end, 2, 1);
  a.blockOutdent("  ");
  assert.equal(b.toString(), "a12345\nb12345\nc12345");
  c = a.getSelectionRange();
  assert.position(c.start, 0, 1);
  assert.position(c.end, 2, 1)
}, "test: outent without a selection should update cursor":function() {
  var b = new Document("        12"), a = new Editor(new MockRenderer, b);
  a.moveCursorTo(0, 3);
  a.blockOutdent("  ");
  assert.equal(b.toString(), "    12");
  assert.position(a.getCursorPosition(), 0, 0)
}, "test: comment lines should perserve selection":function() {
  var b = new Document("  abc\ncde", new JavaScriptMode), a = new Editor(new MockRenderer, b);
  a.moveCursorTo(0, 2);
  a.getSelection().selectDown();
  a.toggleCommentLines();
  assert.equal("//  abc\n//cde", b.toString());
  b = a.getSelectionRange();
  assert.position(b.start, 0, 4);
  assert.position(b.end, 1, 4)
}, "test: uncomment lines should perserve selection":function() {
  var b = new Document("//  abc\n//cde", new JavaScriptMode), a = new Editor(new MockRenderer, b);
  a.moveCursorTo(0, 1);
  a.getSelection().selectDown();
  a.getSelection().selectRight();
  a.getSelection().selectRight();
  a.toggleCommentLines();
  assert.equal("  abc\ncde", b.toString());
  assert.range(a.getSelectionRange(), 0, 0, 1, 1)
}, "test: comment lines - if the selection end is at the line start it should stay there":function() {
  var b = new Document("abc\ncde", new JavaScriptMode);
  b = new Editor(new MockRenderer, b);
  b.moveCursorTo(0, 0);
  b.getSelection().selectDown();
  b.toggleCommentLines();
  assert.range(b.getSelectionRange(), 0, 2, 1, 0);
  b = new Document("abc\ncde", new JavaScriptMode);
  b = new Editor(new MockRenderer, b);
  b.moveCursorTo(1, 0);
  b.getSelection().selectUp();
  b.toggleCommentLines();
  assert.range(b.getSelectionRange(), 0, 2, 1, 0)
}, "test: move lines down should select moved lines":function() {
  var b = new Document("11\n22\n33\n44"), a = new Editor(new MockRenderer, b);
  a.moveCursorTo(0, 1);
  a.getSelection().selectDown();
  a.moveLinesDown();
  assert.equal("33\n11\n22\n44", b.toString());
  assert.position(a.getCursorPosition(), 1, 0);
  assert.position(a.getSelection().getSelectionAnchor(), 3, 0);
  assert.position(a.getSelection().getSelectionLead(), 1, 0);
  a.moveLinesDown();
  assert.equal("33\n44\n11\n22", b.toString());
  assert.position(a.getCursorPosition(), 2, 0);
  assert.position(a.getSelection().getSelectionAnchor(), 3, 2);
  assert.position(a.getSelection().getSelectionLead(), 2, 0);
  a.moveLinesDown();
  assert.equal("33\n44\n11\n22", b.toString());
  assert.position(a.getCursorPosition(), 2, 0);
  assert.position(a.getSelection().getSelectionAnchor(), 3, 2);
  assert.position(a.getSelection().getSelectionLead(), 2, 0)
}, "__test: move lines up should select moved lines":function() {
  var b = new Document("11\n22\n33\n44"), a = new Editor(new MockRenderer, b);
  a.moveCursorTo(2, 1);
  a.getSelection().selectDown();
  a.moveLinesUp();
  assert.equal(b.toString(), "11\n33\n44\n22");
  assert.position(a.getCursorPosition(), 1, 0);
  assert.position(a.getSelection().getSelectionAnchor(), 3, 0);
  assert.position(a.getSelection().getSelectionLead(), 1, 0);
  a.moveLinesUp();
  assert.equal(b.toString(), "33\n44\n11\n22");
  assert.position(a.getCursorPosition(), 0, 0);
  assert.position(a.getSelection().getSelectionAnchor(), 2, 0);
  assert.position(a.getSelection().getSelectionLead(), 0, 0)
}, "test: move line without active selection should move cursor to start of the moved line":function() {
  var b = new Document("11\n22\n33\n44"), a = new Editor(new MockRenderer, b);
  a.moveCursorTo(1, 1);
  a.clearSelection();
  a.moveLinesDown();
  assert.equal("11\n33\n22\n44", b.toString());
  assert.position(a.getCursorPosition(), 2, 0);
  a.clearSelection();
  a.moveLinesUp();
  assert.equal("11\n22\n33\n44", b.toString());
  assert.position(a.getCursorPosition(), 1, 0)
}, "test: copy lines down should select lines and place cursor at the selection start":function() {
  var b = new Document("11\n22\n33\n44"), a = new Editor(new MockRenderer, b);
  a.moveCursorTo(1, 1);
  a.getSelection().selectDown();
  a.copyLinesDown();
  assert.equal("11\n22\n33\n22\n33\n44", b.toString());
  assert.position(a.getCursorPosition(), 3, 0);
  assert.position(a.getSelection().getSelectionAnchor(), 5, 0);
  assert.position(a.getSelection().getSelectionLead(), 3, 0)
}, "test: copy lines up should select lines and place cursor at the selection start":function() {
  var b = new Document("11\n22\n33\n44"), a = new Editor(new MockRenderer, b);
  a.moveCursorTo(1, 1);
  a.getSelection().selectDown();
  a.copyLinesUp();
  assert.equal("11\n22\n33\n22\n33\n44", b.toString());
  assert.position(a.getCursorPosition(), 1, 0);
  assert.position(a.getSelection().getSelectionAnchor(), 3, 0);
  assert.position(a.getSelection().getSelectionLead(), 1, 0)
}, "test: input a tab with soft tab should convert it to spaces":function() {
  var b = new Document(""), a = new Editor(new MockRenderer, b);
  b.setTabSize(2);
  b.setUseSoftTabs(true);
  a.onTextInput("\t");
  assert.equal(b.toString(), "  ");
  b.setTabSize(5);
  a.onTextInput("\t");
  assert.equal(b.toString(), "       ")
}, "test: input tab without soft tabs should keep the tab character":function() {
  var b = new Document(""), a = new Editor(new MockRenderer, b);
  b.setUseSoftTabs(false);
  a.onTextInput("\t");
  assert.equal(b.toString(), "\t")
}};
module.exports = require("async/test").testcase(Test);
module === require.main && module.exports.exec();