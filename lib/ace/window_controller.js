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
 * Ajax.org B.V.
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

var Range = require("ace/range").Range;

var WindowController = exports.WindowController = function(model, view) {
    this.model = model;
    this.view = view;
    
    model.on("changeShowInvisibles", view.updateShowInvisibles.bind(view));
    model.on("changePrintMargin", view.updatePrintMargin.bind(view));
    model.on("changeShowGutter", view.updateShowGutter.bind(view));
    model.on("changePadding", view.updatePadding.bind(view));
    model.on("changeHorizScroll", view.updateHorizScroll.bind(view));
    model.on("changeTheme", view.updateTheme.bind(view));
    model.on("changeCharacterSize", view.updateCharacterSize.bind(view));
    model.on("changeScrollLeft", view.updateScrollLeft.bind(view));
    model.on("changeScrollTop", view.updateScrollTop.bind(view));
    
    model.on("changeSelectionStyle", this.onSelectionChange.bind(this));
    model.on("changeHighlightActiveLine", this._updateHighlightActiveLine.bind(this));
    model.on("changeHighlightSelectedWord", this.onChangeHighlightSelectedWord.bind(this));
    
    model.on("changeBuffer", this.onChangeBuffer.bind(this));
};

(function() {

    this.onChangeHighlightSelectedWord = function() {
        var buffer = this.model.buffer;
        if (this.model.shouldHighlight)
            buffer.getMode().highlightSelection(this.model);
        else
            buffer.getMode().clearSelectionHighlight(this.model);
    };

    this.onChangeBuffer = function(e) {
        var buffer = e.value;
        var oldBuffer = e.oldValue;
        
        // cleanup
        if (oldBuffer) {
            oldBuffer.removeListener("change", this._onDocumentChange);
            oldBuffer.removeListener("tokenizerUpdate", this._onTokenizerUpdate);
            oldBuffer.removeListener("changeTabSize", this._onChangeTabSize);
            oldBuffer.removeListener("changeMode", this._onChangeMode);
            oldBuffer.removeListener("changeWrapLimit", this._onChangeWrapLimit);
            oldBuffer.removeListener("changeWrapMode", this._onChangeWrapMode);
            oldBuffer.removeListener("onChangeFold", this._onChangeFold);
            oldBuffer.removeListener("changeFrontMarker", this._onChangeFrontMarker);
            oldBuffer.removeListener("changeBackMarker", this._onChangeBackMarker);
            oldBuffer.removeListener("changeBreakpoint", this._onChangeBreakpoint);
            oldBuffer.removeListener("changeAnnotation", this._onChangeAnnotation);
            oldBuffer.removeListener("changeOverwrite", this._onCursorChange);

            var selection = oldBuffer.getSelection();
            selection.removeEventListener("changeCursor", this._onCursorChange);
            selection.removeEventListener("changeSelection", this._onSelectionChange);
        }

        // TODO refactor
        this.view.setSession(buffer);
        
        this._onDocumentChange = this.onDocumentChange.bind(this);
        buffer.on("change", this._onDocumentChange);
        
        this._onTokenizerUpdate = this.onTokenizerUpdate.bind(this);
        buffer.on("tokenizerUpdate", this._onTokenizerUpdate);

        this._onChangeTabSize = this.view.updateText.bind(this.view);
        buffer.on("changeTabSize", this._onChangeTabSize);

        this._onChangeMode = this.view.updateText.bind(this.view);
        buffer.on("changeMode", this._onChangeMode);
        
        this._onChangeWrapLimit = this.view.updateFull.bind(this.view);
        buffer.on("changeWrapLimit", this._onChangeWrapLimit);

        this._onChangeWrapMode = this.onChangeWrapMode.bind(this);
        buffer.on("changeWrapMode", this._onChangeWrapMode);

        this._onChangeFold = this.onChangeFold.bind(this);
        buffer.on("changeFold", this._onChangeFold);

        this._onChangeFrontMarker = this.view.updateFrontMarkers.bind(this.view);
        buffer.on("changeFrontMarker", this._onChangeFrontMarker);

        this._onChangeBackMarker = this.view.updateBackMarkers.bind(this.view);
        buffer.on("changeBackMarker", this._onChangeBackMarker);

        this._onChangeBreakpoint = this.onChangeBreakpoint.bind(this);
        buffer.on("changeBreakpoint", this._onChangeBreakpoint);

        this._onChangeAnnotation = this.onChangeAnnotation.bind(this);
        buffer.on("changeAnnotation", this._onChangeAnnotation);

        this._onCursorChange = this.onCursorChange.bind(this);
        buffer.on("changeOverwrite", this._onCursorChange);

        this.selection = buffer.getSelection();
        this.selection.on("changeCursor", this._onCursorChange);

        this._onSelectionChange = this.onSelectionChange.bind(this);
        this.selection.on("changeSelection", this._onSelectionChange);

        this._onChangeFrontMarker();
        this._onChangeBackMarker();
        this.onChangeBreakpoint();
        this.onChangeAnnotation();
        if (buffer.getUseWrapMode())
            this.view.adjustWrapLimit();
            
        this.onCursorChange();
        this.onSelectionChange();
        
        this.view.updateFull();
    };
    
    this.onDocumentChange = function(e) {
        var delta = e.data;
        var range = delta.range;

        if (range.start.row == range.end.row && delta.action != "insertLines" && delta.action != "removeLines")
            var lastRow = range.end.row;
        else
            lastRow = Infinity;

        this.view.updateLines(range.start.row, lastRow);

        // update cursor because tab characters can influence the cursor position
        this.view.updateCursor();
    };

    this.onTokenizerUpdate = function(e) {
        var rows = e.data;
        this.view.updateLines(rows.first, rows.last);
    };

    this.onChangeWrapMode = function() {
        this.view.onResize(true);
    };

    this.onChangeFold = function() {
        // Update the active line marker as due to folding changes the current
        // line range on the screen might have changed.
        this._updateHighlightActiveLine();
        this.view.updateFull();
    };

    this.onChangeBreakpoint = function() {
        this.view.setBreakpoints(this.model.buffer.getBreakpoints());
    };

    this.onChangeAnnotation = function() {
        this.view.setAnnotations(this.model.buffer.getAnnotations());
    };

    this.onCursorChange = function(e) {
        this.view.updateCursor();

        if (!this._blockScrolling)
            this.model.scrollCursorIntoView();

        // move text input over the cursor
        // this is required for iOS and IME
        // TODO refactor
        //this.view.moveTextAreaToCursor(this.textInput.getElement());

        this._highlightBrackets();
        this._updateHighlightActiveLine();
    };

    this.onSelectionChange = function(e) {
        var buffer = this.model.buffer;

        if (buffer._selectionMarker) {
            buffer.removeMarker(buffer._selectionMarker);
        }
        buffer._selectionMarker = null;

        if (!this.selection.isEmpty()) {
            var range = this.selection.getRange();
            var style = this.model.getSelectionStyle();
            buffer._selectionMarker = buffer.addMarker(range, "ace_selection", style);
        } else {
            this._updateHighlightActiveLine();
        }

        if (this.model.highlightSelectedWord)
            this.model.buffer.getMode().highlightSelection(this.model);
    };
    
    this._updateHighlightActiveLine = function() {
        var buffer = this.model.buffer;

        if (buffer._highlightLineMarker)
            buffer.removeMarker(buffer._highlightLineMarker);

        buffer._highlightLineMarker = null;

        if (this.model.highlightActiveLine && (this.model.selectionStyle != "line" || !this.selection.isMultiLine())) {
            var cursor = this.selection.getCursor();
            var foldLine = buffer.getFoldLine(cursor.row);
            var range;
            if (foldLine) {
                range = new Range(foldLine.start.row, 0, foldLine.end.row + 1, 0);
            } else {
                range = new Range(cursor.row, 0, cursor.row+1, 0);
            }
            buffer._highlightLineMarker = buffer.addMarker(range, "ace_active_line", "background");
        }
    };
    
    this._highlightBrackets = function() {
        var buffer = this.model.buffer;
        
        if (buffer._bracketHighlight) {
            buffer.removeMarker(buffer._bracketHighlight);
            buffer._bracketHighlight = null;
        }

        if (this._highlightPending)
            return;

        // perform highlight async to not block the browser during navigation
        var self = this;
        this._highlightPending = true;
        setTimeout(function() {
            self._highlightPending = false;

            var pos = buffer.findMatchingBracket(self.selection.getCursor());
            if (pos) {
                var range = new Range(pos.row, pos.column, pos.row, pos.column+1);
                buffer._bracketHighlight = buffer.addMarker(range, "ace_bracket", "text");
            }
        }, 10);
    };

}).call(WindowController.prototype);

});