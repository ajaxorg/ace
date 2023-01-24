"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var JexlHighlightRules = function () {

    var keywords = "return|var|function|and|or|not|if|for|while|do|continue|break";
    var buildinConstants = "null";
    var supportFunc = "empty|size|new";

    var keywordMapper = this.createKeywordMapper({
        "keyword": keywords,
        "constant.language": buildinConstants,
        "support.function": supportFunc
    }, "identifier");

    var escapedRe = "\\\\(?:x[0-9a-fA-F]{2}|" + // hex
        "u[0-9a-fA-F]{4}|" + // unicode
        "u{[0-9a-fA-F]{1,6}}|" + // es6 unicode
        "|.)";

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start": [
            {
                token: "comment",
                regex: "\\/\\/.*$"
            }, {
                token: "comment",
                regex: "##.*$"
            }, {
                token: "comment", // multi line comment
                regex: "\\/\\*",
                next: "comment"
            }, {
                token: ["comment", "text"],
                regex: "(#pragma)(\\s.*$)"
            }, {
                token: "string", // single line
                regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token: "string", // single line
                regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token: "string", // multi line string
                regex: "`",
                push: [
                    {
                        token: "constant.language.escape",
                        regex: escapedRe
                    }, {
                        token: "string",
                        regex: "`",
                        next: "pop"
                    }, {
                        token: "lparen", //interpolation
                        regex: "\\${",
                        push: [
                            {
                                token: "rparen",
                                regex: "}",
                                next: "pop"
                            }, {
                                include: "start"
                            }
                        ]
                    }, {
                        defaultToken: "string"
                    }
                ]
            }, {
                token: "constant.numeric", // hex
                regex: /0(?:[xX][0-9a-fA-F][0-9a-fA-F_]*|[bB][01][01_]*)[LlSsDdFfYy]?\b/
            }, {
                token: "constant.numeric", // float
                regex: /[+-]?\d[\d_]*(?:(?:\.[\d_]*)?(?:[eE][+-]?[\d_]+)?)?[LlSsDdFfYy]?\b/
            }, {
                token: "constant.language.boolean",
                regex: "(?:true|false)\\b"
            }, {
                token: "string.regexp",
                regex: "~/",
                push: [
                    {
                        token: "constant.language.escape",
                        regex: "\\\\/"
                    }, {
                        token: "string.regexp",
                        regex: "$|/",
                        next: "pop"
                    }, {
                        defaultToken: "string.regexp"
                    }
                ]
            }, {
                token: keywordMapper,
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token: "keyword.operator",
                regex: "&&|\\|\\||!|&|\\||\\^|~|\\?|:|\\?\\?|==|!=|<|<=|>|>=|=~|!~|=\\^|=\\$|!\\$|\\+|\\-|\\*|%|\\/|="
            }, {
                token: "lparen",
                regex: "[[({]"
            }, {
                token: "rparen",
                regex: "[\\])}]"
            }, {
                token: "text",
                regex: "\\s+"
            }, {
                token: "punctuation",
                regex: "[,.]"
            }, {
                token: "storage.type.annotation",
                regex: "@[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }
        ],
        "comment": [
            {
                token: "comment",
                regex: "\\*\\/",
                next: "start"
            }, {
                defaultToken: "comment"
            }
        ]
    };


    this.normalizeRules();
};

oop.inherits(JexlHighlightRules, TextHighlightRules);

exports.JexlHighlightRules = JexlHighlightRules;
