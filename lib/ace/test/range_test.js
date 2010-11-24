/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require("../../../support/paths");

var Range   = require("../range"),
    assert  = require("./assertions");

var Test = {
    "test: create range": function() {
        var range = new Range(1,2,3,4);

        assert.equal(range.start.row, 1);
        assert.equal(range.start.column, 2);
        assert.equal(range.end.row, 3);
        assert.equal(range.end.column, 4);
    },

    "test: create from points": function() {
        var range = Range.fromPoints({row: 1, column: 2}, {row:3, column:4});

        assert.equal(range.start.row, 1);
        assert.equal(range.start.column, 2);
        assert.equal(range.end.row, 3);
        assert.equal(range.end.column, 4);
    },

    "test: clip to rows": function() {
        assert.range(new Range(0, 20, 100, 30).clipRows(10, 30), 10, 0, 31, 0);
        assert.range(new Range(0, 20, 30, 10).clipRows(10, 30), 10, 0, 30, 10);

        var range = new Range(0, 20, 3, 10);
        var range = range.clipRows(10, 30);

        assert.true(range.isEmpty());
        assert.range(range, 10, 0, 10, 0);
    },

    "test: isEmpty": function() {
        var range = new Range(1, 2, 1, 2);
        assert.true(range.isEmpty());

        var range = new Range(1, 2, 1, 6);
        assert.false(range.isEmpty());
    },

    "test: is multi line": function() {
        var range = new Range(1, 2, 1, 6);
        assert.false(range.isMultiLine());

        var range = new Range(1, 2, 2, 6);
        assert.true(range.isMultiLine());
    },

    "test: clone": function() {
        var range = new Range(1, 2, 3, 4);
        var clone = range.clone();

        assert.position(clone.start, 1, 2);
        assert.position(clone.end, 3, 4);

        clone.start.column = 20;
        assert.position(range.start, 1, 2);

        clone.end.column = 20;
        assert.position(range.end, 3, 4);
    },

    "test: contains for multi line ranges": function() {
        var range = new Range(1, 10, 5, 20);

        assert.true(range.contains(1, 10));
        assert.true(range.contains(2, 0));
        assert.true(range.contains(3, 100));
        assert.true(range.contains(5, 19));
        assert.true(range.contains(5, 20));

        assert.false(range.contains(1, 9));
        assert.false(range.contains(0, 0));
        assert.false(range.contains(5, 21));
    },

    "test: contains for single line ranges": function() {
        var range = new Range(1, 10, 1, 20);

        assert.true(range.contains(1, 10));
        assert.true(range.contains(1, 15));
        assert.true(range.contains(1, 20));

        assert.false(range.contains(0, 9));
        assert.false(range.contains(2, 9));
        assert.false(range.contains(1, 9));
        assert.false(range.contains(1, 21));
    },

    "test: extend range": function() {
        var range = new Range(2, 10, 2, 30);

        var range = range.extend(2, 5);
        assert.range(range, 2, 5, 2, 30);
        
        var range = range.extend(2, 35);
        assert.range(range, 2, 5, 2, 35);
        
        var range = range.extend(2, 15);
        assert.range(range, 2, 5, 2, 35);
        
        var range = range.extend(1, 4);
        assert.range(range, 1, 4, 2, 35);
        
        var range = range.extend(6, 10);
        assert.range(range, 1, 4, 6, 10);
    }
};

module.exports = require("async/test").testcase(Test);

if (module === require.main)
    module.exports.exec()