"use strict";

var EditSession = require("../edit_session").EditSession;
var GolangMode = require("./golang").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {
        this.mode = new GolangMode();
    },

    "test: predeclared types added in Go 1.18" : function() {
        var tokenizer = this.mode.getTokenizer();
        function typeOf(line, index) {
            return tokenizer.getLineTokens(line, "start").tokens[index].type;
        }
        assert.equal("support.type", typeOf("var x any", 4));
        assert.equal("support.type", typeOf("type S[E comparable] int", 6));
        assert.equal("support.type", typeOf("var e error", 4));
    },

    "test: trigger outdent if line is space and new text starts with closing brace or paren" : function() {
        assert.ok(this.mode.checkOutdent("start", "   ", " }"));
        assert.ok(this.mode.checkOutdent("start", "   ", " )"));
        assert.ok(!this.mode.checkOutdent("start", " a  ", " )"));
        assert.ok(!this.mode.checkOutdent("start", "", ")"));
        assert.ok(!this.mode.checkOutdent("start", "   ", "a )"));
    },

    "test: auto outdent should indent the line with the same indent as the matching opening brace" : function() {
        var session = new EditSession(["  func main() {", "    println()", "    }"], this.mode);
        this.mode.autoOutdent("start", session, 2);
        assert.equal("  }", session.getLine(2));
    },

    "test: auto outdent should indent the line with the same indent as the matching opening paren" : function() {
        var session = new EditSession(["  var (", "    x int", "    )"], this.mode);
        this.mode.autoOutdent("start", session, 2);
        assert.equal("  )", session.getLine(2));
    },

    "test: no auto outdent if no matching paren is found" : function() {
        var session = new EditSession(["  var", "    x int", "    )"], this.mode);
        this.mode.autoOutdent("start", session, 2);
        assert.equal("    )", session.getLine(2));
    }
};

require("../test/run")(module);
