if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

"use strict";

require("../multi_select");

var EditSession = require("./../edit_session").EditSession,
    Editor = require("./../editor").Editor,
    Range = require("./../range").Range,
    MockRenderer = require("./../test/mockrenderer").MockRenderer,
    emacs = require('./emacs'),
    assert = require("./../test/assertions"),
    editor, sel;

function initEditor(docString) {
    var doc = new EditSession(docString.split("\n"));
    editor = new Editor(new MockRenderer(), doc);
    editor.setKeyboardHandler(emacs.handler);
    sel = editor.selection;
}

function print(obj) {
    return JSON.stringify(obj, null, 2);
}

function pluck(arr, what) {
    return arr.map(function(ea) { return ea[what]; });
}

module.exports = {

    "test: detach removes emacs commands from command manager": function() {
        initEditor('');
        assert.ok(!!editor.commands.byName["keyboardQuit"], 'setup error: emacs commands not installed');
        editor.keyBinding.removeKeyboardHandler(editor.getKeyboardHandler());
        assert.ok(!editor.commands.byName["keyboardQuit"], 'emacs commands not removed');
    },

    "test: keyboardQuit clears selection": function() {
        initEditor('foo');
        editor.selectAll();
        editor.execCommand('keyboardQuit');
        assert.ok(editor.selection.isEmpty(), 'selection non-empty');
    },

    "test: exchangePointAndMark without mark set": function() {
        initEditor('foo');
        sel.setRange(Range.fromPoints({row: 0, column: 1}, {row: 0, column: 3}));
        editor.execCommand('exchangePointAndMark');
        assert.deepEqual({row: 0, column: 1}, editor.getCursorPosition(), print(editor.getCursorPosition()));
    },

    "test: exchangePointAndMark with mark set": function() {
        initEditor('foo');
        editor.pushEmacsMark({row: 0, column: 1});
        editor.pushEmacsMark({row: 0, column: 2});
        editor.execCommand('exchangePointAndMark', {count: 4});
        assert.deepEqual({row: 0, column: 2}, editor.getCursorPosition(), print(editor.getCursorPosition()));
        assert.deepEqual([{row: 0, column: 1}, {row: 0, column: 0}], editor.session.$emacsMarkRing, print(editor.session.$emacsMarkRing));
    },

    "test: exchangePointAndMark with selection": function() {
        initEditor('foo');
        editor.pushEmacsMark({row: 0, column: 1});
        editor.pushEmacsMark({row: 0, column: 2});
        sel.setRange(Range.fromPoints({row: 0, column: 0}, {row: 0, column: 1}), true);
        editor.execCommand('exchangePointAndMark');
        assert.deepEqual({row: 0, column: 1}, editor.getCursorPosition(), print(editor.getCursorPosition()));
        assert.deepEqual([{row: 0, column: 1}, {row: 0, column: 2}], editor.session.$emacsMarkRing, print(editor.session.$emacsMarkRing));
    },

    "test: exchangePointAndMark with multi selection": function() {
        initEditor('foo\nhello world\n123');
        var ranges = [[{row: 0, column: 0}, {row: 0, column: 3}],
                      [{row: 1, column: 0}, {row: 1, column: 5}],
                      [{row: 1, column: 6}, {row: 1, column: 11}]];
        ranges.forEach(function(r) {
            sel.addRange(Range.fromPoints(r[0], r[1]));
        });
        assert.equal("foo\nhello\nworld", editor.getSelectedText());
        editor.execCommand('exchangePointAndMark');
        assert.equal("foo\nhello\nworld", editor.getSelectedText());
        assert.deepEqual(pluck(ranges, 0), pluck(sel.getAllRanges(), 'cursor'), "selections dir not inverted");
    },

    "test: exchangePointAndMark with multi cursors": function() {
        initEditor('foo\nhello world\n123');
        var ranges = [[{row: 0, column: 0}, {row: 0, column: 3}],
                      [{row: 1, column: 0}, {row: 1, column: 5}],
                      [{row: 1, column: 6}, {row: 1, column: 11}]];
        // move cursors to the start of each range and set a mark to its end
        // without selecting anything
        ranges.forEach(function(r) {
            editor.pushEmacsMark(r[1]);
            sel.addRange(Range.fromPoints(r[0], r[0]));
        });
        assert.deepEqual(pluck(ranges, 0), pluck(sel.getAllRanges(), 'cursor'), print(sel.getAllRanges()));
        editor.execCommand('exchangePointAndMark');
        assert.deepEqual(pluck(ranges, 1), pluck(sel.getAllRanges(), 'cursor'), "not inverted: " + print(sel.getAllRanges()));
    },

    "test: setMark with multi cursors": function() {
        initEditor('foo\nhello world\n123');
        var positions = [{row: 0, column: 0},
                         {row: 1, column: 0},
                         {row: 1, column: 6}];
        positions.forEach(function(p) { sel.addRange(Range.fromPoints(p,p)); });
        editor.execCommand('setMark');
        assert.deepEqual(positions, editor.session.$emacsMarkRing, print(editor.session.$emacsMarkRing));
    },
    
    "test: killLine": function() {
        initEditor("foo  \n Hello world\n  \n  123");
        sel.setRange(new Range(0, 0, 0, 2));
        editor.endOperation();
        editor.execCommand("killLine");
        assert.equal(editor.getValue(),"fo\n Hello world\n  \n  123");
        editor.execCommand("killLine");
        assert.equal(editor.getValue(),"fo Hello world\n  \n  123");
        editor.execCommand("killLine");
        assert.equal(editor.getValue(),"fo\n  \n  123");
        editor.execCommand("killLine");
        assert.equal(editor.getValue(),"fo\n  123");
        editor.execCommand("killLine");
        assert.equal(editor.getValue(),"fo  123");
        editor.execCommand("killLine");
        assert.equal(editor.getValue(),"fo");
        editor.execCommand("killLine");
        editor.execCommand("yank");
        assert.equal(editor.getValue(),"foo  \n Hello world\n  \n  123");
    }

};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
