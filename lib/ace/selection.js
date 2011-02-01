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

var oop = require("pilot/oop");
var lang = require("pilot/lang");
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var Range = require("ace/range").Range;

var Selection = function(doc) {
    this.doc = doc;

    this.clearSelection();
    this.selectionLead = {
        row: 0,
        column: 0
    };
};

(function() {

    oop.implement(this, EventEmitter);

    this.isEmpty = function() {
        return (!this.selectionAnchor ||
            (this.selectionAnchor.row == this.selectionLead.row &&
             this.selectionAnchor.column == this.selectionLead.column));
    };

    this.isMultiLine = function() {
        if (this.isEmpty()) {
            return false;
        }

        return this.getRange().isMultiLine();
    };

    this.getCursor = function() {
        return this.selectionLead;
    };

    this.setSelectionAnchor = function(row, column) {
        var anchor = this.$clipPositionToDocument(row, column);

        if (!this.selectionAnchor) {
            this.selectionAnchor = anchor;
            this._dispatchEvent("changeSelection", {});
        }
        else if (this.selectionAnchor.row !== anchor.row || this.selectionAnchor.column !== anchor.column) {
            this.selectionAnchor = anchor;
            this._dispatchEvent("changeSelection", {});
        }

    };

    this.getSelectionAnchor = function() {
        if (this.selectionAnchor) {
            return this.$clone(this.selectionAnchor);
        } else {
            return this.$clone(this.selectionLead);
        }
    };

    this.getSelectionLead = function() {
        return this.$clone(this.selectionLead);
    };

    this.shiftSelection = function(columns) {
        if (this.isEmpty()) {
            this.moveCursorTo(this.selectionLead.row, this.selectionLead.column + columns);
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

    this.isBackwards = function() {
        var anchor = this.selectionAnchor || this.selectionLead;
        var lead = this.selectionLead;
        return (anchor.row > lead.row || (anchor.row == lead.row && anchor.column > lead.column));
    };

    this.getRange = function() {
        var anchor = this.selectionAnchor || this.selectionLead;
        var lead = this.selectionLead;

        if (this.isBackwards()) {
            return Range.fromPoints(lead, anchor);
        }
        else {
            return Range.fromPoints(anchor, lead);
        }
    };

    this.clearSelection = function() {
        if (this.selectionAnchor) {
            this.selectionAnchor = null;
            this._dispatchEvent("changeSelection", {});
        }
    };

    this.selectAll = function() {
        var lastRow = this.doc.getLength() - 1;
        this.setSelectionAnchor(lastRow, this.doc.getLine(lastRow).length);

        if (!this.selectionAnchor) {
            this.selectionAnchor = this.$clone(this.selectionLead);
        }

        var cursor = {row:0, column:0};
        // only dispatch change if the cursor actually changed
        if (cursor.row !== this.selectionLead.row || cursor.column !== this.selectionLead.column) {
            this.selectionLead = cursor;
            this._dispatchEvent("changeSelection", {blockScrolling: true});
        }
    };

    this.setSelectionRange = function(range, reverse) {
        if (reverse) {
            this.setSelectionAnchor(range.end.row, range.end.column);
            this.selectTo(range.start.row, range.start.column);
        } else {
            this.setSelectionAnchor(range.start.row, range.start.column);
            this.selectTo(range.end.row, range.end.column);
        }
        this.$updateDesiredColumn();
    };

    this.$updateDesiredColumn = function() {
        var cursor = this.getCursor();
        if (cursor) {
            this.$desiredColumn = this.doc.documentToScreenColumn(cursor.row, cursor.column);
        }
    };

    this.$moveSelection = function(mover) {
        var changed = false;

        if (!this.selectionAnchor) {
            changed = true;
            this.selectionAnchor = this.$clone(this.selectionLead);
        }

        var cursor = this.$clone(this.selectionLead);
        mover.call(this);

        if (cursor.row !== this.selectionLead.row || cursor.column !== this.selectionLead.column) {
            changed = true;
        }

        if (changed)
            this._dispatchEvent("changeSelection", {});
    };

    this.selectTo = function(row, column) {
        this.$moveSelection(function() {
            this.moveCursorTo(row, column);
        });
    };

    this.selectToPosition = function(pos) {
        this.$moveSelection(function() {
            this.moveCursorToPosition(pos);
        });
    };

    this.selectUp = function() {
        this.$moveSelection(this.moveCursorUp);
    };

    this.selectDown = function() {
        this.$moveSelection(this.moveCursorDown);
    };

    this.selectRight = function() {
        this.$moveSelection(this.moveCursorRight);
    };

    this.selectLeft = function() {
        this.$moveSelection(this.moveCursorLeft);
    };

    this.selectLineStart = function() {
        this.$moveSelection(this.moveCursorLineStart);
    };

    this.selectLineEnd = function() {
        this.$moveSelection(this.moveCursorLineEnd);
    };

    this.selectFileEnd = function() {
        this.$moveSelection(this.moveCursorFileEnd);
    };

    this.selectFileStart = function() {
        this.$moveSelection(this.moveCursorFileStart);
    };

    this.selectWordRight = function() {
        this.$moveSelection(this.moveCursorWordRight);
    };

    this.selectWordLeft = function() {
        this.$moveSelection(this.moveCursorWordLeft);
    };

    this.selectWord = function() {
        var cursor = this.selectionLead;
        var column = cursor.column;
        var range  = this.doc.getWordRange(cursor.row, column);
        this.setSelectionRange(range);

        /*this.setSelectionAnchor(cursor.row, start);
        this.$moveSelection(function() {
            this.moveCursorTo(cursor.row, end);
        });*/
    };

    this.selectLine = function() {
        this.setSelectionAnchor(this.selectionLead.row, 0);
        this.$moveSelection(function() {
            this.moveCursorTo(this.selectionLead.row + 1, 0);
        });
    };

    this.moveCursorUp = function() {
        this.moveCursorBy(-1, 0);
    };

    this.moveCursorDown = function() {
        this.moveCursorBy(1, 0);
    };

    this.moveCursorLeft = function() {
        if (this.selectionLead.column == 0) {
            // cursor is a line (start
            if (this.selectionLead.row > 0) {
                this.moveCursorTo(this.selectionLead.row - 1, this.doc
                        .getLine(this.selectionLead.row - 1).length);
            }
        }
        else {
            var doc = this.doc;
            var tabSize = doc.getTabSize();
            var cursor = this.selectionLead;
            if (doc.isTabStop(cursor) && doc.getLine(cursor.row).slice(cursor.column-tabSize, cursor.column).split(" ").length-1 == tabSize)
                this.moveCursorBy(0, -tabSize);
            else
                this.moveCursorBy(0, -1);
        }
    };

    this.moveCursorRight = function() {
        if (this.selectionLead.column == this.doc.getLine(this.selectionLead.row).length) {
            if (this.selectionLead.row < this.doc.getLength() - 1) {
                this.moveCursorTo(this.selectionLead.row + 1, 0);
            }
        }
        else {
            var doc = this.doc;
            var tabSize = doc.getTabSize();
            var cursor = this.selectionLead;
            if (doc.isTabStop(cursor) && doc.getLine(cursor.row).slice(cursor.column, cursor.column+tabSize).split(" ").length-1 == tabSize)
                this.moveCursorBy(0, tabSize);
            else
                this.moveCursorBy(0, 1);
        }
    };

    this.moveCursorLineStart = function() {
        var row = this.selectionLead.row;
        var column = this.selectionLead.column;
        var screenRow = this.doc.documentToScreenRow(row, column);
        var firstRowColumn = this.doc.getScreenFirstRowColumn(screenRow);
        var beforeCursor = this.doc.getLine(row).slice(firstRowColumn, column);
        var leadingSpace = beforeCursor.match(/^\s*/);
        if (leadingSpace[0].length == 0) {
            var lastRowColumn = this.doc.getDocumentLastRowColumn(row, column);
            leadingSpace = this.doc.getLine(row).
                                substring(firstRowColumn, lastRowColumn).
                                match(/^\s*/);
            this.moveCursorTo(row, firstRowColumn + leadingSpace[0].length);
        } else if (leadingSpace[0].length >= column) {
            this.moveCursorTo(row, firstRowColumn);
        } else {
            this.moveCursorTo(row, firstRowColumn + leadingSpace[0].length);
        }
    };

    this.moveCursorLineEnd = function() {
        var selLead = this.selectionLead;
        this.moveCursorTo(selLead.row,
              this.doc.getDocumentLastRowColumn(selLead.row, selLead.column));
    };

    this.moveCursorFileEnd = function() {
        var row = this.doc.getLength() - 1;
        var column = this.doc.getLine(row).length;
        this.moveCursorTo(row, column);
    };

    this.moveCursorFileStart = function() {
        this.moveCursorTo(0, 0);
    };

    this.moveCursorWordRight = function() {
        var row = this.selectionLead.row;
        var column = this.selectionLead.column;
        var line = this.doc.getLine(row);
        var rightOfCursor = line.substring(column);

        var match;
        this.doc.nonTokenRe.lastIndex = 0;
        this.doc.tokenRe.lastIndex = 0;

        if (column == line.length) {
            this.moveCursorRight();
            return;
        }
        else if (match = this.doc.nonTokenRe.exec(rightOfCursor)) {
            column += this.doc.nonTokenRe.lastIndex;
            this.doc.nonTokenRe.lastIndex = 0;
        }
        else if (match = this.doc.tokenRe.exec(rightOfCursor)) {
            column += this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };

    this.moveCursorWordLeft = function() {
        var row = this.selectionLead.row;
        var column = this.selectionLead.column;
        var line = this.doc.getLine(row);
        var leftOfCursor = lang.stringReverse(line.substring(0, column));

        var match;
        this.doc.nonTokenRe.lastIndex = 0;
        this.doc.tokenRe.lastIndex = 0;

        if (column == 0) {
            this.moveCursorLeft();
            return;
        }
        else if (match = this.doc.nonTokenRe.exec(leftOfCursor)) {
            column -= this.doc.nonTokenRe.lastIndex;
            this.doc.nonTokenRe.lastIndex = 0;
        }
        else if (match = this.doc.tokenRe.exec(leftOfCursor)) {
            column -= this.doc.tokenRe.lastIndex;
            this.doc.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };

    this.moveCursorBy = function(rows, chars) {
        if (this.doc.getUseWrapMode()) {
            var screenPos = this.doc.documentToScreenPosition(
                        this.selectionLead.row, this.selectionLead.column);
            var screenCol =
                (chars == 0 && this.$desiredColumn) || screenPos.column;

            var docPos = this.doc.screenToDocumentPosition(
                        screenPos.row + rows, screenCol);
            this.moveCursorTo(docPos.row, docPos.column + chars, chars == 0);
        } else {
            var docColumn =
                (chars == 0 && this.$desiredColumn) || this.selectionLead.column;
            this.moveCursorTo(
                this.selectionLead.row + rows, docColumn + chars, chars == 0);
        }
    };


    this.moveCursorToPosition = function(position) {
        this.moveCursorTo(position.row, position.column);
    };

    this.moveCursorTo = function(row, column, preventUpdateDesiredColumn) {
        var cursor = this.$clipPositionToDocument(row, column);

        // only dispatch change if the cursor actually changed
        if (cursor.row !== this.selectionLead.row || cursor.column !== this.selectionLead.column) {
            this.selectionLead = cursor;
            !preventUpdateDesiredColumn && this.$updateDesiredColumn(column);
            this._dispatchEvent("changeCursor", { data: this.getCursor() });
        }
    };

    this.$clipPositionToDocument = function(row, column) {
        var pos = {};

        if (row >= this.doc.getLength()) {
            pos.row = Math.max(0, this.doc.getLength() - 1);
            pos.column = this.doc.getLine(pos.row).length;
        }
        else if (row < 0) {
            pos.row = 0;
            pos.column = 0;
        }
        else {
            pos.row = row;
            pos.column = Math.min(this.doc.getLine(pos.row).length,
                    Math.max(0, column));
        }
        return pos;
    };

    this.$clone = function(pos) {
        return {
            row: pos.row,
            column: pos.column
        };
    };

}).call(Selection.prototype);

exports.Selection = Selection;
});
