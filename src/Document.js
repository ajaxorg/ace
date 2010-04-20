ace.provide("ace.Document");

ace.Document = function(text, mode) {
    this.$initEvents();

    this.lines = this._split(text);
    this.modified = true;
    this.selection = new ace.Selection(this);

    this.listeners = [];
    if (mode) {
        this.setMode(mode);
    }
};

ace.mixin(ace.Document.prototype, ace.MEventEmitter);

ace.Document.prototype._split = function(text) {
    return text.split(/\r\n|\r|\n/);
};

ace.Document.prototype.toString = function() {
    return this.lines.join("\n");
};

ace.Document.prototype.getSelection = function() {
    return this.selection;
};

ace.Document.prototype.fireChangeEvent = function(firstRow, lastRow) {
    var data = {
        firstRow: firstRow,
        lastRow: lastRow
    };
    this.$dispatchEvent("change", { data: data});
};

ace.Document.prototype.getTabString = function() {
    if (this.getUseSoftTabs()) {
        return new Array(this.getTabSize()+1).join(" ");
    }
    return "\t";
};

ace.Document.prototype._useSoftTabs = true;
ace.Document.prototype.setUseSoftTabs = function(useSoftTabs) {
    if (this._useSoftTabs === useSoftTabs) return;

    this._useSoftTabs = useSoftTabs;
};

ace.Document.prototype.getUseSoftTabs = function() {
    return this._useSoftTabs;
};

ace.Document.prototype._tabSize = 4;
ace.Document.prototype.setTabSize = function(tabSize) {
    if (this._tabSize === tabSize) return;

    this._tabSize = tabSize;
    this.$dispatchEvent("changeTabSize");
};

ace.Document.prototype.getTabSize = function() {
    return this._tabSize;
};

ace.Document.prototype._mode = null;
ace.Document.prototype.setMode = function(mode) {
    if (this._mode === mode) return;

    this._mode = mode;
    this.$dispatchEvent("changeMode");
};

ace.Document.prototype.getMode = function() {
    if (!this._mode) {
        this._mode = new ace.mode.Text();
    }
    return this._mode;
};

ace.Document.prototype.getWidth = function() {
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

ace.Document.prototype.getLine = function(row) {
    return this.lines[row] || "";
};

ace.Document.prototype.getLength = function() {
    return this.lines.length;
};

ace.Document.prototype.getTextRange = function(range) {
    if (range.start.row == range.end.row) {
        return this.lines[range.start.row].substring(range.start.column,
                                                     range.end.column);
    }
    else {
        var lines = [];
        lines.push(this.lines[range.start.row].substring(range.start.column));
        lines.push.apply(lines, this.getLines(range.start.row+1, range.end.row-1));
        lines.push(this.lines[range.end.row].substring(0, range.end.column));
        return lines.join("\n");
    }
};

ace.Document.prototype.getLines = function(firstRow, lastRow) {
    return this.lines.slice(firstRow, lastRow+1);
};

ace.Document.prototype.findMatchingBracket = function(position) {
    if (position.column == 0) return null;

    var charBeforeCursor = this.getLine(position.row).charAt(position.column-1);
    if (charBeforeCursor == "") return null;

    var match = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
    if (!match) {
        return null;
    }

    if (match[1]) {
        return this._findClosingBracket(match[1], position);
    } else {
        return this._findOpeningBracket(match[2], position);
    }
};

ace.Document.prototype._brackets = {
    ")": "(",
    "(": ")",
    "]": "[",
    "[": "]",
    "{": "}",
    "}": "{"
};

ace.Document.prototype._findOpeningBracket = function(bracket, position) {
    var openBracket = this._brackets[bracket];

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

ace.Document.prototype._findClosingBracket = function(bracket, position) {
    var closingBracket = this._brackets[bracket];

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

ace.Document.prototype.insert = function(position, text) {
    var end = this._insert(position, text);
    this.fireChangeEvent(position.row, position.row == end.row ? position.row
            : undefined);
    return end;
};

ace.Document.prototype._insertLines = function(row, lines) {
    var args = [row, 0];
    args.push.apply(args, lines);
    this.lines.splice.apply(this.lines, args);
},

ace.Document.prototype._insert = function(position, text) {
    this.modified = true;

    var newLines = this._split(text);

    if (this._isNewLine(text)) {
        var line = this.lines[position.row] || "";
        this.lines[position.row] = line.substring(0, position.column);
        this.lines.splice(position.row + 1, 0, line.substring(position.column));

        return {
            row : position.row + 1,
            column : 0
        };
    }
    else if (newLines.length == 1) {
        var line = this.lines[position.row] || "";
        this.lines[position.row] = line.substring(0, position.column) + text
                + line.substring(position.column);

        return {
            row : position.row,
            column : position.column + text.length
        };
    }
    else {
        var line = this.lines[position.row] || "";

        this.lines[position.row] = line.substring(0, position.column)
                + newLines[0];
        this.lines[position.row + 1] = newLines[newLines.length - 1]
                + line.substring(position.column);

        if (newLines.length > 2) {
            this._insertLines(position.row + 1, newLines.slice(1, -1));
        }

        return {
            row : position.row + newLines.length - 1,
            column : newLines[newLines.length - 1].length
        };
    }
};

ace.Document.prototype._isNewLine = function(text) {
    return (text == "\r\n" || text == "\r" || text == "\n");
};

ace.Document.prototype.remove = function(range) {
    this._remove(range);

    this.fireChangeEvent(range.start.row,
                         range.end.row == range.start.row ? range.start.row
                                 : undefined);
    return range.start;
};

ace.Document.prototype._remove = function(range) {
    this.modified = true;

    var firstRow = range.start.row;
    var lastRow = range.end.row;

    var row = this.lines[firstRow].substring(0, range.start.column)
            + this.lines[lastRow].substring(range.end.column);

    this.lines.splice(firstRow, lastRow - firstRow + 1, row);

    return range.start;
};

ace.Document.prototype.replace = function(range, text) {
    this._remove(range);
    if (text) {
        var end = this._insert(range.start, text);
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

ace.Document.prototype.indentRows = function(range, indentString) {
  for (var i=range.start.row; i<= range.end.row; i++) {
      this.lines[i] = indentString + this.getLine(i);
  }
  this.fireChangeEvent(range.start.row, range.end.row);
  return indentString.length;
};

ace.Document.prototype.outdentRows = function(range, indentString) {
    outdentLength = indentString.length;

    for (var i=range.start.row; i<= range.end.row; i++) {
        if (this.getLine(i).substr(0, outdentLength) !== indentString) {
            return 0;
        }
    }

    for (var i=range.start.row; i<= range.end.row; i++) {
        this.lines[i] = this.getLine(i).substring(outdentLength);
    }

    this.fireChangeEvent(range.start.row, range.end.row);
    return -outdentLength;
};

ace.Document.prototype.moveLinesUp = function(firstRow, lastRow) {
    if (firstRow <= 0) return 0;

    var removed = this.lines.splice(firstRow, lastRow-firstRow+1);
    this._insertLines(firstRow-1, removed);

    this.fireChangeEvent(firstRow-1, lastRow);
    return -1;
};

ace.Document.prototype.moveLinesDown = function(firstRow, lastRow) {
    if (lastRow >= this.lines.length-1) return 0;

    var removed = this.lines.splice(firstRow, lastRow-firstRow+1);
    this._insertLines(firstRow+1, removed);

    this.fireChangeEvent(firstRow, lastRow+1);
    return 1;
};

ace.Document.prototype.duplicateLines = function(firstRow, lastRow) {
    var firstRow = this._clipRowToDocument(firstRow);
    var lastRow = this._clipRowToDocument(lastRow);

    var lines = this.getLines(firstRow, lastRow);
    this._insertLines(firstRow, lines);

    var addedRows = lastRow - firstRow + 1;
    this.fireChangeEvent(firstRow, lastRow+addedRows);

    return addedRows;
};

ace.Document.prototype._clipRowToDocument = function(row) {
    return Math.max(0, Math.min(row, this.lines.length-1));
};

