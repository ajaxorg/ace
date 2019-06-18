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

define(function (require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var NimHighlightRules = function () {

    var keywordMapper = this.createKeywordMapper({
        "variable": "var|let|const",
        "keyword": "assert|parallel|spawn|export|include|from|template|mixin|bind|import|concept|raise|defer|try|finally|except|converter|proc|func|macro|method|and|or|not|xor|shl|shr|div|mod|in|notin|is|isnot|of|static|if|elif|else|case|of|discard|when|return|yield|block|break|while|echo|continue|asm|using|cast|addr|unsafeAddr|type|ref|ptr|do|declared|defined|definedInScope|compiles|sizeOf|is|shallowCopy|getAst|astToStr|spawn|procCall|for|iterator|as",
        "storage.type": "newSeq|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|float|char|bool|string|set|pointer|float32|float64|enum|object|cstring|array|seq|openArray|varargs|UncheckedArray|tuple|set|distinct|void|auto|openarray|range",
        "support.function": "lock|ze|toU8|toU16|toU32|ord|low|len|high|add|pop|contains|card|incl|excl|dealloc|inc",
        "constant.language": "nil|true|false"
    }, "identifier");

    var hexNumber = "(?:0[xX][\\dA-Fa-f][\\dA-Fa-f_]*)";
    var decNumber = "(?:[0-9][\\d_]*)";
    var octNumber = "(?:0o[0-7][0-7_]*)";
    var binNumber = "(?:0[bB][01][01_]*)";
    var intNumber = "(?:" + hexNumber + "|" + decNumber + "|" + octNumber + "|" + binNumber + ")(?:'?[iIuU](?:8|16|32|64)|u)?\\b";
    var exponent = "(?:[eE][+-]?[\\d][\\d_]*)";
    var floatNumber = "(?:[\\d][\\d_]*(?:[.][\\d](?:[\\d_]*)" + exponent + "?)|" + exponent + ")";
    var floatNumberExt = "(?:" + hexNumber + "(?:'(?:(?:[fF](?:32|64)?)|[dD])))|(?:" + floatNumber + "|" + decNumber + "|" + octNumber + "|" + binNumber + ")(?:'(?:(?:[fF](?:32|64)?)|[dD]))";
    var stringEscape = "\\\\([abeprcnlftv\\\"']|x[0-9A-Fa-f]{2}|[0-2][0-9]{2}|u[0-9A-Fa-f]{8}|u[0-9A-Fa-f]{4})";
    var identifier = '[a-zA-Z][a-zA-Z0-9_]*';
    this.$rules = {
        "start": [{
            token: ["identifier", "keyword.operator", "support.function"],
            regex: "(" + identifier + ")([.]{1})(" + identifier + ")(?=\\()"
        }, {//pragmas
            token: "paren.lparen",
            regex: "(\\{\\.)",
            next: [{
                token: "paren.rparen",
                regex: '(\\.\\}|\\})',
                next: "start"
            }, {
                include: "methods"
            }, {
                token: "identifier",
                regex: identifier
            }, {
                token: "punctuation",
                regex: /[,]/
            }, {
                token: "keyword.operator",
                regex: /[=:.]/
            }, {
                token: "paren.lparen",
                regex: /[[(]/
            }, {
                token: "paren.rparen",
                regex: /[\])]/
            }, {
                include: "math"
            }, {
                include: "strings"
            }, {
                defaultToken: "text"
            }]
        }, {
            token: "comment.doc.start",
            regex: /##\[(?!])/,
            push: "docBlockComment"
        }, {
            token: "comment.start",
            regex: /#\[(?!])/,
            push: "blockComment"
        }, {
            token: "comment.doc",
            regex: '##.*$'
        }, {
            token: "comment",
            regex: '#.*$'
        }, {
            include: "strings"
        }, {// character
            token: "string",
            regex: "'(?:\\\\(?:[abercnlftv]|x[0-9A-Fa-f]{2}|[0-2][0-9]{2}|u[0-9A-Fa-f]{8}|u[0-9A-Fa-f]{4})|.{1})?'"
        }, {
            include: "methods"
        }, {
            token: keywordMapper,
            regex: "[a-zA-Z][a-zA-Z0-9_]*\\b"
        }, {
            token: ["keyword.operator", "text", "storage.type"],
            regex: "([:])(\\s+)(" + identifier + ")(?=$|\\)|\\[|,|\\s+=|;|\\s+\\{)"
        }, {
            token: "paren.lparen",
            regex: /\[\.|{\||\(\.|\[:|[[({`]/
        }, {
            token: "paren.rparen",
            regex: /\.\)|\|}|\.]|[\])}]/
        }, {
            token: "keyword.operator",
            regex: /[=+\-*\/<>@$~&%|!?^.:\\]/
        }, {
            token: "punctuation",
            regex: /[,;]/
        }, {
            include: "math"
        }],
        blockComment: [{
            regex: /#\[]/,
            token: "comment"
        }, {
            regex: /#\[(?!])/,
            token: "comment.start",
            push: "blockComment"
        }, {
            regex: /]#/,
            token: "comment.end",
            next: "pop"
        }, {
            defaultToken: "comment"
        }],
        docBlockComment: [{
            regex: /##\[]/,
            token: "comment.doc"
        }, {
            regex: /##\[(?!])/,
            token: "comment.doc.start",
            push: "docBlockComment"
        }, {
            regex: /]##/,
            token: "comment.doc.end",
            next: "pop"
        }, {
            defaultToken: "comment.doc"
        }],
        math: [{
            token: "constant.float",
            regex: floatNumberExt
        }, {
            token: "constant.float",
            regex: floatNumber
        }, {
            token: "constant.integer",
            regex: intNumber
        }],
        methods: [{
            token: "support.function",
            regex: "(\\w+)(?=\\()"
        }],
        strings: [{
            token: "string",
            regex: '(\\b' + identifier + ')?"""',
            push: [{
                token: "string",
                regex: '"""',
                next: "pop"
            }, {
                defaultToken: "string"
            }]
        }, {
            token: "string",
            regex: "\\b" + identifier + '"(?=.)',
            push: [{
                token: "string",
                regex: '"|$',
                next: "pop"
            }, {
                defaultToken: "string"
            }]
        }, {
            token: "string",
            regex: '"',
            push: [{
                token: "string",
                regex: '"|$',
                next: "pop"
            }, {
                token: "constant.language.escape",
                regex: stringEscape
            }, {
                defaultToken: "string"
            }]
        }]
    };
    this.normalizeRules();
};


oop.inherits(NimHighlightRules, TextHighlightRules);

exports.NimHighlightRules = NimHighlightRules;
});
