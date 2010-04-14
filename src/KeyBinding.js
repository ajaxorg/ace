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
    L: 76
};

ace.KeyBinding = function(element, host) {
    ace.addListener(element, "keydown", function(e) {
        var key = e.keyCode;

        switch (key) {
            case keys.A:
                if (e.metaKey) {
                    host.selectAll();
                    return ace.stopEvent(e);
                }
                break;

            case keys.D:
                if (e.metaKey) {
                    host.removeLine();
                    return ace.stopEvent(e);
                }
                break;

            case keys.L:
                if (e.metaKey) {
                    var line = parseInt(prompt("Enter line number:"));
                    if (!isNaN(line)) {
                        host.gotoLine(line);
                        return ace.stopEvent(e);
                    }
                }
                break;

            case keys.UP:
                if (e.metaKey && e.shiftKey) {
                    host.selectFileStart();
                }
                else if (e.metaKey) {
                    host.navigateFileStart();
                }
                if (e.shiftKey) {
                    host.selectUp();
                }
                else {
                    host.navigateUp();
                }
                return ace.stopEvent(e);

            case keys.DOWN:
                if (e.metaKey && e.shiftKey) {
                    host.selectFileEnd();
                }
                else if (e.metaKey) {
                    host.navigateFileEnd();
                }
                if (e.shiftKey) {
                    host.selectDown();
                }
                else {
                    host.navigateDown();
                }
                return ace.stopEvent(e);

            case keys.LEFT:
                if (e.altKey && e.shiftKey) {
                    host.selectWordLeft();
                }
                else if (e.altKey) {
                    host.navigateWordLeft();
                }
                else if (e.metaKey && e.shiftKey) {
                    host.selectLineStart();
                }
                else if (e.metaKey) {
                    host.navigateLineStart();
                }
                else if (e.shiftKey) {
                    host.selectLeft();
                }
                else {
                    host.navigateLeft();
                }
                return ace.stopEvent(e);

            case keys.RIGHT:
                if (e.altKey && e.shiftKey) {
                    host.selectWordRight();
                }
                else if (e.altKey) {
                    host.navigateWordRight();
                }
                else if (e.metaKey && e.shiftKey) {
                    host.selectLineEnd();
                }
                else if (e.metaKey) {
                    host.navigateLineEnd();
                }
                else if (e.shiftKey) {
                    host.selectRight();
                }
                else {
                    host.navigateRight();
                }
                return ace.stopEvent(e);

            case keys.PAGEDOWN:
                if (e.shiftKey) {
                    host.selectPageDown();
                }
                else {
                    host.scrollPageDown();
                }
                return ace.stopEvent(e);

            case keys.PAGEUP:
                if (e.shiftKey) {
                    host.selectPageUp();
                }
                else {
                    host.scrollPageUp();
                }
                return ace.stopEvent(e);

            case keys.POS1:
                if (e.shiftKey) {
                    host.selectLineStart();
                }
                else {
                    host.navigateLineStart();
                }
                return ace.stopEvent(e);

            case keys.END:
                if (e.shiftKey) {
                    host.selectLineEnd();
                }
                else {
                    host.navigateLineEnd();
                }
                return ace.stopEvent(e);

            case keys.DELETE:
                host.removeRight();
                return ace.stopEvent(e);

            case keys.BACKSPACE:
                host.removeLeft();
                return ace.stopEvent(e);

            case keys.TAB:
                if (host.hasMultiLineSelection()) {
                    if (e.shiftKey) {
                        host.blockOutdent();
                    } else {
                        host.blockIndent();
                    }
                } else {
                    host.onTextInput("    ");
                }
                return ace.stopEvent(e);
        }
    });
};

})();