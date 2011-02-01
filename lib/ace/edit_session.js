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

var oop = require("pilot/oop");
var lang = require("pilot/lang");
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var Selection = require("ace/selection").Selection;
var TextMode = require("ace/mode/text").Mode;
var Range = require("ace/range").Range;
var Document = require("ace/document").Document;

var NO_CHANGE_DELTAS = {};

var EditSession = function(text, mode) {
    this.$modified = true;
    this.selection = new Selection(this);
    this.$breakpoints = [];
    this.$wrapData = [];
    this.listeners = [];

    if (text instanceof Document) {
        this.setDocument(text);
    } else {
        this.setDocument(new Document(text));
    }

    if (mode)
        this.setMode(mode);
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
        if (!this.$fromUndo && this.$undoManager) {
            this.$deltas.push(delta);
            this.$informUndoManager.schedule();
        }

        this.$updateWrapDataOnChange(e);
        this._dispatchEvent("change", e);
    };

    this.setValue = function(text) {
      this.doc.setValue(text);
      this.$deltas = [];
    };

    this.getValue =
    this.toString = function() {
        return this.doc.getValue();
    };

    this.getSelection = function() {
        return this.selection;
    };

    this.setUndoManager = function(undoManager) {
        this.$undoManager = undoManager;
        this.$deltas = [];

        if (this.$informUndoManager) {
            this.$informUndoManager.cancel();
        }

        if (undoManager) {
            var self = this;
            this.$informUndoManager = lang.deferredCall(function() {
                if (self.$deltas.length > 0)
                    undoManager.execute({
                        action : "aceupdate",
                        args   : [self.$deltas, self]
                    });
                self.$deltas = [];
            });
        }
    };

    this.$defaultUndoManager = {
        undo: function() {},
        redo: function() {}
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
        this.$annotations = [];
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
        this.$annotations = [];
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
    this.nonTokenRe = /^(?:[^\w\d|[\u3040-\u309F]|[\u30A0-\u30FF]|[\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF])+/g;

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

    this.$mode = null;
    this.setMode = function(mode) {
        if (this.$mode === mode) return;

        if (this.$worker)
            this.$worker.terminate();

        if (window.Worker)
            this.$worker = mode.createWorker(this);
        else 
            this.$worker = null;

        this.$mode = mode;
        this._dispatchEvent("changeMode");
    };

    this.getMode = function() {
        if (!this.$mode) {
            this.$mode = new TextMode();
        }
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
            var tabSize = this.getTabSize();

            for ( var i = 0; i < lines.length; i++) {
                var len = lines[i].length;
                longestLine = Math.max(longestLine, len);

                lines[i].replace(/\t/g, function(m) {
                    len += tabSize-1;
                    return m;
                });
                longestScreenLine = Math.max(longestScreenLine, len);
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

    /**
     * Get a line as it is displayed on screen. Tabs are replaced by spaces.
     */
    this.getDisplayLine = function(row) {
        var tab = new Array(this.getTabSize()+1).join(" ");
        return this.doc.getLine(row).replace(/\t/g, tab);
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

    /**
     * @param rows Array[Integer] sorted list of rows
     */
    this.multiRowInsert = function(rows, column, text) {
        for (var i=rows.length-1; i>=0; i--) {
            var row = rows[i];
            if (row >= this.doc.getLength())
                continue;

            var diff = column - this.doc.getLine(row).length;
            if ( diff > 0) {
                var padded = lang.stringRepeat(" ", diff) + text;
                var offset = -diff;
            }
            else {
                padded = text;
                offset = 0;
            }

            var end = this.insert({row: row, column: column+offset}, padded);
        }

        return {
            rows: end ? end.row - rows[0] : 0,
            columns: end ? end.column - column : 0
        };
    };

    this.remove = function(range) {
        return this.doc.remove(range);
    };

    this.multiRowRemove = function(rows, range) {
        if (range.start.row !== rows[0])
            throw new TypeError("range must start in the first row!");

        var height = range.end.row - rows[0];
        for (var i=rows.length-1; i>=0; i--) {
            var row = rows[i];
            if (row >= this.doc.getLength())
                continue;

            var end = this.remove(new Range(row, range.start.column, row+height, range.end.column));
        }
    };

    this.undoChanges = function(deltas) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        this.doc.revertDeltas(deltas);
        this.$fromUndo = false;

        // update the selection
        var firstDelta = deltas[0];
        var lastDelta = deltas[deltas.length-1];

        this.selection.clearSelection();
        if (firstDelta.action == "insertText" || firstDelta.action == "insertLines")
            this.selection.moveCursorToPosition(firstDelta.range.start);
        if (firstDelta.action == "removeText" || firstDelta.action == "removeLines")
            this.selection.setSelectionRange(Range.fromPoints(lastDelta.range.start, firstDelta.range.end));
    },

    this.redoChanges = function(deltas) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        this.doc.applyDeltas(deltas);
        this.$fromUndo = false;

        // update the selection
        var firstDelta = deltas[0];
        var lastDelta = deltas[deltas.length-1];

        this.selection.clearSelection();
        if (firstDelta.action == "insertText" || firstDelta.action == "insertLines")
            this.selection.setSelectionRange(Range.fromPoints(firstDelta.range.start, lastDelta.range.end));
        if (firstDelta.action == "removeText" || firstDelta.action == "removeLines")
            this.selection.moveCursorToPosition(lastDelta.range.start);
    },

    this.replace = function(range, text) {
        return this.doc.replace(range, text);
    };

    this.indentRows = function(startRow, endRow, indentString) {
        indentString = indentString.replace(/\t/g, this.getTabString());
        for (var row=startRow; row<=endRow; row++) {
            this.insert({row: row, column:0}, indentString);
        }
        return indentString.length;
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
            if (i == range.start.row)
                range.start.column -= deleteRange.end.column - deleteRange.start.column;
            if (i == range.end.row)
                range.end.column -= deleteRange.end.column - deleteRange.start.column;
            this.remove(deleteRange);
        }
        return range;
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

    this.setUseWrapMode = function(useWrapMode) {
        if (useWrapMode != this.$useWrapMode) {
            this.$useWrapMode = useWrapMode;
            this.$updateWrapData(0, this.getLength() - 1);
            this.$modified = true;
            this._dispatchEvent("changeWrapMode");
        }
    };

    this.getUseWrapMode = function() {
        return this.$useWrapMode;
    };

    this.setWrapLimit = function(wrapLimit) {
        if (wrapLimit != this.$wrapLimit) {
            this.$wrapLimit = wrapLimit;
            this.$updateWrapData(0, this.getLength() - 1);
            this._dispatchEvent("changeWrapMode");
        }
    };

    this.getWrapLimit = function() {
        return this.$wrapLimit;
    };

    this.$updateWrapDataOnChange = function(e) {
        if (!this.$useWrapMode) {
            return;
        }

        var action = e.data.action;
        var firstRow = e.data.range.start.row,
            lastRow = e.data.range.end.row;

        if (action.indexOf("Lines") != -1) {
            if (action == "insertLines") {
                lastRow = firstRow + e.data.lines.length;
            } else {
                firstRow = lastRow - e.data.lines.length;
            }
        }

        if (firstRow != lastRow) {
            var len = lastRow - firstRow;
            if (action.indexOf("remove") != -1) {
                this.$wrapData.splice(firstRow, len);
                lastRow = firstRow;
            } else {
                var args = [firstRow, 0];
                for (var i = 0; i < len; i++) args.push([]);
                this.$wrapData.splice.apply(this.$wrapData, args);
            }
        }

        this.$updateWrapData(firstRow, lastRow);
    };

    this.$updateWrapData = function(firstRow, lastRow) {
        var lines = this.doc.getAllLines();
        var tabSize = this.getTabSize();
        var wrapData = this.$wrapData;
        var wrapLimit = this.$wrapLimit;

        // Remove lines that are no longer there.
        wrapData.splice(lines.length, wrapData.length - lines.length);

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
        textLine = textLine.trimRight();
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
                // Get all the tabs.
                replace(/4/g, function(m) {
                    len -= tabSize - 1;
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
        var tabSize = this.getTabSize();

        for (var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i);
			// Tab
			if (c == 9) {
			    arr.push(TAB);
			    for (var n = 1; n < tabSize; n++) {
			        arr.push(TAB_SPACE);
			    }
			}
			// Space
			else if(c == 32) {
			    arr.push(SPACE);
			}
    		// CJK characters
            else if (
                c >= 0x3040 && c <= 0x309F || // Hiragana
                c >= 0x30A0 && c <= 0x30FF || // Katakana
                c >= 0x4E00 && c <= 0x9FFF || // Single CJK ideographs
                c >= 0xF900 && c <= 0xFAFF ||
                c >= 0x3400 && c <= 0x4DBF
            ) {
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
     * @return int number of columns for str on screen.
     */
    this.$getStringScreenWidth = function(str) {
        var screenColumn = 0;
        var tabSize = this.getTabSize();
		
		for (var i=0; i<str.length; i++) {
			var c = str.charCodeAt(i);
			// tab
			if (c == 9) {
				screenColumn += tabSize;
			}
    		// CJK characters
            else if (
                c >= 0x3040 && c <= 0x309F || // Hiragana
                c >= 0x30A0 && c <= 0x30FF || // Katakana
                c >= 0x4E00 && c <= 0x9FFF || // Single CJK ideographs
                c >= 0xF900 && c <= 0xFAFF ||
                c >= 0x3400 && c <= 0x4DBF
            ) {
            	screenColumn += 2;
			} else {
				screenColumn += 1;
			}
		}
		
		return screenColumn;
    }

    this.getRowHeight = function(config, row) {
        var rows;
        if (!this.$useWrapMode) {
            rows = 1;
        } else {
            rows = this.$wrapData[row].length + 1;
        }

        return rows * config.lineHeight;
    }

    this.getScreenLastRowColumn = function(screenRow, returnDocPosition) {
        if (!this.$useWrapMode) {
            return this.$getStringScreenWidth(this.getLine(screenRow));
        }

        var rowData = this.$screenToDocumentRow(screenRow);
        var docRow = rowData[0],
            row = rowData[1];

        var start, end;
        if (this.$wrapData[docRow][row]) {
            start = (this.$wrapData[docRow][row - 1] || 0);
            end = this.$wrapData[docRow][row];
            returnDocPosition && end--;
        } else {
            end = this.getLine(docRow).length;
            start = (this.$wrapData[docRow][row - 1] || 0);
        }
        if (!returnDocPosition) {
            return this.$getStringScreenWidth(this.getLine(docRow).substring(start, end));
        } else {
            return end;
        }
    };

    this.getDocumentLastRowColumn = function(docRow, docColumn) {
        if (!this.$useWrapMode) {
            return this.getLine(docRow).length;
        }

        var screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.getScreenLastRowColumn(screenRow, true);
    }

    this.getScreenFirstRowColumn = function(screenRow) {
        if (!this.$useWrapMode) {
            return 0;
        }

        var rowData = this.$screenToDocumentRow(screenRow);
        var docRow = rowData[0],
            row = rowData[1];

        return this.$wrapData[docRow][row - 1] || 0;
    };

    this.getRowSplitData = function(row) {
        if (!this.$useWrapMode) {
            return undefined;
        } else {
            return this.$wrapData[row];
        }
    };

    /**
     *
     * @returns array
     * - array[0]: The documentRow equivalent.
     * - array[1]: The screenRowOffset to the first documentRow on the screen.
     */
    this.$screenToDocumentRow = function(row) {
        if (!this.$useWrapMode) {
            return [row, 0];
        }

        var wrapData = this.$wrapData, linesCount = this.getLength();
        var docRow = 0;
        while (docRow < linesCount && row >= wrapData[docRow].length + 1) {
            row -= wrapData[docRow].length + 1;
            docRow ++;
        }

        return [docRow, row];
    };

    this.screenToDocumentRow = function(screenRow) {
        return this.$screenToDocumentRow(screenRow)[0];
    };

    this.screenToDocumentColumn = function(screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).column;
    };

    this.screenToDocumentPosition = function(row, column) {
        var line;
        var docRow;
        var docColumn;
        var remaining = column;
        var linesCount = this.getLength();
        if (!this.$useWrapMode) {
            docRow = row >= linesCount? linesCount-1 : (row < 0 ? 0 : row);
            row = 0;
            docColumn = 0;
            line = this.getLine(docRow);
        } else {
            var wrapData = this.$wrapData;

			var docRow = 0;
			while (docRow < linesCount && row >= wrapData[docRow].length + 1) {
				row -= wrapData[docRow].length + 1;
				docRow ++;
			}

            if (docRow >= linesCount) {
                docRow = linesCount-1
				row = wrapData[docRow].length;
            }
            docColumn = wrapData[docRow][row - 1] || 0;
            line = this.getLine(docRow).substring(docColumn);
        }

        var tabSize = this.getTabSize();
        for(var i = 0; i < line.length; i++) {
            var c = line.charCodeAt(i);

            if (remaining > 0) {
                docColumn += 1;
                // tab
                if (c == 9) {
                    if (remaining >= tabSize) {
                        remaining -= tabSize;
                    } else {
                        remaining = 0;
                        docColumn -= 1;
                    }
                }
                // CJK characters
                else if (
                    c >= 0x3040 && c <= 0x309F || // Hiragana
                    c >= 0x30A0 && c <= 0x30FF || // Katakana
                    c >= 0x4E00 && c <= 0x9FFF || // Single CJK ideographs
                    c >= 0xF900 && c <= 0xFAFF ||
                    c >= 0x3400 && c <= 0x4DBF
                ) {
                    if (remaining >= 2) {
                        remaining -= 2;
                    } else {
                        remaining = 0;
                        docColumn -= 1;
                    }
                } else {
                    remaining -= 1;
                }
            } else {
                break;
            }
        }

        // Clamp docColumn.
        if (this.$useWrapMode) {
            column = wrapData[docRow][row]
			if (docColumn >= column) {
                // We remove one character at the end such that the docColumn
                // position returned is not associated to the next row on the
                // screen.
                docColumn = column - 1;
            }
        } else if (line) {
             docColumn = Math.min(docColumn, line.length);
        }

        return {
            row: docRow,
            column: docColumn
        };
    };

    this.documentToScreenColumn = function(row, docColumn) {
        return this.documentToScreenPosition(row, docColumn).column;
    };

    /**
     *
     * @return array[2]
     * - array[0]: The number of the row on the screen (aka screenRow)
     * - array[1]: The number of rows from the first docRow on the screen
     *              (aka screenRowOffset);
     */
    this.$documentToScreenRow = function(docRow, docColumn) {
        if (!this.$useWrapMode) {
            return [docRow, 0];
        }

        var wrapData = this.$wrapData;
        var screenRow = 0;

        // Handle special case where the row is outside of the range of lines.
        if (docRow > wrapData.length - 1) {
            return [
                this.getScreenLength(),
                wrapData[wrapData.length - 1].length - 1
            ];
        }

        for (var i = 0; i < docRow; i++) {
            screenRow += wrapData[i].length + 1;
        }

        var screenRowOffset = 0;
        while (docColumn >= wrapData[docRow][screenRowOffset]) {
            screenRow ++;
            screenRowOffset++;
        }

        return [screenRow, screenRowOffset];
    }

    this.documentToScreenRow = function(docRow, docColumn) {
        return this.$documentToScreenRow(docRow, docColumn)[0];
    }

    this.documentToScreenPosition = function(pos, column) {
        var str;
        var tabSize = this.getTabSize();

        // Normalize the passed in arguments.
        var row;
        if (column != null) {
            row = pos;
        } else {
            row = pos.row;
            column = pos.column;
        }

        if (!this.$useWrapMode) {
            str = this.getLine(row).substring(0, column);
            column = this.$getStringScreenWidth(str);
            return {
                row: row,
                column: column
            };
        }
        if (row >= this.getLength()) {
            return {
                row: screenRow,
                column: 0
            };
        }

        var split;
        var wrapRowData = this.$wrapData[row];
        var screenRow, screenRowOffset;
        var screenColumn;
        var rowData = this.$documentToScreenRow(row, column);
        screenRow = rowData[0];
        screenRowOffset = rowData[1];

        str = this.getLine(row).substring(
                wrapRowData[screenRowOffset - 1] || 0,  column);
        screenColumn = this.$getStringScreenWidth(str);

        return {
            row: screenRow,
            column: screenColumn
        };
    };

    this.getScreenLength = function() {
        if (!this.$useWrapMode) {
            return this.getLength();
        }

        var screenRows = 0;
        for (var row = 0; row < this.$wrapData.length; row++) {
            screenRows += this.$wrapData[row].length + 1;
        }
        return screenRows;
    }

}).call(EditSession.prototype);

exports.EditSession = EditSession;
});
