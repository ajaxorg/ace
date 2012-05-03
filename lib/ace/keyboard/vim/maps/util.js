define(function(require, exports, module) {
var registers = require("../registers");

var dom = require("../../../lib/dom");
dom.importCssString('.insert-mode. ace_cursor{\
    border-left: 2px solid #333333;\
}\
.ace_dark.insert-mode .ace_cursor{\
    border-left: 2px solid #eeeeee;\
}\
.normal-mode .ace_cursor{\
    border: 0!important;\
    background-color: red;\
    opacity: 0.5;\
}', 'vimMode');

module.exports = {
    onVisualMode: false,
    onVisualLineMode: false,
    currentMode: 'normal',
    noMode: function(editor) {
        editor.unsetStyle('insert-mode');
        editor.unsetStyle('normal-mode');
        if (editor.commands.recording)
            editor.commands.toggleRecording();
        editor.setOverwrite(false);
    },
    insertMode: function(editor) {
        this.currentMode = 'insert';
        // Switch editor to insert mode
        editor.setStyle('insert-mode');
        editor.unsetStyle('normal-mode');

        editor.setOverwrite(false);
        editor.keyBinding.$data.buffer = "";
        editor.keyBinding.$data.state = "insertMode";
        this.onVisualMode = false;
        this.onVisualLineMode = false;
        if(this.onInsertReplaySequence) {
            // Ok, we're apparently replaying ("."), so let's do it
            editor.commands.macro = this.onInsertReplaySequence;
            editor.commands.replay(editor);
            this.onInsertReplaySequence = null;
            this.normalMode(editor);
        } else {
            editor._emit("vimMode", "insert");
            // Record any movements, insertions in insert mode
            if(!editor.commands.recording)
                editor.commands.toggleRecording();
        }
    },
    normalMode: function(editor) {
        // Switch editor to normal mode
        this.currentMode = 'normal';

        editor.unsetStyle('insert-mode');
        editor.setStyle('normal-mode');
        editor.clearSelection();

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
        editor._emit("changeVimMode", "normal");
        // Save recorded keystrokes
        if (editor.commands.recording) {
            editor.commands.toggleRecording();
            return editor.commands.macro;
        }
        else {
            return [];
        }
    },
    visualMode: function(editor, lineMode) {
        if (
            (this.onVisualLineMode && lineMode)
            || (this.onVisualMode && !lineMode)
        ) {
            this.normalMode(editor);
            return;
        }

        editor.setStyle('insert-mode');
        editor.unsetStyle('normal-mode');

        editor._emit("changeVimMode", "visual");
        if (lineMode) {
            this.onVisualLineMode = true;
        } else {
            this.onVisualMode = true;
            this.onVisualLineMode = false;
        }
    },
    getRightNthChar: function(editor, cursor, char, n) {
        var line = editor.getSession().getLine(cursor.row);
        var matches = line.substr(cursor.column + 1).split(char);

        return n < matches.length ? matches.slice(0, n).join(char).length : null;
    },
    getLeftNthChar: function(editor, cursor, char, n) {
        var line = editor.getSession().getLine(cursor.row);
        var matches = line.substr(0, cursor.column).split(char);

        return n < matches.length ? matches.slice(-1 * n).join(char).length : null;
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
