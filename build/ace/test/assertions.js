/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def([], function() {
  window.assertPosition = function(a, b, c) {
    assertEquals(a, c.row);
    assertEquals(b, c.column)
  };
  window.assertRange = function(a, b, c, e, d) {
    assertPosition(a, b, d.start);
    assertPosition(c, e, d.end)
  };
  window.assertJsonEquals = function(a, b) {
    assertEquals(JSON.stringify(a), JSON.stringify(b))
  }
});