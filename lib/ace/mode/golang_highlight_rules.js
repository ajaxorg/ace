define(function(require, exports, module) {
    var oop = require("../lib/oop");
    var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var GolangHighlightRules = function() {
        var keywords = (
            "true|else|false|break|case|return|goto|if|const|" +
            "continue|struct|default|switch|for|" +
            "func|import|package|chan|defer|fallthrough|go|interface|map|range" +
            "select|type|var"
        );
        var buildinConstants = ("nil|true|false|iota");

        var keywordMapper = this.createKeywordMapper({
            "variable.language": "this",
            "keyword": keywords,
            "constant.language": buildinConstants
        }, "identifier");

        this.$rules = {
            "start" : [
                {
                    token : "comment",
                    regex : "\\/\\/.*$"
                },
                DocCommentHighlightRules.getStartRule("doc-start"),
                {
                    token : "comment", // multi line comment
                    regex : "\\/\\*",
                    next : "comment"
                }, {
                    token : "string", // single line
                    regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                }, {
                    token : "string", // multi line string start
                    regex : '["].*\\\\$',
                    next : "qqstring"
                }, {
                    token : "string", // single line
                    regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
                }, {
                    token : "string", // multi line string start
                    regex : "['].*\\\\$",
                    next : "qstring"
                }, {
                    token : "constant.numeric", // hex
                    regex : "0[xX][0-9a-fA-F]+\\b"
                }, {
                    token : "constant.numeric", // float
                    regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
                }, {
                    token : "constant", // <CONSTANT>
                    regex : "<[a-zA-Z0-9.]+>"
                }, {
                    token : "keyword", // pre-compiler directivs
                    regex : "(?:#include|#pragma|#line|#define|#undef|#ifdef|#else|#elif|#endif|#ifndef)"
                }, {
                    token : keywordMapper,
                    regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
                }, {
                    token : "keyword.operator",
                    regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|new|delete|typeof|void)"
                }, {
                    token : "punctuation.operator",
                    regex : "\\?|\\:|\\,|\\;|\\."
                }, {
                    token : "paren.lparen",
                    regex : "[[({]"
                }, {
                    token : "paren.rparen",
                    regex : "[\\])}]"
                }, {
                    token : "text",
                    regex : "\\s+"
                }
            ],
            "comment" : [
                {
                    token : "comment", // closing comment
                    regex : ".*?\\*\\/",
                    next : "start"
                }, {
                    token : "comment", // comment spanning whole line
                    regex : ".+"
                }
            ],
            "qqstring" : [
                {
                    token : "string",
                    regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
                    next : "start"
                }, {
                    token : "string",
                    regex : '.+'
                }
            ],
            "qstring" : [
                {
                    token : "string",
                    regex : "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
                    next : "start"
                }, {
                    token : "string",
                    regex : '.+'
                }
            ]
        };

        this.embedRules(DocCommentHighlightRules, "doc-",
            [ DocCommentHighlightRules.getEndRule("start") ]);
    }
    oop.inherits(GolangHighlightRules, TextHighlightRules);

    exports.GolangHighlightRules = GolangHighlightRules;
});
