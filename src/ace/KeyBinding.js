require.def("ace/KeyBinding", 
    ["ace/ace", "ace/conf/keybindings/default_mac", "ace/conf/keybindings/default_win"],
    function(ace, default_mac, default_win) {

var KeyBinding = function(element, editor, config) {
    this.editor = editor;
    this.setConfig(config);
    var keys = this.keys;

    var _self = this;
    ace.addKeyListener(element, function(e) {
        var key = [];
        if (e.ctrlKey) {
            key.push("Ctrl");
        }
        if (e.metaKey) {
            key.push("Meta");
        }
        if (e.altKey) {
            key.push("Alt");
        }
        if (e.shiftKey) {
            key.push("Shift");
        }
        key.push(keys[e.keyCode] || String.fromCharCode(e.keyCode));

        var command = _self[_self.config.reverse[key.join("-")]];
        if (command) {
            _self.selection = editor.getSelection();
            command.call(_self);
            return ace.stopEvent(e);
        }
    });
};

(function() {
    this.keys = {
        8 : "Backspace",
        9 : "Tab",
        16 : "Shift",
        17 : "Ctrl",
        18 : "Alt",
        33 : "PageUp",
        34 : "PageDown",
        35 : "End",
        36 : "Home",
        37 : "Left",
        38 : "Up",
        39 : "Right",
        40 : "Down",
        45 : "Insert",
        46 : "Delete",
        91 : "Meta"
    };

    function objectReverse(obj, keySplit) {
        var i, j, l, key,
            ret = {};
        for (i in obj) {
            key = obj[i];
            if (keySplit && typeof key == "string") {
                key = key.split(keySplit);
                for (j = 0, l = key.length; j < l; ++j)
                    ret[key[j].replace(/Command/i, "Meta").replace(/Option/i, "Alt")] = i;
            }
            else {
                ret[key.replace(/Command/i, "Meta").replace(/Option/i, "Alt")] = i;
            }
        }
        return ret;
    }

    this.setConfig = function(config) {
        this.config = config || (ace.isMac
            ? default_mac
            : default_win);
        if (typeof this.config.reverse == "undefined")
            this.config.reverse = objectReverse(this.config, "|");
    };

    this["selectall"] = function() {
        this.selection.selectAll();
    };
    this["removeline"] = function() {
        this.editor.removeLines();
    };
    this["gotoline"] = function() {
        var line = parseInt(prompt("Enter line number:"));
        if (!isNaN(line)) {
            this.editor.gotoLine(line);
        }
    };
    this["togglecomment"] = function() {
        this.editor.toggleCommentLines();
    };
    this["findnext"] = function() {
        this.editor.findNext();
    };
    this["findprevious"] = function() {
        this.editor.findPrevious();
    };
    this["find"] = function() {
        var needle = prompt("Find:");
        this.editor.find(needle);
    };
    this["undo"] = function() {
      this.editor.undo();
    };
    this["redo"] = function() {
        this.editor.redo();
    };
    this["redo"] = function() {
        this.editor.redo();
    };
    this["overwrite"] = function() {
        this.editor.toggleOverwrite();
    };
    this["copylinesup"] = function() {
        this.editor.copyLinesUp();
    };
    this["movelinesup"] = function() {
        this.editor.moveLinesUp();
    };
    this["selecttostart"] = function() {
        this.selection.selectFileStart();
    };
    this["gotostart"] = this["Control-Up"] = function() {
        this.editor.navigateFileStart();
    };
    this["selectup"] = function() {
        this.selection.selectUp();
    };
    this["golineup"] = function() {
        this.editor.navigateUp();
    };
    this["copylinesdown"] = function() {
        this.editor.copyLinesDown();
    };
    this["movelinsedown"] = function() {
        this.editor.moveLinesDown();
    };
    this["selecttoend"] = function() {
        this.selection.selectFileEnd();
    };
    this["gotoend"] = this["Control-Down"] = function() {
        this.editor.navigateFileEnd();
    };
    this["selectdown"] = function() {
        this.selection.selectDown();
    };
    this["godown"] = function() {
        this.editor.navigateDown();
    };
    this["selectwordleft"] = function() {
        this.selection.selectWordLeft();
    };
    this["gotowordleft"] = function() {
        this.editor.navigateWordLeft();
    };
    this["selecttolinestart"] = function() {
        this.selection.selectLineStart();
    };
    this["gotolinestart"] = function() {
        this.editor.navigateLineStart();
    };
    this["selectleft"] = function() {
        this.selection.selectLeft();
    };
    this["gotoleft"] = function() {
        this.editor.navigateLeft();
    };
    this["selectwordright"] = function() {
        this.selection.selectWordRight();
    };
    this["gotowordright"] = function() {
        this.editor.navigateWordRight();
    };
    this["selecttolineend"] = function() {
        this.selection.selectLineEnd();
    };
    this["gotolineend"] = function() {
        this.editor.navigateLineEnd();
    };
    this["selectright"] = function() {
        this.selection.selectRight();
    };
    this["gotoright"] = function() {
        this.editor.navigateRight();
    };
    this["selectpagedown"] = function() {
        this.editor.selectPageDown();
    };
    this["pagedown"] = function() {
        this.editor.scrollPageDown();
    };
    this["selectpageup"] = function() {
        this.editor.selectPageUp();
    };
    this["pageup"] = function() {
        this.editor.scrollPageUp();
    };
    this["selectlinestart"] = function() {
        this.selection.selectLineStart();
    };
    this["gotolinestart"] = function() {
        this.editor.navigateLineStart();
    };
    this["selectlineend"] = function() {
        this.selection.selectLineEnd();
    };
    this["gotolineend"] = function() {
        this.editor.navigateLineEnd();
    };
    this["del"] = function() {
        this.editor.removeRight();
    };
    this["backspace"] = function() {
        this.editor.removeLeft();
    };
    this["outdent"] = function() {
        this.editor.blockOutdent();
    };
    this["indent"] = function() {
        if (this.selection.isMultiLine()) {
            this.editor.blockIndent();
        }
        else {
            this.editor.onTextInput("\t");
        }
    };

}).call(KeyBinding.prototype);

return KeyBinding;
});
