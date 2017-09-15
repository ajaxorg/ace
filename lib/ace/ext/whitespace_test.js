if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

require("../multi_select");
var assert = require("assert");
var EditSession = require("../edit_session").EditSession;
var UndoManager = require("../undomanager").UndoManager;
var whitespace = require("./whitespace");

// Execution ORDER: test.setUpSuite, setUp, testFn, tearDown, test.tearDownSuite
module.exports = {
    timeout: 10000,

    "test tab detection": function(next) {
        var s = new EditSession([
            "define({",
            "\tfoo:1,",
            "\tbar:2,",
            "\tbaz:{,",
            "\t\tx:3",
            "\t}",
            "})"
        ]);
         
        var indent = whitespace.$detectIndentation(s.doc.$lines);
        assert.equal(indent.ch, "\t");
        assert.equal(indent.length, undefined);
        
        s.insert({row: 0, column: 0}, "  ");
        indent = whitespace.$detectIndentation(s.doc.$lines);
        assert.equal(indent.ch, "\t");
        assert.equal(indent.length, undefined);
        s.doc.removeInLine(0, 0, 2);
        
        s.insert({row: 0, column: 0}, "x\n    y\n        z\n");
        indent = whitespace.$detectIndentation(s.doc.$lines);
        assert.equal(indent.ch, "\t");
        assert.equal(indent.length, 4);
        
        s.setValue("");
        indent = whitespace.$detectIndentation(s.doc.$lines);
        assert.ok(!indent);
        
        next();
    },

    "test empty session": function(next) {
        var s = new EditSession([
            "define({",
            "foo:1,",
            "})"
        ]);
        var indent = whitespace.$detectIndentation(s.doc.$lines);
        assert.ok(!indent);
        s.insert({row: 1, column: 0}, "    x\n    ");
        
        indent = whitespace.$detectIndentation(s.doc.$lines);
        assert.equal(indent.ch, " ");
        assert.equal(indent.length, 4);
        
        next();
    },
    
    "!test one line": function(next) {
        var s = new EditSession([
            "define({",
            "    foo:1,",
            "})"
        ]);
        var indent = whitespace.$detectIndentation(s.doc.$lines);
        assert.equal(indent.ch, " ");
        assert.equal(indent.length, 4);
        
        next();
    },
    
    "test 1 width indents": function(next) {
        var s = new EditSession([
            "define({",
            "    foo:1,",
            "})",
            "define({",
            "    bar:1,",
            "})",
            "     t",
            "      t",
            "     t",
            "      t",
            "     t",
            "      t",
            "     t",
            "      t"
        ]);
        var indent = whitespace.$detectIndentation(s.doc.$lines);
        // assert.equal(indent.ch, " ");
        // assert.equal(indent.length, 4);
        
        s = new EditSession([
            "{",
            " foo:1,",
            " bar: {",
            "  baz:2",
            " }",
            "}"
        ]);
        indent = whitespace.$detectIndentation(s.doc.$lines);
        assert.equal(indent.ch, " ");
        assert.equal(indent.length, 1);
        
        next();
    },

    "test trimTrailingSpace": function(next) {
        var session = new EditSession([
            "a",
            "\t b \t",
            "    ",
            "\t",
            "\t\tx\t\t",
            " ",
            "   "
        ]);
        session.setUndoManager(new UndoManager());
        
        function testOne(value, options) {
            console.log(JSON.stringify(session.getValue()));

            whitespace.trimTrailingSpace(session, options);
            assert.equal(value, session.getValue());
            session.markUndoGroup();
            session.getUndoManager().undo();
        }
        
        testOne("a\n\t b\n    \n\t\n\t\tx\n \n   ");
        
        testOne("a\n\t b\n\n\n\t\tx\n\n", {
            trimEmpty: true
        });
        
        session.selection.fromJSON([{
            start: {row:2,column:3},
            end: {row:4,column:4}
        }]);
        testOne("a\n\t b\n\n\n\t\tx\t\n\n", {
            keepCursorPosition: true,
            trimEmpty: true
        });
        
        session.selection.fromJSON([{
            start: {row:2,column:3},
            end: {row:4,column:4},
            isBackwards: true
        }]);
        testOne("a\n\t b\n   \n\n\t\tx\n\n", {
            keepCursorPosition: true,
            trimEmpty: true
        });
        
        session.selection.$initRangeList();
        session.selection.fromJSON([{
            start: {row:2, column:3},
            end: {row:2,column:3}
        }, {
            start: {row:1, column:1},
            end: {row:1, column:1}
        }, {
            start: {row:2,column:2},
            end: {row:2,column:2}
        }, {
            start: {row:0,column:5},
            end: {row:0,column:5},
            isBackwards:false
        }, {
            start: {row:6,column:1},
            end: {row:6,column:1},
            isBackwards:false
        }]);
        testOne("a\n\t b\n   \n\n\t\tx\n\n ", {
            trimEmpty: true,
            keepCursorPosition: true
        });
        
        session.setValue("some text");
        session.selection.fromJSON([{
            start: {row:0,column:4},
            end: {row:0,column:4}
        }]);
        testOne("some text", {
            keepCursorPosition: true,
            trimEmpty: true
        });
        
        next();
    }

};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
