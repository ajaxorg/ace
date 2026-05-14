"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var KNOWN_FUNCTIONS =
    "after|before|boost|coalesce|count|dateTime|defined|identity|length|lower|now|order|path|references|round|score|select|string|upper";

var KEYWORD_OPERATORS = "in|match|asc|desc";

var GroqHighlightRules = function() {
    this.$rules = {
        "start": [
            {
                token : "comment.line",
                regex : /\/\/.*$/
            }, {
                token : "string.quoted.double",
                regex : /"/,
                next  : "string_double"
            }, {
                token : "string.quoted.single",
                regex : /'/,
                next  : "string_single"
            }, {
                token : "constant.numeric",
                regex : /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?(?!\w)/
            }, {
                token : "constant.language",
                regex : /\b(?:true|false|null)\b/
            }, {
                token : "keyword.control",
                regex : new RegExp("\\b(?:" + KEYWORD_OPERATORS + ")\\b")
            }, {
                token : ["entity.name.tag", "punctuation.namespace", "support.function"],
                regex : /(\b[a-zA-Z_]\w*)(::)([a-zA-Z_]\w*(?=\s*\())/
            }, {
                token : "support.function",
                regex : new RegExp("\\b(?:" + KNOWN_FUNCTIONS + ")\\b(?=\\s*\\()")
            }, {
                token : "variable",
                regex : /\$[a-zA-Z_]\w*/
            }, {
                token : "variable.language",
                regex : /@|\^+/
            }, {
                token : "constant.language.wildcard",
                regex : /\*(?=\s*[\[{|)\],}]|\s*$)/
            }, {
                token : "keyword.operator.spread",
                regex : /\.\.\./
            }, {
                token : "keyword.operator.dereference",
                regex : /->/
            }, {
                token : "keyword.operator.range",
                regex : /\.\.(?!\.)/
            }, {
                token : "keyword.operator.pipe",
                regex : /\|(?!\|)/
            }, {
                token : "keyword.operator.arrow",
                regex : /=>/
            }, {
                token : "keyword.operator",
                regex : /[!=<>]=|&&|\|\||[!+\-*/%]|\*\*/
            }, {
                token : "punctuation.accessor",
                regex : /\.(?!\.)/
            }, {
                token : "paren.lparen",
                regex : /[\[{(]/
            }, {
                token : "paren.rparen",
                regex : /[\]})]/
            }, {
                token : "punctuation",
                regex : /[,:;]/
            }, {
                token : "identifier",
                regex : /[a-zA-Z_]\w*/
            }
        ],

        "string_double": [
            {
                token : "constant.character.escape",
                regex : /\\(?:[\\/"'bfnrt]|u[0-9a-fA-F]{4}|u\{[0-9a-fA-F]+\})/
            }, {
                token : "string.quoted.double",
                regex : /"/,
                next  : "start"
            }, {
                defaultToken : "string.quoted.double"
            }
        ],

        "string_single": [
            {
                token : "constant.character.escape",
                regex : /\\(?:[\\/"'bfnrt]|u[0-9a-fA-F]{4}|u\{[0-9a-fA-F]+\})/
            }, {
                token : "string.quoted.single",
                regex : /'/,
                next  : "start"
            }, {
                defaultToken : "string.quoted.single"
            }
        ]
    };

    this.normalizeRules();
};

oop.inherits(GroqHighlightRules, TextHighlightRules);

exports.GroqHighlightRules = GroqHighlightRules;
