"use strict";

var EditSession = require("../edit_session").EditSession;
var Tokenizer = require("../tokenizer").Tokenizer;
var Mode = require("./python").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {    
        this.mode = new Mode();
    },

    "test: getTokenizer() (smoke test)" : function() {
        var tokenizer = this.mode.getTokenizer();

        assert.ok(tokenizer instanceof Tokenizer);

        var tokens = tokenizer.getLineTokens("'juhu'", "start").tokens;
        assert.equal("string", tokens[0].type);
    },

    "test: auto outdent after 'pass', 'return' and 'raise'" : function() {
        assert.ok(this.mode.checkOutdent("start", "        pass", "\n"));
        assert.ok(this.mode.checkOutdent("start", "        pass  ", "\n"));
        assert.ok(this.mode.checkOutdent("start", "        return", "\n"));
        assert.ok(this.mode.checkOutdent("start", "        raise", "\n"));
        assert.equal(this.mode.checkOutdent("start", "        raise", " "), false);
        assert.ok(this.mode.checkOutdent("start", "        pass # comment", "\n"));
        assert.equal(this.mode.checkOutdent("start", "'juhu'", "\n"), false);
    },
    
    "test: auto outdent" : function() {
        var session = new EditSession(["    if True:", "        pass", "        "]);
        this.mode.autoOutdent("start", session, 1);
        assert.equal("    ", session.getLine(2));
    }

};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
