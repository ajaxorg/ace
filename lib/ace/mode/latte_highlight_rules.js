/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2013, Ajax.org B.V.
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
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var LatteHighlightRules = function() {
    // inherit from html
    HtmlHighlightRules.call(this);

    // add latte start tags to the HTML
    for (var rule in this.$rules) {
        this.$rules[rule].unshift(
            {
                token : "comment.start.latte",
                regex : "\\{\\*",
                push : [{
                    token : "comment.end.latte",
                    regex : ".*\\*\\}",
                    next : "pop"
                }, {
                    defaultToken : "comment"
                }]
            }, {
                token : "meta.tag.punctuation.tag-open.latte",
                regex : "\\{(?![\\s'\"{}]|$)/?",
                push : [{
                    token : "meta.tag.latte",
                    regex : "(?:_|=|[a-z]\\w*(?:[.:-]\\w+)*)?",
                    next: [{
                        token : "meta.tag.punctuation.tag-close.latte",
                        regex : "\\}",
                        next : "pop"
                    }, {
                        include: "latte-content"
                    }]
                }]
        });
    }

    // add n:attribute to HTML tag
    this.$rules['tag_stuff'].unshift({
        token : "meta.attribute.latte",
        regex : "n:[\\w-]+",
        next : [{
            include: "tag_whitespace"
        }, {
            token : "keyword.operator.attribute-equals.xml",
            regex : "=",
            next : [{
                token : "string.attribute-value.xml",
                regex : "'",
                next : [
                    {token : "string.attribute-value.xml", regex: "'", next: "tag_stuff"},
                    {include : "latte-content"}
                ]
            }, {
                token : "string.attribute-value.xml",
                regex : '"',
                next : [
                    {token : "string.attribute-value.xml", regex: '"', next: "tag_stuff"},
                    {include : "latte-content"}
                ]
            }, {
                token : "text.tag-whitespace.xml",
                regex : "\\s",
                next: "tag_stuff"
            }, {
                token : "meta.tag.punctuation.tag-close.xml",
                regex : "/?>",
                next: "tag_stuff"
            }, {
               include : "latte-content"
            }]
        }, {
            token : "empty",
            regex : "",
            next : "tag_stuff"
        }]
    });


    // PHP content
    this.$rules["latte-content"] = [
        {
            token : "comment.start.latte", // multi line comment
            regex : "\\/\\*",
            push : [
                {
                    token : "comment.end.latte",
                    regex : "\\*\\/",
                    next : "pop"
                }, {
                    defaultToken : "comment"
                }
            ]
        }, {
            token : "string.start", // " string start
            regex : '"',
            push : [
                {
                    token : "constant.language.escape",
                    regex : '\\\\(?:[nrtvef\\\\"$]|[0-7]{1,3}|x[0-9A-Fa-f]{1,2})'
                }, {
                    token : "variable",
                    regex : /\$[\w]+(?:\[[\w\]+]|[=\-]>\w+)?/
                }, {
                    token : "variable",
                    regex : /\$\{[^"\}]+\}?/           // this is wrong but ok for now
                },
                {token : "string.end", regex : '"', next : "pop"},
                {defaultToken : "string"}
            ]
        }, {
            token : "string.start", // ' string start
            regex : "'",
            push : [
                {token : "constant.language.escape", regex : /\\['\\]/},
                {token : "string.end", regex : "'", next : "pop"},
                {defaultToken : "string"}
            ]
        }, {
            token : "keyword.control",
            regex : "\\b(?:INF|NAN|and|or|xor|AND|OR|XOR|clone|new|instanceof|return|continue|break|as)\\b"
        }, {
            token : "constant.language",
            regex : "\\b(?:true|false|null|TRUE|FALSE|NULL)\\b"
        }, {
            token : "variable",
            regex : /\$\w+/
        }, {
            token : "constant.numeric",
            regex : "[+-]?[0-9]+(?:\\.[0-9]+)?(?:e[0-9]+)?"
        }, {
            token : ["support.class", "keyword.operator"],
            regex : "\\b(\\w+)(::)"
        }, {
            token : "constant.language", // constants
            regex : "\\b(?:[A-Z0-9_]+)\\b"
        }, {
            token : "string.unquoted",
            regex : "\\w+(?:-+\\w+)*"
        }, {
            token : "paren.lparen",
            regex : "[[({]"
        }, {
            token : "paren.rparen",
            regex : "[\\])}]"
        }, {
            token : "keyword.operator",
            regex : "::|=>|->|\\?->|\\?\\?->|\\+\\+|--|<<|>>|<=>|<=|>=|===|!==|==|!=|<>|&&|\\|\\||\\?\\?|\\?>|\\*\\*|\\.\\.\\.|[^'\"]" // =>, any char except quotes
        }
    ];

    this.normalizeRules();
};

oop.inherits(LatteHighlightRules, TextHighlightRules);

exports.LatteHighlightRules = LatteHighlightRules;
});
