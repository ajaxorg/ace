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

define(function(require, exports, module) {
"use strict";

/**
 * class Range
 *
 * This object is used in various places to indicate a region within the editor. To better visualize how this works, imagine a rectangle. Each quadrant of the rectangle is analogus to a range, as ranges contain a starting row and starting column, and an ending row, and ending column.
 *
 **/

/**
 * new Range(startRow, startColumn, endRow, endColumn)
 * - startRow (Number): The starting row
 * - startColumn (Number): The starting column
 * - endRow (Number): The ending row
 * - endColumn (Number): The ending column
 *
 * Creates a new `Range` object with the given starting and ending row and column points.
 *
 **/
var Range = function(startRow, startColumn, endRow, endColumn) {
    this.start = {
        row: startRow,
        column: startColumn
    };

    this.end = {
        row: endRow,
        column: endColumn
    };
};

(function() {
    /**
     * Range.isEqual(range) -> Boolean
     * - range (Range): A range to check against
     *
     * Returns `true` if and only if the starting row and column, and ending tow and column, are equivalent to those given by `range`.
     *
     **/ 
    this.isEqual = function(range) {
        return this.start.row == range.start.row &&
            this.end.row == range.end.row &&
            this.start.column == range.start.column &&
            this.end.column == range.end.column
    };

    /**
     * Range.toString() -> String
     *
     * Returns a string containing the range's row and column information, given like this:
     *
     *    [start.row/start.column] -> [end.row/end.column]
     *
     **/ 
    this.toString = function() {
        return ("Range: [" + this.start.row + "/" + this.start.column +
            "] -> [" + this.end.row + "/" + this.end.column + "]");
    };

    /** related to: Range.compare
     * Range.contains(row, column) -> Boolean
     * - row (Number): A row to check for
     * - column (Number): A column to check for
     *
     * Returns `true` if the `row` and `column` provided are within the given range. This can better be expressed as returning `true` if:
     *
     *    this.start.row <= row <= this.end.row &&
     *    this.start.column <= column <= this.end.column
     *
     **/ 

    this.contains = function(row, column) {
        return this.compare(row, column) == 0;
    };

    /** related to: Range.compare
     * Range.compareRange(range) -> Number
     * - range (Range): A range to compare with
     * + (Number): This method returns one of the following numbers:<br/>
     * <br/>
     * * `-2`: (B) is in front of (A), and doesn't intersect with (A)<br/>
     * * `-1`: (B) begins before (A) but ends inside of (A)<br/>
     * * `0`: (B) is completely inside of (A) OR (A) is completely inside of (B)<br/>
     * * `+1`: (B) begins inside of (A) but ends outside of (A)<br/>
     * * `+2`: (B) is after (A) and doesn't intersect with (A)<br/>
     * * `42`: FTW state: (B) ends in (A) but starts outside of (A)
     * 
     * Compares `this` range (A) with another range (B).
     *
     **/ 
    this.compareRange = function(range) {
        var cmp,
            end = range.end,
            start = range.start;

        cmp = this.compare(end.row, end.column);
        if (cmp == 1) {
            cmp = this.compare(start.row, start.column);
            if (cmp == 1) {
                return 2;
            } else if (cmp == 0) {
                return 1;
            } else {
                return 0;
            }
        } else if (cmp == -1) {
            return -2;
        } else {
            cmp = this.compare(start.row, start.column);
            if (cmp == -1) {
                return -1;
            } else if (cmp == 1) {
                return 42;
            } else {
                return 0;
            }
        }
    }

    /** related to: Range.compare
     * Range.comparePoint(p) -> Number
     * - p (Range): A point to compare with
     * + (Number): This method returns one of the following numbers:<br/>
     * * `0` if the two points are exactly equal<br/>
     * * `-1` if `p.row` is less then the calling range<br/>
     * * `1` if `p.row` is greater than the calling range<br/>
     * <br/>
     * If the starting row of the calling range is equal to `p.row`, and:<br/>
     * * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
     * * Otherwise, it returns -1<br/>
     *<br/>
     * If the ending row of the calling range is equal to `p.row`, and:<br/>
     * * `p.column` is less than or equal to the calling range's ending column, this returns `0`<br/>
     * * Otherwise, it returns 1<br/>
     *
     * Checks the row and column points of `p` with the row and column points of the calling range.
     *
     * 
     *
     **/ 
    this.comparePoint = function(p) {
        return this.compare(p.row, p.column);
    }

    /** related to: Range.comparePoint
     * Range.containsRange(range) -> Boolean
     * - range (Range): A range to compare with
     *
     * Checks the start and end points of `range` and compares them to the calling range. Returns `true` if the `range` is contained within the caller's range.
     *
     **/ 
    this.containsRange = function(range) {
        return this.comparePoint(range.start) == 0 && this.comparePoint(range.end) == 0;
    }

    /**
     * Range.intersects(range) -> Boolean
     * - range (Range): A range to compare with
     *
     * Returns `true` if passed in `range` intersects with the one calling this method.
     *
     **/
    this.intersects = function(range) {
        var cmp = this.compareRange(range);
        return (cmp == -1 || cmp == 0 || cmp == 1);
    }

    /**
     * Range.isEnd(row, column) -> Boolean
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     *
     * Returns `true` if the caller's ending row point is the same as `row`, and if the caller's ending column is the same as `column`.
     *
     **/
    this.isEnd = function(row, column) {
        return this.end.row == row && this.end.column == column;
    }

    /**
     * Range.isStart(row, column) -> Boolean
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     *
     * Returns `true` if the caller's starting row point is the same as `row`, and if the caller's starting column is the same as `column`.
     *
     **/ 
    this.isStart = function(row, column) {
        return this.start.row == row && this.start.column == column;
    }

    /**
     * Range.setStart(row, column)
     * - row (Number): A row point to set
     * - column (Number): A column point to set
     *
     * Sets the starting row and column for the range.
     *
     **/ 
    this.setStart = function(row, column) {
        if (typeof row == "object") {
            this.start.column = row.column;
            this.start.row = row.row;
        } else {
            this.start.row = row;
            this.start.column = column;
        }
    }

    /**
     * Range.setEnd(row, column)
     * - row (Number): A row point to set
     * - column (Number): A column point to set
     *
     * Sets the starting row and column for the range.
     *
     **/ 
    this.setEnd = function(row, column) {
        if (typeof row == "object") {
            this.end.column = row.column;
            this.end.row = row.row;
        } else {
            this.end.row = row;
            this.end.column = column;
        }
    }

    /** related to: Range.compare
     * Range.inside(row, column) -> Boolean
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     *
     * Returns `true` if the `row` and `column` are within the given range.
     *
     **/ 
    this.inside = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column) || this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    /** related to: Range.compare
     * Range.insideStart(row, column) -> Boolean
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     *
     * Returns `true` if the `row` and `column` are within the given range's starting points.
     *
     **/ 
    this.insideStart = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    /** related to: Range.compare
     * Range.insideEnd(row, column) -> Boolean
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     *
     * Returns `true` if the `row` and `column` are within the given range's ending points.
     *
     **/ 
    this.insideEnd = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    /** 
     * Range.compare(row, column) -> Number
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     * + (Number): This method returns one of the following numbers:<br/>
     * * `0` if the two points are exactly equal <br/>
     * * `-1` if `p.row` is less then the calling range <br/>
     * * `1` if `p.row` is greater than the calling range <br/>
     *  <br/>
     * If the starting row of the calling range is equal to `p.row`, and: <br/>
     * * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
     * * Otherwise, it returns -1<br/>
     * <br/>
     * If the ending row of the calling range is equal to `p.row`, and: <br/>
     * * `p.column` is less than or equal to the calling range's ending column, this returns `0` <br/>
     * * Otherwise, it returns 1
     *
     * Checks the row and column points with the row and column points of the calling range.
     *
     *
     **/
    this.compare = function(row, column) {
        if (!this.isMultiLine()) {
            if (row === this.start.row) {
                return column < this.start.column ? -1 : (column > this.end.column ? 1 : 0);
            };
        }

        if (row < this.start.row)
            return -1;

        if (row > this.end.row)
            return 1;

        if (this.start.row === row)
            return column >= this.start.column ? 0 : -1;

        if (this.end.row === row)
            return column <= this.end.column ? 0 : 1;

        return 0;
    };

    /**
     * Range.compareStart(row, column) -> Number
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     * + (Number): This method returns one of the following numbers:<br/>
     * <br/>
     * * `0` if the two points are exactly equal<br/>
     * * `-1` if `p.row` is less then the calling range<br/>
     * * `1` if `p.row` is greater than the calling range, or if `isStart` is `true`.<br/>
     * <br/>
     * If the starting row of the calling range is equal to `p.row`, and:<br/>
     * * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
     * * Otherwise, it returns -1<br/>
     * <br/>
     * If the ending row of the calling range is equal to `p.row`, and:<br/>
     * * `p.column` is less than or equal to the calling range's ending column, this returns `0`<br/>
     * * Otherwise, it returns 1
     *
     * Checks the row and column points with the row and column points of the calling range.
     *
     *
     *
     **/
    this.compareStart = function(row, column) {
        if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    }

    /**
     * Range.compareEnd(row, column) -> Number
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     * + (Number): This method returns one of the following numbers:<br/>
     * * `0` if the two points are exactly equal<br/>
     * * `-1` if `p.row` is less then the calling range<br/>
     * * `1` if `p.row` is greater than the calling range, or if `isEnd` is `true.<br/>
     * <br/>
     * If the starting row of the calling range is equal to `p.row`, and:<br/>
     * * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
     * * Otherwise, it returns -1<br/>
     *<br/>
     * If the ending row of the calling range is equal to `p.row`, and:<br/>
     * * `p.column` is less than or equal to the calling range's ending column, this returns `0`<br/>
     * * Otherwise, it returns 1
     *
     * Checks the row and column points with the row and column points of the calling range.
     *
     *
     **/
    this.compareEnd = function(row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else {
            return this.compare(row, column);
        }
    }

    /** 
     * Range.compareInside(row, column) -> Number
     * - row (Number): A row point to compare with
     * - column (Number): A column point to compare with
     * + (Number): This method returns one of the following numbers:<br/>
     * * `1` if the ending row of the calling range is equal to `row`, and the ending column of the calling range is equal to `column`<br/>
     * * `-1` if the starting row of the calling range is equal to `row`, and the starting column of the calling range is equal to `column`<br/>
     * <br/>
     * Otherwise, it returns the value after calling [[Range.compare `compare()`]].
     *
     * Checks the row and column points with the row and column points of the calling range.
     *
     *
     *
     **/
    this.compareInside = function(row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    }

    /** 
     * Range.clipRows(firstRow, lastRow) -> Range
     * - firstRow (Number): The starting row
     * - lastRow (Number): The ending row
     *
     * Returns the part of the current `Range` that occurs within the boundaries of `firstRow` and `lastRow` as a new `Range` object.
     *
    **/
    this.clipRows = function(firstRow, lastRow) {
        if (this.end.row > lastRow) {
            var end = {
                row: lastRow+1,
                column: 0
            };
        }

        if (this.start.row > lastRow) {
            var start = {
                row: lastRow+1,
                column: 0
            };
        }

        if (this.start.row < firstRow) {
            var start = {
                row: firstRow,
                column: 0
            };
        }

        if (this.end.row < firstRow) {
            var end = {
                row: firstRow,
                column: 0
            };
        }
        return Range.fromPoints(start || this.start, end || this.end);
    };

    /** 
     * Range.extend(row, column) -> Range
     * - row (Number): A new row to extend to
     * - column (Number): A new column to extend to
     *
     *  Changes the row and column points for the calling range for both the starting and ending points. This method returns that range with a new row.
     *
    **/
    this.extend = function(row, column) {
        var cmp = this.compare(row, column);

        if (cmp == 0)
            return this;
        else if (cmp == -1)
            var start = {row: row, column: column};
        else
            var end = {row: row, column: column};

        return Range.fromPoints(start || this.start, end || this.end);
    };

    this.isEmpty = function() {
        return (this.start.row == this.end.row && this.start.column == this.end.column);
    };

    /** 
     * Range.isMultiLine() -> Boolean
     *
     * Returns true if the range spans across multiple lines.
     *
    **/
    this.isMultiLine = function() {
        return (this.start.row !== this.end.row);
    };

    /** 
     * Range.clone() -> Range
     *
     * Returns a duplicate of the calling range.
     *
    **/
    this.clone = function() {
        return Range.fromPoints(this.start, this.end);
    };

    /** 
     * Range.collapseRows() -> Range
     *
     * Returns a range containing the starting and ending rows of the original range, but with a column value of `0`.
     *
    **/
    this.collapseRows = function() {
        if (this.end.column == 0)
            return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row-1), 0)
        else
            return new Range(this.start.row, 0, this.end.row, 0)
    };

    /** 
     * Range.toScreenRange(session) -> Range
     * - session (EditSession): The `EditSession` to retrieve coordinates from
     * 
     * Given the current `Range`, this function converts those starting and ending points into screen positions, and then returns a new `Range` object.
    **/
    this.toScreenRange = function(session) {
        var screenPosStart =
            session.documentToScreenPosition(this.start);
        var screenPosEnd =
            session.documentToScreenPosition(this.end);

        return new Range(
            screenPosStart.row, screenPosStart.column,
            screenPosEnd.row, screenPosEnd.column
        );
    };

}).call(Range.prototype);

/** 
 * Range.fromPoints(start, end) -> Range
 * - start (Range): A starting point to use
 * - end (Range): An ending point to use
 * 
 * Creates and returns a new `Range` based on the row and column of the given parameters.
 *
**/
Range.fromPoints = function(start, end) {
    return new Range(start.row, start.column, end.row, end.column);
};

exports.Range = Range;
});
