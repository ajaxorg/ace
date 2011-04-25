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
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Mihai Sucan <mihai DOT sucan AT gmail DOT com>
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

var oop = require("pilot/oop");
var lang = require("pilot/lang");
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var Selection = require("ace/selection").Selection;
var TextMode = require("ace/mode/text").Mode;
var Range = require("ace/range").Range;
var Document = require("ace/document").Document;
var BackgroundTokenizer = require("ace/background_tokenizer").BackgroundTokenizer;

var EditSession = function(text, mode) {
    this.$modified = true;
    this.$breakpoints = [];
    this.$frontMarkers = {};
    this.$backMarkers = {};
    this.$markerId = 1;
    this.$wrapData = [];
    this.$foldData = [];
    this.$foldData.toString = function() {
        var str = "";
        this.forEach(function(foldLine) {
            str += "\n" + foldLine.toString();
        });
        return str;
    }

    if (text instanceof Document) {
        this.setDocument(text);
    } else {
        this.setDocument(new Document(text));
    }

    this.selection = new Selection(this);
    if (mode)
        this.setMode(mode);
    else
        this.setMode(new TextMode());

    // Set the initial foldData content.
    var foldData = this.$foldData = [];
    for (var row = 0; row < this.doc.$lines.length; row++) {
        foldData.push(false);
    }
};


(function() {

    oop.implement(this, EventEmitter);

    this.setDocument = function(doc) {
        if (this.doc)
            throw new Error("Document is already set");

        this.doc = doc;
        doc.on("change", this.onChange.bind(this));
    };

    this.getDocument = function() {
        return this.doc;
    };

    this.onChange = function(e) {
        var delta = e.data;
        this.$modified = true;
        if (!this.$fromUndo && this.$undoManager && !delta.ignore) {
            this.$deltas.push(delta);
            this.$informUndoManager.schedule();
        }

        this.$updateInternalDataOnChange(e);
        this.bgTokenizer.start(delta.range.start.row);
        this._dispatchEvent("change", e);
    };

    this.setValue = function(text) {
        this.doc.setValue(text);
        this.$deltas = [];
        this.getUndoManager().reset();
    };

    this.getValue =
    this.toString = function() {
        return this.doc.getValue();
    };

    this.getSelection = function() {
        return this.selection;
    };

    this.getState = function(row) {
        return this.bgTokenizer.getState(row);
    };

    this.getTokens = function(firstRow, lastRow) {
        return this.bgTokenizer.getTokens(firstRow, lastRow);
    };

    this.setUndoManager = function(undoManager) {
        this.$undoManager = undoManager;
        this.$deltas = [];

        if (this.$informUndoManager) {
            this.$informUndoManager.cancel();
        }

        if (undoManager) {
            var self = this;
            this.$syncInformUndoManager = function() {
                self.$informUndoManager.cancel();
                if (self.$deltas.length > 0)
                    undoManager.execute({
                        action : "aceupdate",
                        args   : [self.$deltas, self]
                    });
                self.$deltas = [];
            }
            this.$informUndoManager =
                lang.deferredCall(this.$syncInformUndoManager);
        }
    };

    this.$defaultUndoManager = {
        undo: function() {},
        redo: function() {},
        reset: function() {}
    };

    this.getUndoManager = function() {
        return this.$undoManager || this.$defaultUndoManager;
    },

    this.getTabString = function() {
        if (this.getUseSoftTabs()) {
            return lang.stringRepeat(" ", this.getTabSize());
        } else {
            return "\t";
        }
    };

    this.$useSoftTabs = true;
    this.setUseSoftTabs = function(useSoftTabs) {
        if (this.$useSoftTabs === useSoftTabs) return;

        this.$useSoftTabs = useSoftTabs;
    };

    this.getUseSoftTabs = function() {
        return this.$useSoftTabs;
    };

    this.$tabSize = 4;
    this.setTabSize = function(tabSize) {
        if (isNaN(tabSize) || this.$tabSize === tabSize) return;

        this.$modified = true;
        this.$tabSize = tabSize;
        this._dispatchEvent("changeTabSize");
    };

    this.getTabSize = function() {
        return this.$tabSize;
    };

    this.isTabStop = function(position) {
        return this.$useSoftTabs && (position.column % this.$tabSize == 0);
    };

    this.$overwrite = false;
    this.setOverwrite = function(overwrite) {
        if (this.$overwrite == overwrite) return;

        this.$overwrite = overwrite;
        this._dispatchEvent("changeOverwrite");
    };

    this.getOverwrite = function() {
        return this.$overwrite;
    };

    this.toggleOverwrite = function() {
        this.setOverwrite(!this.$overwrite);
    };

    this.getBreakpoints = function() {
        return this.$breakpoints;
    };

    this.setBreakpoints = function(rows) {
        this.$breakpoints = [];
        for (var i=0; i<rows.length; i++) {
            this.$breakpoints[rows[i]] = true;
        }
        this._dispatchEvent("changeBreakpoint", {});
    };

    this.clearBreakpoints = function() {
        this.$breakpoints = [];
        this._dispatchEvent("changeBreakpoint", {});
    };

    this.setBreakpoint = function(row) {
        this.$breakpoints[row] = true;
        this._dispatchEvent("changeBreakpoint", {});
    };

    this.clearBreakpoint = function(row) {
        delete this.$breakpoints[row];
        this._dispatchEvent("changeBreakpoint", {});
    };

    this.getBreakpoints = function() {
        return this.$breakpoints;
    };

    this.addMarker = function(range, clazz, type, inFront) {
        var id = this.$markerId++;

        var marker = {
            range : range,
            type : type || "line",
            renderer: typeof type == "function" ? type : null,
            clazz : clazz,
            inFront: !!inFront
        }

        if (inFront) {
            this.$frontMarkers[id] = marker;
            this._dispatchEvent("changeFrontMarker")
        } else {
            this.$backMarkers[id] = marker;
            this._dispatchEvent("changeBackMarker")
        }

        return id;
    };

    this.removeMarker = function(markerId) {
        var marker = this.$frontMarkers[markerId] || this.$backMarkers[markerId];
        if (!marker)
            return;

        var markers = marker.inFront ? this.$frontMarkers : this.$backMarkers;
        if (marker) {
            delete (markers[markerId]);
            this._dispatchEvent(marker.inFront ? "changeFrontMarker" : "changeBackMarker");
        }
    };

    this.getMarkers = function(inFront) {
        return inFront ? this.$frontMarkers : this.$backMarkers;
    };

    /**
     * Error:
     *  {
     *    row: 12,
     *    column: 2, //can be undefined
     *    text: "Missing argument",
     *    type: "error" // or "warning" or "info"
     *  }
     */
    this.setAnnotations = function(annotations) {
        this.$annotations = {};
        for (var i=0; i<annotations.length; i++) {
            var annotation = annotations[i];
            var row = annotation.row;
            if (this.$annotations[row])
                this.$annotations[row].push(annotation);
            else
                this.$annotations[row] = [annotation];
        }
        this._dispatchEvent("changeAnnotation", {});
    };

    this.getAnnotations = function() {
        return this.$annotations;
    };

    this.clearAnnotations = function() {
        this.$annotations = {};
        this._dispatchEvent("changeAnnotation", {});
    };

    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r?\n)/m);
        if (match) {
            this.$autoNewLine = match[1];
        } else {
            this.$autoNewLine = "\n";
        }
    };

    this.tokenRe = /^[\w\d]+/g;
    this.nonTokenRe = /^(?:[^\w\d]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF])+/g;

    this.getWordRange = function(row, column) {
        var line = this.getLine(row);

        var inToken = false;
        if (column > 0) {
            inToken = !!line.charAt(column - 1).match(this.tokenRe);
        }

        if (!inToken) {
            inToken = !!line.charAt(column).match(this.tokenRe);
        }

        var re = inToken ? this.tokenRe : this.nonTokenRe;

        var start = column;
        if (start > 0) {
            do {
                start--;
            }
            while (start >= 0 && line.charAt(start).match(re));
            start++;
        }

        var end = column;
        while (end < line.length && line.charAt(end).match(re)) {
            end++;
        }

        return new Range(row, start, row, end);
    };

    this.setNewLineMode = function(newLineMode) {
        this.doc.setNewLineMode(newLineMode);
    };

    this.getNewLineMode = function() {
        return this.doc.getNewLineMode();
    };

    this.$useWorker = true;
    this.setUseWorker = function(useWorker) {
        if (this.$useWorker == useWorker)
            return;

        if (useWorker && !this.$worker && window.Worker)
            this.$worker = mode.createWorker(this);

        if (!useWorker && this.$worker) {
            this.$worker.terminate();
            this.$worker = null;
        }

        this.$useWorker = useWorker;
    };

    this.getUseWorker = function() {
        return this.$useWorker;
    };

    this.onReloadTokenizer = function(e) {
        var rows = e.data;
        this.bgTokenizer.start(rows.first);
        this._dispatchEvent("tokenizerUpdate", e);
    };

    this.$mode = null;
    this.setMode = function(mode) {
        if (this.$mode === mode) return;

        if (this.$worker)
            this.$worker.terminate();

        if (this.$useWorker && typeof Worker !== "undefined" && !require.noWorker)
            this.$worker = mode.createWorker(this);
        else
            this.$worker = null;

        var tokenizer = mode.getTokenizer();

        if(tokenizer.addEventListener !== undefined) {
            var onReloadTokenizer = this.onReloadTokenizer.bind(this);
            tokenizer.addEventListener("update", onReloadTokenizer);
        }

        if (!this.bgTokenizer) {
            this.bgTokenizer = new BackgroundTokenizer(tokenizer);
            var _self = this;
            this.bgTokenizer.addEventListener("update", function(e) {
                _self._dispatchEvent("tokenizerUpdate", e);
            });
        } else {
            this.bgTokenizer.setTokenizer(tokenizer);
        }

        this.bgTokenizer.setDocument(this.getDocument());
        this.bgTokenizer.start(0);

        this.$mode = mode;
        this._dispatchEvent("changeMode");
    };

    this.getMode = function() {
        return this.$mode;
    };

    this.$scrollTop = 0;
    this.setScrollTopRow = function(scrollTopRow) {
        if (this.$scrollTop === scrollTopRow) return;

        this.$scrollTop = scrollTopRow;
        this._dispatchEvent("changeScrollTop");
    };

    this.getScrollTopRow = function() {
        return this.$scrollTop;
    };

    this.getWidth = function() {
        this.$computeWidth();
        return this.width;
    };

    this.getScreenWidth = function() {
        this.$computeWidth();
        return this.screenWidth;
    };

    this.$computeWidth = function(force) {
        if (this.$modified || force) {
            this.$modified = false;

            var lines = this.doc.getAllLines();
            var longestLine = 0;
            var longestScreenLine = 0;

            for ( var i = 0; i < lines.length; i++) {
                var foldLine = this.getFoldLine(i),
                    line, len;

                line = lines[i];
                if (foldLine) {
                    var end = foldLine.range.end;
                    line = this.getFoldDisplayLine(foldLine, end.row, line.length);
                    // Continue after the foldLine.end.row. All the lines in
                    // between are folded.
                    i = end.row;
                }
                len = line.length;
                longestLine = Math.max(longestLine, len);
                if (!this.$useWrapMode) {
                    longestScreenLine = Math.max(
                        longestScreenLine,
                        this.$getStringScreenWidth(line)[0]
                    );
                }
            }
            this.width = longestLine;

            if (this.$useWrapMode) {
                this.screenWidth = this.$wrapLimit;
            } else {
                this.screenWidth = longestScreenLine;
            }
        }
    };

    /**
     * Get a verbatim copy of the given line as it is in the document
     */
    this.getLine = function(row) {
        return this.doc.getLine(row);
    };

    this.getLines = function(firstRow, lastRow) {
        return this.doc.getLines(firstRow, lastRow);
    };

    this.getLength = function() {
        return this.doc.getLength();
    };

    this.getTextRange = function(range) {
        return this.doc.getTextRange(range);
    };

    this.findMatchingBracket = function(position) {
        if (position.column == 0) return null;

        var charBeforeCursor = this.getLine(position.row).charAt(position.column-1);
        if (charBeforeCursor == "") return null;

        var match = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
        if (!match) {
            return null;
        }

        if (match[1]) {
            return this.$findClosingBracket(match[1], position);
        } else {
            return this.$findOpeningBracket(match[2], position);
        }
    };

    this.$brackets = {
        ")": "(",
        "(": ")",
        "]": "[",
        "[": "]",
        "{": "}",
        "}": "{"
    };

    this.$findOpeningBracket = function(bracket, position) {
        var openBracket = this.$brackets[bracket];

        var column = position.column - 2;
        var row = position.row;
        var depth = 1;

        var line = this.getLine(row);

        while (true) {
            while(column >= 0) {
                var ch = line.charAt(column);
                if (ch == openBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: row, column: column};
                    }
                }
                else if (ch == bracket) {
                    depth +=1;
                }
                column -= 1;
            }
            row -=1;
            if (row < 0) break;

            var line = this.getLine(row);
            var column = line.length-1;
        }
        return null;
    };

    this.$findClosingBracket = function(bracket, position) {
        var closingBracket = this.$brackets[bracket];

        var column = position.column;
        var row = position.row;
        var depth = 1;

        var line = this.getLine(row);
        var lineCount = this.getLength();

        while (true) {
            while(column < line.length) {
                var ch = line.charAt(column);
                if (ch == closingBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: row, column: column};
                    }
                }
                else if (ch == bracket) {
                    depth +=1;
                }
                column += 1;
            }
            row +=1;
            if (row >= lineCount) break;

            var line = this.getLine(row);
            var column = 0;
        }
        return null;
    };

    this.insert = function(position, text) {
        return this.doc.insert(position, text);
    };

    this.remove = function(range) {
        return this.doc.remove(range);
    };

    this.undoChanges = function(deltas) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        this.doc.revertDeltas(deltas);
        this.$fromUndo = false;

        this.$setUndoSelection(deltas, true);
    },

    this.redoChanges = function(deltas) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        this.doc.applyDeltas(deltas);
        this.$fromUndo = false;

        this.$setUndoSelection(deltas, false);
    },

    this.$setUndoSelection = function(deltas, isUndo) {
        // invert deltas is they are an undo
        if (isUndo)
            deltas = deltas.map(function(delta) {
                var d = {
                    range: delta.range
                }
                if (delta.action == "insertText" || delta.action == "insertLines")
                    d.action = "removeText"
                else
                    d.action = "insertText"
                return d;
            }).reverse();


        var actions = [{}];

        // collapse insert and remove operations
        for (var i=0; i<deltas.length; i++) {
            var delta = deltas[i];
            var isInsert = delta.action == "insertText" || delta.action == "insertLines";
            var action = actions[actions.length-1];
            if (action.isInsert !== isInsert) {
                actions.push({
                    isInsert: isInsert,
                    start: isInsert ? delta.range.start : delta.range.end,
                    end: isInsert ? delta.range.end : delta.range.start
                })
            }
            else {
                if (isInsert)
                    action.end = delta.range.end;
                else
                    action.start = delta.range.start;
            }
        }

        // update selection based on last operation
        this.selection.clearSelection();
        var action = actions[actions.length-1];
        if (action.isInsert)
            this.selection.setSelectionRange(Range.fromPoints(action.start, action.end));
        else
            this.selection.moveCursorToPosition(action.end);
    },

    this.replace = function(range, text) {
        return this.doc.replace(range, text);
    };

    /**
     * Move a range of text from the given range to the given position.
     *
     * @param fromRange {Range} The range of text you want moved within the
     * document.
     * @param toPosition {Object} The location (row and column) where you want
     * to move the text to.
     * @return {Range} The new range where the text was moved to.
     */
    this.moveText = function(fromRange, toPosition) {
        var text = this.getTextRange(fromRange);
        this.remove(fromRange);

        var toRow = toPosition.row;
        var toColumn = toPosition.column;

        // Make sure to update the insert location, when text is removed in
        // front of the chosen point of insertion.
        if (!fromRange.isMultiLine() && fromRange.start.row == toRow &&
            fromRange.end.column < toColumn)
            toColumn -= text.length;

        if (fromRange.isMultiLine() && fromRange.end.row < toRow) {
            var lines = this.doc.$split(text);
            toRow -= lines.length - 1;
        }

        var endRow = toRow + fromRange.end.row - fromRange.start.row;
        var endColumn = fromRange.isMultiLine() ?
                        fromRange.end.column :
                        toColumn + fromRange.end.column - fromRange.start.column;

        var toRange = new Range(toRow, toColumn, endRow, endColumn);

        this.insert(toRange.start, text);

        return toRange;
    };

    this.indentRows = function(startRow, endRow, indentString) {
        indentString = indentString.replace(/\t/g, this.getTabString());
        for (var row=startRow; row<=endRow; row++) {
            this.insert({row: row, column:0}, indentString);
        }
    };

    this.outdentRows = function (range) {
        var rowRange = range.collapseRows();
        var deleteRange = new Range(0, 0, 0, 0);
        var size = this.getTabSize();

        for (var i = rowRange.start.row; i <= rowRange.end.row; ++i) {
            var line = this.getLine(i);

            deleteRange.start.row = i;
            deleteRange.end.row = i;
            for (var j = 0; j < size; ++j)
                if (line.charAt(j) != ' ')
                    break;
            if (j < size && line.charAt(j) == '\t') {
                deleteRange.start.column = j;
                deleteRange.end.column = j + 1;
            } else {
                deleteRange.start.column = 0;
                deleteRange.end.column = j;
            }
            this.remove(deleteRange);
        }
    };

    this.moveLinesUp = function(firstRow, lastRow) {
        if (firstRow <= 0) return 0;

        var removed = this.doc.removeLines(firstRow, lastRow);
        this.doc.insertLines(firstRow - 1, removed);
        return -1;
    };

    this.moveLinesDown = function(firstRow, lastRow) {
        if (lastRow >= this.doc.getLength()-1) return 0;

        var removed = this.doc.removeLines(firstRow, lastRow);
        this.doc.insertLines(firstRow+1, removed);
        return 1;
    };

    this.duplicateLines = function(firstRow, lastRow) {
        var firstRow = this.$clipRowToDocument(firstRow);
        var lastRow = this.$clipRowToDocument(lastRow);

        var lines = this.getLines(firstRow, lastRow);
        this.doc.insertLines(firstRow, lines);

        var addedRows = lastRow - firstRow + 1;
        return addedRows;
    };

    this.$clipRowToDocument = function(row) {
        return Math.max(0, Math.min(row, this.doc.getLength()-1));
    };

    // WRAPMODE
    this.$wrapLimit = 80;
    this.$useWrapMode = false;
    this.$wrapLimitRange = {
        min : null,
        max : null
    };

    this.setUseWrapMode = function(useWrapMode) {
        if (useWrapMode != this.$useWrapMode) {
            this.$useWrapMode = useWrapMode;
            this.$modified = true;

            // If wrapMode is activaed, the wrapData array has to be initialized.
            if (useWrapMode) {
                var len = this.getLength();
                this.$wrapData = [];
                for (i = 0; i < len; i++) {
                    this.$wrapData.push([]);
                }
                this.$updateWrapData(0, len - 1);
            }

            this._dispatchEvent("changeWrapMode");
        }
    };

    this.getUseWrapMode = function() {
        return this.$useWrapMode;
    };

    // Allow the wrap limit to move freely between min and max. Either
    // parameter can be null to allow the wrap limit to be unconstrained
    // in that direction. Or set both parameters to the same number to pin
    // the limit to that value.
    this.setWrapLimitRange = function(min, max) {
        if (this.$wrapLimitRange.min !== min || this.$wrapLimitRange.max !== max) {
            this.$wrapLimitRange.min = min;
            this.$wrapLimitRange.max = max;
            this.$modified = true;
            // This will force a recalculation of the wrap limit
            this._dispatchEvent("changeWrapMode");
        }
    };

    // This should generally only be called by the renderer when a resize
    // is detected.
    this.adjustWrapLimit = function(desiredLimit) {
        var wrapLimit = this.$constrainWrapLimit(desiredLimit);
        if (wrapLimit != this.$wrapLimit && wrapLimit > 0) {
            this.$wrapLimit = wrapLimit;
            this.$modified = true;
            if (this.$useWrapMode) {
                this.$updateWrapData(0, this.getLength() - 1);
                this._dispatchEvent("changeWrapLimit");
            }
            return true;
        }
        return false;
    };

    this.$constrainWrapLimit = function(wrapLimit) {
        var min = this.$wrapLimitRange.min;
        if (min)
            wrapLimit = Math.max(min, wrapLimit);

        var max = this.$wrapLimitRange.max;
        if (max)
            wrapLimit = Math.min(max, wrapLimit);

        // What would a limit of 0 even mean?
        return Math.max(1, wrapLimit);
    };

    this.getWrapLimit = function() {
        return this.$wrapLimit;
    };

    this.getWrapLimitRange = function() {
        // Avoid unexpected mutation by returning a copy
        return {
            min : this.$wrapLimitRange.min,
            max : this.$wrapLimitRange.max
        };
    };

    // TODO: Really want to keep this name?
    this.$updateInternalDataOnChange = function(e) {
        var useWrapMode = this.$useWrapMode;
        var len;
        var action = e.data.action;
        var firstRow = e.data.range.start.row,
            lastRow = e.data.range.end.row,
            start = e.data.range.start,
            end = e.data.range.end;

//        console.log("onChange", action, e.data.range + "");

        if (action.indexOf("Lines") != -1) {
            if (action == "insertLines") {
                lastRow = firstRow + (e.data.lines.length);
            } else {
                lastRow = firstRow;
            }
            len = e.data.lines.length;
        } else {
            len = lastRow - firstRow;
        }

        if (len != 0) {
            if (action.indexOf("remove") != -1) {
                useWrapMode && this.$wrapData.splice(firstRow, len);

                var foldLines = this.$foldData;
                var folds = this.getFoldsInRange(e.data.range);
                this.removeFolds(folds);

                var foldLine = this.getFoldLine(lastRow);
                var idx = 0;
                if (foldLine) {
                    foldLine.addRemoveChars(end.row, end.column, start.column - end.column);
                    foldLine.shiftRow(-len);

                    var foldLineBefore = this.getFoldLine(firstRow);
                    if (foldLineBefore && foldLineBefore !== foldLine) {
                        foldLineBefore.merge(foldLine);
                        foldLine = foldLineBefore;
                    }
                    idx = foldLines.indexOf(foldLine) + 1;
                }

                for (idx; idx < foldLines.length; idx++) {
                    var foldLine = foldLines[idx];
                    if (foldLine.start.row >= lastRow) {
                        foldLine.shiftRow(-len);
                    }
                }

                lastRow = firstRow;
            } else {
                var args;
                if (useWrapMode) {
                    args = [firstRow, 0];
                    for (var i = 0; i < len; i++) args.push([]);
                    this.$wrapData.splice.apply(this.$wrapData, args);
                }

                // If some new line is added inside of a foldLine, then split
                // the fold line up.
                var foldLines = this.$foldData;
                var foldLine = this.getFoldLine(firstRow);
                var idx = 0;
                if (foldLine) {
                    var cmp = foldLine.range.compareInside(start.row, start.column)
                    // Inside of the foldLine range. Need to split stuff up.
                    if (cmp == 0) {
                        // TODO: Handle case where inseration is inside of fold!

                        foldLine = foldLine.split(start.row, start.column);
                        foldLine.shiftRow(len);
                        foldLine.addRemoveChars(
                            lastRow, 0, end.column - start.column);
                    } else
                    // Infront of the foldLine but same row. Need to shift column.
                    if (cmp == -1) {
                        foldLine.addRemoveChars(firstRow, 0, end.column - start.column);
                        foldLine.shiftRow(len);
                    }
                    // Nothing to do if the insert is after the foldLine.
                    idx = foldLines.indexOf(foldLine) + 1;
                }

                for (idx; idx < foldLines.length; idx++) {
                    var foldLine = foldLines[idx];
                    if (foldLine.start.row >= firstRow) {
                        foldLine.shiftRow(len);
                    }
                }
            }
        } else {
            // Realign folds. E.g. if you add some new chars before a fold, the
            // fold should "move" to the right.
            var column;
            len = Math.abs(e.data.range.start.column - e.data.range.end.column);
            if (action.indexOf("remove") != -1) {
                // Get all the folds in the change range and remove them.
                this.removeFolds(this.getFoldsInRange(e.data.range));
                len = -len;
            }
            var foldLine = this.getFoldLine(firstRow);
            if (foldLine) {
                foldLine.addRemoveChars(firstRow, start.column, len);
            }
        }

        if (useWrapMode && this.$wrapData.length != this.doc.$lines.length) {
            console.error("The length of doc.$lines and $wrapData have to be the same!");
        }

        // TODO:
        // this.$updateFoldData(firstRow, lastRow);
        useWrapMode && this.$updateWrapData(firstRow, lastRow);
    };

    this.$updateWrapData = function(firstRow, lastRow) {
        var lines = this.doc.getAllLines();
        var tabSize = this.getTabSize();
        var wrapData = this.$wrapData;
        var wrapLimit = this.$wrapLimit;

        for (var row = firstRow; row <= lastRow; row++) {
            wrapData[row] =
                this.$computeWrapSplits(lines[row], wrapLimit, tabSize);
        }
    };

    // "Tokens"
    var CHAR = 1,
        CHAR_EXT = 2,
        SPACE = 3,
        TAB = 4,
        TAB_SPACE = 5;

    this.$computeWrapSplits = function(textLine, wrapLimit, tabSize) {
        textLine = lang.stringTrimRight(textLine);
        if (textLine.length == 0) {
            return [];
        }

        var tabSize = this.getTabSize();
        var splits = [];
        var tokens = this.$getDisplayTokens(textLine);
        var displayLength = tokens.length;
        var lastSplit = 0, lastDocSplit = 0;

        function addSplit(screenPos) {
            var displayed = tokens.slice(lastSplit, screenPos);

            // The document size is the current size - the extra width for tabs
            // and multipleWidth characters.
            var len = displayed.length;
            displayed.join("").
                // Get all the tabs spaces.
                replace(/5/g, function(m) {
                    len -= 1;
                }).
                // Get all the multipleWidth characters.
                replace(/2/g, function(m) {
                    len -= 1;
                });

            lastDocSplit += len;
            splits.push(lastDocSplit);
            lastSplit = screenPos;
        }

        while (displayLength - lastSplit > wrapLimit) {
            // This is, where the split should be.
            var split = lastSplit + wrapLimit;

            // If there is a space or tab at this split position.
            if (tokens[split] >= SPACE) {
                // Include all following spaces + tabs in this split as well.
                while (tokens[split] >= SPACE)  {
                    split ++;
                }
                addSplit(split);
            } else {
                // Search for the first non space/tab token.
                for (split; split != lastSplit - 1; split--) {
                    if (tokens[split] >= SPACE) {
                        split++;
                        break;
                    }
                }
                // If we found one, then add the split.
                if (split > lastSplit) {
                    addSplit(split);
                }
                // No space or tab around? Well, force a split then.
                else {
                    addSplit(lastSplit + wrapLimit);
                }
            }
        }
        return splits;
    }

    this.$getDisplayTokens = function(str) {
        var arr = [];
        var tabSize;

        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            // Tab
            if (c == 9) {
                tabSize = this.getScreenTabSize(arr.length);
                arr.push(TAB);
                for (var n = 1; n < tabSize; n++) {
                    arr.push(TAB_SPACE);
                }
            }
            // Space
            else if(c == 32) {
                arr.push(SPACE);
            }
            // full width characters
            else if (isFullWidth(c)) {
                arr.push(CHAR, CHAR_EXT);
            } else {
                arr.push(CHAR);
            }
        }
        return arr;
    }

    /**
     * Calculates the width of the a string on the screen while assuming that
     * the string starts at the first column on the screen.
     *
     * @param string str String to calculate the screen width of
     * @return array
     *      [0]: number of columns for str on screen.
     *      [1]: docColumn position that was read until (useful with screenColumn)
     */
    this.$getStringScreenWidth = function(str, maxScreenColumn, screenColumn) {
        if (maxScreenColumn == 0) {
            return [0, 0];
        }
        if (maxScreenColumn == null) {
            maxScreenColumn = screenColumn +
                str.length * Math.max(this.getTabSize(), 2);
        }
        screenColumn = screenColumn || 0;

        var c, column;
        for (column = 0; column < str.length; column++) {
            c = str.charCodeAt(column);
            // tab
            if (c == 9) {
                screenColumn += this.getScreenTabSize(screenColumn);
            }
            // full width characters
            else if (isFullWidth(c)) {
                screenColumn += 2;
            } else {
                screenColumn += 1;
            }
            if (screenColumn > maxScreenColumn) {
                break
            }
        }

        return [screenColumn, column];
    }

    this.getRowLength = function(row) {
        if (!this.$useWrapMode || !this.$wrapData[row]) {
            return 1;
        } else {
            return this.$wrapData[row].length + 1;
        }
    }

    this.getRowHeight = function(config, row) {
        return this.getRowLength(row) * config.lineHeight;
    }

    this.getScreenLastRowColumn = function(screenRow) {
        // Note: This won't work if someone has more then
        // 1.7976931348623158e+307 characters in one row. But I think we can
        // live with this limitation ;)
        return this.screenToDocumentColumn(screenRow, Number.MAX_VALUE / 10)
    };

    this.getDocumentLastRowColumn = function(docRow, docColumn) {
        var screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.getScreenLastRowColumn(screenRow);
    }

    this.getRowSplitData = function(row) {
        if (!this.$useWrapMode) {
            return undefined;
        } else {
            return this.$wrapData[row];
        }
    };

    /**
     * Returns the width of a tab character at screenColumn.
     */
    this.getScreenTabSize = function(screenColumn) {
        return this.$tabSize - screenColumn % this.$tabSize;
    };

    this.screen2Doc = function(screenRow, screenColumn) {
        var line,
            docRow = 0,
            docColumn = 0, column,
            foldLine,
            lastFoldLine,
            foldLineRowLength;

        var row = 0,
            rowLength = 0;

        while (row <= screenRow) {
            foldLine = this.getFoldLine(docRow, lastFoldLine);
            if (foldLine) {
                lastFoldLine = foldLine;
                rowLength = foldLine.getRowLength();
            } else {
                rowLength = this.getRowLength(docRow);
            }
            if (row + rowLength - 1 >= screenRow) {
                break;
            } else {
                docRow ++;
                row += rowLength;
                if (foldLine) {
                    docRow = foldLine.end.row + 1;
                }
            }
        }

        var splits = null;
        if (foldLine) {
            splits = foldLine.getSplitData();
            docColumn = splits[screenRow - row] || 0;
            walkScreenColumn = 0;

            foldLine.walk(function(placeholder, row, column, lastColumn, isNewRow) {
                var data, str;
                if (placeholder) {
                    data = this.$getStringScreenWidth(placeholder, null, walkScreenColumn);
                    if (data[0] > screenColumn || data[1] == 0) {
                        return true;    // Stop walk.
                    }
                    docColumn += data[1];
                } else {
                    docColumn = lastColumn;
                    if (isNewRow) {
                        docRow = row;
                        line = this.getLine(row);
                    }
                    str = line.substring(lastColumn, column);
                    data = this.$getStringScreenWidth(str, screenColumn, walkScreenColumn);
                    docColumn += data[1];
                    if (data[0] == screenColumn) {
                        return true;    // Stop walk.
                    }
                }
                walkScreenColumn = data[0];
            }.bind(this), foldLine.end.row, this.getLine(foldLine.end.row).length);
        } else {
            line = this.getLine(docRow);
            splits = this.$wrapData[docRow];
            if (this.$useWrapMode && splits) {
                docColumn = splits[screenRow - row - 1] || 0;
                line = line.substring(docColumn);
            }

            docColumn += this.$getStringScreenWidth(line, screenColumn)[1];

            // Need to do some clamping action here.
            if (splits) {
                column = this.$wrapData[docRow][screenRow - row]
                if (docColumn >= column) {
                    // We remove one character at the end such that the docColumn
                    // position returned is not associated to the next row on the
                    // screen.
                    docColumn = column - 1;
                }
            } else {
                docColumn = Math.min(docColumn, line.length);
            }
        }
        return [docRow, docColumn, screenRow, row]
    }

    this.screenToDocumentRow = function(screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).row;
    };

    this.screenToDocumentColumn = function(screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).column;
    };

    this.screenToDocumentPosition = function(row, column) {
        var ret = this.screen2Doc(row, column);
        return {
            row:    ret[0],
            column: ret[1]
        };
    };

    this.doc2Screen = function(docRow, docColumn) {
        var wrapData;
        if (this.$useWrapMode) {
            wrapData = this.$wrapData;
            if (docRow > wrapData.length - 1) {
                return [
                    this.getScreenLength(),
                    wrapData.length == 0 ? 0 : (wrapData[wrapData.length - 1].length - 1)
                ];
            }
        }

        var screenRow = 0,
            screenColumn = 0,
            foldStartRow = null,
            fold = null,
            folds,
            comp,
            foldLine = null, lastFoldLine = null;

        // Clamp the docRow position in case it's inside of a folded block.
        fold = this.getFoldAt(docRow, docColumn, -1);
        if (fold) {
            docRow = fold.start.row;
            docColumn = fold.start.column;
        }

        for (var row = 0; row < docRow; row++) {
            foldLine = this.getFoldLine(row, lastFoldLine);
            if (foldLine) {
                lastFoldLine = foldLine;
                if (foldLine.end.row >= docRow) {
                    break;
                }
                row = foldLine.end.row;
                screenRow += foldLine.getRowLength();
            } else {
                screenRow += this.getRowLength(row);
            }
        }

        // Calculate the text line that is displayed in docRow on the screen.
        var textLine = "";
        foldLine = this.getFoldLine(docRow, lastFoldLine);
        // Check if the final row we want to reach is inside of a fold.
        if (!foldLine) {
            textLine = this.getLine(docRow).substring(0, docColumn);
            foldStartRow = docRow;
        } else {
            textLine = this.getFoldDisplayLine(foldLine, docRow, docColumn);
        }

        // Clamp textLine if in wrapMode.
        if (this.$useWrapMode) {
            var wrapRow = wrapData[foldStartRow];
            var screenRowOffset = 0;
            while (docColumn >= wrapRow[screenRowOffset]) {
                screenRow ++;
                screenRowOffset++;
            }
            textLine = textLine.substring(
                wrapRow[screenRowOffset - 1] || 0,  textLine.length);
        }

        return [screenRow, this.$getStringScreenWidth(textLine)[0], textLine];
    }

    this.documentToScreenPosition = function(pos, column) {
        // Normalize the passed in arguments.
        var row;
        if (column != null) {
            row = pos;
        } else {
            row = pos.row;
            column = pos.column;
        }

        // NEW CODE PATH:
        var res = this.doc2Screen(row, column);
        return {
            row: res[0],
            column: res[1]
        };
    };

    this.documentToScreenColumn = function(row, docColumn) {
        return this.documentToScreenPosition(row, docColumn).column;
    };

    this.documentToScreenRow = function(docRow, docColumn) {
        return this.documentToScreenPosition(docRow, docColumn).row;
    };

    this.getScreenLength = function() {
        var length = this.getLength();
        if (!this.$useWrapMode) {
            screenRows = length;
        } else {
            var screenRows = 0;
            for (var row = 0; row < this.$wrapData.length; row++) {
                screenRows += this.$wrapData[row].length + 1;
            }
        }

        var foldData = this.$foldData;
        for (var i = 0; i < foldData.length; i++) {
            var foldLine = foldData[i];
            screenRows -= foldLine.end.row - foldLine.start.row;
        }
        return screenRows;
    }

    // For every keystroke this gets called once per char in the whole doc!!
    // Wouldn't hurt to make it a bit faster for c >= 0x1100
    function isFullWidth(c) {
        if (c < 0x1100)
            return false;
        return c >= 0x1100 && c <= 0x115F ||
               c >= 0x11A3 && c <= 0x11A7 ||
               c >= 0x11FA && c <= 0x11FF ||
               c >= 0x2329 && c <= 0x232A ||
               c >= 0x2E80 && c <= 0x2E99 ||
               c >= 0x2E9B && c <= 0x2EF3 ||
               c >= 0x2F00 && c <= 0x2FD5 ||
               c >= 0x2FF0 && c <= 0x2FFB ||
               c >= 0x3000 && c <= 0x303E ||
               c >= 0x3041 && c <= 0x3096 ||
               c >= 0x3099 && c <= 0x30FF ||
               c >= 0x3105 && c <= 0x312D ||
               c >= 0x3131 && c <= 0x318E ||
               c >= 0x3190 && c <= 0x31BA ||
               c >= 0x31C0 && c <= 0x31E3 ||
               c >= 0x31F0 && c <= 0x321E ||
               c >= 0x3220 && c <= 0x3247 ||
               c >= 0x3250 && c <= 0x32FE ||
               c >= 0x3300 && c <= 0x4DBF ||
               c >= 0x4E00 && c <= 0xA48C ||
               c >= 0xA490 && c <= 0xA4C6 ||
               c >= 0xA960 && c <= 0xA97C ||
               c >= 0xAC00 && c <= 0xD7A3 ||
               c >= 0xD7B0 && c <= 0xD7C6 ||
               c >= 0xD7CB && c <= 0xD7FB ||
               c >= 0xF900 && c <= 0xFAFF ||
               c >= 0xFE10 && c <= 0xFE19 ||
               c >= 0xFE30 && c <= 0xFE52 ||
               c >= 0xFE54 && c <= 0xFE66 ||
               c >= 0xFE68 && c <= 0xFE6B ||
               c >= 0xFF01 && c <= 0xFF60 ||
               c >= 0xFFE0 && c <= 0xFFE6;
    };

    // == Folding Code ========================================================

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

    /**
     * Creates a new FoldLine. If the an array is passed in, the folds are
     * expected to be sorted already.
     */
    function FoldLine(foldData, folds) {
        this.foldData = foldData;
        if (Array.isArray(folds)) {
            this.folds = folds;
        } else {
            folds = this.folds = [ folds ];
        }

        var last = folds[folds.length - 1]
        this.range = new Range(folds[0].start.row, folds[0].start.column,
                               last.end.row, last.end.column);
        this.start = this.range.start;
        this.end   = this.range.end;

        this.folds.forEach(function(fold) {
            fold.foldLine = this;
        }, this);
    }

    (function() {
        this.shiftRow = function(shift) {
            this.start.row += shift;
            this.end.row += shift;
            this.folds.forEach(function(fold) {
                fold.start.row += shift;
                fold.end.row += shift;
            });
        }

        this.addFold = function(fold) {
            if (fold.sameRow) {
                if (fold.start.row < this.startRow || fold.endRow > this.endRow) {
                    throw "Can't add a fold to this FoldLine as it has no connection";
                }
                this.folds.push(fold);
                this.folds.sort(function(a, b) {
                    return -a.range.compareEnd(b.start.row, b.start.column);
                });
                if (this.range.compareEnd(fold.start.row, fold.start.column) > 0) {
                    this.end.row = fold.end.row;
                    this.end.column =  fold.end.column;
                } else if (this.range.compareStart(fold.end.row, fold.end.column) < 0) {
                    this.start.row = fold.start.row;
                    this.start.column = fold.start.column;
                }
            } else if (fold.start.row == this.end.row) {
                this.folds.push(fold);
                this.end.row = fold.end.row;
                this.end.column = fold.end.column;
            } else if (fold.end.row == this.start.row) {
                this.folds.unshift(fold);
                this.start.row = fold.start.row;
                this.start.column = fold.start.column;
            } else {
                throw "Trying to add fold to FoldRow that doesn't have a matching row";
            }
            fold.foldLine = this;
        }

        this.getRowLength = function() {
            // TODO: Add support for wrapped lines here.
            return 1;
        }

        this.getSplitData = function() {
            // TODO: Add support for wrapped lines here.
            return [];
        }

        this.containsRow = function(row) {
            return row >= this.start.row && row <= this.end.row;
        }

        this.walk = function(callback, endRow, endColumn) {
            var lastEnd = 0,
                folds = this.folds,
                fold,
                comp, stop, isNewRow = true;

            if (endRow == null) {
                endRow = this.end.row;
                endColumn = this.end.column;
            }

            for (var i = 0; i < folds.length; i++) {
                fold = folds[i];

                comp = fold.range.compareEnd(endRow, endColumn);
                // This fold is after the endRow/Column.
                if (comp == -1) {
                    callback(null, endRow, endColumn, lastEnd, isNewRow);
                    return;
                }
                // The endRow/Column is inside of the current fold.
                else if (comp == 0) {
                    callback(null, endRow, fold.start.column, lastEnd, isNewRow);
                    return;
                }

                stop = callback(null, fold.start.row, fold.start.column, lastEnd, isNewRow);
                stop = stop || callback(fold.placeholder);

                if (stop) {
                    return;
                }

                // Note the new lastEnd might not be on the same line. However,
                // it's the callback's job to recognize this.
                isNewRow = !fold.sameRow;
                lastEnd = fold.end.column;
            }
            callback(null, endRow, endColumn, lastEnd, isNewRow);
        }

        this.getNextFoldTo = function(row, column) {
            var fold, cmp;
            for (var i = 0; i < this.folds.length; i++) {
                fold = this.folds[i];
                cmp = fold.range.compareEnd(row, column);
                if (cmp == -1) {
                    return {
                        fold: fold,
                        kind: "after"
                    };
                } else if (cmp == 0) {
                    return {
                        fold: fold,
                        kind: "inside"
                    }
                }
            }
            return null;
        }

        this.addRemoveChars = function(row, column, len) {
            var ret = this.getNextFoldTo(row, column),
                fold, folds;
            if (ret) {
                fold = ret.fold;
                if (ret.kind == "inside"
                    && fold.start.column != column
                    && fold.start.row != row)
                {
                    // TODO: Implement adding new characters inside of an
                    // fold. This should extend/remove the fold etc.
                } else if (fold.start.row == row) {
                    folds = this.folds;
                    var i = folds.indexOf(fold);
                    if (i == 0) {
                        this.start.column += len;
                    }
                    for (i; i < folds.length; i++) {
                        fold = folds[i];
                        fold.start.column += len;
                        if (!fold.sameRow) {
                            return;
                        }
                        fold.end.column += len;
                    }
                    this.end.column += len;
                }
            }
        }

        this.split = function(row, column) {
            var fold = this.getNextFoldTo(row, column).fold,
                folds = this.folds;
            var foldData = this.foldData;

            if (!fold) {
                return null;
            }
            var i = folds.indexOf(fold);
            var foldBefore = folds[i - 1];
            this.end.row = foldBefore.end.row;
            this.end.column = foldBefore.end.column;

            // Remove the folds after row/column and create a new FoldLine
            // containing these removed folds.
            folds = folds.splice(i, folds.length - i);



            var newFoldLine = new FoldLine(foldData, folds);
            foldData.splice(foldData.indexOf(this) + 1, 0, newFoldLine);
            return newFoldLine;
        }

        this.merge = function(foldLineNext) {
            var folds = foldLineNext.folds;
            for (var i = 0; i < folds.length; i++) {
                this.addFold(folds[i]);
            }
            // Remove the foldLineNext - no longer needed, as
            // it's merged now with foldLineNext.
            var foldData = this.foldData;
            foldData.splice(foldData.indexOf(foldLineNext), 1);
        }

        this.toString = function() {
            var ret = [this.range.toString() + ": [" ];

            this.folds.forEach(function(fold) {
                ret.push("  " + fold.toString());
            });
            ret.push("]")
            return ret.join("\n");
        }
    }).call(FoldLine.prototype);

    FoldLine.prototype.__defineGetter__("rangeDBG", function() {
        return this.range + "";
    })

    this.getFoldAt = function(row, column, side) {
        var foldLine = this.getFoldLine(row);
        if (foldLine) {
            var folds = foldLine.folds,
                fold;

            for (var i = 0; i < folds.length; i++) {
                fold = folds[i];
                if (fold.range.contains(row, column)) {
                    if (side == -1 && fold.range.isEnd(row, column)) {
                        return null;
                    } else if (side == 1 && fold.range.isStart(row, column)) {
                        return null
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
    }

    /**
     * Adds a new fold.
     */
    this.addFold = function(range, placeholder) {
        var startRow = range.start.row,
            endRow   = range.end.row,
            foldData = this.$foldData,
            foldRow  = null;

        var fold = new Fold(range, placeholder);
        var added = false;

        // For now we assume that no two folds are created for the same range!
        for (var i = 0; i < foldData.length; i++) {
            var foldLine = foldData[i];
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
            this.$addFoldLine(new FoldLine(this.$foldData, fold));
        }

        // TODO: Recalculate wrapData

        // Notify that fold data has changed.
        this.$modified = true;
        this._dispatchEvent("changeFold");
    };

    this.removeFold = function(fold) {
        var foldLine = fold.foldLine;

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

        // TODO: Update wrapData.

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

}).call(EditSession.prototype);

exports.EditSession = EditSession;
});
