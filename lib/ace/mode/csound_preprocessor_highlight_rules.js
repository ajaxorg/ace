define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");

var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var CsoundPreprocessorHighlightRules = function(embeddedRulePrefix) {

    this.embeddedRulePrefix = embeddedRulePrefix === undefined ? "" : embeddedRulePrefix;

    this.semicolonComments = {
        token : "comment.line.semicolon.csound",
        regex : ";.*$"
    };

    this.comments = [
        {
            token : "punctuation.definition.comment.begin.csound",
            regex : "/\\*",
            push  : [
                {
                    token : "punctuation.definition.comment.end.csound",
                    regex : "\\*/",
                    next  : "pop"
                }, {
                    defaultToken: "comment.block.csound"
                }
            ]
        }, {
            token : "comment.line.double-slash.csound",
            regex : "//.*$"
        },
        this.semicolonComments
    ];

    this.macroUses = [
        {
            token : ["entity.name.function.preprocessor.csound", "punctuation.definition.macro-parameter-value-list.begin.csound"],
            regex : /(\$[A-Z_a-z]\w*\.?)(\()/,
            next  : "macro parameter value list"
        }, {
            token : "entity.name.function.preprocessor.csound",
            regex : /\$[A-Z_a-z]\w*(?:\.|\b)/
        }
    ];

    this.numbers = [
        {
            token : "constant.numeric.float.csound",
            regex : /(?:\d+[Ee][+-]?\d+)|(?:\d+\.\d*|\d*\.\d+)(?:[Ee][+-]?\d+)?/
        }, {
            token : ["storage.type.number.csound", "constant.numeric.integer.hexadecimal.csound"],
            regex : /(0[Xx])([0-9A-Fa-f]+)/
        }, {
            token : "constant.numeric.integer.decimal.csound",
            regex : /\d+/
        }
    ];

    this.bracedStringContents = [
        {
            token : "constant.character.escape.csound",
            // https://github.com/csound/csound/search?q=unquote_string+path%3AEngine+filename%3Acsound_orc_compile.c
            regex : /\\(?:[\\abnrt"]|[0-7]{1,3})/
        },
        // Format specifiers are included in quoted and braced strings. This
        // means that format specifiers are highlighted in all strings, even
        // though only
        //   fprintks        https://csound.com/docs/manual/fprintks.html
        //   fprints         https://csound.com/docs/manual/fprints.html
        //   printf/printf_i https://csound.com/docs/manual/printf.html
        //   printks         https://csound.com/docs/manual/printks.html
        //   prints          https://csound.com/docs/manual/prints.html
        //   sprintf         https://csound.com/docs/manual/sprintf.html
        //   sprintfk        https://csound.com/docs/manual/sprintfk.html
        // work with strings that contain format specifiers. In addition, these
        // opcodes’ handling of format specifiers is inconsistent:
        //   - fprintks, fprints, printks, and prints do accept %a and %A
        //     specifiers, but can’t accept %s specifiers.
        //   - printf, printf_i, sprintf, and sprintfk don’t accept %a and %A
        //     specifiers, but do accept %s specifiers.
        // See https://github.com/csound/csound/issues/747 for more information.
        {
            token : "constant.character.placeholder.csound",
            regex : /%[#0\- +]*\d*(?:\.\d+)?[diuoxXfFeEgGaAcs]/
        }, {
            token : "constant.character.escape.csound",
            regex : /%%/
        }
    ];

    this.quotedStringContents = [
        this.macroUses,
        this.bracedStringContents
    ];

    var start = [
        this.comments,

        {
            token : "keyword.preprocessor.csound",
            regex : /#(?:e(?:nd(?:if)?|lse)\b|##)|@@?[ \t]*\d+/
        }, {
            token : "keyword.preprocessor.csound",
            regex : /#include/,
            push  : [
                this.comments,
                {
                    token : "string.csound",
                    regex : /([^ \t])(?:.*?\1)/,
                    next  : "pop"
                }
            ]
        }, {
            token : "keyword.preprocessor.csound",
            regex : /#includestr/,
            push  : [
                this.comments,
                {
                    token : "string.csound",
                    regex : /([^ \t])(?:.*?\1)/,
                    next  : "pop"
                }
            ]
        }, {
            token : "keyword.preprocessor.csound",
            regex : /#[ \t]*define/,
            next  : "define directive"
        }, {
            token : "keyword.preprocessor.csound",
            regex : /#(?:ifn?def|undef)\b/,
            next  : "macro directive"
        },

        this.macroUses
    ];

    this.$rules = {
        "start": start,

        "define directive": [
            this.comments,
            {
                token : "entity.name.function.preprocessor.csound",
                regex : /[A-Z_a-z]\w*/
            }, {
                token : "punctuation.definition.macro-parameter-name-list.begin.csound",
                regex : /\(/,
                next  : "macro parameter name list"
            }, {
                token : "punctuation.definition.macro.begin.csound",
                regex : /#/,
                next  : "macro body"
            }
        ],
        "macro parameter name list": [
            {
                token : "variable.parameter.preprocessor.csound",
                regex : /[A-Z_a-z]\w*/
            }, {
                token : "punctuation.definition.macro-parameter-name-list.end.csound",
                regex : /\)/,
                next  : "define directive"
            }
        ],
        "macro body": [
            {
                token : "constant.character.escape.csound",
                regex : /\\#/
            }, {
                token : "punctuation.definition.macro.end.csound",
                regex : /#/,
                next  : "start"
            },
            start
        ],

        "macro directive": [
            this.comments,
            {
                token : "entity.name.function.preprocessor.csound",
                regex : /[A-Z_a-z]\w*/,
                next  : "start"
            }
        ],

        "macro parameter value list": [
            {
                token : "punctuation.definition.macro-parameter-value-list.end.csound",
                regex : /\)/,
                next  : "start"
            }, {
                token : "punctuation.definition.string.begin.csound",
                regex : /"/,
                next  : "macro parameter value quoted string"
            }, this.pushRule({
                token : "punctuation.macro-parameter-value-parenthetical.begin.csound",
                regex : /\(/,
                next  : "macro parameter value parenthetical"
            }), {
                token : "punctuation.macro-parameter-value-separator.csound",
                regex : "[#']"
            }
        ],
        "macro parameter value quoted string": [
            {
                token : "constant.character.escape.csound",
                regex : /\\[#'()]/
            }, {
                token : "invalid.illegal.csound",
                regex : /[#'()]/
            }, {
                token : "punctuation.definition.string.end.csound",
                regex : /"/,
                next  : "macro parameter value list"
            },
            this.quotedStringContents,
            {
                defaultToken: "string.quoted.csound"
            }
        ],
        "macro parameter value parenthetical": [
            {
                token : "constant.character.escape.csound",
                regex : /\\\)/
            }, this.popRule({
                token : "punctuation.macro-parameter-value-parenthetical.end.csound",
                regex : /\)/
            }), this.pushRule({
                token : "punctuation.macro-parameter-value-parenthetical.begin.csound",
                regex : /\(/,
                next  : "macro parameter value parenthetical"
            }),
            start
        ]
    };
};

oop.inherits(CsoundPreprocessorHighlightRules, TextHighlightRules);

(function() {

    this.pushRule = function(params) {
        if (Array.isArray(params.next)) {
            for (var i = 0; i < params.next.length; i++) {
                params.next[i] = this.embeddedRulePrefix + params.next[i];
            }
        }

        return {
            regex : params.regex, onMatch: function(value, currentState, stack, line) {
                if (stack.length === 0)
                    stack.push(currentState);
                if (Array.isArray(params.next)) {
                    for (var i = 0; i < params.next.length; i++) {
                        stack.push(params.next[i]);
                    }
                } else {
                    stack.push(params.next);
                }
                this.next = stack[stack.length - 1];
                return params.token;
            },

            get next() { return Array.isArray(params.next) ? params.next[params.next.length - 1] : params.next; },
            set next(next) {
                if (!Array.isArray(params.next)) {
                    params.next = next;
                }
            },

            get token() { return params.token; }
        };
    };

    this.popRule = function(params) {
        if (params.next) {
            params.next = this.embeddedRulePrefix + params.next;
        }

        return {
            regex : params.regex, onMatch: function(value, currentState, stack, line) {
                stack.pop();
                if (params.next) {
                    stack.push(params.next);
                    this.next = stack[stack.length - 1];
                } else {
                    this.next = stack.length > 1 ? stack[stack.length - 1] : stack.pop();
                }
                return params.token;
            }
        };
    };

}).call(CsoundPreprocessorHighlightRules.prototype);

exports.CsoundPreprocessorHighlightRules = CsoundPreprocessorHighlightRules;
});
