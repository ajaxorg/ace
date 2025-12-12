"use strict";

var EditSession = require("./../edit_session").EditSession,
    Editor = require("../editor").Editor,
    MockRenderer = require("./../test/mockrenderer").MockRenderer,
    assert = require("./../test/assertions"),
    HashHandler = require('./hash_handler').HashHandler,
    keys = require('../lib/keys'),
    editor;

function initEditor(docString) {
    var doc = new EditSession(docString.split("\n"));
    editor = new Editor(new MockRenderer(), doc);
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
    }

};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
