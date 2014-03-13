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

var EditSession = require("./../edit_session").EditSession,
    Editor = require("./../editor").Editor,
    MockRenderer = require("./../test/mockrenderer").MockRenderer,
    assert = require("./../test/assertions"),
    HashHandler = require('./hash_handler').HashHandler,
    keys = require('../lib/keys'),
    editor, platform, commandKey,
    assertRangeAndContent;

function initEditor(docString) {
    var doc = new EditSession(docString.split("\n"));
    editor = new Editor(new MockRenderer(), doc);
    platform = editor.commands.platform;
    commandKey = platform === 'mac' ? 'Command' : 'Control';
    assertRangeAndContent = assert.rangeAndContent.bind(assert, editor);
}

module.exports = {

    "test: adding a new keyboard handler does not remove the default handler": function() {
        initEditor('abc');
        var handler = new HashHandler({'del': 'f1'});
        editor.keyBinding.setKeyboardHandler(handler);
        editor.onCommandKey({}, 0, keys['f1']);
        assert.equal('bc', editor.getValue(), "binding of new handler");
        editor.onCommandKey({}, 0, keys['delete']);
        assert.equal('c', editor.getValue(), "bindings of the old handler should still work");
    },

    "test: simulate simple input": function() {
        initEditor('foo\nbar');
        editor.moveCursorToPosition({row: 1, column: 0});

        keys.simulateKey(editor, 'a');
        keys.simulateKey(editor, ' ');
        assertRangeAndContent(1,2,1,2, 'foo\na bar');
    },

    "test: simulateKey select all": function() {
        initEditor('foo\nbar');
        editor.moveCursorToPosition({row: 1, column: 0});

        keys.simulateKey(editor, commandKey + '-a');
        assertRangeAndContent(0,0,1,3, 'foo\nbar');
    },

    "test: simulateKey compound command": function() {
        initEditor('foo\nbar');

        keys.simulateKey(editor, 'Right');
        assertRangeAndContent(0,1,0,1, 'foo\nbar');

        keys.simulateKey(editor, 'Left');
        var selectToEndKeys = editor.commands.byName.selecttoend.bindKey[platform];
        keys.simulateKey(editor, selectToEndKeys);
        assertRangeAndContent(0,0,1,3, 'foo\nbar');

        editor.moveCursorToPosition({row: 0, column: 0});
        var dupKeys = editor.commands.byName.duplicateSelection.bindKey[platform];
        keys.simulateKey(editor, dupKeys);
        assertRangeAndContent(0,0,0,0, 'foo\nfoo\nbar');
    },

    "test: simulate multiple keys at once": function() {
        initEditor('');
        keys.simulateKeys(editor, "h i  t h e e Left r");
        assertRangeAndContent(0,7,0,7, 'hi there');
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
