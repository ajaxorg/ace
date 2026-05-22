"use strict";
/**
 * @typedef {import("./edit_session").EditSession} EditSession
 */

var bidiUtil = require("./lib/bidiutil");
var lang = require("./lib/lang");
var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\u202B]/;

/**
 * This object is used to ensure Bi-Directional support (for languages with text flowing from right to left, like Arabic or Hebrew)
 * including correct caret positioning, text selection mouse and keyboard arrows functioning
 **/
class BidiHandler {
    /**
     * Creates a new `BidiHandler` object
     * @param {EditSession} session The session to use
     **/
    constructor(session) {
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
        this.$isRtl = false;
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
    }

    /**
     * Returns 'true' if row contains Bidi characters, in such case
     * creates Bidi map to be used in operations related to selection
     * (keyboard arrays, mouse click, select)
     * @param {Number} screenRow the screen row to be checked
     * @param {Number} [docRow] the document row to be checked [optional]
     * @param {Number} [splitIndex] the wrapped screen line index [ optional]
    **/
    isBidiRow(screenRow, docRow, splitIndex) {
        if (!this.seenBidi)
            return false;
        return true;
    }

    /**
     * @param {import("../ace-internal").Ace.Delta} delta
     * @internal
     */
    onChange(delta) {
        if (!this.seenBidi) {
            if (delta.action == "insert" && bidiRE.test(delta.lines.join("\n"))) {
                this.seenBidi = true;
                this.currentRow = null;
            }
        }
        else {
            this.currentRow = null;
        }
    }

    getDocumentRow() {
        var docRow = 0;
        var rowCache = this.session.$screenRowCache;
        if (rowCache.length) {
            var index = this.session.$getRowCacheIndex(rowCache, this.currentRow);
            if (index >= 0)
                docRow = this.session.$docRowCache[index];
        }

        return docRow;
    }

    getSplitIndex() {
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
    }


    /**
     * Resets stored info related to current screen row
    **/
    markAsDirty() {
        this.currentRow = null;
    }

    setShowInvisibles(showInvisibles) {
        this.showInvisibles = showInvisibles;
        this.currentRow = null;
    }

    setEolChar(eolChar) {
        this.EOL = eolChar;
    }

    setContentWidth(width) {
        this.contentWidth = width;
    }

    isRtlLine(row) {
        if (this.$isRtl) return true;
        if (row != undefined)
            return (this.session.getLine(row).charAt(0) == this.RLE);
        else
            return this.isRtlDir;
    }

    setRtlDirection(editor, isRtlDir) {
        var cursor = editor.getCursorPosition();
        for (var row = editor.selection.getSelectionAnchor().row; row <= cursor.row; row++) {
            if (!isRtlDir && editor.session.getLine(row).charAt(0) === editor.session.$bidiHandler.RLE)
                editor.session.doc.removeInLine(row, 0, 1);
            else if (isRtlDir && editor.session.getLine(row).charAt(0) !== editor.session.$bidiHandler.RLE)
                editor.session.doc.insert({column: 0, row: row}, editor.session.$bidiHandler.RLE);
        }
    }
}

exports.BidiHandler = BidiHandler;
