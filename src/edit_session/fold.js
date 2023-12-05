"use strict";
/**
 * @typedef {import("./fold_line").FoldLine} FoldLine
 * @typedef {import("../range").Range} Range
 * @typedef {import("../../ace-internal").Ace.Point} Point
 * @typedef {import("../../ace-internal").Ace.IRange} IRange
 */
var RangeList = require("../range_list").RangeList;

/*
 * Simple fold-data struct.
 **/
class Fold extends RangeList {

    /**
     * @param {Range} range
     * @param {any} placeholder
     */
    constructor(range, placeholder) {
        super();
        this.foldLine = null;
        this.placeholder = placeholder;
        this.range = range;
        this.start = range.start;
        this.end = range.end;

        this.sameRow = range.start.row == range.end.row;
        /**@type {Fold[]}*/
        this.subFolds = this.ranges = [];
    }
    
    toString() {
        return '"' + this.placeholder + '" ' + this.range.toString();
    }

    /**
     * @param {FoldLine} foldLine
     */
    setFoldLine(foldLine) {
        this.foldLine = foldLine;
        this.subFolds.forEach(function(fold) {
            fold.setFoldLine(foldLine);
        });
    }

    clone() {
        var range = this.range.clone();
        var fold = new Fold(range, this.placeholder);
        this.subFolds.forEach(function(subFold) {
            fold.subFolds.push(subFold.clone());
        });
        fold.collapseChildren = this.collapseChildren;
        return fold;
    }

    /**
     * @param {Fold} fold
     */
    addSubFold(fold) {
        if (this.range.isEqual(fold))
            return;

        // transform fold to local coordinates
        consumeRange(fold, this.start);

        var row = fold.start.row, column = fold.start.column;
        for (var i = 0, cmp = -1; i < this.subFolds.length; i++) {
            cmp = this.subFolds[i].range.compare(row, column);
            if (cmp != 1)
                break;
        }
        var afterStart = this.subFolds[i];
        var firstConsumed = 0;

        if (cmp == 0) {
            if (afterStart.range.containsRange(fold))
                return afterStart.addSubFold(fold);
            else
                firstConsumed = 1;
        }

        // cmp == -1
        var row = fold.range.end.row, column = fold.range.end.column;
        for (var j = i, cmp = -1; j < this.subFolds.length; j++) {
            cmp = this.subFolds[j].range.compare(row, column);
            if (cmp != 1)
                break;
        }
        if (cmp == 0)  j++;
        var consumedFolds = this.subFolds.splice(i, j - i, fold);
        var last = cmp == 0 ? consumedFolds.length - 1 : consumedFolds.length;
        for (var k = firstConsumed; k < last; k++) {
            fold.addSubFold(consumedFolds[k]);
        }
        fold.setFoldLine(this.foldLine);

        return fold;
    }

    /**
     * @param {IRange} range
     */
    restoreRange(range) {
        return restoreRange(range, this.start);
    }

}

/**
 * @param {Point} point
 * @param {Point} anchor
 */
function consumePoint(point, anchor) {
    point.row -= anchor.row;
    if (point.row == 0)
        point.column -= anchor.column;
}
/**
 * @param {IRange} range
 * @param {Point} anchor
 */
function consumeRange(range, anchor) {
    consumePoint(range.start, anchor);
    consumePoint(range.end, anchor);
}
/**
 * @param {Point} point
 * @param {Point} anchor
 */
function restorePoint(point, anchor) {
    if (point.row == 0)
        point.column += anchor.column;
    point.row += anchor.row;
}
/**
 * @param {IRange} range
 * @param {Point} anchor
 */
function restoreRange(range, anchor) {
    restorePoint(range.start, anchor);
    restorePoint(range.end, anchor);
}

exports.Fold = Fold;
