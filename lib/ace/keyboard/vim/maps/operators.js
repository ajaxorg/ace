define(function(require, exports, module) {

"never use strict";

var util = require("./util");
var registers = require("../registers");

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
                    for (var i = 0; i < count; i++) {
                        editor.removeLines();
                        util.insertMode(editor);
                    }

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
