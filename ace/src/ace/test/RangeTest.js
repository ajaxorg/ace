/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require.def([
     "ace/Range"
 ], function(
     Range
 ) {

RangeTest = new TestCase("RangeTest", {

    "test: create range": function() {
        var range = new Range(1,2,3,4);

        assertEquals(1, range.start.row);
        assertEquals(2, range.start.column);
        assertEquals(3, range.end.row);
        assertEquals(4, range.end.column);
    },

    "test: create from points": function() {
        var range = Range.fromPoints({row: 1, column: 2}, {row:3, column:4});

        assertEquals(1, range.start.row);
        assertEquals(2, range.start.column);
        assertEquals(3, range.end.row);
        assertEquals(4, range.end.column);
    },

    "test: clip to rows": function() {
        assertRange(10, 0, 31, 0, new Range(0, 20, 100, 30).clipRows(10, 30));
        assertRange(10, 0, 30, 10, new Range(0, 20, 30, 10).clipRows(10, 30));

        var range = new Range(0, 20, 3, 10);
        var range = range.clipRows(10, 30);

        assertTrue(range.isEmpty());
        assertRange(10, 0, 10, 0, range);
    },

    "test: isEmpty": function() {
        var range = new Range(1, 2, 1, 2);
        assertTrue(range.isEmpty());

        var range = new Range(1, 2, 1, 6);
        assertFalse(range.isEmpty());
    },

    "test: is multi line": function() {
        var range = new Range(1, 2, 1, 6);
        assertFalse(range.isMultiLine());

        var range = new Range(1, 2, 2, 6);
        assertTrue(range.isMultiLine());
    },

    "test: clone": function() {
        var range = new Range(1, 2, 3, 4);
        var clone = range.clone();

        assertPosition(1, 2, clone.start);
        assertPosition(3, 4, clone.end);

        clone.start.column = 20;
        assertPosition(1, 2, range.start);

        clone.end.column = 20;
        assertPosition(3, 4, range.end);
    },

    "test: contains for multi line ranges": function() {
        var range = new Range(1, 10, 5, 20);

        assertTrue(range.contains(1, 10));
        assertTrue(range.contains(2, 0));
        assertTrue(range.contains(3, 100));
        assertTrue(range.contains(5, 19));
        assertTrue(range.contains(5, 20));

        assertFalse(range.contains(1, 9));
        assertFalse(range.contains(0, 0));
        assertFalse(range.contains(5, 21));
    },

    "test: contains for single line ranges": function() {
        var range = new Range(1, 10, 1, 20);

        assertTrue(range.contains(1, 10));
        assertTrue(range.contains(1, 15));
        assertTrue(range.contains(1, 20));

        assertFalse(range.contains(0, 9));
        assertFalse(range.contains(2, 9));
        assertFalse(range.contains(1, 9));
        assertFalse(range.contains(1, 21));
    },

    "test: extend range": function() {
        var range = new Range(2, 10, 2, 30);

        var range = range.extend(2, 5);
        assertRange(2, 5, 2, 30, range);

        var range = range.extend(2, 35);
        assertRange(2, 5, 2, 35, range);

        var range = range.extend(2, 15);
        assertRange(2, 5, 2, 35, range);

        var range = range.extend(1, 4);
        assertRange(1, 4, 2, 35, range);

        var range = range.extend(6, 10);
        assertRange(1, 4, 6, 10, range);
    }
});

});