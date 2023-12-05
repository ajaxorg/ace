"use strict";

/**
 * @typedef {import("./edit_session").EditSession} EditSession
 * @typedef {import("../ace-internal").Ace.IRange} IRange
 * @typedef {import("../ace-internal").Ace.Point} Point
 */
/**
 * This object is used in various places to indicate a region within the editor. To better visualize how this works, imagine a rectangle. Each quadrant of the rectangle is analogous to a range, as ranges contain a starting row and starting column, and an ending row, and ending column.
 **/
class Range {
    /**
     * Creates a new `Range` object with the given starting and ending rows and columns.
     * @param {Number} [startRow] The starting row
     * @param {Number} [startColumn] The starting column
     * @param {Number} [endRow] The ending row
     * @param {Number} [endColumn] The ending column
     * @constructor
     **/
    constructor(startRow, startColumn, endRow, endColumn) {
        /**@type {Point}*/
        this.start = {
            row: startRow,
            column: startColumn
        };
        /**@type {Point}*/
        this.end = {
            row: endRow,
            column: endColumn
        };
    }
    
    /**
     * Returns `true` if and only if the starting row and column, and ending row and column, are equivalent to those given by `range`.
     * @param {IRange} range A range to check against
     * @return {Boolean}
     **/
    isEqual(range) {
        return this.start.row === range.start.row &&
            this.end.row === range.end.row &&
            this.start.column === range.start.column &&
            this.end.column === range.end.column;
    }

    /**
     * Returns a string containing the range's row and column information, given like this:
     * ```
     *    [start.row/start.column] -> [end.row/end.column]
     * ```
     * @return {String}
     **/
    toString() {
        return ("Range: [" + this.start.row + "/" + this.start.column +
            "] -> [" + this.end.row + "/" + this.end.column + "]");
    }

    /**
     * Returns `true` if the `row` and `column` provided are within the given range. This can better be expressed as returning `true` if:
     * ```javascript
     *    this.start.row <= row <= this.end.row &&
     *    this.start.column <= column <= this.end.column
     * ```
     * @param {Number} row A row to check for
     * @param {Number} column A column to check for
     * @returns {Boolean}
     * @related [[Range.compare]]
     **/

    contains(row, column) {
        return this.compare(row, column) == 0;
    }

    /**
     * Compares `this` range (A) with another range (B).
     * @param {IRange} range A range to compare with
     * @related [[Range.compare]]
     * @returns {Number} This method returns one of the following numbers:
     * * `-2`: (B) is in front of (A), and doesn't intersect with (A)
     * * `-1`: (B) begins before (A) but ends inside of (A)
     * * `0`: (B) is completely inside of (A)
     * * `+1`: (B) begins inside of (A) but ends outside of (A)
     * * `+2`: (B) is after (A) and doesn't intersect with (A)
     * * `42`: FTW state: (B) ends in (A) but starts outside of (A)
     **/
    compareRange(range) {
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

    /**
     * Compares the row and column of `p` with the starting and ending [[Point]]'s of the calling range (by calling [[Range.compare]]).
     * @param {Point} p A point to compare with
     * @related [[Range.compare]]
     * @returns {Number}
     **/
    comparePoint(p) {
        return this.compare(p.row, p.column);
    }

    /**
     * Checks the start and end [[Point]]'s of `range` and compares them to the calling range. Returns `true` if the `range` is contained within the caller's range.
     * @param {IRange} range A range to compare with
     * @returns {Boolean}
     * @related [[Range.comparePoint]]
     **/
    containsRange(range) {
        return this.comparePoint(range.start) == 0 && this.comparePoint(range.end) == 0;
    }

    /**
     * Returns `true` if passed in `range` intersects with the one calling this method.
     * @param {IRange} range A range to compare with
     * @returns {Boolean}
     **/
    intersects(range) {
        var cmp = this.compareRange(range);
        return (cmp == -1 || cmp == 0 || cmp == 1);
    }

    /**
     * Returns `true` if the caller's ending row is the same as `row`, and if the caller's ending column is the same as `column`.
     * @param {Number} row A row to compare with
     * @param {Number} column A column to compare with
     * @returns {Boolean}
     **/
    isEnd(row, column) {
        return this.end.row == row && this.end.column == column;
    }

    /**
     * Returns `true` if the caller's starting row is the same as `row`, and if the caller's starting column is the same as `column`.
     * @param {Number} row A row to compare with
     * @param {Number} column A column to compare with
     * @returns {Boolean}
     **/
    isStart(row, column) {
        return this.start.row == row && this.start.column == column;
    }

    /**
     * Sets the starting row and column for the range.
     * @param {Number|Point} row A row to set
     * @param {Number} [column] A column to set
     *
     **/
    setStart(row, column) {
        if (typeof row == "object") {
            this.start.column = row.column;
            this.start.row = row.row;
        } else {
            this.start.row = row;
            this.start.column = column;
        }
    }

    /**
     * Sets the starting row and column for the range.
     * @param {Number|Point} row A row to set
     * @param {Number} [column] A column to set
     *
     **/
    setEnd(row, column) {
        if (typeof row == "object") {
            this.end.column = row.column;
            this.end.row = row.row;
        } else {
            this.end.row = row;
            this.end.column = column;
        }
    }

    /**
     * Returns `true` if the `row` and `column` are within the given range.
     * @param {Number} row A row to compare with
     * @param {Number} column A column to compare with
     * @returns {Boolean}
     * @related [[Range.compare]]
     **/
    inside(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column) || this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns `true` if the `row` and `column` are within the given range's starting [[Point]].
     * @param {Number} row A row to compare with
     * @param {Number} column A column to compare with
     * @returns {Boolean}
     * @related [[Range.compare]]
     **/
    insideStart(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns `true` if the `row` and `column` are within the given range's ending [[Point]].
     * @param {Number} row A row to compare with
     * @param {Number} column A column to compare with
     * @returns {Boolean}
     * @related [[Range.compare]]
     *
     **/
    insideEnd(row, column) {
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
     * Compares the `row` and `column` with the starting and ending [[Point]]'s of the calling range.
     * @param {Number} row A row to compare with
     * @param {Number} column A column to compare with
     * @returns {Number} This method returns one of the following numbers:
     * * `1` if `row` is greater than the calling range
     * * `-1` if `row` is less then the calling range
     * * `0` otherwise
     *
     * If the starting row of the calling range is equal to `row`, and:
     * * `column` is greater than or equal to the calling range's starting column, this returns `0`
     * * Otherwise, it returns -1
     *
     * If the ending row of the calling range is equal to `row`, and:
     * * `column` is less than or equal to the calling range's ending column, this returns `0`
     * * Otherwise, it returns 1
     **/
    compare(row, column) {
        if (!this.isMultiLine()) {
            if (row === this.start.row) {
                return column < this.start.column ? -1 : (column > this.end.column ? 1 : 0);
            }
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
    }

    /**
     * Compares the `row` and `column` with the starting and ending [[Point]]'s of the calling range.
     * @param {Number} row A row to compare with
     * @param {Number} column A column to compare with
     * @returns {Number} This method returns one of the following numbers:
     * * `-1` if calling range's starting column and calling range's starting row are equal `row` and `column`
     * * Otherwise, it returns the value after calling [[Range.compare `compare()`]].
     **/
    compareStart(row, column) {
        if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    }

    /**
     * Compares the `row` and `column` with the starting and ending [[Point]]'s of the calling range.
     * @param {Number} row A row to compare with
     * @param {Number} column A column to compare with
     * @returns {Number} This method returns one of the following numbers:
     * * `1` if calling range's ending column and calling range's ending row are equal `row` and `column`.
     * * Otherwise, it returns the value after calling [[Range.compare `compare()`]].
     */
    compareEnd(row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else {
            return this.compare(row, column);
        }
    }

    /**
     * Compares the `row` and `column` with the start and end [[Point]]'s of the calling range.
     * @param {Number} row A row to compare with
     * @param {Number} column A column to compare with
     * @returns {Number} This method returns one of the following numbers:
     * * `1` if the ending row of the calling range is equal to `row`, and the ending column of the calling range is equal to `column`
     * * `-1` if the starting row of the calling range is equal to `row`, and the starting column of the calling range is equal to `column`
     * * Otherwise, it returns the value after calling [[Range.compare `compare()`]].
     **/
    compareInside(row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    }

    /**
     * Returns the part of the current `Range` that occurs within the boundaries of `firstRow` and `lastRow` as a new `Range` object.
     * @param {Number} firstRow The starting row
     * @param {Number} lastRow The ending row
     * @returns {Range}
    **/
    clipRows(firstRow, lastRow) {
        if (this.end.row > lastRow)
            var end = {row: lastRow + 1, column: 0};
        else if (this.end.row < firstRow)
            var end = {row: firstRow, column: 0};

        if (this.start.row > lastRow)
            var start = {row: lastRow + 1, column: 0};
        else if (this.start.row < firstRow)
            var start = {row: firstRow, column: 0};

        return Range.fromPoints(start || this.start, end || this.end);
    }

    /**
     * Changes the `row` and `column` for the calling range for both the starting and ending [[Point]]'s.
     * @param {Number} row A new row to extend to
     * @param {Number} column A new column to extend to
     * @returns {Range} The original range with the new row
    **/
    extend(row, column) {
        var cmp = this.compare(row, column);

        if (cmp == 0)
            return this;
        else if (cmp == -1)
            var start = {row: row, column: column};
        else
            var end = {row: row, column: column};

        return Range.fromPoints(start || this.start, end || this.end);
    }

    /**
     * Returns `true` if the calling range is empty (starting [[Point]] == ending [[Point]]).
     * @returns {Boolean}
     **/
    isEmpty() {
        return (this.start.row === this.end.row && this.start.column === this.end.column);
    }

    /**
     * Returns `true` if the range spans across multiple lines.
     * @returns {Boolean}
    **/
    isMultiLine() {
        return (this.start.row !== this.end.row);
    }

    /**
     * Returns a duplicate of the calling range.
     * @returns {Range}
    **/
    clone() {
        return Range.fromPoints(this.start, this.end);
    }

    /**
     * Returns a range containing the starting and ending rows of the original range, but with a column value of `0`.
     * @returns {Range}
    **/
    collapseRows() {
        if (this.end.column == 0)
            return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row-1), 0);
        else
            return new Range(this.start.row, 0, this.end.row, 0);
    }

    /**
     * Given the current `Range`, this function converts those starting and ending [[Point]]'s into screen positions, and then returns a new `Range` object.
     * @param {EditSession} session The `EditSession` to retrieve coordinates from
     * @returns {Range}
    **/
    toScreenRange(session) {
        var screenPosStart = session.documentToScreenPosition(this.start);
        var screenPosEnd = session.documentToScreenPosition(this.end);

        return new Range(
            screenPosStart.row, screenPosStart.column,
            screenPosEnd.row, screenPosEnd.column
        );
    }

    /**
     * Shift the calling range by `row` and `column` values.
     * @param {Number} row
     * @param {Number} column
     * @experimental
     */
    moveBy(row, column) {
        this.start.row += row;
        this.start.column += column;
        this.end.row += row;
        this.end.column += column;
    }

}

/**
 * Creates and returns a new `Range` based on the `start` [[Point]] and `end` [[Point]] of the given parameters.
 * @param {Point} start A starting point to use
 * @param {Point} end An ending point to use
 * @returns {Range}
**/
Range.fromPoints = function(start, end) {
    return new Range(start.row, start.column, end.row, end.column);
};

/**
 * Compares `p1` and `p2` [[Point]]'s, useful for sorting
 * @param {Point} p1
 * @param {Point} p2
 * @returns {Number}
 */
Range.comparePoints = function(p1, p2) {
    return p1.row - p2.row || p1.column - p2.column;
};

exports.Range = Range;
