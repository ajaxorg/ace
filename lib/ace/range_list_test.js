/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

var Range = require("./range").Range;
var RangeList = require("./range_list").RangeList;
var EditSession = require("./edit_session").EditSession;
var assert = require("./test/assertions");

function flatten(rangeList) {
    var points = [];
    rangeList.ranges.forEach(function(r) {
        points.push(r.start.row, r.start.column, r.end.row, r.end.column)
    })
    return points;
}
function testRangeList(rangeList, points) {
    assert.equal("" + flatten(rangeList), "" + points);
}

module.exports = {

    name: "ACE range_list.js",

    "test: rangeList pointIndex": function() {
        var rangeList = new RangeList();
        rangeList.ranges = [
            new Range(1,2,3,4),
            new Range(4,2,5,4),
            new Range(8,8,9,9)
        ];

        assert.equal(rangeList.pointIndex({row: 0, column: 1}), -1);
        assert.equal(rangeList.pointIndex({row: 1, column: 2}), 0);
        assert.equal(rangeList.pointIndex({row: 1, column: 3}), 0);
        assert.equal(rangeList.pointIndex({row: 3, column: 4}), 0);
        assert.equal(rangeList.pointIndex({row: 4, column: 1}), -2);
        assert.equal(rangeList.pointIndex({row: 5, column: 1}), 1);
        assert.equal(rangeList.pointIndex({row: 8, column: 9}), 2);
        assert.equal(rangeList.pointIndex({row: 18, column: 9}), -4);
    },

    "test: rangeList add": function() {
        var rangeList = new RangeList();
        rangeList.addList([
            new Range(9,0,9,1),
            new Range(1,2,3,4),
            new Range(8,8,9,9),
            new Range(4,2,5,4),
            new Range(3,20,3,24),
            new Range(6,6,7,7)
        ]);
        assert.equal(rangeList.ranges.length, 5);

        rangeList.add(new Range(1,2,3,5));
        assert.range(rangeList.ranges[0], 1,2,3,5);
        assert.equal(rangeList.ranges.length, 5);

        rangeList.add(new Range(7,7,7,7));
        assert.range(rangeList.ranges[3], 7,7,7,7);
        rangeList.add(new Range(7,8,7,8));
        assert.range(rangeList.ranges[4], 7,8,7,8);
    },

    "test: rangeList add empty": function() {
        var rangeList = new RangeList();
        rangeList.addList([
            new Range(7,10,7,10),
            new Range(9,10,9,10),
            new Range(8,10,8,10)
        ]);
        assert.equal(rangeList.ranges.length, 3);

        rangeList.add(new Range(9,10,9,10));
        testRangeList(rangeList, [7,10,7,10,8,10,8,10,9,10,9,10]);
    },

    "test: rangeList merge": function() {
        var rangeList = new RangeList();
        rangeList.addList([
            new Range(1,2,3,4),
            new Range(4,2,5,4),
            new Range(6,6,7,7),
            new Range(8,8,9,9)
        ]);
        var removed = [];

        assert.equal(rangeList.ranges.length, 4);

        rangeList.ranges[1].end.row = 7;
        removed = rangeList.merge();
        assert.equal(removed.length, 1);
        assert.range(rangeList.ranges[1], 4,2,7,7);
        assert.equal(rangeList.ranges.length, 3);

        rangeList.ranges[0].end.row = 10;
        removed = rangeList.merge();
        assert.range(rangeList.ranges[0], 1,2,10,4);
        assert.equal(removed.length, 2);
        assert.equal(rangeList.ranges.length, 1);

        rangeList.ranges.push(new Range(10,10,10,10));
        rangeList.ranges.push(new Range(10,10,10,10));
        removed = rangeList.merge();
        assert.equal(rangeList.ranges.length, 2);
    },

    "test: rangeList remove": function() {
        var rangeList = new RangeList();
        var list = [
            new Range(1,2,3,4),
            new Range(4,2,5,4),
            new Range(6,6,7,7),
            new Range(8,8,9,9)
        ];
        rangeList.addList(list);
        assert.equal(rangeList.ranges.length, 4);
        rangeList.substractPoint({row: 1, column: 2});
        assert.equal(rangeList.ranges.length, 3);
        rangeList.substractPoint({row: 6, column: 7});
        assert.equal(rangeList.ranges.length, 2);
    }

};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
