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

var EditSession = require("../edit_session").EditSession;
var Mode = require("./ruby").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp: function() {
        this.mode = new Mode();
    },

    "test getNextLineIndent": function() {
        assert.equal(this.mode.getNextLineIndent("start", "class Foo", "  "), "  ");
        assert.equal(this.mode.getNextLineIndent("start", "  def thing(wut)", "  "), "    ");
        assert.equal(this.mode.getNextLineIndent("start", "  fork do", "  "), "    ");
        assert.equal(this.mode.getNextLineIndent("start", "  fork do |wut| ", "  "), "    ");
        assert.equal(this.mode.getNextLineIndent("start", "  something = :ruby", "  "), "  ");
        assert.equal(this.mode.getNextLineIndent("start", "  if something == 3", "  "), "    ");
        assert.equal(this.mode.getNextLineIndent("start", "  else", "  "), "    ");
    },

    "test: checkOutdent": function() {
        assert.ok(this.mode.checkOutdent("start", "        en", "d"));
        assert.ok(this.mode.checkOutdent("start", "        els", "e"));
        assert.ok(this.mode.checkOutdent("start", "        ", "}"));
        assert.equal(this.mode.checkOutdent("start", "  end", "\n"), false);
        assert.equal(this.mode.checkOutdent("start", "foo = ba", "r"), false);
    },

    "test: auto outdent": function() {
        var session = new EditSession([
            "class Phil",
            "  Foo = 'bar'",
            "  def to_json(*a)",
            "    {",
            "      'json_class'   => self.class.name, # = 'Range'",
            "      'data'         => [ first, last, exclude_end? ]",
            "      }",
            "  end"]);
        this.mode.autoOutdent("start", session, 6);
        assert.equal("    }", session.getLine(6));
        this.mode.autoOutdent("start", session, 7);
        assert.equal("  end", session.getLine(7));
    },

    "test: different delimiters in percent strings": function() {
        var tokenizer = this.mode.getTokenizer();
        var tokens = tokenizer.getLineTokens("%q<t(es)t>", "start").tokens;
        assert.equal("string", tokens[1].type);
        assert.equal("t(es)t", tokens[1].value);

        tokens = tokenizer.getLineTokens("%q<t(es)t]#comment", "start").tokens;
        assert.equal("string", tokens[tokens.length - 1].type);
        assert.equal("t(es)t]#comment", tokens[tokens.length - 1].value);

        tokens = tokenizer.getLineTokens("%%test 1\\%%%", "start").tokens;
        assert.equal("string", tokens[1].type);
        assert.equal("test 1", tokens[1].value);
        assert.equal("constant.language.escape", tokens[2].type);
        assert.equal("string.end", tokens[3].type);
        assert.notEqual("string", tokens[4].type);

        tokens = tokenizer.getLineTokens("%s|test|", "start").tokens;
        assert.equal("constant.other.symbol.ruby", tokens[0].type);
        assert.equal("constant.other.symbol.ruby", tokens[tokens.length - 1].type);

        tokens = tokenizer.getLineTokens("%S{test}", "start").tokens;
        assert.equal("constant.other.symbol.ruby", tokens[0].type);
        assert.equal("constant.other.symbol.ruby", tokens[tokens.length - 1].type);
    },

    "test: nested and unescaped pairs of delimiters": function() {
        var tokenizer = this.mode.getTokenizer();

        var tokens = tokenizer.getLineTokens("%(t(es)t)(", "start").tokens;
        assert.equal("string.end", tokens[tokens.length - 2].type);
        assert.equal("paren.lparen", tokens[tokens.length - 1].type);

        tokens = tokenizer.getLineTokens("%q(t(es)t(", "start").tokens;
        assert.notEqual("paren.lparen", tokens[tokens.length - 1].type);

        tokens = tokenizer.getLineTokens("%{tes{t} \\{test\\}}t", "start").tokens;
        assert.notEqual("string", tokens[tokens.length - 1].type);
        assert.equal("string.end", tokens[tokens.length - 2].type);
        assert.equal("constant.language.escape", tokens[tokens.length - 3].type);

        tokens = tokenizer.getLineTokens("%s[te[s]|t][", "start").tokens;
        assert.equal("constant.other.symbol.ruby", tokens[tokens.length - 2].type);
        assert.notEqual("constant.other.symbol.ruby", tokens[tokens.length - 1].type);

        tokens = tokenizer.getLineTokens("%s[te[s]|t[", "start").tokens;
        assert.equal("constant.other.symbol.ruby", tokens[tokens.length - 1].type);
        assert.equal(1, tokens.length);

        tokens = tokenizer.getLineTokens("%S[te[s]|t][", "start").tokens;
        assert.equal("constant.other.symbol.ruby", tokens[tokens.length - 2].type);
        assert.notEqual("constant.other.symbol.ruby", tokens[tokens.length - 1].type);

        tokens = tokenizer.getLineTokens("%S[te[s]|t[", "start").tokens;
        assert.equal("constant.other.symbol.ruby", tokens[tokens.length - 1].type);
        assert.equal(1, tokens.length);
    },

    "test: percent Regexp strings": function() {
        var tokenizer = this.mode.getTokenizer();
        //percent regexp strings supports interpolation
        var tokens = tokenizer.getLineTokens("%r(#{ \"interpolated\" } regexp)", "start").tokens;
        assert.equal("string.regexp", tokens[0].type);
        assert.equal("paren.start", tokens[1].type);
        assert.equal("paren.rparen", tokens[tokens.length - 2].type);
        assert.equal("string.regexp", tokens[tokens.length - 1].type);
        //bad code style, but we should support this one
        tokens = tokenizer.getLineTokens("%r((a|b)*)#comment", "start").tokens;
        assert.equal("string.regexp", tokens[0].type);
        assert.notEqual("string.regexp", tokens[tokens.length - 1].type);
    },

    "test: uppercase letter in percent strings should allow interpolation and escaped characters": function() {
        var tokenizer = this.mode.getTokenizer();
        var tokens = tokenizer.getLineTokens("%Q(interpolated string #{1 + 1})", "start").tokens;
        assert.equal("string.end", tokens[tokens.length - 1].type);
        assert.equal("string.start", tokens[0].type);
        assert.equal("paren.start", tokens[2].type);
        assert.notEqual("string", tokens[3].type);
        assert.equal("1", tokens[3].value);

        tokens = tokenizer.getLineTokens("%q(interpolated string #{1 + 1})", "start").tokens;
        assert.equal("string.end", tokens[tokens.length - 1].type);
        assert.equal("string.start", tokens[0].type);
        assert.equal("string", tokens[1].type);
        assert.equal("interpolated string #{1 + 1}", tokens[1].value);
    },

    "test: different Heredoc tests": function() {
        var tokenizer = this.mode.getTokenizer();
        var firstLine = tokenizer.getLineTokens("herDocs = [<<'FOO', <<BAR, <<-BAZ, <<~`EXEC`] #comment", "start");
        assert.equal(8, firstLine.state.length);
        var nextLine = tokenizer.getLineTokens("  FOO #{literal}", firstLine.state);//this line shouldn't close FOO heredoc due to indentation
        assert.equal("string", nextLine.tokens[0].type);
        assert.equal(8, nextLine.state.length);
        nextLine = tokenizer.getLineTokens("FOO", nextLine.state);
        assert.equal("support.class", nextLine.tokens[0].type);
        assert.equal(6, nextLine.state.length);
        nextLine = tokenizer.getLineTokens("  BAR", nextLine.state);//not closing BAR heredoc due to indentation
        assert.equal("string", nextLine.tokens[0].type);
        assert.equal(6, nextLine.state.length);
        nextLine = tokenizer.getLineTokens("BAR", nextLine.state);
        assert.equal("support.class", nextLine.tokens[0].type);
        assert.equal(4, nextLine.state.length);
        nextLine = tokenizer.getLineTokens("  BAZ indented", nextLine.state);
        assert.equal("string", nextLine.tokens[0].type);
        assert.equal(4, nextLine.state.length);
        nextLine = tokenizer.getLineTokens("    BAZ", nextLine.state);
        assert.equal("support.class", nextLine.tokens[1].type);
        assert.equal(2, nextLine.state.length);
        nextLine = tokenizer.getLineTokens("        echo hi", nextLine.state);
        assert.equal("string", nextLine.tokens[0].type);
        assert.equal(2, nextLine.state.length);
        nextLine = tokenizer.getLineTokens("    EXEC", nextLine.state);
        assert.equal("support.class", nextLine.tokens[1].type);
        assert.equal("start", nextLine.state);
    }

};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
