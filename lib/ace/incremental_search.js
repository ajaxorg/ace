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

    iSearch.activate = function(editor, backwards) {
        this.$editor = editor;
        var pos = editor.getCursorPosition();
        this.$startPos = this.$currentPos = pos;
        // this.$startRange = this.$currentRange = Range.fromPoints(pos, pos);
        // this.$startRange = this.$currentRange = editor.selection.toOrientedRange();
        this.installKeyboardHandler(editor);
        this.$options.needle = '';
        this.$options.backwards = backwards;
    }

    iSearch.deactivate = function(reset) {
        this.cancelSearch(reset);
        this.uninstallKeyboardHandler(this.$editor);
        delete this.$editor;
    }

    iSearch.cancelSearch = function(reset) {
        var e = this.$editor;
        this.$prevNeedle = this.$options.needle;
        this.$options.needle = '';
        e.session.highlight(null);
        if (reset) {
            e.moveCursorTo(this.$startPos);
            this.$currentPos = this.$startPos;
        } else {
            e.selection.clearSelection();
        }
        return Range.fromPoints(this.$currentPos, this.$currentPos);
    }

    iSearch.highlightAndFindWithNeedle = function(moveToNext, needleUpdateFunc) {
        if (!this.$editor) return null;
        var options = this.$options;
        if (needleUpdateFunc) options.needle = needleUpdateFunc(options.needle || '') || '';
        if (options.needle.length === 0) {
            return this.cancelSearch(true);
        }

        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        var session = this.$editor.session, pos = this.$currentPos;
        options.start = pos;
        var oldRange = this.$editor.selection.toOrientedRange();
        var found = this.find(session);

        // if (dir === "backward") range = Range.fromPoints(range.end, range.start);
        this.$editor.selection.setRange(found || oldRange, options.backwards);
        if (found && moveToNext) this.$currentPos = options.backwards ? found.end : found.start;

        session.highlight(options.re);
        return found || oldRange;
    }

    this.addChar = function(c) {
        return this.highlightAndFindWithNeedle(false, function(needle) {
            return needle + c;
        });
    }

    iSearch.removeChar = function(c) {
        return this.highlightAndFindWithNeedle(false, function(needle) {
            return needle.length > 0 ? needle.substring(0, needle.length-1) : needle;
        });
    }

    iSearch.next = function(backwards) {
        var currentRange = this.$editor.selection.toOrientedRange();
        this.$currentPos = this.$options.backwards ? currentRange.start : currentRange.end;
        this.$options.backwards = backwards;
        return this.highlightAndFindWithNeedle(true);
    }

    iSearch.installKeyboardHandler = function(editor) {
        // this.$origKeyboardHandlers = [].concat(editor.keyBinding.$handlers);
        // this.$origKeyboardHandlers.reverse().forEach(function(handler) {
        //     editor.keyBinding.removeKeyboardHandler(handler);
        // });
        editor.keyBinding.addKeyboardHandler(this.$keyboardHandler);
    }

    iSearch.uninstallKeyboardHandler = function(editor) {
        editor.keyBinding.removeKeyboardHandler(this.$keyboardHandler);
        // if (this.$origKeyboardHandlers) {
        //     this.$origKeyboardHandlers.forEach(function(handler) {
        //         editor.keyBinding.addKeyboardHandler(handler);
        //     });
        //     delete this.$origKeyboardHandlers;
        // }
    }

    iSearch.message = function(msg) {
        console.log(msg);
        if (this.commandLine)
            this.commandLine.setValue(msg, 1);
    }

    iSearch.handleKeyboard = function(data, hashId, key, keyCode) {
        this.message("data: " + data + ", hashId: " + hashId + ", key: " + key + ", keyCode: " + keyCode);
        var stop = {command: 'null'},
            result = undefined;

        console.log(this.$options.needle);
        if (hashId === 0) {
            if (key === 'backspace') { this.removeChar(); result = stop; }
            if (key === 'return') { this.deactivate(); this.message(''); return stop; }
            if (key === 'esc') { this.deactivate(true); this.message(''); return stop; }
            if (key.length === 1) { this.addChar(key); result = stop; }
        }

        if (hashId === 1) {
            if (key === 's' || key === 'r') {
                if (this.$options.needle.length === 0)
                    this.$options.needle = this.$prevNeedle || '';
                this.next(key === 'r');
                result = stop;
            }
            if (key === 'g') { this.deactivate(true); this.message(''); return stop; }
            // let others handle but don't deactivate iSearch
            // stop.passEvent = true;
            // return stop;
        }

        this.message((this.$options.backwards ? 'reverse-' : '') + 'isearch: ' + this.$options.needle);
        // this.deactivate();

        return result;
    }


}).call(IncrementalSearch.prototype);


exports.IncrementalSearch = IncrementalSearch;

});
