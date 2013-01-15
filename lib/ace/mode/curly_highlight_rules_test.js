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

var CurlyMode = require("./curly").Mode;
var assert = require("../test/assertions");

var testData = {
    "test: tokenize Curly template" : [{
        text: "{{test}}",
        state: ["start", "start"],
        tokens: [{
            type: "variable",
            value: "{{"
        }, {
            type: "text",
            value: "test"
        }, {
            type: "variable",
            value: "}}"
        }]
    }],

    "test: tokenize embedded script" : [{
        text: "<script a='a'>var</script>'123'",
        state: ["start", "start"],
        tokens: [{
            type: "meta.tag",
            value: "<"
        }, {
            type: "meta.tag.tag-name.script",
            value: "script"
        }, {
            type: "text",
            value: " "
        }, {
            type: "entity.other.attribute-name",
            value: "a"
        }, {
            type: "keyword.operator",
            value: "="
        }, {
            type: "string",
            value: "'a'"
        }, {
            type: "meta.tag.r",
            value: ">"
        }, {
            type: "storage.type",
            value: "var"
        }, {
            type: "meta.tag",
            value: "</"
        }, {
            type: "meta.tag.tag-name.script",
            value: "script"
        }, {
            type: "meta.tag.r",
            value: ">"
        }, {
            type: "text",
            value: "'123'"
        }]
    }],

    "test: tokenize multiline attribute value with double quotes": [{
        text: "<a href=\"abc",
        state: [ "start", "tag_qqstring"],
        tokens: [{
                type: "meta.tag",
                value: "<"
            }, {
                type: "meta.tag.tag-name.anchor",
                value: "a"
            }, {
                type: "text",
                value: " "
            }, {
                type: "entity.other.attribute-name",
                value: "href"
            }, {
                type: "keyword.operator",
                value: "="
            }, {
                type: "string",
                value: "\"abc"
            }
        ]
    }, {
        text: "def\">",
        state: [ "tag_qqstring", "start" ],
        tokens: [ {
                type: "string",
                value: "def\""
            }, {
                type: "meta.tag.r",
                value: ">"
            }
        ]
    }],

    "test: tokenize multiline attribute value with single quotes": [{
        text: "<a href='abc",
        state: ["start", "tag_qstring"],
        tokens: [{
                type: "meta.tag",
                value: "<"
            }, {
                type: "meta.tag.tag-name.anchor",
                value: "a"
            }, {
                type: "text",
                value: " "
            }, {
                type: "entity.other.attribute-name",
                value: "href"
            }, {
                type: "keyword.operator",
                value: "="
            }, {
                type: "string",
                value: "'abc"
            }
        ]
    }, {
        text: "def\"'>",
        state: [ "tag_qstring", "start" ],
        tokens: [ {
                type: "string",
                value: "def\"'"
            }, {
                type: "meta.tag.r",
                value: ">"
            }
        ]
    }]
};

function generateTest(exampleData) {
    return function testTokenizer() {
        for (var i = 0; i < exampleData.length; i++) {
            var s = exampleData[i];

            var lineTokens = tokenizer.getLineTokens(s.text, s.state[0]);

            assert.equal(
                JSON.stringify(lineTokens, null, 4),
                JSON.stringify({tokens:s.tokens, state: s.state[1]}, null, 4)
            );
        }
    }
}

var tokenizer;
module.exports = {
    setUp : function() {
        tokenizer = new CurlyMode().getTokenizer();
    }
}

for (var i in testData) {
    module.exports[i] = generateTest(testData[i])
}

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
