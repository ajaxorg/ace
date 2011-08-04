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
 * Portions created by the Initial Developer are Copyright (C) 2011
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

var oop = require("ace/lib/oop");
var lang = require("ace/lib/lang");
var EventEmitter = require("ace/lib/event_emitter").EventEmitter;

/**
 * A window represents the viewport of a buffer
 */
var Window = exports.Window = function(theme, search) {
    this.theme = null;
    this.setTheme(theme);
    this.search = search;
        
    this.buffer = null;
    
    this.layerConfig = {
        width : 1,
        padding : 0,
        firstRow : 0,
        firstRowScreen: 0,
        lastRow : 0,
        minHeight : 1,
        maxHeight : 1,
        offset : 0,
        height : 1,
        horizScroll: null
    };
    
    this.size = {
        width: 0,
        height: 0,
        scrollerHeight: 0,
        scrollerWidth: 0
    };
    
    this.charSize = {
        height: 1,
        width: 1
    };
    
    this.scrollLeft = 0;
    this.scrollTop = 0;
    this._blockScrolling = 0;
    
    this.showInvisibles = false;
    this.showPrintMargin = true;
    this.printMarginColumn = 80;
    this.showGutter = true;
    this.padding = 4;
    this.horizScrollAlwaysVisible = false;
    
    this.selectionStyle = "line";
    this.highlightActiveLine = true;
    this.highlightSelectedWord = true;
};

(function() {

    oop.implement(this, EventEmitter);
    
    // VIEWPORT SIZE
    
    this.setSizes = function(size) {
        if (this.size.width !== size.width || this.size.scrollerWidth !== size.scrollerWidth) {
            this.size.width = size.width;
            this.size.scrollerWidth = size.scrollerWidth;
            this.size.gutterWidth = size.gutterWidth;
            this._emit("changeWidth");
        }
        
        if (this.size.height !== size.height || this.size.scrollerHeight !== size.scrollerHeight) {
            this.size.height = size.height;
            this.size.scrollerHeight = size.scrollerHeight;
            this._emit("changeHeight");
        }
    };
    
    this.setComputedCharacterSize = function(size) {
        if (this.charSize.height == size.height && this.charSize.width == size.width)
            return;
            
        this.charSize = size;
        this._emit("changeCharacterSize")
    };
    
    // LAYER UPDATE COMPUTATION
    
    this.updateLayerConfig = function() {
        var buffer = this.buffer;

        var charSize = this.charSize;
        var offset = this.scrollTop % charSize.height;
        var minHeight = this.size.scrollerHeight + charSize.height;

        var longestLine = this.getLongestLine();
        var widthChanged = this.layerConfig.width != longestLine;

        var horizScroll = this.horizScrollAlwaysVisible || this.size.scrollerWidth - longestLine < 0;
        var horizScrollChanged = this.layerConfig.horizScroll !== horizScroll;
        
        var maxHeight = buffer.getScreenLength() * charSize.height;
        this.scrollToY(Math.max(0, Math.min(this.scrollTop, maxHeight - this.size.scrollerHeight)));

        var lineCount = Math.ceil(minHeight / charSize.height) - 1;
        var firstRow = Math.max(0, Math.round((this.scrollTop - offset) / charSize.height));
        var lastRow = firstRow + lineCount;

        // Map lines on the screen to lines in the document.
        var firstRowScreen, firstRowHeight;
        firstRow = buffer.screenToDocumentRow(firstRow, 0);

        // Check if firstRow is inside of a foldLine. If true, then use the first
        // row of the foldLine.
        var foldLine = buffer.getFoldLine(firstRow);
        if (foldLine)
            firstRow = foldLine.start.row;

        firstRowScreen = buffer.documentToScreenRow(firstRow, 0);
        firstRowHeight = this.getRowHeight(firstRow);

        lastRow = Math.min(buffer.screenToDocumentRow(lastRow, 0), buffer.getLength() - 1);
        minHeight = this.size.scrollerHeight
            + this.getRowHeight(lastRow)
            + firstRowHeight;

        offset = this.scrollTop - firstRowScreen * charSize.height;

        this.layerConfig = {
            width : longestLine,
            padding : this.padding,
            firstRow : firstRow,
            firstRowScreen: firstRowScreen,
            lastRow : lastRow,
            minHeight : minHeight,
            maxHeight : maxHeight,
            offset : offset,
            height : this.size.scrollerHeight,
            horizScrollChanged: horizScrollChanged,
            horizScroll: horizScroll
        };

        return this.layerConfig;
    };
    
    this.getLongestLine = function() {
        var charCount = this.buffer.getScreenWidth() + 1;
        if (this.showInvisibles)
            charCount += 1;

        return Math.max(this.size.scrollerWidth, Math.round(charCount * this.charSize.width));
    };
    
    // VIEWPORT COMPUTATIONS
    
    this.getFirstVisibleRow = function() {
        return this.layerConfig.firstRow;
    };

    this.getLastVisibleRow = function() {
        return this.layerConfig.lastRow;
    };

    this.getFirstFullyVisibleRow = function() {
        return this.layerConfig.firstRow + (this.layerConfig.offset === 0 ? 0 : 1);
    };

    this.getLastFullyVisibleRow = function() {
        var flint = Math.floor((this.layerConfig.height + this.layerConfig.offset) / this.charSize.height);
        return this.layerConfig.firstRow - 1 + flint;
    };
    
    this.isRowVisible = function(row) {
        return (row >= this.getFirstVisibleRow() && row <= this.getLastVisibleRow());
    };

    this.getVisibleRowCount = function() {
        return this.getScrollBottomRow() - this.getScrollTopRow() + 1;
    };

    this.getPageDownRow = function() {
        return this.getScrollBottomRow();
    };

    this.getPageUpRow = function() {
        var firstRow = this.getScrollTopRow();
        var lastRow = this.getScrollBottomRow();

        return firstRow - (lastRow - firstRow);
    };
    
    this.getCursorPixelPosition = function(onScreen) {
        if (!this.buffer) {
            return {
                left: 0,
                top: 0
            }
        }
        var position = this.buffer.selection.getCursor();
        var pos = this.buffer.documentToScreenPosition(position);
        var cursorLeft = Math.round(
            this.padding + pos.column * this.charSize.width
        );
        var cursorTop = (pos.row - (onScreen ? this.layerConfig.firstRowScreen : 0))
            * this.charSize.height;

        return {
            left : cursorLeft,
            top : cursorTop
        };
    };

    /**
     * Returns the height in pixels required to render this row on the screen
     **/
    this.getRowHeight = function(row) {
        return this.buffer.getRowLength(row) * this.charSize.height;
    };
    
    // SELECTION HANDLING
    
    this.centerSelection = function() {
         var range = this.getSelectionRange();
         var line = Math.floor(range.start.row + (range.end.row - range.start.row) / 2);
         this.scrollToLine(line, true);
     };

     this.getCursorPosition = function() {
         return this.selection.getCursor();
     };

     this.getCursorPositionScreen = function() {
         return this.buffer.documentToScreenPosition(this.getCursorPosition());
     };

     this.getSelectionRange = function() {
         return this.selection.getRange();
     };

     this.selectAll = function() {
         this._blockScrolling += 1;
         this.selection.selectAll();
         this._blockScrolling -= 1;
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
    
    // SEARCH
    
    this.replace = function(replacement, options) {
        if (options)
            this.search.set(options);

        var range = this.search.find(this.buffer);
        if (!range)
            return;

        this._tryReplace(range, replacement);
        if (range !== null)
            this.selection.setSelectionRange(range);
    };

    this.replaceAll = function(replacement, options) {
        if (options)
            this._search.set(options);

        var ranges = this.search.findAll(this.buffer);
        if (!ranges.length)
            return;

        var selection = this.getSelectionRange();
        this.clearSelection();
        this.selection.moveCursorTo(0, 0);

        this._blockScrolling += 1;
        for (var i = ranges.length - 1; i >= 0; --i)
            this._tryReplace(ranges[i], replacement);

        this.selection.setSelectionRange(selection);
        this._blockScrolling -= 1;
    };

    this._tryReplace = function(range, replacement) {
        var input = this.buffer.getTextRange(range);
        var replacement = this.search.replace(input, replacement);
        if (replacement !== null) {
            range.end = this.buffer.replace(range, replacement);
            return range;
        } else {
            return null;
        }
    };

    this.getLastSearchOptions = function() {
        return this.search.getOptions();
    };

    this.find = function(needle, options) {
        this.clearSelection();
        options = options || {};
        options.needle = needle;
        this.search.set(options);
        this._find();
    };

    this.findNext = function(options) {
        options = options || {};
        if (typeof options.backwards == "undefined")
            options.backwards = false;
        this.search.set(options);
        this._find();
    };

    this.findPrevious = function(options) {
        options = options || {};
        if (typeof options.backwards == "undefined")
            options.backwards = true;
        this.search.set(options);
        this._find();
    };

    this._find = function(backwards) {
        if (!this.selection.isEmpty()) {
            this.search.set({needle: this.buffer.getTextRange(this.getSelectionRange())});
        }

        if (typeof backwards != "undefined")
            this.search.set({backwards: backwards});

        var range = this.search.find(this.session);
        if (range) {
            this.gotoLine(range.end.row+1, range.end.column);
            this.selection.setSelectionRange(range);
        }
    };
    
    // NAVIGATION

    this.gotoLine = function(lineNumber, column) {
        this.selection.clearSelection();

        this._blockScrolling += 1;
        this.moveCursorTo(lineNumber-1, column || 0);
        this._blockScrolling -= 1;
        if (!this.isRowVisible(this.getCursorPosition().row))
            this.scrollToLine(lineNumber, true);
    };
    
    this.navigateTo = function(row, column) {
        this.clearSelection();
        this.moveCursorTo(row, column);
    };

    this.navigateUp = function(times) {
        this.selection.clearSelection();
        times = times || 1;
        this.selection.moveCursorBy(-times, 0);
    };

    this.navigateDown = function(times) {
        this.selection.clearSelection();
        times = times || 1;
        this.selection.moveCursorBy(times, 0);
    };

    this.navigateLeft = function(times) {
        if (!this.selection.isEmpty()) {
            var selectionStart = this.getSelectionRange().start;
            this.moveCursorToPosition(selectionStart);
        }
        else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorLeft();
            }
        }
        this.clearSelection();
    };

    this.navigateRight = function(times) {
        if (!this.selection.isEmpty()) {
            var selectionEnd = this.getSelectionRange().end;
            this.moveCursorToPosition(selectionEnd);
        }
        else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorRight();
            }
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

    // SCROLLING
    
    this.scrollToY = function(scrollTop) {
        scrollTop = Math.max(0, scrollTop);
        if (this.scrollTop == scrollTop)
            return;
            
        this.scrollTop = scrollTop;
        this._emit("changeScrollTop");
    };
    
    this.getScrollTop = function() {
        return this.scrollTop;
    };
    
    this.scrollToX = function(scrollLeft) {
        if (scrollLeft <= this.padding)
            scrollLeft = 0;

        if (this.scrollLeft === scrollLeft)
            return;
            
        this.scrollLeft = scrollLeft;
        this._emit("changeScrollLeft");
    };
    
    this.scrollBy = function(deltaX, deltaY) {
        deltaY && this.scrollToY(this.scrollTop + deltaY);
        deltaX && this.scrollToX(this.scrollLeft + deltaX);
    };
    
    this.getScrollLeft = function() {
        return this.scrollLeft;
    };
    
    this.getScrollTopRow = function() {
        return this.scrollTop / this.charSize.height;
    };

    this.getScrollBottomRow = function() {
        return Math.max(0, Math.floor((this.scrollTop + this.size.scrollerHeight) / this.charSize.height) - 1);
    };

    this.scrollToRow = function(row) {
        this.scrollToY(row * this.charSize.height);
    };

    this.scrollToLine = function(line, center) {
        var offset = 0;
        for (var l = 1; l < line; l++)
            offset += this.getRowHeight(l-1);

        if (center)
            offset -= this.size.scrollerHeight / 2;

        this.scrollToY(offset);
    };

    this.scrollCursorIntoView = function() {    
        // the editor is not visible
        if (this.size.scrollerHeight === 0)
            return;

        if (this._blockScrolling)
            return;

        var pos = this.getCursorPixelPosition();

        var left = pos.left;
        var top = pos.top;

        if (this.scrollTop > top)
            this.scrollToY(top);

        if (this.scrollTop + this.size.scrollerHeight < top + this.charSize.height)
            this.scrollToY(top + this.charSize.height - this.size.scrollerHeight);

        var scrollLeft = this.scrollLeft;

        if (scrollLeft > left)
            this.scrollToX(left);

        if (scrollLeft + this.size.scrollerWidth < left + this.charSize.width)
            this.scrollToX(Math.round(left + this.charSize.width - this.size.scrollerWidth));
    };

    // SETTINGS
    
    this.setBuffer = function(buffer) {
        if (!buffer)
            throw new Error("Buffer cannot be null");
            
        if (this.buffer === buffer)
            return;
            
        var oldValue = this.buffer;
        this.buffer = buffer;
        this.selection = buffer.getSelection();
        
        this._emit("changeBuffer", {oldValue: oldValue, value: buffer});
    };
    
    this.setTheme = function(theme) {
        var _self = this;

        this.$themeValue = theme;
        (function(next) {
            if (!theme || typeof theme == "string") {
                theme = theme || "ace/theme/textmate";
                require([theme], function(theme) {
                    next(theme);
                });
            } else {
                next(theme);
            }
        })(function next(theme) {
            if (_self.theme == theme)
                return;
                
            _self.theme = theme;
            _self._emit("changeTheme");
        });
    };

    this.getTheme = function() {
        return this.theme;
    };
    
    this.setShowInvisibles = function(showInvisibles) {
        if (this.showInvisibles == showInvisibles)
            return;

        this.showInvisibles = showInvisibles;
        this._emit("changeShowInvisibles");
    };
    
    this.getShowInvisibles = function() {
        return this.showInvisibles;
    };

    this.setShowPrintMargin = function(showPrintMargin) {
        if (this.showPrintMargin == showPrintMargin)
            return;
            
        this.showPrintMargin = showPrintMargin;
        this._emit("changePrintMargin");
    };

    this.getShowPrintMargin = function() {
        return this.showPrintMargin;
    };
    
    this.setPrintMarginColumn = function(printMarginColumn) {
        if (this.printMarginColumn == printMarginColumn)
            return;
            
        this.printMarginColumn = printMarginColumn;
        this._emit("changePrintMargin");
    };
    
    this.getPrintMarginColumn = function() {
        return this.printMarginColumn;
    };
    
    this.setShowGutter = function(showGutter){
        if(this.showGutter === showGutter)
            return;
            
        this.showGutter = showGutter;
        this._emit("changeShowGutter");
    };
    
    this.getShowGutter = function(){
        return this.showGutter;
    };
    
    this.setPadding = function(padding) {
        if (this.padding == padding)
            return;
            
        this.padding = padding;
        this._emit("changePadding");
    };
    
    this.getPadding = function() {
        return this.padding;
    };
    
    this.setHScrollBarAlwaysVisible = function(alwaysVisible) {
        if (this.horizScrollAlwaysVisible == alwaysVisible)
            return;
            
        this.horizScrollAlwaysVisible = alwaysVisible;
        this._emit("changeHorizScroll");
    };

    this.getHScrollBarAlwaysVisible = function() {
        return this.horizScrollAlwaysVisible;
    };
    
    this.setSelectionStyle = function(style) {
        if (this.selectionStyle === style)
            return;

        this.selectionStyle = style;
        this._dispatchEvent("changeSelectionStyle");
    };

    this.getSelectionStyle = function() {
        return this.selectionStyle;
    };

    this.setHighlightActiveLine = function(shouldHighlight) {
        if (this.highlightActiveLine == shouldHighlight)
            return;

        this.highlightActiveLine = shouldHighlight;
        this._dispatchEvent("changeHighlightActiveLine");
    };

    this.getHighlightActiveLine = function() {
        return this.highlightActiveLine;
    };
    
    this.setHighlightSelectedWord = function(shouldHighlight) {
        if (this.highlightSelectedWord == shouldHighlight)
            return;

        this.highlightSelectedWord = shouldHighlight;
        this._dispatchEvent("changeHighlightSelectedWord");
    };

    this.getHighlightSelectedWord = function() {
        return this.highlightSelectedWord;
    };

}).call(Window.prototype);

});