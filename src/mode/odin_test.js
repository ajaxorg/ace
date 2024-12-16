"use strict";

var EditSession = require("../edit_session").EditSession;
var OdinMode = require("./odin").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {
        this.mode = new OdinMode();
    },

    "test: indent after opening function": function() {
        assert.equal("  ", this.mode.getNextLineIndent("start", "main :: proc() {", "  "));
    },

    "test: indent after opening block": function() {
        assert.equal("  ", this.mode.getNextLineIndent("start", "{", "  "));
    },

    "test: indent after opening array": function() {
        assert.equal("  ", this.mode.getNextLineIndent("start", "foo := [", "  "));
    },

    "test: indent after opening parentheses": function() {
        assert.equal("  ", this.mode.getNextLineIndent("start", "foo := (", "  "));
    },

    "test: indent after case:": function() {
        assert.equal("  ", this.mode.getNextLineIndent("start", "case bar:", "  "));
    },

    "test: auto outdent should indent the line with the same indent as the line with the matching opening brace" : function() {
        var session = new EditSession(["  main :: proc() {", "    bla", "    }"], this.mode);
        this.mode.autoOutdent("start", session, 2);
        assert.equal("  }", session.getLine(2));
    },

    "test: no auto outdent if no matching brace is found" : function() {
        var session = new EditSession(["  main :: proc()", "    bla", "    }"], this.mode);
        this.mode.autoOutdent("start", session, 2);
        assert.equal("    }", session.getLine(2));
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
