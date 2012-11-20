if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

var LuceneMode = require("./lucene").Mode;
var assert = require("../test/assertions");

module.exports = {

    name: "Lucene Tokenizer",

    setUp : function() {
        this.tokenizer = new LuceneMode().getTokenizer();
    },

    "test: recognises AND as keyword" : function() {
        var tokens = this.tokenizer.getLineTokens("AND", "start").tokens;
        assert.equal("keyword.operator", tokens[0].type);
    },

    "test: recognises OR as keyword" : function() {
        var tokens = this.tokenizer.getLineTokens("OR", "start").tokens;
        assert.equal("keyword.operator", tokens[0].type);
    },

    "test: recognises NOT as keyword" : function() {
        var tokens = this.tokenizer.getLineTokens("NOT", "start").tokens;
        assert.equal("keyword.operator", tokens[0].type);
    },

    'test: recognises "hello this is dog" as string' : function() {
        var tokens = this.tokenizer.getLineTokens('"hello this is dog"', "start").tokens;
        assert.equal("string", tokens[0].type);
    },

    'test: recognises -"hello this is dog" as negation with string' : function() {
        var tokens = this.tokenizer.getLineTokens('-"hello this is dog"', "start").tokens;
        assert.equal("constant.character.negation", tokens[0].type);
        assert.equal("string", tokens[1].type);
    },

    'test: recognises ~100 as text with proximity' : function() {
        var tokens = this.tokenizer.getLineTokens('~100', "start").tokens;
        assert.equal("constant.character.proximity", tokens[0].type);
    },

    'test: recognises "hello this is dog"~100 as string with proximity' : function() {
        var tokens = this.tokenizer.getLineTokens('"hello this is dog"~100', "start").tokens;

        assert.equal("string", tokens[0].type);
        assert.equal("constant.character.proximity", tokens[1].type);
    },

    'test: recognises raw:"hello this is dog" as keyword' : function() {
        var tokens = this.tokenizer.getLineTokens('raw:"hello this is dog"', "start").tokens;
        assert.equal("keyword", tokens[0].type);
    },

    'test: recognises raw:foo as"keyword' : function() {
        var tokens = this.tokenizer.getLineTokens('raw:foo', "start").tokens;
        assert.equal("keyword", tokens[0].type);
    },

    'test: recognises "(" as opening parenthesis' : function() {
        var tokens = this.tokenizer.getLineTokens('(', "start").tokens;
        assert.equal("paren.lparen", tokens[0].type);
    },

    'test: recognises ")" as closing parenthesis' : function() {
        var tokens = this.tokenizer.getLineTokens(')', "start").tokens;
        assert.equal("paren.rparen", tokens[0].type);
    },

    'test: recognises foo* as text with asterisk' : function() {
        var tokens = this.tokenizer.getLineTokens('foo*', "start").tokens;
        assert.equal("text", tokens[0].type);
        assert.equal("constant.character.asterisk", tokens[1].type);
    },

    'test: recognises foo? as text with interro' : function() {
        var tokens = this.tokenizer.getLineTokens('foo?', "start").tokens;
        assert.equal("text", tokens[0].type);
        assert.equal("constant.character.interro", tokens[1].type);
    },

    'test: recognises single word as text' : function() {
        var tokens = this.tokenizer.getLineTokens(' foo', "start").tokens;
        assert.equal("text", tokens[0].type);
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}