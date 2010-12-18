/* ***** BEGIN LICENSE BLOCK *****
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
 * Ajax.org Services B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
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

define(function(require, exports, module) {

var Document    = require("../document").Document,
    Search      = require("../search").Search,
    assert      = require("./assertions");

var Test = {
    "test: configure the search object" : function() {
        var search = new Search();
        search.set({
            needle: "juhu",
            scope: Search.ALL
        });
    },

    "test: find simple text in document" : function() {
        var doc = new Document(["juhu kinners 123", "456"]);
        var search = new Search().set({
            needle: "kinners"
        });

        var range = search.find(doc);
        assert.position(range.start, 0, 5);
        assert.position(range.end, 0, 12);
    },

    "test: find simple text in next line" : function() {
        var doc = new Document(["abc", "juhu kinners 123", "456"]);
        var search = new Search().set({
            needle: "kinners"
        });

        var range = search.find(doc);
        assert.position(range.start, 1, 5);
        assert.position(range.end, 1, 12);
    },

    "test: find text starting at cursor position" : function() {
        var doc = new Document(["juhu kinners", "juhu kinners 123"]);
        doc.getSelection().moveCursorTo(0, 6);
        var search = new Search().set({
            needle: "kinners"
        });

        var range = search.find(doc);
        assert.position(range.start, 1, 5);
        assert.position(range.end, 1, 12);
    },

    "test: wrap search is off by default" : function() {
        var doc = new Document(["abc", "juhu kinners 123", "456"]);
        doc.getSelection().moveCursorTo(2, 1);

        var search = new Search().set({
            needle: "kinners"
        });

        assert.equal(search.find(doc), null);
    },

    "test: wrap search should wrap at file end" : function() {
        var doc = new Document(["abc", "juhu kinners 123", "456"]);
        doc.getSelection().moveCursorTo(2, 1);

        var search = new Search().set({
            needle: "kinners",
            wrap: true
        });

        var range = search.find(doc);
        assert.position(range.start, 1, 5);
        assert.position(range.end, 1, 12);
    },

    "test: wrap search with no match should return 'null'": function() {
        var doc = new Document(["abc", "juhu kinners 123", "456"]);
        doc.getSelection().moveCursorTo(2, 1);

        var search = new Search().set({
            needle: "xyz",
            wrap: true
        });

        assert.equal(search.find(doc), null);
    },

    "test: case sensitive is by default off": function() {
        var doc = new Document(["abc", "juhu kinners 123", "456"]);

        var search = new Search().set({
            needle: "JUHU"
        });

        assert.range(search.find(doc), 1, 0, 1, 4);
    },

    "test: case sensitive search": function() {
        var doc = new Document(["abc", "juhu kinners 123", "456"]);

        var search = new Search().set({
            needle: "KINNERS",
            caseSensitive: true
        });

        var range = search.find(doc);
        assert.equal(range, null);
    },

    "test: whole word search should not match inside of words": function() {
        var doc = new Document(["juhukinners", "juhu kinners 123", "456"]);

        var search = new Search().set({
            needle: "kinners",
            wholeWord: true
        });

        var range = search.find(doc);
        assert.position(range.start, 1, 5);
        assert.position(range.end, 1, 12);
    },

    "test: find backwards": function() {
        var doc = new Document(["juhu juhu juhu juhu"]);
        doc.getSelection().moveCursorTo(0, 10);
        var search = new Search().set({
            needle: "juhu",
            backwards: true
        });

        var range = search.find(doc);
        assert.position(range.start, 0, 5);
        assert.position(range.end, 0, 9);
    },

    "test: find in selection": function() {
        var doc = new Document(["juhu", "juhu", "juhu", "juhu"]);
        doc.getSelection().setSelectionAnchor(1, 0);
        doc.getSelection().selectTo(3, 5);

        var search = new Search().set({
            needle: "juhu",
            wrap: true,
            scope: Search.SELECTION
        });

        var range = search.find(doc);
        assert.position(range.start, 1, 0);
        assert.position(range.end, 1, 4);

        doc.getSelection().setSelectionAnchor(0, 2);
        doc.getSelection().selectTo(3, 2);

        var range = search.find(doc);
        assert.position(range.start, 1, 0);
        assert.position(range.end, 1, 4);
    },

    "test: find backwards in selection": function() {
        var doc = new Document(["juhu", "juhu", "juhu", "juhu"]);

        var search = new Search().set({
            needle: "juhu",
            wrap: true,
            backwards: true,
            scope: Search.SELECTION
        });

        doc.getSelection().setSelectionAnchor(0, 2);
        doc.getSelection().selectTo(3, 2);

        var range = search.find(doc);
        assert.position(range.start, 2, 0);
        assert.position(range.end, 2, 4);

        doc.getSelection().setSelectionAnchor(0, 2);
        doc.getSelection().selectTo(1, 2);

        assert.equal(search.find(doc), null);
    },

    "test: edge case - match directly before the cursor" : function() {
        var doc = new Document(["123", "123", "juhu"]);

        var search = new Search().set({
            needle: "juhu",
            wrap: true
        });

        doc.getSelection().moveCursorTo(2, 5);

        var range = search.find(doc);
        assert.position(range.start, 2, 0);
        assert.position(range.end, 2, 4);
    },

    "test: edge case - match backwards directly after the cursor" : function() {
        var doc = new Document(["123", "123", "juhu"]);

        var search = new Search().set({
            needle: "juhu",
            wrap: true,
            backwards: true
        });

        doc.getSelection().moveCursorTo(2, 0);

        var range = search.find(doc);
        assert.position(range.start, 2, 0);
        assert.position(range.end, 2, 4);
    },

    "test: find using a regular expression" : function() {
        var doc = new Document(["abc123 123 cd", "abc"]);

        var search = new Search().set({
            needle: "\\d+",
            regExp: true
        });

        var range = search.find(doc);
        assert.position(range.start, 0, 3);
        assert.position(range.end, 0, 6);
    },

    "test: find using a regular expression and whole word" : function() {
        var doc = new Document(["abc123 123 cd", "abc"]);

        var search = new Search().set({
            needle: "\\d+\\b",
            regExp: true,
            wholeWord: true
        });

        var range = search.find(doc);
        assert.position(range.start, 0, 7);
        assert.position(range.end, 0, 10);
    },

    "test: use regular expressions with capture groups": function() {
        var doc = new Document(["  ab: 12px", "  <h1 abc"]);

        var search = new Search().set({
            needle: "(\\d+)",
            regExp: true
        });

        var range = search.find(doc);
        assert.position(range.start, 0, 6);
        assert.position(range.end, 0, 8);
    },

    "test: find all matches in selection" : function() {
        var doc = new Document(["juhu", "juhu", "juhu", "juhu"]);

        var search = new Search().set({
            needle: "uh",
            wrap: true,
            scope: Search.SELECTION
        });

        doc.getSelection().setSelectionAnchor(0, 2);
        doc.getSelection().selectTo(3, 2);

        var ranges = search.findAll(doc);

        assert.equal(ranges.length, 2);
        assert.position(ranges[0].start, 1, 1);
        assert.position(ranges[0].end, 1, 3);
        assert.position(ranges[1].start, 2, 1);
        assert.position(ranges[1].end, 2, 3);
    },

    "test: replace() should return the replacement if the input matches the needle" : function() {
        var search = new Search().set({
            needle: "juhu"
        });

        assert.equal(search.replace("juhu", "kinners"), "kinners");
        assert.equal(search.replace("", "kinners"), null);
        assert.equal(search.replace(" juhu", "kinners"), null);

        // regexp replacement
    },

    "test: replace with a RegExp search" : function() {
        var search = new Search().set({
            needle: "\\d+",
            regExp: true
        });

        assert.equal(search.replace("123", "kinners"), "kinners");
        assert.equal(search.replace("01234", "kinners"), "kinners");
        assert.equal(search.replace("", "kinners"), null);
        assert.equal(search.replace("a12", "kinners"), null);
        assert.equal(search.replace("12a", "kinners"), null);
    },

    "test: replace with RegExp match and capture groups" : function() {
        var search = new Search().set({
            needle: "ab(\\d\\d)",
            regExp: true
        });

        assert.equal(search.replace("ab12", "cd$1"), "cd12");
        assert.equal(search.replace("ab12", "-$&-"), "-ab12-");
        assert.equal(search.replace("ab12", "$$"), "$");
    }
};

module.exports = require("async/test").testcase(Test)
});

if (module === require.main) {
    require("../../../support/paths");
    exports.exec()
}
