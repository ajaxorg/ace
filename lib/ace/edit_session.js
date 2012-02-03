/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
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
 *      Mihai Sucan <mihai DOT sucan AT gmail DOT com>
 *      Julian Viereck <julian DOT viereck AT gmail DOT com>
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
"use strict";

var oop = require("./lib/oop");
var lang = require("./lib/lang");
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var Selection = require("./selection").Selection;
var TextMode = require("./mode/text").Mode;
var Range = require("./range").Range;
var Document = require("./document").Document;
var BackgroundTokenizer = require("./background_tokenizer").BackgroundTokenizer;

/**
 * class Edit_Session
 *
 * Some sessions stuff.
 *
 **/

/**
 * new Edit_Session(text, mode)
 * - text (String): Some text
 * - mode (Boolean): A boolean
 *
 * TODO
 *
 **/

var EditSession = function(text, mode) {
    this.$modified = true;
    this.$breakpoints = [];
    this.$frontMarkers = {};
    this.$backMarkers = {};
    this.$markerId = 1;
    this.$rowCache = [];
    this.$wrapData = [];
    this.$foldData = [];
    this.$undoSelect = true;
    this.$foldData.toString = function() {
        var str = "";
        this.forEach(function(foldLine) {
            str += "\n" + foldLine.toString();
        });
        return str;
    }

    if (text instanceof Document) {
        this.setDocument(text);
    } else {
        this.setDocument(new Document(text));
    }

    this.selection = new Selection(this);
    if (mode)
        this.setMode(mode);
    else
        this.setMode(new TextMode());
};


(function() {

    oop.implement(this, EventEmitter);

    /**
     * Edit_Session.setDocument(doc) -> Void
     * - doc (Document): Some text
     *
     * TODO Does some stuff.
     *
     **/
	this.setDocument = function(doc) {
        if (this.doc)
            throw new Error("Document is already set");

        this.doc = doc;
        doc.on("change", this.onChange.bind(this));
        this.on("changeFold", this.onChangeFold.bind(this));

        if (this.bgTokenizer) {
            this.bgTokenizer.setDocument(this.getDocument());
            this.bgTokenizer.start(0);
        }
    };

    /**
     * Edit_Session.getDocument() -> Document
     *
     * Returns the `Document` associated with this session. 
     *
     **/
	this.getDocument = function() {
        return this.doc;
    };

    /**
     * Edit_Session.$resetRowCache(row) -> Void
     * - row (Number): The row to work with
     *
     * TODO Does some stuff.
     *
     **/
	this.$resetRowCache = function(row) {
        if (row == 0) {
            this.$rowCache = [];
            return;
        }
        var rowCache = this.$rowCache;
        for (var i = 0; i < rowCache.length; i++) {
            if (rowCache[i].docRow >= row) {
                rowCache.splice(i, rowCache.length);
                return;
            }
        }
    };

    /**
	* Edit_Session@onChangeFold(e)
	* 
	* 
    * This event triggers when code folds change their state. TODO
    *
	**/
	this.onChangeFold = function(e) {
        var fold = e.data;
        this.$resetRowCache(fold.start.row);
    };

    /**
	* Edit_Session@onChange(e)
	* 
	* This changes TODO
	**/
	this.onChange = function(e) {
        var delta = e.data;
        this.$modified = true;

        this.$resetRowCache(delta.range.start.row);

        var removedFolds = this.$updateInternalDataOnChange(e);
        if (!this.$fromUndo && this.$undoManager && !delta.ignore) {
            this.$deltasDoc.push(delta);
            if (removedFolds && removedFolds.length != 0) {
                this.$deltasFold.push({
                    action: "removeFolds",
                    folds:  removedFolds
                });
            }

            this.$informUndoManager.schedule();
        }

        this.bgTokenizer.start(delta.range.start.row);
        this._emit("change", e);
    };

    /**
	* Edit_Session.setValue(text) -> Void
	* - text (String): The new text to place
    *
    * Sets the session text.
	*
	**/
	this.setValue = function(text) {
        this.doc.setValue(text);
        this.selection.moveCursorTo(0, 0);
        this.selection.clearSelection();

        this.$resetRowCache(0);
        this.$deltas = [];
        this.$deltasDoc = [];
        this.$deltasFold = [];
        this.getUndoManager().reset();
    };

    this.getValue =
    /**
	* Edit_Session.toString() -> String
	* 
	* Returns the current [[Document `Document`]] as a string. 
    *
	**/
	this.toString = function() {
        return this.doc.getValue();
    };

    /**
	* Edit_Session.getSelection() -> String
	* 
	* Returns the string of the current selection.
	**/
	this.getSelection = function() {
        return this.selection;
    };

    /** related to: BackgroundTokenizer.getState
	 * Edit_Session.getState(row) -> Array
     * - row (Number): The row to start at
     *
     * Retrieves the state of tokenization for a row. Returns the tokenized row. TODO
     *
     **/
	this.getState = function(row) {
        return this.bgTokenizer.getState(row);
    };

    /** related to: BackgroundTokenizer.getTokens
	* Edit_Session.getTokens(firstRow, lastRow) -> Array
     * - firstRow (Number): The row to start at
     * - lastRow (Number): The row to finish at
     *
     * Starts tokenizing at the row indicated. Returns a list of objects of the tokenized rows.
     *
     **/
	this.getTokens = function(firstRow, lastRow) {
        return this.bgTokenizer.getTokens(firstRow, lastRow);
    };

    /**
	* Edit_Session.getTokenAt(row, column) -> Array
	* - row (Number): The row number to retrieve from
    * - column (Number): The column number to retrieve from
    *
	* Returns an array of tokens at the indicated row and column.
	**/
	this.getTokenAt = function(row, column) {
        var tokens = this.bgTokenizer.getTokens(row, row)[0].tokens;
        var token, c = 0;
        if (column == null) {
            i = tokens.length - 1;
            c = this.getLine(row).length;
        } else {
            for (var i = 0; i < tokens.length; i++) {
                c += tokens[i].value.length;
                if (c >= column)
                    break;
            }
        }
        token = tokens[i];
        if (!token)
            return null;
        token.index = i;
        token.start = c - token.value.length;
        return token;
    };

    /**
	* Edit_Session.setUndoManager(undoManager) -> Void
	* - undoManager (UndoManager): The new undo manager
	* 
    * Sets the undo manager.
	**/
	this.setUndoManager = function(undoManager) {
        this.$undoManager = undoManager;
        this.$resetRowCache(0);
        this.$deltas = [];
        this.$deltasDoc = [];
        this.$deltasFold = [];

        if (this.$informUndoManager)
            this.$informUndoManager.cancel();

        if (undoManager) {
            var self = this;
    /**
	* Edit_Session.$syncInformUndoManager() -> Void
	* 
	* TODO
	**/
	this.$syncInformUndoManager = function() {
                self.$informUndoManager.cancel();

                if (self.$deltasFold.length) {
                    self.$deltas.push({
                        group: "fold",
                        deltas: self.$deltasFold
                    });
                    self.$deltasFold = [];
                }

                if (self.$deltasDoc.length) {
                    self.$deltas.push({
                        group: "doc",
                        deltas: self.$deltasDoc
                    });
                    self.$deltasDoc = [];
                }

                if (self.$deltas.length > 0) {
                    undoManager.execute({
                        action: "aceupdate",
                        args: [self.$deltas, self]
                    });
                }

                self.$deltas = [];
            }
            this.$informUndoManager =
                lang.deferredCall(this.$syncInformUndoManager);
        }
    };

    this.$defaultUndoManager = {
        undo: function() {},
        redo: function() {},
        reset: function() {}
    };

    /**
	* Edit_Session.getUndoManager() -> UndoManager
	* 
	* Returns the current undo manager.
	**/
	this.getUndoManager = function() {
        return this.$undoManager || this.$defaultUndoManager;
    },

    /**
	* Edit_Session.getTabString() -> String
	* 
	* Returns the current value for tabs. If the user is using soft tabs, this will be a series of spaces (defined by [[getTabSize `getTabSize()`]]); otherwise it's simply `'\t'`.
	**/
	this.getTabString = function() {
        if (this.getUseSoftTabs()) {
            return lang.stringRepeat(" ", this.getTabSize());
        } else {
            return "\t";
        }
    };

    this.$useSoftTabs = true;
    /**
	* Edit_Session.setUseSoftTabs(useSoftTabs) -> Void
	* - useSoftTabs (Boolean): Value indicating whether or not to use soft tabs
	* 
    * Pass `true` to enable the use of soft tabs. Soft tabs means you're using spaces instead of the tab character (`'\t'`).
    *
	**/
	this.setUseSoftTabs = function(useSoftTabs) {
        if (this.$useSoftTabs === useSoftTabs) return;

        this.$useSoftTabs = useSoftTabs;
    };

    /**
	* Edit_Session.getUseSoftTabs() -> Boolean
	* 
	* Returns `true` if soft tabs are being used, `false` otherwise.
    *
	**/
	this.getUseSoftTabs = function() {
        return this.$useSoftTabs;
    };

    this.$tabSize = 4;
    /**
	* Edit_Session.setTabSize(tabSize) -> Void
	* - tabSize (Number): The new tab size
	* 
    * Set the number of spaces that define a soft tab; for example, passing in `4` transforms the soft tabs to be equivalent to four spaces. This function also emits the `changeTabSize` event.
	**/
	this.setTabSize = function(tabSize) {
        if (isNaN(tabSize) || this.$tabSize === tabSize) return;

        this.$modified = true;
        this.$tabSize = tabSize;
        this._emit("changeTabSize");
    };

    /**
	* Edit_Session.getTabSize() -> Number
	* 
	* Returns the current tab size.
	**/
	this.getTabSize = function() {
        return this.$tabSize;
    };

    /**
	* Edit_Session.isTabStop(position) -> Boolean
	* - position (Number): The position to check
	* 
    * Returns `true` if the character at the position is a soft tab. TODO
	**/
	this.isTabStop = function(position) {
        return this.$useSoftTabs && (position.column % this.$tabSize == 0);
    };

    this.$overwrite = false;
    /**
	* Edit_Session.setOverwrite(overwrite) -> Void
	* - overwrite (Boolean): Defines wheter or not to set overwrites
	* 
    * Pass in `true` to enable overwrites in your session, or `false` to disable. If overwrites is enabled, any text you enter will type over any text after it. If the value of `overwrite` changes, this function also emites the `changeOverwrite` event.
    *
	**/
	this.setOverwrite = function(overwrite) {
        if (this.$overwrite == overwrite) return;

        this.$overwrite = overwrite;
        this._emit("changeOverwrite");
    };

    /**
	* Edit_Session.getOverwrite() -> Boolean
	* 
	* Returns `true` if overwrites are enabled; `false` otherwise.
	**/
	this.getOverwrite = function() {
        return this.$overwrite;
    };

    /**
	* Edit_Session.toggleOverwrite() -> Void
	* 
	* Sets the value of overwrite to the opposite of whatever it currently is.
	**/
	this.toggleOverwrite = function() {
        this.setOverwrite(!this.$overwrite);
    };

    /**
	* Edit_Session.getBreakpoints() -> Array
	* 
	* Returns an array of numbers, indicating which rows have breakpoints.
	**/
	this.getBreakpoints = function() {
        return this.$breakpoints;
    };

    /**
	* Edit_Session.setBreakpoints(rows) -> Void
	* - rows (Array): An array of row indicies
	* 
    * Sets a breakpoint on every row number given by `rows`. This function also emites the `'changeBreakpoint'` event.
    *
	**/
	this.setBreakpoints = function(rows) {
        this.$breakpoints = [];
        for (var i=0; i<rows.length; i++) {
            this.$breakpoints[rows[i]] = true;
        }
        this._emit("changeBreakpoint", {});
    };

    /**
	* Edit_Session.clearBreakpoints() -> Void
	* 
	* Removes all breakpoints on the rows. This function also emites the `'changeBreakpoint'` event.
	**/
	this.clearBreakpoints = function() {
        this.$breakpoints = [];
        this._emit("changeBreakpoint", {});
    };

    /**
	* Edit_Session.setBreakpoint(row) -> Void
	* - row (Number): A row index
	* 
    * Sets a breakpoint on the row number given by `rows`. This function also emites the `'changeBreakpoint'` event.
	**/
	this.setBreakpoint = function(row) {
        this.$breakpoints[row] = true;
        this._emit("changeBreakpoint", {});
    };

    /**
	* Edit_Session.clearBreakpoint(row) -> Void
	* - row (Number): A row index
	* 
    * Removes a breakpoint on the row number given by `rows`. This function also emites the `'changeBreakpoint'` event.
	**/
	this.clearBreakpoint = function(row) {
        delete this.$breakpoints[row];
        this._emit("changeBreakpoint", {});
    };

    /**
	* Edit_Session.addMarker(range, clazz, type, inFront) -> Number
	* - range (Range):
    * - clazz (String): 
    * - type (String):
    * - inFront (Boolean):
    *
	* TODO
	**/
	this.addMarker = function(range, clazz, type, inFront) {
        var id = this.$markerId++;

        var marker = {
            range : range,
            type : type || "line",
            renderer: typeof type == "function" ? type : null,
            clazz : clazz,
            inFront: !!inFront
        }

        if (inFront) {
            this.$frontMarkers[id] = marker;
            this._emit("changeFrontMarker")
        } else {
            this.$backMarkers[id] = marker;
            this._emit("changeBackMarker")
        }

        return id;
    };

    /**
	* Edit_Session.removeMarker(markerId) -> Void
	* - markerId (Number): A number representing a marker
    *
    * Removes the marker with the specified ID. If this marker was in front, the `'changeFrontMarker'` event is emitted. If the marker was in the back, the `'changeBackMarker'` event is emitted.
	* 
	**/
	this.removeMarker = function(markerId) {
        var marker = this.$frontMarkers[markerId] || this.$backMarkers[markerId];
        if (!marker)
            return;

        var markers = marker.inFront ? this.$frontMarkers : this.$backMarkers;
        if (marker) {
            delete (markers[markerId]);
            this._emit(marker.inFront ? "changeFrontMarker" : "changeBackMarker");
        }
    };

    /**
	* Edit_Session.getMarkers(inFront) -> Array
	* - inFront (Boolean): If `true`, indicates you only want front markers; `false` indicates only back markers
    *
    * Returns an array containing the IDs of all the markers, either front or back.
	* 
	**/
	this.getMarkers = function(inFront) {
        return inFront ? this.$frontMarkers : this.$backMarkers;
    };

    /*
     * Error:
     *  {
     *    row: 12,
     *    column: 2, //can be undefined
     *    text: "Missing argument",
     *    type: "error" // or "warning" or "info"
     *  }
     */
    /**
	* Edit_Session.setAnnotations(annotations) -> Void
	* - annotations (Array): 
    *
	* This functions emits the `'changeAnnotation'` event. TODO
	**/
	this.setAnnotations = function(annotations) {
        this.$annotations = {};
        for (var i=0; i<annotations.length; i++) {
            var annotation = annotations[i];
            var row = annotation.row;
            if (this.$annotations[row])
                this.$annotations[row].push(annotation);
            else
                this.$annotations[row] = [annotation];
        }
        this._emit("changeAnnotation", {});
    };

    /**
	* Edit_Session.getAnnotations() -> Array
	* 
	* TODO
	**/
	this.getAnnotations = function() {
        return this.$annotations || {};
    };

    /**
	* Edit_Session.clearAnnotations() -> Void
	* 
	* Clears all the annotations for this session. This function also triggers the `'changeAnnotation'` event.
	**/
	this.clearAnnotations = function() {
        this.$annotations = {};
        this._emit("changeAnnotation", {});
    };

    /**
	* Edit_Session.$detectNewLine(text) -> Void
	* - text (String): A block of text
	* 
    * If `text` contains either the newline (`\n`) or carriage-return ('\r') characters, [[autoNewLine `autoNewLine`]] stores that value. TODO
    *
	**/
	this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r?\n)/m);
        if (match) {
            this.$autoNewLine = match[1];
        } else {
            this.$autoNewLine = "\n";
        }
    };

    /**
	* Edit_Session.getWordRange(row, column) -> Range
	* - row (Number): The row to check
    * - column (Number): The column to check
    *
	* TODO
	**/
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

    /**
	* Edit_Session.getAWordRange(row, column) -> Range
	* - row (Number): The row number to start from
    * - column (Number): The column number to start from
	* 
    * Gets the range of a word, including its right whitespace.
	**/
	this.getAWordRange = function(row, column) {
        var wordRange = this.getWordRange(row, column);
        var line = this.getLine(wordRange.end.row);

        while (line.charAt(wordRange.end.column).match(/[ \t]/)) {
            wordRange.end.column += 1;
        }
        return wordRange;
    };

    /**
	* Edit_Session.setNewLineMode(newLineMode) -> Void
	* - newLineMode (String):
    *
	* TODO
	**/
	this.setNewLineMode = function(newLineMode) {
        this.doc.setNewLineMode(newLineMode);
    };

    /**
	* Edit_Session.getNewLineMode() -> String
	* 
	* TODO Returns the current new line mode.
	**/
	this.getNewLineMode = function() {
        return this.doc.getNewLineMode();
    };

    this.$useWorker = true;
    /**
	* Edit_Session.setUseWorker(useWorker) -> Void
	* 
	* TODO
	**/
	this.setUseWorker = function(useWorker) {
        if (this.$useWorker == useWorker)
            return;

        this.$useWorker = useWorker;

        this.$stopWorker();
        if (useWorker)
            this.$startWorker();
    };

    /**
	* Edit_Session.getUseWorker() -> Boolean
	* 
	* TODO
	**/
	this.getUseWorker = function() {
        return this.$useWorker;
    };

    /**
	* Edit_Session@onReloadTokenizer(e) -> Void
	* 
	* Reloads all the tokens on the current session. This function calls [[BackgroundTokenizer.start `BackgroundTokenizer.start ()`]] to all the rows; it also emits the `'tokenizerUpdate'` event.
	**/
	this.onReloadTokenizer = function(e) {
        var rows = e.data;
        this.bgTokenizer.start(rows.first);
        this._emit("tokenizerUpdate", e);
    };

    this.$mode = null;
    /**
	* Edit_Session.setMode(mode) -> Void
	* 
	* TODO
	**/
	this.setMode = function(mode) {
        if (this.$mode === mode) return;
        this.$mode = mode;

        this.$stopWorker();

        if (this.$useWorker)
            this.$startWorker();

        var tokenizer = mode.getTokenizer();

        if(tokenizer.addEventListener !== undefined) {
            var onReloadTokenizer = this.onReloadTokenizer.bind(this);
            tokenizer.addEventListener("update", onReloadTokenizer);
        }

        if (!this.bgTokenizer) {
            this.bgTokenizer = new BackgroundTokenizer(tokenizer);
            var _self = this;
            this.bgTokenizer.addEventListener("update", function(e) {
                _self._emit("tokenizerUpdate", e);
            });
        } else {
            this.bgTokenizer.setTokenizer(tokenizer);
        }

        this.bgTokenizer.setDocument(this.getDocument());
        this.bgTokenizer.start(0);

        this.tokenRe = mode.tokenRe;
        this.nonTokenRe = mode.nonTokenRe;

        this.$setFolding(mode.foldingRules);

        this._emit("changeMode");
    };

	this.$stopWorker = function() {
        if (this.$worker)
            this.$worker.terminate();

        this.$worker = null;
    };

	this.$startWorker = function() {
        if (typeof Worker !== "undefined" && !require.noWorker) {
            try {
                this.$worker = this.$mode.createWorker(this);
            } catch (e) {
                console.log("Could not load worker");
                console.log(e);
                this.$worker = null;
            }
        }
        else
            this.$worker = null;
    };

    /**
	* Edit_Session.getMode() -> String
	* 
	* TODO Returns the current mode.
	**/
	this.getMode = function() {
        return this.$mode;
    };
    
    this.$scrollTop = 0;
    /**
	* Edit_Session.setScrollTop(scrollTop) -> Void
	* 
	* This function also emits the `'changeScrollTop'` event. TODO
	**/
	this.setScrollTop = function(scrollTop) {
        scrollTop = Math.round(Math.max(0, scrollTop));
        if (this.$scrollTop === scrollTop)
            return;

        this.$scrollTop = scrollTop;
        this._emit("changeScrollTop", scrollTop);
    };

    /**
	* Edit_Session.getScrollTop() -> Number
	* 
	* [Returns the value of the distance between the top of the editor and the topmost part of the visible content.](~EditSession.getScrollTop)
	**/
	this.getScrollTop = function() {
        return this.$scrollTop;
    };
    
    this.$scrollLeft = 0;
    /**
	* Edit_Session.setScrollLeft(scrollLeft) -> Void
	* 
	* [Sets the value of the distance between the left of the editor and the leftmost part of the visible content.](~EditSession.setScrollLeft)
	**/
	this.setScrollLeft = function(scrollLeft) {
        scrollLeft = Math.round(Math.max(0, scrollLeft));
        if (this.$scrollLeft === scrollLeft)
            return;

        this.$scrollLeft = scrollLeft;
        this._emit("changeScrollLeft", scrollLeft);
    };

    /**
	* Edit_Session.getScrollLeft() -> Number
	* 
	* [Returns the value of the distance between the left of the editor and the leftmost part of the visible content.](~EditSession.getScrollLeft)
	**/
	this.getScrollLeft = function() {
        return this.$scrollLeft;
    };

    /**
	* Edit_Session.getWidth() -> Number
	* 
	* Returns the width of the document.
	**/
	this.getWidth = function() {
        this.$computeWidth();
        return this.width;
    };

    /**
	* Edit_Session.getScreenWidth() -> Number
	* 
	* Returns the width of the screen.
	**/
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

            for ( var i = 0; i < lines.length; i++) {
                var foldLine = this.getFoldLine(i),
                    line, len;

                line = lines[i];
                if (foldLine) {
                    var end = foldLine.range.end;
                    line = this.getFoldDisplayLine(foldLine);
                    // Continue after the foldLine.end.row. All the lines in
                    // between are folded.
                    i = end.row;
                }
                len = line.length;
                longestLine = Math.max(longestLine, len);
                if (!this.$useWrapMode) {
                    longestScreenLine = Math.max(
                        longestScreenLine,
                        this.$getStringScreenWidth(line)[0]
                    );
                }
            }
            this.width = longestLine;

            if (this.$useWrapMode) {
                this.screenWidth = this.$wrapLimit;
            } else {
                this.screenWidth = longestScreenLine;
            }
        }
    };

    /** related to: Document.getLine
	* Edit_Session.getLine(row) -> String
	* - row (Number): The row to retrieve from
	* 
    * Returns a verbatim copy of the given line as it is in the document
    *
	**/
	this.getLine = function(row) {
        return this.doc.getLine(row);
    };

    /** related to: Document.getLines
	* Edit_Session.getLines(firstRow, lastRow) -> Array
    * - firstRow (Number): The first row index to retrieve
    * - lastRow (Number): The final row index to retrieve
    * 
    * Returns an array of strings of the rows between `firstRow` and `lastRow`. This function is inclusive of `lastRow`.
    *
    **/
	this.getLines = function(firstRow, lastRow) {
        return this.doc.getLines(firstRow, lastRow);
    };

    /** related to: Document.getLength
	* Edit_Session.getLength()-> Number
    * 
    * Returns the number of rows in the document.
    **/
	this.getLength = function() {
        return this.doc.getLength();
    };

    /** related to: Document.getTextRange
	* Edit_Session.getTextRange(range) -> Array
    * - range (String): blah
    * 
    * TODO
    **/
	this.getTextRange = function(range) {
        return this.doc.getTextRange(range);
    };

    /** related to: Document.insert
	* Edit_Session.insert(position, text) -> Number
    * - position (Number): The position to start inserting at 
    * - text (String): A chunk of text to insert
    * 
    * Inserts a block of `text` and the indicated `position`.
    *
    * #### Returns
    *
    * Returns the position of the last line of `text`. If the length of `text` is 0, this function simply returns `position`. 
    * 
    **/
	this.insert = function(position, text) {
        return this.doc.insert(position, text);
    };

    /** related to: Document.remove
	* Edit_Session.remove(range) -> Object
    * - range (Range): A specified Range to remove
    * 
    * Removes the `range` from the document.
    *
    * #### Returns
    *
    * Returns the new `start` property of the range, which contains `startRow` and `startColumn`. If `range` is empty, this function returns the unmodified value of `range.start`.
    **/
	this.remove = function(range) {
        return this.doc.remove(range);
    };

    /**
	* Edit_Session.undoChanges(deltas, dontSelect) -> Range
	* - deltas (Array):
    * - dontSelect (Boolean):
    *
	* TODO
	**/
	this.undoChanges = function(deltas, dontSelect) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        var lastUndoRange = null;
        for (var i = deltas.length - 1; i != -1; i--) {
            var delta = deltas[i];
            if (delta.group == "doc") {
                this.doc.revertDeltas(delta.deltas);
                lastUndoRange =
                    this.$getUndoSelection(delta.deltas, true, lastUndoRange);
            } else {
                delta.deltas.forEach(function(foldDelta) {
                    this.addFolds(foldDelta.folds);
                }, this);
            }
        }
        this.$fromUndo = false;
        lastUndoRange &&
            this.$undoSelect &&
            !dontSelect &&
            this.selection.setSelectionRange(lastUndoRange);
        return lastUndoRange;
    };

    /**
	* Edit_Session.redoChanges(deltas, dontSelect) -> Range
	* - deltas (Array):
    * - dontSelect (Boolean):
    *
	* TODO
	**/
	this.redoChanges = function(deltas, dontSelect) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        var lastUndoRange = null;
        for (var i = 0; i < deltas.length; i++) {
            var delta = deltas[i];
            if (delta.group == "doc") {
                this.doc.applyDeltas(delta.deltas);
                lastUndoRange =
                    this.$getUndoSelection(delta.deltas, false, lastUndoRange);
            }
        }
        this.$fromUndo = false;
        lastUndoRange &&
            this.$undoSelect &&
            !dontSelect &&
            this.selection.setSelectionRange(lastUndoRange);
        return lastUndoRange;
    };
    
    /**
	* Edit_Session.setUndoSelect(enable) -> Void
	* - enable (Boolean): 
    *
	* TODO
	**/
	this.setUndoSelect = function(enable) {
        this.$undoSelect = enable;
    };

    /**
	* Edit_Session.$getUndoSelection(deltas, isUndo, lastUndoRange) -> Range
	* 
	* TODO
	**/
	this.$getUndoSelection = function(deltas, isUndo, lastUndoRange) {
        function isInsert(delta) {
            var insert =
                delta.action == "insertText" || delta.action == "insertLines";
            return isUndo ? !insert : insert;
        }

        var delta = deltas[0];
        var range, point;
        var lastDeltaIsInsert = false;
        if (isInsert(delta)) {
            range = delta.range.clone();
            lastDeltaIsInsert = true;
        } else {
            range = Range.fromPoints(delta.range.start, delta.range.start);
            lastDeltaIsInsert = false;
        }

        for (var i = 1; i < deltas.length; i++) {
            delta = deltas[i];
            if (isInsert(delta)) {
                point = delta.range.start;
                if (range.compare(point.row, point.column) == -1) {
                    range.setStart(delta.range.start);
                }
                point = delta.range.end;
                if (range.compare(point.row, point.column) == 1) {
                    range.setEnd(delta.range.end);
                }
                lastDeltaIsInsert = true;
            } else {
                point = delta.range.start;
                if (range.compare(point.row, point.column) == -1) {
                    range =
                        Range.fromPoints(delta.range.start, delta.range.start);
                }
                lastDeltaIsInsert = false;
            }
        }

        // Check if this range and the last undo range has something in common.
        // If true, merge the ranges.
        if (lastUndoRange != null) {
            var cmp = lastUndoRange.compareRange(range);
            if (cmp == 1) {
                range.setStart(lastUndoRange.start);
            } else if (cmp == -1) {
                range.setEnd(lastUndoRange.end);
            }
        }

        return range;
    },

    /** related to: Document.replace
	* Edit_Session.replace(range, text) -> Object
    * - range (Range): A specified Range to replace
    * - text (String): The new text to use as a replacement
    *
    * Replaces a range in the document with the new `text`.
    *
    * #### Returns
    *
    * Returns an object containing the final row and column, like this:
    *
    *     {row: endRow, column: 0}
    *
    * If the text and range are empty, this function returns an object containing the current `range.start` value.
    *
    * If the text is the exact same as what currently exists, this function returns an object containing the current `range.end` value.
    *
    **/
	this.replace = function(range, text) {
        return this.doc.replace(range, text);
    };

    /**
	* Edit_Session.moveText(fromRange, toPosition) -> Range
	* - fromRange (Range): The range of text you want moved within the document
    * - toPosition (Object): The location (row and column) where you want to move the text to
    *
    * Moves a range of text from the given range to the given position. `toPosition` is an object that looks like this:
    *
    *    { row: newRowLocation, column: newColumnLocation }
	* 
    *
    * #### Returns
    *
    * The new range where the text was moved to.
    *
	**/
	this.moveText = function(fromRange, toPosition) {
        var text = this.getTextRange(fromRange);
        this.remove(fromRange);

        var toRow = toPosition.row;
        var toColumn = toPosition.column;

        // Make sure to update the insert location, when text is removed in
        // front of the chosen point of insertion.
        if (!fromRange.isMultiLine() && fromRange.start.row == toRow &&
            fromRange.end.column < toColumn)
            toColumn -= text.length;

        if (fromRange.isMultiLine() && fromRange.end.row < toRow) {
            var lines = this.doc.$split(text);
            toRow -= lines.length - 1;
        }

        var endRow = toRow + fromRange.end.row - fromRange.start.row;
        var endColumn = fromRange.isMultiLine() ?
                        fromRange.end.column :
                        toColumn + fromRange.end.column - fromRange.start.column;

        var toRange = new Range(toRow, toColumn, endRow, endColumn);

        this.insert(toRange.start, text);

        return toRange;
    };

    /**
	* Edit_Session.indentRows(startRow, endRow, indentString) -> Void
	* - startRow (Number): Starting row
    * - endRow (Number): Ending row
    * - indentString (String): The indent token
    * 
	* Indents all the rows, from `startRow` to `endRow` (inclusive), by prefixing each row with the token in `indentString`.
    *
    * If `indentString` contains the `'\t'` character, it's replaced by whatever is defined by [[getTabString `getTabString()`]].
    *
	**/
	this.indentRows = function(startRow, endRow, indentString) {
        indentString = indentString.replace(/\t/g, this.getTabString());
        for (var row=startRow; row<=endRow; row++)
            this.insert({row: row, column:0}, indentString);
    };

    /**
    * Edit_Session.outdentRows(range) -> Void
    * - range (Range): A range of rows
    * 
    * Outdents all the rows defined by the `start` and `end` properties of `range`.
    *
    **/
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
            this.remove(deleteRange);
        }
    };

    /** related to: Document.insertLines
	* Edit_Session.moveLinesUp(firstRow, lastRow) -> Number
	* - firstRow (Number): The starting row to move up
    * - lastRow (Number): The final row to move up
	* 
    * Shifts all the lines in the document up one, starting from `firstRow` and ending at `lastRow`.
    *
    * #### Returns
    *
    * If `firstRow` is less-than or equal to 0, this function returns 0. Otherwise, on success, it returns -1.
    *
	**/
	this.moveLinesUp = function(firstRow, lastRow) {
        if (firstRow <= 0) return 0;

        var removed = this.doc.removeLines(firstRow, lastRow);
        this.doc.insertLines(firstRow - 1, removed);
        return -1;
    };

    /** related to: Document.insertLines
	* Edit_Session.moveLinesDown(firstRow, lastRow) -> Number
    * - firstRow (Number): The starting row to move down
    * - lastRow (Number): The final row to move down
    * 
    * Shifts all the lines in the document down one, starting from `firstRow` and ending at `lastRow`.
    *
    * #### Returns
    *
    * If `firstRow` is less-than or equal to 0, this function returns 0. Otherwise, on success, it returns -1.
    *
    **/
	this.moveLinesDown = function(firstRow, lastRow) {
        if (lastRow >= this.doc.getLength()-1) return 0;

        var removed = this.doc.removeLines(firstRow, lastRow);
        this.doc.insertLines(firstRow+1, removed);
        return 1;
    };

    /**
	* Edit_Session.duplicateLines(firstRow, lastRow) -> Number
    * - firstRow (Number): The starting row to duplicate
    * - lastRow (Number): The final row to duplicate
	* 
    * Duplicates all the text between `firstRow` and `lastRow`.
    *
    * #### Returns
    *
    * Returns the number of new rows added; in other words, `lastRow - firstRow + 1`.
    *
	**/
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

	this.$clipColumnToRow = function(row, column) {
        if (column < 0)
            return 0;
        return Math.min(this.doc.getLine(row).length, column);
    };


	this.$clipPositionToDocument = function(row, column) {
        column = Math.max(0, column);

        if (row < 0) {
            row = 0;
            column = 0;
        } else {
            var len = this.doc.getLength();
            if (row >= len) {
                row = len - 1;
                column = this.doc.getLine(len-1).length;
            } else {
                column = Math.min(this.doc.getLine(row).length, column);
            }
        }

        return {
            row: row,
            column: column
        };
    };

	this.$clipRangeToDocument = function(range) {
        if (range.start.row < 0) {
            range.start.row = 0;
            range.start.column = 0
        } else {
            range.start.column = this.$clipColumnToRow(
                range.start.row,
                range.start.column
            );
        }
        
        var len = this.doc.getLength() - 1;
        if (range.end.row > len) {
            range.end.row = len;
            range.end.column = this.doc.getLine(len).length;
        } else {
            range.end.column = this.$clipColumnToRow(
                range.end.row,
                range.end.column
            );
        }
        return range;
    };

    // WRAPMODE
    this.$wrapLimit = 80;
    this.$useWrapMode = false;
    this.$wrapLimitRange = {
        min : null,
        max : null
    };

    /**
	* Edit_Session.setUseWrapMode(useWrapMode) -> Void
	* 
	* TODO line wrapping ?
	**/
	this.setUseWrapMode = function(useWrapMode) {
        if (useWrapMode != this.$useWrapMode) {
            this.$useWrapMode = useWrapMode;
            this.$modified = true;
            this.$resetRowCache(0);

            // If wrapMode is activaed, the wrapData array has to be initialized.
            if (useWrapMode) {
                var len = this.getLength();
                this.$wrapData = [];
                for (var i = 0; i < len; i++) {
                    this.$wrapData.push([]);
                }
                this.$updateWrapData(0, len - 1);
            }

            this._emit("changeWrapMode");
        }
    };

    /**
	* Edit_Session.getUseWrapMode() -> Boolean
	* 
	* Returns `true` if wrap mode is being used; `false` otherwise.
	**/
	this.getUseWrapMode = function() {
        return this.$useWrapMode;
    };

    // Allow the wrap limit to move freely between min and max. Either
    // parameter can be null to allow the wrap limit to be unconstrained
    // in that direction. Or set both parameters to the same number to pin
    // the limit to that value.
    /**
	* Edit_Session.setWrapLimitRange(min, max) -> Void
	* 
	* TODO At what point to wrap ?
	**/
	this.setWrapLimitRange = function(min, max) {
        if (this.$wrapLimitRange.min !== min || this.$wrapLimitRange.max !== max) {
            this.$wrapLimitRange.min = min;
            this.$wrapLimitRange.max = max;
            this.$modified = true;
            // This will force a recalculation of the wrap limit
            this._emit("changeWrapMode");
        }
    };

    // This should generally only be called by the renderer when a resize
    // is detected.
    /**
	* Edit_Session.adjustWrapLimit(desiredLimit) -> Boolean
	* - desiredLimit (Number): New limit
    *
	* TODO
	**/
	this.adjustWrapLimit = function(desiredLimit) {
        var wrapLimit = this.$constrainWrapLimit(desiredLimit);
        if (wrapLimit != this.$wrapLimit && wrapLimit > 0) {
            this.$wrapLimit = wrapLimit;
            this.$modified = true;
            if (this.$useWrapMode) {
                this.$updateWrapData(0, this.getLength() - 1);
                this.$resetRowCache(0)
                this._emit("changeWrapLimit");
            }
            return true;
        }
        return false;
    };

	this.$constrainWrapLimit = function(wrapLimit) {
        var min = this.$wrapLimitRange.min;
        if (min)
            wrapLimit = Math.max(min, wrapLimit);

        var max = this.$wrapLimitRange.max;
        if (max)
            wrapLimit = Math.min(max, wrapLimit);

        // What would a limit of 0 even mean?
        return Math.max(1, wrapLimit);
    };

    /**
	* Edit_Session.getWrapLimit() -> Number
	* 
	* Returns the value of wrap limit.
	**/
	this.getWrapLimit = function() {
        return this.$wrapLimit;
    };

    /**
	* Edit_Session.getWrapLimitRange() -> Object
	* 
	* Returns an object that defines the minimum and maximum of the wrap limit; it looks something like this:
    *
    *     { min: wrapLimitRange_min, max: wrapLimitRange_max }
    *
	**/
	this.getWrapLimitRange = function() {
        // Avoid unexpected mutation by returning a copy
        return {
            min : this.$wrapLimitRange.min,
            max : this.$wrapLimitRange.max
        };
    };

	this.$updateInternalDataOnChange = function(e) {
        var useWrapMode = this.$useWrapMode;
        var len;
        var action = e.data.action;
        var firstRow = e.data.range.start.row;
        var lastRow = e.data.range.end.row;
        var start = e.data.range.start;
        var end = e.data.range.end;
        var removedFolds = null;

        if (action.indexOf("Lines") != -1) {
            if (action == "insertLines") {
                lastRow = firstRow + (e.data.lines.length);
            } else {
                lastRow = firstRow;
            }
            len = e.data.lines ? e.data.lines.length : lastRow - firstRow;
        } else {
            len = lastRow - firstRow;
        }

        if (len != 0) {
            if (action.indexOf("remove") != -1) {
                useWrapMode && this.$wrapData.splice(firstRow, len);

                var foldLines = this.$foldData;
                removedFolds = this.getFoldsInRange(e.data.range);
                this.removeFolds(removedFolds);

                var foldLine = this.getFoldLine(end.row);
                var idx = 0;
                if (foldLine) {
                    foldLine.addRemoveChars(end.row, end.column, start.column - end.column);
                    foldLine.shiftRow(-len);

                    var foldLineBefore = this.getFoldLine(firstRow);
                    if (foldLineBefore && foldLineBefore !== foldLine) {
                        foldLineBefore.merge(foldLine);
                        foldLine = foldLineBefore;
                    }
                    idx = foldLines.indexOf(foldLine) + 1;
                }

                for (idx; idx < foldLines.length; idx++) {
                    var foldLine = foldLines[idx];
                    if (foldLine.start.row >= end.row) {
                        foldLine.shiftRow(-len);
                    }
                }

                lastRow = firstRow;
            } else {
                var args;
                if (useWrapMode) {
                    args = [firstRow, 0];
                    for (var i = 0; i < len; i++) args.push([]);
                    this.$wrapData.splice.apply(this.$wrapData, args);
                }

                // If some new line is added inside of a foldLine, then split
                // the fold line up.
                var foldLines = this.$foldData;
                var foldLine = this.getFoldLine(firstRow);
                var idx = 0;
                if (foldLine) {
                    var cmp = foldLine.range.compareInside(start.row, start.column)
                    // Inside of the foldLine range. Need to split stuff up.
                    if (cmp == 0) {
                        foldLine = foldLine.split(start.row, start.column);
                        foldLine.shiftRow(len);
                        foldLine.addRemoveChars(
                            lastRow, 0, end.column - start.column);
                    } else
                    // Infront of the foldLine but same row. Need to shift column.
                    if (cmp == -1) {
                        foldLine.addRemoveChars(firstRow, 0, end.column - start.column);
                        foldLine.shiftRow(len);
                    }
                    // Nothing to do if the insert is after the foldLine.
                    idx = foldLines.indexOf(foldLine) + 1;
                }

                for (idx; idx < foldLines.length; idx++) {
                    var foldLine = foldLines[idx];
                    if (foldLine.start.row >= firstRow) {
                        foldLine.shiftRow(len);
                    }
                }
            }
        } else {
            // Realign folds. E.g. if you add some new chars before a fold, the
            // fold should "move" to the right.
            len = Math.abs(e.data.range.start.column - e.data.range.end.column);
            if (action.indexOf("remove") != -1) {
                // Get all the folds in the change range and remove them.
                removedFolds = this.getFoldsInRange(e.data.range);
                this.removeFolds(removedFolds);

                len = -len;
            }
            var foldLine = this.getFoldLine(firstRow);
            if (foldLine) {
                foldLine.addRemoveChars(firstRow, start.column, len);
            }
        }

        if (useWrapMode && this.$wrapData.length != this.doc.getLength()) {
            console.error("doc.getLength() and $wrapData.length have to be the same!");
        }

        useWrapMode && this.$updateWrapData(firstRow, lastRow);

        return removedFolds;
    };

	this.$updateWrapData = function(firstRow, lastRow) {
        var lines = this.doc.getAllLines();
        var tabSize = this.getTabSize();
        var wrapData = this.$wrapData;
        var wrapLimit = this.$wrapLimit;
        var tokens;
        var foldLine;

        var row = firstRow;
        lastRow = Math.min(lastRow, lines.length - 1);
        while (row <= lastRow) {
            foldLine = this.getFoldLine(row, foldLine);
            if (!foldLine) {
                tokens = this.$getDisplayTokens(lang.stringTrimRight(lines[row]));
                wrapData[row] = this.$computeWrapSplits(tokens, wrapLimit, tabSize);
                row ++;
            } else {
                tokens = [];
                foldLine.walk(
                    function(placeholder, row, column, lastColumn) {
                        var walkTokens;
                        if (placeholder) {
                            walkTokens = this.$getDisplayTokens(
                                            placeholder, tokens.length);
                            walkTokens[0] = PLACEHOLDER_START;
                            for (var i = 1; i < walkTokens.length; i++) {
                                walkTokens[i] = PLACEHOLDER_BODY;
                            }
                        } else {
                            walkTokens = this.$getDisplayTokens(
                                lines[row].substring(lastColumn, column),
                                tokens.length);
                        }
                        tokens = tokens.concat(walkTokens);
                    }.bind(this),
                    foldLine.end.row,
                    lines[foldLine.end.row].length + 1
                );
                // Remove spaces/tabs from the back of the token array.
                while (tokens.length != 0 && tokens[tokens.length - 1] >= SPACE)
                    tokens.pop();

                wrapData[foldLine.start.row]
                    = this.$computeWrapSplits(tokens, wrapLimit, tabSize);
                row = foldLine.end.row + 1;
            }
        }
    };

    // "Tokens"
    var CHAR = 1,
        CHAR_EXT = 2,
        PLACEHOLDER_START = 3,
        PLACEHOLDER_BODY =  4,
        PUNCTUATION = 9,
        SPACE = 10,
        TAB = 11,
        TAB_SPACE = 12;

	this.$computeWrapSplits = function(tokens, wrapLimit) {
        if (tokens.length == 0) {
            return [];
        }

        var splits = [];
        var displayLength = tokens.length;
        var lastSplit = 0, lastDocSplit = 0;

        function addSplit(screenPos) {
            var displayed = tokens.slice(lastSplit, screenPos);

            // The document size is the current size - the extra width for tabs
            // and multipleWidth characters.
            var len = displayed.length;
            displayed.join("").
                // Get all the TAB_SPACEs.
                replace(/12/g, function() {
                    len -= 1;
                }).
                // Get all the CHAR_EXT/multipleWidth characters.
                replace(/2/g, function() {
                    len -= 1;
                });

            lastDocSplit += len;
            splits.push(lastDocSplit);
            lastSplit = screenPos;
        }

        while (displayLength - lastSplit > wrapLimit) {
            // This is, where the split should be.
            var split = lastSplit + wrapLimit;

            // If there is a space or tab at this split position, then making
            // a split is simple.
            if (tokens[split] >= SPACE) {
                // Include all following spaces + tabs in this split as well.
                while (tokens[split] >= SPACE) {
                    split ++;
                }
                addSplit(split);
                continue;
            }

            // === ELSE ===
            // Check if split is inside of a placeholder. Placeholder are
            // not splitable. Therefore, seek the beginning of the placeholder
            // and try to place the split beofre the placeholder's start.
            if (tokens[split] == PLACEHOLDER_START
                || tokens[split] == PLACEHOLDER_BODY)
            {
                // Seek the start of the placeholder and do the split
                // before the placeholder. By definition there always
                // a PLACEHOLDER_START between split and lastSplit.
                for (split; split != lastSplit - 1; split--) {
                    if (tokens[split] == PLACEHOLDER_START) {
                        // split++; << No incremental here as we want to
                        //  have the position before the Placeholder.
                        break;
                    }
                }

                // If the PLACEHOLDER_START is not the index of the
                // last split, then we can do the split
                if (split > lastSplit) {
                    addSplit(split);
                    continue;
                }

                // If the PLACEHOLDER_START IS the index of the last
                // split, then we have to place the split after the
                // placeholder. So, let's seek for the end of the placeholder.
                split = lastSplit + wrapLimit;
                for (split; split < tokens.length; split++) {
                    if (tokens[split] != PLACEHOLDER_BODY)
                    {
                        break;
                    }
                }

                // If spilt == tokens.length, then the placeholder is the last
                // thing in the line and adding a new split doesn't make sense.
                if (split == tokens.length) {
                    break;  // Breaks the while-loop.
                }

                // Finally, add the split...
                addSplit(split);
                continue;
            }

            // === ELSE ===
            // Search for the first non space/tab/placeholder/punctuation token backwards.
            var minSplit = Math.max(split - 10, lastSplit - 1);
            while (split > minSplit && tokens[split] < PLACEHOLDER_START) {
                split --;
            }
            while (split > minSplit && tokens[split] == PUNCTUATION) {
                split --;
            }
            // If we found one, then add the split.
            if (split > minSplit) {
                addSplit(++split);
                continue;
            }

            // === ELSE ===
            split = lastSplit + wrapLimit;
            // The split is inside of a CHAR or CHAR_EXT token and no space
            // around -> force a split.
            addSplit(split);
        }
        return splits;
    }

	this.$getDisplayTokens = function(str, offset) {
        var arr = [];
        var tabSize;
        offset = offset || 0;

        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            // Tab
            if (c == 9) {
                tabSize = this.getScreenTabSize(arr.length + offset);
                arr.push(TAB);
                for (var n = 1; n < tabSize; n++) {
                    arr.push(TAB_SPACE);
                }
            }
            // Space
            else if (c == 32) {
                arr.push(SPACE);
            } else if((c > 39 && c < 48) || (c > 57 && c < 64)) {
                arr.push(PUNCTUATION);
            }
            // full width characters
            else if (c >= 0x1100 && isFullWidth(c)) {
                arr.push(CHAR, CHAR_EXT);
            } else {
                arr.push(CHAR);
            }
        }
        return arr;
    }

    /**
	* Edit_Session.$getStringScreenWidth(str, maxScreenColumn, screenColumn) -> Array
	* - str (String): The string to calculate the screen width of
    * - maxScreenColumn (Integer): TODO
	* - screenColumn (Integer): TODO
    *
    * Calculates the width of the string `str` on the screen while assuming that the string starts at the first column on the screen.
    *
    * #### Returns
    *
    * Returns an `int[]` array with two elements. The first position indicates the number of columns for `str` on screen. The second value contains the position of the document column that this function read until.
    *
	**/
	this.$getStringScreenWidth = function(str, maxScreenColumn, screenColumn) {
        if (maxScreenColumn == 0) {
            return [0, 0];
        }
        if (maxScreenColumn == null) {
            maxScreenColumn = screenColumn +
                str.length * Math.max(this.getTabSize(), 2);
        }
        screenColumn = screenColumn || 0;

        var c, column;
        for (column = 0; column < str.length; column++) {
            c = str.charCodeAt(column);
            // tab
            if (c == 9) {
                screenColumn += this.getScreenTabSize(screenColumn);
            }
            // full width characters
            else if (c >= 0x1100 && isFullWidth(c)) {
                screenColumn += 2;
            } else {
                screenColumn += 1;
            }
            if (screenColumn > maxScreenColumn) {
                break
            }
        }

        return [screenColumn, column];
    }

    /**
	* Edit_Session.getRowLength(row) -> Number
	* - row (Number): The row number to check
    * 
    *
	* Returns the length of the indicated row.
	**/
	this.getRowLength = function(row) {
        if (!this.$useWrapMode || !this.$wrapData[row]) {
            return 1;
        } else {
            return this.$wrapData[row].length + 1;
        }
    }

    /**
	* Edit_Session.getRowHeight(config, row) -> Number
	* - config (String): TODO
    * - row (Number): The row number to check
    *
    * Returns the height of the indicated row.
    *
	**/
	this.getRowHeight = function(config, row) {
        return this.getRowLength(row) * config.lineHeight;
    }

    /**
	* Edit_Session.getScreenLastRowColumn(screenRow) -> Number
	* 
	* TODO
	**/
	this.getScreenLastRowColumn = function(screenRow) {
        //return this.screenToDocumentColumn(screenRow, Number.MAX_VALUE / 10)
        return this.documentToScreenColumn(screenRow, this.doc.getLine(screenRow).length);
    };

    /**
	* Edit_Session.getDocumentLastRowColumn(docRow, docColumn) -> Number
	* 
	* TODO
	**/
	this.getDocumentLastRowColumn = function(docRow, docColumn) {
        var screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.getScreenLastRowColumn(screenRow);
    };

    /**
	* Edit_Session.getDocumentLastRowColumnPosition(docRow, docColumn) -> Number
	* 
	* TODO
	**/
	this.getDocumentLastRowColumnPosition = function(docRow, docColumn) {
        var screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.screenToDocumentPosition(screenRow, Number.MAX_VALUE / 10);
    };

    /**
	* Edit_Session.getRowSplitData(row) -> undefined | String
	* 
	* TODO
	**/
	this.getRowSplitData = function(row) {
        if (!this.$useWrapMode) {
            return undefined;
        } else {
            return this.$wrapData[row];
        }
    };

    /**
	* Edit_Session.getScreenTabSize(screenColumn) -> Number
    * - screenColumn (Number): The screen column to check
	* 
	* TODO Returns the width of a tab character at `screenColumn`.
	**/
	this.getScreenTabSize = function(screenColumn) {
        return this.$tabSize - screenColumn % this.$tabSize;
    };

    /**
	* Edit_Session.screenToDocumentRow(screenRow, screenColumn) -> Number
	* 
	* TODO
	**/
	this.screenToDocumentRow = function(screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).row;
    };

    /**
	* Edit_Session.screenToDocumentColumn(screenRow, screenColumn) -> Number
	* 
	* TODO
	**/
	this.screenToDocumentColumn = function(screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).column;
    };

    /**
	* Edit_Session.screenToDocumentPosition(screenRow, screenColumn) -> Number
	* 
	* TODO
	**/
	this.screenToDocumentPosition = function(screenRow, screenColumn) {
        if (screenRow < 0) {
            return {
                row: 0,
                column: 0
            }
        }

        var line;
        var docRow = 0;
        var docColumn = 0;
        var column;
        var row = 0;
        var rowLength = 0;

        var rowCache = this.$rowCache;
        for (var i = 0; i < rowCache.length; i++) {
            if (rowCache[i].screenRow < screenRow) {
                row = rowCache[i].screenRow;
                docRow = rowCache[i].docRow;
            }
            else {
                break;
            }
        }
        var doCache = !rowCache.length || i == rowCache.length;

        var maxRow = this.getLength() - 1;
        var foldLine = this.getNextFoldLine(docRow);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (row <= screenRow) {
            rowLength = this.getRowLength(docRow);
            if (row + rowLength - 1 >= screenRow || docRow >= maxRow) {
                break;
            } else {
                row += rowLength;
                docRow++;
                if (docRow > foldStart) {
                    docRow = foldLine.end.row+1;
                    foldLine = this.getNextFoldLine(docRow, foldLine);
                    foldStart = foldLine ? foldLine.start.row : Infinity;
                }
            }
            if (doCache) {
                rowCache.push({
                    docRow: docRow,
                    screenRow: row
                });
            }
        }

        if (foldLine && foldLine.start.row <= docRow) {
            line = this.getFoldDisplayLine(foldLine);
            docRow = foldLine.start.row;
        } else if (row + rowLength <= screenRow || docRow > maxRow) {
            // clip at the end of the document
            return {
                row: maxRow,
                column: this.getLine(maxRow).length
            }
        } else {
            line = this.getLine(docRow);
            foldLine = null;
        }

        if (this.$useWrapMode) {
            var splits = this.$wrapData[docRow];
            if (splits) {
                column = splits[screenRow - row];
                if(screenRow > row && splits.length) {
                    docColumn = splits[screenRow - row - 1] || splits[splits.length - 1];
                    line = line.substring(docColumn);
                }
            }
        }

        docColumn += this.$getStringScreenWidth(line, screenColumn)[1];

        // Need to do some clamping action here.
        if (this.$useWrapMode) {
            if (docColumn >= column) {
                // We remove one character at the end such that the docColumn
                // position returned is not associated to the next row on the
                // screen.
                docColumn = column - 1;
            }
        } else {
            docColumn = Math.min(docColumn, line.length);
        }

        if (foldLine) {
            return foldLine.idxToPosition(docColumn);
        }

        return {
            row: docRow,
            column: docColumn
        }
    };

    /**
	* Edit_Session.documentToScreenPosition(docRow, docColumn) -> Number
	* 
	* TODO
	**/
	this.documentToScreenPosition = function(docRow, docColumn) {
        // Normalize the passed in arguments.
        if (typeof docColumn === "undefined")
            var pos = this.$clipPositionToDocument(docRow.row, docRow.column);
        else
            pos = this.$clipPositionToDocument(docRow, docColumn);

        docRow = pos.row;
        docColumn = pos.column;

        var wrapData;
        // Special case in wrapMode if the doc is at the end of the document.
        if (this.$useWrapMode) {
            wrapData = this.$wrapData;
            if (docRow > wrapData.length - 1) {
                return {
                    row: this.getScreenLength(),
                    column: wrapData.length == 0
                        ? 0
                        : (wrapData[wrapData.length - 1].length - 1)
                };
            }
        }

        var screenRow = 0;
        var foldStartRow = null;
        var fold = null;

        // Clamp the docRow position in case it's inside of a folded block.
        fold = this.getFoldAt(docRow, docColumn, 1);
        if (fold) {
            docRow = fold.start.row;
            docColumn = fold.start.column;
        }

        var rowEnd, row = 0;
        var rowCache = this.$rowCache;

        for (var i = 0; i < rowCache.length; i++) {
            if (rowCache[i].docRow < docRow) {
                screenRow = rowCache[i].screenRow;
                row = rowCache[i].docRow;
            } else {
                break;
            }
        }
        var doCache = !rowCache.length || i == rowCache.length;

        var foldLine = this.getNextFoldLine(row);
        var foldStart = foldLine ?foldLine.start.row :Infinity;

        while (row < docRow) {
            if (row >= foldStart) {
                rowEnd = foldLine.end.row + 1;
                if (rowEnd > docRow)
                    break;
                foldLine = this.getNextFoldLine(rowEnd, foldLine);
                foldStart = foldLine ?foldLine.start.row :Infinity;
            }
            else {
                rowEnd = row + 1;
            }

            screenRow += this.getRowLength(row);
            row = rowEnd;

            if (doCache) {
                rowCache.push({
                    docRow: row,
                    screenRow: screenRow
                });
            }
        }

        // Calculate the text line that is displayed in docRow on the screen.
        var textLine = "";
        // Check if the final row we want to reach is inside of a fold.
        if (foldLine && row >= foldStart) {
            textLine = this.getFoldDisplayLine(foldLine, docRow, docColumn);
            foldStartRow = foldLine.start.row;
        } else {
            textLine = this.getLine(docRow).substring(0, docColumn);
            foldStartRow = docRow;
        }
        // Clamp textLine if in wrapMode.
        if (this.$useWrapMode) {
            var wrapRow = wrapData[foldStartRow];
            var screenRowOffset = 0;
            while (textLine.length >= wrapRow[screenRowOffset]) {
                screenRow ++;
                screenRowOffset++;
            }
            textLine = textLine.substring(
                wrapRow[screenRowOffset - 1] || 0, textLine.length
            );
        }

        return {
            row: screenRow,
            column: this.$getStringScreenWidth(textLine)[0]
        };
    };

    /**
	* Edit_Session.documentToScreenColumn(row, docColumn) -> Number
	* 
	* TODO
	**/
	this.documentToScreenColumn = function(row, docColumn) {
        return this.documentToScreenPosition(row, docColumn).column;
    };

    /**
	* Edit_Session.documentToScreenRow(docRow, docColumn) -> Number
	* 
	* TODO
	**/
	this.documentToScreenRow = function(docRow, docColumn) {
        return this.documentToScreenPosition(docRow, docColumn).row;
    };

    /**
	* Edit_Session.getScreenLength() -> Number
	* 
	* Returns the length of the screen.
	**/
	this.getScreenLength = function() {
        var screenRows = 0;
        var fold = null;
        if (!this.$useWrapMode) {
            screenRows = this.getLength();

            // Remove the folded lines again.
            var foldData = this.$foldData;
            for (var i = 0; i < foldData.length; i++) {
                fold = foldData[i];
                screenRows -= fold.end.row - fold.start.row;
            }
        } else {
            var lastRow = this.$wrapData.length;
            var row = 0, i = 0;
            var fold = this.$foldData[i++];
            var foldStart = fold ? fold.start.row :Infinity;

            while (row < lastRow) {
                screenRows += this.$wrapData[row].length + 1;
                row ++;
                if (row > foldStart) {
                    row = fold.end.row+1;
                    fold = this.$foldData[i++];
                    foldStart = fold ?fold.start.row :Infinity;
                }
            }
        }

        return screenRows;
    }

    // For every keystroke this gets called once per char in the whole doc!!
    // Wouldn't hurt to make it a bit faster for c >= 0x1100
    function isFullWidth(c) {
        if (c < 0x1100)
            return false;
        return c >= 0x1100 && c <= 0x115F ||
               c >= 0x11A3 && c <= 0x11A7 ||
               c >= 0x11FA && c <= 0x11FF ||
               c >= 0x2329 && c <= 0x232A ||
               c >= 0x2E80 && c <= 0x2E99 ||
               c >= 0x2E9B && c <= 0x2EF3 ||
               c >= 0x2F00 && c <= 0x2FD5 ||
               c >= 0x2FF0 && c <= 0x2FFB ||
               c >= 0x3000 && c <= 0x303E ||
               c >= 0x3041 && c <= 0x3096 ||
               c >= 0x3099 && c <= 0x30FF ||
               c >= 0x3105 && c <= 0x312D ||
               c >= 0x3131 && c <= 0x318E ||
               c >= 0x3190 && c <= 0x31BA ||
               c >= 0x31C0 && c <= 0x31E3 ||
               c >= 0x31F0 && c <= 0x321E ||
               c >= 0x3220 && c <= 0x3247 ||
               c >= 0x3250 && c <= 0x32FE ||
               c >= 0x3300 && c <= 0x4DBF ||
               c >= 0x4E00 && c <= 0xA48C ||
               c >= 0xA490 && c <= 0xA4C6 ||
               c >= 0xA960 && c <= 0xA97C ||
               c >= 0xAC00 && c <= 0xD7A3 ||
               c >= 0xD7B0 && c <= 0xD7C6 ||
               c >= 0xD7CB && c <= 0xD7FB ||
               c >= 0xF900 && c <= 0xFAFF ||
               c >= 0xFE10 && c <= 0xFE19 ||
               c >= 0xFE30 && c <= 0xFE52 ||
               c >= 0xFE54 && c <= 0xFE66 ||
               c >= 0xFE68 && c <= 0xFE6B ||
               c >= 0xFF01 && c <= 0xFF60 ||
               c >= 0xFFE0 && c <= 0xFFE6;
    };

}).call(EditSession.prototype);

require("./edit_session/folding").Folding.call(EditSession.prototype);
require("./edit_session/bracket_match").BracketMatch.call(EditSession.prototype);

exports.EditSession = EditSession;
});
