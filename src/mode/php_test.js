"use strict";

var EditSession = require("../edit_session").EditSession;
var Tokenizer = require("../tokenizer").Tokenizer;
var Mode = require("./php").Mode;
var assert = require("../test/assertions");

module.exports = {
    "test: inline mode" : function() {
        var mode = new Mode();
        var tokenizer = mode.getTokenizer();
        var tokens = tokenizer.getLineTokens("'juhu kinners' ?> html  <? 'php'", "start").tokens;
        assert.equal("string", tokens[tokens.length - 1].type);
        assert.notEqual("string", tokens[0].type);
        assert.equal(tokens.length, 4);
        
        mode = new Mode({inline: true});
        tokenizer = mode.getTokenizer();
        tokens = tokenizer.getLineTokens("'juhu kinners' ?> html  <? 'php'", "start").tokens;
        assert.equal("string", tokens[0].type);
        assert.equal("string", tokens[tokens.length - 1].type);
        assert.equal(tokens.length, 9);
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
