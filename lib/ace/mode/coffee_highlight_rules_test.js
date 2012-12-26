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

var Mode = require("./coffee").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {
        this.tokenizer = new Mode().getTokenizer();
        this.testTokens = function(tokens, correct) {
            assert.equal(tokens.length, correct.length);
            correct.forEach(function(type, i) {
                assert.equal(tokens[i].type, type);
            });
        };
    },

    "test: tokenize keyword": function() {
        var tokens = this.tokenizer.getLineTokens("for", "start").tokens;
        assert.equal(tokens.length, 1);
        assert.equal(tokens[0].type, "keyword");
    },
    
    "test: tokenize regexp": function() {
        var tokens = this.tokenizer.getLineTokens('/"[a]/', "start").tokens;
        assert.equal(tokens.length, 1);
        assert.equal(tokens[0].type, "string.regex");
    },
    
    "test: tokenize function: 'foo = ({args}) ->'": function() {
        var tokens = this.tokenizer.getLineTokens("foo = ({args}) ->", "start").tokens;
        var correct = [
            "entity.name.function", "text", "keyword.operator", "text",
            "paren.lparen", "variable.parameter", "paren.rparen", "text", "storage.type"
        ];
        this.testTokens(tokens, correct);

        tokens = this.tokenizer.getLineTokens("foo = ({a1, a2}) ->", "start").tokens;
        this.testTokens(tokens, correct);

        tokens = this.tokenizer.getLineTokens("foo = ({@a1, a2}) ->", "start").tokens;
        this.testTokens(tokens, correct);
    },

    "test: tokenize function: 'foo : ({args}) ->'": function() {
        var tokens = this.tokenizer.getLineTokens("foo : ({args}) ->", "start").tokens;
        var correct = [
            "entity.name.function", "text", "punctuation.operator", "text",
            "paren.lparen", "variable.parameter", "paren.rparen", "text", "storage.type"
        ];
        this.testTokens(tokens, correct);
    },

    "test: tokenize function: invalid case: 'foo = ({args}) ->'": function() {
        var tokens = this.tokenizer.getLineTokens("foo = ({0abc}) ->", "start").tokens;
        assert.notEqual(tokens[0].type, "entity.name.function");

        tokens = this.tokenizer.getLineTokens("foo = ({/abc}) ->", "start").tokens;
        assert.notEqual(tokens[0].type, "entity.name.function");

        tokens = this.tokenizer.getLineTokens("foo = ({abc/}) ->", "start").tokens;
        assert.notEqual(tokens[0].type, "entity.name.function");

        tokens = this.tokenizer.getLineTokens("foo = ({#abc}) ->", "start").tokens;
        assert.notEqual(tokens[0].type, "entity.name.function");

        tokens = this.tokenizer.getLineTokens("foo = ({abc#}) ->", "start").tokens;
        assert.notEqual(tokens[0].type, "entity.name.function");

        tokens = this.tokenizer.getLineTokens("foo = ({)abc}) ->", "start").tokens;
        assert.notEqual(tokens[0].type, "entity.name.function");

        tokens = this.tokenizer.getLineTokens("foo = ({abc)}) ->", "start").tokens;
        assert.notEqual(tokens[0].type, "entity.name.function");

        tokens = this.tokenizer.getLineTokens("foo = ({a{bc}) ->", "start").tokens;
        assert.notEqual(tokens[0].type, "entity.name.function");
    },

    "test: tokenize function: 'foo = ({}) ->'": function() {
        var tokens = this.tokenizer.getLineTokens("foo = ({}) ->", "start").tokens;
        var correct = [
            "entity.name.function", "text", "keyword.operator", "text",
            "paren.lparen", "paren.rparen", "text", "storage.type"
        ];
        this.testTokens(tokens, correct);

        tokens = this.tokenizer.getLineTokens("foo = ({ }) ->", "start").tokens;
        correct = [
            "entity.name.function", "text", "keyword.operator", "text",
            "paren.lparen", "text", "paren.rparen", "text", "storage.type"
        ];
        assert.equal(tokens.length, 9);
        this.testTokens(tokens, correct);
    },

    "test: tokenize function: 'foo : ({}) ->'": function() {
        var tokens = this.tokenizer.getLineTokens("foo : ({}) ->", "start").tokens;
        var correct = [
            "entity.name.function", "text", "punctuation.operator", "text",
            "paren.lparen", "paren.rparen", "text", "storage.type"
        ];
        this.testTokens(tokens, correct);
    },

    "test: tokenize function: 'foo = (args) ->'": function() {
        var tokens = this.tokenizer.getLineTokens("foo = (args) ->", "start").tokens;
        var correct = [
            "entity.name.function", "text", "keyword.operator", "text",
            "paren.lparen", "variable.parameter", "paren.rparen", "text", "storage.type"
        ];
        this.testTokens(tokens, correct);

        tokens = this.tokenizer.getLineTokens("foo = (arg1, arg2) ->", "start").tokens;
        this.testTokens(tokens, correct);

        tokens = this.tokenizer.getLineTokens("foo = (arg1 = 1, arg2 = 'name') ->", "start").tokens;
        this.testTokens(tokens, correct);

        tokens = this.tokenizer.getLineTokens("foo = (@arg1 = /abc/, arg2 = 'name') ->", "start").tokens;
        this.testTokens(tokens, correct);
    },
    
    "test: tokenize function: invalid case: 'foo=(args) ->'": function() {
        var tokens = this.tokenizer.getLineTokens("foo=(/args) ->", "start").tokens;
        assert.notEqual(tokens[0].type, "entity.name.function");
    },

    "test: tokenize function: 'foo = () ->'": function() {
        var tokens = this.tokenizer.getLineTokens("foo = () ->", "start").tokens;
        var correct = [
            "entity.name.function", "text", "keyword.operator", "text",
            "paren.lparen", "paren.rparen", "text", "storage.type"
        ];
        this.testTokens(tokens, correct);

        tokens = this.tokenizer.getLineTokens("foo = ( ) ->", "start").tokens;
        correct = [
            "entity.name.function", "text", "keyword.operator", "text",
            "paren.lparen", "text", "paren.rparen", "text", "storage.type"
        ];
        this.testTokens(tokens, correct);
    },

    "test: tokenize function: 'foo : () ->'": function() {
        var tokens = this.tokenizer.getLineTokens("foo : () ->", "start").tokens;
        var correct = [
            "entity.name.function", "text", "punctuation.operator", "text",
            "paren.lparen", "paren.rparen", "text", "storage.type"
        ];
        this.testTokens(tokens, correct);

        tokens = this.tokenizer.getLineTokens("foo : ( ) ->", "start").tokens;
        var correct = [
            "entity.name.function", "text", "punctuation.operator", "text",
            "paren.lparen", "text", "paren.rparen", "text", "storage.type"
        ];
        this.testTokens(tokens, correct);
    },

    "test: tokenize function: 'window.foo = (args) ->'": function() {
        var tokens = this.tokenizer.getLineTokens("window.foo = (args) ->", "start").tokens;
        var correct = [
            "variable.language", "punctuation.operator", "entity.name.function", "text", "keyword.operator", "text",
            "paren.lparen", "variable.parameter", "paren.rparen", "text", "storage.type"
        ];
        this.testTokens(tokens, correct);
    },

    "test: tokenize function: 'foo = ->'": function() {
        var tokens = this.tokenizer.getLineTokens("foo = ->", "start").tokens;
        var correct = [
            "entity.name.function", "text", "keyword.operator", "text", "storage.type"
        ];
        this.testTokens(tokens, correct);
    },

    "test: tokenize function: 'foo : ->'": function() {
        var tokens = this.tokenizer.getLineTokens("foo : ->", "start").tokens;
        var correct = [
            "entity.name.function", "text", "punctuation.operator", "text", "storage.type"
        ];
        this.testTokens(tokens, correct);
    },

    "test: tokenize callback function: 'foo bar: 1, (args) ->'": function() {
        var tokens = this.tokenizer.getLineTokens("foo bar: 1, (args) ->", "start").tokens;
        var correct = [
            "identifier", "text", "identifier", "punctuation.operator", "text", "constant.numeric", "punctuation.operator", "text",
            "paren.lparen", "variable.parameter", "paren.rparen", "text", "storage.type"
        ];
        this.testTokens(tokens, correct);
    },

    "test: tokenize class: 'class Foo'": function() {
        var tokens = this.tokenizer.getLineTokens("class Foo", "start").tokens;
        var correct = [
            "keyword", "text", "language.support.class"
        ];
        this.testTokens(tokens, correct);
    },

    "test: tokenize class 'class Foo extends Bar'": function() {
        var tokens = this.tokenizer.getLineTokens("class Foo extends Bar", "start").tokens;
        var correct = [
            "keyword", "text", "language.support.class", "text", "keyword", "text", "language.support.class"
        ];
        this.testTokens(tokens, correct);
    },

    "test: tokenize illegal name property: 'foo.static.function'": function() {
        var tokens = this.tokenizer.getLineTokens("foo.static.function", "start").tokens;
        var correct = [
            "identifier", "punctuation.operator", "identifier", "punctuation.operator", "identifier"
        ];
        this.testTokens(tokens, correct);
    },    

    // TODO: disable. not yet implemented
    "!test tokenize string with interpolation": function() {
        var tokens = this.tokenizer.getLineTokens('"#{ 22 / 7 } is a decent approximation of π"', "start").tokens;
        console.log(tokens);
        assert.equal(tokens.length, 12);
        //assert.equal(tokens[0].type, "keyword");
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
