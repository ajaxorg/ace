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

var oop = require("ace/lib/oop").oop;
var lang = require("ace/lib/lang").lang;
var MEventEmitter = require("ace/event_emitter").MEventEmitter;
var Selection = require("ace/selection");
var TextMode = require("ace/mode/text");
var Range = require("ace/range");

var Document = function(text, mode) {
    this.modified = true;
    this.lines = [];
    this.selection = new Selection(this);
    this.$breakpoints = [];

    this.listeners = [];
    if (mode) {
        this.setMode(mode);
    }
    
    if (lang.isArray(text)) {
        this.$insertLines(0, text);
    } else {
        this.$insert({row: 0, column: 0}, text);
    }
};


(function() {

    oop.implement(this, MEventEmitter);

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
        this.$dispatchEvent("change", { data: data});
    };

    this.setUndoManager = function(undoManager) {
        this.$undoManager = undoManager;
        this.$deltas = [];

        if (this.$informUndoManager) {
            this.$informUndoManager.cancel();
        }

        if (undoManager) {
            //undoManager.setDocument(this);
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
        this.$dispatchEvent("changeTabSize");
    };

    this.getTabSize = function() {
        return this.$tabSize;
    };

    this.getBreakpoints = function() {
        return this.$breakpoints;
    };

    this.setBreakpoints = function(rows) {
        this.$breakpoints = [];
        for (var i=0; i<rows.length; i++) {
            this.$breakpoints[rows[i]] = true;
        }
        this.$dispatchEvent("changeBreakpoint", {});
    };

    this.clearBreakpoints = function() {
        this.$breakpoints = [];
        this.$dispatchEvent("changeBreakpoint", {});
    };

    this.setBreakpoint = function(row) {
        this.$breakpoints[row] = true;
        this.$dispatchEvent("changeBreakpoint", {});
    };

    this.clearBreakpoint = function(row) {
        delete this.$breakpoints[row];
        this.$dispatchEvent("changeBreakpoint", {});
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
        this.$dispatchEvent("changeMode");
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
        this.$dispatchEvent("changeScrollTop");
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
        return this.screenWith;
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
            this.screenWith = longestScreenLine;
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

        this.lines.splice(firstRow, lastRow - firstRow + 1, row);


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

    this.indentRows = function(range, indentString) {
        indentString.replace("\t", this.getTabString());
        for (var row=range.start.row; row<=range.end.row; row++) {
            this.$insert({row: row, column:0}, indentString);
        }
        this.fireChangeEvent(range.start.row, range.end.row);
        return indentString.length;
    };

    this.outdentRows = function (range) {
        var deleteRange = new Range(0, 0, 0, 0),
            size        = this.getTabSize();
        
        for (var i = range.start.row; i <= range.end.row; ++i) {
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
        this.$remove(new Range(firstRow, 0, lastRow + 1, 0));
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

}).call(Document.prototype);

return Document;
});
