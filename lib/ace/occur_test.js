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
}

define(function(require, exports, module) {
"use strict";

var EditSession = require("./edit_session").EditSession;
var Editor = require("./editor").Editor;
var MockRenderer = require("./test/mockrenderer").MockRenderer;
var Range = require("./range").Range;
var assert = require("./test/assertions");
var Occur = require("./occur").Occur;
var occurCommands = require("./commands/occur_commands").commands;
var editor, occur, session;

module.exports = {

    name: "ACE occur.js",

    setUp: function() {
        session = new EditSession('');
        editor = new Editor(new MockRenderer(), session);
        occur = new Occur();
    },

    "test: find lines matching" : function() {
        session.doc.insertLines(0, ['abc', 'def', 'xyz', 'bcxbc']);
        var result = occur.matchingLines(session, {needle: 'bc'}),
            expected = [{row: 0, content: 'abc'}, {row: 3, content: 'bcxbc'}];
        assert.deepEqual(result, expected);
    },

    "test: display occurrences" : function() {
        var lines = ['abc', 'def', 'xyz', 'bcx'];
        session.doc.insertLines(0, lines);
        occur.display(session, {needle: 'bc'});
        assert.equal(session.getValue(), 'abc\nbcx');
        occur.displayOriginal(session);
        assert.equal(session.getValue(), lines.join('\n') + '\n');
    },

    "test: occur command" : function() {
        // setup
        var lines = ['hel', 'lo', '', 'wo', 'rld'];
        session.doc.insertLines(0, lines);
        editor.commands.addCommands(occurCommands);

        // run occur for lines including 'o'
        editor.execCommand('occur', {needle: 'o'});
        assert.equal(session.getValue(), 'lo\nwo');

        // command install OK?
        assert.ok(editor.getReadOnly(), 'occur doc not marked as read only');
        assert.ok(editor.getKeyboardHandler().isOccurHandler, 'no occur handler installed');
        assert.ok(editor.commands.byName.occurexit, 'no exitoccur command installed');

        // exit occur
        editor.execCommand('occurexit');
        assert.equal(session.getValue(), lines.join('\n') + '\n');

        // editor state cleaned up?
        assert.ok(!editor.getReadOnly(), 'original doc is marked as read only');
        assert.ok(!editor.getKeyboardHandler().isOccurHandler, 'occur handler installed after detach');
        assert.ok(!editor.commands.byName.occurexit, 'exitoccur installed after exiting occur');
    }

};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
