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

var keepScrollPosition = function(editor, fn) {
    var scrollTopRow = editor.renderer.getScrollTopRow();
    var initialRow = editor.getCursorPosition().row;
    var diff = initialRow - scrollTopRow;
    fn && fn.call(editor);
    editor.renderer.scrollToRow(editor.getCursorPosition().row - diff);
};

function Motion(m) {
    if (typeof m == "function") {
        var getPos = m;
        m = this;
    } else {
        var getPos = m.getPos;
    }
    m.nav = function(editor, range, count, param) {
        var a = getPos(editor, range, count, param, false);
        if (!a)
            return;
        editor.selection.moveTo(a.row, a.column);
    };
    m.sel = function(editor, range, count, param) {
        var a = getPos(editor, range, count, param, true);
        if (!a)
            return;
        editor.selection.selectTo(a.row, a.column);
    };
    return m;
}

var nonWordRe = /[\s.\/\\()\"'-:,.;<>~!@#$%^&*|+=\[\]{}`~?]/;
var wordSeparatorRe = /[.\/\\()\"'-:,.;<>~!@#$%^&*|+=\[\]{}`~?]/;
var whiteRe = /\s/;
var StringStream = function(editor, cursor) {
    var sel = editor.selection;
    this.range = sel.getRange();
    cursor = cursor || sel.selectionLead;
    this.row = cursor.row;
    this.col = cursor.column;
    var line = editor.session.getLine(this.row);
    var maxRow = editor.session.getLength();
    this.ch = line[this.col] || '\n';
    this.skippedLines = 0;

    this.next = function() {
        this.ch = line[++this.col] || this.handleNewLine(1);
        //this.debug()
        return this.ch;
    };
    this.prev = function() {
        this.ch = line[--this.col] || this.handleNewLine(-1);
        //this.debug()
        return this.ch;
    };
    this.peek = function(dir) {
        var ch = line[this.col + dir];
        if (ch)
            return ch;
        if (dir == -1)
            return '\n';
        if (this.col == line.length - 1)
            return '\n';
        return editor.session.getLine(this.row + 1)[0] || '\n';
    };

    this.handleNewLine = function(dir) {
        if (dir == 1){
            if (this.col == line.length)
                return '\n';
            if (this.row == maxRow - 1)
                return '';
            this.col = 0;
            this.row ++;
            line = editor.session.getLine(this.row);
            this.skippedLines++;
            return line[0] || '\n';
        }
        if (dir == -1) {
            if (this.row === 0)
                return '';
            this.row --;
            line = editor.session.getLine(this.row);
            this.col = line.length;
            this.skippedLines--;
            return '\n';
        }
    };
    this.debug = function() {
        console.log(line.substring(0, this.col)+'|'+this.ch+'\''+this.col+'\''+line.substr(this.col+1));
    };
};

var Search = require("../../../search").Search;
var search = new Search();

function find(editor, needle, dir) {
    search.$options.needle = needle;
    search.$options.backwards = dir == -1;
    return search.find(editor.session);
}

var Range = require("../../../range").Range;

var LAST_SEARCH_MOTION = {};

module.exports = {
    "w": new Motion(function(editor) {
        var str = new StringStream(editor);

        if (str.ch && wordSeparatorRe.test(str.ch)) {
            while (str.ch && wordSeparatorRe.test(str.ch))
                str.next();
        } else {
            while (str.ch && !nonWordRe.test(str.ch))
                str.next();
        }
        while (str.ch && whiteRe.test(str.ch) && str.skippedLines < 2)
            str.next();

        str.skippedLines == 2 && str.prev();
        return {column: str.col, row: str.row};
    }),
    "W": new Motion(function(editor) {
        var str = new StringStream(editor);
        while(str.ch && !(whiteRe.test(str.ch) && !whiteRe.test(str.peek(1))) && str.skippedLines < 2)
            str.next();
        if (str.skippedLines == 2)
            str.prev();
        else
            str.next();

        return {column: str.col, row: str.row};
    }),
    "b": new Motion(function(editor) {
        var str = new StringStream(editor);

        str.prev();
        while (str.ch && whiteRe.test(str.ch) && str.skippedLines > -2)
            str.prev();

        if (str.ch && wordSeparatorRe.test(str.ch)) {
            while (str.ch && wordSeparatorRe.test(str.ch))
                str.prev();
        } else {
            while (str.ch && !nonWordRe.test(str.ch))
                str.prev();
        }
        str.ch && str.next();
        return {column: str.col, row: str.row};
    }),
    "B": new Motion(function(editor) {
        var str = new StringStream(editor);
        str.prev();
        while(str.ch && !(!whiteRe.test(str.ch) && whiteRe.test(str.peek(-1))) && str.skippedLines > -2)
            str.prev();

        if (str.skippedLines == -2)
            str.next();

        return {column: str.col, row: str.row};
    }),
    "e": new Motion(function(editor) {
        var str = new StringStream(editor);

        str.next();
        while (str.ch && whiteRe.test(str.ch))
            str.next();

        if (str.ch && wordSeparatorRe.test(str.ch)) {
            while (str.ch && wordSeparatorRe.test(str.ch))
                str.next();
        } else {
            while (str.ch && !nonWordRe.test(str.ch))
                str.next();
        }
        str.ch && str.prev();
        return {column: str.col, row: str.row};
    }),
    "E": new Motion(function(editor) {
        var str = new StringStream(editor);
        str.next();
        while(str.ch && !(!whiteRe.test(str.ch) && whiteRe.test(str.peek(1))))
            str.next();

        return {column: str.col, row: str.row};
    }),

    "l": {
        nav: function(editor) {
            var pos = editor.getCursorPosition();
            var col = pos.column;
            var lineLen = editor.session.getLine(pos.row).length;
            if (lineLen && col !== lineLen)
                editor.navigateRight();
        },
        sel: function(editor) {
            var pos = editor.getCursorPosition();
            var col = pos.column;
            var lineLen = editor.session.getLine(pos.row).length;

            // Solving the behavior at the end of the line due to the
            // different 0 index-based colum positions in ACE.
            if (lineLen && col !== lineLen) //In selection mode you can select the newline
                editor.selection.selectRight();
        }
    },
    "h": {
        nav: function(editor) {
            var pos = editor.getCursorPosition();
            if (pos.column > 0)
                editor.navigateLeft();
        },
        sel: function(editor) {
            var pos = editor.getCursorPosition();
            if (pos.column > 0)
                editor.selection.selectLeft();
        }
    },
    "H": {
        nav: function(editor) {
            var row = editor.renderer.getScrollTopRow();
            editor.moveCursorTo(row);
        },
        sel: function(editor) {
            var row = editor.renderer.getScrollTopRow();
            editor.selection.selectTo(row);
        }
    },
    "M": {
        nav: function(editor) {
            var topRow = editor.renderer.getScrollTopRow();
            var bottomRow = editor.renderer.getScrollBottomRow();
            var row = topRow + ((bottomRow - topRow) / 2);
            editor.moveCursorTo(row);
        },
        sel: function(editor) {
            var topRow = editor.renderer.getScrollTopRow();
            var bottomRow = editor.renderer.getScrollBottomRow();
            var row = topRow + ((bottomRow - topRow) / 2);
            editor.selection.selectTo(row);
        }
    },
    "L": {
        nav: function(editor) {
            var row = editor.renderer.getScrollBottomRow();
            editor.moveCursorTo(row);
        },
        sel: function(editor) {
            var row = editor.renderer.getScrollBottomRow();
            editor.selection.selectTo(row);
        }
    },
    "k": {
        nav: function(editor) {
            editor.navigateUp();
        },
        sel: function(editor) {
            editor.selection.selectUp();
        }
    },
    "j": {
        nav: function(editor) {
            editor.navigateDown();
        },
        sel: function(editor) {
            editor.selection.selectDown();
        }
    },

    "i": {
        param: true,
        sel: function(editor, range, count, param) {
            switch (param) {
                case "w":
                    editor.selection.selectWord();
                    break;
                case "W":
                    editor.selection.selectAWord();
                    break;
                case "(":
                case "{":
                case "[":
                    var cursor = editor.getCursorPosition();
                    var end = editor.session.$findClosingBracket(param, cursor, /paren/);
                    if (!end)
                        return;
                    var start = editor.session.$findOpeningBracket(editor.session.$brackets[param], cursor, /paren/);
                    if (!start)
                        return;
                    start.column ++;
                    editor.selection.setSelectionRange(Range.fromPoints(start, end));
                    break;
                case "'":
                case '"':
                case "/":
                    var end = find(editor, param, 1);
                    if (!end)
                        return;
                    var start = find(editor, param, -1);
                    if (!start)
                        return;
                    editor.selection.setSelectionRange(Range.fromPoints(start.end, end.start));
                    break;
            }
        }
    },
    "a": {
        param: true,
        sel: function(editor, range, count, param) {
            switch (param) {
                case "w":
                    editor.selection.selectAWord();
                    break;
                case "W":
                    editor.selection.selectAWord();
                    break;
                case ")":
                case "}":
                case "]":
                    param = editor.session.$brackets[param];
                case "(":
                case "{":
                case "[":
                    var cursor = editor.getCursorPosition();
                    var end = editor.session.$findClosingBracket(param, cursor, /paren/);
                    if (!end)
                        return;
                    var start = editor.session.$findOpeningBracket(editor.session.$brackets[param], cursor, /paren/);
                    if (!start)
                        return;
                    end.column ++;
                    editor.selection.setSelectionRange(Range.fromPoints(start, end));
                    break;
                case "'":
                case "\"":
                case "/":
                    var end = find(editor, param, 1);
                    if (!end)
                        return;
                    var start = find(editor, param, -1);
                    if (!start)
                        return;
                    end.column ++;
                    editor.selection.setSelectionRange(Range.fromPoints(start.start, end.end));
                    break;
            }
        }
    },

    "f": new Motion({
        param: true,
        handlesCount: true,
        getPos: function(editor, range, count, param, isSel, isRepeat) {
            if (param == "space") param = " ";
            if (!isRepeat)
                LAST_SEARCH_MOTION = {ch: "f", param: param};
            var cursor = editor.getCursorPosition();
            var column = util.getRightNthChar(editor, cursor, param, count || 1);

            if (typeof column === "number") {
                cursor.column += column + (isSel ? 2 : 1);
                return cursor;
            }
        }
    }),
    "F": new Motion({
        param: true,
        handlesCount: true,
        getPos: function(editor, range, count, param, isSel, isRepeat) {
            if (param == "space") param = " ";
            if (!isRepeat)
                LAST_SEARCH_MOTION = {ch: "F", param: param};
            var cursor = editor.getCursorPosition();
            var column = util.getLeftNthChar(editor, cursor, param, count || 1);

            if (typeof column === "number") {
                cursor.column -= column + 1;
                return cursor;
            }
        }
    }),
    "t": new Motion({
        param: true,
        handlesCount: true,
        getPos: function(editor, range, count, param, isSel, isRepeat) {
            if (param == "space") param = " ";
            if (!isRepeat)
                LAST_SEARCH_MOTION = {ch: "t", param: param};
            var cursor = editor.getCursorPosition();
            var column = util.getRightNthChar(editor, cursor, param, count || 1);

            if (isRepeat && column == 0 && !(count > 1))
                column = util.getRightNthChar(editor, cursor, param, 2);
                
            if (typeof column === "number") {
                cursor.column += column + (isSel ? 1 : 0);
                return cursor;
            }
        }
    }),
    "T": new Motion({
        param: true,
        handlesCount: true,
        getPos: function(editor, range, count, param, isSel, isRepeat) {
            if (param == "space") param = " ";
            if (!isRepeat)
                LAST_SEARCH_MOTION = {ch: "T", param: param};
            var cursor = editor.getCursorPosition();
            var column = util.getLeftNthChar(editor, cursor, param, count || 1);

            if (isRepeat && column === 0 && !(count > 1))
                column = util.getLeftNthChar(editor, cursor, param, 2);
            
            if (typeof column === "number") {
                cursor.column -= column;
                return cursor;
            }
        }
    }),
    ";": new Motion({
        handlesCount: true,
        getPos: function(editor, range, count, param, isSel) {
            var ch = LAST_SEARCH_MOTION.ch;
            if (!ch)
                return;
            return module.exports[ch].getPos(
                editor, range, count, LAST_SEARCH_MOTION.param, isSel, true
            );
        }
    }),
    ",": new Motion({
        handlesCount: true,
        getPos: function(editor, range, count, param, isSel) {
            var ch = LAST_SEARCH_MOTION.ch;
            if (!ch)
                return;
            var up = ch.toUpperCase();
            ch = ch === up ? ch.toLowerCase() : up;
            
            return module.exports[ch].getPos(
                editor, range, count, LAST_SEARCH_MOTION.param, isSel, true
            );
        }
    }),

    "^": {
        nav: function(editor) {
            editor.navigateLineStart();
        },
        sel: function(editor) {
            editor.selection.selectLineStart();
        }
    },
    "$": {
        handlesCount: true,
        nav: function(editor, range, count, param) {
            if (count > 1) {
                editor.navigateDown(count-1);
            }
            editor.navigateLineEnd();
        },
        sel: function(editor, range, count, param) {
            if (count > 1) {
                editor.selection.moveCursorBy(count-1, 0);
            }
            editor.selection.selectLineEnd();
        }
    },
    "0": new Motion(function(ed) {
        return {row: ed.selection.lead.row, column: 0};
    }),
    "G": {
        nav: function(editor, range, count, param) {
            if (!count && count !== 0) { // Stupid JS
                count = editor.session.getLength();
            }
            editor.gotoLine(count);
        },
        sel: function(editor, range, count, param) {
            if (!count && count !== 0) { // Stupid JS
                count = editor.session.getLength();
            }
            editor.selection.selectTo(count, 0);
        }
    },
    "g": {
        param: true,
        nav: function(editor, range, count, param) {
            switch(param) {
                case "m":
                    console.log("Middle line");
                    break;
                case "e":
                    console.log("End of prev word");
                    break;
                case "g":
                    editor.gotoLine(count || 0);
                case "u":
                    editor.gotoLine(count || 0);
                case "U":
                    editor.gotoLine(count || 0);
            }
        },
        sel: function(editor, range, count, param) {
            switch(param) {
                case "m":
                    console.log("Middle line");
                    break;
                case "e":
                    console.log("End of prev word");
                    break;
                case "g":
                    editor.selection.selectTo(count || 0, 0);
            }
        }
    },
    "o": {
        nav: function(editor, range, count, param) {
            count = count || 1;
            var content = "";
            while (0 < count--)
                content += "\n";

            if (content.length) {
                editor.navigateLineEnd();
                editor.insert(content);
                util.insertMode(editor);
            }
        }
    },
    "O": {
        nav: function(editor, range, count, param) {
            var row = editor.getCursorPosition().row;
            count = count || 1;
            var content = "";
            while (0 < count--)
                content += "\n";

            if (content.length) {
                if(row > 0) {
                    editor.navigateUp();
                    editor.navigateLineEnd();
                    editor.insert(content);
                } else {
                    editor.session.insert({row: 0, column: 0}, content);
                    editor.navigateUp();
                }
                util.insertMode(editor);
            }
        }
    },
    "%": new Motion(function(editor){
        var brRe = /[\[\]{}()]/g;
        var cursor = editor.getCursorPosition();
        var ch = editor.session.getLine(cursor.row)[cursor.column];
        if (!brRe.test(ch)) {
            var range = find(editor, brRe);
            if (!range)
                return;
            cursor = range.start;
        }
        var match = editor.session.findMatchingBracket({
            row: cursor.row,
            column: cursor.column + 1
        });

        return match;
    }),
    "{": new Motion(function(ed) {
        var session = ed.session;
        var row = session.selection.lead.row;
        while(row > 0 && !/\S/.test(session.getLine(row)))
            row--;
        while(/\S/.test(session.getLine(row)))
            row--;
        return {column: 0, row: row};
    }),
    "}": new Motion(function(ed) {
        var session = ed.session;
        var l = session.getLength();
        var row = session.selection.lead.row;
        while(row < l && !/\S/.test(session.getLine(row)))
            row++;
        while(/\S/.test(session.getLine(row)))
            row++;
        return {column: 0, row: row};
    }),
    "ctrl-d": {
        nav: function(editor, range, count, param) {
            editor.selection.clearSelection();
            keepScrollPosition(editor, editor.gotoPageDown);
        },
        sel: function(editor, range, count, param) {
            keepScrollPosition(editor, editor.selectPageDown);
        }
    },
    "ctrl-u": {
        nav: function(editor, range, count, param) {
            editor.selection.clearSelection();
            keepScrollPosition(editor, editor.gotoPageUp);
        },
        sel: function(editor, range, count, param) {
            keepScrollPosition(editor, editor.selectPageUp);
        }
    },
    "`": new Motion({
        param: true,
        handlesCount: true,
        getPos: function(editor, range, count, param, isSel) {
            var s = editor.session;
            var marker = s.vimMarkers && s.vimMarkers[param];
            if (marker) {
                return marker.getPosition();
            }
        }
    }),
    "'": new Motion({
        param: true,
        handlesCount: true,
        getPos: function(editor, range, count, param, isSel) {
            var s = editor.session;
            var marker = s.vimMarkers && s.vimMarkers[param];
            if (marker) {
                var pos = marker.getPosition();
                var line = editor.session.getLine(pos.row);                
                pos.column = line.search(/\S/);
                if (pos.column == -1)
                    pos.column = line.length;
                return pos;
            }
        },
        isLine: true
    })
};

module.exports.backspace = module.exports.left = module.exports.h;
module.exports.space = module.exports['return'] = module.exports.right = module.exports.l;
module.exports.up = module.exports.k;
module.exports.down = module.exports.j;
module.exports.pagedown = module.exports["ctrl-d"];
module.exports.pageup = module.exports["ctrl-u"];
module.exports.home = module.exports["0"];
module.exports.end = module.exports["$"];

});
