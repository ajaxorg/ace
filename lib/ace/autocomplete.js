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

var HashHandler = require("./keyboard/hash_handler").HashHandler;
var AcePopup = require("./autocomplete/popup").AcePopup;
var util = require("./autocomplete/util");
var event = require("./lib/event");
var lang = require("./lib/lang");
var snippetManager = require("./snippets").snippetManager;

var Autocomplete = function() {
    this.keyboardHandler = new HashHandler();
    this.keyboardHandler.bindKeys(this.commands);

    this.blurListener = this.blurListener.bind(this);
    this.changeListener = this.changeListener.bind(this);
    this.mousedownListener = this.mousedownListener.bind(this);
    this.mousewheelListener = this.mousewheelListener.bind(this);
    
    this.changeTimer = lang.delayedCall(function() {
        this.updateCompletions(true);
    }.bind(this))
};

(function() {
    this.$init = function() {
        this.popup = new AcePopup(document.body || document.documentElement);
        this.popup.on("click", function(e) {
            this.insertMatch();
            e.stop();
        }.bind(this));
    };

    this.openPopup = function(editor, keepPopupPosition) {
        if (!this.popup)
            this.$init();

        this.popup.setData(this.completions.filtered);

        var renderer = editor.renderer;
        if (!keepPopupPosition) {
            var lineHeight = renderer.layerConfig.lineHeight;
            var pos = renderer.$cursorLayer.getPixelPosition(null, true);
            var rect = editor.container.getBoundingClientRect();
            pos.top += rect.top - renderer.layerConfig.offset;
            pos.left += rect.left;
            pos.left += renderer.$gutterLayer.gutterWidth;

            this.popup.show(pos, lineHeight);
        }
        renderer.updateText();
    };

    this.detach = function() {
        this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
        this.editor.removeEventListener("changeSelection", this.changeListener);
        this.editor.removeEventListener("blur", this.changeListener);
        this.editor.removeEventListener("mousedown", this.changeListener);
        this.changeTimer.cancel();
        
        if (this.popup)
            this.popup.hide();

        this.activated = false;
    };

    this.changeListener = function(e) {
        if (this.activated)
            this.changeTimer.schedule();
        else
            this.detach();
    };

    this.blurListener = function() {
        if (document.activeElement != this.editor.textInput.getElement())
            this.detach();
    };

    this.mousedownListener = function(e) {
        this.detach();
    };

    this.mousewheelListener = function(e) {
        this.detach();
    };

    this.goTo = function(where) {
        var row = this.popup.getRow();
        var max = this.popup.session.getLength() - 1;

        switch(where) {
            case "up": row = row <= 0 ? max : row - 1; break;
            case "down": row = row >= max ? 0 : row + 1; break;
            case "start": row = 0; break;
            case "end": row = max; break;
        }

        this.popup.setRow(row);
    };

    this.insertMatch = function(data) {
        this.detach();
        if (!data)
            data = this.popup.getData(this.popup.getRow());
        if (!data)
            return false;
        if (data.completer && data.completer.insertMatch) {
            data.completer.insertMatch(this.editor);
        } else {
            if (this.completions.filterText) {
                var range = this.editor.selection.getRange();
                range.start.column -= this.completions.filterText.length;
                this.editor.session.remove(range);
            }
            if (data.snippet)
                snippetManager.insertSnippet(this.editor, data.snippet);
            else
                this.editor.insert(data.value || data);
        }
    };

    this.commands = {
        "Up": function(editor) { editor.completer.goTo("up"); },
        "Down": function(editor) { editor.completer.goTo("down"); },
        "Ctrl-Up|Ctrl-Home": function(editor) { editor.completer.goTo("start"); },
        "Ctrl-Down|Ctrl-End": function(editor) { editor.completer.goTo("end"); },

        "Esc": function(editor) { editor.completer.detach(); },
        "Space": function(editor) { editor.completer.detach(); editor.insert(" ");},
        "Return": function(editor) { editor.completer.insertMatch(); },
        "Shift-Return": function(editor) { editor.completer.insertMatch(true); },
        "Tab": function(editor) { editor.completer.insertMatch(); },

        "PageUp": function(editor) { editor.completer.popup.gotoPageDown(); },
        "PageDown": function(editor) { editor.completer.popup.gotoPageUp(); }
    };

    this.gatherCompletions = function(editor, callback) {
        var session = editor.getSession();
        var pos = editor.getCursorPosition();

        var line = session.getLine(pos.row);
        var prefix = util.retrievePrecedingIdentifier(line, pos.column);

        var matches = [];
        util.parForEach(editor.completers, function(completer, next) {
            completer.getCompletions(editor, session, pos, prefix, function(err, results) {
                if (!err)
                    matches = matches.concat(results);
                next();
            });
        }, function() {
            matches.sort(function(a, b) {
                return b.score - a.score;
            });
            callback(null, {
                prefix: prefix,
                matches: matches
            });
        });
        return true;
    };

    this.showPopup = function(editor) {
        if (this.editor)
            this.detach();
        
        this.activated = true;

        this.editor = editor;
        if (editor.completer != this) {
            if (editor.completer)
                editor.completer.detach();
            editor.completer = this;
        }

        editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
        editor.on("changeSelection", this.changeListener);
        editor.on("blur", this.blurListener);
        editor.on("mousedown", this.mousedownListener);
        this.updateCompletions();
    }
    
    this.updateCompletions = function(keepPopupPosition) {
        this.gatherCompletions(this.editor, function(err, results) {
            var matches = results && results.matches;
            if (!matches || !matches.length)
                return this.detach();
            // TODO reenable this when we have proper change tracking 
            // if (matches.length == 1)
            //     return this.insertMatch(matches[0]);

            this.completions = new FilteredList(matches);
            this.completions.setFilter(results.prefix);
            this.openPopup(this.editor, keepPopupPosition);
            this.popup.setHighlight(results.prefix);
        }.bind(this));
    };

    this.cancelContextMenu = function() {
        var stop = function(e) {
            this.editor.off("nativecontextmenu", stop);
            if (e && e.domEvent)
                event.stopEvent(e.domEvent);
        }.bind(this);
        setTimeout(stop, 10);
        this.editor.on("nativecontextmenu", stop);
    };

}).call(Autocomplete.prototype);

Autocomplete.startCommand = {
    name: "startAutocomplete",
    exec: function(editor) {
        if (!editor.completer)
            editor.completer = new Autocomplete();
        editor.completer.showPopup(editor);
        // needed for firefox on mac
        editor.completer.cancelContextMenu();
    },
    bindKey: "Ctrl-Space|Ctrl-Shift-Space|Alt-Space"
};

var FilteredList = function(array, mutateData) {
    this.all = array;
    this.filtered = array.concat();
    this.filterText = "";
};
(function(){
    this.setFilter = function(str) {
        this.filterText = str;
    };

}).call(FilteredList.prototype);

exports.Autocomplete = Autocomplete;
exports.FilteredList = FilteredList;

});