/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2014, Ajax.org B.V.
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

var EiffelHighlightRules = function() {
    var keywords = "across|agent|alias|all|attached|as|assign|attribute|check|" +
        "class|convert|create|debug|deferred|detachable|do|else|elseif|end|" +
        "ensure|expanded|export|external|feature|from|frozen|if|inherit|" +
        "inspect|invariant|like|local|loop|not|note|obsolete|old|once|" +
        "Precursor|redefine|rename|require|rescue|retry|select|separate|" + 
        "some|then|undefine|until|variant|when";

    var operatorKeywords = "and|implies|or|xor";

    var languageConstants = "Void";

    var booleanConstants = "True|False";

    var languageVariables = "Current|Result";

    var keywordMapper = this.createKeywordMapper({
        "constant.language": languageConstants,
        "constant.language.boolean": booleanConstants,
        "variable.language": languageVariables,
        "keyword.operator": operatorKeywords,
        "keyword": keywords
    }, "identifier", true);

    this.$rules = {
        "start": [{
                token : "comment.line.double-dash",
                regex : /--.*$/
            }, {
                token : "string.quoted.double",
                regex : /"(?:%"|[^%])*?"/
            }, {
                token : "string.quoted.other", // "[ ]" aligned verbatim string
                regex : /"\[/,
                next: "aligned_verbatim_string"
            }, {
                token : "string.quoted.other", // "{ }" non-aligned verbatim string
                regex : /"\{/,
                next: "non-aligned_verbatim_string"
            }, {
                token : "constant.character",
                regex : /'(?:%%|%T|%R|%N|%F|%'|[^%])'/
            }, {
                token : "constant.numeric", // real
                regex : /(?:\d(?:_?\d)*\.|\.\d)(?:\d*[eE][+-]?\d+)?\b/
            }, {
                token : "constant.numeric", // integer
                regex : /\d(?:_?\d)*\b/
            }, {
                token : "constant.numeric", // hex
                regex : /0[xX][a-fA-F\d](?:_?[a-fA-F\d])*\b/
            }, {
                token : "constant.numeric", // octal
                regex : /0[cC][0-7](?:_?[0-7])*\b/
            },{
                token : "constant.numeric", // bin
                regex : /0[bB][01](?:_?[01])*\b/
            }, {
                token : "keyword.operator",
                regex : /\+|\-|\*|\/|\\\\|\/\/|\^|~|\/~|<|>|<=|>=|\/=|=|:=|\|\.\.\||\.\./
            }, {
                token : "keyword.operator", // punctuation
                regex : /\.|:|,|;\b/
            }, {
                token : function (v) {
                    var result = keywordMapper (v);
                    if (result === "identifier" && v === v.toUpperCase ()) {
                        result =  "entity.name.type";
                    }
                    return result;
                },
                regex : /[a-zA-Z][a-zA-Z\d_]*\b/
            }, {
                token : "paren.lparen",
                regex : /[\[({]/
            }, {
                token : "paren.rparen",
                regex : /[\])}]/
            }, {
                token : "text",
                regex : /\s+/
            }
        ],
        "aligned_verbatim_string" : [{
                token : "string", // closing multi-line comment
                regex : /]"/,
                next : "start"
            }, {
                token : "string", // comment spanning whole line
                regex : /[^(?:\]")]+/
            }
        ],
        "non-aligned_verbatim_string" : [{
                token : "string.quoted.other", // closing multi-line comment
                regex : /}"/,
                next : "start"
            }, {
                token : "string.quoted.other", // comment spanning whole line
                regex : /[^(?:\}")]+/
            }
        ]};
};

oop.inherits(EiffelHighlightRules, TextHighlightRules);

exports.EiffelHighlightRules = EiffelHighlightRules;
});
