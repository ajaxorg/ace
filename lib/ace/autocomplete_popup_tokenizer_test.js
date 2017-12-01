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

if (typeof process !== "undefined") {
    require("amd-loader");
    require("./test/mockdom");
}

define(function(require, exports, module) {
"use strict";

var EditSession = require("./edit_session").EditSession;
var Editor = require("./editor").Editor;
var Text = require("./mode/text").Mode;
var MockRenderer = require("./test/mockrenderer").MockRenderer;
var Autocomplete = require("./autocomplete").Autocomplete;
var assert = require("./test/assertions");
var textCompleter = require("./autocomplete/text_completer");

function forceTokenize(session){
    for (var i = 0, l = session.getLength(); i < l; i++)
        session.getTokens(i)
}

module.exports = {

    setUp : function(next) {
        this.editor = new Editor(new MockRenderer());
        this.editor.completers = [textCompleter];
        this.autocomplete = new Autocomplete();
        next();
    },

    "test: popup tokenizer works on string exactly 31 characters": function() {
        var session = new EditSession(["000000000000000000000000000000A A"]);
        this.editor.setSession(session);
        this.editor.getSession().getSelection().moveCursorTo(1, 0);
        this.editor.completer = this.autocomplete;
        this.editor.completer.autoInsert = 
        this.editor.completer.autoSelect = false;
        this.editor.completer.showPopup(this.editor, true);

        var tokens = this.autocomplete.popup.session.getTokens(0);
        // should be one token before highlight, one token for highlight
        // and one token for meta tag
        assert.equal(tokens.length, 3);
    },

    "test: popup tokenizer works on string over 31 characters" : function() {
        var session = new EditSession(["000000000000000000000000000000X00A A"]);
        this.editor.setSession(session);
        this.editor.getSession().getSelection().moveCursorTo(1, 0);
        this.editor.completer = this.autocomplete;
        this.editor.completer.autoInsert = 
        this.editor.completer.autoSelect = false;
        this.editor.completer.showPopup(this.editor, true);

        var tokens = this.autocomplete.popup.session.getTokens(0);
        // should be one token before highlight, one token for highlight
        // and one token for meta tag
        assert.equal(tokens.length, 3);
    },

};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
