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

var util = require("./util");
var registers = require("../registers");
var Range = require("../../../range").Range;

module.exports = {
    "d": {
        selFn: function(editor, range, count, param) {
            registers._default.text = editor.getCopyText();
            registers._default.isLine = util.onVisualLineMode;
            if(util.onVisualLineMode)
                editor.removeLines();
            else
                editor.session.remove(range);
            util.normalMode(editor);
        },
        fn: function(editor, range, count, param) {
            count = count || 1;
            switch (param) {
                case "d":
                    registers._default.text = "";
                    registers._default.isLine = true;
                    for (var i = 0; i < count; i++) {
                        editor.selection.selectLine();
                        registers._default.text += editor.getCopyText();
                        var selRange = editor.getSelectionRange();
                        // check if end of the document was reached
                        if (!selRange.isMultiLine()) {
                            var row = selRange.start.row - 1;
                            var col = editor.session.getLine(row).length
                            selRange.setStart(row, col);
                            editor.session.remove(selRange);
                            editor.selection.clearSelection();
                            break;
                        }
                        editor.session.remove(selRange);
                        editor.selection.clearSelection();
                    }
                    registers._default.text = registers._default.text.replace(/\n$/, "");
                    break;
                default:
                    if (range) {
                        editor.selection.setSelectionRange(range);
                        registers._default.text = editor.getCopyText();
                        registers._default.isLine = false;
                        editor.session.remove(range);
                        editor.selection.clearSelection();
                    }
            }
        }
    },
    "c": {
        selFn: function(editor, range, count, param) {
            editor.session.remove(range);
            util.insertMode(editor);
        },
        fn: function(editor, range, count, param) {
            count = count || 1;
            switch (param) {
                case "c":
                    editor.$blockScrolling++;
                    editor.selection.$moveSelection(function() {
                        editor.selection.moveCursorBy(count - 1, 0);
                    });
                    var rows = editor.$getSelectedRows();
                    range = new Range(rows.first, 0, rows.last, Infinity);
                    editor.session.remove(range);
                    editor.$blockScrolling--;
                    util.insertMode(editor);
                    break;
                default:
                    if (range) {
                        // range.end.column ++;
                        editor.session.remove(range);
                        util.insertMode(editor);
                    }
            }
        }
    },
    "y": {
        selFn: function(editor, range, count, param) {
            registers._default.text = editor.getCopyText();
            registers._default.isLine = util.onVisualLineMode;
            editor.selection.clearSelection();
            util.normalMode(editor);
        },
        fn: function(editor, range, count, param) {
            count = count || 1;
            if (param && param.isLine) 
                param = "y";
            switch (param) {
                case "y":
                    var pos = editor.getCursorPosition();
                    editor.selection.selectLine();
                    for (var i = 0; i < count - 1; i++) {
                        editor.selection.moveCursorDown();
                    }
                    registers._default.text = editor.getCopyText().replace(/\n$/, "");
                    editor.selection.clearSelection();
                    registers._default.isLine = true;
                    editor.moveCursorToPosition(pos);
                    break;
                default:
                    if (range) {
                        var pos = editor.getCursorPosition();
                        editor.selection.setSelectionRange(range);
                        registers._default.text = editor.getCopyText();
                        registers._default.isLine = false;
                        editor.selection.clearSelection();
                        editor.moveCursorTo(pos.row, pos.column);
                    }
            }
        }
    },
    ">": {
        selFn: function(editor, range, count, param) {
            count = count || 1;
            for (var i = 0; i < count; i++) {
                editor.indent();
            }
            util.normalMode(editor);
        },
        fn: function(editor, range, count, param) {
            count = parseInt(count || 1, 10);
            switch (param) {
                case ">":
                    var pos = editor.getCursorPosition();
                    editor.selection.selectLine();
                    for (var i = 0; i < count - 1; i++) {
                        editor.selection.moveCursorDown();
                    }
                    editor.indent();
                    editor.selection.clearSelection();
                    editor.moveCursorToPosition(pos);
                    editor.navigateLineEnd();
                    editor.navigateLineStart();
                    break;
            }
        }
    },
    "<": {
        selFn: function(editor, range, count, param) {
            count = count || 1;
            for (var i = 0; i < count; i++) {
                editor.blockOutdent();
            }
            util.normalMode(editor);
        },
        fn: function(editor, range, count, param) {
            count = count || 1;
            switch (param) {
                case "<":
                    var pos = editor.getCursorPosition();
                    editor.selection.selectLine();
                    for (var i = 0; i < count - 1; i++) {
                        editor.selection.moveCursorDown();
                    }
                    editor.blockOutdent();
                    editor.selection.clearSelection();
                    editor.moveCursorToPosition(pos);
                    editor.navigateLineEnd();
                    editor.navigateLineStart();
                    break;
            }
        }
    }
};
});
