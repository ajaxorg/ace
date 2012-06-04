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
 *      Julian Viereck <julian.viereck@gmail.com>
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

var oop = require("./lib/oop");
var lang = require("./lib/lang");
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var Range = require("./range").Range;

/**
 * class Selection
 *
 * Contains the cursor position and the text selection of an edit session.
 *
 * The row/columns used in the selection are in document coordinates representing ths coordinates as thez appear in the document before applying soft wrap and folding.
 **/

/**
 * new Selection(session)
 * - session (EditSession): The session to use
 *
 * Creates a new `Selection` object.
 *
**/
var Selection = function(session) {
    this.session = session;
    this.doc = session.getDocument();

    this.clearSelection();
    this.lead = this.selectionLead = this.doc.createAnchor(0, 0);
    this.anchor = this.selectionAnchor = this.doc.createAnchor(0, 0);

    var self = this;
    this.lead.on("change", function(e) {
        self._emit("changeCursor");
        if (!self.$isEmpty)
            self._emit("changeSelection");
        if (!self.$keepDesiredColumnOnChange && e.old.column != e.value.column)
            self.$desiredColumn = null;
    });

    this.selectionAnchor.on("change", function() {
        if (!self.$isEmpty)
            self._emit("changeSelection");
    });
};

(function() {

    oop.implement(this, EventEmitter);

    /**
    * Selection.isEmpty() -> Boolean
    *
    * Returns `true` if the selection is empty.
    **/
    this.isEmpty = function() {
        return (this.$isEmpty || (
            this.anchor.row == this.lead.row &&
            this.anchor.column == this.lead.column
        ));
    };

    /**
    * Selection.isMultiLine() -> Boolean
    *
    * Returns `true` if the selection is a multi-line.
    **/
    this.isMultiLine = function() {
        if (this.isEmpty()) {
            return false;
        }

        return this.getRange().isMultiLine();
    };

    /**
    * Selection.getCursor() -> Number
    *
    * Gets the current position of the cursor.
    **/
    this.getCursor = function() {
        return this.lead.getPosition();
    };

    /**
    * Selection.setSelectionAnchor(row, column)
    * - row (Number): The new row
    * - column (Number): The new column
    *
    * Sets the row and column position of the anchor. This function also emits the `'changeSelection'` event.
    **/
    this.setSelectionAnchor = function(row, column) {
        this.anchor.setPosition(row, column);

        if (this.$isEmpty) {
            this.$isEmpty = false;
            this._emit("changeSelection");
        }
    };

    /** related to: Anchor.getPosition
    * Selection.getSelectionAnchor() -> Object
    *
    * Returns an object containing the `row` and `column` of the calling selection anchor.
    *
    **/
    this.getSelectionAnchor = function() {
        if (this.$isEmpty)
            return this.getSelectionLead()
        else
            return this.anchor.getPosition();
    };

    /**
    * Selection.getSelectionLead() -> Object
    *
    * Returns an object containing the `row` and `column` of the calling selection lead.
    **/
    this.getSelectionLead = function() {
        return this.lead.getPosition();
    };

    /**
    * Selection.shiftSelection(columns)
    * - columns (Number): The number of columns to shift by
    *
    * Shifts the selection up (or down, if [[Selection.isBackwards `isBackwards()`]] is true) the given number of columns.
    *
    **/
    this.shiftSelection = function(columns) {
        if (this.$isEmpty) {
            this.moveCursorTo(this.lead.row, this.lead.column + columns);
            return;
        };

        var anchor = this.getSelectionAnchor();
        var lead = this.getSelectionLead();

        var isBackwards = this.isBackwards();

        if (!isBackwards || anchor.column !== 0)
            this.setSelectionAnchor(anchor.row, anchor.column + columns);

        if (isBackwards || lead.column !== 0) {
            this.$moveSelection(function() {
                this.moveCursorTo(lead.row, lead.column + columns);
            });
        }
    };

    /**
    * Selection.isBackwards() -> Boolean
    *
    * Returns `true` if the selection is going backwards in the document.
    **/
    this.isBackwards = function() {
        var anchor = this.anchor;
        var lead = this.lead;
        return (anchor.row > lead.row || (anchor.row == lead.row && anchor.column > lead.column));
    };

    /**
    * Selection.getRange() -> Range
    *
    * [Returns the [[Range `Range`]] for the selected text.]{: #Selection.getRange}
    **/
    this.getRange = function() {
        var anchor = this.anchor;
        var lead = this.lead;

        if (this.isEmpty())
            return Range.fromPoints(lead, lead);

        if (this.isBackwards()) {
            return Range.fromPoints(lead, anchor);
        }
        else {
            return Range.fromPoints(anchor, lead);
        }
    };

    /**
    * Selection.clearSelection()
    *
    * [Empties the selection (by de-selecting it). This function also emits the `'changeSelection'` event.]{: #Selection.clearSelection}
    **/
    this.clearSelection = function() {
        if (!this.$isEmpty) {
            this.$isEmpty = true;
            this._emit("changeSelection");
        }
    };

    /**
    * Selection.selectAll()
    *
    * Selects all the text in the document.
    **/
    this.selectAll = function() {
        var lastRow = this.doc.getLength() - 1;
        this.setSelectionAnchor(0, 0);
        this.moveCursorTo(lastRow, this.doc.getLine(lastRow).length);
    };

    /**
    * Selection.setSelectionRange(range, reverse)
    * - range (Range): The range of text to select
    * - reverse (Boolean): Indicates if the range should go backwards (`true`) or not
    *
    * Sets the selection to the provided range.
    *
    **/
    this.setRange =
    this.setSelectionRange = function(range, reverse) {
        if (reverse) {
            this.setSelectionAnchor(range.end.row, range.end.column);
            this.selectTo(range.start.row, range.start.column);
        } else {
            this.setSelectionAnchor(range.start.row, range.start.column);
            this.selectTo(range.end.row, range.end.column);
        }
        this.$desiredColumn = null;
    };

    this.$moveSelection = function(mover) {
        var lead = this.lead;
        if (this.$isEmpty)
            this.setSelectionAnchor(lead.row, lead.column);

        mover.call(this);
    };

    /**
    * Selection.selectTo(row, column)
    * - row (Number): The row to select to
    * - column (Number): The column to select to
    *
    * Moves the selection cursor to the indicated row and column.
    *
    **/
    this.selectTo = function(row, column) {
        this.$moveSelection(function() {
            this.moveCursorTo(row, column);
        });
    };

    /**
    * Selection.selectToPosition(pos)
    * - pos (Object): An object containing the row and column
    *
    * Moves the selection cursor to the row and column indicated by `pos`.
    *
    **/
    this.selectToPosition = function(pos) {
        this.$moveSelection(function() {
            this.moveCursorToPosition(pos);
        });
    };

    /**
    * Selection.selectUp()
    *
    * Moves the selection up one row.
    **/
    this.selectUp = function() {
        this.$moveSelection(this.moveCursorUp);
    };

    /**
    * Selection.selectDown()
    *
    * Moves the selection down one row.
    **/
    this.selectDown = function() {
        this.$moveSelection(this.moveCursorDown);
    };

    /**
    * Selection.selectRight()
    *
    * Moves the selection right one column.
    **/
    this.selectRight = function() {
        this.$moveSelection(this.moveCursorRight);
    };

    /**
    * Selection.selectLeft()
    *
    * Moves the selection left one column.
    **/
    this.selectLeft = function() {
        this.$moveSelection(this.moveCursorLeft);
    };

    /**
    * Selection.selectLineStart()
    *
    * Moves the selection to the beginning of the current line.
    **/
    this.selectLineStart = function() {
        this.$moveSelection(this.moveCursorLineStart);
    };

    /**
    * Selection.selectLineEnd()
    *
    * Moves the selection to the end of the current line.
    **/
    this.selectLineEnd = function() {
        this.$moveSelection(this.moveCursorLineEnd);
    };

    /**
    * Selection.selectFileEnd()
    *
    * Moves the selection to the end of the file.
    **/
    this.selectFileEnd = function() {
        this.$moveSelection(this.moveCursorFileEnd);
    };

    /**
    * Selection.selectFileStart()
    *
    * Moves the selection to the start of the file.
    **/
    this.selectFileStart = function() {
        this.$moveSelection(this.moveCursorFileStart);
    };

    /**
    * Selection.selectWordRight()
    *
    * Moves the selection to the first word on the right.
    **/
    this.selectWordRight = function() {
        this.$moveSelection(this.moveCursorWordRight);
    };

    /**
    * Selection.selectWordLeft()
    *
    * Moves the selection to the first word on the left.
    **/
    this.selectWordLeft = function() {
        this.$moveSelection(this.moveCursorWordLeft);
    };

    /** related to: EditSession.getWordRange
    * Selection.selectWord()
    *
    * Moves the selection to highlight the entire word.
    **/
    this.getWordRange = function(row, column) {
        if (typeof column == "undefined") {
            var cursor = row || this.lead;
            row = cursor.row;
            column = cursor.column;
        }
        return this.session.getWordRange(row, column);
    };

    this.selectWord = function() {
        this.setSelectionRange(this.getWordRange());
    };

    /** related to: EditSession.getAWordRange
    * Selection.selectAWord()
    *
    * Selects a word, including its right whitespace.
    **/
    this.selectAWord = function() {
        var cursor = this.getCursor();
        var range = this.session.getAWordRange(cursor.row, cursor.column);
        this.setSelectionRange(range);
    };

    this.getLineRange = function(row, excludeLastChar) {
        var rowStart = typeof row == "number" ? row : this.lead.row;
        var rowEnd;

        var foldLine = this.session.getFoldLine(rowStart);
        if (foldLine) {
            rowStart = foldLine.start.row;
            rowEnd = foldLine.end.row;
        } else {
            rowEnd = rowStart;
        }
        if (excludeLastChar)
            return new Range(rowStart, 0, rowEnd, this.session.getLine(rowEnd).length);
        else
            return new Range(rowStart, 0, rowEnd + 1, 0);
    };

    /**
    * Selection.selectLine()
    *
    * Selects the entire line.
    **/
    this.selectLine = function() {
        this.setSelectionRange(this.getLineRange());
    };

    /**
    * Selection.moveCursorUp()
    *
    * Moves the cursor up one row.
    **/
    this.moveCursorUp = function() {
        this.moveCursorBy(-1, 0);
    };

    /**
    * Selection.moveCursorDown()
    *
    * Moves the cursor down one row.
    **/
    this.moveCursorDown = function() {
        this.moveCursorBy(1, 0);
    };

    /**
    * Selection.moveCursorLeft()
    *
    * Moves the cursor left one column.
    **/
    this.moveCursorLeft = function() {
        var cursor = this.lead.getPosition(),
            fold;

        if (fold = this.session.getFoldAt(cursor.row, cursor.column, -1)) {
            this.moveCursorTo(fold.start.row, fold.start.column);
        } else if (cursor.column == 0) {
            // cursor is a line (start
            if (cursor.row > 0) {
                this.moveCursorTo(cursor.row - 1, this.doc.getLine(cursor.row - 1).length);
            }
        }
        else {
            var tabSize = this.session.getTabSize();
            if (this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column-tabSize, cursor.column).split(" ").length-1 == tabSize)
                this.moveCursorBy(0, -tabSize);
            else
                this.moveCursorBy(0, -1);
        }
    };

    /**
    * Selection.moveCursorRight()
    *
    * Moves the cursor right one column.
    **/
    this.moveCursorRight = function() {
        var cursor = this.lead.getPosition(),
            fold;
        if (fold = this.session.getFoldAt(cursor.row, cursor.column, 1)) {
            this.moveCursorTo(fold.end.row, fold.end.column);
        }
        else if (this.lead.column == this.doc.getLine(this.lead.row).length) {
            if (this.lead.row < this.doc.getLength() - 1) {
                this.moveCursorTo(this.lead.row + 1, 0);
            }
        }
        else {
            var tabSize = this.session.getTabSize();
            var cursor = this.lead;
            if (this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column, cursor.column+tabSize).split(" ").length-1 == tabSize)
                this.moveCursorBy(0, tabSize);
            else
                this.moveCursorBy(0, 1);
        }
    };

    /**
    * Selection.moveCursorLineStart()
    *
    * Moves the cursor to the start of the line.
    **/
    this.moveCursorLineStart = function() {
        var row = this.lead.row;
        var column = this.lead.column;
        var screenRow = this.session.documentToScreenRow(row, column);

        // Determ the doc-position of the first character at the screen line.
        var firstColumnPosition = this.session.screenToDocumentPosition(screenRow, 0);

        // Determ the line
        var beforeCursor = this.session.getDisplayLine(
            row, null,
            firstColumnPosition.row, firstColumnPosition.column
        );

        var leadingSpace = beforeCursor.match(/^\s*/);
        if (leadingSpace[0].length == column) {
            this.moveCursorTo(
                firstColumnPosition.row, firstColumnPosition.column
            );
        }
        else {
            this.moveCursorTo(
                firstColumnPosition.row,
                firstColumnPosition.column + leadingSpace[0].length
            );
        }
    };

    /**
    * Selection.moveCursorLineEnd()
    *
    * Moves the cursor to the end of the line.
    **/
    this.moveCursorLineEnd = function() {
        var lead = this.lead;
        var lastRowColumnPosition =
            this.session.getDocumentLastRowColumnPosition(lead.row, lead.column);
        this.moveCursorTo(
            lastRowColumnPosition.row,
            lastRowColumnPosition.column
        );
    };

    /**
    * Selection.moveCursorFileEnd()
    *
    * Moves the cursor to the end of the file.
    **/
    this.moveCursorFileEnd = function() {
        var row = this.doc.getLength() - 1;
        var column = this.doc.getLine(row).length;
        this.moveCursorTo(row, column);
    };

    /**
    * Selection.moveCursorFileStart()
    *
    * Moves the cursor to the start of the file.
    **/
    this.moveCursorFileStart = function() {
        this.moveCursorTo(0, 0);
    };

    /**
    * Selection.moveCursorLongWordRight()
    *
    * Moves the cursor to the word on the right.
    **/
    this.moveCursorLongWordRight = function() {
        var row = this.lead.row;
        var column = this.lead.column;
        var line = this.doc.getLine(row);
        var rightOfCursor = line.substring(column);

        var match;
        this.session.nonTokenRe.lastIndex = 0;
        this.session.tokenRe.lastIndex = 0;

        // skip folds
        var fold = this.session.getFoldAt(row, column, 1);
        if (fold) {
            this.moveCursorTo(fold.end.row, fold.end.column);
            return;
        }

        // first skip space
        if (match = this.session.nonTokenRe.exec(rightOfCursor)) {
            column += this.session.nonTokenRe.lastIndex;
            this.session.nonTokenRe.lastIndex = 0;
            rightOfCursor = line.substring(column);
        }

        // if at line end proceed with next line
        if (column >= line.length) {
            this.moveCursorTo(row, line.length);
            this.moveCursorRight();
            if (row < this.doc.getLength() - 1)
                this.moveCursorWordRight();
            return;
        }

        // advance to the end of the next token
        if (match = this.session.tokenRe.exec(rightOfCursor)) {
            column += this.session.tokenRe.lastIndex;
            this.session.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };

    /**
    * Selection.moveCursorLongWordLeft()
    *
    * Moves the cursor to the word on the left.
    **/
    this.moveCursorLongWordLeft = function() {
        var row = this.lead.row;
        var column = this.lead.column;

        // skip folds
        var fold;
        if (fold = this.session.getFoldAt(row, column, -1)) {
            this.moveCursorTo(fold.start.row, fold.start.column);
            return;
        }

        var str = this.session.getFoldStringAt(row, column, -1);
        if (str == null) {
            str = this.doc.getLine(row).substring(0, column)
        }

        var leftOfCursor = lang.stringReverse(str);
        var match;
        this.session.nonTokenRe.lastIndex = 0;
        this.session.tokenRe.lastIndex = 0;

        // skip whitespace
        if (match = this.session.nonTokenRe.exec(leftOfCursor)) {
            column -= this.session.nonTokenRe.lastIndex;
            leftOfCursor = leftOfCursor.slice(this.session.nonTokenRe.lastIndex);
            this.session.nonTokenRe.lastIndex = 0;
        }

        // if at begin of the line proceed in line above
        if (column <= 0) {
            this.moveCursorTo(row, 0);
            this.moveCursorLeft();
            if (row > 0)
                this.moveCursorWordLeft();
            return;
        }

        // move to the begin of the word
        if (match = this.session.tokenRe.exec(leftOfCursor)) {
            column -= this.session.tokenRe.lastIndex;
            this.session.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };

    this.$shortWordEndIndex = function(rightOfCursor) {
        var match, index = 0, ch;
        var whitespaceRe = /\s/;
        var tokenRe = this.session.tokenRe;

        tokenRe.lastIndex = 0;
        if (match = this.session.tokenRe.exec(rightOfCursor)) {
            index = this.session.tokenRe.lastIndex;
        } else {
            while ((ch = rightOfCursor[index]) && whitespaceRe.test(ch))
                index ++;

            if (index <= 1) {
                tokenRe.lastIndex = 0;
                 while ((ch = rightOfCursor[index]) && !tokenRe.test(ch)) {
                    tokenRe.lastIndex = 0;
                    index ++;
                    if (whitespaceRe.test(ch)) {
                        if (index > 2) {
                            index--
                            break;
                        } else {
                            while ((ch = rightOfCursor[index]) && whitespaceRe.test(ch))
                                index ++;
                            if (index > 2)
                                break
                        }
                    }
                }
            }
        }
        tokenRe.lastIndex = 0;

        return index;
    };

    this.moveCursorShortWordRight = function() {
        var row = this.lead.row;
        var column = this.lead.column;
        var line = this.doc.getLine(row);
        var rightOfCursor = line.substring(column);

        var fold = this.session.getFoldAt(row, column, 1);
        if (fold)
            return this.moveCursorTo(fold.end.row, fold.end.column);

        if (column == line.length) {
            var l = this.doc.getLength();
            do {    
                row++;
                rightOfCursor = this.doc.getLine(row)
            } while (row < l && /^\s*$/.test(rightOfCursor))
            
            if (!/^\s+/.test(rightOfCursor))
                rightOfCursor = ""
            column = 0;
        }

        var index = this.$shortWordEndIndex(rightOfCursor);

        this.moveCursorTo(row, column + index);
    };

    this.moveCursorShortWordLeft = function() {
        var row = this.lead.row;
        var column = this.lead.column;

        var fold;
        if (fold = this.session.getFoldAt(row, column, -1))
            return this.moveCursorTo(fold.start.row, fold.start.column);

        var line = this.session.getLine(row).substring(0, column);
        if (column == 0) {
            do {    
                row--;
                line = this.doc.getLine(row);
            } while (row > 0 && /^\s*$/.test(line))
            
            column = line.length;
            if (!/\s+$/.test(line))
                line = ""
        }

        var leftOfCursor = lang.stringReverse(line);
        var index = this.$shortWordEndIndex(leftOfCursor);

        return this.moveCursorTo(row, column - index);
    };

    this.moveCursorWordRight = function() {
        if (this.session.$selectLongWords)
            this.moveCursorLongWordRight();
        else
            this.moveCursorShortWordRight();
    };

    this.moveCursorWordLeft = function() {
        if (this.session.$selectLongWords)
            this.moveCursorLongWordLeft();
        else
            this.moveCursorShortWordLeft();
    };

    /** related to: EditSession.documentToScreenPosition
    * Selection.moveCursorBy(rows, chars)
    * - rows (Number): The number of rows to move by
    * - chars (Number): The number of characters to move by
    *
    * Moves the cursor to position indicated by the parameters. Negative numbers move the cursor backwards in the document.
    **/
    this.moveCursorBy = function(rows, chars) {
        var screenPos = this.session.documentToScreenPosition(
            this.lead.row,
            this.lead.column
        );

        if (chars === 0) {
            if (this.$desiredColumn)
                screenPos.column = this.$desiredColumn;
            else
                this.$desiredColumn = screenPos.column;
        }

        var docPos = this.session.screenToDocumentPosition(screenPos.row + rows, screenPos.column);

        // move the cursor and update the desired column
        this.moveCursorTo(docPos.row, docPos.column + chars, chars === 0);
    };

    /**
    * Selection.moveCursorToPosition(position)
    * - position (Object): The position to move to
    *
    * Moves the selection to the position indicated by its `row` and `column`.
    **/
    this.moveCursorToPosition = function(position) {
        this.moveCursorTo(position.row, position.column);
    };

    /**
    * Selection.moveCursorTo(row, column, keepDesiredColumn)
    * - row (Number): The row to move to
    * - column (Number): The column to move to
    * - keepDesiredColumn (Boolean): [If `true`, the cursor move does not respect the previous column]{: #preventUpdateBool}
    *
    * Moves the cursor to the row and column provided. [If `preventUpdateDesiredColumn` is `true`, then the cursor stays in the same column position as its original point.]{: #preventUpdateBoolDesc}
    **/
    this.moveCursorTo = function(row, column, keepDesiredColumn) {
        // Ensure the row/column is not inside of a fold.
        var fold = this.session.getFoldAt(row, column, 1);
        if (fold) {
            row = fold.start.row;
            column = fold.start.column;
        }

        this.$keepDesiredColumnOnChange = true;
        this.lead.setPosition(row, column);
        this.$keepDesiredColumnOnChange = false;

        if (!keepDesiredColumn)
            this.$desiredColumn = null;
    };

    /**
    * Selection.moveCursorToScreen(row, column, keepDesiredColumn)
    * - row (Number): The row to move to
    * - column (Number): The column to move to
    * - keepDesiredColumn (Boolean): {:preventUpdateBool}
    *
    * Moves the cursor to the screen position indicated by row and column. {:preventUpdateBoolDesc}
    **/
    this.moveCursorToScreen = function(row, column, keepDesiredColumn) {
        var pos = this.session.screenToDocumentPosition(row, column);
        this.moveCursorTo(pos.row, pos.column, keepDesiredColumn);
    };

    // remove listeners from document
    this.detach = function() {
        this.lead.detach();
        this.anchor.detach();
        this.session = this.doc = null;
    }

    this.fromOrientedRange = function(range) {
        this.setSelectionRange(range, range.cursor == range.start);
        this.$desiredColumn = range.desiredColumn || this.$desiredColumn;
    }

    this.toOrientedRange = function(range) {
        var r = this.getRange();
        if (range) {
            range.start.column = r.start.column;
            range.start.row = r.start.row;
            range.end.column = r.end.column;
            range.end.row = r.end.row;
        } else {
            range = r;
        }

        range.cursor = this.isBackwards() ? range.start : range.end;
        range.desiredColumn = this.$desiredColumn;
        return range;
    }

}).call(Selection.prototype);

exports.Selection = Selection;
});
