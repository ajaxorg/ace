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
 * Ajax.org Services B.V.
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

var Document = function(text, mode) {

    this.modified = true;
    this.lines = [];
    this.selection = new Selection(this);
    this.$breakpoints = [];
    this.$wrapData = [];
    this.$computeWrapDataFn = this.$computeWrapData.bind(this);

    this.listeners = [];
    if (mode) {
        this.setMode(mode);
    }

    if (Array.isArray(text)) {
        this.$insertLines(0, text);
    } else {
        this.$insert({row: 0, column: 0}, text);
    }
};


(function() {

    oop.implement(this, EventEmitter);

    this.$undoManager = null;

    this.$split = function(text) {
        return text.split(/\r\n|\r|\n/);
    };

  	this.setValue = function(text) {
  	    var args = [0, this.lines.length];
  	    args.push.apply(args, this.$split(text));
  	    this.lines.splice.apply(this.lines, args);
  	    this.modified = true;
  	    this.fireChangeEvent(0);
  	};

    this.toString = function() {
        return this.lines.join(this.$getNewLineCharacter());
    };

    this.getSelection = function() {
        return this.selection;
    };

    this.fireChangeEvent = function(firstRow, lastRow) {
        var data = {
            firstRow: firstRow,
            lastRow: lastRow
        };
        this._dispatchEvent("change", { data: data});
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

        this.modified = true;
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

    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r?\n)/m);
        if (match) {
            this.$autoNewLine = match[1];
        } else {
            this.$autoNewLine = "\n";
        }
    };

    this.tokenRe = /^[\w\d]+/g;
    this.nonTokenRe = /^[^\w\d]+/g;

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

    this.$getNewLineCharacter = function() {
      switch (this.$newLineMode) {
          case "windows":
              return "\r\n";

          case "unix":
              return "\n";

          case "auto":
              return this.$autoNewLine;
      }
    },

    this.$autoNewLine = "\n";
    this.$newLineMode = "auto";
    this.setNewLineMode = function(newLineMode) {
        if (this.$newLineMode === newLineMode) return;

        this.$newLineMode = newLineMode;
    };

    this.getNewLineMode = function() {
        return this.$newLineMode;
    };

    this.$mode = null;
    this.setMode = function(mode) {
        if (this.$mode === mode) return;

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

    this.$computeWidth = function() {
        if (this.modified) {
            this.modified = false;

            var lines = this.lines;
            var longestLine = 0;
            var longestScreenLine = 0;
            var tabSize = this.getTabSize();

            for ( var i = 0; i < lines.length; i++) {
                var len = lines[i].length;
                longestLine = Math.max(longestLine, len);

                lines[i].replace("\t", function(m) {
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
        return this.lines[row] || "";
    };

    /**
     * Get a line as it is displayed on screen. Tabs are replaced by spaces.
     */
    this.getDisplayLine = function(row) {
        var tab = new Array(this.getTabSize()+1).join(" ");
        return this.lines[row].replace(/\t/g, tab);
    };

    this.getLines = function(firstRow, lastRow) {
        return this.lines.slice(firstRow, lastRow+1);
    };

    this.getLength = function() {
        return this.lines.length;
    };

    this.getTextRange = function(range) {
        if (range.start.row == range.end.row) {
            return this.lines[range.start.row].substring(range.start.column,
                                                         range.end.column);
        }
        else {
            var lines = [];
            lines.push(this.lines[range.start.row].substring(range.start.column));
            lines.push.apply(lines, this.getLines(range.start.row+1, range.end.row-1));
            lines.push(this.lines[range.end.row].substring(0, range.end.column));
            return lines.join(this.$getNewLineCharacter());
        }
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

    this.insert = function(position, text, fromUndo) {
        var end = this.$insert(position, text, fromUndo);
        this.fireChangeEvent(position.row, position.row == end.row ? position.row
                : undefined);
        return end;
    };

    /**
     * @param rows Array[Integer] sorted list of rows
     */
    this.multiRowInsert = function(rows, column, text) {
        var lines = this.lines;

        for (var i=rows.length-1; i>=0; i--) {
            var row = rows[i];
            if (row >= lines.length)
                continue;

            var diff = column - lines[row].length;
            if ( diff > 0) {
                var padded = lang.stringRepeat(" ", diff) + text;
                var offset = -diff;
            }
            else {
                padded = text;
                offset = 0;
            }

            var end = this.$insert({row: row, column: column+offset}, padded, false);
        }

        if (end) {
            this.fireChangeEvent(rows[0], rows[rows.length-1] + end.row - rows[0]);
            return {
                rows: end.row - rows[0],
                columns: end.column - column
            }
        }
        else {
            return {
                rows: 0,
                columns: 0
            }
        }
    };

    this.$insertLines = function(row, lines, fromUndo) {
        if (lines.length == 0)
            return;

        var args = [row, 0];
        args.push.apply(args, lines);
        this.lines.splice.apply(this.lines, args);

        if (!fromUndo && this.$undoManager) {
            var nl = this.$getNewLineCharacter();
            this.$deltas.push({
                action: "insertText",
                range: new Range(row, 0, row + lines.length, 0),
                text: lines.join(nl) + nl
            });
            this.$informUndoManager.schedule();
        }
    },

    this.$insert = function(position, text, fromUndo) {
        if (text.length == 0)
            return position;

        this.modified = true;
        if (this.lines.length <= 1) {
            this.$detectNewLine(text);
        }

        var newLines = this.$split(text);

        if (this.$isNewLine(text)) {
            var line = this.lines[position.row] || "";
            this.lines[position.row] = line.substring(0, position.column);
            this.lines.splice(position.row + 1, 0, line.substring(position.column));

            var end = {
                row : position.row + 1,
                column : 0
            };
        }
        else if (newLines.length == 1) {
            var line = this.lines[position.row] || "";
            this.lines[position.row] = line.substring(0, position.column) + text
                    + line.substring(position.column);

            var end = {
                row : position.row,
                column : position.column + text.length
            };
        }
        else {
            var line = this.lines[position.row] || "";
            var firstLine = line.substring(0, position.column) + newLines[0];
            var lastLine = newLines[newLines.length - 1] + line.substring(position.column);

            this.lines[position.row] = firstLine;
            this.$insertLines(position.row + 1, [lastLine], true);

            if (newLines.length > 2) {
                this.$insertLines(position.row + 1, newLines.slice(1, -1), true);
            }

            var end = {
                row : position.row + newLines.length - 1,
                column : newLines[newLines.length - 1].length
            };
        }

        if (!fromUndo && this.$undoManager) {
            this.$deltas.push({
                action: "insertText",
                range: Range.fromPoints(position, end),
                text: text
            });
            this.$informUndoManager.schedule();
        }

        return end;
    };

    this.$isNewLine = function(text) {
        return (text == "\r\n" || text == "\r" || text == "\n");
    };

    this.remove = function(range, fromUndo) {
        if (range.isEmpty())
            return range.start;

        this.$remove(range, fromUndo);

        this.fireChangeEvent(range.start.row, range.isMultiLine() ? undefined : range.start.row);

        return range.start;
    };

    this.multiRowRemove = function(rows, range) {
        if (range.start.row !== rows[0])
            throw new TypeError("range must start in the first row!");

        var height = range.end.row - rows[0];
        for (var i=rows.length-1; i>=0; i--) {
            var row = rows[i];
            if (row >= this.lines.length)
                continue;

            var end = this.$remove(new Range(row, range.start.column, row+height, range.end.column), false);
        }

        if (end) {
            if (height < 0)
                this.fireChangeEvent(rows[0]+height, undefined);
            else
                this.fireChangeEvent(rows[0], height == 0 ? rows[rows.length-1] : undefined);
        }
    };

    this.$remove = function(range, fromUndo) {
        if (range.isEmpty())
            return;

        if (!fromUndo && this.$undoManager) {
            var nl = this.$getNewLineCharacter();
            this.$deltas.push({
                action: "removeText",
                range: range.clone(),
                text: this.getTextRange(range)
            });
            this.$informUndoManager.schedule();
        }

        this.modified = true;

        var firstRow = range.start.row;
        var lastRow = range.end.row;

        var row = this.getLine(firstRow).substring(0, range.start.column)
                + this.getLine(lastRow).substring(range.end.column);

        if (row != "")
            this.lines.splice(firstRow, lastRow - firstRow + 1, row);
        else
            this.lines.splice(firstRow, lastRow - firstRow + 1, "");
        return range.start;
    };

    this.undoChanges = function(deltas) {
        this.selection.clearSelection();
        for (var i=deltas.length-1; i>=0; i--) {
            var delta = deltas[i];
            if (delta.action == "insertText") {
                this.remove(delta.range, true);
                this.selection.moveCursorToPosition(delta.range.start);
            } else {
                this.insert(delta.range.start, delta.text, true);
                this.selection.clearSelection();
            }
        }
    },

    this.redoChanges = function(deltas) {
        this.selection.clearSelection();
        for (var i=0; i<deltas.length; i++) {
            var delta = deltas[i];
            if (delta.action == "insertText") {
                this.insert(delta.range.start, delta.text, true);
                this.selection.setSelectionRange(delta.range);
            } else {
                this.remove(delta.range, true);
                this.selection.moveCursorToPosition(delta.range.start);
            }
        }
    },

    this.replace = function(range, text) {
        this.$remove(range);
        if (text) {
            var end = this.$insert(range.start, text);
        }
        else {
            end = range.start;
        }

        var lastRemoved = range.end.column == 0 ? range.end.column - 1
                : range.end.column;
        this.fireChangeEvent(range.start.row, lastRemoved == end.row ? lastRemoved
                : undefined);

        return end;
    };

    this.indentRows = function(startRow, endRow, indentString) {
        indentString = indentString.replace("\t", this.getTabString());
        for (var row=startRow; row<=endRow; row++) {
            this.$insert({row: row, column:0}, indentString);
        }
        this.fireChangeEvent(startRow, endRow);
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
            this.$remove(deleteRange);
        }
        this.fireChangeEvent(range.start.row, range.end.row);
        return range;
    }

    this.moveLinesUp = function(firstRow, lastRow) {
        if (firstRow <= 0) return 0;

        var removed = this.lines.slice(firstRow, lastRow + 1);
        this.$remove(new Range(firstRow-1, this.lines[firstRow-1].length, lastRow, this.lines[lastRow].length));
        this.$insertLines(firstRow - 1, removed);

        this.fireChangeEvent(firstRow - 1, lastRow);
        return -1;
    };

    this.moveLinesDown = function(firstRow, lastRow) {
        if (lastRow >= this.lines.length-1) return 0;

        var removed = this.lines.slice(firstRow, lastRow + 1);
        this.$remove(new Range(firstRow, 0, lastRow + 1, 0));
        this.$insertLines(firstRow+1, removed);

        this.fireChangeEvent(firstRow, lastRow + 1);
        return 1;
    };

    this.duplicateLines = function(firstRow, lastRow) {
        var firstRow = this.$clipRowToDocument(firstRow);
        var lastRow = this.$clipRowToDocument(lastRow);

        var lines = this.getLines(firstRow, lastRow);
        this.$insertLines(firstRow, lines);

        var addedRows = lastRow - firstRow + 1;
        this.fireChangeEvent(firstRow);

        return addedRows;
    };

    this.$clipRowToDocument = function(row) {
        return Math.max(0, Math.min(row, this.lines.length-1));
    };

}).call(Document.prototype);


(function() {
    this.$wrapLimit = 80;
    this.$useWrapMode = false;

    this.setUseWrapMode = function(useWrapMode) {
        this.$useWrapMode = useWrapMode;

        if (useWrapMode) {
            this.addEventListener("change", this.$computeWrapDataFn);
        } else {
            this.removeEventListener("change", this.$computeWrapDataFn);
        }

        this.$computeWrapDataFn({ data: { firstRow: 0 } });
        this._dispatchEvent("changeWrapMode");
    };

    this.getUseWrapMode = function() {
        return this.$useWrapMode;
    };

    this.setWrapLimit = function(wrapLimit) {
        this.$wrapLimit = wrapLimit;
    };

    this.getWrapLimit = function() {
        return this.$wrapLimit;
    };

    this.$computeWrapSplits = function(textLine, wrapLimit, tabSize) {
        if (textLine.length == 0) {
            return [];
        }

        var tabLine = textLine.split("\t");
        var wrapSplits = [];

        var screenColumn = 0;
        var documentColumn = 0;
        var lastSplitColumn = 0;

        var reSpaces = /^\s*$/;

        // Remove all tablines from the end of the tabLine array that are empty
        // or contain only space. This is necessary to prevent splits at the
        // line end if only tabs/spaces are following.
        // E.g: "foo bar\t    " -> "foo bar".
        var toRemove = tabLine.length - 1;
        while (toRemove != -1 && reSpaces.test(tabLine[toRemove])) {
            toRemove --;
        }
        tabLine.splice(toRemove + 1);

        // Remove spaces from the last tabLine to prevent splits only for
        // whitespaces as well.
        // E.g: "foo \tbar    " -> "foo \tbar"
        tabLine[tabLine.length - 1] = tabLine[tabLine.length - 1].trimRight();

        var value;
        var addedNewSplit;

        function addSplit(incrDocumentColumn) {
            var valueLenLeadingWhitespaces;
            value = value.substring(incrDocumentColumn);
            valueLenLeadingWhitespaces = value.length;
            value = value.trimLeft();

            incrDocumentColumn += valueLenLeadingWhitespaces - value.length;

            // If there was a split saved before, then add it to the resulting
            // array. It's not possible to store the split column here directly,
            // as there migth be tabs/spaces following the current column that
            // will cause the split position to get incremented.
            if (lastSplitColumn) {
                wrapSplits.push(lastSplitColumn);
            }

            lastSplitColumn = documentColumn += incrDocumentColumn;
            screenColumn = 0;

            addedNewSplit = true;
        }

        for (var i = 0; i < tabLine.length; i++) {
            value = tabLine[i];
            while (screenColumn + value.length >= wrapLimit) {
                // Find the last space that we use to split the line.
                var lastSpaceIdx =
                        value.substring(0, wrapLimit - screenColumn + 1).
                            lastIndexOf(" ");

                // There is no space to break the line.
                if (lastSpaceIdx == -1) {
                    // True if this is the first tabLine we face
                    // during this split. This means, there is no
                    // space or tab to make the split -> force split.
                    if (screenColumn == 0) {
                        addSplit(wrapLimit);
                    }
                    // True if we've added some content in this split line
                    // already. Add a split after this already existing content
                    // in the split.
                    else {
                        addSplit(0);
                    }
                }
                // There is at least one space to wrap the line at.
                else {
                    addSplit(lastSpaceIdx);
                }
            }

            // Add new content to the current split.
            if (!addedNewSplit) {
                screenColumn += value.length + tabSize;
                documentColumn += value.length + 1;
            }
            // True if at least one new split was added during the while loop.
            else {
                var lenBefore = value.length;
                value = value.trimLeft();
                // True if value has some content. This content goes directly
                // after the last split.
                if (value.length != 0) {
                    documentColumn = lastSplitColumn += lenBefore - value.length;
                    screenColumn += value.length;
                    documentColumn += 1; // The tab after this for-loop.
                }
                // There is no value left after the split. This means, following
                // spaces and tabs have to be ignored.
                else {
                    // Tab for this for-loop.
                    documentColumn = lastSplitColumn += 1;

                    // While the following tabLines are empty/only spaces, set
                    // the latest split position behind them.
                    while ((i + 1) < tabLine.length - 1
                            && reSpaces.test(tabLine[i + 1]))
                    {
                        i++;
                        documentColumn = lastSplitColumn += tabLine[i].length + 1;
                    }

                    // The tabLine[i + 1] is not empty. However, the trailing
                    // spaces have still to be removed.
                    value = tabLine[i + 1];
                    lenBefore = value.length;
                    value = value.trimLeft();
                    documentColumn = lastSplitColumn += lenBefore - value.length;
                    tabLine[i + 1] = value; // Store the trimed value.
                }
                addedNewSplit = false;
            }
        }
        if (lastSplitColumn) {
            wrapSplits.push(lastSplitColumn);
        }

        return wrapSplits;
    };

    this.$computeWrapData = function(e) {
        var lines = this.lines;
        var tabSize = this.getTabSize();
        var wrapData = this.$wrapData;
        var wrapLimit = this.$wrapLimit;

        // Remove lines that are no longer there.
        wrapData.splice(lines.length, wrapData.length - lines.length);

        if (!e.data.lastRow) {
            e.data.lastRow = lines.length - 1;
        }

        for (var row = e.data.firstRow; row <= e.data.lastRow; row++) {
            wrapData[row] =
                this.$computeWrapSplits(lines[row], wrapLimit, tabSize);
        }
    };

    this.getRowHeight = function(config, row) {
        var rows;
        if (!this.$useWrapMode) {
            rows = 1;
        } else {
            rows = this.$wrapData[row].length + 1;
        }

        return rows * config.lineHeight;
    };

    this.getRowSplitData = function(row) {
        if (!this.$useWrapMode) {
            return undefined;
        } else {
            return this.$wrapData[row];
        }
    };

    this.screenToDocumentColumn = function(row, screenColumn) {
        var tabSize = this.getTabSize();

        var docColumn = 0;
        var remaining = screenColumn;

        var line = this.getLine(row).split("\t");
        for (var i=0; i<line.length; i++) {
            var len = line[i].length;
            if (remaining >= len + tabSize) {
                remaining -= (len + tabSize);
                docColumn += (len + 1);
            }
            else if (remaining > len){
                docColumn += len;
                break;
            }
            else {
                docColumn += remaining;
                break;
            }
        }
        return docColumn;
    };

    this.screenToDocumentRow = function(row) {
        if (!this.$useWrapMode) {
            return row;
        }

        var wrapData = this.$wrapData, linesCount = this.lines.length;
        var docRow = 0;
        while (docRow < linesCount && row >= wrapData[docRow].length + 1) {
            row -= wrapData[docRow].length + 1;
            docRow ++;
        }

        return docRow;
    };

    this.screenToDocumentPosition = function(row, column) {
        if (!this.$useWrapMode) {
            return {
                row: row,
                column: this.screenToDocumentColumn(row, column)
            }
        }

        var wrapData = this.$wrapData, linesCount = this.lines.length;

        var docRow = 0;
        while (docRow < linesCount && row >= wrapData[docRow].length + 1) {
            row -= wrapData[docRow].length + 1;
            docRow ++;
        }
        var docColumn = column +
            (docRow < linesCount ? wrapData[docRow][row - 1] || 0 : 0);

        if (this.lines[docRow]) {
             docColumn = Math.min(docColumn, this.lines[docRow].length);
        }

        return {
            row: docRow,
            column: docColumn
        };
    };

    this.documentToScreenColumn = function(row, docColumn) {
        var tabSize = this.getTabSize();

        var screenColumn = 0;
        var remaining = docColumn;

        var line = this.getLine(row).split("\t");
        for (var i=0; i<line.length; i++) {
            var len = line[i].length;
            if (remaining > len) {
                remaining -= (len + 1);
                screenColumn += len + tabSize;
            }
            else {
                screenColumn += remaining;
                break;
            }
        }

        return screenColumn;
    };

    this.documentToScreenRow = function(row) {
        if (!this.$useWrapMode) {
            return row;
        }

        var wrapData = this.$wrapData;
        var screenRow = 0;

        // Handle special case where the row is outside of the range of lines.
        if (row > wrapData.length - 1) {
            for (row = 0; row < wrapData.length; row ++) {
                screenRow += wrapData[row].length + 1;
            }
            return screenRow;
        }

        for (var i = 0; i < row; i++) {
            screenRow += wrapData[i].length + 1;
        }

        return screenRow;
    }

    this.documentToScreenPosition = function(row, column) {
        if (!this.$useWrapMode) {
            return {
                row: row,
                column: this.documentToScreenColumn(row, column)
            }
        }
        var screenRow = this.documentToScreenRow(row);
        var screenColumn = column;
        var wrapRowData = this.$wrapData[row];
        for (var split = 0; wrapRowData && split < wrapRowData.length; split++) {
            if (column > wrapRowData[split]) {
                screenColumn = column - wrapRowData[split];
                screenRow ++;
            } else {
                break;
            }
        }

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

}).call(Document.prototype)

exports.Document = Document;
});
