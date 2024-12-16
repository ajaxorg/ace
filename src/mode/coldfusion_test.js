"use strict";

var EditSession = require("../edit_session").EditSession;
var Range = require("../range").Range;
var ColdfusionMode = require("./coldfusion").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {    
        this.mode = new ColdfusionMode();
    },

    "test: toggle comment lines" : function() {
        var session = new EditSession(["  abc", "  cde", "fg"]);

        var range = new Range(0, 3, 1, 1);
        var comment = this.mode.toggleCommentLines("start", session, 0, 1);
        assert.equal(["  <!--abc-->", "  <!--cde-->", "fg"].join("\n"), session.toString());
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
