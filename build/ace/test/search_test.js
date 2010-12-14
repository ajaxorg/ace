/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require("../../../support/paths");
var Document = require("../document"), Search = require("../search"), assert = require("./assertions"), Test = {"test: configure the search object":function() {
  (new Search).set({needle:"juhu", scope:Search.ALL})
}, "test: find simple text in document":function() {
  var a = new Document(["juhu kinners 123", "456"]);
  a = (new Search).set({needle:"kinners"}).find(a);
  assert.position(a.start, 0, 5);
  assert.position(a.end, 0, 12)
}, "test: find simple text in next line":function() {
  var a = new Document(["abc", "juhu kinners 123", "456"]);
  a = (new Search).set({needle:"kinners"}).find(a);
  assert.position(a.start, 1, 5);
  assert.position(a.end, 1, 12)
}, "test: find text starting at cursor position":function() {
  var a = new Document(["juhu kinners", "juhu kinners 123"]);
  a.getSelection().moveCursorTo(0, 6);
  a = (new Search).set({needle:"kinners"}).find(a);
  assert.position(a.start, 1, 5);
  assert.position(a.end, 1, 12)
}, "test: wrap search is off by default":function() {
  var a = new Document(["abc", "juhu kinners 123", "456"]);
  a.getSelection().moveCursorTo(2, 1);
  var b = (new Search).set({needle:"kinners"});
  assert.equal(b.find(a), null)
}, "test: wrap search should wrap at file end":function() {
  var a = new Document(["abc", "juhu kinners 123", "456"]);
  a.getSelection().moveCursorTo(2, 1);
  a = (new Search).set({needle:"kinners", wrap:true}).find(a);
  assert.position(a.start, 1, 5);
  assert.position(a.end, 1, 12)
}, "test: wrap search with no match should return 'null'":function() {
  var a = new Document(["abc", "juhu kinners 123", "456"]);
  a.getSelection().moveCursorTo(2, 1);
  var b = (new Search).set({needle:"xyz", wrap:true});
  assert.equal(b.find(a), null)
}, "test: case sensitive is by default off":function() {
  var a = new Document(["abc", "juhu kinners 123", "456"]), b = (new Search).set({needle:"JUHU"});
  assert.range(b.find(a), 1, 0, 1, 4)
}, "test: case sensitive search":function() {
  var a = new Document(["abc", "juhu kinners 123", "456"]);
  a = (new Search).set({needle:"KINNERS", caseSensitive:true}).find(a);
  assert.equal(a, null)
}, "test: whole word search should not match inside of words":function() {
  var a = new Document(["juhukinners", "juhu kinners 123", "456"]);
  a = (new Search).set({needle:"kinners", wholeWord:true}).find(a);
  assert.position(a.start, 1, 5);
  assert.position(a.end, 1, 12)
}, "test: find backwards":function() {
  var a = new Document(["juhu juhu juhu juhu"]);
  a.getSelection().moveCursorTo(0, 10);
  a = (new Search).set({needle:"juhu", backwards:true}).find(a);
  assert.position(a.start, 0, 5);
  assert.position(a.end, 0, 9)
}, "test: find in selection":function() {
  var a = new Document(["juhu", "juhu", "juhu", "juhu"]);
  a.getSelection().setSelectionAnchor(1, 0);
  a.getSelection().selectTo(3, 5);
  var b = (new Search).set({needle:"juhu", wrap:true, scope:Search.SELECTION}), c = b.find(a);
  assert.position(c.start, 1, 0);
  assert.position(c.end, 1, 4);
  a.getSelection().setSelectionAnchor(0, 2);
  a.getSelection().selectTo(3, 2);
  c = b.find(a);
  assert.position(c.start, 1, 0);
  assert.position(c.end, 1, 4)
}, "test: find backwards in selection":function() {
  var a = new Document(["juhu", "juhu", "juhu", "juhu"]), b = (new Search).set({needle:"juhu", wrap:true, backwards:true, scope:Search.SELECTION});
  a.getSelection().setSelectionAnchor(0, 2);
  a.getSelection().selectTo(3, 2);
  var c = b.find(a);
  assert.position(c.start, 2, 0);
  assert.position(c.end, 2, 4);
  a.getSelection().setSelectionAnchor(0, 2);
  a.getSelection().selectTo(1, 2);
  assert.equal(b.find(a), null)
}, "test: edge case - match directly before the cursor":function() {
  var a = new Document(["123", "123", "juhu"]), b = (new Search).set({needle:"juhu", wrap:true});
  a.getSelection().moveCursorTo(2, 5);
  a = b.find(a);
  assert.position(a.start, 2, 0);
  assert.position(a.end, 2, 4)
}, "test: edge case - match backwards directly after the cursor":function() {
  var a = new Document(["123", "123", "juhu"]), b = (new Search).set({needle:"juhu", wrap:true, backwards:true});
  a.getSelection().moveCursorTo(2, 0);
  a = b.find(a);
  assert.position(a.start, 2, 0);
  assert.position(a.end, 2, 4)
}, "test: find using a regular expression":function() {
  var a = new Document(["abc123 123 cd", "abc"]);
  a = (new Search).set({needle:"\\d+", regExp:true}).find(a);
  assert.position(a.start, 0, 3);
  assert.position(a.end, 0, 6)
}, "test: find using a regular expression and whole word":function() {
  var a = new Document(["abc123 123 cd", "abc"]);
  a = (new Search).set({needle:"\\d+\\b", regExp:true, wholeWord:true}).find(a);
  assert.position(a.start, 0, 7);
  assert.position(a.end, 0, 10)
}, "test: use regular expressions with capture groups":function() {
  var a = new Document(["  ab: 12px", "  <h1 abc"]);
  a = (new Search).set({needle:"(\\d+)", regExp:true}).find(a);
  assert.position(a.start, 0, 6);
  assert.position(a.end, 0, 8)
}, "test: find all matches in selection":function() {
  var a = new Document(["juhu", "juhu", "juhu", "juhu"]), b = (new Search).set({needle:"uh", wrap:true, scope:Search.SELECTION});
  a.getSelection().setSelectionAnchor(0, 2);
  a.getSelection().selectTo(3, 2);
  a = b.findAll(a);
  assert.equal(a.length, 2);
  assert.position(a[0].start, 1, 1);
  assert.position(a[0].end, 1, 3);
  assert.position(a[1].start, 2, 1);
  assert.position(a[1].end, 2, 3)
}, "test: replace() should return the replacement if the input matches the needle":function() {
  var a = (new Search).set({needle:"juhu"});
  assert.equal(a.replace("juhu", "kinners"), "kinners");
  assert.equal(a.replace("", "kinners"), null);
  assert.equal(a.replace(" juhu", "kinners"), null)
}, "test: replace with a RegExp search":function() {
  var a = (new Search).set({needle:"\\d+", regExp:true});
  assert.equal(a.replace("123", "kinners"), "kinners");
  assert.equal(a.replace("01234", "kinners"), "kinners");
  assert.equal(a.replace("", "kinners"), null);
  assert.equal(a.replace("a12", "kinners"), null);
  assert.equal(a.replace("12a", "kinners"), null)
}, "test: replace with RegExp match and capture groups":function() {
  var a = (new Search).set({needle:"ab(\\d\\d)", regExp:true});
  assert.equal(a.replace("ab12", "cd$1"), "cd12");
  assert.equal(a.replace("ab12", "-$&-"), "-ab12-");
  assert.equal(a.replace("ab12", "$$"), "$")
}};
module.exports = require("async/test").testcase(Test);
module === require.main && module.exports.exec();