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
var FSharpHighlightRules = function () {

    var keywordMapper = this.createKeywordMapper({
        "variable": "this",
        "keyword": 'abstract|assert|base|begin|class|default|delegate|done|downcast|downto|elif\
|else|exception|extern|false|finally|function|global|inherit|inline|interface|internal|lazy|match\
|member|module|mutable|namespace|open|or|override|private|public|rec|return|return!|select|static\
|struct|then|to|true|try|typeof|upcast|use|use!|val|void|when|while|with|yield|yield!|__SOURCE_DIRECTORY__\
|as|asr|land|lor|lsl|lsr|lxor|mod|sig|atomic|break|checked|component|const|constraint|constructor|continue\
|eager|event|external|fixed|functor|include|method|mixin|object|parallel|process|protected|pure|sealed|tailcall\
|trait|virtual|volatile|and|do|end|for|fun|if|in|let|let!|new|not|null|of|endif',
        "constant": "true|false"
    }, "identifier");

    var floatNumber = "(?:(?:(?:(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.))|(?:\\d+))(?:[eE][+-]?\\d+))|(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.)))";

    this.$rules = {
        "start": [
            {
              token: "variable.classes",
              regex: '\\[\\<[.]*\\>\\]'
            },
            {
                token: "comment",
                regex: '//.*$'
            },
            {
                token: "comment.start",
                regex: /\(\*(?!\))/,
                push: "blockComment"
            },
            {
                token: "string",
                regex: "'.'"
            },
            {
                token: "string",
                regex: '"""',
                next  : [{
                    token : "constant.language.escape",
                    regex : /\\./,
                    next  : "qqstring"
                }, {
                    token : "string",
                    regex : '"""',
                    next  : "start"
                }, {
                    defaultToken: "string"
                }]
            },
            {
                token: "string",
                regex: '"',
                next  : [{
                    token : "constant.language.escape",
                    regex : /\\./,
                    next  : "qqstring"
                }, {
                    token : "string",
                    regex : '"',
                    next  : "start"
                }, {
                    defaultToken: "string"
                }]
            },
            {
                token: ["verbatim.string", "string"],
                regex: '(@?)(")',
                stateName : "qqstring",
                next  : [{
                    token : "constant.language.escape",
                    regex : '""'
                }, {
                    token : "string",
                    regex : '"',
                    next  : "start"
                }, {
                    defaultToken: "string"
                }]
            },
            {
                token: "constant.float",
                regex: "(?:" + floatNumber + "|\\d+)[jJ]\\b"
            },
            {
                token: "constant.float",
                regex: floatNumber
            },
            {
                token: "constant.integer",
                regex: "(?:(?:(?:[1-9]\\d*)|(?:0))|(?:0[oO]?[0-7]+)|(?:0[xX][\\dA-Fa-f]+)|(?:0[bB][01]+))\\b"
            },
            {
                token: ["keyword.type", "variable"],
                regex: "(type\\s)([a-zA-Z0-9_$\-]*\\b)"
            },
            {
                token: keywordMapper,
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            },
            {
                token: "keyword.operator",
                regex: "\\+\\.|\\-\\.|\\*\\.|\\/\\.|#|;;|\\+|\\-|\\*|\\*\\*\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|<-|=|\\(\\*\\)"
            },
            {
                token: "paren.lpar",
                regex: "[[({]"
            },
            {
                token: "paren.rpar",
                regex: "[\\])}]"
            }
        ],
        blockComment: [{
            regex: /\(\*\)/,
            token: "comment"
        }, {
            regex: /\(\*(?!\))/,
            token: "comment.start",
            push: "blockComment"
        }, {
            regex: /\*\)/,
            token: "comment.end",
            next: "pop"
        }, {
            defaultToken: "comment"
        }]
    };
    this.normalizeRules();
};


oop.inherits(FSharpHighlightRules, TextHighlightRules);

exports.FSharpHighlightRules = FSharpHighlightRules;
});
