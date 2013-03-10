/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
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

var lang = require("./lib/lang");
var oop = require("./lib/oop");
var Range = require("./range").Range;
var Search = require("./search").Search;

/**
 * @class IncrementalSearch
 *
 * Implements immediate searching while the user is typing. When incremental
 * search is activated, keystrokes into the editor will be used for composing
 * a search term. Immediately after every keystroke the search is updated:
 * - so-far-matching characters are highlighted
 * - the cursor is moved to the next match
 *
 **/

/**
 *
 *
 * Creates a new `IncrementalSearch` object. Options:
 *
 * @constructor
 **/
function IncrementalSearch() {
    this.$options = {wrap: false, skipCurrent: false};
    this.$keyboardHandler = this;
}

oop.inherits(IncrementalSearch, Search);

;(function() {

    var iSearch = this;

    iSearch.activate = function(editor) {
        this.$editor = editor;
        this.$startRange = this.$currentRange = editor.selection.toOrientedRange();
        this.installKeyboardHandler(editor);
    }

    this.deactivate = function() {
        this.uninstallKeyboardHandler(this.$editor);
        delete this.$editor;
    }

    iSearch.cancelSearch = function() {
        var session = this.$editor.session,
            sel = this.$editor.selection;
        this.$options.needle = '';
        session.highlight(null);
        sel.setRange(this.$startRange);
        return this.$currentRange = this.$startRange;
    }

    iSearch.highlightAndFindWithNeedle = function(dir, moveToNext, needleUpdateFunc) {
        if (!this.$editor) return null;
        dir = dir || 'forward';
        var session = this.$editor.session,
            options = this.$options;
        if (needleUpdateFunc) options.needle = needleUpdateFunc(options.needle || '') || '';
        if (options.needle.length === 0) {
            return this.cancelSearch();
        }
        if (dir === "forward") {
            options.start = moveToNext ? this.$currentRange.end : this.$currentRange.start;
            options.backwards = false;
        } else {
            options.start = moveToNext ? this.$currentRange.start : this.$currentRange.end;
            options.backwards = true;
        }
        var range = this.find(session);
        if (!range) range = this.$currentRange;

        this.$editor.selection.setRange(range);
        this.$currentRange = range;

        session.highlight(options.re);
        return range;
    }

    this.addChar = function(c) {
        return this.highlightAndFindWithNeedle('forward', false, function(needle) {
            return needle + c;
        });
    },

    iSearch.removeChar = function(c) {
        return this.highlightAndFindWithNeedle('forward', false, function(needle) {
            return needle.length > 0 ? needle.substring(0, needle.length-1) : needle;
        });
    }

    iSearch.forward = function() {
        return this.highlightAndFindWithNeedle('forward', true);
    }

    iSearch.backward = function() {
        return this.highlightAndFindWithNeedle('backward', true);
    }

    this.installKeyboardHandler = function(editor) {
        this.$origKeyboardHandlers = [].concat(editor.keyBinding.$handlers);
        this.$origKeyboardHandlers.reverse().forEach(function(handler) {
            editor.keyBinding.removeKeyboardHandler(handler);
        });
        editor.keyBinding.addKeyboardHandler(this.$keyboardHandler);
    }

    this.uninstallKeyboardHandler = function(editor) {
        editor.keyBinding.removeKeyboardHandler(this.$keyboardHandler);
        if (this.$origKeyboardHandlers) {
            this.$origKeyboardHandlers.forEach(function(handler) {
                editor.keyBinding.addKeyboardHandler(handler);
            });
            delete this.$origKeyboardHandlers;
        }
    }

    iSearch.handleKeyboard = function(data, hashId, key, keyCode) {
        console.log("data: %s, hashId: %s, key: %s, keyCode: %s",
                    data, hashId, key, keyCode);
        if (hashId === 0) {
            if (key === 'backspace') this.removeChar();
            else if (key.length === 1) this.addChar(key);
        }

        if (hashId === 1) {
            if (key === 's') this.forward();
            if (key === 'r') this.backward();
        }

        console.log(this.$options.needle);
        return {command: 'null'}
    }


}).call(IncrementalSearch.prototype);


exports.IncrementalSearch = IncrementalSearch;

});
