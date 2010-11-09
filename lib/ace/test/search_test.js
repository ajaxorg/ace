/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require.def([
     "ace/Document",
     "ace/Search"
 ], function(
     Document,
     Search
 ) {

var SearchTest = new TestCase("SearchTest", {

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
        assertPosition(0, 5, range.start);
        assertPosition(0, 12, range.end);
    },

    "test: find simple text in next line" : function() {
        var doc = new Document(["abc", "juhu kinners 123", "456"]);
        var search = new Search().set({
            needle: "kinners"
        });

        var range = search.find(doc);
        assertPosition(1, 5, range.start);
        assertPosition(1, 12, range.end);
    },

    "test: find text starting at cursor position" : function() {
        var doc = new Document(["juhu kinners", "juhu kinners 123"]);
        doc.getSelection().moveCursorTo(0, 6);
        var search = new Search().set({
            needle: "kinners"
        });

        var range = search.find(doc);
        assertPosition(1, 5, range.start);
        assertPosition(1, 12, range.end);
    },

    "test: wrap search is off by default" : function() {
        var doc = new Document(["abc", "juhu kinners 123", "456"]);
        doc.getSelection().moveCursorTo(2, 1);

        var search = new Search().set({
            needle: "kinners"
        });

        assertEquals(null, search.find(doc));
    },

    "test: wrap search should wrap at file end" : function() {
        var doc = new Document(["abc", "juhu kinners 123", "456"]);
        doc.getSelection().moveCursorTo(2, 1);

        var search = new Search().set({
            needle: "kinners",
            wrap: true
        });

        var range = search.find(doc);
        assertPosition(1, 5, range.start);
        assertPosition(1, 12, range.end);
    },

    "test: wrap search with no match should return 'null'": function() {
        var doc = new Document(["abc", "juhu kinners 123", "456"]);
        doc.getSelection().moveCursorTo(2, 1);

        var search = new Search().set({
            needle: "xyz",
            wrap: true
        });

        assertEquals(null, search.find(doc));
    },

    "test: case sensitive is by default off": function() {
        var doc = new Document(["abc", "juhu kinners 123", "456"]);

        var search = new Search().set({
            needle: "JUHU"
        });

        assertEquals(null, search.find(doc));
    },

    "test: case sensitive search": function() {
        var doc = new Document(["abc", "juhu kinners 123", "456"]);

        var search = new Search().set({
            needle: "KINNERS",
            caseSensitive: true
        });

        var range = search.find(doc);
        assertPosition(1, 5, range.start);
        assertPosition(1, 12, range.end);
    },

    "test: whole word search should not match inside of words": function() {
        var doc = new Document(["juhukinners", "juhu kinners 123", "456"]);

        var search = new Search().set({
            needle: "kinners",
            wholeWord: true
        });

        var range = search.find(doc);
        assertPosition(1, 5, range.start);
        assertPosition(1, 12, range.end);
    },

    "test: find backwards": function() {
        var doc = new Document(["juhu juhu juhu juhu"]);
        doc.getSelection().moveCursorTo(0, 10);
        var search = new Search().set({
            needle: "juhu",
            backwards: true
        });

        var range = search.find(doc);
        assertPosition(0, 5, range.start);
        assertPosition(0, 9, range.end);
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
        assertPosition(1, 0, range.start);
        assertPosition(1, 4, range.end);

        doc.getSelection().setSelectionAnchor(0, 2);
        doc.getSelection().selectTo(3, 2);

        var range = search.find(doc);
        assertPosition(1, 0, range.start);
        assertPosition(1, 4, range.end);
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
        assertPosition(2, 0, range.start);
        assertPosition(2, 4, range.end);

        doc.getSelection().setSelectionAnchor(0, 2);
        doc.getSelection().selectTo(1, 2);

        assertEquals(null, search.find(doc));
    },

    "test: edge case - match directly before the cursor" : function() {
        var doc = new Document(["123", "123", "juhu"]);

        var search = new Search().set({
            needle: "juhu",
            wrap: true
        });

        doc.getSelection().moveCursorTo(2, 5);

        var range = search.find(doc);
        assertPosition(2, 0, range.start);
        assertPosition(2, 4, range.end);
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
        assertPosition(2, 0, range.start);
        assertPosition(2, 4, range.end);
    },

    "test: find using a regular expression" : function() {
        var doc = new Document(["abc123 123 cd", "abc"]);

        var search = new Search().set({
            needle: "\\d+",
            regExp: true
        });

        var range = search.find(doc);
        assertPosition(0, 3, range.start);
        assertPosition(0, 6, range.end);
    },

    "test: find using a regular expression and whole word" : function() {
        var doc = new Document(["abc123 123 cd", "abc"]);

        var search = new Search().set({
            needle: "\\d+\\b",
            regExp: true,
            wholeWord: true
        });

        var range = search.find(doc);
        assertPosition(0, 7, range.start);
        assertPosition(0, 10, range.end);
    },

    "test: use regular expressions with capture groups": function() {
        var doc = new Document(["  ab: 12px", "  <h1 abc"]);

        var search = new Search().set({
            needle: "(\\d+)",
            regExp: true
        });

        var range = search.find(doc);
        assertPosition(0, 6, range.start);
        assertPosition(0, 8, range.end);
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

        assertEquals(2, ranges.length);
        assertPosition(1, 1, ranges[0].start);
        assertPosition(1, 3, ranges[0].end);
        assertPosition(2, 1, ranges[1].start);
        assertPosition(2, 3, ranges[1].end);
    },

    "test: replace() should return the replacement if the input matches the needle" : function() {
        var search = new Search().set({
            needle: "juhu"
        });

        assertEquals("kinners", search.replace("juhu", "kinners"));
        assertEquals(null, search.replace("", "kinners"));
        assertEquals(null, search.replace(" juhu", "kinners"));

        // regexp replacement
    },

    "test: replace with a RegExp search" : function() {
        var search = new Search().set({
            needle: "\\d+",
            regExp: true
        });

        assertEquals("kinners", search.replace("123", "kinners"));
        assertEquals("kinners", search.replace("01234", "kinners"));
        assertEquals(null, search.replace("", "kinners"));
        assertEquals(null, search.replace("a12", "kinners"));
        assertEquals(null, search.replace("12a", "kinners"));
    },

    "test: replace with RegExp match and capture groups" : function() {
        var search = new Search().set({
            needle: "ab(\\d\\d)",
            regExp: true
        });

        assertEquals("cd12", search.replace("ab12", "cd$1"));
        assertEquals("-ab12-", search.replace("ab12", "-$&-"));
        assertEquals("$", search.replace("ab12", "$$"));
    }
});

});