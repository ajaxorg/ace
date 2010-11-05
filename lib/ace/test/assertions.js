/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require.def([], function() {

window.assertPosition = function(row, column, cursor) {
    assertEquals(row, cursor.row);
    assertEquals(column, cursor.column);
};

window.assertRange = function(startRow, startColumn, endRow, endColumn, range) {
    assertPosition(startRow, startColumn, range.start);
    assertPosition(endRow, endColumn, range.end);
};

window.assertJsonEquals = function(expectedJson, foundJson) {
    assertEquals(JSON.stringify(expectedJson), JSON.stringify(foundJson));
};

});