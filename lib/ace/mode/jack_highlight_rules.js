"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var JackHighlightRules = function() {

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used
    this.$rules = {
        "start" : [
            {
                token : "string",
                regex : '"',
                next  : "string2"
            }, {
                token : "string",
                regex : "'",
                next  : "string1"
            }, {
                token : "constant.numeric", // hex
                regex: "-?0[xX][0-9a-fA-F]+\\b"
            }, {
                token : "constant.numeric", // float
                regex : "(?:0|[-+]?[1-9][0-9]*)\\b"
            }, {
                token : "constant.binary",
                regex : "<[0-9A-Fa-f][0-9A-Fa-f](\\s+[0-9A-Fa-f][0-9A-Fa-f])*>"
            }, {
                token : "constant.language.boolean",
                regex : "(?:true|false)\\b"
            }, {
                token : "constant.language.null",
                regex : "null\\b"
            }, {
                token : "storage.type",
                regex: "(?:Integer|Boolean|Null|String|Buffer|Tuple|List|Object|Function|Coroutine|Form)\\b"
            }, {
                token : "keyword",
                regex : "(?:return|abort|vars|for|delete|in|is|escape|exec|split|and|if|elif|else|while)\\b"
            }, {
                token : "language.builtin",
                regex : "(?:lines|source|parse|read-stream|interval|substr|parseint|write|print|range|rand|inspect|bind|i-values|i-pairs|i-map|i-filter|i-chunk|i-all\\?|i-any\\?|i-collect|i-zip|i-merge|i-each)\\b"
            }, {
                token : "comment",
                regex : "--.*$"
            }, {
                token : "paren.lparen",
                regex : "[[({]"
            }, {
                token : "paren.rparen",
                regex : "[\\])}]"
            }, {
                token : "storage.form",
                regex : "@[a-z]+"
            }, {
                token : "constant.other.symbol",
                regex : ':+[a-zA-Z_]([-]?[a-zA-Z0-9_])*[?!]?'
            }, {
                token : "variable",
                regex : '[a-zA-Z_]([-]?[a-zA-Z0-9_])*[?!]?'
            }, {
                token : "keyword.operator",
                regex : "\\|\\||\\^\\^|&&|!=|==|<=|<|>=|>|\\+|-|\\*|\\/|\\^|\\%|\\#|\\!"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "string1" : [
            {
                token : "constant.language.escape",
                regex : /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|['"\\\/bfnrt])/
            }, {
                token : "string",
                regex : "[^'\\\\]+"
            }, {
                token : "string",
                regex : "'",
                next  : "start"
            }, {
                token : "string",
                regex : "",
                next  : "start"
            }
        ],
        "string2" : [
            {
                token : "constant.language.escape",
                regex : /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|['"\\\/bfnrt])/
            }, {
                token : "string",
                regex : '[^"\\\\]+'
            }, {
                token : "string",
                regex : '"',
                next  : "start"
            }, {
                token : "string",
                regex : "",
                next  : "start"
            }
        ]
    };
    
};

oop.inherits(JackHighlightRules, TextHighlightRules);

exports.JackHighlightRules = JackHighlightRules;
