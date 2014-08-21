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
var MultiSelect = require("./multi_select").MultiSelect;

var editor;
var exec = function(name, times, args) {
    do {
        editor.commands.exec(name, editor, args);
    } while(times --> 1)
};
var testRanges = function(str) {
    assert.equal(editor.selection.getAllRanges() + "", str + "");
}

module.exports = {

    name: "ACE multi_select.js",

    "test: multiselect editing": function() {
        var doc = new EditSession([
            "w1.w2",
            "    wtt.w",
            "    wtt.w"
        ]);
        editor = new Editor(new MockRenderer(), doc);
        MultiSelect(editor);

        editor.navigateFileEnd();
        exec("selectMoreBefore", 3);
        assert.ok(editor.inMultiSelectMode);
        assert.equal(editor.selection.getAllRanges().length, 4);

        var newLine = editor.session.getDocument().getNewLineCharacter();
        var copyText = "wwww".split("").join(newLine);
        assert.equal(editor.getCopyText(), copyText);
        exec("insertstring", 1, "a");
        exec("backspace", 2);
        assert.equal(editor.session.getValue(), "w1.w2\ntt\ntt");
        assert.equal(editor.selection.getAllRanges().length, 4);

        exec("selectall");
        assert.ok(!editor.inMultiSelectMode);
        //assert.equal(editor.selection.getAllRanges().length, 1);
    },

    "test: multiselect navigation": function() {
        var doc = new EditSession([
            "w1.w2",
            "    wtt.w",
            "    wtt.we"
        ]);
        editor = new Editor(new MockRenderer(), doc);
        MultiSelect(editor);

        editor.selectMoreLines(1);
        testRanges("Range: [0/0] -> [0/0],Range: [1/0] -> [1/0]");
        assert.ok(editor.inMultiSelectMode);

        exec("golinedown");
        exec("gotolineend");
        testRanges("Range: [1/9] -> [1/9],Range: [2/10] -> [2/10]");
        exec("selectwordleft");

        testRanges("Range: [1/8] -> [1/9],Range: [2/8] -> [2/10]");
        exec("golinedown", 2);
        assert.ok(!editor.inMultiSelectMode);
    },

    "test: multiselect session change": function() {
        var doc = new EditSession([
            "w1.w2",
            "    wtt.w",
            "    wtt.w"
        ]);
        editor = new Editor(new MockRenderer(), doc);
        MultiSelect(editor);

        editor.selectMoreLines(1)
        testRanges("Range: [0/0] -> [0/0],Range: [1/0] -> [1/0]");
        assert.ok(editor.inMultiSelectMode);

        var doc2 = new EditSession(["w1"]);
        editor.setSession(doc2);
        assert.ok(!editor.inMultiSelectMode);

        editor.setSession(doc);
        assert.ok(editor.inMultiSelectMode);
    },

    "test: multiselect addRange": function() {
        var doc = new EditSession([
            "w1.w2",
            "    wtt.w",
            "    wtt.w"
        ]);
        editor = new Editor(new MockRenderer(), doc);
        MultiSelect(editor);
        var selection = editor.selection;

        var range1 = new Range(0, 2, 0, 4);
        editor.selection.fromOrientedRange(range1);

        var range2 = new Range(0, 3, 0, 4);
        selection.addRange(range2);
        assert.ok(!editor.inMultiSelectMode);
        assert.ok(range2.isEqual(editor.selection.getRange()));

        var range3 = new Range(0, 1, 0, 1);
        selection.addRange(range3);
        assert.ok(editor.inMultiSelectMode);
        testRanges([range3, range2]);

        var range4 = new Range(0, 0, 4, 0);
        selection.addRange(range4);
        assert.ok(!editor.inMultiSelectMode);
    },

    "test: onPaste in command with multiselect": function() {
        var doc = new EditSession(["l1", "l2"]);
        editor = new Editor(new MockRenderer(), doc);
        MultiSelect(editor);
        editor.commands.addCommand({
            name: 'insertfoo',
            exec: function(ed) { ed.onPaste('foo'); },
            multiSelectAction: "forEach"
        });
        var selection = editor.selection;
        var range1 = new Range(0,2,0,2);
        var range2 = new Range(1,2,1,2);
        selection.fromOrientedRange(range1)
        selection.addRange(range2);
        editor.execCommand('insertfoo');
        assert.equal('l1foo\nl2foo', editor.getValue());
    },

    "test multiselect fromJSON/toJSON": function() {
        var doc = new EditSession(["l1", "l2"]);
        editor = new Editor(new MockRenderer(), doc);
        MultiSelect(editor);
        var selection = editor.selection;
        
        var before = selection.toJSON();
        
        var range1 = new Range(0,2,0,2);
        var range2 = new Range(1,2,1,2);
        selection.fromOrientedRange(range1)
        selection.addRange(range2);
        
        var after = selection.toJSON();
        
        selection.fromJSON(before);
        assert.ok(!selection.isEqual(after));
        assert.ok(selection.isEqual(before));
        
        selection.fromJSON(after);
        assert.ok(!selection.isEqual(before));
        assert.ok(selection.isEqual(after));
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
