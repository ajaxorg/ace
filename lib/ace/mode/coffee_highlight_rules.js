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

define(function(require, exports, module) {
"use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    oop.inherits(CoffeeHighlightRules, TextHighlightRules);

    function CoffeeHighlightRules() {
        var identifier = "[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*";
        var stringfill = {
            token : "string",
            regex : ".+"
        };

        var keywords = (
            "this|throw|then|try|typeof|super|switch|return|break|by|continue|" +
            "catch|class|in|instanceof|is|isnt|if|else|extends|for|forown|" +
            "finally|function|while|when|new|no|not|delete|debugger|do|loop|of|off|" +
            "or|on|unless|until|and|yes"
        );

        var langConstant = (
            "true|false|null|undefined|NaN|Infinity"
        );

        var illegal = (
            "case|const|default|function|var|void|with|enum|export|implements|" +
            "interface|let|package|private|protected|public|static|yield|" +
            "__hasProp|slice|bind|indexOf"
        );

        var supportClass = (
            "Array|Boolean|Date|Function|Number|Object|RegExp|ReferenceError|String|" +
            "Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|" +
            "SyntaxError|TypeError|URIError|"  +
            "ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|" +
            "Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray"
        );

        var supportFunction = (
            "Math|JSON|isNaN|isFinite|parseInt|parseFloat|encodeURI|" +
            "encodeURIComponent|decodeURI|decodeURIComponent|String|"
        );

        var variableLanguage = (
            "window|arguments|prototype|document"
        );

        var keywordMapper = this.createKeywordMapper({
            "keyword": keywords,
            "constant.language": langConstant,
            "invalid.illegal": illegal,
            "language.support.class": supportClass,
            "language.support.function": supportFunction,
            "variable.language": variableLanguage
        }, "identifier");

        var functionRules = {
            "({args})->": {
                token: ["paren.lparen", "text", "paren.lparen", "text", "variable.parameter", "text", "paren.rparen", "text", "paren.rparen", "text", "storage.type"],
                regex: "(\\()(\\s*)(\\{)(\\s*)([$@A-Za-z_\\x7f-\\uffff][$@\\w\\s,\\x7f-\\uffff]*)(\\s*)(\\})(\\s*)(\\))(\\s*)([\\-=]>)"
            },
            "({})->": {
                token: ["paren.lparen", "text", "paren.lparen", "text", "paren.rparen", "text", "paren.rparen", "text", "storage.type"],
                regex: "(\\()(\\s*)(\\{)(\\s*)(\\})(\\s*)(\\))(\\s*)([\\-=]>)"
            },
            "(args)->": {
                token: ["paren.lparen", "text", "variable.parameter", "text", "paren.rparen", "text", "storage.type"],
                regex: "(\\()(\\s*)([$@A-Za-z_\\x7f-\\uffff][\\s\\x21-\\uffff]*)(\\s*)(\\))(\\s*)([\\-=]>)"
            },
            "()->": {
                token: ["paren.lparen", "text", "paren.rparen", "text", "storage.type"],
                regex: "(\\()(\\s*)(\\))(\\s*)([\\-=]>)"
            }
        };

        this.$rules = {
            start : [
                {
                    token : "constant.numeric",
                    regex : "(?:0x[\\da-fA-F]+|(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:[eE][+-]?\\d+)?)"
                }, {
                    token : "string",
                    regex : "'''",
                    next : "qdoc"
                }, {
                    token : "string",
                    regex : '"""',
                    next : "qqdoc"
                }, {
                    token : "string",
                    regex : "'",
                    next : "qstring"
                }, {
                    token : "string",
                    regex : '"',
                    next : "qqstring"
                }, {
                    token : "string",
                    regex : "`",
                    next : "js"
                }, {
                    token : "string.regex",
                    regex : "///",
                    next : "heregex"
                }, {
                    token : "string.regex",
                    regex : /(?:\/(?![\s=])[^[\/\n\\]*(?:(?:\\[\s\S]|\[[^\]\n\\]*(?:\\[\s\S][^\]\n\\]*)*])[^[\/\n\\]*)*\/)(?:[imgy]{0,4})(?!\w)/
                }, {
                    token : "comment",
                    regex : "###(?!#)",
                    next : "comment"
                }, {
                    token : "comment",
                    regex : "#.*"
                }, {
                    token : [
                        "punctuation.operator", "identifier"
                    ],
                    regex : "(\\.)(" + illegal + ")"
                }, {
                    token : "punctuation.operator",
                    regex : "\\."
                }, {
                    //class A extends B
                    token : [
                        "keyword", "text", "language.support.class", "text", "keyword", "text", "language.support.class"
                    ],
                    regex : "(class)(\\s+)(" + identifier + ")(\\s+)(extends)(\\s+)(" + identifier + ")"
                }, {
                    //class A
                    token : [
                        "keyword", "text", "language.support.class"
                    ],
                    regex : "(class)(\\s+)(" + identifier + ")"
                }, {
                    //play = ({args}) ->
                    token : [
                        "entity.name.function", "text", "keyword.operator", "text"
                    ].concat(functionRules["({args})->"].token),
                    regex : "(" + identifier + ")(\\s*)(=)(\\s*)" + functionRules["({args})->"].regex
                }, {
                    //play : ({args}) ->
                    token : [
                        "entity.name.function", "text", "punctuation.operator", "text"
                    ].concat(functionRules["({args})->"].token),
                    regex : "(" + identifier + ")(\\s*)(:)(\\s*)" + functionRules["({args})->"].regex
                }, {
                    //play = ({}) ->
                    token : [
                        "entity.name.function", "text", "keyword.operator", "text"
                    ].concat(functionRules["({})->"].token),
                    regex : "(" + identifier + ")(\\s*)(=)(\\s*)" + functionRules["({})->"].regex
                }, {
                    //play : ({}) ->
                    token : [
                        "entity.name.function", "text", "punctuation.operator", "text"
                    ].concat(functionRules["({})->"].token),
                    regex : "(" + identifier + ")(\\s*)(:)(\\s*)" + functionRules["({})->"].regex
                }, {
                    //play = (args) ->
                    token : [
                        "entity.name.function", "text", "keyword.operator", "text"
                    ].concat(functionRules["(args)->"].token),
                    regex : "(" + identifier + ")(\\s*)(=)(\\s*)" + functionRules["(args)->"].regex
                }, {
                    //play : (args) ->
                    token : [
                        "entity.name.function", "text", "punctuation.operator", "text"
                    ].concat(functionRules["(args)->"].token),
                    regex : "(" + identifier + ")(\\s*)(:)(\\s*)" + functionRules["(args)->"].regex
                }, {
                    //play = () ->
                    token : [
                        "entity.name.function", "text", "keyword.operator", "text"
                    ].concat(functionRules["()->"].token),
                    regex : "(" + identifier + ")(\\s*)(=)(\\s*)" + functionRules["()->"].regex
                }, {
                    //play : () ->
                    token : [
                        "entity.name.function", "text", "punctuation.operator", "text"
                    ].concat(functionRules["()->"].token),
                    regex : "(" + identifier + ")(\\s*)(:)(\\s*)" + functionRules["()->"].regex
                }, {
                    //play = ->
                    token : [
                        "entity.name.function", "text", "keyword.operator", "text", "storage.type"
                    ],
                    regex : "(" + identifier + ")(\\s*)(=)(\\s*)([\\-=]>)"
                }, {
                    //play : ->
                    token : [
                        "entity.name.function", "text", "punctuation.operator", "text", "storage.type"
                    ],
                    regex : "(" + identifier + ")(\\s*)(:)(\\s*)([\\-=]>)"
                }, 
                functionRules["({args})->"],
                functionRules["({})->"],
                functionRules["(args)->"],
                functionRules["()->"]
                , {
                    token : "identifier",
                    regex : "(?:(?:\\.|::)\\s*)" + identifier
                }, {
                    token : "variable",
                    regex : "@(?:" + identifier + ")?"
                }, {
                    token: keywordMapper,
                    regex : identifier
                }, {
                    token : "punctuation.operator",
                    regex : "\\?|\\:|\\,|\\."
                }, {
                    token : "storage.type",
                    regex : "[\\-=]>"
                }, {
                    token : "keyword.operator",
                    regex : "(?:[-+*/%<>&|^!?=]=|>>>=?|\\-\\-|\\+\\+|::|&&=|\\|\\|=|<<=|>>=|\\?\\.|\\.{2,3}|[!*+-=><])"
                }, {
                    token : "paren.lparen",
                    regex : "[({[]"
                }, {
                    token : "paren.rparen",
                    regex : "[\\]})]"
                }, {
                    token : "text",
                    regex : "\\s+"
                }],

            qdoc : [{
                token : "string",
                regex : ".*?'''",
                next : "start"
            }, stringfill],

            qqdoc : [{
                token : "string",
                regex : '.*?"""',
                next : "start"
            }, stringfill],

            qstring : [{
                token : "string",
                regex : "[^\\\\']*(?:\\\\.[^\\\\']*)*'",
                next : "start"
            }, stringfill],

            qqstring : [{
                token : "string",
                regex : '[^\\\\"]*(?:\\\\.[^\\\\"]*)*"',
                next : "start"
            }, stringfill],

            js : [{
                token : "string",
                regex : "[^\\\\`]*(?:\\\\.[^\\\\`]*)*`",
                next : "start"
            }, stringfill],

            heregex : [{
                token : "string.regex",
                regex : '.*?///[imgy]{0,4}',
                next : "start"
            }, {
                token : "comment.regex",
                regex : "\\s+(?:#.*)?"
            }, {
                token : "string.regex",
                regex : "\\S+"
            }],

            comment : [{
                token : "comment",
                regex : '.*?###',
                next : "start"
            }, {
                token : "comment",
                regex : ".+"
            }]
        };
    }

    exports.CoffeeHighlightRules = CoffeeHighlightRules;
});
