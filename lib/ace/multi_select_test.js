/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Harutyun Amirjanyan <amirjanyan AT gmail DOT com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
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

var editor
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
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
