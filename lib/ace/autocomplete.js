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
    this.autoInsert = true;
    this.autoSelect = true;
    this.keyboardHandler = new HashHandler();
    this.keyboardHandler.bindKeys(this.commands);

    this.blurListener = this.blurListener.bind(this);
    this.changeListener = this.changeListener.bind(this);
    this.mousedownListener = this.mousedownListener.bind(this);
    this.mousewheelListener = this.mousewheelListener.bind(this);

    this.changeTimer = lang.delayedCall(function() {
        this.updateCompletions(true);
    }.bind(this));
};

(function() {
    this.gatherCompletionsId = 0;

    this.$init = function() {
        this.popup = new AcePopup(document.body || document.documentElement);
        this.popup.on("click", function(e) {
            this.insertMatch();
            e.stop();
        }.bind(this));
        this.popup.focus = this.editor.focus.bind(this.editor);
    };

    this.openPopup = function(editor, prefix, keepPopupPosition) {
        if (!this.popup)
            this.$init();

        this.popup.setData(this.completions.filtered);

        var renderer = editor.renderer;
        this.popup.setRow(this.autoSelect ? 0 : -1);
        if (!keepPopupPosition) {
            this.popup.setTheme(editor.getTheme());
            this.popup.setFontSize(editor.getFontSize());

            var lineHeight = renderer.layerConfig.lineHeight;

            var pos = renderer.$cursorLayer.getPixelPosition(this.base, true);
            pos.left -= this.popup.getTextLeftOffset();

            var rect = editor.container.getBoundingClientRect();
            pos.top += rect.top - renderer.layerConfig.offset;
            pos.left += rect.left - editor.renderer.scrollLeft;
            pos.left += renderer.$gutterLayer.gutterWidth;

            this.popup.show(pos, lineHeight);
        }
    };

    this.detach = function() {
        this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
        this.editor.off("changeSelection", this.changeListener);
        this.editor.off("blur", this.blurListener);
        this.editor.off("mousedown", this.mousedownListener);
        this.editor.off("mousewheel", this.mousewheelListener);
        this.changeTimer.cancel();

        if (this.popup && this.popup.isOpen) {
            this.gatherCompletionsId += 1;
            this.popup.hide();
        }
        
        if (this.base)
            this.base.detach();
        this.activated = false;
        this.completions = this.base = null;
    };

    this.changeListener = function(e) {
        var cursor = this.editor.selection.lead;
        if (cursor.row != this.base.row || cursor.column < this.base.column) {
            this.detach();
        }
        if (this.activated)
            this.changeTimer.schedule();
        else
            this.detach();
    };

    this.blurListener = function() {
        // we have to check if activeElement is a child of popup because
        // on IE preventDefault doesn't stop scrollbar from being focussed
        var el = document.activeElement;
        if (el != this.editor.textInput.getElement() && el.parentNode != this.popup.container)
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
            case "down": row = row >= max ? -1 : row + 1; break;
            case "start": row = 0; break;
            case "end": row = max; break;
        }

        this.popup.setRow(row);
    };

    this.insertMatch = function(data) {
        if (!data)
            data = this.popup.getData(this.popup.getRow());
        if (!data)
            return false;

        if (data.completer && data.completer.insertMatch) {
            data.completer.insertMatch(this.editor);
        } else {
            if (this.completions.filterText) {
                var ranges = this.editor.selection.getAllRanges();
                for (var i = 0, range; range = ranges[i]; i++) {
                    range.start.column -= this.completions.filterText.length;
                    this.editor.session.remove(range);
                }
            }
            if (data.snippet)
                snippetManager.insertSnippet(this.editor, data.snippet);
            else
                this.editor.execCommand("insertstring", data.value || data);
        }
        this.detach();
    };

    this.commands = {
        "Up": function(editor) { editor.completer.goTo("up"); },
        "Down": function(editor) { editor.completer.goTo("down"); },
        "Ctrl-Up|Ctrl-Home": function(editor) { editor.completer.goTo("start"); },
        "Ctrl-Down|Ctrl-End": function(editor) { editor.completer.goTo("end"); },

        "Esc": function(editor) { editor.completer.detach(); },
        "Space": function(editor) { editor.completer.detach(); editor.insert(" ");},
        "Return": function(editor) { return editor.completer.insertMatch(); },
        "Shift-Return": function(editor) { editor.completer.insertMatch(true); },
        "Tab": function(editor) {
            var result = editor.completer.insertMatch();
            if (!result && !editor.tabstopManager)
                editor.completer.goTo("down");
            else
                return result;
        },

        "PageUp": function(editor) { editor.completer.popup.gotoPageUp(); },
        "PageDown": function(editor) { editor.completer.popup.gotoPageDown(); }
    };

    this.gatherCompletions = function(editor, callback) {
        var session = editor.getSession();
        var pos = editor.getCursorPosition();

        var line = session.getLine(pos.row);
        var prefix = util.retrievePrecedingIdentifier(line, pos.column);

        this.base = session.doc.createAnchor(pos.row, pos.column - prefix.length);

        var matches = [];
        var total = editor.completers.length;
        editor.completers.forEach(function(completer, i) {
            completer.getCompletions(editor, session, pos, prefix, function(err, results) {
                if (!err)
                    matches = matches.concat(results);
                // Fetch prefix again, because they may have changed by now
                var pos = editor.getCursorPosition();
                var line = session.getLine(pos.row);
                callback(null, {
                    prefix: util.retrievePrecedingIdentifier(line, pos.column, results[0] && results[0].identifierRegex),
                    matches: matches,
                    finished: (--total === 0)
                });
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
        editor.on("mousewheel", this.mousewheelListener);

        this.updateCompletions();
    };

    this.updateCompletions = function(keepPopupPosition) {
        if (keepPopupPosition && this.base && this.completions) {
            var pos = this.editor.getCursorPosition();
            var prefix = this.editor.session.getTextRange({start: this.base, end: pos});
            if (prefix == this.completions.filterText)
                return;
            this.completions.setFilter(prefix);
            if (!this.completions.filtered.length)
                return this.detach();
            if (this.completions.filtered.length == 1
            && this.completions.filtered[0].value == prefix
            && !this.completions.filtered[0].snippet)
                return this.detach();
            this.openPopup(this.editor, prefix, keepPopupPosition);
            return;
        }

        // Save current gatherCompletions session, session is close when a match is insert
        var _id = this.gatherCompletionsId;
        this.gatherCompletions(this.editor, function(err, results) {
            // Only detach if result gathering is finished
            var detachIfFinished = function() {
                if (!results.finished) return;
                return this.detach();
            }.bind(this);

            var prefix = results.prefix;
            var matches = results && results.matches;
            
            if (!matches || !matches.length)
                return detachIfFinished();

            // Wrong prefix or wrong session -> ignore
            if (prefix.indexOf(results.prefix) !== 0 || _id != this.gatherCompletionsId)
                return;

            this.completions = new FilteredList(matches);
            this.completions.setFilter(prefix);
            var filtered = this.completions.filtered;

            // No results
            if (!filtered.length)
                return detachIfFinished();

            // One result equals to the prefix
            if (filtered.length == 1 && filtered[0].value == prefix && !filtered[0].snippet)
                return detachIfFinished();

            // Autoinsert if one result
            if (this.autoInsert && filtered.length == 1)
                return this.insertMatch(filtered[0]);

            this.openPopup(this.editor, prefix, keepPopupPosition);
        }.bind(this));
    };

    this.cancelContextMenu = function() {
        this.editor.$mouseHandler.cancelContextMenu();
    };

}).call(Autocomplete.prototype);

Autocomplete.startCommand = {
    name: "startAutocomplete",
    exec: function(editor) {
        if (!editor.completer)
            editor.completer = new Autocomplete();
        editor.completer.autoInsert = 
        editor.completer.autoSelect = true;
        editor.completer.showPopup(editor);
        // needed for firefox on mac
        editor.completer.cancelContextMenu();
    },
    bindKey: "Ctrl-Space|Ctrl-Shift-Space|Alt-Space"
};

var FilteredList = function(array, filterText, mutateData) {
    this.all = array;
    this.filtered = array;
    this.filterText = filterText || "";
};
(function(){
    this.setFilter = function(str) {
        if (str.length > this.filterText && str.lastIndexOf(this.filterText, 0) === 0)
            var matches = this.filtered;
        else
            var matches = this.all;

        this.filterText = str;
        matches = this.filterCompletions(matches, this.filterText);
        matches = matches.sort(function(a, b) {
            return b.exactMatch - a.exactMatch || b.score - a.score;
        });

        // make unique
        var prev = null;
        matches = matches.filter(function(item){
            var caption = item.value || item.caption || item.snippet;
            if (caption === prev) return false;
            prev = caption;
            return true;
        });

        this.filtered = matches;
    };
    this.filterCompletions = function(items, needle) {
        var results = [];
        var upper = needle.toUpperCase();
        var lower = needle.toLowerCase();
        loop: for (var i = 0, item; item = items[i]; i++) {
            var caption = item.value || item.caption || item.snippet;
            if (!caption) continue;
            var lastIndex = -1;
            var matchMask = 0;
            var penalty = 0;
            var index, distance;
            // caption char iteration is faster in Chrome but slower in Firefox, so lets use indexOf
            for (var j = 0; j < needle.length; j++) {
                // TODO add penalty on case mismatch
                var i1 = caption.indexOf(lower[j], lastIndex + 1);
                var i2 = caption.indexOf(upper[j], lastIndex + 1);
                index = (i1 >= 0) ? ((i2 < 0 || i1 < i2) ? i1 : i2) : i2;
                if (index < 0)
                    continue loop;
                distance = index - lastIndex - 1;
                if (distance > 0) {
                    // first char mismatch should be more sensitive
                    if (lastIndex === -1)
                        penalty += 10;
                    penalty += distance;
                }
                matchMask = matchMask | (1 << index);
                lastIndex = index;
            }
            item.matchMask = matchMask;
            item.exactMatch = penalty ? 0 : 1;
            item.score = (item.score || 0) - penalty;
            results.push(item);
        }
        return results;
    };
}).call(FilteredList.prototype);

exports.Autocomplete = Autocomplete;
exports.FilteredList = FilteredList;

});
