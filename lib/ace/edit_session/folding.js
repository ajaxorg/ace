/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
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
 *      Julian Viereck <julian DOT viereck AT gmail DOT com>
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

var FoldLine = require("ace/edit_session/fold_line").FoldLine;

/**
 * Simple fold-data struct.
 **/
function Fold(range, placeholder) {
    this.foldLine = null;
    this.placeholder = placeholder;
    this.range = range;
    this.start = range.start;
    this.end = range.end;

    this.sameRow = range.start.row == range.end.row;
}

Fold.prototype.toString = function() {
    return '"' + this.placeholder + '" ' + this.range.toString();
}

function Folding() {
    /**
     * Looks up a fold at a given row/column. Possible values for side:
     *   -1: ignore a fold if fold.start = row/column
     *   +1: ignore a fold if fold.end = row/column
     */
    this.getFoldAt = function(row, column, side) {
        var foldLine = this.getFoldLine(row);
        if (foldLine) {
            var folds = foldLine.folds,
                fold;

            for (var i = 0; i < folds.length; i++) {
                fold = folds[i];
                if (fold.range.contains(row, column)) {
                    if (side == 1 && fold.range.isEnd(row, column)) {
                        continue;
                    } else if (side == -1 && fold.range.isStart(row, column)) {
                        continue;
                    }
                    return fold;
                }
            }
        } else {
            return null;
        }
    }

    /**
     * Returns all folds in the given range. Note, that this will return folds
     *
     */
    this.getFoldsInRange = function(range) {
        range = range.clone();
        var start = range.start,
            end = range.end;
        var foldLines = this.$foldData,
            folds,
            fold;
        var cmp,
            foundFolds = [];

        start.column += 1;
        end.column -= 1;

        for (var i = 0; i < foldLines.length; i++) {
            cmp = foldLines[i].range.compareRange(range);
            // Range is before foldLine. No intersection. This means,
            // there might be other foldLines that intersect.
            if (cmp == 2) {
                continue;
            } else
            // Range is after foldLine. There can't be any other foldLines then,
            // so let's give up.
            if (cmp == -2) {
                break;
            }

            folds = foldLines[i].folds;
            for (var j = 0; j < folds.length; j++) {
                fold = folds[j];
                cmp = fold.range.compareRange(range);
                if (cmp == -2) {
                    break;
                } else if (cmp == 2) {
                    continue;
                } else
                // WTF-state: Can happen due to -1/+1 to start/end column.
                if (cmp == 42) {
                    break;
                }
                foundFolds.push(fold);
            }
        }
        return foundFolds;
    }

    /**
     * Returns the string between folds at the given position.
     * E.g.
     *  foo<fold>b|ar<fold>wolrd -> "bar"
     *  foo<fold>bar<fold>wol|rd -> "world"
     *  foo<fold>bar<fo|ld>wolrd -> <null>
     *
     * where | means the position of row/column
     *
     * The trim option determs if the return string should be trimed according
     * to the "side" passed with the trim value:
     *
     * E.g.
     *  foo<fold>b|ar<fold>wolrd -trim=-1> "b"
     *  foo<fold>bar<fold>wol|rd -trim=+1> "rld"
     *  fo|o<fold>bar<fold>wolrd -trim=00> "foo"
     */
    this.getFoldStringAt = function(row, column, trim, foldLine) {
        var foldLine = foldLine || this.getFoldLine(row);
        if (!foldLine) {
            return null;
        } else {
            var fold, lastFold, cmp, str;
            lastFold = {
                end: { column: 0 }
            };
            // TODO: Refactor to use getNextFoldTo function.
            for (var i = 0; i < foldLine.folds.length; i++) {
                fold = foldLine.folds[i];
                cmp = fold.range.compareEnd(row, column);
                if (cmp == -1) {
                    str = this.getLine(fold.start.row).
                                substring(lastFold.end.column, fold.start.column);
                    break;
                } else if (cmp == 0) {
                    return null;
                }
                lastFold = fold;
            }
            if (!str) {
                str = this.getLine(fold.start.row).
                                substring(lastFold.end.column);
            }
            if (trim == -1) {
                return str.substring(0, column - lastFold.end.column);
            } else if (trim == 1) {
                return str.substring(column - lastFold.end.column)
            } else {
                return str;
            }
        }
    }

    this.getFoldLine = function(docRow, startFoldLine) {
        var foldData = this.$foldData;
        var i = Math.max(foldData.indexOf(startFoldLine), 0);
        for (i; i < foldData.length; i++) {
            var foldLine = foldData[i];
            if (foldLine.start.row <= docRow && foldLine.end.row >= docRow) {
                return foldLine;
            } else if (foldLine.end.row > docRow) {
                return null;
            }
        }
        return null;
    }

    this.$addFoldLine = function(foldLine) {
        this.$foldData.push(foldLine);
        this.$foldData.sort(function(a, b) {
            return a.start.row - b.start.row;
        });
        return foldLine;
    }

    /**
     * Adds a new fold.
     */
    this.addFold = function(range, placeholder) {
        var startRow = range.start.row,
            endRow   = range.end.row,
            foldData = this.$foldData,
            foldRow  = null;
        var foldLine;

        var fold = new Fold(range, placeholder);
        var added = false;

        // For now we assume that no two folds are created for the same range!
        for (var i = 0; i < foldData.length; i++) {
            foldLine = foldData[i];
            if (endRow == foldLine.start.row) {
                foldLine.addFold(fold);
                added = true;
                break;
            } else if (startRow == foldLine.end.row) {
                foldLine.addFold(fold);
                added = true;
                if (!fold.sameRow) {
                    // Check if we might have to merge two FoldLines.
                    foldLineNext = foldData[i + 1];
                    if (foldLineNext && foldLineNext.start.row == endRow) {
                        // We need to merge!
                        foldLine.merge(foldLineNext);
                        break;
                    }
                }
                break;
            } else if (endRow <= foldLine.start.row) {
                break;
            }
        }

        if (!added) {
            foldLine = this.$addFoldLine(new FoldLine(this.$foldData, fold));
        }

        // TODO: Recalculate wrapData
        if (this.$useWrapMode) {
            this.$updateWrapData(foldLine.start.row, foldLine.start.row);
        }

        // Notify that fold data has changed.
        this.$modified = true;
        this._dispatchEvent("changeFold");
    };

    this.removeFold = function(fold) {
        var foldLine = fold.foldLine;
        var startRow = foldLine.start.row;
        var endRow = foldLine.end.row;

        var foldLines = this.$foldData,
            folds = foldLine.folds;
        // Simple case where there is only one fold in the FoldLine such that
        // the entire fold line can get removed directly.
        if (folds.length == 1) {
            foldLines.splice(foldLines.indexOf(foldLine), 1);
        } else
        // If the fold is the last fold of the foldLine, just remove it.
        if (foldLine.range.isEnd(fold.end.row, fold.end.column)) {
            folds.pop();
            foldLine.end.row = folds[folds.length - 1].end.row;
            foldLine.end.column = folds[folds.length - 1].end.column;
        } else
        // If the fold is the first fold of the foldLine, just remove it.
        if (foldLine.range.isStart(fold.start.row, fold.start.column)) {
            folds.shift();
            foldLine.start.row = folds[0].start.row;
            foldLine.start.column = folds[0].start.column;
        } else
        // We know there are more then 2 folds and the fold is not at the edge.
        // This means, the fold is somewhere in between.
        //
        // If the fold is in one row, we just can remove it.
        if (fold.sameRow) {
            folds.splice(folds.indexOf(fold), 1);
        } else
        // The fold goes over more then one row. This means remvoing this fold
        // will cause the fold line to get splitted up.
        {
            var newFoldLine = foldLine.split(fold.start.row, fold.start.column);
            newFoldLine.folds.shift();
            foldLine.start.row = folds[0].start.row;
            foldLine.start.column = folds[0].start.column;
            this.$addFoldLine(newFoldLine);
        }

        if (this.$useWrapMode) {
            this.$updateWrapData(startRow, endRow);
        }

        // Notify that fold data has changed.
        this.$modified = true;
        this._dispatchEvent("changeFold");
    }

    this.removeFolds = function(folds) {
        // We need to clone the folds array passed in as it might be the folds
        // array of a fold line and as we call this.removeFold(fold), folds
        // are removed from folds and changes the current index.
        var cloneFolds = [];
        for (var i = 0; i < folds.length; i++) {
            cloneFolds.push(folds[i]);
        }

        cloneFolds.forEach(function(fold) {
            this.removeFold(fold);
        }, this);
        this.$modified = true;
    }

    /**
     * Checks if a given documentRow is folded. This is true if there are some
     * folded parts such that some parts of the line is still visible.
     **/
    this.isRowFolded = function(docRow, startFoldRow) {
        return !!this.getFoldLine(docRow, startFoldRow);
    };

    this.getRowFoldEnd = function(docRow, startFoldRow) {
        var foldLine = this.getFoldLine(docRow, startFoldRow);
        return (foldLine
                    ? foldLine.end.row
                    : docRow)
    };

    this.getFoldDisplayLine = function(foldLine, endRow, endColumn) {
        if (endRow == null) {
            endRow = foldLine.end.row;
            endColumn = this.getLine(endRow).length;
        }

        // Build the textline using the FoldLine walker.
        var line = "",
            textLine = "";

        foldLine.walk(function(placeholder, row, column, lastColumn, isNewRow) {
            if (placeholder) {
                textLine += placeholder;
            } else {
                if (isNewRow) {
                    line = this.getLine(row);
                }
                textLine += line.substring(lastColumn, column);
            }
        }.bind(this), endRow, endColumn);
        return textLine;
    }
}

exports.Folding = Folding;

});
