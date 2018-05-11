/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var bidiUtil = require("./lib/bidiutil");
var lang = require("./lib/lang");
var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\u202B]/;

/**
 * This object is used to ensure Bi-Directional support (for languages with text flowing from right to left, like Arabic or Hebrew)
 * including correct caret positioning, text selection mouse and keyboard arrows functioning
 * @class BidiHandler
 **/

/**
 * Creates a new `BidiHandler` object
 * @param {EditSession} session The session to use
 *
 * @constructor
 **/
var BidiHandler = function(session) {
    this.session = session;
    this.bidiMap = {};
    /* current screen row */
    this.currentRow = null;
    this.bidiUtil = bidiUtil;
    /* Arabic/Hebrew character width differs from regular character width */
    this.charWidths = [];
    this.EOL = "\xAC";
    this.showInvisibles = true;
    this.isRtlDir = false;
    this.line = "";
    this.wrapIndent = 0;
    this.EOF = "\xB6";
    this.RLE = "\u202B";
    this.contentWidth = 0;
    this.fontMetrics = null;
    this.rtlLineOffset = 0;
    this.wrapOffset = 0;
    this.isMoveLeftOperation = false;
    this.seenBidi = bidiRE.test(session.getValue());
};

(function() {
    /**
     * Returns 'true' if row contains Bidi characters, in such case
     * creates Bidi map to be used in operations related to selection
     * (keyboard arrays, mouse click, select)
     * @param {Number} the screen row to be checked
     * @param {Number} the document row to be checked [optional]
     * @param {Number} the wrapped screen line index [ optional]
    **/
    this.isBidiRow = function(screenRow, docRow, splitIndex) {
        if (!this.seenBidi)
            return false;
        if (screenRow !== this.currentRow) {
            this.currentRow = screenRow;
            this.updateRowLine(docRow, splitIndex);
            this.updateBidiMap();
        }
        return this.bidiMap.bidiLevels;
    };

    this.onChange = function(delta) {
        if (!this.seenBidi) {
            if (delta.action == "insert" && bidiRE.test(delta.lines.join("\n"))) {
                this.seenBidi = true;
                this.currentRow = null;
            }
        } 
        else {
            this.currentRow = null;
        }
    };

    this.getDocumentRow = function() {
        var docRow = 0;
        var rowCache = this.session.$screenRowCache;
        if (rowCache.length) {
            var index = this.session.$getRowCacheIndex(rowCache, this.currentRow);
            if (index >= 0)
                docRow = this.session.$docRowCache[index];
        }

        return docRow;
    };

    this.getSplitIndex = function() {
        var splitIndex = 0;
        var rowCache = this.session.$screenRowCache;
        if (rowCache.length) {
            var currentIndex, prevIndex = this.session.$getRowCacheIndex(rowCache, this.currentRow);
            while (this.currentRow - splitIndex > 0) {
                currentIndex = this.session.$getRowCacheIndex(rowCache, this.currentRow - splitIndex - 1);
                if (currentIndex !== prevIndex)
                    break;

                prevIndex = currentIndex;
                splitIndex++;
            }
        } else {
            splitIndex = this.currentRow;
        }

        return splitIndex;
    };

    this.updateRowLine = function(docRow, splitIndex) {
        if (docRow === undefined)
            docRow = this.getDocumentRow();
            
        var isLastRow = (docRow === this.session.getLength() - 1),
            endOfLine = isLastRow ? this.EOF : this.EOL;

        this.wrapIndent = 0;
        this.line = this.session.getLine(docRow);
        this.isRtlDir = this.line.charAt(0) === this.RLE;
        if (this.session.$useWrapMode) {
            var splits = this.session.$wrapData[docRow];
            if (splits) {
                if (splitIndex === undefined)
                    splitIndex = this.getSplitIndex();

                if(splitIndex > 0 && splits.length) {
                    this.wrapIndent = splits.indent;
                    this.wrapOffset = this.wrapIndent * this.charWidths[bidiUtil.L];
                    this.line = (splitIndex < splits.length) ?
                        this.line.substring(splits[splitIndex - 1], splits[splitIndex]) :
                            this.line.substring(splits[splits.length - 1]);
                } else {
                    this.line = this.line.substring(0, splits[splitIndex]);
                }
            }
            if (splitIndex == splits.length)
                this.line += (this.showInvisibles) ? endOfLine : bidiUtil.DOT;
        } else {
            this.line += this.showInvisibles ? endOfLine : bidiUtil.DOT;
        }
            
        /* replace tab and wide characters by commensurate spaces */
        var session = this.session, shift = 0, size;
        this.line = this.line.replace(/\t|[\u1100-\u2029, \u202F-\uFFE6]/g, function(ch, i){
            if (ch === '\t' || session.isFullWidth(ch.charCodeAt(0))) {
                size = (ch === '\t') ? session.getScreenTabSize(i + shift) : 2;
                shift += size - 1;
                return lang.stringRepeat(bidiUtil.DOT, size);
            }
            return ch;
        });

        if (this.isRtlDir) {
            this.fontMetrics.$main.innerHTML = (this.line.charAt(this.line.length - 1) == bidiUtil.DOT) ? this.line.substr(0, this.line.length - 1) : this.line;
            this.rtlLineOffset = this.contentWidth - this.fontMetrics.$main.getBoundingClientRect().width;
        }
    };
    
    this.updateBidiMap = function() {
        var textCharTypes = [];
        if (bidiUtil.hasBidiCharacters(this.line, textCharTypes) || this.isRtlDir) {
             this.bidiMap = bidiUtil.doBidiReorder(this.line, textCharTypes, this.isRtlDir);
        } else {
            this.bidiMap = {};
        }
    };

    /**
     * Resets stored info related to current screen row
    **/
    this.markAsDirty = function() {
        this.currentRow = null;
    };

    /**
     * Updates array of character widths
     * @param {Object} font metrics
     *
    **/
    this.updateCharacterWidths = function(fontMetrics) {
        if (this.characterWidth === fontMetrics.$characterSize.width)
            return;

        this.fontMetrics = fontMetrics;
        var characterWidth = this.characterWidth = fontMetrics.$characterSize.width;
        var bidiCharWidth = fontMetrics.$measureCharWidth("\u05d4");

        this.charWidths[bidiUtil.L] = this.charWidths[bidiUtil.EN] = this.charWidths[bidiUtil.ON_R] = characterWidth;
        this.charWidths[bidiUtil.R] = this.charWidths[bidiUtil.AN] = bidiCharWidth;
        this.charWidths[bidiUtil.R_H] = bidiCharWidth * 0.45;
        this.charWidths[bidiUtil.B] = this.charWidths[bidiUtil.RLE] = 0;

        this.currentRow = null;
    };

    this.setShowInvisibles = function(showInvisibles) {
        this.showInvisibles = showInvisibles;
        this.currentRow = null;
    };

    this.setEolChar = function(eolChar) {
        this.EOL = eolChar; 
    };

    this.setContentWidth = function(width) {
        this.contentWidth = width;
    };

    this.isRtlLine = function(row) {
        if (row != undefined)
            return (this.session.getLine(row).charAt(0) == this.RLE);
        else
            return this.isRtlDir; 
    };

    this.setRtlDirection = function(editor, isRtlDir) {
        var cursor = editor.getCursorPosition(); 
        for (var row = editor.selection.getSelectionAnchor().row; row <= cursor.row; row++) {
            if (!isRtlDir && editor.session.getLine(row).charAt(0) === editor.session.$bidiHandler.RLE)
                editor.session.doc.removeInLine(row, 0, 1);
            else if (isRtlDir && editor.session.getLine(row).charAt(0) !== editor.session.$bidiHandler.RLE)
                editor.session.doc.insert({column: 0, row: row}, editor.session.$bidiHandler.RLE);
        }
    };


    /**
     * Returns offset of character at position defined by column.
     * @param {Number} the screen column position
     *
     * @return {int} horizontal pixel offset of given screen column
     **/
    this.getPosLeft = function(col) {
        col -= this.wrapIndent;
        var leftBoundary = (this.line.charAt(0) === this.RLE) ? 1 : 0;
        var logicalIdx = (col > leftBoundary) ? (this.session.getOverwrite() ? col : col - 1) : leftBoundary;
        var visualIdx = bidiUtil.getVisualFromLogicalIdx(logicalIdx, this.bidiMap),
            levels = this.bidiMap.bidiLevels, left = 0;

        if (!this.session.getOverwrite() && col <= leftBoundary && levels[visualIdx] % 2 !== 0)
            visualIdx++;
            
        for (var i = 0; i < visualIdx; i++) {
            left += this.charWidths[levels[i]];
        }

        if (!this.session.getOverwrite() && (col > leftBoundary) && (levels[visualIdx] % 2 === 0))
            left += this.charWidths[levels[visualIdx]];

        if (this.wrapIndent)
            left += this.isRtlDir ? (-1 * this.wrapOffset) : this.wrapOffset;

        if (this.isRtlDir)
            left += this.rtlLineOffset;

        return left;
    };

    /**
     * Returns 'selections' - array of objects defining set of selection rectangles
     * @param {Number} the start column position
     * @param {Number} the end column position
     *
     * @return {Array of Objects} Each object contains 'left' and 'width' values defining selection rectangle.
    **/
    this.getSelections = function(startCol, endCol) {
        var map = this.bidiMap, levels = map.bidiLevels, level, selections = [], offset = 0,
            selColMin = Math.min(startCol, endCol) - this.wrapIndent, selColMax = Math.max(startCol, endCol) - this.wrapIndent,
                isSelected = false, isSelectedPrev = false, selectionStart = 0;
            
        if (this.wrapIndent)
            offset += this.isRtlDir ? (-1 * this.wrapOffset) : this.wrapOffset;

        for (var logIdx, visIdx = 0; visIdx < levels.length; visIdx++) {
            logIdx = map.logicalFromVisual[visIdx];
            level = levels[visIdx];
            isSelected = (logIdx >= selColMin) && (logIdx < selColMax);
            if (isSelected && !isSelectedPrev) {
                selectionStart = offset;
            } else if (!isSelected && isSelectedPrev) {
                selections.push({left: selectionStart, width: offset - selectionStart});
            }
            offset += this.charWidths[level];
            isSelectedPrev = isSelected;
        }

        if (isSelected && (visIdx === levels.length)) {
            selections.push({left: selectionStart, width: offset - selectionStart});
        }

        if(this.isRtlDir) {
            for (var i = 0; i < selections.length; i++) {
                selections[i].left += this.rtlLineOffset;
            }
        }
        return selections;
    };

    /**
     * Converts character coordinates on the screen to respective document column number
     * @param {int} character horizontal offset
     *
     * @return {Number} screen column number corresponding to given pixel offset
    **/
    this.offsetToCol = function(posX) {
        if(this.isRtlDir)
            posX -= this.rtlLineOffset;

        var logicalIdx = 0, posX = Math.max(posX, 0),
            offset = 0, visualIdx = 0, levels = this.bidiMap.bidiLevels,
                charWidth = this.charWidths[levels[visualIdx]];

        if (this.wrapIndent)
           posX -= this.isRtlDir ? (-1 * this.wrapOffset) : this.wrapOffset;
    
        while(posX > offset + charWidth/2) {
            offset += charWidth;
            if(visualIdx === levels.length - 1) {
                /* quit when we on the right of the last character, flag this by charWidth = 0 */
                charWidth = 0;
                break;
            }
            charWidth = this.charWidths[levels[++visualIdx]];
        }
    
        if (visualIdx > 0 && (levels[visualIdx - 1] % 2 !== 0) && (levels[visualIdx] % 2 === 0)){
        /* Bidi character on the left and None Bidi character on the right */
            if(posX < offset)
                visualIdx--;
            logicalIdx = this.bidiMap.logicalFromVisual[visualIdx];

        } else if (visualIdx > 0 && (levels[visualIdx - 1] % 2 === 0) && (levels[visualIdx] % 2 !== 0)){
        /* None Bidi character on the left and Bidi character on the right */
            logicalIdx = 1 + ((posX > offset) ? this.bidiMap.logicalFromVisual[visualIdx]
                    : this.bidiMap.logicalFromVisual[visualIdx - 1]);

        } else if ((this.isRtlDir && visualIdx === levels.length - 1 && charWidth === 0 && (levels[visualIdx - 1] % 2 === 0))
                || (!this.isRtlDir && visualIdx === 0 && (levels[visualIdx] % 2 !== 0))){
        /* To the right of last character, which is None Bidi, in RTL direction or */
        /* to the left of first Bidi character, in LTR direction */
            logicalIdx = 1 + this.bidiMap.logicalFromVisual[visualIdx];
        } else {
            /* Tweak visual position when Bidi character on the left in order to map it to corresponding logical position */
            if (visualIdx > 0 && (levels[visualIdx - 1] % 2 !== 0) && charWidth !== 0)
                visualIdx--;

            /* Regular case */
            logicalIdx = this.bidiMap.logicalFromVisual[visualIdx];
        }

        if (logicalIdx === 0 && this.isRtlDir)
            logicalIdx++;

        return (logicalIdx + this.wrapIndent);
    };

}).call(BidiHandler.prototype);

exports.BidiHandler = BidiHandler;
});
