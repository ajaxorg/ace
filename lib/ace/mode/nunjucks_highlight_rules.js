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
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;

var NunjucksHighlightRules = function() {
    HtmlHighlightRules.call(this);
    this.$rules["start"].unshift({
        token: "punctuation.begin",
        regex: /{{-?/,
        push: [{
            token: "punctuation.end",
            regex: /-?}}/,
            next: "pop"
        },
            {include: "expression"}
        ]
    }, {
        token: "punctuation.begin",
        regex: /{%-?/,
        push: [{
            token: "punctuation.end",
            regex: /-?%}/,
            next: "pop"
        }, {
            token: "constant.language.escape",
            regex: /\b(r\/.*\/[gimy]?)\b/
        },
            {include: "statement"}
        ]
    }, {
        token: "comment.begin",
        regex: /{#/,
        push: [{
            token: "comment.end",
            regex: /#}/,
            next: "pop"
        },
            {defaultToken: "comment"}
        ]
    });
    this.addRules({
        attribute_value: [{
            token: "string.attribute-value.xml",
            regex: "'",
            push: [
                {token: "string.attribute-value.xml", regex: "'", next: "pop"},
                {
                    token: "punctuation.begin",
                    regex: /{{-?/,
                    push: [{
                        token: "punctuation.end",
                        regex: /-?}}/,
                        next: "pop"
                    },
                        {include: "expression"}
                    ]
                },
                {include: "attr_reference"},
                {defaultToken: "string.attribute-value.xml"}
            ]
        }, {
            token: "string.attribute-value.xml",
            regex: '"',
            push: [
                {token: "string.attribute-value.xml", regex: '"', next: "pop"},
                {
                    token: "punctuation.begin",
                    regex: /{{-?/,
                    push: [{
                        token: "punctuation.end",
                        regex: /-?}}/,
                        next: "pop"
                    },
                        {include: "expression"}
                    ]
                },
                {include: "attr_reference"},
                {defaultToken: "string.attribute-value.xml"}
            ]
        }],
        "statement": [{
            token: "keyword.control",
            regex: /\b(block|endblock|extends|endif|elif|for|endfor|asyncEach|endeach|include|asyncAll|endall|macro|endmacro|set|endset|ignore missing|as|from|raw|verbatim|filter|endfilter)\b/
        },
            {include: "expression"}
        ],
        "expression": [{
            token: "constant.language",
            regex: /\b(true|false|none)\b/
        }, {
            token: "string",
            regex: /"/,
            push: [{
                token: "string",
                regex: /"/,
                next: "pop"
            },
                {include: "escapeStrings"},
                {defaultToken: "string"}
            ]
        }, {
            token: "string",
            regex: /'/,
            push: [{
                token: "string",
                regex: /'/,
                next: "pop"
            },
                {include: "escapeStrings"},
                {defaultToken: "string"}
            ]
        }, {
            token: "constant.numeric", // hexadecimal, octal and binary
            regex: /0(?:[xX][0-9a-fA-F]+|[oO][0-7]+|[bB][01]+)\b/
        }, {
            token: "constant.numeric", // decimal integers and floats
            regex: /(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/
        }, {
            token: "keyword.operator",
            regex: /\+|-|\/\/|\/|%|\*\*|\*|===|==|!==|!=|>=|>|<=|</
        }, {
            token: "keyword.control",
            regex: /\b(and|else|if|in|import|not|or)\b/
        }, {
            token: "support.function",
            regex: /[a-zA-Z_]+(?=\()/
        }, {
            token: "paren.lpar",
            regex: /[(\[{]/
        }, {
            token: "paren.rpar",
            regex: /[)\]}]/
        }, {
            token: "punctuation",
            regex: /[,]/
        }, {
            token: ["punctuation", "support.function"],
            regex: /(\.)([a-zA-Z_][a-zA-Z0-9_]*)(?=\()/
        }, {
            token: ["punctuation", "variable.parameter"],
            regex: /(\.)([a-zA-Z_][a-zA-Z0-9_]*)/
        }, {
            token: ["punctuation", "text", "support.other"],
            regex: /(\|)(\s)*([a-zA-Z_][a-zA-Z0-9_]*)/
        }, {
            token: "variable",
            regex: /[a-zA-Z_][a-zA-Z0-9_]*/
        }
        ],
        "escapeStrings": [{
            token: "constant.language.escape",
            regex: /(\\\\n)|(\\\\)|(\\")|(\\')|(\\a)|(\\b)|(\\f)|(\\n)|(\\r)|(\\t)|(\\v)/
        }, {
            token: "constant.language.escape",
            regex: /\\(?:x[0-9A-F]{2}|(?:U[0-9A-Fa-f]{8})|(?:u[0-9A-Fa-f]{4})|(?:N{[a-zA-Z ]+}))/
        }]
    });

    this.normalizeRules();
};

oop.inherits(NunjucksHighlightRules, TextHighlightRules);

exports.NunjucksHighlightRules = NunjucksHighlightRules;
});