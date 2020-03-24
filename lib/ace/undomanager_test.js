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

require("./multi_select");
var assert = require("./test/assertions");
var Range = require("./range").Range;
var Editor = require("./editor").Editor;
var EditSession = require("./edit_session").EditSession;
var MockRenderer = require("./test/mockrenderer").MockRenderer;
var UndoManager = require("./undomanager").UndoManager;

var editor, session, undoManager;

module.exports = {

    name: "ACE undoManager.js",
    setUp: function() {
        editor = editor || new Editor(new MockRenderer());
        session = new EditSession("");
        undoManager = new UndoManager();
        undoManager.$keepRedoStack = true;
        session.setUndoManager(undoManager);
        editor.setSession(session);
    },

    "test: reabsing": function() {
        session.setValue("012345-012345-012345");
        session.insert({row: 0, column: 0}, "xx");
        session.markUndoGroup();
        session.remove(new Range(0, 10, 0, 15));
        session.markUndoGroup();
        session.insert({row: 0, column: 5}, "yy");
        session.markUndoGroup();
        editor.undo();
        editor.undo();
        var rev = undoManager.startNewGroup();
        session.insert({row: 0, column: 5}, "z\nz");
        undoManager.markIgnored(rev);
        // editor.undo()
        editor.redo();
        editor.redo();
        var val1 = editor.getValue();
        editor.undo();
        editor.undo();
        editor.undo();
        
        editor.redo();
        editor.redo();
        editor.redo();
        var val2 = editor.getValue();
        assert.equal(val1, val2);
    },
    "test: conflicting deletes": function() {
        session.setValue("012345\nabcdefg\nxyz");
        session.remove(new Range(0, 2, 0, 4));
        assert.equal(session.getLine(0), "0145");
        session.markUndoGroup();
        editor.undo();
        session.remove(new Range(0, 1, 0, 5));
        assert.equal(session.getLine(0), "05");
        session.markUndoGroup();
        editor.redo();
        assert.equal(session.getLine(0), "05");
        editor.undo();
        assert.equal(session.getLine(0), "012345");
    },
    "test: several deltas ignored": function() {
        session.setValue("012345\nabcdefg\nxyz");
        session.insert({row: 0, column: 5}, "zzzz");
        var rev = undoManager.startNewGroup();
        session.insert({row: 0, column: 5}, "yyyy");
        session.insert({row: 0, column: 5}, "aaaa");
        undoManager.markIgnored(rev, undoManager.getRevision() + 1);
        editor.undo();
        assert.equal(editor.getValue(), "01234aaaayyyy5\nabcdefg\nxyz");
    },
    "test: canUndo/canRedo and bookmarks": function() {
        session.setValue("012345\nabcdefg\nxyz");
        assert.ok(undoManager.isAtBookmark());
        editor.execCommand("removewordright");
        assert.ok(!undoManager.isAtBookmark());
        var rev = undoManager.getRevision();
        undoManager.bookmark();
        assert.ok(undoManager.isAtBookmark());
        editor.undo();
        assert.ok(!undoManager.isAtBookmark());
        undoManager.bookmark(rev);
        assert.ok(!undoManager.canUndo());
        assert.ok(undoManager.canRedo());
        editor.redo();
        assert.ok(undoManager.isAtBookmark());

        session.insert({row: 0, column: 5}, "yyyy");
        assert.ok(undoManager.canUndo());
        assert.ok(!undoManager.canRedo());
    },
    "test: getRevision": function () {
        session.setValue("012345\nabcdefg\nxyz");
        session.insert({row: 0, column: 5}, "yyyy");
        var rev = undoManager.getRevision();
        assert.equal(rev, 2);
        editor.undo();
        rev = undoManager.getRevision();
        assert.equal(rev, 0);
    },
    "test: swap deltas delete/insert": function () {
        session.setValue("012345\nabcdefg\nxyz");
        session.insert({row: 0, column: 5}, "zzzz");
        undoManager.startNewGroup();
        session.insert({row: 0, column: 5}, "yyyy");
        session.remove(new Range(0, 5, 0, 9));
        var rev = undoManager.startNewGroup();
        session.insert({row: 0, column: 5}, "aaaa");
        undoManager.markIgnored(rev);
        editor.undo();
        assert.equal(editor.getValue(), "01234aaaazzzz5\nabcdefg\nxyz");
    },
    "test: swap deltas insert/delete": function () {
        session.setValue("012345");
        undoManager.startNewGroup();
        session.insert({row: 0, column: 5}, "yyyy");
        var rev = undoManager.startNewGroup();
        session.remove(new Range(0, 5, 0, 9));
        undoManager.markIgnored(rev);
        editor.undo();
        assert.equal(editor.getValue(), "01234yyyy5");

        editor.redo();
        undoManager.startNewGroup();
        session.insert({row: 0, column: 5}, "yyyy");
        var rev1 = undoManager.startNewGroup();
        session.remove(new Range(0, 1, 0, 4));
        undoManager.markIgnored(rev1);
        editor.undo();
        assert.equal(editor.getValue(), "045");

        editor.redo();
        undoManager.startNewGroup();
        session.insert({row: 0, column: 1}, "yyyy");
        var rev2 = undoManager.startNewGroup();
        session.remove(new Range(0, 7, 0, 9));
        undoManager.markIgnored(rev2);
        editor.undo();
        assert.equal(editor.getValue(), "04yy5");
    },
    "test: swap deltas insert/insert": function () {
        session.setValue("012345");
        undoManager.startNewGroup();
        session.insert({row: 0, column: 1}, "yyyy");
        var rev = undoManager.startNewGroup();
        session.insert({row: 0, column: 2}, "xxxx");
        undoManager.markIgnored(rev);
        editor.undo();
        assert.equal(editor.getValue(), "0yyyy12345");
    },
    "test: swap deltas delete/delete": function () {
        session.setValue("012345");
        session.insert({row: 0, column: 5}, "zzzz");
        undoManager.startNewGroup();
        session.insert({row: 0, column: 5}, "yyyy");
        session.remove(new Range(0, 5, 0, 9));
        session.insert({row: 0, column: 5}, "aaaa");
        var rev = undoManager.startNewGroup();
        session.remove(new Range(0, 5, 0, 9));
        undoManager.markIgnored(rev);
        editor.undo();
        assert.equal(editor.getValue(), "01234aaaazzzz5");

        editor.undo();
        assert.equal(editor.getValue(), "01234zzzz5");

        editor.redo();
        var rev1=undoManager.startNewGroup();
        session.insert({row: 0, column: 1}, "yyyy");
        session.remove(new Range(0, 0, 0, 1));
        undoManager.markIgnored(rev1);
        editor.undo();
        assert.equal(editor.getValue(), "yyyy1234zzzz5");

        undoManager.startNewGroup();
        session.remove(new Range(0, 0, 0, 1));
        var rev2=undoManager.startNewGroup();
        session.remove(new Range(0, 3, 0, 5));
        undoManager.markIgnored(rev2);
        editor.undo();
        assert.equal(editor.getValue(), "yyyy34zzzz5");

        editor.redo();
        undoManager.startNewGroup();
        session.remove(new Range(0, 3, 0, 5));
        var rev3=undoManager.startNewGroup();
        session.remove(new Range(0, 1, 0, 5));
        undoManager.markIgnored(rev3);
        editor.undo();
        assert.equal(editor.getValue(), "yyyzzzz5");

    },
    "test: xform deltas insert/insert": function () {
        session.setValue("012345");
        session.insert({row: 0, column: 5}, "zzzz");
        undoManager.startNewGroup();
        session.insert({row: 0, column: 0}, "yyyy");
        editor.undo();
        session.insert({row: 0, column: 5}, "aaaa");
        editor.redo();
        assert.equal(editor.getValue(), "yyyy01234aaaazzzz5");
    },
    "test: xform deltas insert/delete": function () {
        session.setValue("012345");
        session.insert({row: 0, column: 5}, "zzzz");
        undoManager.startNewGroup();
        session.insert({row: 0, column: 0}, "yyyy");
        editor.undo();
        session.remove(new Range(0, 0, 0, 1));
        editor.redo();
        assert.equal(editor.getValue(), "yyyy1234zzzz5");

        session.setValue("012345");
        session.insert({row: 0, column: 5}, "zzzz");
        undoManager.startNewGroup();
        var rev=undoManager.startNewGroup();
        session.insert({row: 0, column: 0}, "yyyy");
        undoManager.markIgnored(rev);
        editor.undo();
        session.remove(new Range(0, 0, 0, 1));
        editor.redo();
        assert.equal(editor.getValue(), "yyy01234zzzz5");
    },
    "test: xform deltas delete/insert": function () {
        session.setValue("012345");
        session.insert({row: 0, column: 0}, "yyyy");
        undoManager.startNewGroup();
        session.remove(new Range(0, 0, 0, 1));
        editor.undo();
        session.insert({row: 0, column: 5}, "zzzz");
        editor.redo();
        assert.equal(editor.getValue(), "yyy0zzzz12345");
    },
    "test: xform deltas delete/delete": function () {
        session.setValue("012345");
        session.insert({row: 0, column: 0}, "yyyy");
        undoManager.startNewGroup();
        session.remove(new Range(0, 3, 0, 4));
        editor.undo();
        session.remove(new Range(0, 4, 0, 5));
        editor.redo();
        assert.equal(editor.getValue(), "yyy12345");

        session.setValue("012345");
        session.insert({row: 0, column: 0}, "yyyy");
        session.remove(new Range(0, 2, 0, 5));
        assert.equal(editor.getValue(), "yy12345");
        editor.undo();
        assert.equal(editor.getValue(), "012345");
        session.remove(new Range(0, 1, 0, 2));
        editor.redo();
        assert.equal(editor.getValue(), "yy2345");

        session.setValue("1234abcd ---");
        session.insert({row: 0, column: 0}, "ijkl");
        session.remove(new Range(0, 2, 0, 8));
        editor.undo();
        session.remove(new Range(0, 4, 0, 7));
        editor.redo();
        assert.equal(editor.getValue(), "ijd ---");
        assert.equal(undoManager.$prettyPrint(), '-[abc]0:4=>0:7\t(12)\n+[ijkl]0:0=>0:4\t(13)\n-[kl1234]0:2=>0:8\n---\n');
    },
    "test: clear redo stack after insert": function () {
        undoManager.$keepRedoStack = false;
        session.insert({row: 0, column: 0}, "y");
        editor.undo();
        assert.equal(session.$undoManager.$redoStack.length, 1);
        session.insert({row: 0, column: 0}, "y");
        assert.equal(session.$undoManager.$redoStack.length, 0);
    },
    "test: ignore deltas with incorrect boundaries": function () {
        session.setValue("012\n345\n678");
        undoManager.add({
            action: "remove",
            start: {row: 1, column: 0},
            end: {row: 3, column: 0},
            lines: ["hello", "world"]
        });
        editor.undo();
        assert.equal(editor.getValue(), "012\nhello\nworld345\n678");

        session.setValue("012\n345\n678");
        undoManager.add({
            action: "remove",
            start: {row: 3, column: 0},
            end: {row: 5, column: 0},
            lines: ["hello", "world"]
        });
        editor.undo();
        assert.equal(editor.getValue(), "012\n345\n678\nhello\nworld");


        session.setValue("012\n345\n678");
        undoManager.add({
            action: "remove",
            start: {row: 5, column: 0},
            end: {row: 7, column: 0},
            lines: ["hello", "world"]
        });
        editor.undo();
        assert.equal(editor.getValue(), "012\n345\n678");

        session.setValue("012\n345\n678");
        undoManager.add({
            action: "insert",
            start: {row: 3, column: 0},
            end: {row: 5, column: 0},
            lines: ["hello", "world"]
        });
        editor.undo();
        assert.equal(editor.getValue(), "012\n345\n678");

        session.setValue("012\n345\n678");
        undoManager.$redoStack.push([{
            action: "remove",
            start: {row: 2, column: 0},
            end: {row: 4, column: 0},
            lines: ["hello", "world"]
        }]);
        editor.redo();
        assert.equal(editor.getValue(), "012\n345\n678");
    },
    "test: do not ignore valid deltas": function () {
        editor.setValue("");
        editor.insert("\n");
        editor.insert("\n");
        editor.insert("\n");
        editor.insert("\n");
        editor.undo();
        assert.equal(editor.getValue(), "");
        editor.redo();
        assert.equal(editor.getValue(), "\n\n\n\n");
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
