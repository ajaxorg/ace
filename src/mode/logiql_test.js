"use strict";

var EditSession = require("../edit_session").EditSession;
var LogiQLMode = require("./logiql").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {    
        this.mode = new LogiQLMode();
    },

    "test: toggle comment lines should prepend '//' to each line" : function() {
        var session = new EditSession(["    abc", "cde", "fg"]);

        this.mode.toggleCommentLines("start", session, 0, 1);
        assert.equal(["//     abc", "// cde", "fg"].join("\n"), session.toString());
    },

    "test: auto indent after ->" : function() {
        assert.equal("  ", this.mode.getNextLineIndent("start", "parent(a, b) ->", "  "));
    },
    
    "test: auto indent after <--" : function() {
        assert.equal("  ", this.mode.getNextLineIndent("start", "foo <--    ", "  "));
    },

    "test: no auto indent in multi line comment" : function() {
        assert.equal("", this.mode.getNextLineIndent("start", "/* -->", "  "));
        assert.equal("  ", this.mode.getNextLineIndent("start", "  /* ->", "    "));
        assert.equal("  ", this.mode.getNextLineIndent("comment.block", "  abcd", "  "));
    },

    "test: no auto indent after -> in single line comment" : function() {
        assert.equal("", this.mode.getNextLineIndent("start", "//->", "  "));
        assert.equal("  ", this.mode.getNextLineIndent("start", "  //->", "  "));
    },

    "test: trigger outdent if line ends with ." : function() {
        assert.ok(this.mode.checkOutdent("start", "   ", "\n"));
        assert.ok(this.mode.checkOutdent("start", " a  ", "\r\n"));
        assert.ok(!this.mode.checkOutdent("start", "", "}"));
        assert.ok(!this.mode.checkOutdent("start", "   ", "a }"));
        assert.ok(!this.mode.checkOutdent("start", "   }", "}"));
    },

    "test: auto outdent should indent the line with the same indent as the line with the matching ->" : function() {
        var session = new EditSession(["  bar (a, b) ->", "  foo(a)[1.2]", "    bla.", "    "], new LogiQLMode());
        this.mode.autoOutdent("start", session, 2);
        assert.equal("  ", session.getLine(3));
    },

    "test: no auto outdent if no matching brace is found" : function() {
        var session = new EditSession(["  bar (a, b) ->", "  foo(a)[1.2].", "    bla.", "    "], new LogiQLMode());
        this.mode.autoOutdent("start", session, 2);
        assert.equal("    ", session.getLine(3));
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
