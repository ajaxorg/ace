define(function(require, exports, module) {
var registers = require("../registers");

module.exports = {
    onVisualMode: false,
    onVisualLineMode: false,
    currentMode: 'normal',
    insertMode: function(editor) {
        var _self = this;
        var theme = editor && editor.getTheme() || "ace/theme/textmate";

        require(["require", theme], function (require) {
            var isDarkTheme = require(theme).isDark;

            _self.currentMode = 'insert';
            // Switch editor to insert mode
            editor.unsetStyle('insert-mode');

            var cursor = document.getElementsByClassName("ace_cursor")[0];
            if (cursor) {
                cursor.style.display = null;
                cursor.style.backgroundColor = null;
                cursor.style.opacity = null;
                cursor.style.border = null;
                cursor.style.borderLeftColor = isDarkTheme? "#eeeeee" : "#333333";
                cursor.style.borderLeftStyle = "solid";
                cursor.style.borderLeftWidth = "2px";
            }

            editor.setOverwrite(false);
            editor.keyBinding.$data.buffer = "";
            editor.keyBinding.$data.state = "insertMode";
            _self.onVisualMode = false;
            _self.onVisualLineMode = false;
            if(_self.onInsertReplaySequence) {
                // Ok, we're apparently replaying ("."), so let's do it
                editor.commands.macro = _self.onInsertReplaySequence;
                editor.commands.replay(editor);
                _self.onInsertReplaySequence = null;
                _self.normalMode(editor);
            } else {
                // Record any movements, insertions in insert mode
                if(!editor.commands.recording)
                    editor.commands.toggleRecording();
            }
        });
    },
    normalMode: function(editor) {
        // Switch editor to normal mode
        this.currentMode = 'normal';

        editor.setStyle('normal-mode');
        editor.clearSelection();

        var cursor = document.getElementsByClassName("ace_cursor")[0];
        if (cursor) {
            cursor.style.display = null;
            cursor.style.backgroundColor = "red";
            cursor.style.opacity = ".5";
            cursor.style.border = "0";
        }

        var pos;
        if (!editor.getOverwrite()) {
            pos = editor.getCursorPosition();
            if (pos.column > 0)
                editor.navigateLeft();
        }
        editor.setOverwrite(true);
        editor.keyBinding.$data.buffer = "";
        editor.keyBinding.$data.state = "start";
        this.onVisualMode = false;
        this.onVisualLineMode = false;
        // Save recorded keystrokes
        if(editor.commands.recording) {
            editor.commands.toggleRecording();
            return editor.commands.macro;
        }
        else {
            return [];
        }
    },
    getRightNthChar: function(editor, cursor, char, n) {
        var line = editor.getSession().getLine(cursor.row);
        var matches = line.substr(cursor.column + 1).split(char);

        return n < matches.length ? matches.slice(0, n).join(char).length : 0;
    },
    getLeftNthChar: function(editor, cursor, char, n) {
        var line = editor.getSession().getLine(cursor.row);
        var matches = line.substr(0, cursor.column + 1).split(char);

        return n < matches.length ? matches.slice(-1 * n).join(char).length + 1: 0;
    },
    toRealChar: function(char) {
        if (char.length === 1)
            return char;

        if (/^shift-./.test(char))
            return char[char.length - 1].toUpperCase();
        else
            return "";
    },
    copyLine: function(editor) {
        var pos = editor.getCursorPosition();
        editor.selection.clearSelection();
        editor.moveCursorTo(pos.row, pos.column);
        editor.selection.selectLine();
        registers._default.isLine = true;
        registers._default.text = editor.getCopyText().replace(/\n$/, "");
        editor.selection.clearSelection();
        editor.moveCursorTo(pos.row, pos.column);
    }
};
});
