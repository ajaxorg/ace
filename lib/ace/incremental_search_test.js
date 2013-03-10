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
var IncrementalSearch = require("./incremental_search").IncrementalSearch;

var editor, iSearch;
function testRanges(str, ranges) {
    ranges = ranges || editor.selection.getAllRanges();
    assert.equal(ranges + "", str + "");
}

// force "rerender"
function callHighlighterUpdate() {
    var session = editor.session,
        ranges = [],
        mockMarkerLayer = {
            drawSingleLineMarker: function(_, markerRanges) {
                ranges = ranges.concat(markerRanges);
            }
        }
    session.$searchHighlight.update([], mockMarkerLayer, session, {
        firstRow: 0, lastRow: session.getRowLength()});
    return ranges;
}

module.exports = {

    name: "ACE incremental_search.js",

    setUp: function() {
        var session = new EditSession(["abc123", "xyz124"]);
        editor = new Editor(new MockRenderer(), session);
        iSearch = new IncrementalSearch();
    },

    "test: keyboard handler setup" : function() {
        iSearch.activate(editor);
        assert.equal(editor.getKeyboardHandler(), iSearch.$keyboardHandler);
        iSearch.deactivate();
        assert.notEqual(editor.getKeyboardHandler(), iSearch.$keyboardHandler);
    },

    "test: find simple text incrementally" : function() {
        iSearch.activate(editor);
        var range = iSearch.addChar('1'), // "1"
            highlightRanges = callHighlighterUpdate(editor.session);
        testRanges("Range: [0/3] -> [0/4]", [range], "range");
        testRanges("Range: [0/3] -> [0/4],Range: [1/3] -> [1/4]", highlightRanges, "highlight");

        range = iSearch.addChar('2'); // "12"
        highlightRanges = callHighlighterUpdate(editor.session);
        testRanges("Range: [0/3] -> [0/5]", [range], "range");
        testRanges("Range: [0/3] -> [0/5],Range: [1/3] -> [1/5]", highlightRanges, "highlight");
        range = iSearch.addChar('3'); // "123"
        highlightRanges = callHighlighterUpdate(editor.session);
        testRanges("Range: [0/3] -> [0/6]", [range], "range");
        testRanges("Range: [0/3] -> [0/6]", highlightRanges, "highlight");

        range = iSearch.removeChar(); // "12"
        highlightRanges = callHighlighterUpdate(editor.session);
        testRanges("Range: [0/3] -> [0/5]", [range], "range");
        testRanges("Range: [0/3] -> [0/5],Range: [1/3] -> [1/5]", highlightRanges, "highlight");

        range = iSearch.forward(); // "12", cursor forward
        highlightRanges = callHighlighterUpdate(editor.session);
        testRanges("Range: [1/3] -> [1/5]", [range], "range");
        testRanges("Range: [0/3] -> [0/5],Range: [1/3] -> [1/5]", highlightRanges, "highlight");

    }

    // // "test: find simple text in document" : function() {
    //     var session = new EditSession(["juhu kinners 123", "456"]);
    //     var search = new Search().set({
    //         needle: "kinners"
    //     });
    // session.getSelection().moveCursorTo(0, 13);
    //     var range = search.find(session);
    //     assert.position(range.start, 0, 5);
    //     assert.position(range.end, 0, 12);
    // },

};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
