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

var LiquidMode = require("./liquid").Mode;
var assert = require("../test/assertions");

module.exports = {

    name: "Liquid Tokenizer",

    setUp : function() {
        this.tokenizer = new LiquidMode().getTokenizer();
    },

    "test: tokenize tags" : function() {
        var line = "for one in many";

        var tokens = this.tokenizer.getLineTokens(line, "liquid_start").tokens;

        assert.equal(7, tokens.length);
        assert.equal("keyword", tokens[0].type);
        assert.equal("text", tokens[1].type);
        assert.equal("identifier", tokens[2].type);
        assert.equal("text", tokens[3].type);
        assert.equal("keyword", tokens[4].type);
        assert.equal("text", tokens[5].type);
        assert.equal("identifier", tokens[6].type);
    },

    "test: tokenize parens" : function() {
        var line = "[{( )}]";

        var tokens = this.tokenizer.getLineTokens(line, "liquid_start").tokens;

        assert.equal(3, tokens.length);
        assert.equal("paren.lparen", tokens[0].type);
        assert.equal("text", tokens[1].type);
        assert.equal("paren.rparen", tokens[2].type);
    }

};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
