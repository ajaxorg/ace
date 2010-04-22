ace.provide("ace.Selection");

ace.Selection = function(doc) {
    this.doc = doc;

    this.$initEvents();

    this.clearSelection();
    this.selectionLead = {
        row: 0,
        column: 0
    };
};

(function() {

    ace.mixin(ace.Selection.prototype, ace.MEventEmitter);

    this.updateCursor = function() {
        this.$dispatchEvent("changeCursor", { data: this.getCursor() });
    };

    this.updateSelection = function() {
        this.$dispatchEvent("changeSelection", {});
    };

    this.isEmpty = function() {
        return (this.selectionAnchor == null);
    };

    this.isMultiLine = function() {
        if (this.isEmpty()) {
            return false;
        }

        var range = this.getRange();
        return (range.start.row !== range.end.row);
    };

    this.getCursor = function() {
        return this.selectionLead;
    };

    this.setSelectionAnchor = function(row, column) {
        this.clearSelection();

        this.selectionAnchor = this._clipPositionToDocument(row, column);
    };

    this.getSelectionAnchor = function() {
        if (this.selectionAnchor) {
            return this._clone(this.selectionAnchor);
        } else {
            return this._clone(this.selectionLead);
        }
    };

    this.getSelectionLead = function() {
        return this._clone(this.selectionLead);
    };

    this.shiftSelection = function(columns) {
        if (this.isEmpty()) {
            this.moveCursorTo(this.selectionLead.row, this.selectionLead.column + columns);
            return;
        };

        var anchor = this.getSelectionAnchor();
        var lead = this.getSelectionLead();

        this.setSelectionAnchor(anchor.row, anchor.column + columns);
        this._moveSelection(function() {
            this.moveCursorTo(lead.row, lead.column + columns);
        });
    };

    this.getRange = function() {
        var anchor = this.selectionAnchor || this.selectionLead;
        var lead = this.selectionLead;

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

    this.clearSelection = function() {
        this.selectionAnchor = null;
        this.updateSelection();
    };


    this.selectAll = function() {
        var lastRow = this.doc.getLength() - 1;
        this.setSelectionAnchor(lastRow, this.doc.getLine(lastRow).length);

        this._moveSelection(function() {
            this.moveCursorTo(0, 0);
        });
    };

    this._moveSelection = function(mover) {
        if (!this.selectionAnchor) {
            this.selectionAnchor = this._clone(this.selectionLead);
        }

        mover.call(this);
        this.updateSelection();
    };

    this.selectTo = function(row, column) {
        this._moveSelection(function() {
            this.moveCursorTo(row, column);
        });
    };

    this.selectToPosition = function(pos) {
        this._moveSelection(function() {
            this.moveCursorToPosition(pos);
        });
    };

    this.selectUp = function() {
        this._moveSelection(this.moveCursorUp);
    };

    this.selectDown = function() {
        this._moveSelection(this.moveCursorDown);
    };

    this.selectRight = function() {
        this._moveSelection(this.moveCursorRight);
    };

    this.selectLeft = function() {
        this._moveSelection(this.moveCursorLeft);
    };

    this.selectLineStart = function() {
        this._moveSelection(this.moveCursorLineStart);
    };

    this.selectLineEnd = function() {
        this._moveSelection(this.moveCursorLineEnd);
    };

    this.selectPageDown = function() {
        var row = this.getPageDownRow() + Math.floor(this.getVisibleRowCount() / 2);

        this.scrollPageDown();

        this._moveSelection(function() {
            this.moveCursorTo(row, this.selectionLead.column);
        });
    };

    this.selectPageUp = function() {
        var visibleRows = this.getLastVisibleRow() - this.getFirstVisibleRow();
        var row = this.getPageUpRow() + Math.round(visibleRows / 2);

        this.scrollPageUp();

        this._moveSelection(function() {
            this.moveCursorTo(row, this.selectionLead.column);
        });
    };

    this.selectFileEnd = function() {
        this._moveSelection(this.moveCursorFileEnd);
    };

    this.selectFileStart = function() {
        this._moveSelection(this.moveCursorFileStart);
    };

    this.tokenRe = /^[\w\d]+/g;
    this.nonTokenRe = /^[^\w\d]+/g;

    this.selectWordRight = function() {
        this._moveSelection(this.moveCursorWordRight);
    };

    this.selectWordLeft = function() {
        this._moveSelection(this.moveCursorWordLeft);
    };

    this.selectWord = function() {
        var cursor = this.selectionLead;

        var line = this.doc.getLine(cursor.row);
        var column = cursor.column;

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

        this.setSelectionAnchor(cursor.row, start);
        this._moveSelection(function() {
            this.moveCursorTo(cursor.row, end);
        });
    };

    this.selectLine = function() {
        this.setSelectionAnchor(this.selectionLead.row, 0);
        this._moveSelection(function() {
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
            if (this.selectionLead.row > 0) {
                this.moveCursorTo(this.selectionLead.row - 1, this.doc
                        .getLine(this.selectionLead.row - 1).length);
            }
        }
        else {
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
            this.moveCursorBy(0, 1);
        }
    };

    this.moveCursorLineStart = function() {
        this.moveCursorTo(this.selectionLead.row, 0);
    };

    this.moveCursorLineEnd = function() {
        this.moveCursorTo(this.selectionLead.row,
                          this.doc.getLine(this.selectionLead.row).length);
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

    this.moveCursorWordLeft = function() {
        var row = this.selectionLead.row;
        var column = this.selectionLead.column;
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

    this.moveCursorBy = function(rows, chars) {
        this.moveCursorTo(this.selectionLead.row + rows, this.selectionLead.column + chars);
    };


    this.moveCursorToPosition = function(position) {
        this.moveCursorTo(position.row, position.column);
    };

    this.moveCursorTo = function(row, column) {
        this.selectionLead = this._clipPositionToDocument(row, column);
        this.updateCursor();
    };

    this.moveCursorUp = function() {
        this.moveCursorBy(-1, 0);
    };

    this._clipPositionToDocument = function(row, column) {
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

    this._clone = function(pos) {
        return {
            row: pos.row,
            column: pos.column
        };
    };

}).call(ace.Selection.prototype);