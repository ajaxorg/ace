/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

var JavaScriptMode = require("./javascript").Mode;
var assert = require("../test/assertions");

module.exports = {

    name: "JavaScript Tokenizer",

    setUp : function() {
        this.tokenizer = new JavaScriptMode().getTokenizer();
    },

    "test: tokenize1" : function() {
        var line = "foo = function";

        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assert.equal(5, tokens.length);
        assert.equal("identifier", tokens[0].type);
        assert.equal("text", tokens[1].type);
        assert.equal("keyword.operator", tokens[2].type);
        assert.equal("text", tokens[3].type);
        assert.equal("storage.type", tokens[4].type);
    },

    "test: tokenize 'standard' functions" : function() {
        var line = "string.charCodeAt(23); document.getElementById('test'); console.log('Here it is');";

        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assert.equal(23, tokens.length);
        assert.equal("support.function", tokens[2].type); // charCodeAt
        assert.equal("support.function.dom", tokens[10].type); // getElementById
        assert.equal("support.function.firebug", tokens[18].type); // log
    },

    "test: tokenize doc comment" : function() {
        var line = "abc /** de */ fg";

        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assert.equal(5, tokens.length);
        assert.equal("identifier", tokens[0].type);
        assert.equal("text", tokens[1].type);
        assert.equal("comment.doc", tokens[2].type);
        assert.equal("text", tokens[3].type);
        assert.equal("identifier", tokens[4].type);
    },

    "test: tokenize doc comment with tag" : function() {
        var line = "/** @param {} */";

        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assert.equal(3, tokens.length);
        assert.equal("comment.doc", tokens[0].type);
        assert.equal("comment.doc.tag", tokens[1].type);
        assert.equal("comment.doc", tokens[2].type);
    },

    "test: tokenize parens" : function() {
        var line = "[{( )}]";

        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        // TODO is it useful to keep parens in separate tokens?
        assert.equal(3, tokens.length);
        assert.equal("paren.lparen", tokens[0].type);
        assert.equal("text", tokens[1].type);
        assert.equal("paren.rparen", tokens[2].type);
    },

    "test for last rule in ruleset to catch capturing group bugs" : function() {
        var tokens = this.tokenizer.getLineTokens("}", "start").tokens;

        assert.equal(1, tokens.length);
        assert.equal("paren.rparen", tokens[0].type);
    },

    "test tokenize arithmetic expression which looks like a regexp": function() {
        var tokens = this.tokenizer.getLineTokens("a/b/c", "start").tokens;
        assert.equal(5, tokens.length);

        var tokens = this.tokenizer.getLineTokens("a/=b/c", "start").tokens;
        assert.equal(5, tokens.length);
    },

    "test tokenize reg exps" : function() {
        var tokens = this.tokenizer.getLineTokens("a=/b/g", "start").tokens;
        assert.equal(3, tokens.length);
        assert.equal("string.regexp", tokens[2].type);

        var tokens = this.tokenizer.getLineTokens("a+/b/g", "start").tokens;
        assert.equal(3, tokens.length);
        assert.equal("string.regexp", tokens[2].type);

        var tokens = this.tokenizer.getLineTokens("a = 1 + /2 + 1/b", "start").tokens;
        assert.equal(11, tokens.length);
        assert.equal("string.regexp", tokens[8].type);

        var tokens = this.tokenizer.getLineTokens("a=/a/ / /a/", "start").tokens;
        assert.equal(7, tokens.length);
        assert.equal("string.regexp", tokens[2].type);
        assert.equal("string.regexp", tokens[6].type);

        var tokens = this.tokenizer.getLineTokens("case /a/.test(c)", "start").tokens;
        assert.equal(8, tokens.length);
        assert.equal("string.regexp", tokens[2].type);
    },

    "test tokenize multi-line comment containing a single line comment" : function() {
        var tokens = this.tokenizer.getLineTokens("/* foo // bar */", "start").tokens;
        assert.equal(1, tokens.length);
        assert.equal("comment", tokens[0].type);

        var tokens = this.tokenizer.getLineTokens("/* foo // bar */", "regex_allowed").tokens;
        assert.equal(1, tokens.length);
        assert.equal("comment", tokens[0].type);
    },

    "test tokenize identifier with umlauts": function() {
        var tokens = this.tokenizer.getLineTokens("füße", "start").tokens;
        assert.equal(1, tokens.length);
    },

    "test // is not a regexp": function() {
        var tokens = this.tokenizer.getLineTokens("{ // 123", "start").tokens;
        assert.equal(3, tokens.length);
        assert.equal("paren.lparen", tokens[0].type);
        assert.equal("text", tokens[1].type);
        assert.equal("comment", tokens[2].type);
    },

    "test skipping escaped chars": function() {
        var line = "console.log('Meh\\nNeh');"
        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assert.equal(9, tokens.length);
        assert.equal("constant.language.escape", tokens[5].type);

        line = "console.log('\\u1232Feh');";
        tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assert.equal(9, tokens.length);
        assert.equal("constant.language.escape", tokens[5].type);
    },

    "test multiline strings": function() {
        var line = "console.log('Meh\\"
        var data = this.tokenizer.getLineTokens(line, "start")

        assert.equal(5, data.tokens.length);
        assert.equal(data.state, "qstring");

        line = "console.log('Meh\\ "
        data = this.tokenizer.getLineTokens(line, "start")

        assert.equal(6, data.tokens.length);
        assert.equal(data.state, "start");

        line = 'console.log("\\'
        data = this.tokenizer.getLineTokens(line, "start")

        assert.equal(5, data.tokens.length);
        assert.equal(data.state, "qqstring");

        line = 'a="'
        data = this.tokenizer.getLineTokens(line, "start")

        assert.equal(3, data.tokens.length);
        assert.equal(data.state, "start");
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
