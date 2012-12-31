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

var LuaHighlightRules = function() {

    var keywords = (
        "break|do|else|elseif|end|for|function|if|in|local|repeat|"+
         "return|then|until|while|or|and|not"
    );

    var builtinConstants = ("true|false|nil|_G|_VERSION");

    var functions = (
      // builtinFunctions
        "string|xpcall|package|tostring|print|os|unpack|require|"+
        "getfenv|setmetatable|next|assert|tonumber|io|rawequal|"+
        "collectgarbage|getmetatable|module|rawset|math|debug|"+
        "pcall|table|newproxy|type|coroutine|_G|select|gcinfo|"+
        "pairs|rawget|loadstring|ipairs|_VERSION|dofile|setfenv|"+
        "load|error|loadfile|"+

        "sub|upper|len|gfind|rep|find|match|char|dump|gmatch|"+
        "reverse|byte|format|gsub|lower|preload|loadlib|loaded|"+
        "loaders|cpath|config|path|seeall|exit|setlocale|date|"+
        "getenv|difftime|remove|time|clock|tmpname|rename|execute|"+
        "lines|write|close|flush|open|output|type|read|stderr|"+
        "stdin|input|stdout|popen|tmpfile|log|max|acos|huge|"+
        "ldexp|pi|cos|tanh|pow|deg|tan|cosh|sinh|random|randomseed|"+
        "frexp|ceil|floor|rad|abs|sqrt|modf|asin|min|mod|fmod|log10|"+
        "atan2|exp|sin|atan|getupvalue|debug|sethook|getmetatable|"+
        "gethook|setmetatable|setlocal|traceback|setfenv|getinfo|"+
        "setupvalue|getlocal|getregistry|getfenv|setn|insert|getn|"+
        "foreachi|maxn|foreach|concat|sort|remove|resume|yield|"+
        "status|wrap|create|running|"+
      // metatableMethods
        "__add|__sub|__mod|__unm|__concat|__lt|__index|__call|__gc|__metatable|"+
         "__mul|__div|__pow|__len|__eq|__le|__newindex|__tostring|__mode|__tonumber"
    );

    var stdLibaries = ("string|package|os|io|math|debug|table|coroutine");

    var futureReserved = "";

    var deprecatedIn5152 = ("setn|foreach|foreachi|gcinfo|log10|maxn");

    var keywordMapper = this.createKeywordMapper({
        "keyword": keywords,
        "support.function": functions,
        "invalid.deprecated": deprecatedIn5152,
        "constant.library": stdLibaries,
        "constant.language": builtinConstants,
        "invalid.illegal": futureReserved,
        "variable.language": "this"
    }, "identifier");

    var strPre = "";

    var decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
    var hexInteger = "(?:0[xX][\\dA-Fa-f]+)";
    var integer = "(?:" + decimalInteger + "|" + hexInteger + ")";

    var fraction = "(?:\\.\\d+)";
    var intPart = "(?:\\d+)";
    var pointFloat = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
    var floatNumber = "(?:" + pointFloat + ")";

    var comment_stack = [];

    this.$rules = {
        "start" :


        // bracketed comments
        [{
            token : "comment",           // --[[ comment
            regex : strPre + '\\-\\-\\[\\[.*\\]\\]'
        }, {
            token : "comment",           // --[=[ comment
            regex : strPre + '\\-\\-\\[\\=\\[.*\\]\\=\\]'
        }, {
            token : "comment",           // --[==[ comment
            regex : strPre + '\\-\\-\\[\\={2}\\[.*\\]\\={2}\\]'
        }, {
            token : "comment",           // --[===[ comment
            regex : strPre + '\\-\\-\\[\\={3}\\[.*\\]\\={3}\\]'
        }, {
            token : "comment",           // --[====[ comment
            regex : strPre + '\\-\\-\\[\\={4}\\[.*\\]\\={4}\\]'
        }, {
            token : "comment",           // --[====+[ comment
            regex : strPre + '\\-\\-\\[\\={5}\\=*\\[.*\\]\\={5}\\=*\\]'
        },

        // multiline bracketed comments
        {
            token : "comment",           // --[[ comment
            regex : strPre + '\\-\\-\\[\\[.*$',
            next  : "qcomment"
        }, {
            token : "comment",           // --[=[ comment
            regex : strPre + '\\-\\-\\[\\=\\[.*$',
            next  : "qcomment1"
        }, {
            token : "comment",           // --[==[ comment
            regex : strPre + '\\-\\-\\[\\={2}\\[.*$',
            next  : "qcomment2"
        }, {
            token : "comment",           // --[===[ comment
            regex : strPre + '\\-\\-\\[\\={3}\\[.*$',
            next  : "qcomment3"
        }, {
            token : "comment",           // --[====[ comment
            regex : strPre + '\\-\\-\\[\\={4}\\[.*$',
            next  : "qcomment4"
        }, {
            token : function(value){     // --[====+[ comment
                // WARNING: EXTREMELY SLOW, but this is the only way to circumvent the
                // limits imposed by the current automaton.
                // I've never personally seen any practical code where 5 or more '='s are
                // used for string or commenting, so this will rarely be invoked.
                var pattern = /\-\-\[(\=+)\[/, match;
                // you can never be too paranoid ;)
                if ((match = pattern.exec(value)) != null && (match = match[1]) != undefined)
                    comment_stack.push(match.length);

                return "comment";
            },
            regex : strPre + '\\-\\-\\[\\={5}\\=*\\[.*$',
            next  : "qcomment5"
        },

        // single line comments
        {
            token : "comment",
            regex : "\\-\\-.*$"
        },

        // bracketed strings
        {
            token : "string",           // [[ string
            regex : strPre + '\\[\\[.*\\]\\]'
        }, {
            token : "string",           // [=[ string
            regex : strPre + '\\[\\=\\[.*\\]\\=\\]'
        }, {
            token : "string",           // [==[ string
            regex : strPre + '\\[\\={2}\\[.*\\]\\={2}\\]'
        }, {
            token : "string",           // [===[ string
            regex : strPre + '\\[\\={3}\\[.*\\]\\={3}\\]'
        }, {
            token : "string",           // [====[ string
            regex : strPre + '\\[\\={4}\\[.*\\]\\={4}\\]'
        }, {
            token : "string",           // [====+[ string
            regex : strPre + '\\[\\={5}\\=*\\[.*\\]\\={5}\\=*\\]'
        },

        // multiline bracketed strings
        {
            token : "string",           // [[ string
            regex : strPre + '\\[\\[.*$',
            next  : "qstring"
        }, {
            token : "string",           // [=[ string
            regex : strPre + '\\[\\=\\[.*$',
            next  : "qstring1"
        }, {
            token : "string",           // [==[ string
            regex : strPre + '\\[\\={2}\\[.*$',
            next  : "qstring2"
        }, {
            token : "string",           // [===[ string
            regex : strPre + '\\[\\={3}\\[.*$',
            next  : "qstring3"
        }, {
            token : "string",           // [====[ string
            regex : strPre + '\\[\\={4}\\[.*$',
            next  : "qstring4"
        }, {
            token : function(value){     // --[====+[ string
                // WARNING: EXTREMELY SLOW, see above.
                var pattern = /\[(\=+)\[/, match;
                if ((match = pattern.exec(value)) != null && (match = match[1]) != undefined)
                    comment_stack.push(match.length);

                return "string";
            },
            regex : strPre + '\\[\\={5}\\=*\\[.*$',
            next  : "qstring5"
        },

        {
            token : "string",           // " string
            regex : strPre + '"(?:[^\\\\]|\\\\.)*?"'
        }, {
            token : "string",           // ' string
            regex : strPre + "'(?:[^\\\\]|\\\\.)*?'"
        }, {
            token : "constant.numeric", // float
            regex : floatNumber
        }, {
            token : "constant.numeric", // integer
            regex : integer + "\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "\\+|\\-|\\*|\\/|%|\\#|\\^|~|<|>|<=|=>|==|~=|=|\\:|\\.\\.\\.|\\.\\."
        }, {
            token : "paren.lparen",
            regex : "[\\[\\(\\{]"
        }, {
            token : "paren.rparen",
            regex : "[\\]\\)\\}]"
        }, {
            token : "text",
            regex : "\\s+"
        } ],

        "qcomment": [ {
            token : "comment",
            regex : "(?:[^\\\\]|\\\\.)*?\\]\\]",
            next  : "start"
        }, {
            token : "comment",
            regex : '.+'
        } ],
        "qcomment1": [ {
            token : "comment",
            regex : "(?:[^\\\\]|\\\\.)*?\\]\\=\\]",
            next  : "start"
        }, {
            token : "comment",
            regex : '.+'
        } ],
        "qcomment2": [ {
            token : "comment",
            regex : "(?:[^\\\\]|\\\\.)*?\\]\\={2}\\]",
            next  : "start"
        }, {
            token : "comment",
            regex : '.+'
        } ],
        "qcomment3": [ {
            token : "comment",
            regex : "(?:[^\\\\]|\\\\.)*?\\]\\={3}\\]",
            next  : "start"
        }, {
            token : "comment",
            regex : '.+'
        } ],
        "qcomment4": [ {
            token : "comment",
            regex : "(?:[^\\\\]|\\\\.)*?\\]\\={4}\\]",
            next  : "start"
        }, {
            token : "comment",
            regex : '.+'
        } ],
        "qcomment5": [ {
            token : function(value){
                // very hackish, mutates the qcomment5 field on the fly.
                var pattern = /\](\=+)\]/, rule = this.rules.qcomment5[0], match;
                rule.next = "start";
                if ((match = pattern.exec(value)) != null && (match = match[1]) != undefined){
                    var found = match.length, expected;
                    if ((expected = comment_stack.pop()) != found){
                        comment_stack.push(expected);
                        rule.next = "qcomment5";
                    }
                }

                return "comment";
            },
            regex : "(?:[^\\\\]|\\\\.)*?\\]\\={5}\\=*\\]",
            next  : "start"
        }, {
            token : "comment",
            regex : '.+'
        } ],

        "qstring": [ {
            token : "string",
            regex : "(?:[^\\\\]|\\\\.)*?\\]\\]",
            next  : "start"
        }, {
            token : "string",
            regex : '.+'
        } ],
        "qstring1": [ {
            token : "string",
            regex : "(?:[^\\\\]|\\\\.)*?\\]\\=\\]",
            next  : "start"
        }, {
            token : "string",
            regex : '.+'
        } ],
        "qstring2": [ {
            token : "string",
            regex : "(?:[^\\\\]|\\\\.)*?\\]\\={2}\\]",
            next  : "start"
        }, {
            token : "string",
            regex : '.+'
        } ],
        "qstring3": [ {
            token : "string",
            regex : "(?:[^\\\\]|\\\\.)*?\\]\\={3}\\]",
            next  : "start"
        }, {
            token : "string",
            regex : '.+'
        } ],
        "qstring4": [ {
            token : "string",
            regex : "(?:[^\\\\]|\\\\.)*?\\]\\={4}\\]",
            next  : "start"
        }, {
            token : "string",
            regex : '.+'
        } ],
        "qstring5": [ {
            token : function(value){
                // very hackish, mutates the qstring5 field on the fly.
                var pattern = /\](\=+)\]/, rule = this.rules.qstring5[0], match;
                rule.next = "start";
                if ((match = pattern.exec(value)) != null && (match = match[1]) != undefined){
                    var found = match.length, expected;
                    if ((expected = comment_stack.pop()) != found){
                        comment_stack.push(expected);
                        rule.next = "qstring5";
                    }
                }

                return "string";
            },
            regex : "(?:[^\\\\]|\\\\.)*?\\]\\={5}\\=*\\]",
            next  : "start"
        }, {
            token : "string",
            regex : '.+'
        } ]

    };

}

oop.inherits(LuaHighlightRules, TextHighlightRules);

exports.LuaHighlightRules = LuaHighlightRules;
});
