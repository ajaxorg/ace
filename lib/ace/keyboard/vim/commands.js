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

"never use strict";

var lang = require("../../lib/lang");
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
                    editor.renderer.alignCursor(null, 0.5);
                    break;
                case "t":
                    editor.renderer.alignCursor(null, 0);
                    break;
                case "b":
                    editor.renderer.alignCursor(null, 1);
                    break;
                case "c":
                    editor.session.onFoldWidgetClick(range.start.row, {domEvent:{target :{}}});
                    break;
                case "o":
                    editor.session.onFoldWidgetClick(range.start.row, {domEvent:{target :{}}});
                    break;
                case "C":
                    editor.session.foldAll();
                    break;
                case "O":
                    editor.session.unfold();
                    break;
            }
        }
    },
    "r": {
        param: true,
        fn: function(editor, range, count, param) {
            if (param && param.length) {
                if (param.length > 1)
                    param = param == "return" ? "\n" : param == "tab" ? "\t" : param;
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
    "m": {
        param: true,
        fn: function(editor, range, count, param) {
            var s =  editor.session;
            var markers = s.vimMarkers || (s.vimMarkers = {});
            var c = editor.getCursorPosition();
            if (!markers[param]) {
                markers[param] = editor.session.doc.createAnchor(c);
            }
            markers[param].setPosition(c.row, c.column, true);
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
                pos.column = editor.session.getLine(pos.row).length;
                var text = lang.stringRepeat("\n" + defaultReg.text, count || 1);
                editor.session.insert(pos, text);
                editor.moveCursorTo(pos.row + 1, 0);
            }
            else {
                editor.navigateRight();
                editor.insert(lang.stringRepeat(defaultReg.text, count || 1));
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
                pos.column = 0;
                var text = lang.stringRepeat(defaultReg.text + "\n", count || 1);
                editor.session.insert(pos, text);
                editor.moveCursorToPosition(pos);
            }
            else {
                editor.insert(lang.stringRepeat(defaultReg.text, count || 1));
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
            var val = ":";
            if (count > 1)
                val = ".,.+" + count + val;
            if (editor.showCommandLine)
                editor.showCommandLine(val);
        }
    },
    "/": {
        fn: function(editor, range, count, param) {
            if (editor.showCommandLine)
                editor.showCommandLine("/");
        }
    },
    "?": {
        fn: function(editor, range, count, param) {
            if (editor.showCommandLine)
                editor.showCommandLine("?");
        }
    },
    ".": {
        fn: function(editor, range, count, param) {
            util.onInsertReplaySequence = inputBuffer.lastInsertCommands;
            var previous = inputBuffer.previous;
            if (previous) // If there is a previous action
                inputBuffer.exec(editor, previous.action, previous.param);
        }
    },
    "ctrl-x": {
        fn: function(editor, range, count, param) {
            editor.modifyNumber(-(count || 1));
        }
    },
    "ctrl-a": {
        fn: function(editor, range, count, param) {
            editor.modifyNumber(count || 1);
        }
    }
};

var inputBuffer = exports.inputBuffer = {
    accepting: [NUMBER, OPERATOR, MOTION, ACTION],
    currentCmd: null,
    //currentMode: 0,
    currentCount: "",
    status: "",

    // Types
    operator: null,
    motion: null,

    lastInsertCommands: [],

    push: function(editor, ch, keyId) {
        var status = this.status;
        var isKeyHandled = true;
        this.idle = false;
        var wObj = this.waitingForParam;
        if (/^numpad\d+$/i.test(ch))
            ch = ch.substr(6);
            
        if (wObj) {
            this.exec(editor, wObj, ch);
        }
        // If input is a number (that doesn't start with 0)
        else if (!(ch === "0" && !this.currentCount.length) &&
            (/^\d+$/.test(ch) && this.isAccepting(NUMBER))) {
            // Assuming that ch is always of type String, and not Number
            this.currentCount += ch;
            this.currentCmd = NUMBER;
            this.accepting = [NUMBER, OPERATOR, MOTION, ACTION];
        }
        else if (!this.operator && this.isAccepting(OPERATOR) && operators[ch]) {
            this.operator = {
                ch: ch,
                count: this.getCount()
            };
            this.currentCmd = OPERATOR;
            this.accepting = [NUMBER, MOTION, ACTION];
            this.exec(editor, { operator: this.operator });
        }
        else if (motions[ch] && this.isAccepting(MOTION)) {
            this.currentCmd = MOTION;

            var ctx = {
                operator: this.operator,
                motion: {
                    ch: ch,
                    count: this.getCount()
                }
            };

            if (motions[ch].param)
                this.waitForParam(ctx);
            else
                this.exec(editor, ctx);
        }
        else if (alias[ch] && this.isAccepting(MOTION)) {
            alias[ch].operator.count = this.getCount();
            this.exec(editor, alias[ch]);
        }
        else if (actions[ch] && this.isAccepting(ACTION)) {
            var actionObj = {
                action: {
                    fn: actions[ch].fn,
                    count: this.getCount()
                }
            };

            if (actions[ch].param) {
                this.waitForParam(actionObj);
            }
            else {
                this.exec(editor, actionObj);
            }

            if (actions[ch].acceptsMotion)
                this.idle = false;
        }
        else if (this.operator) {
            this.operator.count = this.getCount();
            this.exec(editor, { operator: this.operator }, ch);
        }
        else {
            isKeyHandled = ch.length == 1;
            this.reset();
        }
        
        if (this.waitingForParam || this.motion || this.operator) {
            this.status += ch;
        } else if (this.currentCount) {
            this.status = this.currentCount;
        } else if (this.status) {
            this.status = "";
        }
        if (this.status != status)
            editor._emit("changeStatus");
        return isKeyHandled;
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
            if (operators[o.ch].selFn) {
                operators[o.ch].selFn(editor, editor.getSelectionRange(), o.count, param);
                this.reset();
            }
            return;
        }

        // There is an operator, but no motion or action. We try to pass the
        // current ch to the operator to see if it responds to it (an example
        // of this is the 'dd' operator).
        else if (!m && !a && o && param) {
            operators[o.ch].fn(editor, null, o.count, param);
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

            var motionObj = motions[m.ch];
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
                    operators[o.ch].fn(editor, editor.getSelectionRange(), o.count, param);
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
        this.status = "";
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
