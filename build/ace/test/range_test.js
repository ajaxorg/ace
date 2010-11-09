/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/Range"], function(b) {
  RangeTest = new TestCase("RangeTest", {"test: create range":function() {
    var a = new b(1, 2, 3, 4);
    assertEquals(1, a.start.row);
    assertEquals(2, a.start.column);
    assertEquals(3, a.end.row);
    assertEquals(4, a.end.column)
  }, "test: create from points":function() {
    var a = b.fromPoints({row:1, column:2}, {row:3, column:4});
    assertEquals(1, a.start.row);
    assertEquals(2, a.start.column);
    assertEquals(3, a.end.row);
    assertEquals(4, a.end.column)
  }, "test: clip to rows":function() {
    assertRange(10, 0, 31, 0, (new b(0, 20, 100, 30)).clipRows(10, 30));
    assertRange(10, 0, 30, 10, (new b(0, 20, 30, 10)).clipRows(10, 30));
    var a = new b(0, 20, 3, 10);
    a = a.clipRows(10, 30);
    assertTrue(a.isEmpty());
    assertRange(10, 0, 10, 0, a)
  }, "test: isEmpty":function() {
    var a = new b(1, 2, 1, 2);
    assertTrue(a.isEmpty());
    a = new b(1, 2, 1, 6);
    assertFalse(a.isEmpty())
  }, "test: is multi line":function() {
    var a = new b(1, 2, 1, 6);
    assertFalse(a.isMultiLine());
    a = new b(1, 2, 2, 6);
    assertTrue(a.isMultiLine())
  }, "test: clone":function() {
    var a = new b(1, 2, 3, 4), c = a.clone();
    assertPosition(1, 2, c.start);
    assertPosition(3, 4, c.end);
    c.start.column = 20;
    assertPosition(1, 2, a.start);
    c.end.column = 20;
    assertPosition(3, 4, a.end)
  }, "test: contains for multi line ranges":function() {
    var a = new b(1, 10, 5, 20);
    assertTrue(a.contains(1, 10));
    assertTrue(a.contains(2, 0));
    assertTrue(a.contains(3, 100));
    assertTrue(a.contains(5, 19));
    assertTrue(a.contains(5, 20));
    assertFalse(a.contains(1, 9));
    assertFalse(a.contains(0, 0));
    assertFalse(a.contains(5, 21))
  }, "test: contains for single line ranges":function() {
    var a = new b(1, 10, 1, 20);
    assertTrue(a.contains(1, 10));
    assertTrue(a.contains(1, 15));
    assertTrue(a.contains(1, 20));
    assertFalse(a.contains(0, 9));
    assertFalse(a.contains(2, 9));
    assertFalse(a.contains(1, 9));
    assertFalse(a.contains(1, 21))
  }, "test: extend range":function() {
    var a = new b(2, 10, 2, 30);
    a = a.extend(2, 5);
    assertRange(2, 5, 2, 30, a);
    a = a.extend(2, 35);
    assertRange(2, 5, 2, 35, a);
    a = a.extend(2, 15);
    assertRange(2, 5, 2, 35, a);
    a = a.extend(1, 4);
    assertRange(1, 4, 2, 35, a);
    a = a.extend(6, 10);
    assertRange(1, 4, 6, 10, a)
  }})
});