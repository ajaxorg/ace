ace.provide("ace.Document");

ace.Document = function(text, mode) {
    this.$initEvents();

    this.lines = [];
    this.modified = true;
    this.selection = new ace.Selection(this);

    this.listeners = [];
    if (mode) {
        this.setMode(mode);
    }

    if (ace.isArray(text)) {
        this.$insertLines(0, text);
    } else {
        this.$insert({row: 0, column: 0}, text);
    }
};

(function() {

    ace.implement(this, ace.MEventEmitter);

    this.$undoManager = null;

    this.$split = function(text) {
        return text.split(/\r\n|\r|\n/);
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
            undoManager.setDocument(this);
            var self = this;
            this.$informUndoManager = ace.deferredCall(function() {
                undoManager.notify(self.$deltas);
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
            return new Array(this.getTabSize()+1).join(" ");
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
        if (this.$tabSize === tabSize) return;

        this.$tabSize = tabSize;
        this.$dispatchEvent("changeTabSize");
    };

    this.getTabSize = function() {
        return this.$tabSize;
    };

    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r?\n)/m);
        if (match) {
            this.$autoNewLine = match[1];
        } else {
            this.$autoNewLine = "\n";
        }
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
            this.$mode = new ace.mode.Text();
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
        if (this.modified) {
            this.modified = false;

            var lines = this.lines;
            var longestLine = 0;
            for ( var i = 0; i < lines.length; i++) {
                longestLine = Math.max(longestLine, lines[i].length);
            }
            this.width = longestLine;
        }
        return this.width;
    };

    this.getLine = function(row) {
        return this.lines[row] || "";
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
                var char = line.charAt(column);
                if (char == openBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: row, column: column};
                    }
                }
                else if (char == bracket) {
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
                var char = line.charAt(column);
                if (char == closingBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: row, column: column};
                    }
                }
                else if (char == bracket) {
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

    this.$insertLines = function(row, lines) {
        var args = [row, 0];
        args.push.apply(args, lines);
        this.lines.splice.apply(this.lines, args);

        if (this.$undoManager) {
            var nl = this.$getNewLineCharacter();
            this.$deltas.push({
                type: "insert",
                range: new ace.Range(row, 0, row + lines.length, 0),
                text: lines.join(nl) + nl
            });
            this.$informUndoManager.schedule();
        }
    },

    this.$insert = function(position, text, fromUndo) {
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
            this.$insertLines(position.row + 1, [lastLine]);

            if (newLines.length > 2) {
                this.$insertLines(position.row + 1, newLines.slice(1, -1));
            }

            var end = {
                row : position.row + newLines.length - 1,
                column : newLines[newLines.length - 1].length
            };
        }

        if (!fromUndo && this.$undoManager) {
            var nl = this.$getNewLineCharacter();
            this.$deltas.push({
                type: "insert",
                range: ace.Range.fromPoints(position, end),
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
        this.$remove(range, fromUndo);

        this.fireChangeEvent(range.start.row,
                             !range.isMultiLine() ? range.start.row
                                     : undefined);

        return range.start;
    };

    this.$remove = function(range, fromUndo) {
        if (!fromUndo && this.$undoManager) {
            var nl = this.$getNewLineCharacter();
            this.$deltas.push({
                type: "remove",
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
        for (var i=0; i<deltas.length; i++) {
            var delta = deltas[i];
            if (delta.type == "insert") {
                this.remove(delta.range, true);
                this.selection.clearSelection();
                this.selection.moveCursorToPosition(delta.range.start);
            } else {
                this.insert(delta.range.start, delta.text, true);
                this.selection.setSelectionRange(delta.range);
            }
        }
    },

    this.redoChanges = function(deltas) {
        this.selection.clearSelection();
        for (var i=0; i<deltas.length; i++) {
            var delta = deltas[i];
            if (delta.type == "insert") {
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
      for (var row=range.start.row; row<= range.end.row; row++) {
          this.$insert({row: row, column:0}, indentString);
      }
      this.fireChangeEvent(range.start.row, range.end.row);
      return indentString.length;
    };

    this.outdentRows = function(range, indentString) {
        outdentLength = indentString.length;

        for (var i=range.start.row; i<= range.end.row; i++) {
            if (this.getLine(i).substr(0, outdentLength) !== indentString) {
                return 0;
            }
        }

        var deleteRange = new ace.Range(0, 0, 0, outdentLength);

        for (var i=range.start.row; i<= range.end.row; i++)
        {
            deleteRange.start.row = i;
            deleteRange.end.row = i;
            this.$remove(deleteRange);
        }

        this.fireChangeEvent(range.start.row, range.end.row);
        return -outdentLength;
    };

    this.moveLinesUp = function(firstRow, lastRow) {
        if (firstRow <= 0) return 0;

        var removed = this.lines.splice(firstRow, lastRow-firstRow+1);
        this.$insertLines(firstRow-1, removed);

        this.fireChangeEvent(firstRow-1, lastRow);
        return -1;
    };

    this.moveLinesDown = function(firstRow, lastRow) {
        if (lastRow >= this.lines.length-1) return 0;

        var removed = this.lines.splice(firstRow, lastRow-firstRow+1);
        this.$insertLines(firstRow+1, removed);

        this.fireChangeEvent(firstRow, lastRow+1);
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

}).call(ace.Document.prototype);
