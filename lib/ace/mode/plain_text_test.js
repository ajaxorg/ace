if (typeof process !== "undefined") {
    require("amd-loader");
}

"use strict";

var EditSession = require("../edit_session").EditSession;
var PlainTextMode = require("./plain_text").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {
        this.mode = new PlainTextMode();
    },

    "test: lines should not be indented" : function() {
        assert.equal("", this.mode.getNextLineIndent("start", "   abc", "  "));
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
