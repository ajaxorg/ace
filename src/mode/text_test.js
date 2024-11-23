"use strict";

var EditSession = require("../edit_session").EditSession;
var TextMode = require("./text").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {
        this.mode = new TextMode();
    },

    "test: toggle comment lines should not do anything" : function() {
        var session = new EditSession(["  abc", "cde", "fg"]);

        this.mode.toggleCommentLines("start", session, 0, 1);
        assert.equal(["  abc", "cde", "fg"].join("\n"), session.toString());
    },


    "test: lines should be indented" : function() {
        assert.equal("   ", this.mode.getNextLineIndent("start", "   abc", "  "));
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
