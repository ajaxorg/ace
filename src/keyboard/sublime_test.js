if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

"use strict";

require("../multi_select");

var EditSession = require("./../edit_session").EditSession;
var Editor = require("../editor").Editor;
var Range = require("./../range").Range;
var MockRenderer = require("./../test/mockrenderer").MockRenderer;
var assert = require("./../test/assertions");
var handler = require("./sublime").handler;
var editor;

function initEditor(docString) {
    var doc = new EditSession(docString.split("\n"));
    editor = new Editor(new MockRenderer(), doc);
    editor.setKeyboardHandler(handler);
}

module.exports = {

    "test: move by subwords": function() {
        initEditor("\n   abcDefGHKLmn_op ++ xyz$\nt");
        
        [0, 3, 6, 9, 12, 15, 18, 21, 25, 26, 0, 1, 1].forEach(function(col) {
            assert.equal(editor.selection.lead.column, col);
            editor.execCommand(handler.commands.moveSubWordRight);
        });
        [1, 0, 26, 25, 22, 19, 16, 12, 9, 6, 3, 0, 0].forEach(function(col) {
            assert.equal(editor.selection.lead.column, col);
            editor.execCommand(handler.commands.moveSubWordLeft);
        });
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
