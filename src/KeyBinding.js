ace.provide("ace.KeyBinding");

(function() {

var keys = {
    UP : 38,
    RIGHT : 39,
    DOWN : 40,
    LEFT : 37,
    PAGEUP : 33,
    PAGEDOWN : 34,
    POS1 : 36,
    END : 35,
    DELETE : 46,
    BACKSPACE : 8,
    TAB : 9,
    A : 65,
    D: 68,
    L: 76,
    "7": 55
};

ace.KeyBinding = function(element, editor) {
    ace.addListener(element, "keydown", function(e) {
        var key = e.keyCode;
        var selection = editor.getSelection();

        switch (key) {
            case keys.A:
                if (e.metaKey) {
                    selection.selectAll();
                    return ace.stopEvent(e);
                }
                break;

            case keys.D:
                if (e.metaKey) {
                    editor.removeLines();
                    return ace.stopEvent(e);
                }
                break;

            case keys.L:
                if (e.metaKey) {
                    var line = parseInt(prompt("Enter line number:"));
                    if (!isNaN(line)) {
                        editor.gotoLine(line);
                        return ace.stopEvent(e);
                    }
                }
                break;

            case keys["7"]:
                if (e.metaKey) {
                    editor.toggleCommentLines();
                    return ace.stopEvent(e);
                };
                break;

            case keys.UP:
                if (e.altKey && e.metaKey ) {
                    editor.copyLinesUp();
                }
                else if (e.altKey) {
                    editor.moveLinesUp();
                }
                else if (e.metaKey && e.shiftKey) {
                    selection.selectFileStart();
                }
                else if (e.metaKey) {
                    editor.navigateFileStart();
                }
                else if (e.shiftKey) {
                    selection.selectUp();
                }
                else {
                    editor.navigateUp();
                }
                return ace.stopEvent(e);

            case keys.DOWN:
                if (e.altKey && e.metaKey ) {
                    editor.copyLinesDown();
                }
                else if (e.altKey) {
                    editor.moveLinesDown();
                }
                else if (e.metaKey && e.shiftKey) {
                    selection.selectFileEnd();
                }
                else if (e.metaKey) {
                    editor.navigateFileEnd();
                }
                else if (e.shiftKey) {
                    selection.selectDown();
                }
                else {
                    editor.navigateDown();
                }
                return ace.stopEvent(e);

            case keys.LEFT:
                if (e.altKey && e.shiftKey) {
                    selection.selectWordLeft();
                }
                else if (e.altKey) {
                    editor.navigateWordLeft();
                }
                else if (e.metaKey && e.shiftKey) {
                    selection.selectLineStart();
                }
                else if (e.metaKey) {
                    editor.navigateLineStart();
                }
                else if (e.shiftKey) {
                    selection.selectLeft();
                }
                else {
                    editor.navigateLeft();
                }
                return ace.stopEvent(e);

            case keys.RIGHT:
                if (e.altKey && e.shiftKey) {
                    selection.selectWordRight();
                }
                else if (e.altKey) {
                    editor.navigateWordRight();
                }
                else if (e.metaKey && e.shiftKey) {
                    selection.selectLineEnd();
                }
                else if (e.metaKey) {
                    editor.navigateLineEnd();
                }
                else if (e.shiftKey) {
                    selection.selectRight();
                }
                else {
                    editor.navigateRight();
                }
                return ace.stopEvent(e);

            case keys.PAGEDOWN:
                if (e.shiftKey) {
                    selection.selectPageDown();
                }
                else {
                    editor.scrollPageDown();
                }
                return ace.stopEvent(e);

            case keys.PAGEUP:
                if (e.shiftKey) {
                    selection.selectPageUp();
                }
                else {
                    editor.scrollPageUp();
                }
                return ace.stopEvent(e);

            case keys.POS1:
                if (e.shiftKey) {
                    selection.selectLineStart();
                }
                else {
                    editor.navigateLineStart();
                }
                return ace.stopEvent(e);

            case keys.END:
                if (e.shiftKey) {
                    selection.selectLineEnd();
                }
                else {
                    editor.navigateLineEnd();
                }
                return ace.stopEvent(e);

            case keys.DELETE:
                editor.removeRight();
                return ace.stopEvent(e);

            case keys.BACKSPACE:
                editor.removeLeft();
                return ace.stopEvent(e);

            case keys.TAB:
                if (e.shiftKey) {
                    editor.blockOutdent();
                } else if (selection.isMultiLine()) {
                    editor.blockIndent();
                } else {
                    editor.onTextInput("\t");
                }
                return ace.stopEvent(e);
        }
    });
};

})();