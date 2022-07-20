if (typeof process !== "undefined") {
    require("amd-loader");
}

"use strict";

var EditSession = require("../edit_session").EditSession;
var Tokenizer = require("../tokenizer").Tokenizer;
var XmlMode = require("./xml").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {
        this.mode = new XmlMode();
    },

    "test: getTokenizer() (smoke test)" : function() {
        var tokenizer = this.mode.getTokenizer();

        assert.ok(tokenizer instanceof Tokenizer);

        var tokens = tokenizer.getLineTokens("<juhu>", "start").tokens;
        assert.equal("meta.tag.punctuation.tag-open.xml", tokens[0].type);
    },

    "test: toggle comment lines should not do anything" : function() {
        var session = new EditSession(["    abc", "  cde", "fg"]);

        this.mode.toggleCommentLines("start", session, 0, 1);
        assert.equal(["  <!--  abc-->", "  <!--cde-->", "fg"].join("\n"), session.toString());
    },

    "test: next line indent should be the same as the current line indent" : function() {
        assert.equal("     ", this.mode.getNextLineIndent("start", "     abc"));
        assert.equal("", this.mode.getNextLineIndent("start", "abc"));
        assert.equal("\t", this.mode.getNextLineIndent("start", "\tabc"));
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
