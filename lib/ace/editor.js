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
var event = require("ace/lib/event").event;
var lang = require("ace/lib/lang").lang;
var TextInput = require("ace/textinput");
var KeyBinding = require("ace/keybinding");
var Document = require("ace/document");
var Search = require("ace/search");
var BackgroundTokenizer = require("ace/background_tokenizer");
var Range = require("ace/range");
var MEventEmitter = require("ace/event_emitter").MEventEmitter;

var Editor =function(renderer, doc) {
    var container = renderer.getContainerElement();
    this.container = container;
    this.renderer = renderer;

    this.textInput  = new TextInput(container, this);
    this.keyBinding = new KeyBinding(container, this);
    var self = this;
    event.addListener(container, "mousedown", function(e) {
        setTimeout(function() {self.focus();});
        return event.preventDefault(e);
    });
    event.addListener(container, "selectstart", function(e) {
        return event.preventDefault(e);
    });

    var mouseTarget = renderer.getMouseEventTarget();
    event.addListener(mouseTarget, "mousedown", lang.bind(this.onMouseDown, this));
    event.addMultiMouseDownListener(mouseTarget, 0, 2, 500, lang.bind(this.onMouseDoubleClick, this));
    event.addMultiMouseDownListener(mouseTarget, 0, 3, 600, lang.bind(this.onMouseTripleClick, this));
    event.addMouseWheelListener(mouseTarget, lang.bind(this.onMouseWheel, this));

    this.$selectionMarker = null;
    this.$highlightLineMarker = null;
    this.$blockScrolling = false;

    this.$search = new Search().set({
        wrap: true
    });

    this.setDocument(doc || new Document(""));
    this.focus();
};

(function(){

    oop.implement(this, MEventEmitter);

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
            selection.removeEventListener("changeCursor", this.$onCursorChange);
            selection.removeEventListener("changeSelection", this.$onSelectionChange);

            this.doc.setScrollTopRow(this.renderer.getScrollTopRow());
        }

        this.doc = doc;

        this.$onDocumentChange = lang.bind(this.onDocumentChange, this);
        doc.addEventListener("change", this.$onDocumentChange);
        this.renderer.setDocument(doc);

        this.$onDocumentModeChange = lang.bind(this.onDocumentModeChange, this);
        doc.addEventListener("changeMode", this.$onDocumentModeChange);

        this.$onDocumentChangeTabSize = lang.bind(this.renderer.updateText, this.renderer);
        doc.addEventListener("changeTabSize", this.$onDocumentChangeTabSize);

        this.$onDocumentChangeBreakpoint = lang.bind(this.onDocumentChangeBreakpoint, this);
        this.doc.addEventListener("changeBreakpoint", this.$onDocumentChangeBreakpoint);

        this.selection = doc.getSelection();
        this.$desiredColumn = 0;

        this.$onCursorChange = lang.bind(this.onCursorChange, this);
        this.selection.addEventListener("changeCursor", this.$onCursorChange);

        this.$onSelectionChange = lang.bind(this.onSelectionChange, this);
        this.selection.addEventListener("changeSelection", this.$onSelectionChange);

        this.onDocumentModeChange();
        this.bgTokenizer.setLines(this.doc.lines);
        this.bgTokenizer.start(0);

        this.onCursorChange();
        this.onSelectionChange();
        this.onDocumentChangeBreakpoint();
        this.renderer.scrollToRow(doc.getScrollTopRow());
        this.renderer.updateFull();
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

    this.setTheme = function(theme) {
        this.renderer.setTheme(theme);
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
                var range = new Range(pos.row, pos.column, pos.row, pos.column+1);
                self.$bracketHighlight = self.renderer.addMarker(range, "ace_bracket");
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

        // update cursor because tab characters can influence the cursor position
        this.renderer.updateCursor(this.getCursorPosition(), this.$overwrite);
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

        if (this.getHighlightActiveLine() && (this.getSelectionStyle() != "line" || !this.selection.isMultiLine())) {
            var cursor = this.getCursorPosition();
            var range = new Range(cursor.row, 0, cursor.row+1, 0);
            this.$highlightLineMarker = this.renderer.addMarker(range, "ace_active_line", "line");
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
            this.$selectionMarker = this.renderer.addMarker(range, "ace_selection", style);
        }

        this.onCursorChange();
    };

    this.onDocumentChangeBreakpoint = function() {
        this.renderer.setBreakpoints(this.doc.getBreakpoints());
    };

    this.onDocumentModeChange = function() {
        var mode = this.doc.getMode();
        if (this.mode == mode)
            return;

        this.mode = mode;
        var tokenizer = mode.getTokenizer();

        if (!this.bgTokenizer) {
            var onUpdate = lang.bind(this.onTokenizerUpdate, this);
            this.bgTokenizer = new BackgroundTokenizer(tokenizer, this);
            this.bgTokenizer.addEventListener("update", onUpdate);
        } else {
            this.bgTokenizer.setTokenizer(tokenizer);
        }

        this.renderer.setTokenizer(this.bgTokenizer);
    };


    this.onMouseDown = function(e) {
        var pageX = event.getDocumentX(e);
        var pageY = event.getDocumentY(e);

        var pos = this.renderer.screenToTextCoordinates(pageX, pageY);
        pos.row = Math.max(0, Math.min(pos.row, this.doc.getLength()-1));
        
        if (event.getButton(e) != 0) {
            if (this.selection.isEmpty()) {
                this.moveCursorToPosition(pos);
            }
            return;
        }

        if (e.shiftKey)
            this.selection.selectToPosition(pos)
        else {
            this.moveCursorToPosition(pos);
            if (!this.$clickSelection)
                this.selection.clearSelection(pos.row, pos.column);
        }

        this.renderer.scrollCursorIntoView();

        var self = this;
        var mousePageX, mousePageY;

        var onMouseSelection = function(e) {
            mousePageX = event.getDocumentX(e);
            mousePageY = event.getDocumentY(e);
        };

        var onMouseSelectionEnd = function() {
            clearInterval(timerId);
            self.$clickSelection = null;
        };

        var onSelectionInterval = function() {
            if (mousePageX === undefined || mousePageY === undefined)
                return;

            var cursor = self.renderer.screenToTextCoordinates(mousePageX, mousePageY);
            cursor.row = Math.max(0, Math.min(cursor.row, self.doc.getLength()-1));

            if (self.$clickSelection) {
                if (self.$clickSelection.contains(cursor.row, cursor.column)) {
                    self.selection.setSelectionRange(self.$clickSelection);
                } else {
                    if (self.$clickSelection.compare(cursor.row, cursor.column) == -1) {
                        var anchor = self.$clickSelection.end;
                    } else {
                        var anchor = self.$clickSelection.start;
                    }
                    self.selection.setSelectionAnchor(anchor.row, anchor.column);
                    self.selection.selectToPosition(cursor);
                }
            }
            else {
                self.selection.selectToPosition(cursor);
            }

            self.renderer.scrollCursorIntoView();
        };

        event.capture(this.container, onMouseSelection, onMouseSelectionEnd);
        var timerId = setInterval(onSelectionInterval, 20);

        return event.preventDefault(e);
    };

    this.onMouseDoubleClick = function(e) {
        this.selection.selectWord();
        this.$clickSelection = this.getSelectionRange();
        this.$updateDesiredColumn();
    };

    this.onMouseTripleClick = function(e) {
        this.selection.selectLine();
        this.$clickSelection = this.getSelectionRange();
        this.$updateDesiredColumn();
    };

    this.onMouseWheel = function(e) {
        var speed = this.$scrollSpeed * 2;

        this.renderer.scrollBy(e.wheelX * speed, e.wheelY * speed);
        return event.preventDefault(e);
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

        // remove selected text
        if (!this.selection.isEmpty()) {
            var cursor = this.doc.remove(this.getSelectionRange());
            this.clearSelection();
        } else if (this.$overwrite){
            var range = new Range.fromPoints(cursor, cursor);
            range.end.column += text.length;
            this.doc.remove(range);
        }

        this.clearSelection();

        var _self   = this;
        this.bgTokenizer.getState(cursor.row, function (lineState) {
            var shouldOutdent = _self.mode.checkOutdent(lineState, _self.doc.getLine(cursor.row), text);
            var line          = _self.doc.getLine(cursor.row),
                lineIndent    = _self.mode.getNextLineIndent(lineState, line, _self.doc.getTabString());
            var end = _self.doc.insert(cursor, text);

            /* TODO: This shortcut is somehow broken
            if (!shouldOutdent && line != _self.doc.getLine(row) && text != "\n") {
                _self.moveCursorToPosition(end);
                _self.renderer.scrollCursorIntoView();
                return;
            }
            */
            
            _self.bgTokenizer.getState(cursor.row, function(lineState) {
                // multi line insert
                if (cursor.row !== end.row) {
                    var size        = _self.doc.getTabSize(),
                        minIndent   = Number.MAX_VALUE;

                    for (var row = cursor.row + 1; row <= end.row; ++row) {
                        var indent = 0;

                        line = _self.doc.getLine(row);
                        for (var i = 0; i < line.length; ++i)
                            if (line.charAt(i) == '\t')
                                indent += size;
                            else if (line.charAt(i) == ' ') 
                                indent += 1;
                            else
                                break;
                        if (/[^\s]$/.test(line))
                            minIndent = Math.min(indent, minIndent);
                    }
                    for (var row = cursor.row + 1; row <= end.row; ++row) {
                        var outdent = minIndent;

                        line = _self.doc.getLine(row);
                        for (var i = 0; i < line.length && outdent > 0; ++i)
                            if (line.charAt(i) == '\t')
                                outdent -= size;
                            else if (line.charAt(i) == ' ')
                                outdent -= 1;
                        _self.doc.replace(new Range(row, 0, row, line.length), line.substr(i));
                    }
                    end.column += _self.doc.indentRows(
                        new Range(cursor.row + 1, 0, end.row, end.column), 
                        lineIndent);
                } else {
                    if (shouldOutdent) {
                        end.column += _self.mode.autoOutdent(lineState, _self.doc, cursor.row);
                    }
                }

                _self.moveCursorToPosition(end);
                _self.renderer.scrollCursorIntoView();
            });
        });
    };

    this.$overwrite = false;
    this.setOverwrite = function(overwrite) {
        if (this.$overwrite == overwrite) return;

        this.$overwrite = overwrite;

        this.$blockScrolling = true;
        this.onCursorChange();
        this.$blockScrolling = false;

        this.$dispatchEvent("changeOverwrite", {data: overwrite});
    };

    this.getOverwrite = function() {
        return this.$overwrite;
    };

    this.toggleOverwrite = function() {
        this.setOverwrite(!this.$overwrite);
    };


    this.$scrollSpeed = 1;
    this.setScrollSpeed = function(speed) {
        this.$scrollSpeed = speed;
    }

    this.getScrollSpeed = function() {
        return this.$scrollSpeed;
    }

    this.$selectionStyle = "line";
    this.setSelectionStyle = function(style) {
        if (this.$selectionStyle == style) return;

        this.$selectionStyle = style;
        this.onSelectionChange();
        this.$dispatchEvent("changeSelectionStyle", {data: style});
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
        return this.$readOnly;
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

    this.indent = function() {
        if (this.$readOnly)
            return;

        var range = this.getSelectionRange();
                
        if (range.start.row < range.end.row ||
            range.start.column < range.end.column) {
            var count = this.doc.indentRows(this.getSelectionRange(), "\t");
            
            this.selection.shiftSelection(count);
        } else {
            var indentString;
            
            if (this.doc.getUseSoftTabs()) {
                var size = this.doc.getTabSize(),
                    count = (size - this.getCursorPosition().column % size);
                    
                indentString = lang.stringRepeat(" ", count);
            } else
                indentString = "\t";
            return this.onTextInput(indentString);
        }
    };

    this.blockOutdent = function(indentString) {
        if (this.$readOnly)
            return;

        var selection  = this.doc.getSelection(),
            range      = this.doc.outdentRows(selection.getRange());
        
        selection.setSelectionRange(range, selection.isBackwards());
        this.$updateDesiredColumn();
    };

    this.toggleCommentLines = function() {
        if (this.$readOnly)
            return;

        var rows = this.$getSelectedRows();

        var range = new Range(rows.first, 0, rows.last, 0);
        var _self = this;
        this.bgTokenizer.getState(this.getCursorPosition().row, function(state) {
            var addedColumns = _self.mode.toggleCommentLines(state, _self.doc, range);
            _self.selection.shiftSelection(addedColumns);
        });
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

    this.onCompositionStart = function(text) {
        this.renderer.showComposition(this.getCursorPosition());
        //this.onTextInput(text);
    };

    this.onCompositionUpdate = function(text) {
        this.renderer.setCompositionText(text);
    };

    this.onCompositionEnd = function() {
        this.renderer.hideComposition();
        //this.removeLeft();
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

    this.gotoPageDown = function() {
        var row     = this.getPageDownRow(),
            column  = Math.min(this.getCursorPosition().column,
                               this.doc.getLine(row).length);
                          
        this.scrollToRow(row);
        this.getSelection().moveCursorTo(row, column);
    };

    this.gotoPageUp = function() {
       var  row     = this.getPageUpRow(),
            column  = Math.min(this.getCursorPosition().column,
                               this.doc.getLine(row).length);
               
       this.scrollToRow(row);
       this.getSelection().moveCursorTo(row, column);
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
        this.$updateDesiredColumn();
    };

    this.moveCursorTo = function(row, column) {
        this.selection.moveCursorTo(row, column);
        this.$updateDesiredColumn();
    };

    this.moveCursorToPosition = function(pos) {
        this.selection.moveCursorToPosition(pos);
        this.$updateDesiredColumn();
    };


    this.gotoLine = function(lineNumber, row) {
        this.selection.clearSelection();
        
        this.$blockScrolling = true;
        this.moveCursorTo(lineNumber-1, row || 0);
        this.$blockScrolling = false;

        if (!this.isRowVisible(this.getCursorPosition().row)) {
            this.scrollToRow(lineNumber - 1 - Math.floor(this.getVisibleRowCount() / 2));
        }
    },

    this.navigateTo = function(row, column) {
        this.clearSelection();
        this.moveCursorTo(row, column);
        this.$updateDesiredColumn(column);
    };

    this.navigateUp = function() {
        this.selection.clearSelection();
        this.selection.moveCursorBy(-1, 0);

        if (this.$desiredColumn) {
            var cursor = this.getCursorPosition();
            var column = this.doc.screenToDocumentColumn(cursor.row, this.$desiredColumn);
            this.selection.moveCursorTo(cursor.row, column);
        }
    };

    this.navigateDown = function() {
        this.selection.clearSelection();
        this.selection.moveCursorBy(1, 0);

        if (this.$desiredColumn) {
            var cursor = this.getCursorPosition();
            var column = this.doc.screenToDocumentColumn(cursor.row, this.$desiredColumn);
            this.selection.moveCursorTo(cursor.row, column);
        }
    };

    this.$updateDesiredColumn = function() {
        var cursor = this.getCursorPosition();
        this.$desiredColumn = this.doc.documentToScreenColumn(cursor.row, cursor.column);
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
        this.selection.moveCursorLineStart();
        this.clearSelection();
    };

    this.navigateLineEnd = function() {
        this.selection.moveCursorLineEnd();
        this.clearSelection();
    };

    this.navigateFileEnd = function() {
        this.selection.moveCursorFileEnd();
        this.clearSelection();
    };

    this.navigateFileStart = function() {
        this.selection.moveCursorFileStart();
        this.clearSelection();
    };

    this.navigateWordRight = function() {
        this.selection.moveCursorWordRight();
        this.clearSelection();
    };

    this.navigateWordLeft = function() {
        this.selection.moveCursorWordLeft();
        this.clearSelection();
    };

    this.replace = function(replacement, options) {
        if (options)
            this.$search.set(options);
        
        var range = this.$search.find(this.doc);
        this.$tryReplace(range, replacement);
        if (range !== null)
            this.selection.setSelectionRange(range);
        this.$updateDesiredColumn();
    },

    this.replaceAll = function(replacement, options) {
        if (options) {
            this.$search.set(options);
        }
        this.clearSelection();
        this.selection.moveCursorTo(0, 0);

        var ranges = this.$search.findAll(this.doc);
        if (!ranges.length)
            return;

        for (var i = ranges.length - 1; i >= 0; --i)
            this.$tryReplace(ranges[i], replacement);
        if (ranges[0] !== null)
            this.selection.setSelectionRange(ranges[0]);
        this.$updateDesiredColumn();
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

    this.getLastSearchOptions = function() {
        return this.$search.getOptions();
    };

    this.find = function(needle, options) {
        this.clearSelection();
        options = options || {};
        options.needle = needle;
        this.$search.set(options);
        this.$find();
    },

    this.findNext = function(options) {
        options = options || {};
        if (typeof options.backwards == "undefined")
            options.backwards = false;
        this.$search.set(options);
        this.$find();
    };

    this.findPrevious = function(options) {
        options = options || {};
        if (typeof options.backwards == "undefined")
            options.backwards = true;
        this.$search.set(options);
        this.$find();
    };

    this.$find = function(backwards) {
        if (!this.selection.isEmpty()) {
            this.$search.set({needle: this.doc.getTextRange(this.getSelectionRange())});
        }

        if (typeof backwards != "undefined")
            this.$search.set({backwards: backwards});

        var range = this.$search.find(this.doc);
        if (range) {
            this.gotoLine(range.end.row+1, range.end.column);
            this.$updateDesiredColumn();
            this.selection.setSelectionRange(range);
        }
    };

    this.undo = function() {
        this.doc.getUndoManager().undo();
    };

    this.redo = function() {
        this.doc.getUndoManager().redo();
    };

}).call(Editor.prototype);


return Editor;
});
