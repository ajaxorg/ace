"use strict";

var EditSession = require("./edit_session").EditSession;
var Editor = require("./editor").Editor;
var MockRenderer = require("./test/mockrenderer").MockRenderer;
var Range = require("./range").Range;
var assert = require("./test/assertions");
var Occur = require("./occur").Occur;
var occurStartCommand = require("./commands/occur_commands").occurStartCommand;
var editor, occur;

module.exports = {

    name: "ACE occur.js",

    setUp: function() {
        var session = new EditSession('');
        editor = new Editor(new MockRenderer(), session);
        occur = new Occur();
    },

    "test: find lines matching" : function() {
        editor.session.insert({row: 0, column: 0}, 'abc\ndef\nxyz\nbcxbc');
        var result = occur.matchingLines(editor.session, {needle: 'bc'}),
            expected = [{row: 0, content: 'abc'}, {row: 3, content: 'bcxbc'}];
        assert.deepEqual(result, expected);
    },

    "test: display occurrences" : function() {
        var text = 'abc\ndef\nxyz\nbcx\n';
        editor.session.insert({row: 0, column: 0}, text);
        occur.displayOccurContent(editor, {needle: 'bc'});
        assert.equal(editor.getValue(), 'abc\nbcx');
        occur.displayOriginalContent(editor);
        assert.equal(editor.getValue(), text);
    },

    "test: original position from occur doc" : function() {
        var text = 'abc\ndef\nxyz\nbcx\n';
        editor.session.insert({row: 0, column: 0}, text);
        occur.displayOccurContent(editor, {needle: 'bc'});
        assert.equal(editor.getValue(), 'abc\nbcx');
        var pos = occur.occurToOriginalPosition(editor.session, {row: 1, column: 2});
        assert.position(pos, 3, 2);
    },

    "test: occur command" : function() {
        // setup
        var text = 'hel\nlo\n\nwo\nrld\n';
        editor.session.insert({row: 0, column: 0}, text);
        editor.commands.addCommand(occurStartCommand);

        // run occur for lines including 'o'
        editor.execCommand('occur', {needle: 'o'});
        assert.equal(editor.getValue(), 'lo\nwo');
        // command install OK?
        // assert.ok(editor.getReadOnly(), 'occur doc not marked as read only');
        assert.ok(editor.getKeyboardHandler().isOccurHandler, 'no occur handler installed');
        assert.ok(editor.commands.byName.occurexit, 'no exitoccur command installed');

        // exit occur
        editor.execCommand('occurexit');
        assert.equal(editor.getValue(), text);

        // editor state cleaned up?
        // assert.ok(!editor.getReadOnly(), 'original doc is marked as read only');
        assert.ok(!editor.getKeyboardHandler().isOccurHandler, 'occur handler installed after detach');
        assert.ok(!editor.commands.byName.occurexit, 'exitoccur installed after exiting occur');
    },

    "test: occur navigation" : function() {
        // setup
        var text = 'hel\nlo\n\nwo\nrld\n';
        editor.session.insert({row: 0, column: 0}, text);
        editor.commands.addCommand(occurStartCommand);
        editor.moveCursorToPosition({row: 1, column: 1});

        // run occur for lines including 'o'
        editor.execCommand('occur', {needle: 'o'});
        assert.equal(editor.getValue(), 'lo\nwo');
        assert.position(editor.getCursorPosition(), 0, 1, 'original -> occur pos');

        // move to second line and accept
        editor.moveCursorToPosition({row: 1, column: 1});
        editor.execCommand('occuraccept');

        assert.position(editor.getCursorPosition(), 3, 1, 'occur -> original pos');
    },

    "test: recursive occur" : function() {
        // setup
        var text = 'x\nabc1\nx\nabc2\n';
        editor.session.insert({row: 0, column: 0}, text);
        editor.commands.addCommand(occurStartCommand);

        // orig -> occur1
        editor.execCommand('occur', {needle: 'abc'});
        assert.equal(editor.getValue(), 'abc1\nabc2', "orig -> occur1");

        // occur1 -> occur2
        editor.execCommand('occur', {needle: '2'});
        assert.equal(editor.getValue(), 'abc2', "occur1 -> occur2");

        // occur2 -> occur1
        editor.execCommand('occurexit');
        assert.equal(editor.getValue(), 'abc1\nabc2', "occur2 -> occur1");

        // occur1 -> orig
        editor.execCommand('occurexit');
        assert.equal(editor.getValue(), text, "occur1 -> orig");
    }

};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
