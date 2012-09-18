/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
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
 *
 * Contributor(s):
 *
 * quexer <quexer AT gmail DOT com>
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

var Mode = require("./markdown").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {
        this.tokenizer = new Mode().getTokenizer();
    },

    "test: header 1 ": function() {
        var tokens = this.tokenizer.getLineTokens("#f", "start").tokens;
        assert.equal(tokens.length, 1);
        assert.equal(tokens[0].type, 'markup.heading.1');
    },

    "test: header 2": function() {
        var tokens = this.tokenizer.getLineTokens("## foo", "start").tokens;
        assert.equal(tokens.length, 1);
        assert.equal(tokens[0].type, 'markup.heading.2');
    },

    "test: header ends with ' #'": function() {
        var tokens = this.tokenizer.getLineTokens("# # # ", "start").tokens;
        assert.equal(tokens.length, 1);
        assert.equal(tokens[0].type, 'markup.heading.1');
    },

    "test: header ends with '#'": function() {
        var tokens = this.tokenizer.getLineTokens("#foo# ", "start").tokens;
        assert.equal(tokens.length, 1);
        assert.equal(tokens[0].type, 'markup.heading.1');
    },

    "test: 6+ #s is not a valid header": function() {
        var tokens = this.tokenizer.getLineTokens("####### foo", "start").tokens;
        assert.equal(tokens.length, 1);
        assert.equal(tokens[0].type, 'text');
    },

    "test: # followed be only space is not a valid header": function() {
        var tokens = this.tokenizer.getLineTokens("#  ", "start").tokens;
        assert.equal(tokens.length, 1);
        assert.equal(tokens[0].type, 'text');
    },



    "test: only space between #s is not a valid header": function() {
        var tokens = this.tokenizer.getLineTokens("#  #", "start").tokens;
        assert.equal(tokens.length, 1);
        assert.equal(tokens[0].type, 'text');
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
