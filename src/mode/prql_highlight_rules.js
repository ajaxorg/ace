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
       "support.function": builtinFunctions,
       "support.type": builtinTypes,
       "constant.language": "true|false|null",
       "keyword": "let|into|case|prql|type|module|internal"
    }, "identifier");
    
    var escapeRe = /\\(\d+|['"\\&trnbvf]|u[0-9a-fA-F]{4})/;
    var identifierRe = /[A-Za-z_][a-z_A-Z0-9]/.source;

    this.$rules = {
        start: [{
            token: "string.start",
            regex: '"',
            next: "string"
        }, {
            token: "string.character",
            regex: "'(?:" + escapeRe.source + "|.)'?"
        }, {
            regex: /0(?:[xX][0-9A-Fa-f]+|[oO][0-7]+)|\d+(\.\d+)?([eE][-+]?\d*)?/,
            token: "constant.numeric"
        }, {
            token: "comment",
            regex: "#.*"
        }, {
            token : "keyword",
            regex : /\.\.|\||:|=|\\|"|->|<-/
        }, {
            token : "keyword.operator",
            regex : /[-!#$%&*+.\/<=>?@\\^|~:]+/
        }, {
            token : "operator.punctuation",
            regex : /[,`]/
        }, {
            token : "constant.language",
            regex : "^" + identifierRe + "*"
        }, {
            token : keywordMapper,
            regex : "[\\w\\xff-\\u218e\\u2455-\\uffff]+\\b"
        }, {
            token: "paren.lparen",
            regex: /[\[({]/ 
        }, {
            token: "paren.rparen",
            regex: /[\])}]/
        } ],
        string: [{
            token: "constant.language.escape",
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
        }]
    };
    
    this.normalizeRules();
};

oop.inherits(PrqlHighlightRules, TextHighlightRules);

exports.PrqlHighlightRules = PrqlHighlightRules;
