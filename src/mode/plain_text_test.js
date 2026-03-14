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


require("../test/run")(module);