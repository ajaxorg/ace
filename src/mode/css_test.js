if (typeof process !== "undefined") {
    require("amd-loader");
}

"use strict";

var EditSession = require("../edit_session").EditSession;
var CssMode = require("./css").Mode;
var assert = require("../test/assertions");

module.exports = {
    
    name: "CSS",
    
    setUp : function() {
        this.mode = new CssMode();
    },

    "test: toggle comment lines" : function() {
        var session = new EditSession(["  abc", "cde", "fg"].join("\n"));

        var comment = this.mode.toggleCommentLines("start", session, 0, 1);
        assert.equal(["/*  abc*/", "/*cde*/", "fg"].join("\n"), session.toString());
    },


    "test: lines should keep indentation" : function() {
        assert.equal("   ", this.mode.getNextLineIndent("start", "   abc", "  "));
        assert.equal("\t", this.mode.getNextLineIndent("start", "\tabc", "  "));
    },

    "test: new line after { should increase indent" : function() {
        assert.equal("     ", this.mode.getNextLineIndent("start", "   abc{", "  "));
        assert.equal("\t  ", this.mode.getNextLineIndent("start", "\tabc  { ", "  "));
    },

    "test: no indent increase after { in a comment" : function() {
        assert.equal("   ", this.mode.getNextLineIndent("start", "   /*{", "  "));
        assert.equal("   ", this.mode.getNextLineIndent("start", "   /*{  ", "  "));
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
