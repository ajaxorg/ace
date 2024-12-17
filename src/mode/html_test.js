"use strict";

var EditSession = require("../edit_session").EditSession;
var Range = require("../range").Range;
var HtmlMode = require("./html").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {    
        this.mode = new HtmlMode();
    },

    "test: toggle comment lines" : function() {
        var session = new EditSession(["  abc", "", "fg"]);

        var range = new Range(0, 3, 1, 1);
        var comment = this.mode.toggleCommentLines("start", session, 0, 1);
        assert.equal(["  <!--abc-->", "", "fg"].join("\n"), session.toString());
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
