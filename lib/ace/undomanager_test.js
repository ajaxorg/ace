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

var editor;


module.exports = {

    name: "ACE undoManager.js",

    "test: reabsing": function() {
        var session = new EditSession("");
        var editor = new Editor(new MockRenderer(), session);
        var undoManager = new UndoManager();
        session.setUndoManager(undoManager);
        
        session.setValue("012345-012345-012345");
        session.insert({row: 0, column: 0}, "xx");
        session.markUndoGroup();
        session.remove(new Range(0, 10, 0, 15));
        session.markUndoGroup();
        session.insert({row: 0, column: 5}, "yy");
        session.markUndoGroup();
        editor.undo();
        editor.undo();
        var rev = session.getUndoManager().startNewGroup();
        session.insert({row: 0, column: 5}, "z\nz");
        session.getUndoManager().markIgnored(rev);
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
        var session = new EditSession("");
        var editor = new Editor(new MockRenderer(), session);
        var undoManager = new UndoManager();
        session.setUndoManager(undoManager);
        
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
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
