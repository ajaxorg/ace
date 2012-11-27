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

var RubyMode = require("./ruby").Mode;
var assert = require("../test/assertions");

module.exports = {
    
    name: "Ruby Tokenizer",
    
    setUp : function() {
        this.tokenizer = new RubyMode().getTokenizer();
    },

    "test: symbol tokenizer" : function() {
        // https://gist.github.com/1072693
        assertValidTokens(this.tokenizer, "constant.other.symbol.ruby",
          [":@thing", ":$thing", ":_thing", ":thing", ":Thing", ":thing1", ":thing_a",
              ":THING", ":thing!", ":thing=", ":thing?", ":t?"]);
        assertInvalidTokens(this.tokenizer, "constant.other.symbol.ruby",
          [":", ":@", ":$", ":1", ":1thing", ":th?ing", ":thi=ng", ":1thing",
            ":th!ing", ":thing#"]);
    },

    "test: namespaces aren't symbols" : function() {
        var line = "Namespaced::Class";
        var tokens = this.tokenizer.getLineTokens(line, "start").tokens;

        assert.equal(3, tokens.length);
        assert.equal("support.class", tokens[0].type);
        assert.equal("text", tokens[1].type);
        assert.equal("support.class", tokens[2].type);
    },

    "test: hex tokenizer" : function() {
        assertValidTokens(this.tokenizer, "constant.numeric",
            ["0x9a", "0XA1", "0x9_a"]);
        assertInvalidTokens(this.tokenizer, "constant.numeric",
            ["0x", "0x_9a", "0x9a_"]);
    },

    "test: float tokenizer" : function() {
        assertValidTokens(this.tokenizer, "constant.numeric",
            ["1", "+1", "-1", "12_345", "0.000_1"]);
        assertInvalidTokens(this.tokenizer, "constant.numeric",
            ["_", "_1", "1_", "1_.0", "0._1"]);
    }
};

function assertValidTokens(tokenizer, tokenType, validTokens) {
    for (var i = 0, length = validTokens.length; i < length; i++) {
        var validToken = validTokens[i],
            tokens = tokenizer.getLineTokens(validToken, "start").tokens;
        assert.equal(tokens[0].value, validToken,
          '"' + validToken + '" should be one token');
        assert.equal(tokens[0].type, tokenType,
          '"' + validToken + '" should be a "' + tokenType + '" token');
    }
}

function assertInvalidTokens(tokenizer, tokenType, invalidTokens) {
    for (var i = 0, length = invalidTokens.length; i < length; i++) {
        var invalidToken = invalidTokens[i],
            tokens = tokenizer.getLineTokens(invalidToken, "start").tokens;
        assert.ok(tokens[0].type !== tokenType || tokens[0].value !== invalidToken,
          '"' + invalidToken + '" is not a valid "' + tokenType + '"');
    }
}

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
