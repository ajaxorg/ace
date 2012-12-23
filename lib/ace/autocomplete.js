define(function(require, exports, module) {
"use strict";

var dom = require("ace/lib/dom");
var layout = require("./layout");
var HashHandler = require("ace/keyboard/hash_handler").HashHandler;
var EditSession = require("ace/edit_session").EditSession;
var TextMode = require("ace/mode/text").Mode;

var mode = new TextMode();
mode.$tokenizer = {
    getLineTokens: function(line) {
        
    }
};
var Autocompleter = function() {
    this.keyboardHandler = new HashHandler();
    this.keyboardHandler.bindKeys(this.commands);

    this.$blurListener = this.blurListener.bind(this);
    this.$changeListener = this.changeListener.bind(this);
};

(function(){
    this.$init = function(e) {
        var el = dom.createElement("div");
        var popup = new layout.singleLineEditor(el);
        document.body.appendChild(el);
        el.style.width="200px"
        el.style.zIndex="20000"
        el.style.background="white"
        el.style.border="lightgray solid"
        el.style.position="fixed"
        el.style.display = "none"
        popup.renderer.content.style.cursor="default"
        
        var nop = function(){};
        
        popup.focus = nop;
        popup.$isFocused = true;
        
        popup.renderer.$cursorLayer.restartTimer = nop
        popup.renderer.$cursorLayer.update = nop
        popup.renderer.$cursorLayer.element.style.display = "none";

        popup.renderer.maxLines = 6
        popup.renderer.$keepTextAreaAtCursor=false
        

        popup.setHighlightActiveLine(true)
        popup.setSession(new EditSession(""))

        popup.on("mousedown", function(e) {
            var pos = e.getDocumentPosition();
            popup.moveCursorToPosition(pos);
            popup.selection.clearSelection();
            e.stop();
        })
        
        /* popup.session.setMode({
            $
        }) */

        popup.getRow = function() {
            var line = this.getCursorPosition().row;
            if (line == 0 && !this.getHighlightActiveLine())
                line = -1;
            return line;
        };
        popup.setRow = function(line) {
            popup.setHighlightActiveLine(line != -1);
            popup.gotoLine(line + 1);
        };
        
        popup.on("click", function(e) {
            this.insertMatch();
        }.bind(this));
        
        popup.setData = function(list) {
            var value = ""
            if (list) {
                if (typeof list[0] == "string")
                    value = list.join("\n");
                else
                    value = list.map(function(x){return x.value}).join("\n");
            }           
                
            this.setValue(value, -1);
        };
        
        popup.setHighlight = function(re) {
            ace.session.highlight(re)
            ace.session._emit("changeFrontMarker")
        };
        
        this.popup = popup;
    };

    this.openPopup = function(editor) {
        if (!this.popup)
            this.$init();
        
        this.popup.setData(this.completions.filtered)

        var renderer = editor.renderer;
        var lineHeight = renderer.layerConfig.lineHeight;
        var pos = renderer.$cursorLayer.getPixelPosition(null, true)
        var rect = editor.container.getBoundingClientRect()
        pos.top += rect.top - renderer.layerConfig.offset;
        pos.left += rect.left;
        pos.left += renderer.$gutterLayer.gutterWidth;
        
        var el = this.popup.container;
        if (pos.top > window.innerHeight / 2  + lineHeight) {
            el.style.top = ""
            el.style.bottom = window.innerHeight - pos.top + "px";
        } else {
            pos.top += lineHeight;
            el.style.top = pos.top + "px";
            el.style.bottom = ""
        }

        el.style.left = pos.left + "px";
        el.style.display = "";
    };

    this.attachToEditor = function(editor) {
        if (this.editor)
            this.detach();
        this.editor = editor;
        if (editor.autocompleter != this) {
            if (editor.autocompleter)
                editor.autocompleter.detach();
            editor.autocompleter = this;
        }
        editor.keyBinding.addKeyboardHandler(this.keyboardHandler)
        editor.on("changeSelection", this.$changeListener)
        editor.on("blur", this.$blurListener)
    };
    this.detach = function() {
        this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
        this.editor.removeEventListener("changeSelection", this.changeListener);
        this.editor.removeEventListener("blur", this.changeListener);
        this.popup.container.style.display = "none";
    };

    this.changeListener = function(e) {
        console.log(e)
    };
    
    this.blurListener = function() {
        if (document.activeElement != this.editor.textInput.getElement())
            this.detach();
    };

    this.goTo = function(where) {
        var row = this.popup.getRow();
        var max = this.popup.session.getLength() - 1
        switch(where) {
            case "up": row = row < 0 ? max : row-1; break;
            case "down": row = row >= max ? -1 : row+1; break;
            case "start": row = 0; break;
            case "end": row = max; break
        }
        this.popup.setRow(row)
    };

    this.insertMatch = function(row) {
        if (row == undefined)
            row = this.popup.getRow();
        var text = this.completions.filtered[row];
        if (text.value)
            text = text.value;
        this.editor.insert(text);
        this.detach();
    };

    this.commands = {
        "up": function(editor) { editor.autocompleter.goTo("up"); },
        "down": function(editor) { editor.autocompleter.goTo("down"); },
        "ctrl-up": function(editor) { editor.autocompleter.goTo("start"); },
        "ctrl-down": function(editor) { editor.autocompleter.goTo("end"); },

        "esc": function(editor) { editor.autocompleter.detach(); },
        "Return": function(editor) { editor.autocompleter.insertMatch(); },
        "Shift-Return": function(editor) { editor.autocompleter.insertMatch(true); },
        "Tab": function(editor) {},
        "Shift-Tab": function(editor) {},
    };

    this.complete = function(editor) {
        this.attachToEditor(editor);
        var data = this.gatherCompletions(editor);
        this.completions = new FilteredList(data);
        this.completions.setFilter("a")
        if (data) {
            if (data.length == 1)
                this.insertMatch(0);
            else
                this.openPopup(editor);
        }
    };
    
    this.gatherCompletions = function() {
        return ["asdaf", "foo", "bar", "baz"]
    }
    
    
}).call(Autocompleter.prototype);

Autocompleter.startCommand = {
    name: "startAutocomplete",
    exec: function(editor) {
        if (!editor.autocompleter)
            editor.autocompleter = new Autocompleter();
        editor.autocompleter.complete(editor);
    },
    bindKey: "Ctrl-Space|Shift-Space|Alt-Space"
}
Autocompleter.addTo = function(editor) {
    editor.commands.addCommand(Autocompleter.startCommand);
}

var FilteredList = function(array, mutateData) {
    this.all = array;
    this.filtered = array.concat();
    this.filterText = "";
};
(function(){
    this.setFilter = function(str) {
        
    };
    
}).call(FilteredList.prototype);

exports.Autocompleter = Autocompleter;
exports.FilteredList = FilteredList;

});

