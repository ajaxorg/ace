ace.provide("ace.KeyBinding");

ace.KeyBinding = function(element, editor) {

    this.editor = editor;
    var keys = this.keys;

    var self = this;
    ace.addKeyListener(element, function(e) {
        var key = [];
        if (e.ctrlKey || e.metaKey) {
            key.push("Control");
        }
        if (e.altKey) {
            key.push("Alt");
        }
        if (e.shiftKey) {
            key.push("Shift");
        }
        key.push(keys[e.keyCode] || String.fromCharCode(e.keyCode));

        var command = self[key.join("-")];
        if (command) {
            self.selection = editor.getSelection();
            command.call(self);
            return ace.stopEvent(e);
        }
    });
};

(function() {
    this.keys = {
        8: "Backspace",
        9: "Tab",
        16: "Shift",
        17: "Control",
        18: "Alt",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        46: "Delete",
        91: "Meta"
    };

    this["Control-A"] = function() {
        this.selection.selectAll();
    };

    this["Control-D"] = function() {
        this.editor.removeLines();
    };

    this["Control-L"] = function() {
        var line = parseInt(prompt("Enter line number:"));
        if (!isNaN(line)) {
            this.editor.gotoLine(line);
        }
    };

    this["Control-7"] = function() {
        this.editor.toggleCommentLines();
    };

    this["Control-Alt-Up"] = function() {
        this.editor.copyLinesUp();
    };

    this["Alt-Up"] = function() {
        this.editor.moveLinesUp();
    };

    this["Control-Shift-Up"] = function() {
        this.selection.selectFileStart();
    };

    this["Control-Up"] = function() {
        this.editor.navigateFileStart();
    };

    this["Shift-Up"] = function() {
        this.selection.selectUp();
    };

    this["Up"] = function() {
        this.editor.navigateUp();
    };

    this["Control-Alt-Down"] = function() {
        this.editor.copyLinesDown();
    };

    this["Alt-Down"] = function() {
        this.editor.moveLinesDown();
    };

    this["Control-Shift-Down"] = function() {
        this.selection.selectFileEnd();
    };

    this["Control-Down"] = function() {
        this.editor.navigateFileEnd();
    };

    this["Shift-Down"] = function() {
        this.selection.selectDown();
    };

    this["Down"] = function() {
        this.editor.navigateDown();
    };

    this["Alt-Shift-Left"] = function() {
        this.selection.selectWordLeft();
    };

    this["Alt-Left"] = function() {
        this.editor.navigateWordLeft();
    };

    this["Control-Shift-Left"] = function() {
        this.selection.selectLineStart();
    };

    this["Control-Left"] = function() {
        this.editor.navigateLineStart();
    };

    this["Shift-Left"] = function() {
        this.selection.selectLeft();
    };

    this["Left"] = function() {
        this.editor.navigateLeft();
    };

    this["Alt-Shift-Right"] = function() {
        this.selection.selectWordRight();
    };

    this["Alt-Right"] = function() {
        this.editor.navigateWordRight();
    };

    this["Control-Shift-Right"] = function() {
        this.selection.selectLineEnd();
    };

    this["Control-Right"] = function() {
        this.editor.navigateLineEnd();
    };

    this["Shift-Right"] = function() {
        this.selection.selectRight();
    };

    this["Right"] = function() {
        this.editor.navigateRight();
    };

    this["Shift-PageDown"] = function() {
        this.editor.selectPageDown();
    };

    this["PageDown"] = function() {
        this.editor.scrollPageDown();
    };

    this["Shift-PageUp"] = function() {
        this.editor.selectPageUp();
    };

    this["PageUp"] = function() {
        this.editor.scrollPageUp();
    };

    this["Shift-Home"] = function() {
        this.selection.selectLineStart();
    };

    this["Home"] = function() {
        this.editor.navigateLineStart();
    };

    this["Shift-End"] = function() {
        this.selection.selectLineEnd();
    };

    this["End"] = function() {
        this.editor.navigateLineEnd();
    };

    this["Delete"] = function() {
        this.editor.removeRight();
    };

    this["Backspace"] = function() {
        this.editor.removeLeft();
    };

    this["Shift-Tab"] = function() {
        this.editor.blockOutdent();
    };

    this["Tab"] = function() {
        if (this.selection.isMultiLine()) {
            this.editor.blockIndent();
        } else {
            this.editor.onTextInput("\t");
        }
    };

}).call(ace.KeyBinding.prototype);