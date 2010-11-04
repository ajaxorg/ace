/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/Document", "ace/Search"], function(c, b) {
  new TestCase("SearchTest", {"test: configure the search object":function() {
    (new b).set({needle:"juhu", scope:b.ALL})
  }, "test: find simple text in document":function() {
    var a = new c(["juhu kinners 123", "456"]);
    a = (new b).set({needle:"kinners"}).find(a);
    assertPosition(0, 5, a.start);
    assertPosition(0, 12, a.end)
  }, "test: find simple text in next line":function() {
    var a = new c(["abc", "juhu kinners 123", "456"]);
    a = (new b).set({needle:"kinners"}).find(a);
    assertPosition(1, 5, a.start);
    assertPosition(1, 12, a.end)
  }, "test: find text starting at cursor position":function() {
    var a = new c(["juhu kinners", "juhu kinners 123"]);
    a.getSelection().moveCursorTo(0, 6);
    a = (new b).set({needle:"kinners"}).find(a);
    assertPosition(1, 5, a.start);
    assertPosition(1, 12, a.end)
  }, "test: wrap search is off by default":function() {
    var a = new c(["abc", "juhu kinners 123", "456"]);
    a.getSelection().moveCursorTo(2, 1);
    var d = (new b).set({needle:"kinners"});
    assertEquals(null, d.find(a))
  }, "test: wrap search should wrap at file end":function() {
    var a = new c(["abc", "juhu kinners 123", "456"]);
    a.getSelection().moveCursorTo(2, 1);
    a = (new b).set({needle:"kinners", wrap:true}).find(a);
    assertPosition(1, 5, a.start);
    assertPosition(1, 12, a.end)
  }, "test: wrap search with no match should return 'null'":function() {
    var a = new c(["abc", "juhu kinners 123", "456"]);
    a.getSelection().moveCursorTo(2, 1);
    var d = (new b).set({needle:"xyz", wrap:true});
    assertEquals(null, d.find(a))
  }, "test: case sensitive is by default off":function() {
    var a = new c(["abc", "juhu kinners 123", "456"]), d = (new b).set({needle:"JUHU"});
    assertEquals(null, d.find(a))
  }, "test: case sensitive search":function() {
    var a = new c(["abc", "juhu kinners 123", "456"]);
    a = (new b).set({needle:"KINNERS", caseSensitive:true}).find(a);
    assertPosition(1, 5, a.start);
    assertPosition(1, 12, a.end)
  }, "test: whole word search should not match inside of words":function() {
    var a = new c(["juhukinners", "juhu kinners 123", "456"]);
    a = (new b).set({needle:"kinners", wholeWord:true}).find(a);
    assertPosition(1, 5, a.start);
    assertPosition(1, 12, a.end)
  }, "test: find backwards":function() {
    var a = new c(["juhu juhu juhu juhu"]);
    a.getSelection().moveCursorTo(0, 10);
    a = (new b).set({needle:"juhu", backwards:true}).find(a);
    assertPosition(0, 5, a.start);
    assertPosition(0, 9, a.end)
  }, "test: find in selection":function() {
    var a = new c(["juhu", "juhu", "juhu", "juhu"]);
    a.getSelection().setSelectionAnchor(1, 0);
    a.getSelection().selectTo(3, 5);
    var d = (new b).set({needle:"juhu", wrap:true, scope:b.SELECTION}), e = d.find(a);
    assertPosition(1, 0, e.start);
    assertPosition(1, 4, e.end);
    a.getSelection().setSelectionAnchor(0, 2);
    a.getSelection().selectTo(3, 2);
    e = d.find(a);
    assertPosition(1, 0, e.start);
    assertPosition(1, 4, e.end)
  }, "test: find backwards in selection":function() {
    var a = new c(["juhu", "juhu", "juhu", "juhu"]), d = (new b).set({needle:"juhu", wrap:true, backwards:true, scope:b.SELECTION});
    a.getSelection().setSelectionAnchor(0, 2);
    a.getSelection().selectTo(3, 2);
    var e = d.find(a);
    assertPosition(2, 0, e.start);
    assertPosition(2, 4, e.end);
    a.getSelection().setSelectionAnchor(0, 2);
    a.getSelection().selectTo(1, 2);
    assertEquals(null, d.find(a))
  }, "test: edge case - match directly before the cursor":function() {
    var a = new c(["123", "123", "juhu"]), d = (new b).set({needle:"juhu", wrap:true});
    a.getSelection().moveCursorTo(2, 5);
    a = d.find(a);
    assertPosition(2, 0, a.start);
    assertPosition(2, 4, a.end)
  }, "test: edge case - match backwards directly after the cursor":function() {
    var a = new c(["123", "123", "juhu"]), d = (new b).set({needle:"juhu", wrap:true, backwards:true});
    a.getSelection().moveCursorTo(2, 0);
    a = d.find(a);
    assertPosition(2, 0, a.start);
    assertPosition(2, 4, a.end)
  }, "test: find using a regular expression":function() {
    var a = new c(["abc123 123 cd", "abc"]);
    a = (new b).set({needle:"\\d+", regExp:true}).find(a);
    assertPosition(0, 3, a.start);
    assertPosition(0, 6, a.end)
  }, "test: find using a regular expression and whole word":function() {
    var a = new c(["abc123 123 cd", "abc"]);
    a = (new b).set({needle:"\\d+\\b", regExp:true, wholeWord:true}).find(a);
    assertPosition(0, 7, a.start);
    assertPosition(0, 10, a.end)
  }, "test: use regular expressions with capture groups":function() {
    var a = new c(["  ab: 12px", "  <h1 abc"]);
    a = (new b).set({needle:"(\\d+)", regExp:true}).find(a);
    assertPosition(0, 6, a.start);
    assertPosition(0, 8, a.end)
  }, "test: find all matches in selection":function() {
    var a = new c(["juhu", "juhu", "juhu", "juhu"]), d = (new b).set({needle:"uh", wrap:true, scope:b.SELECTION});
    a.getSelection().setSelectionAnchor(0, 2);
    a.getSelection().selectTo(3, 2);
    a = d.findAll(a);
    assertEquals(2, a.length);
    assertPosition(1, 1, a[0].start);
    assertPosition(1, 3, a[0].end);
    assertPosition(2, 1, a[1].start);
    assertPosition(2, 3, a[1].end)
  }, "test: replace() should return the replacement if the input matches the needle":function() {
    var a = (new b).set({needle:"juhu"});
    assertEquals("kinners", a.replace("juhu", "kinners"));
    assertEquals(null, a.replace("", "kinners"));
    assertEquals(null, a.replace(" juhu", "kinners"))
  }, "test: replace with a RegExp search":function() {
    var a = (new b).set({needle:"\\d+", regExp:true});
    assertEquals("kinners", a.replace("123", "kinners"));
    assertEquals("kinners", a.replace("01234", "kinners"));
    assertEquals(null, a.replace("", "kinners"));
    assertEquals(null, a.replace("a12", "kinners"));
    assertEquals(null, a.replace("12a", "kinners"))
  }, "test: replace with RegExp match and capture groups":function() {
    var a = (new b).set({needle:"ab(\\d\\d)", regExp:true});
    assertEquals("cd12", a.replace("ab12", "cd$1"));
    assertEquals("-ab12-", a.replace("ab12", "-$&-"));
    assertEquals("$", a.replace("ab12", "$$"))
  }})
});