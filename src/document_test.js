"use strict";

var Document = require("./document").Document;
var Range = require("./range").Range;
var assert = require("./test/assertions");

module.exports = {

    "test: insert text in line" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e); });

        doc.insert({row: 0, column: 1}, "juhu");
        assert.equal(doc.getValue(), ["1juhu2", "34"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["1juhu2", "34"].join("\n"));
    },

    "test: insert new line" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e); });

        doc.insertMergedLines({row: 0, column: 1}, ['', '']);
        assert.equal(doc.getValue(), ["1", "2", "34"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["1", "2", "34"].join("\n"));
    },

    "test: insert lines at the beginning" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e); });

        doc.insertFullLines(0, ["aa", "bb"]);
        assert.equal(doc.getValue(), ["aa", "bb", "12", "34"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["aa", "bb", "12", "34"].join("\n"));
    },

    "test: insert lines at the end" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e); });

        doc.insertFullLines(2, ["aa", "bb"]);
        assert.equal(doc.getValue(), ["12", "34", "aa", "bb"].join("\n"));
    },
    
    "test: insertInLine" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e); });

        doc.insertInLine({row: 0, column: 1}, "a");
        assert.equal(doc.getValue(), ["1a2", "34"].join("\n"));
        doc.insertInLine({row: 10, column: Infinity}, "b");
        assert.equal(doc.getValue(), ["1a2", "34b"].join("\n"));
        doc.insertInLine({row: undefined, column: Infinity}, "x");
        assert.equal(doc.getValue(), ["1a2", "34b", "x"].join("\n"));
        doc.insertInLine({row: -1, column: Infinity}, "z");
        assert.equal(doc.getValue(), ["1a2z", "34b", "x"].join("\n"));
        
        doc.removeInLine(0, 1, 2);
        assert.equal(doc.getValue(), ["12z", "34b", "x"].join("\n"));
        doc.removeInLine(0, 2, 10);
        assert.equal(doc.getValue(), ["12", "34b", "x"].join("\n"));
        doc.removeNewLine(1);
        assert.equal(doc.getValue(), ["12", "34bx"].join("\n"));
        doc.removeNewLine(1);
        assert.equal(doc.getValue(), ["12", "34bx"].join("\n"));
    },

    "test: insert lines in the middle" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e); });

        doc.insertFullLines(1, ["aa", "bb"]);
        assert.equal(doc.getValue(), ["12", "aa", "bb", "34"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["12", "aa", "bb", "34"].join("\n"));
    },

    "test: insert multi line string at the start" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e); });

        doc.insert({row: 0, column: 0}, "aa\nbb\ncc");
        assert.equal(doc.getValue(), ["aa", "bb", "cc12", "34"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["aa", "bb", "cc12", "34"].join("\n"));
    },

    "test: insert multi line string at the end" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e); });

        doc.insert({row: 1, column: 2}, "aa\nbb\ncc");
        assert.equal(doc.getValue(), ["12", "34aa", "bb", "cc"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["12", "34aa", "bb", "cc"].join("\n"));
    },

    "test: insert multi line string in the middle" : function() {
        var doc = new Document(["12", "34"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e); });

        doc.insert({row: 0, column: 1}, "aa\nbb\ncc");
        assert.equal(doc.getValue(), ["1aa", "bb", "cc2", "34"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["12", "34"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["1aa", "bb", "cc2", "34"].join("\n"));
    },

    "test: delete in line" : function() {
        var doc = new Document(["1234", "5678"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e); });

        doc.remove(new Range(0, 1, 0, 3));
        assert.equal(doc.getValue(), ["14", "5678"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["1234", "5678"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["14", "5678"].join("\n"));
    },

    "test: delete new line" : function() {
        var doc = new Document(["1234", "5678"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e); });

        doc.remove(new Range(0, 4, 1, 0));
        assert.equal(doc.getValue(), ["12345678"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["1234", "5678"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["12345678"].join("\n"));
    },

    "test: delete multi line range line" : function() {
        var doc = new Document(["1234", "5678", "abcd"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e); });

        doc.remove(new Range(0, 2, 2, 2));
        assert.equal(doc.getValue(), ["12cd"].join("\n"));

        var d = deltas.concat();
        doc.revertDeltas(d);
        assert.equal(doc.getValue(), ["1234", "5678", "abcd"].join("\n"));

        doc.applyDeltas(d);
        assert.equal(doc.getValue(), ["12cd"].join("\n"));
    },

    "test: delete full lines" : function() {
        var doc = new Document(["1234", "5678", "abcd"]);

        var deltas = [];
        doc.on("change", function(e) { deltas.push(e); });

        doc.remove(new Range(1, 0, 3, 0));
        assert.equal(doc.getValue(), ["1234", ""].join("\n"));
    },

    "test: remove lines should return the removed lines" : function() {
        var doc = new Document(["1234", "5678", "abcd"]);

        var removed = doc.removeFullLines(1, 2);
        assert.equal(removed.join("\n"), ["5678", "abcd"].join("\n"));
    },

    "test: should handle unix style new lines" : function() {
        var doc = new Document(["1", "2", "3"]);
        assert.equal(doc.getValue(), ["1", "2", "3"].join("\n"));
    },

    "test: should handle windows style new lines" : function() {
        var doc = new Document(["1", "2", "3"].join("\r\n"));

        doc.setNewLineMode("unix");
        assert.equal(doc.getValue(), ["1", "2", "3"].join("\n"));
        assert.equal(doc.getNewLineMode(), "unix");
        assert.ok(doc.isNewLine("\r"));
        assert.ok(doc.isNewLine("\n"));
        assert.ok(doc.isNewLine("\r\n"));
        assert.notOk(doc.isNewLine("\n\r"));
    },

    "test: set new line mode to 'windows' should use '\\r\\n' as new lines": function() {
        var doc = new Document(["1", "2", "3"].join("\n"));
        doc.setNewLineMode("windows");
        assert.equal(doc.getValue(), ["1", "2", "3"].join("\r\n"));
    },

    "test: set new line mode to 'unix' should use '\\n' as new lines": function() {
        var doc = new Document(["1", "2", "3"].join("\r\n"));

        doc.setNewLineMode("unix");
        assert.equal(doc.getValue(), ["1", "2", "3"].join("\n"));
    },

    "test: set new line mode to 'auto' should detect the incoming nl type": function() {
        var doc = new Document(["1", "2", "3"].join("\n"));

        doc.setNewLineMode("auto");
        assert.equal(doc.getValue(), ["1", "2", "3"].join("\n"));

        var doc = new Document(["1", "2", "3"].join("\r\n"));

        doc.setNewLineMode("auto");
        assert.equal(doc.getValue(), ["1", "2", "3"].join("\r\n"));

        doc.replace(new Range(0, 0, 2, 1), ["4", "5", "6"].join("\n"));
        assert.equal(["4", "5", "6"].join("\n"), doc.getValue());
    },

    "test: set value": function() {
        var doc = new Document("1");
        assert.equal("1", doc.getValue());

        doc.setValue(doc.getValue());
        assert.equal("1", doc.getValue());

        var doc = new Document("1\n2");
        assert.equal("1\n2", doc.getValue());

        doc.setValue(doc.getValue());
        assert.equal("1\n2", doc.getValue());
    },

    "test: empty document has to contain one line": function() {
        var doc = new Document("");
        assert.equal(doc.$lines.length, 1);
    },
    
    "test: ignore empty delta": function() {
        var doc = new Document("");
        doc.on("change", function() {
            throw "should ignore empty delta";
        });
        doc.insert({row: 0, column: 0}, "");
        doc.insert({row: 1, column: 1}, "");
        doc.remove({start: {row: 1, column: 1}, end: {row: 1, column: 1}});
    },
    
    "test: inserting huge delta": function() {
        var doc = new Document("");
        var val = "";
        var MAX = 20000 - 1;
        for (var i = 0; i < 4 * MAX; i++) {
            val += i + "\n";
        }
        var changeCount = 0;
        function testDelta(delta) {
            changeCount++;
            assert.equal(delta.lines.length, MAX + 1);
        }
        doc.on("change", testDelta);
        doc.setValue(val);
        doc.off("change", testDelta);
        assert.equal(changeCount, 4);
        assert.equal(doc.getValue(), val);
        
        for (var i = 2 * MAX + 20; i >= 2 * MAX - 20; i--) {
            val = doc.getLines(0, i).join("\n");
            doc.setValue("\nab");
            assert.equal(doc.getValue(), "\nab");
            doc.insert({row: 1, column: 1}, val);
            assert.equal(doc.getValue(), "\na" + val + "b");
        }
    },
    
    "test: indexToPosition": function() {
        function test(value) {
            var doc = new Document(value);
            var secondLine = value.indexOf("|");
            for (var i = -2; i < value.length + 4; i++) {
                if (value[i - 1] == "\r") continue;
                var pos = doc.indexToPosition(i);
                var text = doc.getTextRange({start: {row: 0, column: 0}, end: pos});
                assert.equal(text, value.substring(0, i));
                assert.equal(doc.positionToIndex(pos), i);
                if (i >= secondLine) {
                    assert.deepEqual(doc.indexToPosition(i - secondLine, 1), pos);
                    assert.equal(doc.positionToIndex(pos, 1), i - secondLine);
                }
            }
        }
        test("abc\n|defx\ngh");
        test("abc\r\n|defx\r\ngh");
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
