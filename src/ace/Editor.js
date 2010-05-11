ace.provide("ace.Editor");

ace.Editor = function(renderer, doc) {
    var container = renderer.getContainerElement();
    this.container = container;
    this.renderer = renderer;

    this.textInput = new ace.TextInput(container, this);
    new ace.KeyBinding(container, this);
    var self = this;
    ace.addListener(container, "mousedown", function(e) {
        setTimeout(function() {self.focus();});
        return ace.preventDefault(e);
    });
    ace.addListener(container, "selectstart", function(e) {
        return ace.preventDefault(e);
    });

    var mouseTarget = renderer.getMouseEventTarget();
    ace.addListener(mouseTarget, "mousedown", ace.bind(this.onMouseDown, this));
    ace.addListener(mouseTarget, "dblclick", ace.bind(this.onMouseDoubleClick, this));
    ace.addTripleClickListener(mouseTarget, ace.bind(this.onMouseTripleClick, this));
    ace.addMouseWheelListener(mouseTarget, ace.bind(this.onMouseWheel, this));

    this.$selectionMarker = null;
    this.$highlightLineMarker = null;
    this.$blockScrolling = false;

    this.$search = new ace.Search().set({
        wrap: true
    });

    this.setDocument(doc || new ace.Document(""));
};

(function(){

    ace.implement(this, ace.MEventEmitter);

    this.$forwardEvents = {
        gutterclick: 1,
        gutterdblclick: 1
    };

    this.$originalAddEventListener = this.addEventListener;
    this.$originalRemoveEventListener = this.removeEventListener;

    this.addEventListener = function(eventName, callback) {
        if (this.$forwardEvents[eventName]) {
            return this.renderer.addEventListener(eventName, callback);
        } else {
            return this.$originalAddEventListener(eventName, callback);
        }
    };

    this.removeEventListener = function(eventName, callback) {
        if (this.$forwardEvents[eventName]) {
            return this.renderer.removeEventListener(eventName, callback);
        } else {
            return this.$originalRemoveEventListener(eventName, callback);
        }
    };

    this.setDocument = function(doc) {
        if (this.doc == doc) return;

        if (this.doc) {
            this.doc.removeEventListener("change", this.$onDocumentChange);
            this.doc.removeEventListener("changeMode", this.$onDocumentModeChange);
            this.doc.removeEventListener("changeTabSize", this.$onDocumentChangeTabSize);
            this.doc.removeEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);

            var selection = this.doc.getSelection();
            this.selection.removeEventListener("changeCursor", this.$onCursorChange);
            this.selection.removeEventListener("changeSelection", this.$onSelectionChange);

            this.doc.setScrollTopRow(this.renderer.getScrollTopRow());
        }

        this.doc = doc;

        this.$onDocumentChange = ace.bind(this.onDocumentChange, this);
        doc.addEventListener("change", this.$onDocumentChange);
        this.renderer.setDocument(doc);

        this.$onDocumentModeChange = ace.bind(this.onDocumentModeChange, this);
        doc.addEventListener("changeMode", this.$onDocumentModeChange);

        this.$onDocumentChangeTabSize = ace.bind(this.renderer.draw, this.renderer);
        doc.addEventListener("changeTabSize", this.$onDocumentChangeTabSize);

        this.$onDocumentChangeBreakpoint = ace.bind(this.onDocumentChangeBreakpoint, this);
        this.doc.addEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);

        this.selection = doc.getSelection();

        this.$onCursorChange = ace.bind(this.onCursorChange, this);
        this.selection.addEventListener("changeCursor", this.$onCursorChange);

        this.$onSelectionChange = ace.bind(this.onSelectionChange, this);
        this.selection.addEventListener("changeSelection", this.$onSelectionChange);

        this.onDocumentModeChange();
        this.bgTokenizer.setLines(this.doc.lines);
        this.bgTokenizer.start(0);

        this.renderer.draw();
        this.onCursorChange();
        this.onSelectionChange();
        this.onDocumentChangeBreakpoint();
        this.renderer.scrollToRow(doc.getScrollTopRow());
    };

    this.getDocument = function() {
        return this.doc;
    };

    this.getSelection = function() {
        return this.selection;
    };

    this.resize = function() {
        this.renderer.onResize();
    };

    this.$highlightBrackets = function() {
        if (this.$bracketHighlight) {
            this.renderer.removeMarker(this.$bracketHighlight);
            this.$bracketHighlight = null;
        }

        if (this.$highlightPending) {
            return;
        }

        // perform highlight async to not block the browser during navigation
        var self = this;
        this.$highlightPending = true;
        setTimeout(function() {
            self.$highlightPending = false;

            var pos = self.doc.findMatchingBracket(self.getCursorPosition());
            if (pos) {
                range = new ace.Range(pos.row, pos.column, pos.row, pos.column+1);
                self.$bracketHighlight = self.renderer.addMarker(range, "bracket");
            }
        }, 10);
    };

    this.focus = function() {
        this.textInput.focus();
    };

    this.blur = function() {
        this.textInput.blur();
    };

    this.onFocus = function() {
        this.renderer.showCursor();
        this.renderer.visualizeFocus();
    };

    this.onBlur = function() {
        this.renderer.hideCursor();
        this.renderer.visualizeBlur();
    };

    this.onDocumentChange = function(e) {
        var data = e.data;
        this.bgTokenizer.start(data.firstRow);
        this.renderer.updateLines(data.firstRow, data.lastRow);
    };

    this.onTokenizerUpdate = function(e) {
        var rows = e.data;
        this.renderer.updateLines(rows.first, rows.last);
    };

    this.onCursorChange = function() {
        this.$highlightBrackets();
        this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite);

        if (!this.$blockScrolling) {
            this.renderer.scrollCursorIntoView();
        }
        this.$updateHighlightActiveLine();
    };

    this.$updateHighlightActiveLine = function() {
        if (this.$highlightLineMarker) {
            this.renderer.removeMarker(this.$highlightLineMarker);
        }
        this.$highlightLineMarker = null;

        if (this.getHighlightActiveLine() && !this.selection.isMultiLine()) {
            var cursor = this.getCursorPosition();
            var range = new ace.Range(cursor.row, 0, cursor.row+1, 0);
            this.$highlightLineMarker = this.renderer.addMarker(range, "active_line", "line");
        }
    };

    this.onSelectionChange = function() {
        if (this.$selectionMarker) {
            this.renderer.removeMarker(this.$selectionMarker);
        }
        this.$selectionMarker = null;

        if (!this.selection.isEmpty()) {
            var range = this.selection.getRange();
            var style = this.getSelectionStyle();
            this.$selectionMarker = this.renderer.addMarker(range, "selection", style);
        }

        this.onCursorChange();
    };

    this.onDocumentChangeBreakpoint = function() {
        this.renderer.setBreakpoints(this.doc.getBreakpoints());
    };

    this.onDocumentModeChange = function() {
        var mode = this.doc.getMode();

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
        this.renderer.draw();
    };


    this.onMouseDown = function(e) {
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

            selectionLead = _self.renderer.screenToTextCoordinates(mousePageX, mousePageY);

            _self.selection.selectToPosition(selectionLead);
            _self.renderer.scrollCursorIntoView();
        };

        ace.capture(this.container, onMouseSelection, onMouseSelectionEnd);
        var timerId = setInterval(onSelectionInterval, 20);

        return ace.preventDefault(e);
    };

    this.onMouseDoubleClick = function(e) {
        this.selection.selectWord();
    };

    this.onMouseTripleClick = function(e) {
        this.selection.selectLine();
    };

    this.onMouseWheel = function(e) {
        var delta = e.wheel;
        this.renderer.scrollToY(this.renderer.getScrollTop() - (delta * 15));
        return ace.preventDefault(e);
    };

    this.getCopyText = function() {
        if (!this.selection.isEmpty()) {
            return this.doc.getTextRange(this.getSelectionRange());
        }
        else {
            return "";
        }
    };

    this.onCut = function() {
        if (this.$readOnly)
            return;

        if (!this.selection.isEmpty()) {
            this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
            this.clearSelection();
        }
    };

    this.onTextInput = function(text) {
        if (this.$readOnly)
            return;

        var cursor = this.getCursorPosition();
        text = text.replace("\t", this.doc.getTabString());

        if (!this.selection.isEmpty()) {
            var cursor = this.doc.remove(this.getSelectionRange());
            this.clearSelection();
        } else if (this.$overwrite){
            var range = new ace.Range.fromPoints(cursor, cursor);
            range.end.column += text.length;
            this.doc.remove(range);
        }

        this.clearSelection();

        var lineState = this.bgTokenizer.getState(cursor.row-1);
        var shouldOutdent = this.mode.checkOutdent(lineState, this.doc.getLine(cursor.row), text);

        var end = this.doc.insert(cursor, text);

        var row = cursor.row;
        var line = this.doc.getLine(row);
        var lineState = this.bgTokenizer.getState(row);

        // multi line insert
        if (row !== end.row) {
            var indent = this.mode.getNextLineIndent(lineState, line, this.doc.getTabString());
            if (indent) {
                var indentRange = new ace.Range(row+1, 0, end.row, end.column);
                end.column += this.doc.indentRows(indentRange, indent);
            }
        } else {
            if (shouldOutdent) {
                end.column += this.mode.autoOutdent(lineState, this.doc, row);
            }
        }

        this.moveCursorToPosition(end);
        this.renderer.scrollCursorIntoView();
    };

    this.$overwrite = false;
    this.setOverwrite = function(overwrite) {
        if (this.$overwrite == overwrite) return;

        this.$overwrite = overwrite;

        this.$blockScrolling = true;
        this.onCursorChange();
        this.$blockScrolling = false;
    };

    this.getOverwrite = function() {
        return this.$overwrite;
    };

    this.toggleOverwrite = function() {
        this.setOverwrite(!this.$overwrite);
    };

    this.$selectionStyle = "line";
    this.setSelectionStyle = function(style) {
        if (this.$selectionStyle == style) return;

        this.$selectionStyle = style;
        this.onSelectionChange();
    };

    this.getSelectionStyle = function() {
        return this.$selectionStyle;
    };

    this.$highlightActiveLine = true;
    this.setHighlightActiveLine = function(shouldHighlight) {
        if (this.$highlightActiveLine == shouldHighlight) return;

        this.$highlightActiveLine = shouldHighlight;
        this.$updateHighlightActiveLine();
    };

    this.getHighlightActiveLine = function() {
        return this.$highlightActiveLine;
    };

    this.setShowInvisibles = function(showInvisibles) {
        if (this.getShowInvisibles() == showInvisibles)
            return;

        this.renderer.setShowInvisibles(showInvisibles);
        this.renderer.draw();
    };

    this.getShowInvisibles = function() {
        return this.renderer.getShowInvisibles();
    };

    this.setShowPrintMargin = function(showPrintMargin) {
        this.renderer.setShowPrintMargin(showPrintMargin);
    };

    this.getShowPrintMargin = function() {
        return this.renderer.getShowPrintMargin();
    };

    this.setPrintMarginColumn = function(showPrintMargin) {
        this.renderer.setPrintMarginColumn(showPrintMargin);
    };

    this.getPrintMarginColumn = function() {
        return this.renderer.getPrintMarginColumn();
    };

    this.$readOnly = false;
    this.setReadOnly = function(readOnly) {
        this.$readOnly = readOnly;
    };

    this.getReadOnly = function() {
        return this.readOnly;
    };

    this.removeRight = function() {
        if (this.$readOnly)
            return;

        if (this.selection.isEmpty()) {
            this.selection.selectRight();
        }
        this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
        this.clearSelection();
    };

    this.removeLeft = function() {
        if (this.$readOnly)
            return;

        if (this.selection.isEmpty()) {
            this.selection.selectLeft();
        }
        this.moveCursorToPosition(this.doc.remove(this.getSelectionRange()));
        this.clearSelection();
    };

    this.blockIndent = function(indentString) {
        if (this.$readOnly)
            return;

        var indentString = indentString || this.doc.getTabString();
        var addedColumns = this.doc.indentRows(this.getSelectionRange(), indentString);

        this.selection.shiftSelection(addedColumns);
    };

    this.blockOutdent = function(indentString) {
        if (this.$readOnly)
            return;

        var indentString = indentString || this.doc.getTabString();
        var addedColumns = this.doc.outdentRows(this.getSelectionRange(), indentString);

        this.selection.shiftSelection(addedColumns);
    };

    this.toggleCommentLines = function() {
        if (this.$readOnly)
            return;

        var rows = this.$getSelectedRows();

        var range = new ace.Range(rows.first, 0, rows.last, 0);
        var state = this.bgTokenizer.getState(this.getCursorPosition().row);
        var addedColumns = this.mode.toggleCommentLines(state, this.doc, range);

        this.selection.shiftSelection(addedColumns);
    };

    this.removeLines = function() {
        if (this.$readOnly)
            return;

        var rows = this.$getSelectedRows();
        this.selection.setSelectionAnchor(rows.last+1, 0);
        this.selection.selectTo(rows.first, 0);

        this.doc.remove(this.getSelectionRange());
        this.clearSelection();
    };

    this.moveLinesDown = function() {
        if (this.$readOnly)
            return;

        this.$moveLines(function(firstRow, lastRow) {
            return this.doc.moveLinesDown(firstRow, lastRow);
        });
    };

    this.moveLinesUp = function() {
        if (this.$readOnly)
            return;

        this.$moveLines(function(firstRow, lastRow) {
            return this.doc.moveLinesUp(firstRow, lastRow);
        });
    };

    this.copyLinesUp = function() {
        if (this.$readOnly)
            return;

        this.$moveLines(function(firstRow, lastRow) {
            this.doc.duplicateLines(firstRow, lastRow);
            return 0;
        });
    };

    this.copyLinesDown = function() {
        if (this.$readOnly)
            return;

        this.$moveLines(function(firstRow, lastRow) {
            return this.doc.duplicateLines(firstRow, lastRow);
        });
    };


    this.$moveLines = function(mover) {
        var rows = this.$getSelectedRows();

        var linesMoved = mover.call(this, rows.first, rows.last);

        var selection = this.selection;
        selection.setSelectionAnchor(rows.last+linesMoved+1, 0);
        selection.$moveSelection(function() {
            selection.moveCursorTo(rows.first+linesMoved, 0);
        });
    };

    this.$getSelectedRows = function() {
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

    this.onCompositionStart = function() {
        this.renderer.showComposition(this.getCursorPosition());
        this.onTextInput(" ");
    };

    this.onCompositionUpdate = function(text) {
        this.renderer.setCompositionText(text);
    };

    this.onCompositionEnd = function() {
        this.renderer.hideComposition();
        this.removeLeft();
    };


    this.getFirstVisibleRow = function() {
        return this.renderer.getFirstVisibleRow();
    };

    this.getLastVisibleRow = function() {
        return this.renderer.getLastVisibleRow();
    };

    this.isRowVisible = function(row) {
        return (row >= this.getFirstVisibleRow() && row <= this.getLastVisibleRow());
    };

    this.getVisibleRowCount = function() {
        return this.getLastVisibleRow() - this.getFirstVisibleRow() + 1;
    };

    this.getPageDownRow = function() {
        return this.renderer.getLastVisibleRow() - 1;
    };

    this.getPageUpRow = function() {
        var firstRow = this.renderer.getFirstVisibleRow();
        var lastRow = this.renderer.getLastVisibleRow();

        return firstRow - (lastRow - firstRow) + 1;
    };

    this.selectPageDown = function() {
        var row = this.getPageDownRow() + Math.floor(this.getVisibleRowCount() / 2);

        this.scrollPageDown();

        var selection = this.getSelection();
        selection.$moveSelection(function() {
            selection.moveCursorTo(row, selection.getSelectionLead().column);
        });
    };

    this.selectPageUp = function() {
        var visibleRows = this.getLastVisibleRow() - this.getFirstVisibleRow();
        var row = this.getPageUpRow() + Math.round(visibleRows / 2);

        this.scrollPageUp();

        var selection = this.getSelection();
        selection.$moveSelection(function() {
            selection.moveCursorTo(row, selection.getSelectionLead().column);
        });
    };

    this.scrollPageDown = function() {
        this.scrollToRow(this.getPageDownRow());
    };

    this.scrollPageUp = function() {
        this.renderer.scrollToRow(this.getPageUpRow());
    };

    this.scrollToRow = function(row) {
        this.renderer.scrollToRow(row);
    };


    this.getCursorPosition = function() {
        return this.selection.getCursor();
    };

    this.getSelectionRange = function() {
        return this.selection.getRange();
    };

    this.clearSelection = function() {
        this.selection.clearSelection();
    };

    this.moveCursorTo = function(row, column) {
        this.selection.moveCursorTo(row, column);
    };

    this.moveCursorToPosition = function(pos) {
        this.selection.moveCursorToPosition(pos);
    };


    this.gotoLine = function(lineNumber) {
        this.$blockScrolling = true;
        this.moveCursorTo(lineNumber-1, 0);
        this.$blockScrolling = false;

        if (!this.isRowVisible(this.getCursorPosition().row)) {
            this.scrollToRow(lineNumber - 1 - Math.floor(this.getVisibleRowCount() / 2));
        }
    },

    this.navigateTo = function(row, column) {
        this.clearSelection();
        this.moveCursorTo(row, column);
    };

    this.navigateUp = function() {
        this.clearSelection();
        this.selection.moveCursorUp();
    };

    this.navigateDown = function() {
        this.clearSelection();
        this.selection.moveCursorDown();
    };

    this.navigateLeft = function() {
        if (!this.selection.isEmpty()) {
            var selectionStart = this.getSelectionRange().start;
            this.moveCursorToPosition(selectionStart);
        }
        else {
            this.selection.moveCursorLeft();
        }
        this.clearSelection();
    };

    this.navigateRight = function() {
        if (!this.selection.isEmpty()) {
            var selectionEnd = this.getSelectionRange().end;
            this.moveCursorToPosition(selectionEnd);
        }
        else {
            this.selection.moveCursorRight();
        }
        this.clearSelection();
    };

    this.navigateLineStart = function() {
        this.clearSelection();
        this.selection.moveCursorLineStart();
    };

    this.navigateLineEnd = function() {
        this.clearSelection();
        this.selection.moveCursorLineEnd();
    };

    this.navigateFileEnd = function() {
        this.clearSelection();
        this.selection.moveCursorFileEnd();
    };

    this.navigateFileStart = function() {
        this.clearSelection();
        this.selection.moveCursorFileStart();
    };

    this.navigateWordRight = function() {
        this.clearSelection();
        this.selection.moveCursorWordRight();
    };

    this.navigateWordLeft = function() {
        this.clearSelection();
        this.selection.moveCursorWordLeft();
    };

    this.replace = function(replacement) {
      var range = this.$tryReplace(this.getSelectionRange(), replacement);
      if (range !== null)
          this.selection.setSelectionRange(range);
    },

    this.replaceAll = function(replacement) {
        this.clearSelection();
        this.selection.moveCursorTo(0, 0);

        var ranges = this.$search.findAll(this.doc);
        if (!ranges.length)
            return;

        for (var i=0; i<ranges.length; i++) {
            var range = ranges[i];
            this.$tryReplace(range, replacement);
        }
        this.selection.setSelectionRange(range);
    },

    this.$tryReplace = function(range, replacement) {
        var input = this.doc.getTextRange(range);
        var replacement = this.$search.replace(input, replacement);
        if (replacement !== null) {
            range.end = this.doc.replace(range, replacement);
            return range;
        } else {
            return null;
        }
    };

    this.find = function(needle) {
        this.clearSelection();
        this.$search.set({needle: needle});
        this.findNext();
    },

    this.findNext = function() {
        this.$find(false);
    };

    this.findPrevious = function() {
        this.$find(true);
    };

    this.$find = function(backwards) {
        if (!this.selection.isEmpty()) {
            this.$search.set({needle: this.doc.getTextRange(this.getSelectionRange())});
        }

        this.$search.set({
            backwards: backwards
        });

        var range = this.$search.find(this.doc);
        if (range)
            this.selection.setSelectionRange(range);
    };

    this.undo = function() {
        this.doc.getUndoManager().undo();
    };

    this.redo = function() {
        this.doc.getUndoManager().redo();
    };

}).call(ace.Editor.prototype);