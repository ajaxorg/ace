"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var SchemeHighlightRules = function() {
    var keywordControl = "case|do|let|loop|if|else|when";
    var keywordOperator = "eq?|eqv?|equal?|and|or|not|null?";
    var constantLanguage = "#t|#f";
    var supportFunctions = "cons|car|cdr|cond|lambda|lambda*|syntax-rules|format|set!|quote|eval|append|list|list?|member?|load";

    var keywordMapper = this.createKeywordMapper({
        "keyword.control": keywordControl,
        "keyword.operator": keywordOperator,
        "constant.language": constantLanguage,
        "support.function": supportFunctions
    }, "identifier", true);

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = 
        {
    "start": [
        {
            token : "comment",
            regex : ";.*$"
        },
        {
            "token": ["storage.type.function-type.scheme", "text", "entity.name.function.scheme"],
            "regex": "(?:\\b(?:(define|define-syntax|define-macro))\\b)(\\s+)((?:\\w|\\-|\\!|\\?)*)"
        },
        {
            "token": "punctuation.definition.constant.character.scheme",
            "regex": "#:\\S+"
        },
        {
            "token": ["punctuation.definition.variable.scheme", "variable.other.global.scheme", "punctuation.definition.variable.scheme"],
            "regex": "(\\*)(\\S*)(\\*)"
        },
        {
            "token" : "constant.numeric", // hex
            "regex" : "#[xXoObB][0-9a-fA-F]+"
        }, 
        {
            "token" : "constant.numeric", // float
            "regex" : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?"
        },
        {
                "token" : keywordMapper,
                "regex" : "[a-zA-Z_#][a-zA-Z0-9_\\-\\?\\!\\*]*"
        },
        {
            "token" : "string",
            "regex" : '"(?=.)',
            "next"  : "qqstring"
        }
    ],
    "qqstring": [
        {
            "token": "constant.character.escape.scheme",
            "regex": "\\\\."
        },
        {
            "token" : "string",
            "regex" : '[^"\\\\]+',
            "merge" : true
        }, {
            "token" : "string",
            "regex" : "\\\\$",
            "next"  : "qqstring",
            "merge" : true
        }, {
            "token" : "string",
            "regex" : '"|$',
            "next"  : "start",
            "merge" : true
        }
    ]
};

};

oop.inherits(SchemeHighlightRules, TextHighlightRules);

exports.SchemeHighlightRules = SchemeHighlightRules;
