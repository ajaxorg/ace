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

var KotlinHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    var keywordMapper = this.$keywords = this.createKeywordMapper({
        "storage.modifier.kotlin": "var|val|public|private|protected|abstract|final|enum|open|attribute|"
            + "annotation|override|inline|var|val|vararg|lazy|in|out|internal|data|tailrec|operator|infix|const|"
            + "yield|typealias|typeof|sealed|inner|value|lateinit|external|suspend|noinline|crossinline|reified|"
            + "expect|actual",
        "keyword": "companion|class|object|interface|namespace|type|fun|constructor|if|else|while|for|do|return|when|"
            + "where|break|continue|try|catch|finally|throw|in|is|as|assert",
        "storage.type.buildin.kotlin": "Any|Unit|String|Int|Boolean|Char|Long|Double|Float|Short|Byte|dynamic|"
            + "IntArray|BooleanArray|CharArray|LongArray|DoubleArray|FloatArray|ShortArray|ByteArray|Array|List|"
            + "Map|Nothing|Enum|Throwable|Comparable",
        "constant.language.kotlin": "true|false|null|this|super",
        "entity.name.function.kotlin": "get|set"
    }, "identifier");

    this.$rules = {
        start: [{
            include: "#comments"
        }, {
            token: [
                "text",
                "keyword.other.kotlin",
                "text",
                "entity.name.package.kotlin",
                "text"
            ],
            regex: /^(\s*)(package)\b(?:(\s*)([^ ;$]+)(\s*))?/
        }, {
            token: "comment",
            regex: /^\s*#!.*$/
        }, {
            include: "#imports"
        }, {
            include: "#expressions"
        }, {
            token: "string",
            regex: /@[a-zA-Z]+\b/
        },{
            token: keywordMapper,
            regex: /[a-zA-Z_][\w]*\b/
        }, {
            token: "paren.lparen",
            regex: /[{(\[]/
        }, {
            token: "paren.rparen",
            regex: /[})\]]/
        }],
        "#comments": [{
            token: "comment",
            regex: /\/\*/,
            push: [{
                token: "comment",
                regex: /\*\//,
                next: "pop"
            }, {
                defaultToken: "comment"
            }]
        }, {
            token: [
                "text",
                "comment"
            ],
            regex: /(\s*)(\/\/.*$)/
        }],
        "#constants": [{
            token: "constant.numeric.kotlin",
            regex: /\b(?:0(?:x|X)[0-9a-fA-F]*|(?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:(?:e|E)(?:\+|-)?[0-9]+)?)(?:[LlFfUuDd]|UL|ul)?\b/
        }, {
            token: "constant.other.kotlin",
            regex: /\b[A-Z][A-Z0-9_]+\b/
        }],
        "#expressions": [{
            include: "#strings"
        }, {
            include: "#constants"
        }, {
            include: "#keywords"
        }],
        "#imports": [{
            token: [
                "text",
                "keyword.other.kotlin",
                "text",
                "keyword.other.kotlin"
            ],
            regex: /^(\s*)(import)(\s+[^ $]+\s+)((?:as)?)/
        }],
        "#keywords": [{
            token: "keyword.operator.kotlin",
            regex: /==|!=|===|!==|<=|>=|<|>|=>|->/
        }, {
            token: "keyword.operator.assignment.kotlin",
            regex: /=/
        }, {
            token: "keyword.operator.declaration.kotlin",
            regex: /:/
        }, {
            token: "keyword.operator.dot.kotlin",
            regex: /\./
        }, {
            token: "keyword.operator.increment-decrement.kotlin",
            regex: /\-\-|\+\+/
        }, {
            token: "keyword.operator.arithmetic.kotlin",
            regex: /\-|\+|\*|\/|%/
        }, {
            token: "keyword.operator.arithmetic.assign.kotlin",
            regex: /\+=|\-=|\*=|\/=/
        }, {
            token: "keyword.operator.logical.kotlin",
            regex: /!|&&|\|\|/
        }, {
            token: "keyword.operator.range.kotlin",
            regex: /\.\./
        }, {
            token: "punctuation.kotlin",
            regex: /[;,]/
        }],
        "#strings": [{
            token: "string",
            regex: /"""/,
            push: [{
                token: "string",
                regex: /"""/,
                next: "pop"
            }, {
                token: "variable.parameter.template.kotlin",
                regex: /\$\w+|\${[^}]+}/
            }, {
                token: "constant.character.escape.kotlin",
                regex: /\\./
            }, {
                defaultToken: "string"
            }]
        }, {
            token: "string",
            regex: /"/,
            push: [{
                token: "string",
                regex: /"/,
                next: "pop"
            }, {
                token: "variable.parameter.template.kotlin",
                regex: /\$\w+|\$\{[^\}]+\}/
            }, {
                token: "constant.character.escape.kotlin",
                regex: /\\./
            }, {
                defaultToken: "string"
            }]
        }, {
            token: "string",
            regex: /'/,
            push: [{
                token: "string",
                regex: /'/,
                next: "pop"
            }, {
                token: "constant.character.escape.kotlin",
                regex: /\\./
            }, {
                defaultToken: "string"
            }]
        }, {
            token: "string",
            regex: /`/,
            push: [{
                token: "string",
                regex: /`/,
                next: "pop"
            }, {
                defaultToken: "string"
            }]
        }]
    };

    this.normalizeRules();
};

KotlinHighlightRules.metaData = {
    fileTypes: ["kt", "kts"],
    name: "Kotlin",
    scopeName: "source.Kotlin"
};


oop.inherits(KotlinHighlightRules, TextHighlightRules);

exports.KotlinHighlightRules = KotlinHighlightRules;
});