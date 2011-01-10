define(function(g, h, i) {
  var d = g("../document").Document, c = g("../search").Search, b = g("./assertions");
  h = {"test: configure the search object":function() {
    (new c).set({needle:"juhu", scope:c.ALL})
  }, "test: find simple text in document":function() {
    var a = new d(["juhu kinners 123", "456"]);
    a = (new c).set({needle:"kinners"}).find(a);
    b.position(a.start, 0, 5);
    b.position(a.end, 0, 12)
  }, "test: find simple text in next line":function() {
    var a = new d(["abc", "juhu kinners 123", "456"]);
    a = (new c).set({needle:"kinners"}).find(a);
    b.position(a.start, 1, 5);
    b.position(a.end, 1, 12)
  }, "test: find text starting at cursor position":function() {
    var a = new d(["juhu kinners", "juhu kinners 123"]);
    a.getSelection().moveCursorTo(0, 6);
    a = (new c).set({needle:"kinners"}).find(a);
    b.position(a.start, 1, 5);
    b.position(a.end, 1, 12)
  }, "test: wrap search is off by default":function() {
    var a = new d(["abc", "juhu kinners 123", "456"]);
    a.getSelection().moveCursorTo(2, 1);
    var e = (new c).set({needle:"kinners"});
    b.equal(e.find(a), null)
  }, "test: wrap search should wrap at file end":function() {
    var a = new d(["abc", "juhu kinners 123", "456"]);
    a.getSelection().moveCursorTo(2, 1);
    a = (new c).set({needle:"kinners", wrap:true}).find(a);
    b.position(a.start, 1, 5);
    b.position(a.end, 1, 12)
  }, "test: wrap search with no match should return 'null'":function() {
    var a = new d(["abc", "juhu kinners 123", "456"]);
    a.getSelection().moveCursorTo(2, 1);
    var e = (new c).set({needle:"xyz", wrap:true});
    b.equal(e.find(a), null)
  }, "test: case sensitive is by default off":function() {
    var a = new d(["abc", "juhu kinners 123", "456"]), e = (new c).set({needle:"JUHU"});
    b.range(e.find(a), 1, 0, 1, 4)
  }, "test: case sensitive search":function() {
    var a = new d(["abc", "juhu kinners 123", "456"]);
    a = (new c).set({needle:"KINNERS", caseSensitive:true}).find(a);
    b.equal(a, null)
  }, "test: whole word search should not match inside of words":function() {
    var a = new d(["juhukinners", "juhu kinners 123", "456"]);
    a = (new c).set({needle:"kinners", wholeWord:true}).find(a);
    b.position(a.start, 1, 5);
    b.position(a.end, 1, 12)
  }, "test: find backwards":function() {
    var a = new d(["juhu juhu juhu juhu"]);
    a.getSelection().moveCursorTo(0, 10);
    a = (new c).set({needle:"juhu", backwards:true}).find(a);
    b.position(a.start, 0, 5);
    b.position(a.end, 0, 9)
  }, "test: find in selection":function() {
    var a = new d(["juhu", "juhu", "juhu", "juhu"]);
    a.getSelection().setSelectionAnchor(1, 0);
    a.getSelection().selectTo(3, 5);
    var e = (new c).set({needle:"juhu", wrap:true, scope:c.SELECTION}), f = e.find(a);
    b.position(f.start, 1, 0);
    b.position(f.end, 1, 4);
    a.getSelection().setSelectionAnchor(0, 2);
    a.getSelection().selectTo(3, 2);
    f = e.find(a);
    b.position(f.start, 1, 0);
    b.position(f.end, 1, 4)
  }, "test: find backwards in selection":function() {
    var a = new d(["juhu", "juhu", "juhu", "juhu"]), e = (new c).set({needle:"juhu", wrap:true, backwards:true, scope:c.SELECTION});
    a.getSelection().setSelectionAnchor(0, 2);
    a.getSelection().selectTo(3, 2);
    var f = e.find(a);
    b.position(f.start, 2, 0);
    b.position(f.end, 2, 4);
    a.getSelection().setSelectionAnchor(0, 2);
    a.getSelection().selectTo(1, 2);
    b.equal(e.find(a), null)
  }, "test: edge case - match directly before the cursor":function() {
    var a = new d(["123", "123", "juhu"]), e = (new c).set({needle:"juhu", wrap:true});
    a.getSelection().moveCursorTo(2, 5);
    a = e.find(a);
    b.position(a.start, 2, 0);
    b.position(a.end, 2, 4)
  }, "test: edge case - match backwards directly after the cursor":function() {
    var a = new d(["123", "123", "juhu"]), e = (new c).set({needle:"juhu", wrap:true, backwards:true});
    a.getSelection().moveCursorTo(2, 0);
    a = e.find(a);
    b.position(a.start, 2, 0);
    b.position(a.end, 2, 4)
  }, "test: find using a regular expression":function() {
    var a = new d(["abc123 123 cd", "abc"]);
    a = (new c).set({needle:"\\d+", regExp:true}).find(a);
    b.position(a.start, 0, 3);
    b.position(a.end, 0, 6)
  }, "test: find using a regular expression and whole word":function() {
    var a = new d(["abc123 123 cd", "abc"]);
    a = (new c).set({needle:"\\d+\\b", regExp:true, wholeWord:true}).find(a);
    b.position(a.start, 0, 7);
    b.position(a.end, 0, 10)
  }, "test: use regular expressions with capture groups":function() {
    var a = new d(["  ab: 12px", "  <h1 abc"]);
    a = (new c).set({needle:"(\\d+)", regExp:true}).find(a);
    b.position(a.start, 0, 6);
    b.position(a.end, 0, 8)
  }, "test: find all matches in selection":function() {
    var a = new d(["juhu", "juhu", "juhu", "juhu"]), e = (new c).set({needle:"uh", wrap:true, scope:c.SELECTION});
    a.getSelection().setSelectionAnchor(0, 2);
    a.getSelection().selectTo(3, 2);
    a = e.findAll(a);
    b.equal(a.length, 2);
    b.position(a[0].start, 1, 1);
    b.position(a[0].end, 1, 3);
    b.position(a[1].start, 2, 1);
    b.position(a[1].end, 2, 3)
  }, "test: replace() should return the replacement if the input matches the needle":function() {
    var a = (new c).set({needle:"juhu"});
    b.equal(a.replace("juhu", "kinners"), "kinners");
    b.equal(a.replace("", "kinners"), null);
    b.equal(a.replace(" juhu", "kinners"), null)
  }, "test: replace with a RegExp search":function() {
    var a = (new c).set({needle:"\\d+", regExp:true});
    b.equal(a.replace("123", "kinners"), "kinners");
    b.equal(a.replace("01234", "kinners"), "kinners");
    b.equal(a.replace("", "kinners"), null);
    b.equal(a.replace("a12", "kinners"), null);
    b.equal(a.replace("12a", "kinners"), null)
  }, "test: replace with RegExp match and capture groups":function() {
    var a = (new c).set({needle:"ab(\\d\\d)", regExp:true});
    b.equal(a.replace("ab12", "cd$1"), "cd12");
    b.equal(a.replace("ab12", "-$&-"), "-ab12-");
    b.equal(a.replace("ab12", "$$"), "$")
  }};
  i.exports = g("async/test").testcase(h)
});
if(module === require.main) {
  require("../../../support/paths");
  exports.exec()
};