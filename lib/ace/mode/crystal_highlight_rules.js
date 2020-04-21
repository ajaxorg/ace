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

define(function (require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var CrystalHighlightRules = function () {

        var builtinFunctions = (
            "puts|initialize|previous_def|typeof|as|pointerof|sizeof|instance_sizeof"
        );

        var keywords = (
            "if|end|else|elsif|unless|case|when|break|while|next|until|def|return|class|new|getter|setter|property|lib"
            + "|fun|do|struct|private|protected|public|module|super|abstract|include|extend|begin|enum|raise|yield|with"
            + "|alias|rescue|ensure|macro|uninitialized|union|type|require"
        );

        var buildinConstants = (
            "true|TRUE|false|FALSE|nil|NIL|__LINE__|__END_LINE__|__FILE__|__DIR__"
        );

        var builtinVariables = (
            "$DEBUG|$defout|$FILENAME|$LOAD_PATH|$SAFE|$stdin|$stdout|$stderr|$VERBOSE|" +
            "root_url|flash|session|cookies|params|request|response|logger|self"
        );

        var keywordMapper = this.$keywords = this.createKeywordMapper({
            "keyword": keywords,
            "constant.language": buildinConstants,
            "variable.language": builtinVariables,
            "support.function": builtinFunctions
        }, "identifier");

        var hexNumber = "(?:0[xX][\\dA-Fa-f]+)";
        var decNumber = "(?:[0-9][\\d_]*)";
        var octNumber = "(?:0o[0-7][0-7]*)";
        var binNumber = "(?:0[bB][01]+)";
        var intNumber = "(?:[+-]?)(?:" + hexNumber + "|" + decNumber + "|" + octNumber + "|" + binNumber + ")(?:_?[iIuU](?:8|16|32|64))?\\b";
        var escapeExpression = /\\(?:[nsrtvfbae'"\\]|[0-7]{3}|x[\da-fA-F]{2}|u[\da-fA-F]{4}|u{[\da-fA-F]{1,6}})/;
        var extEscapeExspresssion = /\\(?:[nsrtvfbae'"\\]|[0-7]{3}|x[\da-fA-F]{2}|u[\da-fA-F]{4}|u{[\da-fA-F]{1,6}}|u{(:?[\da-fA-F]{2}\s)*[\da-fA-F]{2}})/;
        // regexp must not have capturing parentheses. Use (?:) instead.
        // regexps are ordered -> the first match is used

        this.$rules = {
            "start": [
                {
                    token: "comment",
                    regex: "#.*$"
                }, {
                    token: "string.regexp",
                    regex: "[/]",
                    push: [{
                        token: "constant.language.escape",
                        regex: extEscapeExspresssion
                    }, {
                        token: "string.regexp",
                        regex: "[/][imx]*(?=[).,;\\s]|$)",
                        next: "pop"
                    }, {
                        defaultToken: "string.regexp"
                    }]
                },
                [{
                    regex: "[{}]", onMatch: function (val, state, stack) {
                        this.next = val == "{" ? this.nextState : "";
                        if (val == "{" && stack.length) {
                            stack.unshift("start", state);
                            return "paren.lparen";
                        }
                        if (val == "}" && stack.length) {
                            stack.shift();
                            this.next = stack.shift();
                            if (this.next.indexOf("string") != -1)
                                return "paren.end";
                        }
                        return val == "{" ? "paren.lparen" : "paren.rparen";
                    },
                    nextState: "start"
                }, {
                    token: "string.start",
                    regex: /"/,
                    push: [{
                        token: "constant.language.escape",
                        regex: extEscapeExspresssion
                    }, {
                        token: "string",
                        regex: /\\#{/
                    }, {
                        token: "paren.start",
                        regex: /#{/,
                        push: "start"
                    }, {
                        token: "string.end",
                        regex: /"/,
                        next: "pop"
                    }, {
                        defaultToken: "string"
                    }]
                }, {
                    token: "string.start",
                    regex: /`/,
                    push: [{
                        token: "constant.language.escape",
                        regex: extEscapeExspresssion
                    }, {
                        token: "string",
                        regex: /\\#{/
                    }, {
                        token: "paren.start",
                        regex: /#{/,
                        push: "start"
                    }, {
                        token: "string.end",
                        regex: /`/,
                        next: "pop"
                    }, {
                        defaultToken: "string"
                    }]
                }, {
                    stateName: "rpstring",
                    token: "string.start",
                    regex: /%[Qx]?\(/,
                    push: [{
                        token: "constant.language.escape",
                        regex: extEscapeExspresssion
                    }, {
                        token: "string.start",
                        regex: /\(/,
                        push: "rpstring"
                    }, {
                        token: "string.end",
                        regex: /\)/,
                        next: "pop"
                    }, {
                        token: "paren.start",
                        regex: /#{/,
                        push: "start"
                    }, {
                        defaultToken: "string"
                    }]
                }, {
                    stateName: "spstring",
                    token: "string.start",
                    regex: /%[Qx]?\[/,
                    push: [{
                        token: "constant.language.escape",
                        regex: extEscapeExspresssion
                    }, {
                        token: "string.start",
                        regex: /\[/,
                        push: "spstring"
                    }, {
                        token: "string.end",
                        regex: /]/,
                        next: "pop"
                    }, {
                        token: "paren.start",
                        regex: /#{/,
                        push: "start"
                    }, {
                        defaultToken: "string"
                    }]
                }, {
                    stateName: "fpstring",
                    token: "string.start",
                    regex: /%[Qx]?{/,
                    push: [{
                        token: "constant.language.escape",
                        regex: extEscapeExspresssion
                    }, {
                        token: "string.start",
                        regex: /{/,
                        push: "fpstring"
                    }, {
                        token: "string.end",
                        regex: /}/,
                        next: "pop"
                    }, {
                        token: "paren.start",
                        regex: /#{/,
                        push: "start"
                    }, {
                        defaultToken: "string"
                    }]
                }, {
                    stateName: "tpstring",
                    token: "string.start",
                    regex: /%[Qx]?</,
                    push: [{
                        token: "constant.language.escape",
                        regex: extEscapeExspresssion
                    }, {
                        token: "string.start",
                        regex: /</,
                        push: "tpstring"
                    }, {
                        token: "string.end",
                        regex: />/,
                        next: "pop"
                    }, {
                        token: "paren.start",
                        regex: /#{/,
                        push: "start"
                    }, {
                        defaultToken: "string"
                    }]
                }, {
                    stateName: "ppstring",
                    token: "string.start",
                    regex: /%[Qx]?\|/,
                    push: [{
                        token: "constant.language.escape",
                        regex: extEscapeExspresssion
                    }, {
                        token: "string.end",
                        regex: /\|/,
                        next: "pop"
                    }, {
                        token: "paren.start",
                        regex: /#{/,
                        push: "start"
                    }, {
                        defaultToken: "string"
                    }]
                }, {
                    stateName: "rpqstring",
                    token: "string.start",
                    regex: /%[qwir]\(/,
                    push: [{
                        token: "string.start",
                        regex: /\(/,
                        push: "rpqstring"
                    }, {
                        token: "string.end",
                        regex: /\)/,
                        next: "pop"
                    }, {
                        defaultToken: "string"
                    }]
                }, {
                    stateName: "spqstring",
                    token: "string.start",
                    regex: /%[qwir]\[/,
                    push: [{
                        token: "string.start",
                        regex: /\[/,
                        push: "spqstring"
                    }, {
                        token: "string.end",
                        regex: /]/,
                        next: "pop"
                    }, {
                        defaultToken: "string"
                    }]
                }, {
                    stateName: "fpqstring",
                    token: "string.start",
                    regex: /%[qwir]{/,
                    push: [{
                        token: "string.start",
                        regex: /{/,
                        push: "fpqstring"
                    }, {
                        token: "string.end",
                        regex: /}/,
                        next: "pop"
                    }, {
                        defaultToken: "string"
                    }]
                }, {
                    stateName: "tpqstring",
                    token: "string.start",
                    regex: /%[qwir]</,
                    push: [{
                        token: "string.start",
                        regex: /</,
                        push: "tpqstring"
                    }, {
                        token: "string.end",
                        regex: />/,
                        next: "pop"
                    }, {
                        defaultToken: "string"
                    }]
                }, {
                    stateName: "ppqstring",
                    token: "string.start",
                    regex: /%[qwir]\|/,
                    push: [{
                        token: "string.end",
                        regex: /\|/,
                        next: "pop"
                    }, {
                        defaultToken: "string"
                    }]
                }, {
                    token: "string.start",
                    regex: /'/,
                    push: [{
                        token: "constant.language.escape",
                        regex: escapeExpression
                    }, {
                        token: "string.end",
                        regex: /'|$/,
                        next: "pop"
                    }, {
                        defaultToken: "string"
                    }]
                }], {
                    token: "text", // namespaces aren't symbols
                    regex: "::"
                }, {
                    token: "variable.instance", // instance variable
                    regex: "@{1,2}[a-zA-Z_\\d]+"
                }, {
                    token: "variable.fresh", // fresh variable
                    regex: "%[a-zA-Z_\\d]+"
                }, {
                    token: "support.class", // class name
                    regex: "[A-Z][a-zA-Z_\\d]+"
                }, {
                    token: "constant.other.symbol", // symbol
                    regex: "[:](?:(?:===|<=>|\\[]\\?|\\[]=|\\[]|>>|\\*\\*|<<|==|!=|>=|<=|!~|=~|<|\\+|-|\\*|\\/|%|&|\\||\\^|>|!|~)|(?:(?:[A-Za-z_]|[@$](?=[a-zA-Z0-9_]))[a-zA-Z0-9_]*[!=?]?))"
                }, {
                    token: "constant.numeric", // float
                    regex: "[+-]?\\d(?:\\d|_(?=\\d))*(?:(?:\\.\\d(?:\\d|_(?=\\d))*)?(?:[eE][+-]?\\d+)?)?(?:_?[fF](?:32|64))?\\b"
                }, {
                    token: "constant.numeric",
                    regex: intNumber
                }, {
                    token: "constant.other.symbol",
                    regex: ':"',
                    push: [{
                        token: "constant.language.escape",
                        regex: extEscapeExspresssion
                    }, {
                        token: "constant.other.symbol",
                        regex: '"',
                        next: "pop"
                    }, {
                        defaultToken: "constant.other.symbol"
                    }]
                }, {
                    token: "constant.language.boolean",
                    regex: "(?:true|false)\\b"
                }, {
                    token: "support.function",
                    regex: "(?:is_a\\?|nil\\?|responds_to\\?|as\\?)"
                }, {
                    token: keywordMapper,
                    regex: "[a-zA-Z_$][a-zA-Z0-9_$!?]*\\b"
                }, {
                    token: "variable.system",
                    regex: "\\$\\!|\\$\\?"
                }, {
                    token: "punctuation.separator.key-value",
                    regex: "=>"
                }, {
                    stateName: "heredoc",
                    onMatch: function (value, currentState, stack) {
                        var next = "heredoc";
                        var tokens = value.split(this.splitRegex);
                        stack.push(next, tokens[3]);
                        return [
                            {type: "constant", value: tokens[1]},
                            {type: "string", value: tokens[2]},
                            {type: "support.class", value: tokens[3]},
                            {type: "string", value: tokens[4]}
                        ];
                    },
                    regex: "(<<-)([']?)([\\w]+)([']?)",
                    rules: {
                        heredoc: [{
                            token: "string",
                            regex: "^ +"
                        }, {
                            onMatch: function (value, currentState, stack) {
                                if (value === stack[1]) {
                                    stack.shift();
                                    stack.shift();
                                    this.next = stack[0] || "start";
                                    return "support.class";
                                }
                                this.next = "";
                                return "string";
                            },
                            regex: ".*$",
                            next: "start"
                        }]
                    }
                }, {
                    regex: "$",
                    token: "empty",
                    next: function (currentState, stack) {
                        if (stack[0] === "heredoc")
                            return stack[0];
                        return currentState;
                    }
                }, {
                    token: "punctuation.operator",
                    regex: /[.]\s*(?![.])/,
                    push: [{
                        token : "punctuation.operator",
                        regex : /[.]\s*(?![.])/
                    }, {
                        token : "support.function",
                        regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
                    }, {
                        regex: "",
                        token: "empty",
                        next: "pop"
                    }]
                }, {
                    token: "keyword.operator",
                    regex: "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|\\?|\\:|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\^|\\|"
                }, {
                    token: "punctuation.operator",
                    regex: /[?:,;.]/
                }, {
                    token: "paren.lparen",
                    regex: "[[({]"
                }, {
                    token: "paren.rparen",
                    regex: "[\\])}]"
                }, {
                    token: "text",
                    regex: "\\s+"
                }
            ]
        };

        this.normalizeRules();
    };

    oop.inherits(CrystalHighlightRules, TextHighlightRules);

    exports.CrystalHighlightRules = CrystalHighlightRules;
});
