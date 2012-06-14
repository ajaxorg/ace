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
 *      Sergi Mansilla <sergi AT c9 DOT io>
 *      Harutyun Amirjanyan <harutyun AT c9 DOT io>
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

"never use strict";

var util = require("./maps/util");
var motions = require("./maps/motions");
var operators = require("./maps/operators");
var alias = require("./maps/aliases");
var registers = require("./registers");

var NUMBER = 1;
var OPERATOR = 2;
var MOTION = 3;
var ACTION = 4;
var HMARGIN = 8; // Minimum amount of line separation between margins;

var repeat = function repeat(fn, count, args) {
    while (0 < count--)
        fn.apply(this, args);
};

var ensureScrollMargin = function(editor) {
    var renderer = editor.renderer;
    var pos = renderer.$cursorLayer.getPixelPosition();

    var top = pos.top;

    var margin = HMARGIN * renderer.layerConfig.lineHeight;
    if (2 * margin > renderer.$size.scrollerHeight)
        margin = renderer.$size.scrollerHeight / 2;

    if (renderer.scrollTop > top - margin) {
        renderer.session.setScrollTop(top - margin);
    }

    if (renderer.scrollTop + renderer.$size.scrollerHeight < top + margin + renderer.lineHeight) {
        renderer.session.setScrollTop(top + margin + renderer.lineHeight - renderer.$size.scrollerHeight);
    }
};

var actions = exports.actions = {
    "z": {
        param: true,
        fn: function(editor, range, count, param) {
            switch (param) {
                case "z":
                    editor.alignCursor(null, 0.5);
                    break;
                case "t":
                    editor.alignCursor(null, 0);
                    break;
                case "b":
                    editor.alignCursor(null, 1);
                    break;
            }
        }
    },
    "r": {
        param: true,
        fn: function(editor, range, count, param) {
            if (param && param.length) {
                repeat(function() { editor.insert(param); }, count || 1);
                editor.navigateLeft();
            }
        }
    },
    "R": {
        fn: function(editor, range, count, param) {
            util.insertMode(editor);
            editor.setOverwrite(true);
        }
    },
    "~": {
        fn: function(editor, range, count) {
            repeat(function() {
                var range = editor.selection.getRange();
                if (range.isEmpty())
                    range.end.column++;
                var text = editor.session.getTextRange(range);
                var toggled = text.toUpperCase();
                if (toggled == text)
                    editor.navigateRight();
                else
                    editor.session.replace(range, toggled);
            }, count || 1);
        }
    },
    "*": {
        fn: function(editor, range, count, param) {
            editor.selection.selectWord();
            editor.findNext();
            ensureScrollMargin(editor);
            var r = editor.selection.getRange();
            editor.selection.setSelectionRange(r, true);
        }
    },
    "#": {
        fn: function(editor, range, count, param) {
            editor.selection.selectWord();
            editor.findPrevious();
            ensureScrollMargin(editor);
            var r = editor.selection.getRange();
            editor.selection.setSelectionRange(r, true);
        }
    },
    "n": {
        fn: function(editor, range, count, param) {
            var options = editor.getLastSearchOptions();
            options.backwards = false;

            editor.selection.moveCursorRight();
            editor.selection.clearSelection();
            editor.findNext(options);

            ensureScrollMargin(editor);
            var r = editor.selection.getRange();
            r.end.row = r.start.row;
            r.end.column = r.start.column;
            editor.selection.setSelectionRange(r, true);
        }
    },
    "N": {
        fn: function(editor, range, count, param) {
            var options = editor.getLastSearchOptions();
            options.backwards = true;

            editor.findPrevious(options);
            ensureScrollMargin(editor);
            var r = editor.selection.getRange();
            r.end.row = r.start.row;
            r.end.column = r.start.column;
            editor.selection.setSelectionRange(r, true);
        }
    },
    "v": {
        fn: function(editor, range, count, param) {
            editor.selection.selectRight();
            util.visualMode(editor, false);
        },
        acceptsMotion: true
    },
    "V": {
        fn: function(editor, range, count, param) {
            //editor.selection.selectLine();
            //editor.selection.selectLeft();
            var row = editor.getCursorPosition().row;
            editor.selection.clearSelection();
            editor.selection.moveCursorTo(row, 0);
            editor.selection.selectLineEnd();
            editor.selection.visualLineStart = row;

            util.visualMode(editor, true);
        },
        acceptsMotion: true
    },
    "Y": {
        fn: function(editor, range, count, param) {
            util.copyLine(editor);
        }
    },
    "p": {
        fn: function(editor, range, count, param) {
            var defaultReg = registers._default;

            editor.setOverwrite(false);
            if (defaultReg.isLine) {
                var pos = editor.getCursorPosition();
                var lines = defaultReg.text.split("\n");
                editor.session.getDocument().insertLines(pos.row + 1, lines);
                editor.moveCursorTo(pos.row + 1, 0);
            }
            else {
                editor.navigateRight();
                editor.insert(defaultReg.text);
                editor.navigateLeft();
            }
            editor.setOverwrite(true);
            editor.selection.clearSelection();
        }
    },
    "P": {
        fn: function(editor, range, count, param) {
            var defaultReg = registers._default;
            editor.setOverwrite(false);

            if (defaultReg.isLine) {
                var pos = editor.getCursorPosition();
                var lines = defaultReg.text.split("\n");
                editor.session.getDocument().insertLines(pos.row, lines);
                editor.moveCursorTo(pos.row, 0);
            }
            else {
                editor.insert(defaultReg.text);
            }
            editor.setOverwrite(true);
            editor.selection.clearSelection();
        }
    },
    "J": {
        fn: function(editor, range, count, param) {
            var session = editor.session;
            range = editor.getSelectionRange();
            var pos = {row: range.start.row, column: range.start.column};
            count = count || range.end.row - range.start.row;
            var maxRow = Math.min(pos.row + (count || 1), session.getLength() - 1);

            range.start.column = session.getLine(pos.row).length;
            range.end.column = session.getLine(maxRow).length;
            range.end.row = maxRow;

            var text = "";
            for (var i = pos.row; i < maxRow; i++) {
                var nextLine = session.getLine(i + 1);
                text += " " + /^\s*(.*)$/.exec(nextLine)[1] || "";
            }

            session.replace(range, text);
            editor.moveCursorTo(pos.row, pos.column);
        }
    },
    "u": {
        fn: function(editor, range, count, param) {
            count = parseInt(count || 1, 10);
            for (var i = 0; i < count; i++) {
                editor.undo();
            }
            editor.selection.clearSelection();
        }
    },
    "ctrl-r": {
        fn: function(editor, range, count, param) {
            count = parseInt(count || 1, 10);
            for (var i = 0; i < count; i++) {
                editor.redo();
            }
            editor.selection.clearSelection();
        }
    },
    ":": {
        fn: function(editor, range, count, param) {
            // not implemented
        }
    },
    "/": {
        fn: function(editor, range, count, param) {
            // not implemented
        }
    },
    "?": {
        fn: function(editor, range, count, param) {
            // not implemented
        }
    },
    ".": {
        fn: function(editor, range, count, param) {
            util.onInsertReplaySequence = inputBuffer.lastInsertCommands;
            var previous = inputBuffer.previous;
            if (previous) // If there is a previous action
                inputBuffer.exec(editor, previous.action, previous.param);
        }
    }
};

var inputBuffer = exports.inputBuffer = {
    accepting: [NUMBER, OPERATOR, MOTION, ACTION],
    currentCmd: null,
    //currentMode: 0,
    currentCount: "",

    // Types
    operator: null,
    motion: null,

    lastInsertCommands: [],

    push: function(editor, char, keyId) {
        this.idle = false;
        var wObj = this.waitingForParam;
        if (wObj) {
            this.exec(editor, wObj, char);
        }
        // If input is a number (that doesn't start with 0)
        else if (!(char === "0" && !this.currentCount.length) &&
            (char.match(/^\d+$/) && this.isAccepting(NUMBER))) {
            // Assuming that char is always of type String, and not Number
            this.currentCount += char;
            this.currentCmd = NUMBER;
            this.accepting = [NUMBER, OPERATOR, MOTION, ACTION];
        }
        else if (!this.operator && this.isAccepting(OPERATOR) && operators[char]) {
            this.operator = {
                char: char,
                count: this.getCount()
            };
            this.currentCmd = OPERATOR;
            this.accepting = [NUMBER, MOTION, ACTION];
            this.exec(editor, { operator: this.operator });
        }
        else if (motions[char] && this.isAccepting(MOTION)) {
            this.currentCmd = MOTION;

            var ctx = {
                operator: this.operator,
                motion: {
                    char: char,
                    count: this.getCount()
                }
            };

            if (motions[char].param)
                this.waitForParam(ctx);
            else
                this.exec(editor, ctx);
        }
        else if (alias[char] && this.isAccepting(MOTION)) {
            alias[char].operator.count = this.getCount();
            this.exec(editor, alias[char]);
        }
        else if (actions[char] && this.isAccepting(ACTION)) {
            var actionObj = {
                action: {
                    fn: actions[char].fn,
                    count: this.getCount()
                }
            };

            if (actions[char].param) {
                this.waitForParam(actionObj);
            }
            else {
                this.exec(editor, actionObj);
            }

            if (actions[char].acceptsMotion)
                this.idle = false;
        }
        else if (this.operator) {
            this.exec(editor, { operator: this.operator }, char);
        }
        else {
            this.reset();
        }
    },

    waitForParam: function(cmd) {
        this.waitingForParam = cmd;
    },

    getCount: function() {
        var count = this.currentCount;
        this.currentCount = "";
        return count && parseInt(count, 10);
    },

    exec: function(editor, action, param) {
        var m = action.motion;
        var o = action.operator;
        var a = action.action;

        if (!param)
            param = action.param;

        if (o) {
            this.previous = {
                action: action,
                param: param
            };
        }

        if (o && !editor.selection.isEmpty()) {
            if (operators[o.char].selFn) {
                operators[o.char].selFn(editor, editor.getSelectionRange(), o.count, param);
                this.reset();
            }
            return;
        }

        // There is an operator, but no motion or action. We try to pass the
        // current char to the operator to see if it responds to it (an example
        // of this is the 'dd' operator).
        else if (!m && !a && o && param) {
            operators[o.char].fn(editor, null, o.count, param);
            this.reset();
        }
        else if (m) {
            var run = function(fn) {
                if (fn && typeof fn === "function") { // There should always be a motion
                    if (m.count && !motionObj.handlesCount)
                        repeat(fn, m.count, [editor, null, m.count, param]);
                    else
                        fn(editor, null, m.count, param);
                }
            };

            var motionObj = motions[m.char];
            var selectable = motionObj.sel;

            if (!o) {
                if ((util.onVisualMode || util.onVisualLineMode) && selectable)
                    run(motionObj.sel);
                else
                    run(motionObj.nav);
            }
            else if (selectable) {
                repeat(function() {
                    run(motionObj.sel);
                    operators[o.char].fn(editor, editor.getSelectionRange(), o.count, param);
                }, o.count || 1);
            }
            this.reset();
        }
        else if (a) {
            a.fn(editor, editor.getSelectionRange(), a.count, param);
            this.reset();
        }
        handleCursorMove(editor);
    },

    isAccepting: function(type) {
        return this.accepting.indexOf(type) !== -1;
    },

    reset: function() {
        this.operator = null;
        this.motion = null;
        this.currentCount = "";
        this.accepting = [NUMBER, OPERATOR, MOTION, ACTION];
        this.idle = true;
        this.waitingForParam = null;
    }
};

function setPreviousCommand(fn) {
    inputBuffer.previous = { action: { action: { fn: fn } } };
}

exports.coreCommands = {
    start: {
        exec: function start(editor) {
            util.insertMode(editor);
            setPreviousCommand(start);
        }
    },
    startBeginning: {
        exec: function startBeginning(editor) {
            editor.navigateLineStart();
            util.insertMode(editor);
            setPreviousCommand(startBeginning);
        }
    },
    // Stop Insert mode as soon as possible. Works like typing <Esc> in
    // insert mode.
    stop: {
        exec: function stop(editor) {
            inputBuffer.reset();
            util.onVisualMode = false;
            util.onVisualLineMode = false;
            inputBuffer.lastInsertCommands = util.normalMode(editor);
        }
    },
    append: {
        exec: function append(editor) {
            var pos = editor.getCursorPosition();
            var lineLen = editor.session.getLine(pos.row).length;
            if (lineLen)
                editor.navigateRight();
            util.insertMode(editor);
            setPreviousCommand(append);
        }
    },
    appendEnd: {
        exec: function appendEnd(editor) {
            editor.navigateLineEnd();
            util.insertMode(editor);
            setPreviousCommand(appendEnd);
        }
    }
};

var handleCursorMove = exports.onCursorMove = function(editor, e) {
    if (util.currentMode === 'insert' || handleCursorMove.running)
        return;
    else if(!editor.selection.isEmpty()) {
        handleCursorMove.running = true;
        if (util.onVisualLineMode) {
            var originRow = editor.selection.visualLineStart;
            var cursorRow = editor.getCursorPosition().row;
            if(originRow <= cursorRow) {
                var endLine = editor.session.getLine(cursorRow);
                editor.selection.clearSelection();
                editor.selection.moveCursorTo(originRow, 0);
                editor.selection.selectTo(cursorRow, endLine.length);
            } else {
                var endLine = editor.session.getLine(originRow);
                editor.selection.clearSelection();
                editor.selection.moveCursorTo(originRow, endLine.length);
                editor.selection.selectTo(cursorRow, 0);
            }
        }
        handleCursorMove.running = false;
        return;
    }
    else {
        if (e && (util.onVisualLineMode || util.onVisualMode)) {
            editor.selection.clearSelection();
            util.normalMode(editor);
        }

        handleCursorMove.running = true;
        var pos = editor.getCursorPosition();
        var lineLen = editor.session.getLine(pos.row).length;

        if (lineLen && pos.column === lineLen)
            editor.navigateLeft();
        handleCursorMove.running = false;
    }
};
});
