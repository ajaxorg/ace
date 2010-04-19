ace.provide("ace.Editor");

ace.Editor = function(renderer, doc, mode) {
    var container = renderer.getContainerElement();
    this.container = container;
    this.renderer = renderer;

    this.setMode(mode || new ace.mode.Text());
    this.setDocument(doc || new ace.TextDocument(""));

    this.textInput = new ace.TextInput(container, this);
    new ace.KeyBinding(container, this);

    ace.addListener(container, "mousedown", ace.bind(this.onMouseDown, this));
    ace.addListener(container, "dblclick", ace.bind(this.onMouseDoubleClick, this));
    ace.addTripleClickListener(container, ace.bind(this.onMouseTripleClick, this));
    ace.addMouseWheelListener(container, ace.bind(this.onMouseWheel, this));

    this._selectionMarker = null;
    this._highlightLineMarker = null;
    this._blockScrolling = false;

    this.renderer.draw();
    this.onCursorChange();
    this.onSelectionChange();

    this._initialized = true;
};


ace.Editor.prototype.setDocument = function(doc) {
    // TODO: document change is not yet supported
    if (this.doc) {
        throw new Error("TODO: document change is not yet supported");
    }

    this.doc = doc;

    doc.addEventListener("change", ace.bind(this.onDocumentChange, this));
    this.renderer.setDocument(doc);

    var self = this;
    doc.addEventListener("changeTabSize", function() {
        self.renderer.draw();
    });

    this.selection = doc.getSelection();

    var onCursorChange = ace.bind(this.onCursorChange, this);
    this.selection.addEventListener("changeCursor", onCursorChange);

    var onSelectionChange = ace.bind(this.onSelectionChange, this);
    this.selection.addEventListener("changeSelection", onSelectionChange);


    this.bgTokenizer.setLines(this.doc.lines);
};

ace.Editor.prototype.getSelection = function() {
    return this.selection;
};

ace.Editor.prototype.setMode = function(mode) {
    if (this.mode == mode) return;

    this.mode = mode;
    var tokenizer = mode.getTokenizer();

    if (!this.bgTokenizer) {
        var onUpdate = ace.bind(this.onTokenizerUpdate, this);
        this.bgTokenizer = new ace.BackgroundTokenizer(tokenizer);
        this.bgTokenizer.addEventListener("update", onUpdate);
    } else {
        this.bgTokenizer.setTokenizer(tokenizer);
    }

    this.renderer.setTokenizer(this.bgTokenizer);

    if (this._initialized) {
        this.renderer.draw();
    }
};


ace.Editor.prototype.resize = function() {
    this.renderer.onResize();
};

ace.Editor.prototype._highlightBrackets = function() {
    if (this._bracketHighlight) {
        this.renderer.removeMarker(this._bracketHighlight);
        this._bracketHighlight = null;
    }

    if (this._highlightPending) {
        return;
    }

    // perform highlight async to not block the browser during navigation
    var self = this;
    this._highlightPending = true;
    setTimeout(function() {
        self._highlightPending = false;

        var pos = self.doc.findMatchingBracket(self.getCursorPosition());
        if (pos) {
            range = {
                start: pos,
                end: {
                    row: pos.row,
                    column: pos.column+1
                }
            };
            self._bracketHighlight = self.renderer.addMarker(range, "bracket");
        }
    }, 10);
};


ace.Editor.prototype.onFocus = function() {
    this.renderer.showCursor();
    this.renderer.visualizeFocus();
};

ace.Editor.prototype.onBlur = function() {
    this.renderer.hideCursor();
    this.renderer.visualizeBlur();
};

ace.Editor.prototype.onDocumentChange = function(e) {
    var data = e.data;
    this.bgTokenizer.start(data.firstRow);
    this.renderer.updateLines(data.firstRow, data.lastRow);
};

ace.Editor.prototype.onTokenizerUpdate = function(e) {
    var rows = e.data;
    this.renderer.updateLines(rows.first, rows.last);
};

ace.Editor.prototype.onCursorChange = function() {
    this._highlightBrackets();
    this.renderer.updateCursor(this.getCursorPosition());

    if (!this._blockScrolling) {
        this.renderer.scrollCursorIntoView();
    }
    this._updateHighlightActiveLine();
};

ace.Editor.prototype._updateHighlightActiveLine = function() {
    if (this._highlightLineMarker) {
        this.renderer.removeMarker(this._highlightLineMarker);
    }
    this._highlightLineMarker = null;

    if (this.getHighlightActiveLine() && !this.selection.isMultiLine()) {
        var cursor = this.getCursorPosition();
        var range = {
            start: {
                row: cursor.row,
                column: 0
            },
            end: {
                row: cursor.row+1,
                column: 0
            }
        };
        this._highlightLineMarker = this.renderer.addMarker(range, "active_line", "line");
    }
};

ace.Editor.prototype.onSelectionChange = function() {
    if (this._selectionMarker) {
        this.renderer.removeMarker(this._selectionMarker);
    }
    this._selectionMarker = null;

    if (!this.selection.isEmpty()) {
        var range = this.selection.getRange();
        var style = this.getSelectionStyle();
        this._selectionMarker = this.renderer.addMarker(range, "selection", style);
    }

    this.onCursorChange();
};

ace.Editor.prototype.onMouseDown = function(e) {
    this.textInput.focus();

    var pageX = ace.getDocumentX(e);
    var pageY = ace.getDocumentY(e);

    var pos = this.renderer.screenToTextCoordinates(pageX, pageY);
    this.moveCursorToPosition(pos);
    this.selection.setSelectionAnchor(pos.row, pos.column);
    this.renderer.scrollCursorIntoView();

    var _self = this;
    var mousePageX, mousePageY;

    var onMouseSelection = function(e) {
        mousePageX = ace.getDocumentX(e);
        mousePageY = ace.getDocumentY(e);
    };

    var onMouseSelectionEnd = function() {
        clearInterval(timerId);
    };

    var onSelectionInterval = function() {
        if (mousePageX === undefined || mousePageY === undefined)
            return;

        selectionLead = _self.renderer.screenToTextCoordinates(mousePageX,
                                                               mousePageY);

        _self.selection.selectToPosition(selectionLead);
        _self.renderer.scrollCursorIntoView();
    };

    ace.capture(this.container, onMouseSelection, onMouseSelectionEnd);
    var timerId = setInterval(onSelectionInterval, 20);

    return ace.preventDefault(e);
};

ace.Editor.prototype.onMouseDoubleClick = function(e) {
    this.selection.selectWord();
};

ace.Editor.prototype.onMouseTripleClick = function(e) {
    this.selection.selectLine();
};

ace.Editor.prototype.onMouseWheel = function(e) {
    var delta = e.wheel;
    this.renderer.scrollToY(this.renderer.getScrollTop() - (delta * 15));
    return ace.preventDefault(e);
};

ace.Editor.prototype.getCopyText = function() {
    if (!this.selection.isEmpty()) {
        return this.doc.getTextRange(this.getSelectionRange());
    }
    else {
        return "";
    }
};

ace.Editor.prototype.onCut = function() {
    if (!this.selection.isEmpty()) {
        this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
        this.clearSelection();
    }
};

ace.Editor.prototype.onTextInput = function(text) {
    var cursor = this.getCursorPosition();

    if (this.doc.getUseSoftTabs()) {
        text = text.replace(/\t/g, this.doc.getTabString());
    }

    if (!this.selection.isEmpty()) {
        var end = this.doc.replace(this.getSelectionRange(), text);
        this.clearSelection();
    }
    else {
        var end = this.doc.insert(cursor, text);
    }

    // multi line insert
    var row = cursor.row;
    if (row !== end.row) {
        var line = this.doc.getLine(row);
        var lineState = this.bgTokenizer.getState(row);
        var indent = this.mode.getNextLineIndent(line, lineState, this.doc.getTabString());
        if (indent) {
            var indentRange = {
                start: {
                    row: row+1,
                    column: 0
                },
                end : end
            };
            end.column += this.doc.indentRows(indentRange, indent);
        }
    }

    this.moveCursorToPosition(end);
    this.renderer.scrollCursorIntoView();
};

ace.Editor.prototype._selectionStyle = "line";
ace.Editor.prototype.setSelectionStyle = function(style) {
    if (this._selectionStyle == style) return;

    this._selectionStyle = style;
    this.onSelectionChange();
};

ace.Editor.prototype.getSelectionStyle = function() {
    return this._selectionStyle;
};

ace.Editor.prototype._highlightActiveLine = true;
ace.Editor.prototype.setHighlightActiveLine = function(shouldHighlight) {
    if (this._highlightActiveLine == shouldHighlight) return;

    this._highlightActiveLine = shouldHighlight;
    this._updateHighlightActiveLine();
};

ace.Editor.prototype.getHighlightActiveLine = function() {
    return this._highlightActiveLine;
};

ace.Editor.prototype.removeRight = function() {
    if (this.selection.isEmpty()) {
        this.selection.selectRight();
    }
    this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
    this.clearSelection();
};

ace.Editor.prototype.removeLeft = function() {
    if (this.selection.isEmpty()) {
        this.selection.selectLeft();
    }
    this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
    this.clearSelection();
};

ace.Editor.prototype.blockIndent = function(indentString) {
    var indentString = indentString || this.doc.getTabString();
    var addedColumns = this.doc.indentRows(this.getSelectionRange(), indentString);

    this.selection.shiftSelection(addedColumns);
};

ace.Editor.prototype.blockOutdent = function(indentString) {
    var indentString = indentString || this.doc.getTabString();
    var addedColumns = this.doc.outdentRows(this.getSelectionRange(), indentString);

    this.selection.shiftSelection(addedColumns);
};

ace.Editor.prototype.toggleCommentLines = function() {
    if (this.selection.isEmpty()) return;

    var range = this.getSelectionRange();
    var state = this.bgTokenizer.getState(this.getCursorPosition().row);
    var addedColumns = this.mode.toggleCommentLines(this.doc, range, state);

    this.selection.shiftSelection(addedColumns);
};

ace.Editor.prototype.removeLines = function() {
    var rows = this._getSelectedRows();
    this.selection.setSelectionAnchor(rows.last+1, 0);
    this.selection.selectTo(rows.first, 0);

    this.doc.remove(this.getSelectionRange());
    this.clearSelection();
};

ace.Editor.prototype.moveLinesDown = function() {
    this._moveLines(function(firstRow, lastRow) {
        return this.doc.moveLinesDown(firstRow, lastRow);
    });
};

ace.Editor.prototype.moveLinesUp = function() {
    this._moveLines(function(firstRow, lastRow) {
        return this.doc.moveLinesUp(firstRow, lastRow);
    });
};

ace.Editor.prototype.copyLinesUp = function() {
    this._moveLines(function(firstRow, lastRow) {
        this.doc.duplicateLines(firstRow, lastRow);
        return 0;
    });
};

ace.Editor.prototype.copyLinesDown = function() {
    this._moveLines(function(firstRow, lastRow) {
        return this.doc.duplicateLines(firstRow, lastRow);
    });
};


ace.Editor.prototype._moveLines = function(mover) {
    var rows = this._getSelectedRows();

    var linesMoved = mover.call(this, rows.first, rows.last);

    var selection = this.selection;
    selection.setSelectionAnchor(rows.last+linesMoved+1, 0);
    selection._moveSelection(function() {
        selection.moveCursorTo(rows.first+linesMoved, 0);
    });
};

ace.Editor.prototype._getSelectedRows = function() {
    var range = this.getSelectionRange();
    var firstRow = range.start.row;
    var lastRow = range.end.row;
    if (range.end.column == 0 && (range.start.row !== range.end.row)) {
        lastRow -= 1;
    }

    return {
        first: firstRow,
        last: lastRow
    };
};

ace.Editor.prototype.onCompositionStart = function() {
    this.renderer.showComposition(this.getCursorPosition());
    this.onTextInput(" ");
};

ace.Editor.prototype.onCompositionUpdate = function(text) {
    this.renderer.setCompositionText(text);
};

ace.Editor.prototype.onCompositionEnd = function() {
    this.renderer.hideComposition();
    this.removeLeft();
};


ace.Editor.prototype.getFirstVisibleRow = function() {
    return this.renderer.getFirstVisibleRow();
};

ace.Editor.prototype.getLastVisibleRow = function() {
    return this.renderer.getLastVisibleRow();
};

ace.Editor.prototype.isRowVisible = function(row) {
    return (row >= this.getFirstVisibleRow() && row <= this.getLastVisibleRow());
};

ace.Editor.prototype.getVisibleRowCount = function() {
    return this.getLastVisibleRow() - this.getFirstVisibleRow() + 1;
};

ace.Editor.prototype.getPageDownRow = function() {
    return this.renderer.getLastVisibleRow() - 1;
};

ace.Editor.prototype.getPageUpRow = function() {
    var firstRow = this.renderer.getFirstVisibleRow();
    var lastRow = this.renderer.getLastVisibleRow();

    return firstRow - (lastRow - firstRow) + 1;
};


ace.Editor.prototype.scrollPageDown = function() {
    this.scrollToRow(this.getPageDownRow());
};

ace.Editor.prototype.scrollPageUp = function() {
    this.renderer.scrollToRow(this.getPageUpRow());
};

ace.Editor.prototype.scrollToRow = function(row) {
    this.renderer.scrollToRow(row);
};


ace.Editor.prototype.getCursorPosition = function() {
    return this.selection.getCursor();
};

ace.Editor.prototype.getSelectionRange = function() {
    return this.selection.getRange();
};

ace.Editor.prototype.clearSelection = function() {
    this.selection.clearSelection();
};

ace.Editor.prototype.moveCursorTo = function(row, column) {
    this.selection.moveCursorTo(row, column);
};

ace.Editor.prototype.moveCursorToPosition = function(pos) {
    this.selection.moveCursorToPosition(pos);
};


ace.Editor.prototype.gotoLine = function(lineNumber) {
    this._blockScrolling = true;
    this.moveCursorTo(lineNumber, 0);
    this._blockScrolling = false;

    if (!this.isRowVisible(this.getCursorPosition().row)) {
        this.scrollToRow(lineNumber - Math.floor(this.getVisibleRowCount() / 2));
    }
},

ace.Editor.prototype.navigateTo = function(row, column) {
    this.clearSelection();
    this.moveCursorTo(row, column);
};

ace.Editor.prototype.navigateUp = function() {
    this.clearSelection();
    this.selection.moveCursorUp();
};

ace.Editor.prototype.navigateDown = function() {
    this.clearSelection();
    this.selection.moveCursorDown();
};

ace.Editor.prototype.navigateLeft = function() {
    if (!this.selection.isEmpty()) {
        var selectionStart = this.getSelectionRange().start;
        this.moveCursorToPosition(selectionStart);
    }
    else {
        this.selection.moveCursorLeft();
    }
    this.clearSelection();
};

ace.Editor.prototype.navigateRight = function() {
    if (!this.selection.isEmpty()) {
        var selectionEnd = this.getSelectionRange().end;
        this.moveCursorToPosition(selectionEnd);
    }
    else {
        this.selection.moveCursorRight();
    }
    this.clearSelection();
};

ace.Editor.prototype.navigateLineStart = function() {
    this.clearSelection();
    this.selection.moveCursorLineStart();
};

ace.Editor.prototype.navigateLineEnd = function() {
    this.clearSelection();
    this.selection.moveCursorLineEnd();
};

ace.Editor.prototype.navigateFileEnd = function() {
    this.clearSelection();
    this.selection.moveCursorFileEnd();
};

ace.Editor.prototype.navigateFileStart = function() {
    this.clearSelection();
    this.selection.moveCursorFileStart();
};

ace.Editor.prototype.navigateWordRight = function() {
    this.clearSelection();
    this.selection.moveCursorWordRight();
};

ace.Editor.prototype.navigateWordLeft = function() {
    this.clearSelection();
    this.selection.moveCursorWordLeft();
};