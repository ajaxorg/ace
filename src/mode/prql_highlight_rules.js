// https://prql-lang.org/
// https://github.com/PRQL/prql

"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var PrqlHighlightRules = function() {
    var builtinFunctions = "min|max|sum|average|stddev|every|any|concat_array|count|" +
    "lag|lead|first|last|rank|rank_dense|row_number|" +
    "round|as|in|" +
    "tuple_every|tuple_map|tuple_zip|_eq|_is_null|" +
    "from_text|" +
    "lower|upper|" +
    "read_parquet|read_csv";

    var builtinTypes = [
        "bool",
        "int",
        "int8",
        "int16",
        "int32",
        "int64",
        "float",
        "text",
        "set"].join("|");

    var keywordMapper = this.createKeywordMapper({
       "constant.language": "null",
       "constant.language.boolean": "true|false",
       "keyword": "let|into|case|prql|type|module|internal",
       "storage.type": "let|func",
       "support.function": builtinFunctions,
       "support.type": builtinTypes
    }, "identifier");
    
    var escapeRe = /\\(\d+|['"\\&bfnrt]|u[0-9a-fA-F]{4})/;
    var identifierRe = /[A-Za-z_][a-z_A-Z0-9]/.source;
    var bidi = "[\\u202A\\u202B\\u202D\\u202E\\u2066\\u2067\\u2068\\u202C\\u2069]";

    this.$rules = {
        start: [
        {
            token: "string.start",
            regex: 's?"',
            next: "string"
        }, {
            token: "string.start",
            regex: 'f"',
            next: "fstring"
        }, {
            token: "string.start",
            regex: 'r"',
            next: "rstring"
        }, {
            token: "string",
            start: "'",
            end: "'"
        }, {
            token: "string.character",
            regex: "'(?:" + escapeRe.source + "|.)'?"
        }, {
            token: "constant.language",
            regex: "^" + identifierRe + "*"
        }, {
            token: "constant.numeric", // hexadecimal, octal and binary
            regex: /0(?:[xX][0-9a-fA-F]+|[oO][0-7]+|[bB][01]+)\b/
        }, {
            token: "constant.numeric", // decimal integers and floats
            regex: /(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/
        }, {
            token: "comment.block",
            regex: "#!.*"
        }, {
            token: "comment.line",
            regex: "#.*"
        }, {
            token: "keyword.operator",
            regex: /\|\s*/,
            next: "pipe"
        }, {
            token: "keyword.operator",
            regex: /->|=>|==|!=|>=|<=|~=|&&|\|\||\?\?|\/\/|@/
        }, {
            token: "invalid.illegal",
            regex: bidi
        }, {
            token: "punctuation.operator",
            regex: /[,`]/
        }, {
            token: keywordMapper,
            regex: "[\\w\\xff-\\u218e\\u2455-\\uffff]+\\b"
        }, {
            token: "paren.lparen",
            regex: /[\[({]/
        }, {
            token: "paren.rparen",
            regex: /[\])}]/
        } ],
        pipe: [{
            token: "constant.language",
            regex: identifierRe + "*",
            next: "pop"
        },{
            token: "error",
            regex: "",
            next: "pop"
        }],
        string: [{
            token: "constant.character.escape",
            regex: escapeRe
        }, {
            token: "text",
            regex: /\\(\s|$)/,
            next: "stringGap"
        }, {
            token: "string.end",
            regex: '"',
            next: "start"
        }, {
            token: "invalid.illegal",
            regex: bidi
        }, {
            defaultToken: "string"
        }],
        stringGap: [{
            token: "text",
            regex: /\\/,
            next: "string"
        }, {
            token: "error",
            regex: "",
            next: "start"
        }],
        fstring: [{
            token: "constant.character.escape",
            regex: escapeRe
        }, {
            token: "string.end",
            regex: '"',
            next: "start"
        }, {
            token: "invalid.illegal",
            regex: bidi
        }, {
            token: "paren.lparen",
            regex: "{",
            push: "fstringParenRules"
        }, {
            token: "invalid.illegal",
            regex: bidi
        }, {
            defaultToken: "string"
        }],
        fstringParenRules: [{
            token: "constant.language",
            regex: "^" + identifierRe + "*"
        }, {
            token: "paren.rparen",
            regex: "}",
            next: "pop"
        }],
        rstring: [{
            token: "string.end",
            regex: '"',
            next: "start"
        }, {
            token: "invalid.illegal",
            regex: bidi
        }, {
            defaultToken: "string"
        }]
    };
    
    this.normalizeRules();
};

oop.inherits(PrqlHighlightRules, TextHighlightRules);

exports.PrqlHighlightRules = PrqlHighlightRules;
