/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
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
"use strict";

var EditSession = require("ace/edit_session").EditSession;
var Renderer = require("ace/virtual_renderer").VirtualRenderer;
var UndoManager = require("ace/undomanager").UndoManager;

var dom = require("ace/lib/dom");
var HashHandler = require("ace/keyboard/hash_handler").HashHandler;
var TextMode = require("ace/mode/text").Mode;

var WorkerClient = require("./worker/worker_client").WorkerClient;
var worker = new WorkerClient(["ace"], "ace/autocomplete/autocomplete_worker", "AutocompleteWorker");

var mode = new TextMode();
mode.$tokenizer = {
    getLineTokens: function(line) {
        
    }
};

var Autocomplete = function() {
    this.keyboardHandler = new HashHandler();
    this.keyboardHandler.bindKeys(this.commands);

    this.$blurListener = this.blurListener.bind(this);
    this.$changeListener = this.changeListener.bind(this);
};


(function() {

    this.$init = function(e) {
        var el = dom.createElement("div");
        var popup = new this.$singleLineEditor(el);
        document.body.appendChild(el);
        el.style.width="200px"
        el.style.zIndex="20000"
        el.style.background="white"
        el.style.border="lightgray solid"
        el.style.position="fixed"
        el.style.display = "none"
        popup.renderer.content.style.cursor="default"
        
        var noop = function(){};
        
        popup.focus = noop;
        popup.$isFocused = true;
        
        popup.renderer.$cursorLayer.restartTimer = noop;
        popup.renderer.$cursorLayer.update = noop;
        popup.renderer.$cursorLayer.element.style.display = "none";

        popup.renderer.maxLines = 6
        popup.renderer.$keepTextAreaAtCursor=false

        popup.setHighlightActiveLine(true);
        popup.setSession(new EditSession(""));

        popup.on("mousedown", function(e) {
            var pos = e.getDocumentPosition();
            popup.moveCursorToPosition(pos);
            popup.selection.clearSelection();
            e.stop();
        });
        
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

    this.detach = function() {
        this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
        this.editor.removeEventListener("changeSelection", this.changeListener);
        this.editor.removeEventListener("blur", this.changeListener);

        if (this.popup)
            this.popup.container.style.display = "none";
    };

    this.changeListener = function(e) {
        //console.log(e)
    };
    
    this.blurListener = function() {
        if (document.activeElement != this.editor.textInput.getElement())
            this.detach();
    };

    this.goTo = function(where) {
        var row = this.popup.getRow();
        var max = this.popup.session.getLength() - 1;

        var choices = this.popup.container.getElementsByClassName("ace_text-layer")[0].childNodes;
        if (choices[row])
            dom.removeCssClass(choices[row], "autocomplete_selected");

        switch(where) {
            case "up": row = row < 0 ? max : row-1; break;
            case "down": row = row >= max ? -1 : row+1; break;
            case "start": row = 0; break;
            case "end": row = max; break
        }

        if (choices[row])
            dom.addCssClass(choices[row], "autocomplete_selected");
        this.popup.setRow(row);
    };

    this.insertMatch = function(row) {
        if (row == undefined)
            row = this.popup.getRow();
        var text = this.completions.filtered[row];
        if (text.value)
            text = text.value;

        // should be good enough, otherwise we can use getDocument().removeInLine
        this.editor.removeWordLeft();
        this.editor.insert(text);
        this.detach();
    };

    this.commands = {
        "up": function(editor) { editor.Autocomplete.goTo("up"); },
        "down": function(editor) { editor.Autocomplete.goTo("down"); },
        "ctrl-up": function(editor) { editor.Autocomplete.goTo("start"); },
        "ctrl-down": function(editor) { editor.Autocomplete.goTo("end"); },

        "esc": function(editor) { editor.Autocomplete.detach(); },
        "space": function(editor) { editor.Autocomplete.detach(); editor.insert(" ");},
        "Return": function(editor) { editor.Autocomplete.insertMatch(); },
        "Shift-Return": function(editor) { editor.Autocomplete.insertMatch(true); },
        "Tab": function(editor) { editor.Autocomplete.insertMatch(); },
        "Shift-Tab": function(editor) {},
    };

    this.complete = function(editor) {
        if (this.editor)
            this.detach();

        var _self = this;
        this.editor = editor;
        if (editor.Autocomplete != this) {
            if (editor.Autocomplete)
                editor.Autocomplete.detach();
            editor.Autocomplete = this;
        }

        editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
        editor.on("changeSelection", this.$changeListener);
        editor.on("blur", this.$blurListener);

        worker.attachToDocument(editor.session.getDocument(), {cursor: editor.getCursorPosition()}, true);

        worker.on("complete", function(data) {
            var matches = data.data.matches;
            _self.completions = new FilteredList(matches);
            _self.completions.setFilter("a");

            if (matches.length)
                _self.openPopup(editor);
        });
    };
    
    this.$singleLineEditor = function(el) {
        var renderer = new Renderer(el);
        el.style.overflow = "hidden";
        renderer.scrollBar.element.style.top = "0";
        renderer.scrollBar.element.style.display = "none";
        renderer.scrollBar.orginalWidth = renderer.scrollBar.width;
        renderer.scrollBar.width = 0;
        renderer.content.style.height = "auto";

        renderer.screenToTextCoordinates = function(x, y) {
            var pos = this.pixelToScreenCoordinates(x, y);
            return this.session.screenToDocumentPosition(
                Math.min(this.session.getScreenLength() - 1, Math.max(pos.row, 0)),
                Math.max(pos.column, 0)
            );
        };

        renderer.maxLines = 4;
        renderer.$computeLayerConfigWithScroll = renderer.$computeLayerConfig;
        renderer.$computeLayerConfig = function() {
            var config = this.layerConfig;
            var height = this.session.getScreenLength() * this.lineHeight;
            if (config.height != height) {
                var vScroll = height > this.maxLines * this.lineHeight;

                if (vScroll != this.$vScroll) {
                    if (vScroll) {
                        this.scrollBar.element.style.display = "";
                        this.scrollBar.width = this.scrollBar.orginalWidth;
                        this.container.style.height = config.height + "px";
                        height = config.height;
                        this.scrollTop = height - this.maxLines * this.lineHeight;
                    } else {
                        this.scrollBar.element.style.display = "none";
                        this.scrollBar.width = 0;
                    }

                    this.onResize();
                    this.$vScroll = vScroll;
                }

                if (this.$vScroll)
                    return renderer.$computeLayerConfigWithScroll();

                this.container.style.height = height + "px";
                this.scroller.style.height = height + "px";
                this.content.style.height = height + "px";
                this._emit("resize");
            }

            var longestLine = this.$getLongestLine();
            var firstRow = 0;
            var lastRow = this.session.getLength();

            this.scrollTop = 0;
            config.width = longestLine;
            config.padding = this.$padding;
            config.firstRow = 0;
            config.firstRowScreen = 0;
            config.lastRow = lastRow;
            config.lineHeight = this.lineHeight;
            config.characterWidth = this.characterWidth;
            config.minHeight = height;
            config.maxHeight = height;
            config.offset = 0;
            config.height = height;

            this.$gutterLayer.element.style.marginTop = 0 + "px";
            this.content.style.marginTop = 0 + "px";
            this.content.style.width = longestLine + 2 * this.$padding + "px";
        };
        renderer.isScrollableBy=function(){return false};

        renderer.setStyle("ace_one-line");

        var Editor = require("ace/editor").Editor;
        var editor = new Editor(renderer);

        //var MultiSelect = require("ace/multi_select").MultiSelect;
        //new MultiSelect(editor);
        //editor.session.setUndoManager(new UndoManager());

        editor.setHighlightActiveLine(false);
        editor.setShowPrintMargin(false);
        editor.renderer.setShowGutter(false);
        editor.renderer.setHighlightGutterLine(false);

        editor.$mouseHandler.$focusWaitTimout = 0;

        return editor;
    };
}).call(Autocomplete.prototype);

Autocomplete.startCommand = {
    name: "startAutocomplete",
    exec: function(editor) {
        if (!editor.Autocomplete)
            editor.Autocomplete = new Autocomplete();
        editor.Autocomplete.complete(editor);
    },
    bindKey: "Ctrl-Space|Shift-Space|Alt-Space"
}
Autocomplete.addTo = function(editor) {
    editor.commands.addCommand(Autocomplete.startCommand);
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

exports.Autocomplete = Autocomplete;
exports.FilteredList = FilteredList;

});