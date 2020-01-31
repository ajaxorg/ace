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

var ace = require("./ace");
var EditSession = require("./edit_session").EditSession;
var Editor = require("./editor").Editor;
var UndoManager = require("./undomanager").UndoManager;
var MockRenderer = require("./test/mockrenderer").MockRenderer;
var JavaScriptMode = require("./mode/javascript").Mode;
var HTMLMode = require("./mode/html").Mode;
var assert = require("./test/assertions");
var editor;

var exec = function(name, times, args) {
    do {
        editor.commands.exec(name, editor, args);
    } while(times --> 1);
};


module.exports = {

    "test modifyNumber": function() {
        editor = new Editor(new MockRenderer());
        editor.setValue("999");
        editor.execCommand(editor.commands.byName.modifyNumberUp);
        assert.equal(editor.getValue(), "1000");

        editor.setValue("999f");
        editor.execCommand(editor.commands.byName.modifyNumberUp);
        assert.equal(editor.getValue(), "999f");

        editor.setValue("1000");
        editor.execCommand(editor.commands.byName.modifyNumberDown);
        assert.equal(editor.getValue(), "999");

        editor.setValue("1000.1");
        editor.execCommand(editor.commands.byName.modifyNumberDown);
        assert.equal(editor.getValue(), "1000.0");

        editor.setValue("123.3", 1);
        exec("gotoleft", 2);
        editor.execCommand(editor.commands.byName.modifyNumberDown);
        assert.equal(editor.getValue(), "122.3");
    },
    "test duplicateSelection": function() {
        editor = new Editor(new MockRenderer());

        editor.setValue("123.3", 1);
        exec("selectleft", 2);
        editor.execCommand(editor.commands.byName.duplicateSelection);
        assert.equal(editor.getValue(), "123.3.3");

        editor.setValue("124.3", 1);
        exec("gotoleft", 3);
        exec("selectright", 2);
        editor.execCommand(editor.commands.byName.duplicateSelection);
        assert.equal(editor.getValue(), "124.4.3");
        editor.clearSelection();
        editor.execCommand(editor.commands.byName.duplicateSelection);
        assert.equal(editor.getValue(), "124.4.3\n124.4.3");
    },
    "test editor find": function() {
        editor = new Editor(new MockRenderer());

        editor.setValue("for for foo", 1);
        exec("gotoleft", 8);
        exec("selectleft", 3);
        editor.execCommand(editor.commands.byName.findnext);
        assert.range(editor.selection.getRange(), 0, 4, 0, 7);

        editor.setValue("for for for foo", 1);
        exec("gotoleft", 8);
        exec("selectleft", 3);
        editor.execCommand(editor.commands.byName.findprevious);
        assert.range(editor.selection.getRange(), 0, 0, 0, 3);

        editor.setValue("foo for foo foo", 1);
        exec("gotoleft", 8);
        editor.execCommand(editor.commands.byName.selectOrFindNext);
        assert.range(editor.selection.getRange(), 0, 4, 0, 7);

        editor.setValue("foo for foo foo", 1);
        exec("gotoleft", 7);
        exec("selectright", 3);
        editor.execCommand(editor.commands.byName.selectOrFindNext);
        assert.range(editor.selection.getRange(), 0, 12, 0, 15);

        editor.setValue("foo for foo foo", 1);
        exec("gotoleft", 8);
        editor.execCommand(editor.commands.byName.selectOrFindPrevious);
        assert.range(editor.selection.getRange(), 0, 4, 0, 7);

        editor.setValue("foo for foo foo", 1);
        exec("gotoleft", 7);
        exec("selectright", 3);
        editor.execCommand(editor.commands.byName.selectOrFindPrevious);
        assert.range(editor.selection.getRange(), 0, 0, 0, 3);
    },
    "test overwrite": function() {
        editor = new Editor(new MockRenderer());

        editor.setValue("foo for foo foo", 1);
        exec("gotoleft", 7);
        editor.execCommand(editor.commands.byName.overwrite);
        exec("insertstring", 1, "b");
        assert.equal(editor.getValue(),"foo for boo foo");
    },
    "test selections": function() {
        editor = new Editor(new MockRenderer(5));

        editor.setValue("foo for foo foo\nfoo for foo foo", 1);
        exec("gotoleft", 7);
        editor.execCommand(editor.commands.byName.selecttostart);
        assert.range(editor.selection.getRange(), 0, 0, 1, 8);

        editor.setValue("foo for foo foo\nfsdfsd232", 1);
        exec("gotoleft", 3);
        editor.execCommand(editor.commands.byName.selectup);
        assert.range(editor.selection.getRange(), 0, 6, 1, 6);

        editor.setValue("foo for foo foo\nfsdfsd232", 1);
        exec("gotoleft", 9);
        editor.execCommand(editor.commands.byName.selecttoend);
        assert.range(editor.selection.getRange(), 1, 0, 1, 9);

        editor.setValue("foo for foo foo\nfsdfsd232", 1);
        exec("gotostart", 1);
        exec("gotoright", 3);
        editor.execCommand(editor.commands.byName.selectdown);
        assert.range(editor.selection.getRange(), 0, 3, 1, 3);

        editor.setValue("foo for foo foo\nfsdfsd232", 1);
        exec("gotoleft", 4);
        editor.execCommand(editor.commands.byName.selecttolinestart);
        assert.range(editor.selection.getRange(), 1, 0, 1, 5);

        editor.setValue("foo for foo foo", 1);
        exec("gotoleft", 7);
        editor.execCommand(editor.commands.byName.selectwordright);
        assert.range(editor.selection.getRange(), 0, 8, 0, 11);

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        exec("gotoright", 2);
        exec("selectright", 2);
        editor.execCommand(editor.commands.byName.selecttolineend);
        assert.range(editor.selection.getRange(), 0, 2, 0, 15);

        // dublicate command
        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        exec("gotoright", 2);
        exec("selectright", 2);
        editor.execCommand(editor.commands.byName.selectlineend);
        assert.range(editor.selection.getRange(), 0, 2, 0, 15);

        editor.setValue("foo for foo foo", 1);
        exec("gotoleft", 2);
        editor.execCommand(editor.commands.byName.selectlinestart);
        assert.range(editor.selection.getRange(), 0, 0, 0, 13);

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        exec("gotoright", 3);
        exec("selectright", 3);
        editor.execCommand(editor.commands.byName.invertSelection);
        assert.range(editor.selection.getAllRanges()[0], 0, 0, 0, 3);
        assert.range(editor.selection.getAllRanges()[1], 0, 6, 0, 15);

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        exec("selectright", 3);
        editor.execCommand(editor.commands.byName.invertSelection);
        assert.range(editor.selection.getRange(), 0, 3, 0, 15);

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        editor.execCommand(editor.commands.byName.invertSelection);
        assert.range(editor.selection.getRange(), 0, 0, 0, 15);

        editor.setValue("foo for foo foo");
        editor.execCommand(editor.commands.byName.invertSelection);
        assert.range(editor.selection.getRange(), 0, 15, 0, 15);

        // ToDO: plenty of matching tests
        editor.session.setMode(new HTMLMode);
        editor.setValue("<html><head></head> abcd</html>", 1);
        exec("gotostart", 1);
        exec("gotoright", 3);
        editor.execCommand(editor.commands.byName.selecttomatching);
        assert.range(editor.selection.getRange(), 0, 3, 0, 24);

        editor.setValue("<html><div><div>abcd</div></html>", 1);
        exec("gotostart", 1);
        exec("gotoright", 11);
        editor.execCommand(editor.commands.byName.selecttomatching);
        assert.range(editor.selection.getRange(), 0, 11, 0, 26);

        editor.setValue("<html><div><div>abcd</div></html>", 1);
        exec("gotostart", 1);
        exec("gotoright", 22);
        editor.execCommand(editor.commands.byName.selecttomatching);
        assert.range(editor.selection.getRange(), 0, 20, 0, 22);

        editor.setValue("<html>abcd</div></html>", 1);
        exec("gotostart", 1);
        exec("gotoright", 15);
        editor.execCommand(editor.commands.byName.selecttomatching);
        editor.execCommand(editor.commands.byName.selecttomatching);
        assert.range(editor.selection.getRange(), 0, 6, 0, 15);

        editor.setValue("<html>abcd</div></div></html>", 1);
        exec("gotostart", 1);
        exec("gotoright", 21);
        editor.execCommand(editor.commands.byName.selecttomatching);
        editor.execCommand(editor.commands.byName.selecttomatching);
        assert.range(editor.selection.getRange(), 0, 6, 0, 21);

        editor.setValue("", 1);
        exec("gotostart", 1);
        exec("gotoright", 3);
        editor.execCommand(editor.commands.byName.selecttomatching);
        assert.range(editor.selection.getRange(), 0, 0, 0, 0);

        editor.session.setMode(new JavaScriptMode);
        editor.setValue("if (state == 1) {alert(1);}", -1);
        exec("gotowordright", 9);
        editor.execCommand(editor.commands.byName.selecttomatching);
        assert.range(editor.selection.getRange(), 0, 17, 0, 26);

        editor.setValue("if (state == 1) {}", 1);
        exec("gotoleft", 1);
        editor.execCommand(editor.commands.byName.selecttomatching);
        assert.range(editor.selection.getRange(), 0, 17, 0, 17);

        editor.setValue("if (state == 1) {alert(1);}", 1);
        editor.selection.moveTo(0, 16);
        editor.execCommand(editor.commands.byName.selecttomatching);
        assert.range(editor.selection.getRange(), 0, 16, 0, 16);

        editor.setValue("if (state == 1) {alert(1);}", 1);
        exec("gotostart", 1);
        exec("gotoright", 16);
        exec("selectright", 10);
        editor.execCommand(editor.commands.byName.selecttomatching);
        assert.range(editor.selection.getRange(), 0, 16, 0, 17);

        editor.setValue("<html>abcd</div></div></html>", 1);
        exec("gotostart", 1);
        exec("gotoright", 6);
        editor.execCommand(editor.commands.byName.selecttomatching);
        // TODO: assert.range should return selection until the </html> instead of </div>

        editor.setValue("<html>abcd</div>\n</div></html>", 1);
        exec("gotostart", 1);
        exec("gotoright", 6);
        editor.execCommand(editor.commands.byName.expandtoline);
        editor.execCommand(editor.commands.byName.expandtoline);
        assert.range(editor.selection.getRange(), 0, 0, 1, 13);
    },
    "test goto": function() {
        editor = new Editor(new MockRenderer());

        editor.setValue("foo for foo foo\nfsdfsd232", 1);
        editor.execCommand(editor.commands.byName.golineup);
        assert.position(editor.getCursorPosition(), 0, 9);

        editor.setValue("foo for foo foo\nfsdfsd232\ndfsf", 1);
        exec("gotostart", 1);
        exec("selectdown", 1);
        editor.execCommand(editor.commands.byName.golineup);
        assert.position(editor.getCursorPosition(), 0, 0);

        editor.setValue("foo for foo foo\nfsdfsd232\ndfsf", 1);
        exec("selectup", 1);
        editor.execCommand(editor.commands.byName.golinedown);
        assert.position(editor.getCursorPosition(), 2, 4);

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        exec("selectright", 2);
        editor.execCommand(editor.commands.byName.gotoright);
        assert.position(editor.getCursorPosition(), 0, 2);

        editor.setValue("foo for foo foo", 1);
        editor.execCommand(editor.commands.byName.gotowordleft);
        assert.position(editor.getCursorPosition(), 0, 12);

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        editor.execCommand(editor.commands.byName.gotowordright);
        assert.position(editor.getCursorPosition(), 0, 3);
    },
    "test cut/cut_or_delete": function() {
        editor = new Editor(new MockRenderer());

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        exec("selectright", 3);
        editor.execCommand(editor.commands.byName.cut);
        assert.equal(editor.getValue(), " for foo foo");

        editor.setValue("foo for foo foo\nfoo", 1);
        //exec("gotostart", 1);
        exec("selectall", 1);
        editor.execCommand(editor.commands.byName.cut);
        assert.equal(editor.getValue(), "");

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        editor.execCommand(editor.commands.byName.cut);
        assert.equal(editor.getValue(), "foo for foo foo");

        editor.setValue("foo for foo foo", 1);
        editor.execCommand(editor.commands.byName.cut_or_delete);
        assert.equal(editor.getValue(), "foo for foo fo");

        editor.session.setMode(new JavaScriptMode);
        editor.setValue("foo for foo foo", 1);
        exec("selectleft", 2);
        assert.ok(editor.execCommand("cut_or_delete") == false);
    },
    "test sortlines": function() {
        editor = new Editor(new MockRenderer());

        editor.setValue("def\nabd\nacde", 1);
        exec("selectall", 1);
        editor.execCommand(editor.commands.byName.sortlines);
        assert.equal(editor.getValue(), "abd\nacde\ndef");

        editor.setValue("def\nabd\nabd", 1);
        exec("selectall", 1);
        editor.execCommand(editor.commands.byName.sortlines);
        assert.equal(editor.getValue(), "abd\nabd\ndef");
    },
    "test togglecomments/blockcomments": function() {
        editor = new Editor(new MockRenderer());
        editor.session.setMode(new JavaScriptMode);

        editor.setValue("def\nabd\nabd");
        editor.execCommand(editor.commands.byName.togglecomment);
        assert.equal(editor.getValue(), "// def\n// abd\n// abd");

        editor.setValue("def\nabd\nabd");
        editor.execCommand(editor.commands.byName.toggleBlockComment);
        assert.equal(editor.getValue(), "/*def\nabd\nabd*/");
    },
    "test redo without undoManager": function() {
        editor = new Editor(new MockRenderer());

        editor.session.setValue("def\nabd\nabd");
        exec("selectall", 1);
        exec("backspace", 1);
        exec("undo", 1);
        assert.equal(editor.getValue(), "");
        editor.execCommand(editor.commands.byName.redo);
        assert.equal(editor.getValue(), "");
    },
    "test redo": function() {
        editor = new Editor(new MockRenderer());
        editor.session.setUndoManager(new UndoManager());

        editor.session.setValue("def\nabd\nabd");
        exec("selectall", 1);
        exec("backspace", 1);
        exec("undo", 1);
        assert.equal(editor.getValue(), "def\nabd\nabd");
        editor.execCommand(editor.commands.byName.redo);
        assert.equal(editor.getValue(), "");
    },
    "test removetoline": function() {
        editor = new Editor(new MockRenderer());

        editor.setValue("foo for foo foo", 1);
        exec("gotoleft", 3);
        editor.execCommand(editor.commands.byName.removetolinestart);
        assert.equal(editor.getValue(), "foo");

        editor.setValue("foo for foo foo", 1);
        exec("selectleft", 3);
        editor.execCommand(editor.commands.byName.removetolinestart);
        assert.equal(editor.getValue(), "foo for foo ");

        editor.setValue("foo for foo foo", 1);
        exec("gotoleft", 3);
        editor.execCommand(editor.commands.byName.removetolinestarthard);
        assert.equal(editor.getValue(), "foo");

        editor.setValue("foo for foo foo", 1);
        exec("gotoleft", 3);
        exec("selectleft", 3);
        editor.execCommand(editor.commands.byName.removetolinestarthard);
        assert.equal(editor.getValue(), "foo");

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        exec("gotoright", 2);
        editor.execCommand(editor.commands.byName.removetolineend);
        assert.equal(editor.getValue(), "fo");

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        exec("selectright", 2);
        editor.execCommand(editor.commands.byName.removetolineend);
        assert.equal(editor.getValue(), "o for foo foo");

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        exec("gotoright", 2);
        editor.execCommand(editor.commands.byName.removetolineendhard);
        assert.equal(editor.getValue(), "fo");

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        exec("gotoright", 2);
        exec("selectright", 2);
        editor.execCommand(editor.commands.byName.removetolineendhard);
        assert.equal(editor.getValue(), "fo");

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        editor.execCommand(editor.commands.byName.removewordright);
        assert.equal(editor.getValue(), " for foo foo");

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        exec("selectright", 1);
        editor.execCommand(editor.commands.byName.removewordright);
        assert.equal(editor.getValue(), "oo for foo foo");
    },
    "test indent/outdent": function() {
        editor = new Editor(new MockRenderer());

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        editor.execCommand(editor.commands.byName.indent);
        assert.equal(editor.getValue(),"    foo for foo foo");
        // TODO: buggy behaviour with autocompletion. For example, when cursor after f in the middle of the word.

        editor.setValue("foo for foo foo\nfoo for foo foo", 1);
        exec("gotoleft", 3);
        exec("selecttostart", 1);
        editor.execCommand(editor.commands.byName.indent);
        assert.equal(editor.getValue(), "    foo for foo foo\n    foo for foo foo");

        editor.setValue("foo for foo foo\nfoo for foo foo");
        editor.execCommand(editor.commands.byName.indent);
        assert.equal(editor.getValue(), "    foo for foo foo\n    foo for foo foo");

        editor.setValue("foo for foo foo\nfoo for foo foo", 1);
        exec("gotoleft", 3);
        exec("selectleft", 2);
        editor.execCommand(editor.commands.byName.indent);
        assert.equal(editor.getValue(), "foo for foo foo\n    foo for foo foo");

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        exec("indent", 1);
        editor.execCommand(editor.commands.byName.outdent);
        assert.equal(editor.getValue(), "foo for foo foo");

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        exec("indent", 1);
        editor.execCommand(editor.commands.byName.blockoutdent);
        assert.equal(editor.getValue(), "foo for foo foo");

        editor.setValue("foo for foo foo", 1);
        exec("gotostart", 1);
        editor.execCommand(editor.commands.byName.blockindent);
        assert.equal(editor.getValue(),"    foo for foo foo");
    },
    "test splitline": function() {
        editor = new Editor(new MockRenderer());

        editor.setValue("foo for foo foo", 1);
        exec("gotoleft", 3);
        editor.execCommand(editor.commands.byName.splitline);
        assert.equal(editor.getValue(), "foo for foo \nfoo");

        editor.setValue("foo for foo foo", 1);
        exec("selectleft", 3);
        editor.execCommand(editor.commands.byName.splitline);
        assert.equal(editor.getValue(), "foo for foo \n");
    },
    "test touppercase/tolowercase": function() {
        editor = new Editor(new MockRenderer());

        editor.setValue("foo for foo foo");
        editor.execCommand(editor.commands.byName.touppercase);
        assert.equal(editor.getValue(), "FOO FOR FOO FOO");

        editor.setValue("FOO for FOO FOO");
        editor.execCommand(editor.commands.byName.tolowercase);
        assert.equal(editor.getValue(), "foo for foo foo");
    },
    "test joinlines": function() {
        editor = new Editor(new MockRenderer());

        editor.setValue("foo for foo foo\nfoo for foo foo");
        editor.execCommand(editor.commands.byName.joinlines);
        assert.equal(editor.getValue(), "foo for foo foo foo for foo foo");

        editor.setValue("foo for foo foo\nfoo for foo foo\nfoo for foo foo", 1);
        editor.execCommand(editor.commands.byName.joinlines);
        assert.equal(editor.getValue(), "foo for foo foo\nfoo for foo foo\nfoo for foo foo");

        editor.setValue("foo for foo foo\nfoo for foo foo\nfoo for foo foo", 1);
        exec("gotostart", 1);
        exec("selectlineend", 1);
        editor.execCommand(editor.commands.byName.joinlines);
        assert.equal(editor.getValue(), "foo for foo foo foo for foo foo\nfoo for foo foo");
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}