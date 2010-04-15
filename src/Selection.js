ace.provide("ace.Selection");

ace.Selection = function(doc) {
    this.doc = doc;

    this.$initEvents();

    this.clearSelection();
    this.cursor = {
        row: 0,
        column: 0
    };
};
ace.mixin(ace.Selection.prototype, ace.MEventEmitter);

ace.Selection.prototype.updateCursor = function() {
    this.$dispatchEvent("changeCursor", { data: this.getCursor() });
};

ace.Selection.prototype.updateSelection = function() {
    this.$dispatchEvent("changeSelection", {});
};

ace.Selection.prototype.isEmpty = function() {
    return (this.selectionLead == null);
};

ace.Selection.prototype.isMultiLine = function() {
    if (this.isEmpty()) {
        return false;
    }

    var range = this.getRange();
    return (range.start.row !== range.end.row);
};

ace.Selection.prototype.getCursor = function() {
    return this.cursor;
};

ace.Selection.prototype.setSelectionAnchor = function(row, column) {
    this.clearSelection();

    this.selectionAnchor = this._clipPositionToDocument(row, column);
    this.selectionLead = null;
};

ace.Selection.prototype.getSelectionAnchor = function() {
    if (this.selectionAnchor) {
        return {
            row: this.selectionAnchor.row,
            column: this.selectionAnchor.column
        };
    } else {
        return {
            row: this.cursor.row,
            column: this.cursor.column
        };
    }
};

ace.Selection.prototype.getSelectionLead = function() {
    if (this.selectionLead) {
        return {
            row: this.selectionLead.row,
            column: this.selectionLead.column
        };
    } else {
        return {
            row: this.cursor.row,
            column: this.cursor.column
        };
    }
};

ace.Selection.prototype.shiftSelection = function(columns) {
    if (this.isEmpty()) {
        this.moveCursorTo(this.cursor.row, this.cursor.column + columns);
        return;
    };

    var anchor = this.getSelectionAnchor();
    var lead = this.getSelectionLead();

    this.setSelectionAnchor(anchor.row, anchor.column + columns);
    this._moveSelection(function() {
        this.moveCursorTo(lead.row, lead.column + columns);
    });
};

ace.Selection.prototype.getRange = function() {
    var anchor = this.selectionAnchor || this.cursor;
    var lead = this.selectionLead || this.cursor;

    if (anchor.row > lead.row
            || (anchor.row == lead.row && anchor.column > lead.column)) {
        return {
            start : lead,
            end : anchor
        };
    }
    else {
        return {
            start : anchor,
            end : lead
        };
    }
};

ace.Selection.prototype.clearSelection = function() {
    this.selectionLead = null;
    this.selectionAnchor = null;
    this.updateSelection();
};


ace.Selection.prototype.selectAll = function() {
    var lastRow = this.doc.getLength() - 1;
    this.setSelectionAnchor(lastRow, this.doc.getLine(lastRow).length);

    this._moveSelection(function() {
        this.moveCursorTo(0, 0);
    });
};

ace.Selection.prototype._moveSelection = function(mover) {
    if (!this.selectionAnchor) {
        this.selectionAnchor = {
            row : this.cursor.row,
            column : this.cursor.column
        };
    }

    mover.call(this);

    this.selectionLead = {
        row : this.cursor.row,
        column : this.cursor.column
    };

    this.updateSelection();
};

ace.Selection.prototype.selectUp = function() {
    this._moveSelection(this.moveCursorUp);
};

ace.Selection.prototype.selectDown = function() {
    this._moveSelection(this.moveCursorDown);
};

ace.Selection.prototype.selectRight = function() {
    this._moveSelection(this.moveCursorRight);
};

ace.Selection.prototype.selectLeft = function() {
    this._moveSelection(this.moveCursorLeft);
};

ace.Selection.prototype.selectLineStart = function() {
    this._moveSelection(this.moveCursorLineStart);
};

ace.Selection.prototype.selectLineEnd = function() {
    this._moveSelection(this.moveCursorLineEnd);
};

ace.Selection.prototype.selectPageDown = function() {
    var row = this.getPageDownRow() + Math.floor(this.getVisibleRowCount() / 2);

    this.scrollPageDown();

    this._moveSelection(function() {
        this.moveCursorTo(row, this.cursor.column);
    });
};

ace.Selection.prototype.selectPageUp = function() {
    var visibleRows = this.getLastVisibleRow() - this.getFirstVisibleRow();
    var row = this.getPageUpRow() + Math.round(visibleRows / 2);

    this.scrollPageUp();

    this._moveSelection(function() {
        this.moveCursorTo(row, this.cursor.column);
    });
};

ace.Selection.prototype.selectFileEnd = function() {
    this._moveSelection(this.moveCursorFileEnd);
};

ace.Selection.prototype.selectFileStart = function() {
    this._moveSelection(this.moveCursorFileStart);
};

ace.Selection.prototype.tokenRe = /^[\w\d]+/g;
ace.Selection.prototype.nonTokenRe = /^[^\w\d]+/g;

ace.Selection.prototype.selectWordRight = function() {
    this._moveSelection(this.moveCursorWordRight);
};

ace.Selection.prototype.selectWordLeft = function() {
    this._moveSelection(this.moveCursorWordLeft);
};

ace.Selection.prototype.selectLine = function() {
    this.setSelectionAnchor(this.cursor.row, 0);
    this._moveSelection(function() {
        this.moveCursorTo(this.cursor.row + 1, 0);
    });
};

ace.Selection.prototype.moveCursorUp = function() {
    this.moveCursorBy(-1, 0);
};

ace.Selection.prototype.moveCursorDown = function() {
    this.moveCursorBy(1, 0);
};

ace.Selection.prototype.moveCursorLeft = function() {
    if (this.cursor.column == 0) {
        if (this.cursor.row > 0) {
            this.moveCursorTo(this.cursor.row - 1, this.doc
                    .getLine(this.cursor.row - 1).length);
        }
    }
    else {
        this.moveCursorBy(0, -1);
    }
};

ace.Selection.prototype.moveCursorRight = function() {
    if (this.cursor.column == this.doc.getLine(this.cursor.row).length) {
        if (this.cursor.row < this.doc.getLength() - 1) {
            this.moveCursorTo(this.cursor.row + 1, 0);
        }
    }
    else {
        this.moveCursorBy(0, 1);
    }
};

ace.Selection.prototype.moveCursorLineStart = function() {
    this.moveCursorTo(this.cursor.row, 0);
};

ace.Selection.prototype.moveCursorLineEnd = function() {
    this.moveCursorTo(this.cursor.row,
                      this.doc.getLine(this.cursor.row).length);
};

ace.Selection.prototype.moveCursorFileEnd = function() {
    var row = this.doc.getLength() - 1;
    var column = this.doc.getLine(row).length;
    this.moveCursorTo(row, column);
};

ace.Selection.prototype.moveCursorFileStart = function() {
    this.moveCursorTo(0, 0);
};

ace.Selection.prototype.moveCursorWordRight = function() {
    var row = this.cursor.row;
    var column = this.cursor.column;
    var line = this.doc.getLine(row);
    var rightOfCursor = line.substring(column);

    var match;
    this.nonTokenRe.lastIndex = 0;
    this.tokenRe.lastIndex = 0;

    if (column == line.length) {
        this.moveCursorRight();
        return;
    }
    else if (match = this.nonTokenRe.exec(rightOfCursor)) {
        column += this.nonTokenRe.lastIndex;
        this.nonTokenRe.lastIndex = 0;
    }
    else if (match = this.tokenRe.exec(rightOfCursor)) {
        column += this.tokenRe.lastIndex;
        this.tokenRe.lastIndex = 0;
    }

    this.moveCursorTo(row, column);
};

ace.Selection.prototype.moveCursorWordLeft = function() {
    var row = this.cursor.row;
    var column = this.cursor.column;
    var line = this.doc.getLine(row);
    var leftOfCursor = ace.stringReverse(line.substring(0, column));

    var match;
    this.nonTokenRe.lastIndex = 0;
    this.tokenRe.lastIndex = 0;

    if (column == 0) {
        this.moveCursorLeft();
        return;
    }
    else if (match = this.nonTokenRe.exec(leftOfCursor)) {
        column -= this.nonTokenRe.lastIndex;
        this.nonTokenRe.lastIndex = 0;
    }
    else if (match = this.tokenRe.exec(leftOfCursor)) {
        column -= this.tokenRe.lastIndex;
        this.tokenRe.lastIndex = 0;
    }

    this.moveCursorTo(row, column);
};

ace.Selection.prototype.moveCursorBy = function(rows, chars) {
    this.moveCursorTo(this.cursor.row + rows, this.cursor.column + chars);
};


ace.Selection.prototype.moveCursorToPosition = function(position) {
    this.moveCursorTo(position.row, position.column);
};

ace.Selection.prototype.moveCursorTo = function(row, column) {
    this.cursor = this._clipPositionToDocument(row, column);
    this.updateCursor();
};

ace.Selection.prototype.moveCursorUp = function() {
    this.moveCursorBy(-1, 0);
};

ace.Selection.prototype._clipPositionToDocument = function(row, column) {
    var pos = {};

    if (row >= this.doc.getLength()) {
        pos.row = this.doc.getLength() - 1;
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

ace.Selection.prototype._clone = function(pos) {
    return {
        row: pos.row,
        column: pos.column
    };
};