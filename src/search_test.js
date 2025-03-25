"use strict";

var EditSession = require("./edit_session").EditSession;
var MockRenderer = require("./test/mockrenderer").MockRenderer;
var Editor = require("./editor").Editor;
var Search = require("./search").Search;
var assert = require("./test/assertions");
var Range = require("./range").Range;

module.exports = {
    "test: configure the search object" : function() {
        var search = new Search();
        search.set({
            needle: "juhu"
        });
    },

    "test: find simple text in document" : function() {
        var session = new EditSession(["juhu kinners 123", "456"]);
        var search = new Search().set({
            needle: "kinners"
        });

        var range = search.find(session);
        assert.position(range.start, 0, 5);
        assert.position(range.end, 0, 12);
    },

    "test: find simple text in next line" : function() {
        var session = new EditSession(["abc", "juhu kinners 123", "456"]);
        var search = new Search().set({
            needle: "kinners"
        });

        var range = search.find(session);
        assert.position(range.start, 1, 5);
        assert.position(range.end, 1, 12);
    },

    "test: find text starting at cursor position" : function() {
        var session = new EditSession(["juhu kinners", "juhu kinners 123"]);
        session.getSelection().moveCursorTo(0, 6);
        var search = new Search().set({
            needle: "kinners"
        });

        var range = search.find(session);
        assert.position(range.start, 1, 5);
        assert.position(range.end, 1, 12);
    },

    "test: wrap search is on by default" : function() {
        var session = new EditSession(["abc", "juhu kinners 123", "456"]);
        session.getSelection().moveCursorTo(2, 1);

        var search = new Search().set({
            needle: "kinners"
        });

        assert.notEqual(search.find(session), null);
    },

    "test: wrap search should wrap at file end" : function() {
        var session = new EditSession(["abc", "juhu kinners 123", "456"]);
        session.getSelection().moveCursorTo(2, 1);

        var search = new Search().set({
            needle: "kinners",
            wrap: true
        });

        var range = search.find(session);
        assert.position(range.start, 1, 5);
        assert.position(range.end, 1, 12);
    },

    "test: wrap search should find needle even if it starts inside it" : function() {
        var session = new EditSession(["abc", "juhu kinners 123", "456"]);
        session.getSelection().moveCursorTo(6, 1);

        var search = new Search().set({
            needle: "kinners",
            wrap: true
        });

        var range = search.find(session);
        assert.position(range.start, 1, 5);
        assert.position(range.end, 1, 12);
    },

    "test: wrap search with no match should return 'null'": function() {
        var session = new EditSession(["abc", "juhu kinners 123", "456"]);
        session.getSelection().moveCursorTo(2, 1);

        var search = new Search().set({
            needle: "xyz",
            wrap: true
        });

        assert.equal(search.find(session), null);
    },

    "test: case sensitive is by default off": function() {
        var session = new EditSession(["abc", "juhu kinners 123", "456"]);

        var search = new Search().set({
            needle: "JUHU"
        });

        assert.range(search.find(session), 1, 0, 1, 4);
    },

    "test: case sensitive search": function() {
        var session = new EditSession(["abc", "juhu kinners 123", "456"]);

        var search = new Search().set({
            needle: "KINNERS",
            caseSensitive: true
        });

        var range = search.find(session);
        assert.equal(range, null);
    },

    "test: whole word search should not match inside of words": function() {
        var session = new EditSession(["juhukinners", "juhu kinners 123", "456"]);

        var search = new Search().set({
            needle: "kinners",
            wholeWord: true
        });

        var range = search.find(session);
        assert.position(range.start, 1, 5);
        assert.position(range.end, 1, 12);
    },

    "test: fallback to nonUnicode mode on edge cases": function() {
        var session = new EditSession([
            /* eslint-disable no-octal-escape*/
            "string with \xa9 symbol",  // test octal escape sequence
            "bracket ab{2}"  // test lone quantifier brackets
        ]);

        var search = new Search().set({
            needle: "\\251",
            regExp: true
        });
        var range = search.find(session);
        assert.position(range.start, 0, 12);
        assert.position(range.end, 0, 13);

        search.set({ needle: "ab\\{2}" });
        range = search.find(session);
        assert.position(range.start, 1, 8);
        assert.position(range.end, 1, 13);
    },

    "test: whole word search should not match inside of words with unicode": function() {
        var session = new EditSession(["𝓗ello𝓦orld", "𝓗ello 𝓦orld 123", "456"]);

        var search = new Search().set({
            needle: "𝓗ello",
            wholeWord: true
        });

        var range = search.find(session);
        assert.position(range.start, 1, 0);
        assert.position(range.end, 1, 6);
    },

    "test: return to unicode mode when possible": function() {
        var session = new EditSession(["𝓕oo"]);

        var search = new Search().set({
            needle: "}",
            regExp: true
        });

        search.find(session);
        search.set({
            needle: "."
        });

        var range = search.find(session);
        assert.position(range.start, 0, 0);
        assert.position(range.end, 0, 2);
    },

    "test: empty match before surrogate pair": function() {
        var session = new EditSession(["𝓕oo"]);

        var search = new Search().set({
            needle: "()",
            regExp: true,
            start: new Range(0, 0, 0, 0)
        });

        var range = search.find(session);
        assert.position(range.start, 0, 2);
        assert.position(range.end, 0, 2);
    },

    "test: find backwards": function() {
        var session = new EditSession(["juhu juhu juhu juhu"]);
        session.getSelection().moveCursorTo(0, 10);
        var search = new Search().set({
            needle: "juhu",
            backwards: true
        });

        var range = search.find(session);
        assert.position(range.start, 0, 5);
        assert.position(range.end, 0, 9);
    },

    "test: find in selection": function() {
        var session = new EditSession(["juhu", "juhu", "juhu", "juhu"]);
        session.getSelection().setSelectionAnchor(1, 0);
        session.getSelection().selectTo(3, 5);

        var search = new Search().set({
            needle: "juhu",
            wrap: true,
            range: session.getSelection().getRange()
        });

        var range = search.find(session);
        assert.position(range.start, 1, 0);
        assert.position(range.end, 1, 4);

        search = new Search().set({
            needle: "juhu",
            wrap: true,
            range: session.getSelection().getRange()
        });

        session.getSelection().setSelectionAnchor(0, 2);
        session.getSelection().selectTo(3, 2);

        var range = search.find(session);
        assert.position(range.start, 1, 0);
        assert.position(range.end, 1, 4);
    },

    "test: find backwards in selection": function() {
        var session = new EditSession(["juhu", "juhu", "juhu", "juhu"]);

        session.getSelection().setSelectionAnchor(0, 2);
        session.getSelection().selectTo(3, 2);

        var search = new Search().set({
            needle: "juhu",
            wrap: true,
            backwards: true,
            range: session.getSelection().getRange()
        });

        var range = search.find(session);
        assert.position(range.start, 2, 0);
        assert.position(range.end, 2, 4);

        search = new Search().set({
            needle: "juhu",
            wrap: true,
            range: session.getSelection().getRange()
        });

        session.getSelection().setSelectionAnchor(0, 2);
        session.getSelection().selectTo(1, 2);

        var range = search.find(session);
        assert.position(range.start, 1, 0);
        assert.position(range.end, 1, 4);
    },

    "test: edge case - match directly before the cursor" : function() {
        var session = new EditSession(["123", "123", "juhu"]);

        var search = new Search().set({
            needle: "juhu",
            wrap: true
        });

        session.getSelection().moveCursorTo(2, 5);

        var range = search.find(session);
        assert.position(range.start, 2, 0);
        assert.position(range.end, 2, 4);
    },

    "test: edge case - match backwards directly after the cursor" : function() {
        var session = new EditSession(["123", "123", "juhu"]);

        var search = new Search().set({
            needle: "juhu",
            wrap: true,
            backwards: true
        });

        session.getSelection().moveCursorTo(2, 0);

        var range = search.find(session);
        assert.position(range.start, 2, 0);
        assert.position(range.end, 2, 4);
    },

    "test: find using a regular expression" : function() {
        var session = new EditSession(["abc123 123 cd", "abc"]);

        var search = new Search().set({
            needle: "\\d+",
            regExp: true
        });

        var range = search.find(session);
        assert.position(range.start, 0, 3);
        assert.position(range.end, 0, 6);
    },

    "test: find using a regular expression and whole word" : function() {
        var session = new EditSession(["abc123 123 cd", "abc"]);

        var search = new Search().set({
            needle: "\\d+\\b",
            regExp: true,
            wholeWord: true
        });

        var range = search.find(session);
        assert.position(range.start, 0, 7);
        assert.position(range.end, 0, 10);
    },

    "test: use regular expressions with capture groups": function() {
        var session = new EditSession(["  ab: 12px", "  <h1 abc"]);

        var search = new Search().set({
            needle: "(\\d+)",
            regExp: true
        });

        var range = search.find(session);
        assert.position(range.start, 0, 6);
        assert.position(range.end, 0, 8);
    },

    "test: find all matches in selection" : function() {
        var session = new EditSession(["juhu", "juhu", "juhu", "juhu"]);

        session.getSelection().setSelectionAnchor(0, 2);
        session.getSelection().selectTo(3, 2);

        var search = new Search().set({
            needle: "uh",
            wrap: true,
            range: session.getSelection().getRange()
        });

        var ranges = search.findAll(session);

        assert.equal(ranges.length, 2);
        assert.position(ranges[0].start, 1, 1);
        assert.position(ranges[0].end, 1, 3);
        assert.position(ranges[1].start, 2, 1);
        assert.position(ranges[1].end, 2, 3);
    },


    "test: find all multiline matches" : function() {
        var session = new EditSession(["juhu", "juhu", "juhu", "juhu"]);

        var search = new Search().set({
            needle: "hu\nju",
            wrap: true
        });

        var ranges = search.findAll(session);

        assert.equal(ranges.length, 3);
        assert.position(ranges[0].start, 0, 2);
        assert.position(ranges[0].end, 1, 2);
        assert.position(ranges[1].start, 1, 2);
        assert.position(ranges[1].end, 2, 2);
    },

    "test: replace() should return the replacement if the input matches the needle" : function() {
        var search = new Search().set({
            needle: "juhu"
        });

        assert.equal(search.replace("juhu", "kinners"), "kinners");
        assert.equal(search.replace("", "kinners"), null);
        assert.equal(search.replace(" juhu", "kinners"), null);

        // case sensitivity
        assert.equal(search.replace("Juhu", "kinners"), "kinners");
        search.set({caseSensitive: true});
        assert.equal(search.replace("Juhu", "kinners"), null);

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
            needle: "ab((\\d)\\d)",
            regExp: true
        });

        assert.equal(search.replace("ab12", "cd$1"), "cd12");
        assert.equal(search.replace("ab56", "pr$17$2"), "pr5675");
        assert.equal(search.replace("ab12", "-$&-"), "-ab12-");
        assert.equal(search.replace("ab12", "_$0_"), "_ab12_");

        search.set({ needle: "(a)(b)(c)(d)(e)(f)(g)(h)(i)(j)(k)(l)" });
        assert.equal(search.replace("abcdefghijkl", "$2$9$7_$11$9$4_$8$9$4$5_$10$1$3$11_$6$12$1$7_$13"), "big_kid_hide_jack_flag_a3");
    },

    "test: replace() should correctly handle $$ in the replacement string": function () {
        var search = new Search().set({
            needle: "example"
        });

        // Expecting $$ to be preserved in the output
        assert.equal(search.replace("example", "$test"), "$test");
        assert.equal(search.replace("example", "$$test"), "$$test");
        assert.equal(search.replace("example", "$$$test"), "$$$test");
        assert.equal(search.replace("example", "$$$$test"), "$$$$test");

        search.set({
            regExp: true,
            needle: "(example)"
        });

        // Tests that $1 is replaced by the text that matches the capturing group.
        assert.equal(search.replace("example", "$1test"), "exampletest");

        assert.equal(search.replace("example", "$"), "$");
        assert.equal(search.replace("example", "$$"), "$");
        assert.equal(search.replace("example", "$$$"), "$$");
        assert.equal(search.replace("example", "$$$$"), "$$");
        assert.equal(search.replace("example", "$$$$$"), "$$$");
        assert.equal(search.replace("example", "$$$$$$"), "$$$");
        assert.equal(search.replace("example", "$$$$$$$"), "$$$$");

        search.set({ regExp: false });
        // Tests that without regular expression, "$1test" is treated as a literal string with $ escape.
        assert.equal(search.replace("(example)", "$1test"), "$1test");
    },

    "test: replace() should correctly handle \\\\ in the replacement string": function () {
        var search = new Search().set({
            needle: "example"
        });

        // Expecting \\ to be preserved in the output
        assert.equal(search.replace("example", "\\test"), "\\test");
        assert.equal(search.replace("example", "\\\\test"), "\\\\test");
        assert.equal(search.replace("example", "\\\\\\test"), "\\\\\\test");

        search.set({ regExp: true });

        assert.equal(search.replace("example", "\\"), "\\");
        assert.equal(search.replace("example", "\\\\"), "\\");
        assert.equal(search.replace("example", "\\\\\\"), "\\\\");
        assert.equal(search.replace("example", "\\\\\\\\"), "\\\\");
        assert.equal(search.replace("example", "\\\\\\\\\\"), "\\\\\\");
        assert.equal(search.replace("example", "\\\\\\\\\\\\"), "\\\\\\");
        assert.equal(search.replace("example", "\\\\\\\\\\\\\\"), "\\\\\\\\");
    },

    "test: find all using regular expresion containing $" : function() {
        var session = new EditSession(["a", "     b", "c ", "d"]);

        var search = new Search().set({
            needle: "[ ]+$",
            regExp: true,
            wrap: true
        });

        session.getSelection().moveCursorTo(1, 2);
        var ranges = search.findAll(session);

        assert.equal(ranges.length, 1);
        assert.position(ranges[0].start, 2, 1);
        assert.position(ranges[0].end, 2, 2);
    },

    "test: find all matches in a line" : function() {
        var session = new EditSession("foo bar foo baz foobar foo");

        var search = new Search().set({
            needle: "foo",
            wrap: true,
            wholeWord: true
        });

        session.getSelection().moveCursorTo(0, 4);

        var ranges = search.findAll(session);

        assert.equal(ranges.length, 3);
        assert.position(ranges[0].start, 0, 0);
        assert.position(ranges[0].end, 0, 3);
        assert.position(ranges[1].start, 0, 8);
        assert.position(ranges[1].end, 0, 11);
        assert.position(ranges[2].start, 0, 23);
        assert.position(ranges[2].end, 0, 26);
    },

    "test: find all matches in a line backwards" : function() {
        var session = new EditSession("foo bar foo baz foobar foo");

        var search = new Search().set({
            needle: "foo",
            wrap: true,
            wholeWord: true,
            backwards: true
        });

        session.getSelection().moveCursorTo(0, 13);

        var ranges = search.findAll(session);

        assert.equal(ranges.length, 3);
        assert.position(ranges[2].start, 0, 23);
        assert.position(ranges[2].end, 0, 26);
        assert.position(ranges[1].start, 0, 8);
        assert.position(ranges[1].end, 0, 11);
        assert.position(ranges[0].start, 0, 0);
        assert.position(ranges[0].end, 0, 3);
    },

    "test: find next empty range" : function() {
        var session = new EditSession("foo foobar foo");
        var editor = new Editor(new MockRenderer(), session);

        var options = {
            needle: "o*",
            wrap: true,
            regExp: true,
            backwards: false
        };
        var positions = [4, 5.2, 7, 8, 9, 10, 11, 12.2, 14, 0, 1.2, 3];

        session.selection.moveCursorTo(0, 3);
        for (var i = 0; i < positions.length; i++) {
            editor.find(options);
            var range = editor.selection.getRange();
            var start = range.start.column;
            var len = range.end.column - start;
            assert.equal(start + 0.1 * len, positions[i]);
        }
        options.backwards = true;
        positions = [1.2, 0, 12.2, 11, 10, 9, 8, 7, 5.2, 4, 3, 1.2, 0];
        for (var i = 0; i < positions.length; i++) {
            editor.find(options);
            var range = editor.selection.getRange();
            var start = range.start.column;
            var len = range.end.column - start;
            assert.equal(start + 0.1 * len, positions[i]);
        }
    },

    "test: repeating text": function() {
        var session = new EditSession("tttttt\ntttttt\ntttttt\ntttttt\ntttttt\ntttttt");
        var editor = new Editor(new MockRenderer(), session);

        var options = {
            needle: "^",
            wrap: true,
            regExp: true,
            backwards: false
        };
        function check(sl, sc, el, ec) {
            editor.find(options);
            var range = editor.selection.getRange();
            assert.range(range, sl, sc, el, ec);
        }

        session.selection.moveCursorTo(1, 3);
        check(2, 0, 2, 0);

        options.needle = "tttt\ntttt";
        check(2, 2, 3, 4);
        check(4, 2, 5, 4);
        check(0, 2, 1, 4);

        options.backwards = true;
        check(4, 2, 5, 4);
        check(2, 2, 3, 4);
        check(0, 2, 1, 4);
        check(4, 2, 5, 4);
    },

    "test: find all matches in a range" : function() {
        var session = new EditSession([
            "",
            "    var myVar1 = 1; var myVar2 = 2; var myVar3 = 3;",
            "    var myVar4 = 4; var myVar5 = 5; var myVar6 = 6;"
        ]);

        var search = new Search().set({
            needle: "var",
            backwards: true,
            caseSensitive: true,
            range: {start: {row: 1, column: 20}, end: {row: 2, column: 22}},
            wholeWord: false,
            regExp: false
        });

        var ranges = search.findAll(session);

        assert.equal(ranges.length, 3);
        assert.position(ranges[0].start, 1, 20);
        assert.position(ranges[0].end, 1, 23);
        assert.position(ranges[1].start, 1, 36);
        assert.position(ranges[1].end, 1, 39);
        assert.position(ranges[2].start, 2, 4);
        assert.position(ranges[2].end, 2, 7);
    },

    "test: find all line breaks (\\r\\n, \\n) using regular expression" : function() {
        var session = new EditSession('\nfunction foo(items, nada) {\n    for (var i=0; i<items.length; i++) {\n        alert(items[i] + "juhu\\n");\n    }\t/* Real Tab */\n\n\n\n\n}\n\n\n// test search/replace line break with regexp\r\n\r\n\t\t\t\t\n');

        var search = new Search().set({
            needle: "\\n",
            regExp: true,
            wrap: true
        });

        var ranges = search.findAll(session);
        assert.equal(ranges.length, 15);

        search.set({ needle: "\\n{2,}" });
        ranges = search.findAll(session);
        assert.equal(ranges.length, 3);

        search.set({ needle: "\\n\\s+" });
        ranges = search.findAll(session);
        assert.equal(ranges.length, 6);

        search.set({ needle: "\\)\\s\\{\\n\\s+" });
        ranges = search.findAll(session);
        assert.equal(ranges.length, 2);

        search.set({ needle: "\\n+" });
        ranges = search.findAll(session);

        assert.equal(ranges.length, 8);
        assert.position(ranges[0].start, 0, 0);
        assert.position(ranges[0].end, 1, 0);
        assert.position(ranges[1].start, 1, 27);
        assert.position(ranges[1].end, 2, 0);
        assert.position(ranges[2].start, 2, 40);
        assert.position(ranges[2].end, 3, 0);
        assert.position(ranges[3].start, 3, 35);
        assert.position(ranges[3].end, 4, 0);
        assert.position(ranges[4].start, 4, 20);
        assert.position(ranges[4].end, 9, 0);
        assert.position(ranges[5].start, 9, 1);
        assert.position(ranges[5].end, 12, 0);
        assert.position(ranges[6].start, 12, 45);
        assert.position(ranges[6].end, 14, 0);
        assert.position(ranges[7].start, 14, 4);
        assert.position(ranges[7].end, 15, 0);
    },

    "test: find line breaks backwards using regex" : function() {
        var session = new EditSession('\nfunction foo(items, nada) {\n    for (var i=0; i<items.length; i++) {\n        alert(items[i] + "juhu\\n");\n    }\t/* Real Tab */\n\n\n\n\n}\n\n\n// test search/replace line break with regexp\r\n\r\n\t\t\t\t\n');
        session.getSelection().moveCursorTo(2, 5);

        var search = new Search().set({
            needle: "\\n",
            regExp: true,
            wrap: true,
            backwards: true
        });

        var range = search.find(session);

        // Should find the first newline to the left of the cursor
        assert.position(range.start, 1, 27);
        assert.position(range.end, 2, 0);
    },

    "test: replace with line breaks (\\n) and TAB (\\t) using regular expression" : function() {
        var search = new Search().set({
            needle: "with",
            regExp: true,
            wrap: true
        });

        assert.equal(search.replace("with", "\n// $0"), "\n// with");
        assert.equal(search.replace("with", "\t-\t$0"), "\t-\twith");

        search.set({ needle: "(\\n+)" });
        assert.equal(search.replace("\n", ""), "");
        assert.equal(search.replace("\n", "\t"), "\t");
        assert.equal(search.replace("\n\n\n", "\n"), "\n");
        assert.equal(search.replace("\n\t\n\n", "\t$1"), "\t\n\t\t\n\n");
        assert.equal(search.replace("\r\n /* CRLF */", "\n"), "\n /* CRLF */");
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
